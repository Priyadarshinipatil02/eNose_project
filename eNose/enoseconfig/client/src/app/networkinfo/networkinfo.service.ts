import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { ModelData } from "../models/ModelData";
import { WifiResponse, connectedWifi, ipInfo, wifiPassword} from "../models/network";
import { Model } from "../models/Model";

@Injectable({
    providedIn: "root"
})
export class NetworkService {
    constructor(private http: HttpClient) { }

    
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
   
    // getIpAddress(){
    //     return new Promise<ipInfo>((resolve, reject)=>{
    //         this.http.get<ipInfo>(`${ENDPOINTS.GETIP}`)
    //         .subscribe((user)=>{
    //             resolve(user);
    //         },
    //         (error)=>{
    //             reject(error);
    //         })
    //     })
    //   }

    getDynamicWifiIpAddress(){
        return new Promise<ipInfo>((resolve, reject)=>{
            this.http.get<ipInfo>(`${ENDPOINTS.GETDYNAMICWIFIIP}`)
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
      }

    getStaticWifiIpAddress(){
        return new Promise<ipInfo>((resolve, reject)=>{
            this.http.get<ipInfo>(`${ENDPOINTS.GETSTATICWIFIIP}`)
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
      }

      getDynamicEtherIpAddress(){
        return new Promise<ipInfo>((resolve, reject)=>{
            this.http.get<ipInfo>(`${ENDPOINTS.GETDYNAMICETHERIP}`)
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
      }

    getStaticEtherIpAddress(){
        return new Promise<ipInfo>((resolve, reject)=>{
            this.http.get<ipInfo>(`${ENDPOINTS.GETSTATICETHERIP}`)
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
      }
 
    updateStaticEtherIpSetting(ip_address:string, subnet_mask:string, gateway:string){
        return new Promise((resolve, reject)=>{
            this.http.put(ENDPOINTS.EDITSTATICETHERIP,{ip_address, subnet_mask,gateway})
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
    }

    updateDynamicEtherIpSetting(ip_address:string, subnet_mask:string, gateway:string){
        return new Promise((resolve, reject)=>{
            this.http.post(ENDPOINTS.EDITDYNAMICETHERIP,{})
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
    }
  
    connectedWifi(){
        return new Promise<connectedWifi>((resolve, reject)=>{
          this.http.get<connectedWifi>(`${ENDPOINTS.GETCONNECTEDWIFI}`)
          .subscribe((user)=>{
              resolve(user);
          },
          (error)=>{
              reject(error);
          })
      })
      }

      updateStaticWifiIpSetting(ip_address:string, subnet_mask:string, gateway:string){
        return new Promise((resolve, reject)=>{
            this.http.put(ENDPOINTS.EDITSTATICWIFIIP,{ip_address, subnet_mask,gateway})
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
    }

    updateDynamicWifiIpSetting(ip_address:string, subnet_mask:string, gateway:string){
        return new Promise((resolve, reject)=>{
            this.http.post(ENDPOINTS.EDITDYNAMICWIFIIP,{})
            .subscribe((user)=>{
                resolve(user);
            },
            (error)=>{
                reject(error);
            })
        })
    }
}