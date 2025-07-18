import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { User } from '../models/user';
import { passwordStrengthValidator } from '../validators/password.strength.validator';
import { AlphanumericValidator } from '../validators/alphanumeric.validator';
import { BredService } from '../layout/bread.service';

declare const bootstrap:any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  searchForm!: FormGroup;
  registerForm!: FormGroup;
  resetForm!: FormGroup;
  addNewUser: boolean = false;
  resetUserPassword: boolean = false;
  user!: User | undefined;
  error!: string;
  usernameError!: string | undefined;
  successMessage!: string | undefined;
  users!:User[];
  models={} as any;
  constructor(private userService: UserService, private bredService:BredService) { }
  ngOnInit(): void {
    this.userList()  
    this.searchForm = new FormGroup({
      "username": new FormControl("", [Validators.required, Validators.minLength(3)])
    });
    this.registerForm = new FormGroup({
      "username": new FormControl(this.searchForm.value.username, [Validators.required, Validators.minLength(3), AlphanumericValidator()]),
      "email": new FormControl("", [Validators.required, Validators.email]),
      "userType": new FormControl("2", [Validators.required]),
      "oldPassword": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()]),
      "password": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()]),
      "cpassword": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()])
    }, {
      validators: this.checkPasswords
    });
    this.resetForm = new FormGroup({
      "oldPassword": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()]),
      "password": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()]),
      "cpassword": new FormControl("", [Validators.required, Validators.minLength(8), passwordStrengthValidator()])
    },
    {
      validators: this.checkPasswords
    })

    this.models["add_new_user"] = bootstrap.Modal.getOrCreateInstance(document.getElementById("add_new_user"))
    this.models["update_view_user"] = bootstrap.Modal.getOrCreateInstance(document.getElementById("update_view_user"))

    this.bredService.title.next({
      icon:"users",
      text:"Update Password"
    })
  }

  userList(){
    this.userService.getUserList()
    .then((users)=>{
      this.users = users;

    })
    .catch((err)=>{

    })
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.userService.findUser(this.searchForm.value.username)
        .then((user) => {
          this.user = user as User;
        })
        .catch((err) => {
          this.error = err;
        })
    }
  }


  invalid(key: string): string {
    return this.isValid(key) ? 'is-invalid' : "";
  }

  isValid(key: string): boolean {
    return (!this.searchForm.get(key)?.valid && this.searchForm.get(key)?.touched) || false;
  }

  isError(formControl: string, errorKey: string): boolean {
    const errors = this.searchForm.get(formControl)?.errors as any;
    if (errors) {
      return !(this.searchForm.get(formControl)?.valid && this.searchForm.get(formControl)?.touched) && errors[errorKey];
    }
    return false;
  }

  addUser() {
    this.error = "";
    this.user = {} as User;
    this.addNewUser = true;
    this.resetUserPassword = false;
  }

  reserPassword() {
    this.resetUserPassword = true;
  }

  cancel() {
    this.error = "";
    this.user = undefined;
    this.addNewUser = false;
    this.resetUserPassword = false;
  }


  // invalidRegister(key: string, checkForm?: string | undefined): string {
  //   console.log(key,"lll",checkForm)
  //   if (checkForm) {
  //     return this.registerForm.get(key)?.touched && this.registerForm.hasError(checkForm) ? 'is-invalid' : "";
  //   }
  //   return this.isValidRegister(key) ? 'is-invalid' : "";
  // }

  // isValidRegister(key: string): boolean {
  //   return (!this.registerForm.get(key)?.valid && this.registerForm.get(key)?.touched) || false;
  // }

  // isErrorRegister(formControl: string, errorKey: string): boolean {
  //   console.log(formControl,"lll",errorKey)
  //   const errors = this.registerForm.get(formControl)?.errors as any;
  //   if (errors) {
  //     console.log(errors,"iii")
  //     return !(this.registerForm.get(formControl)?.valid && this.registerForm.get(formControl)?.touched) && errors[errorKey];
  //   }
  //   return false;
  // }

  isErrorRegister(formControl: string, errorKey: string): boolean {
    console.log(formControl,"lll",errorKey)
    const errors = this.resetForm.get(formControl)?.errors as any;
    if (errors) {
      console.log(errors,"iii")
      return !(this.resetForm.get(formControl)?.valid && this.resetForm.get(formControl)?.touched) && errors[errorKey];
    }
    return false;
  }

  invalidRegister(key: string, checkForm?: string | undefined): string {
    console.log(key,"lll",checkForm)
    if (checkForm) {
      return this.resetForm.get(key)?.touched && this.resetForm.hasError(checkForm) ? 'is-invalid' : "";
    }
    return this.isValidRegister(key) ? 'is-invalid' : "";
  }

  isValidRegister(key: string): boolean {
    return (!this.resetForm.get(key)?.valid && this.resetForm.get(key)?.touched) || false;
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
        this.userList()
        this.models['add_new_user'].hide()
      }).catch((err)=>{
        this.registerForm.controls["username"].setErrors({"duplicate":true})
      })
    }
  }


  invalidReset(key: string, checkForm?: string | undefined): string {
    if (checkForm) {
      return this.resetForm.get(key)?.touched && this.resetForm.hasError(checkForm) ? 'is-invalid' : "";
    }
    return this.isValidReset(key) ? 'is-invalid' : "";
  }

  isValidReset(key: string): boolean {
    return (!this.resetForm.get(key)?.valid && this.resetForm.get(key)?.touched) || false;
  }

  isErrorReset(formControl: string, errorKey: string): boolean {
    const errors = this.resetForm.get(formControl)?.errors as any;
    if (errors) {
      return !(this.resetForm.get(formControl)?.valid && this.resetForm.get(formControl)?.touched) && errors[errorKey];
    }
    return false;
  }


  resetPasswordSubmit(){
    if(this.resetForm.valid){
      this.userService.updatePassword(this.resetForm.value.password, (this.user?.userName || ""))
      .then((res)=>{
      this.successMessage = "User password has been updated."
      this.resetForm.reset();
      this.cancel()
      this.models['update_view_user'].hide()
      })
      .catch((err)=>{
        this.error = this.error;
      })
    }
  }

  updatePasswordSubmit(){
    // if(this.resetForm.valid){
      this.userService.updatePwd(this.resetForm.value.oldPassword, this.resetForm.value.password,this.resetForm.value.cpassword)
      .then((res)=>{
        console.log(res,"uuuuu")
      this.successMessage = "User password has been updated."
      this.resetForm.reset();
      // this.cancel()
      // this.models['update_view_user'].hide()
      })
      .catch((err)=>{
        this.error = this.error;
      })
    // }
  }
  

  checkPasswords(group: any) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.cpassword.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  closeModel(model:string){
    
    // this.models[model].hide()
    if(model === "add_new_user"){
      this.resetForm.reset();
    }
    if(model === "update_view_user"){
      this.resetForm.reset();
      this.resetUserPassword = false;
    }
  }

  viewUser(user:User){
    this.user = user;
    this.models['update_view_user'].show();
  }


  deleteUser(){
    this.userService.deleteUser(this.user?.userId)
    .then((message)=>{
      this.successMessage = "User has been deleted."
      this.resetForm.reset();
      this.cancel()
      this.models['update_view_user'].hide()
      this.userList()
    })
    .catch((err)=>{
      console.error(err)
    })
  }

}
