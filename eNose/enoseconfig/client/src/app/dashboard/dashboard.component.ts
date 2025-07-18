import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { default as Annotation } from 'chartjs-plugin-annotation';

import * as moment from "moment";
import { CHART_COLORS } from '../config';
import { ActivatedRoute } from '@angular/router';
import { ChartService } from './chart.service';
import { ChartInterface, SensorChart, SensorData } from '../models/sensor';
import { SensorType } from '../models/type';
import { BredService } from '../layout/bread.service';
import { LogService } from './log.service';
import { Log } from '../models/log';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  error!: string;
  charts: ChartInterface[] = [];
  humidity = {
    minValue: 0,
    maxValue: 100,
    step: 20,
  }
  gasChart!: ChartInterface;
  temperatureChart!: ChartInterface;
  humidityChart!: ChartInterface;
  logs!: Log[]
  constructor(private activeRoute: ActivatedRoute, private chartService: ChartService, private bredService: BredService, private logService: LogService) {
    Chart.register(Annotation)
  }
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params: any) => {
      this.error = params?.error;
    })
    this.chartService.getSensors().then((sensors) => {
      if (sensors.gas.length) {
        this.createGasChart(sensors.gas)
      }
      if (sensors.other.length) {
        sensors.other.forEach((sensor: SensorChart) => this.createChart(sensor))
      }

    })
    this.logService.getLogs().then((logs) => {
      this.logs = logs
    })
    this.bredService.title.next({
      icon: "home",
      text: "Dashboard"
    })
  }

  createGasChart(sensors: SensorChart[], chartIndex: number | undefined = undefined, duration = "L") {
    const chart: ChartInterface = {
      name: "",
      chartId: 0,
      duration,
      type: "bar",
      data: {
        labels: [] as any,
        datasets: [] as any
      }
    }
    const colors = ["#29B2FE", "#FF9F40"]
    let dataSet = {} as any;
    sensors.forEach((sensor, index: number) => {
      sensor.data.forEach((d: any, k: any) => {
        let lable = moment(d.captureTime).format(duration == "W" ? "MMM-DD-YYYY" : "LT");
        if (duration === "L") {
          lable = sensor.sensorName
        }
        if (chart.data.labels) {
          chart.data.labels.push(lable);
        }
        dataSet[sensor.sensorName] = sensor.sensorName in dataSet ? [...dataSet[sensor.sensorName], d.meanValue] : [d.meanValue]
      })
      if (duration !== "L") {
        dataSet = {
          data: [...dataSet[sensor.sensorName]],
          label: sensor.sensorName,
          backgroundColor: colors[index] || undefined
        }
        chart.data.datasets.push(dataSet)
        dataSet = {} as any;
      }
    })
    if (duration === "L") {
      chart.data.datasets.push({
        data: [] as any
      })
      Object.values(dataSet).forEach((dset: any, index: number) => {
        chart.data.datasets[0].data.push(...dset)
        chart.data.datasets[0].backgroundColor = "#29B2FE"
      })
      console.log(chart)
    }
    this.gasChart = chart
  }

  createChart(sensor: SensorChart, chartIndex: number | undefined = undefined, duration = "L") {
    const chart: ChartInterface = {
      name: sensor.sensorName,
      chartId: sensor.sensorId,
      duration,
      type: "gauge",
      data: {
        labels: [] as any,
        datasets: [] as any
      }
    }
    let dataSet = [] as Array<number>;
    let dataSettmp = {} as any;
    let sum = 0
    sensor.data.forEach((d: any, k: any) => {
      dataSet.push(d.minimumValue)
      dataSet.push(d.maximumValue)
      sum = d.minimumValue + d.maximumValue;
      dataSettmp["min"] = d.minimumValue;
      dataSettmp["max"] = d.maximumValue;
    })
    if (sensor.sensorTypeId === SensorType.HUMIDITY) {
      chart.data.labels = ["0-35", "35-60", "60-75", "75-100"]
      const avg = (sum / dataSet.length) || 0;
      const value = ((avg / sum) * 100).toFixed(2)
      chart.data.datasets = [
        {
          needleValue: value,
          valueUnit: "%",
          data: [35, 25, 15, 25],
          backgroundColor: [
            "#FF6384",
            "#29B2FE",
            "#FF9F40",
            "#FF6384"
          ]
        }
      ]
      this.humidityChart = chart
    }
    if (sensor.sensorTypeId === SensorType.TEMPERATURE) {
      chart.data.labels = ["Good", "Avrage", "Bad"]
      const avg = (sum / dataSet.length) || 0;
      const value = ((avg / sum) * 100).toFixed(2)
      if (duration != "L") {
        chart.data.datasets = [
          {
            needleValue: value,
            data: [33.35, 33.35, 33.35],
            backgroundColor: [
              "#29B2FE",
              "#FF9F40",
              "#FF6384"
            ]
          }
        ]
      } else {
        chart.data.labels = [`0-${dataSettmp['min']}`, `${dataSettmp['min']}-${avg}`, `${avg}-${dataSettmp['max']}`]
        chart.data.datasets = [
          {
            needleValue: avg,
            data: [dataSettmp['min'], avg - dataSettmp['min'], dataSettmp['max'] - avg],
            backgroundColor: [
              "#29B2FE",
              "#FF9F40",
              "#FF6384"
            ]
          }
        ]
      }
      this.temperatureChart = chart
    }

  }

  refreshChart(chart: ChartInterface, index: number, duration = "W") {
    this.chartService.getChart(chart.chartId, `duration=${duration}`)
      .then((sensor) => this.createChart(sensor, index, duration))
      .catch((err) => {
        this.error = err
      })
  }

}
