import React from 'react';

import { ChartsProvider, generateChartsTheme, getTheme, SnackbarProvider } from "@perses-dev/components";
import {
  DataQueriesProvider,
  dynamicImportPluginLoader, PluginModuleResource,
  PluginRegistry,
  TimeRangeProvider
} from "@perses-dev/plugin-system";
import { TimeSeriesChart } from '@perses-dev/panels-plugin';
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DatasourceStoreProvider, TemplateVariableProvider } from "@perses-dev/dashboards";
import prometheusResource from '@perses-dev/prometheus-plugin/plugin.json';
import panelsResource from '@perses-dev/panels-plugin/plugin.json';
import { DashboardResource, GlobalDatasource, ProjectDatasource } from '@perses-dev/core';
import { DatasourceApi } from '@perses-dev/dashboards';
import { TextInput, Button } from '@patternfly/react-core';



const fakeDatasource1: GlobalDatasource = {
  kind: 'GlobalDatasource',
  metadata: { name: 'hello' },
  spec: {
    default: true,
    plugin: {
      kind: 'PrometheusDatasource',
      spec: {
        directUrl: "/api/proxy/plugin/distributed-tracing-plugin/backend"
      },
    },
  },
};

// const fakeDatasource2: GlobalDatasource = {
//   kind: 'GlobalDatasource',
//   metadata: { name: 'hello' },
//   spec: {
//     default: true,
//     plugin: {
//       kind: 'PrometheusDatasource',
//       spec: {
//         directUrl: "https://prometheus.demo.do.prometheus.io"
//       },
//     },
//   },
// };

// const fakeDatasource3: GlobalDatasource = {
//   kind: 'GlobalDatasource',
//   metadata: { name: 'hello' },
//   spec: {
//     default: true,
//     plugin: {
//       kind: 'PrometheusDatasource',
//       spec: {
//         proxy: {
//           kind: 'HTTPProxy', 
//           spec: {
//             url: 'https://prometheus.demo.do.prometheus.io'
//           }
//         }
//       },
//     },
//   },
// };

const fakeDatasource = fakeDatasource1


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
export const fakeDashboard = { kind: 'Dashboard', metadata: {}, spec: {} } as DashboardResource;

export default function EmbeddedPanel() {
  // const [query, setQuery] = React.useState('up{job="prometheus"}');
  const [value, setValue] = React.useState('up');

  const ref = React.useRef<HTMLInputElement>(null);

  const muiTheme = getTheme('light');
  const chartsTheme = generateChartsTheme(muiTheme, {});
  const pluginLoader = dynamicImportPluginLoader([
    {
      resource: prometheusResource as PluginModuleResource,
      importPlugin: () => import('@perses-dev/prometheus-plugin'),
    },
    {
      resource: panelsResource as PluginModuleResource,
      importPlugin: () => import('@perses-dev/panels-plugin'),
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
        <SnackbarProvider anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="default" content="">
          <PluginRegistry
            pluginLoader={pluginLoader}
            defaultPluginKinds={{
              Panel: 'TimeSeriesChart',
              TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
            }}
          >
            <QueryClientProvider client={queryClient}>
              <TimeRangeProvider refreshInterval="0s" timeRange={{ pastDuration: '30m' }}>
                <TemplateVariableProvider>
                  <DatasourceStoreProvider dashboardResource={fakeDashboard} datasourceApi={fakeDatasourceApi}>
                    <DataQueriesProvider
                      definitions={[
                        {
                          kind: 'PrometheusTimeSeriesQuery',
                          spec: { query: 'up'},
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
                      <TextInput
                        ref={ref}
                        // value={value}
                        type="text"
                        // onChange={(_event, value) => setValue(value.currentTarget.value)}
                        aria-label="text input example"
                      />
                      <Button variant="primary" onClick={()=>{
                        setValue(ref.current.value)
                        console.log("ref.current.value: ", ref.current.value)
                        console.log('value: ', value)
                        }}>Submit</Button>
                    </DataQueriesProvider>
                  </DatasourceStoreProvider>
                </TemplateVariableProvider>
              </TimeRangeProvider>
            </QueryClientProvider>
          </PluginRegistry>
        </SnackbarProvider>
      </ChartsProvider>
    </ThemeProvider>
  );
}


