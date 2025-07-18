import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ChartConfiguration, ChartEvent } from "chart.js";

@Component({
  selector: 'line-chart',
  template: `<canvas baseChart class="chart"
    [data]="data"
    [options]="lineChartOptions"
    (chartHover)="chartHovered($event)"
    type="line"></canvas>`,
})
export class LineChart {
  @Input() data!: ChartConfiguration['data'];
  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y:
      {
        position: 'left',
      }
    },

    plugins: {
      legend: { display: true }
    }
  };
  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    // console.log(event, active);
  }
}