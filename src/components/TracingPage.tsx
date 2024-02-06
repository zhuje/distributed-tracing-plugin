import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Page,
  PageSection,
  Title,
} from '@patternfly/react-core';
import './example.css';

// TODO: Perses v.44.x release will contain the scatterplot. We 
// We need to update all the imports to the offical npm package name 
// @perses-dev. NOT perses-dev (this is just locally linked for now). 
// Linked via `yarn add `<path-to-local-perses-repo>`.

// PersesPage Wrapper 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//import { QueryParamProvider } from "use-query-params";

// Plugin Registry 
// import { PluginRegistry } from 'perses-dev/plugin-system';


// // Define which plugins to use 
import prometheusResource from 'perses-dev/prometheus-plugin/plugin.json';
import panelsResource from 'perses-dev/panels-plugin/plugin.json';
import { PluginModuleResource, PluginLoader, dynamicImportPluginLoader } from 'perses-dev/plugin-system';
import { PluginRegistry } from 'perses-dev/plugin-system';


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
          refetchOnWindowFocus: false 
      } 
  }
});

export default function TracingPage() {
  return (
    <>
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
        <QueryClientProvider client={queryClient}>
          <PluginRegistry 
            pluginLoader={bundledPluginLoader}
            defaultPluginKinds={{
              Panel: 'TimeSeriesChart',
              TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
            }}
          >

          </PluginRegistry>


        </QueryClientProvider>
        </PageSection>
      </Page>
    </>
  );
}
