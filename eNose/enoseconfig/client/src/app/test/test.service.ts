import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { ipAddress } from "../models/ipAddress";

@Injectable({
    providedIn: "root"
})
export class TestService{
    constructor(private http: HttpClient){}

    getSystemConfig(){
        return new Promise<ipAddress>((resolve, reject)=>{
            this.http.get<ipAddress>(ENDPOINTS.SYSTEM_CONFIG)
            .subscribe(
                (data)=>{
                    resolve(data)
                },
                (err)=>{
                    reject(err)
                }
            )
        })
    }

    saveSystemConfig(data:any){
        return new Promise<ipAddress>((resolve, reject)=>{
            this.http.post<ipAddress>(ENDPOINTS.SYSTEM_CONFIG,data)
            .subscribe(
                (data)=>{
                    resolve(data)
                },
                (err)=>{
                    reject(err)
                }
            )
        })
    }

    systemRestart(){
        return new Promise((resolve, reject)=>{
            this.http.get(ENDPOINTS.SYSTEM_RESTART)
            .subscribe(
                (data)=>{
                    resolve(data)
                },
                (err)=>{
                    reject(err)
                }
            )
        })
    }

    systemFactoryReset(){
        return new Promise((resolve, reject)=>{
            this.http.get(ENDPOINTS.SYSTEM_FACTORY_RESET)
            .subscribe(
                (data)=>{
                    resolve(data)
                },
                (err)=>{
                    reject(err)
                }
            )
        })
    }

    pingSystem(interval:number=0){
        if(interval === 0){
           return this._pingSystem()
        }else{
        setInterval(()=>{
                this._pingSystem()
                .then((res:any)=>{
                    if(res?.message === "pong"){
                        window.location.reload()
                    }
                }).catch((err)=>console.log)
            },interval*1000)
        }
        return false
    }

    _pingSystem(){
        return new Promise((resolve, reject)=>{
            this.http.get(ENDPOINTS.PING)
            .subscribe(
                (data)=>{
                    resolve(data)
                },
                (err)=>{
                    reject(err)
                }
            )
        })
    }
}