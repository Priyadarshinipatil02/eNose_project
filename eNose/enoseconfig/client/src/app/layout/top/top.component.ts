import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Title } from 'src/app/models/bredcrumb';
import { User } from 'src/app/models/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../.././user/user.service';
// import { User } from '../models/user';


@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit, OnDestroy { 
  @Input() user!: User 
  @Input() title!: Title 
  dropdown = {} as any;
  signOut!:any;
  registerForm!: FormGroup;
  usernameError!: string | undefined;
  successMessage!: string | undefined;
  resetForm!: FormGroup;
  addNewUser: boolean = false;
  resetUserPassword: boolean = false;
  // user!: User | undefined;
  error!: string;
  models={} as any;
  constructor(private router:Router, private authService:AuthService,private userService: UserService){
    this.signOut = authService.signOut
  }

  showDropdown(event:any, name:string){
    this.dropdown = {} as any;   
    this.dropdown[name] = !this.dropdown[name];
    event.stopPropagation()
  }

  handleClick = ()=>{
    this.dropdown = {} as any;   
  }

  ngOnInit(): void {
    document.addEventListener("click",this.handleClick)
  }

  ngOnDestroy(): void {
    document.removeEventListener("click",this.handleClick)
  } 

  invalidRegister(key: string, checkForm?: string | undefined): string {
    if (checkForm) {
      return this.registerForm.get(key)?.touched && this.registerForm.hasError(checkForm) ? 'is-invalid' : "";
    }
    return this.isValidRegister(key) ? 'is-invalid' : "";
  }
  isValidRegister(key: string): boolean {
    return (!this.registerForm.get(key)?.valid && this.registerForm.get(key)?.touched) || false;
  }
  isErrorRegister(formControl: string, errorKey: string): boolean {
    const errors = this.registerForm.get(formControl)?.errors as any;
    if (errors) {
      return !(this.registerForm.get(formControl)?.valid && this.registerForm.get(formControl)?.touched) && errors[errorKey];
    }
    return false;
  }
  closeModel(model:string){
    console.log(model,"kkk")
    this.models[model].hide()
    if(model === "add_new_user"){
      this.registerForm.reset();
    }
    if(model === "update_view_user"){
      this.resetForm.reset();
      this.resetUserPassword = false;
    }
  }
  cancel() {
    this.error = "";
    // this.user = "";
    this.addNewUser = false;
    this.resetUserPassword = false;
  }
  registerUser(){
    if(this.registerForm.valid){
      const newUser = this.registerForm.value;
      delete newUser.cpassword;
      this.userService.addUser(newUser).then((res)=>{
        this.registerForm.reset();
        this.usernameError = undefined;
        this.cancel()
        this.successMessage = "User has been registered."
        // this.userList()
        this.models['add_new_user'].hide()
      }).catch((err)=>{
        this.registerForm.controls["username"].setErrors({"duplicate":true})
      })
    }
  }

}
