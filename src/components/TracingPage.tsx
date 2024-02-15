import { Page, PageSection, Title } from '@patternfly/react-core';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './example.css';

// TODO: Perses v.44.x release will contain the scatterplot. We
// We need to update all the imports to the offical npm package name
// @perses-dev. NOT perses-dev (this is just locally linked for now).
// Linked via `yarn add `<path-to-local-perses-repo>`.

// PersesPage Wrapper
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { QueryParamProvider } from "use-query-params";

// Plugin Registry
// import { PluginRegistry } from 'perses-dev/plugin-system';

// // Define which plugins to use
import panelsResource from 'perses-dev/panels-plugin/plugin.json';
import {
  PluginLoader,
  PluginModuleResource,
  PluginRegistry,
  dynamicImportPluginLoader,
} from 'perses-dev/plugin-system';
import prometheusResource from 'perses-dev/prometheus-plugin/plugin.json';
import { QueryParamProvider } from 'use-query-params';
import { WindowHistoryAdapter } from 'use-query-params/adapters/window';
import { ScatterPlot } from './ScatterPlot';
import {
  EChartsTheme,
  PersesChartsTheme,
  ChartsProvider,
} from 'perses-dev/components';

/**
 * A PluginLoader that includes all the "built-in" plugins that are bundled with Perses by default and additional custom plugins
 */
export const bundledPluginLoader: PluginLoader = dynamicImportPluginLoader([
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
    },
  },
});

const echartsTheme: EChartsTheme = {
  version: 1,
  themeName: 'Patternfly',
  color: [
    '#8bc1f7',
    '#519de9',
    '#0066cc',
    '#004b95',
    '#002f5d',
    '#bde2b9',
    '#7cc674',
    '#4cb140',
    '#38812f',
    '#23511e',
    '#a2d9d9',
    '#73c5c5',
    '#009596',
    '#005f60',
    '#003737',
    '#b2b0ea',
    '#8481dd',
    '#5752d1',
    '#3c3d99',
    '#2a265f',
    '#F9E0A2',
    '#F6D173',
    '#F4C145',
    '#F0AB00',
    '#C58C00',
    '#F4B678',
    '#EF9234',
    '#EC7A08',
    '#C46100',
    '#8F4700',
    '#C9190B',
    '#A30000',
    '#7D1007',
    '#470000',
    '#2C0000',
    '#F0F0F0',
    '#D2D2D2',
    '#B8BBBE',
    '#8A8D90',
    '#6A6E73',
  ],
};

const chartsTheme: PersesChartsTheme = {
  container: {
    padding: {
      default: 0,
    },
  },
  echartsTheme: echartsTheme,
  noDataOption: {},
  sparkline: {
    width: 1,
    color: '#000000',
  },
  thresholds: {
    defaultColor: '#000000',
    palette: [],
  },
};

export default function TracingPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
        <HelmetProvider>
          <Helmet>
            <title data-test="distributed-tracing-page-title"> Tracing</title>
          </Helmet>
        </HelmetProvider>
        <Page>
          <PageSection variant="light">
            <Title headingLevel="h1"> Hello, Tracing Plugin! </Title>
          </PageSection>
          <PageSection variant="light">
            <ChartsProvider chartsTheme={chartsTheme}>
              <PluginRegistry
                pluginLoader={bundledPluginLoader}
                defaultPluginKinds={{
                  Panel: 'TimeSeriesChart',
                  TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
                }}
              >
                <ScatterPlot />
              </PluginRegistry>
            </ChartsProvider>
          </PageSection>
        </Page>
      </QueryParamProvider>
    </QueryClientProvider>
  );
}