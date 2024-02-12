import React, { useMemo } from 'react';
import { PluginRegistry } from 'perses-dev/plugin-system';
import {
  getTheme,
  ChartsProvider,
  generateChartsTheme,
  PersesChartsTheme,
} from 'perses-dev/components';
import { bundledPluginLoader } from './PersesPluginRegistry';

type PersesDashboardProps = {
  children: React.ReactNode;
};

export function PersesDashboardProviders({ children }: PersesDashboardProps) {
  const muiTheme = getTheme('light');
  // https://github.com/perses/perses/blob/main/ui/components/src/utils/theme-gen.ts
  const chartsTheme: PersesChartsTheme = useMemo(() => {
    return generateChartsTheme(muiTheme, {});
  }, [muiTheme]);

  return (
    <ChartsProvider chartsTheme={chartsTheme}>
        <PluginRegistry
          pluginLoader={bundledPluginLoader}
          defaultPluginKinds={{
            Panel: 'TimeSeriesChart',
            TimeSeriesQuery: 'PrometheusTimeSeriesQuery',
          }}
        >
          {children}
        </PluginRegistry>
    </ChartsProvider>
  );
}
