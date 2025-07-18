import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from "../config";
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserList(){
    return new Promise<User[]>((resolve, reject)=>{
        this.http.get<User[]>(`${ENDPOINTS.USER}`)
        .subscribe((user)=>{
            resolve(user);
        },
        (error)=>{
            reject(error);
        })
    })
  }
  findUser(username:string){
    return new Promise((resolve, reject)=>{
        this.http.get(`${ENDPOINTS.SEARCH_USER}?username=${username}`)
        .subscribe((user)=>{
            resolve(user);
        },
        (error)=>{
            reject(error);
        })
    })
  }

  addUser(data:any){
    return new Promise((resolve, reject)=>{
        this.http.post(ENDPOINTS.SEARCH_USER,{...data})
        .subscribe((user)=>{
            resolve(user);
        },
        (error)=>{
            reject(error);
        })
    })
  }

  updatePassword(password:string, username:string){
    return new Promise((resolve, reject)=>{
        this.http.put(ENDPOINTS.SEARCH_USER,{password, username})
        .subscribe((user)=>{
            resolve(user);
        },
        (error)=>{
            reject(error);
        })
    })
  }

  updatePwd(old_password:string, new_password:string, confirm_password:string){
    return new Promise((resolve, reject)=>{
        this.http.put(ENDPOINTS.UPDATEPWD,{old_password, new_password, confirm_password})
        .subscribe((user)=>{
            resolve(user);
        },
        (error)=>{
            reject(error);
        })
    })
  }

  checkUsername(username:string){
    return new Promise((resolve, reject)=>{
      this.http.get(`${ENDPOINTS.DUPLICATE_USERNAME}?username=${username}`)
      .subscribe((user)=>{
          resolve(user);
      },
      (error)=>{
          reject(error);
      })
  })
  }

  deleteUser(userId:number|undefined){
    return new Promise((resolve, reject)=>{
        this.http.delete(`${ENDPOINTS.SEARCH_USER}?userId=${userId}`)
        .subscribe((message)=>{
            resolve(message);
        },
        (error)=>{
            reject(error);
        })
    })
  }
}
