import { Component, Input } from "@angular/core";
import { ChartConfiguration, ChartEvent } from "chart.js";

@Component({
    selector: 'pi-chart',
    template: `<canvas baseChart class="chart"
    [data]="data"
    [options]="chartOptions"
    (chartHover)="chartHovered($event)"
    type="pie"></canvas>`,
})
export class PiChart {
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