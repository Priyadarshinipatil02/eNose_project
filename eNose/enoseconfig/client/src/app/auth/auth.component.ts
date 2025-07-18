import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from '../networkinfo/networkinfo.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router,
    private networkServices: NetworkService, private activeRoute: ActivatedRoute) { }
  loginForm!: FormGroup;
  loginError!: string;
  returnUrl: string = "/";
  connectedWifi: string = "";
  connectedWifiResponse: any;
  ngOnInit(): void {

    this.loginForm = new FormGroup({
      "username": new FormControl(null, [Validators.required]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(5)])
    })
    this.activeRoute.queryParams.subscribe((params: any) => {
      this.loginError = params?.error || "";
      this.returnUrl = params?.returnUrl || "/";
    })
  }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     this.authService.login(this.loginForm.value).then((user) => {
  //       this.router.navigateByUrl(this.returnUrl);
  //       this.authService.connectedWifi()
  //     }).catch((err) => {
  //       this.loginError = err;
  //     })
  //   }
  // }

  onSubmit() {
    debugger
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).then((user) => {
        this.router.navigateByUrl(this.returnUrl);
        // this.currentWifi()

      }).catch((err) => {
        this.loginError = err;
      });
    }
  }

  currentWifi() {
    this.networkServices.connectedWifi().then((response) => {
      this.connectedWifiResponse = response;
    }).catch((err) => {
      console.error('Error in connectedWifi():', err);
    });
  }

  invalid(key: string): string {
    return this.isValid(key) ? 'is-invalid' : "";
  }

  isValid(key: string): boolean {
    return (!this.loginForm.get(key)?.valid && this.loginForm.get(key)?.touched) || false;
  }

  isError(formControl: string, errorKey: string): boolean {
    const errors = this.loginForm.get(formControl)?.errors as any;
    if (errors) {
      return !(this.loginForm.get(formControl)?.valid && this.loginForm.get(formControl)?.touched) && errors[errorKey];
    }
    return false;
  }

}
