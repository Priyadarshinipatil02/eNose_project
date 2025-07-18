import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { ModelData } from "../models/ModelData";
import { Sensor, WifiResponse, wifiPassword} from "../models/sensor";
import { Model } from "../models/Model";

@Injectable({
    providedIn: "root"
})
export class SensorService {
    constructor(private http: HttpClient) { }

    getAllSensors() {
        return new Promise<Sensor[]>((resolve, reject) => {
            this.http.get<Sensor[]>(`${ENDPOINTS.SENSORS}`)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    getAllWifi(): Promise<WifiResponse> {
        return new Promise<WifiResponse>((resolve, reject) => {
          this.http.get<WifiResponse>(`${ENDPOINTS.GETALLWIFI}`)
            .subscribe(
              (res) => resolve(res),
              (err) => reject(err)
            );
        });
      }

      wifiConnection(password: string,bssid:string) {
        return new Promise<wifiPassword>((resolve, reject) => {
            this.http.post<wifiPassword>(`${ENDPOINTS.WIFICONNECT}`, { password,bssid})
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }
      
    wifiDisConnect() {
        return new Promise<wifiPassword>((resolve, reject) => {
            this.http.post<wifiPassword>(`${ENDPOINTS.WIFIDISCONNECT}`,{})
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }
    change_status(sensorId: number, status: string) {
        return new Promise<Sensor>((resolve, reject) => {
            this.http.post<Sensor>(`${ENDPOINTS.CHANGE_SENSOR_STATUS}`, { sensorId, status })
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    calibration_start() {
        return new Promise((resolve, reject) => {
            this.http.get(ENDPOINTS.CALIBRATION_START)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    calibration_cancel() {
        return new Promise((resolve, reject) => {
            this.http.get(ENDPOINTS.CALIBRATION_CANCEL)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    calibration_finished(data: any) {
        return new Promise<ModelData[]>((resolve, reject) => {
            this.http.post<ModelData[]>(ENDPOINTS.CALIBRATION_DATA, data)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    getAllModels() {
        return new Promise<Model[]>((resolve, reject) => {
            this.http.get<Model[]>(`${ENDPOINTS.MODELS}`)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    getAllModelBySensorId(sensorId:number) {
        return new Promise<Model[]>((resolve, reject) => {
            this.http.get<Model[]>(`${ENDPOINTS.MODELS}?sensor_id=${sensorId}`)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    deleteModel(ids: any) {
        return new Promise((resolve, reject) => {
            this.http.get(`${ENDPOINTS.MODEL_DELETE}?ids=${ids.join(',')}`)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }

    updateModel(data:Model){
        return new Promise((resolve, reject) => {
            this.http.post(`${ENDPOINTS.MODEL_UPDATE}`,data)
                .subscribe((res) => resolve(res),
                    (err) => reject(err))
        })
    }
}