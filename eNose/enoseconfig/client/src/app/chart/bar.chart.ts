import { Component, Input, OnInit } from "@angular/core";
import { ChartConfiguration, ChartEvent } from "chart.js";

@Component({
    selector: 'bar-chart',
    template: `<canvas baseChart class="chart"
    [data]="data"
    [options]="chartOptions"
    (chartHover)="chartHovered($event)"
    type="bar"></canvas>`,
})
export class BarChart implements OnInit {
    @Input() data!: ChartConfiguration['data'];
    @Input() showLegend!:boolean
    chartOptions: any = {
        responsive: true,
        scales: {
            x: {},
            y: {
                min: 10
            }
        },
        plugins: {
            legend: {
                display: false,
            }
        }
    };
    ngOnInit(): void {
        this.chartOptions.plugins.legend.display = this.showLegend
    }
    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        //console.log(event, active);
    }
}