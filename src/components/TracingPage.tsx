// import React from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { QueryParamProvider } from 'use-query-params';
// import { WindowHistoryAdapter } from 'use-query-params/adapters/window';
// import { dashboardSample } from './SampleData';
// import { useDatasourceApi } from './DataSourceAPI';
// import { ViewDashboard } from './viewDashboardComponents/ViewDashboard';
// import { PersesDashboardProviders } from './PersesDashboardProvider';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// export default function TracingPage() {
//   const datasourceApi = useDatasourceApi();
//   const queryClient = new QueryClient({
//     defaultOptions: {
//       queries: {
//         refetchOnWindowFocus: false,
//         retry: 0,
//       },
//     },
//   });
//   return (
// <PersesDashboardProviders>
//     <QueryClientProvider client={queryClient}>

//       <ViewDashboard
//         dashboardResource={dashboardSample}
//         datasourceApi={datasourceApi}
//         initialVariableIsSticky={false}
//         isReadonly={true}
//       />

//   </QueryClientProvider>
// </PersesDashboardProviders>
//   );
// }

import React from 'react';

import {
  ChartsProvider,
  generateChartsTheme,
  getTheme,
} from 'perses-dev/components';
import {
  DataQueriesProvider,
  dynamicImportPluginLoader,
  PluginModuleResource,
  PluginRegistry,
  TimeRangeProvider,
} from 'perses-dev/plugin-system';
import { TimeSeriesChart } from 'perses-dev/panels-plugin';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DatasourceStoreProvider,
  TemplateVariableProvider,
} from 'perses-dev/dashboards';
import prometheusResource from 'perses-dev/prometheus-plugin/plugin.json';
import panelsResource from 'perses-dev/panels-plugin/plugin.json';
import {
  DashboardResource,
  GlobalDatasource,
  ProjectDatasource,
} from 'perses-dev/core';
import { DatasourceApi } from 'perses-dev/dashboards';


const fakeDatasource: GlobalDatasource = {
  kind: 'GlobalDatasource',
  metadata: { name: 'hello' },
  spec: {
    default: true,
    plugin: {
      kind: 'PrometheusDatasource',
      spec: {
        directUrl: 'https://prometheus.demo.do.prometheus.io',
      },
    },
  },
};

class DatasourceApiImpl implements DatasourceApi {
  getDatasource(): Promise<ProjectDatasource | undefined> {
    return Promise.resolve(undefined);
  }

  getGlobalDatasource(): Promise<GlobalDatasource | undefined> {
    return Promise.resolve(fakeDatasource);
  }

  listDatasources(): Promise<ProjectDatasource[]> {
    return Promise.resolve([]);
  }

  listGlobalDatasources(): Promise<GlobalDatasource[]> {
    return Promise.resolve([fakeDatasource]);
  }

  buildProxyUrl(): string {
    return '/prometheus';
  }
}
export const fakeDatasourceApi = new DatasourceApiImpl();
export const fakeDashboard = {
  kind: 'Dashboard',
  metadata: {},
  spec: {},
} as DashboardResource;

export default function TracingPage() {
  const muiTheme = getTheme('light');
  const chartsTheme = generateChartsTheme(muiTheme, {});
  const pluginLoader = dynamicImportPluginLoader([
    {
      resource: prometheusResource as PluginModuleResource,
      importPlugin: () => import('perses-dev/prometheus-plugin'),
    },
    {
      resource: panelsResource as PluginModuleResource,
      importPlugin: () => import('perses-dev/panels-plugin'),
    },
  ]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  });
  return (
    <ThemeProvider theme={muiTheme}>
      <ChartsProvider chartsTheme={chartsTheme}>
        <QueryClientProvider client={queryClient}>
          <PluginRegistry
            pluginLoader={pluginLoader}
            defaultPluginKinds={{
              Panel: 'TimeSeriesChart',
              TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
            }}
          >
            <TimeRangeProvider
              refreshInterval="0s"
              timeRange={{ pastDuration: '30m' }}
            >
              <TemplateVariableProvider>
                <DatasourceStoreProvider
                  dashboardResource={fakeDashboard}
                  datasourceApi={fakeDatasourceApi}
                >
                  <DataQueriesProvider
                    definitions={[
                      {
                        kind: 'PrometheusTimeSeriesQuery',
                        spec: { query: `up{job="prometheus"}` },
                      },
                    ]}
                  >
                    <TimeSeriesChart.PanelComponent
                      contentDimensions={{
                        width: 1200,
                        height: 400,
                      }}
                      spec={{
                        legend: {
                          position: 'bottom',
                          size: 'medium',
                        },
                      }}
                    />
                  </DataQueriesProvider>
                </DatasourceStoreProvider>
              </TemplateVariableProvider>
            </TimeRangeProvider>
          </PluginRegistry>
        </QueryClientProvider>
      </ChartsProvider>
    </ThemeProvider>
  );
}
