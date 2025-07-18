import { Component, Input } from "@angular/core";
import { ChartConfiguration, ChartEvent } from "chart.js";

@Component({
    selector: 'gauge-chart',
    template: `<canvas baseChart class="chart"
    [data]="data"
    [options]="chartOptions"
    [plugins]="chartPlugins"
    (chartHover)="chartHovered($event)"
    type="doughnut"></canvas>`,
})
export class Gauge2Chart {
    @Input() data!: ChartConfiguration['data'];
    gaugeNeedle = {
        id: "gaugeNeedle",
        afterDraw(chart: any, args: any, options: any) {
            const { ctx, legend, data, chartArea: { top, bottom, left, right, width, height } } = chart;
            const dataset = data.datasets[0];
            const legendItems = legend.legendItems;
            const meta = chart.getDatasetMeta(0).data;
            const cx = width / 2;
            const cy = height / 2;
            meta.forEach((datapoint: any, index: number) => {
                const { x, y } = datapoint.tooltipPosition();
                const leg = legendItems[index];
                ctx.font = "20px Halvitika";
                ctx.textAlign="center"
                ctx.fillStyle = ""//leg.fontColor;
                ctx.fillText(leg.text,x,y)
            })
        },
        afterDatasetDraw(chart: any, args: any, options: any) {
            const { ctx, config, data, chartArea: { top, bottom, left, right, width, height } } = chart;
            ctx.save()
            const valueUnit = data.datasets[0].valueUnit || "°C"
            const needleValue = data.datasets[0].needleValue || 0
            const totalData = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
            const angle = Math.PI + (1 / totalData * needleValue * Math.PI)

            const cx = width / 2
            const cy = chart._metasets[0].data[0].y
            ctx.translate(cx, cy)
            //needle
            ctx.rotate(angle)
            ctx.beginPath();
            ctx.moveTo(0, -2);
            ctx.lineTo(height-20, 0);
            ctx.lineTo(0, 4);
            ctx.fillStyle = "#444";
            ctx.fill()
            ctx.restore()
            // needle Dot
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, 20)
            ctx.fill()
            ctx.restore()
            ctx.save()

            ctx.beginPath();
            ctx.font = "bold 30px Halvitika";
            ctx.textAlign="center"
            ctx.fillStyle="#29B2FE"
            ctx.fillText(`${needleValue}${valueUnit}`,cx,cy)
            ctx.fill()
            ctx.restore()
        }
    }
    chartPlugins: any = [this.gaugeNeedle]
    chartOptions: any = {
        responsive: true,
        maintainAspectRatio:false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip:{
                enabled:false
            }
        },
        cutout: "85%",
        circumference: 180,
        rotation: 270,
        aspectRatio: 1
    };
    public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
        //console.log(event, active);
    }
}