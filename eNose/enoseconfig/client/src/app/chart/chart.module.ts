import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChart } from './chart.line.chart';
import { NgChartsModule } from 'ng2-charts';
import { BarChart } from './bar.chart';
import { PiChart } from './pi.chart';
import { DoughnutChart } from './doughnut.chart';
import { GaugeChart } from './gauge.chart';



@NgModule({
  declarations: [
    LineChart,
    BarChart,
    PiChart,
    DoughnutChart,
    GaugeChart
  ],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports:[
    LineChart,
    BarChart,
    PiChart,
    DoughnutChart,
    GaugeChart
  ]
})
export class ChartModule { }
