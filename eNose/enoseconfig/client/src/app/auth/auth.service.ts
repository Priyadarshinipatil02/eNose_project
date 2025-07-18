import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ENDPOINTS } from "../config";
import { Store } from '../Store';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { connectedWifi } from '../models/network';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }

  login(data: { username: string, password: string }) {
    return new Promise((resolve, reject) => {
      console.log('data:', data)
      this.http.post(ENDPOINTS.LOGIN, data)
        .subscribe((user) => {
          Store.setItem("isUserLoggedIn", "true");
          Store.setItem("user", JSON.stringify(user));
          resolve(user);
        }, (error) => {
          reject(error);
        })
    });
  }

  signOut(isAutoSignout: boolean = false) {
    Store.clear();
    if (isAutoSignout) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  isLogin(): boolean {
    return (localStorage.getItem('isUserLoggedIn') || "false") === "true";
  }

  getUser(): User {
    const _user = JSON.parse(Store.getItem("user") || "") as User;
    return _user;
  }

  getToken(): string {
    return this.getUser().access_token || "";
  }


}
