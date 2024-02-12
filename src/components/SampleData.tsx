import { DashboardResource } from 'perses-dev/core';

export const dashboardSample: DashboardResource = {
  kind: 'Dashboard',
  metadata: {
    name: 'Dashboards',
    project: '',
    version: 0,
  },
  spec: {
    datasources: {},
    duration: '30m',
    variables: [],
    panels: {
      Panel1: {
        kind: 'Panel',
        spec: {
          display: { name: 'Up' },
          plugin: {
            kind: 'StatChart', 
            spec: {
              query: {
                kind: 'TimeSeriesQuery',
                spec: {
                  plugin: {
                    kind: 'PrometheusTimeSeriesQuery',
                    spec: {
                      query: 'sum(etcd_server_has_leader{job="etcd"})',
                      series_name_format: '{{job}} {{env}} {{instance}}',
                    },
                  },
                },
              },
              calculation: 'LastNumber',
              unit: { 
                kind: 'Decimal',  
                decimal_places: 0
              },
            },
          },
        },
      }, 
    },
    layouts: [
      {
        kind: 'Grid',
        spec: {
          items: [
            {
              x: 0,
              y: 0,
              width: 4,
              height: 8,
              content: {
                $ref: '#/spec/panels/Panel1',
              },
            },    
          ],
        },
      },

    ],
  },
};
