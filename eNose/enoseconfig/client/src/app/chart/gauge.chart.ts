import { Component, Input, OnInit } from "@angular/core";
declare const zingchart: any
@Component({
    selector: 'gauge-chart',
    template: `<div id='myChart'></div>`,
    styles: [
        `
        #myChart{
            width: 100%;
            height: 300px;
        }
        `
    ]
})
export class GaugeChart implements OnInit {

    @Input() value:number = 0
    @Input()
    scale:any = {}

    ringSize = 50
    ngOnInit(): void {
        let myConfig17: any = {
            type: "gauge",
            globals: {
                fontSize: 25
            },
            plotarea: {
                marginTop: 80
            },
            plot: {
                size: '100%',
                valueBox: {
                    placement: 'center',
                    text: '%v', //default
                    fontSize: 25,
                    rules: [{
                        rule: '%v >= 35 && %v <=75',
                        text: '%v<br>Good'
                    },
                    {
                        rule: '%v < 35 || %v >75',
                        text: '%v<br>Bad'
                    }
                    ]
                }
            },
            tooltip: {
                borderRadius: 5
            },
            scaleR: {
                aperture: 180,
                minValue: 0,
                maxValue: 100,
                step: 20,
                center: {
                    visible: false
                },
                tick: {
                    visible: false
                },
                item: {
                    offsetR: 0,
                    rules: [{
                        rule: '%i == 9',
                        offsetX: 15
                    }]
                },
                ring: {
                    size: 50,
                    rules: [{
                        rule: '%v <= 35 || %v >=75',
                        backgroundColor: '#E53935'
                    },
                    {
                        rule: '%v > 35 && %v < 75',
                        backgroundColor: '#32cd32'
                    }
                    ]
                },
                ...this.scale
            },
            series: [{
                values: [this.value], // starting value
                backgroundColor: 'black',
                indicator: [10,10,10,10,0.75],
                animation: {
                    effect: 2,
                    method: 1,
                    sequence: 4,
                    speed: 900
                },
            }]
        }
        zingchart.render({
            id: 'myChart',
            data: myConfig17,
            height: "100%",
            width: "100%"
        });
    }
    @Input() data!: any;

}