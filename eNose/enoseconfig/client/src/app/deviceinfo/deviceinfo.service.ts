import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { ipAddress, ipInfo } from "../models/ipAddress";
import { DeviceInfo } from "../models/deviceInfo"

@Injectable({
    providedIn: "root"
})
export class DeviceService {
    constructor(private http: HttpClient) { }


    getIpAdsress() {
        return new Promise<ipInfo>((resolve, reject) => {
            this.http.get<ipInfo>(`${ENDPOINTS.GETIP}`)
                .subscribe((user) => {
                    resolve(user);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }

    updateIpSetting(ip_address: string, subnet_mask: string, gateway: string) {
        return new Promise((resolve, reject) => {
            this.http.put(ENDPOINTS.EDITIP, { ip_address, subnet_mask, gateway })
                .subscribe((user) => {
                    resolve(user);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }


    updateFirmware(configuration: FormData) {
        return new Promise((resolve, reject) => {
            this.http.post(ENDPOINTS.UPDATEFIRMWARE, configuration)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }

    getSystemConfig() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.GETDEVICE}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }

    updateDeviceInfo(data: any) {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.post<DeviceInfo>(ENDPOINTS.GETDEVICE, data)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }

    saveSystemConfig(data: any) {
        return new Promise<ipAddress>((resolve, reject) => {
            this.http.post<ipAddress>(ENDPOINTS.SYSTEM_CONFIG, data)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }

    systemRestart() {
        return new Promise((resolve, reject) => {
            this.http.get(ENDPOINTS.SYSTEM_RESTART)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }

    systemFactoryReset() {
        return new Promise((resolve, reject) => {
            this.http.get(ENDPOINTS.SYSTEM_FACTORY_RESET)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }

    pingSystem(interval: number = 0) {
        if (interval === 0) {
            return this._pingSystem()
        } else {
            setInterval(() => {
                this._pingSystem()
                    .then((res: any) => {
                        if (res?.message === "pong") {
                            window.location.reload()
                        }
                    }).catch((err) => console.log)
            }, interval * 1000)
        }
        return false
    }

    _pingSystem() {
        return new Promise((resolve, reject) => {
            this.http.get(ENDPOINTS.PING)
                .subscribe(
                    (data) => {
                        resolve(data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
        })
    }


    getSampleTestResult() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.GETSAMPLETESTRESULT}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }


    getSampleTestResult1() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.GETSAMPLETESTRESULT1}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }

    getSampleTestCount() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.GETSAMPLETESTCOUNT}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }
    sampleStart() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.SAMPLESTART}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }

    sampleReset() {
        return new Promise<DeviceInfo>((resolve, reject) => {
            this.http.get<DeviceInfo>(`${ENDPOINTS.SAMPLERESET}`)
                .subscribe((device) => {
                    resolve(device);
                },
                    (error) => {
                        reject(error);
                    })
        })
    }

}