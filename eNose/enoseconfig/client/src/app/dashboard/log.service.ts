import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ENDPOINTS } from "../config";
import { Log } from "../models/log";

@Injectable({
    providedIn:"root"
})
export class LogService{
    constructor(private http:HttpClient){}
    
    getLogs(type="login"){
        return new Promise<Log[]>((resolve, reject)=>{
            this.http.get<Log[]>(`${ENDPOINTS.LOG}?type=${type}`)
            .subscribe((logs)=>{
                resolve(logs)
            },
            (error)=>{
                reject(error)
            });
        })
    }

}