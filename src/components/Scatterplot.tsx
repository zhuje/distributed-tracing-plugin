// Copyright 2023 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { EChart, useChartsTheme } from '@perses-dev/components';
import { use, EChartsCoreOption } from 'echarts/core';
import { ScatterChart as EChartsScatterChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts';
import { DataZoomComponent } from 'echarts/components';
import { LegendComponent } from 'echarts/components';

// testing use only 
import { BarChart, LineChart } from 'echarts/charts';
import { VisualMapComponent } from 'echarts/components';

import React from 'react';

use([DataZoomComponent, LegendComponent, VisualMapComponent, BarChart, LineChart, EChartsScatterChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

interface ScatterplotProps {
  width: number;
  height: number;
  options: EChartsOption;
}

export function Scatterplot(props: ScatterplotProps) {
  const { width, height, options } = props;
  const chartsTheme = useChartsTheme();

  console.log('SCATTERPLOT OPTIONS: ', options)
  console.log('options.series[0].data', options.series[0].data)
  console.log('SCATTERPLOT CHARTSTHEME: ', chartsTheme)

  // Apache EChart Options Docs: https://echarts.apache.org/en/option.html
  const eChartOptions: EChartsCoreOption = {
    dataset: options.dataset,
    series: options.series,
    grid: {
      bottom: 40,
      top: 50,
      left: 50,
      right: 100,
    },
    xAxis: {
      type: 'time',
      name: 'Local Time',
    },
    yAxis: {
      scale: true,
      type: 'value',
      name: 'Duration',
      axisLabel: {
        formatter: '{value} ms',
      },
    },
    animation: false,
    tooltip: {
      padding: 5,
      borderWidth: 1,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (params: any) {
        // TODO: import type from ECharts instead of using any
        params = params[0];
        return [
          '<b>time</b>: ' + params.data.startTime + '<br/>',
          '<b>duration (miliseconds)</b>: ' + params.data.durationMs + '<br/>',
          '<b>spanCount</b>: ' + params.data.spanCount + '<br/>',
          '<b>errorCount</b>: ' + params.data.errorCount + '<br/>',
          '<b>name</b>: ' + params.data.name + '<br/>',
        ].join('');
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    legend: {
      show: true,
      type: 'scroll',
      orient: 'horizontal',
      bottom: 0,
    },
  };


  // var BasicScatterOption = {
  //   dataset: {
  //     source: [
  //       [12, 323, 11.2],
  //       [23, 167, 8.3],
  //       [81, 284, 12],
  //       [91, 413, 4.1],
  //       [13, 287, 13.5]
  //     ]
  //   },
  //   visualMap: {
  //     show: false,
  //     dimension: 2, // means the 3rd column
  //     min: 2, // lower bound
  //     max: 15, // higher bound
  //     inRange: {
  //       // Size of the bubble.
  //       symbolSize: [5, 60]
  //     }
  //   },
  //   xAxis: {},
  //   yAxis: {},
  //   series: {
  //     type: 'scatter', 
  //     data: [
  //       [12, 323, 11.2],
  //       [23, 167, 8.3],
  //       [81, 284, 12],
  //       [91, 413, 4.1],
  //       [13, 287, 13.5]
  //     ]
  //   }
  // };

  const tempoData = [
    [
      '2024-03-19T17:43:28.916Z',
      679
    ],
    [
      '2024-03-19T17:44:05.029Z',
      495
    ],
    [
      '2024-03-19T17:43:00.848Z',
      453
    ],
  ]

  const basicData = [
    [12, 323, 11.2],
    [23, 167, 8.3],
    [81, 284, 12],
    [91, 413, 4.1],
    [13, 287, 13.5]
  ]

  var BasicScatterOption2 = {
    // visualMap: {
    //   show: false,
    //   dimension: 2, // means the 3rd column
    //   min: 2, // lower bound
    //   max: 15, // higher bound
    //   inRange: {
    //     // Size of the bubble.
    //     symbolSize: [5, 60]
    //   }
    // },
    xAxis: {type: 'time'},
    yAxis: {},
    series: {
      type: 'scatter', 
      data: tempoData
    }
  };


  return (
   
      <EChart
        sx={{
          width: width,
          height: height,
        }}
        option={BasicScatterOption2}
        theme={chartsTheme.echartsTheme}
      />
 
  );
}
