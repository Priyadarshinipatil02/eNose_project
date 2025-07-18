import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { SensorChart, SensorChartType } from "../models/sensor";

@Injectable({
    providedIn:"root"
})
export class ChartService{
    constructor(private http:HttpClient){}
    
    getSensors(query:string="chart=all&duration=L"){
        return new Promise<SensorChartType>((resolve, reject)=>{
            this.http.get<SensorChartType>(`${ENDPOINTS.DASHBOARD_CHART}?${query}`)
            .subscribe((sensors)=>{
                resolve(sensors)
            },
            (error)=>{
                reject(error)
            });
        })
    }

    getChart(chart_id:number,query:string="duration=L"){
        return new Promise<SensorChart>((resolve, reject)=>{
            this.http.get<SensorChart>(`${ENDPOINTS.DASHBOARD_CHART}/${chart_id}?${query}`)
            .subscribe((sensors)=>{
                resolve(sensors)
            },
            (error)=>{
                reject(error)
            });
        })
    }
}