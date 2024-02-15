import { Panel, TemplateVariableProvider } from 'perses-dev/dashboards';
import {
    TimeRangeProvider,
} from 'perses-dev/plugin-system';

export const ScatterPlot = () => {
//   const initialTimeRange = useInitialTimeRange('1h');

  return (
    <TimeRangeProvider timeRange={{pastDuration:'1h'}}>
      <TemplateVariableProvider>
        <Panel
          definition={{
            kind: 'Panel',
            spec: {
              display: {
                name: 'Tracing',
                description: 'Tracing Panel',
              },
              plugin: {
                kind: 'TimeSeriesChart',
                spec: {},
              },
              queries: [
                {
                  kind: 'PrometheusTimeSeriesQuery',
                  spec: {
                    plugin: {
                      kind: 'Prometheus',
                      spec: {},
                    },
                  },
                },
              ],
            },
          }}
        />
      </TemplateVariableProvider>
    </TimeRangeProvider>
  );
};