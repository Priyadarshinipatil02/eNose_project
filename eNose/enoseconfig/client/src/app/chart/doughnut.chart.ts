import { Component, Input } from "@angular/core";
import { ChartConfiguration, ChartEvent } from "chart.js";

@Component({
    selector: 'doughnut-chart',
    template: `<canvas baseChart class="chart"
    [data]="data"
    [options]="chartOptions"
    (chartHover)="chartHovered($event)"
    type="doughnut"></canvas>`,
})
export class DoughnutChart {
    @Input() data!: ChartConfiguration['data'];
    chartOptions: ChartConfiguration['options'] = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    };
    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        //console.log(event, active);
    }
}