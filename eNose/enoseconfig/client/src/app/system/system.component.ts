import { Component, OnInit } from '@angular/core';
import { BredService } from '../layout/bread.service';
import { SystemService } from './system.service';
import { System } from '../models/System';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const Swal: any

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  config!: System
  systemConForm!: FormGroup
  isEdit = false

  constructor(private bredService: BredService, private systemService: SystemService) { }

  ngOnInit(): void {
    this.systemConForm = new FormGroup({
      deviceName: new FormControl("", [Validators.required]),
      firmwareVersion: new FormControl("", [Validators.required]),
      serialNumber: new FormControl("", [Validators.required]),
      projectName: new FormControl("", [Validators.required]),
      licenceExpiryDate: new FormControl("", [Validators.required]),
      logRetentionPeriod: new FormControl(1, [Validators.required]),
      sensorDataRetentionPeriod: new FormControl(1, [Validators.required]),
      sensorSamplingRate: new FormControl(1, [Validators.required]),
      temperatureSamplingRate: new FormControl(1, [Validators.required]),
      humiditySamplingRate: new FormControl(1, [Validators.required]),
      fanSpeed: new FormControl(1, [Validators.required]),
      asapHostUrl: new FormControl(""),
      regulatoryInfo: new FormControl("", [Validators.required]),
      deviceTime: new FormControl(""),
    })
    this.systemService.getSystemConfig()
      .then((c) => {
        this.config = c
        this.systemConForm.patchValue({ 
          ...c, 
          serialNumber: c.as_uid, 
          licenceExpiryDate: c.as_validityKey,
          sensorDataRetentionPeriod: c.sensorDataRetention,
          logRetentionPeriod: c.logRetentionDays
         })
      }).catch(err => console.error)
    this.bredService.title.next({
      icon: "cogs",
      text: "System Config"
    })
  }

  testAsap() {
    console.log("asap test start")
  }

  increament(field: string, maxValue: number) {
    const oldvalue = this.systemConForm.value[field] || 1
    let newValue = {} as any
    newValue[field] = oldvalue + 1
    if (oldvalue < maxValue && this.isEdit) {
      this.systemConForm.patchValue({ ...newValue })
    }
  }

  decreament(field: string, minValue: number) {
    const oldvalue = this.systemConForm.value[field] || 1
    let newValue = {} as any
    newValue[field] = oldvalue - 1
    if (oldvalue > minValue && this.isEdit) {
      this.systemConForm.patchValue({ ...newValue })
    }
  }

  restart() {
    this.systemService.systemRestart()
      .then((res) => {
        Swal.fire({
          title: "System Restart",
          text: "Please don't refresh and close this window",
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading()
          },
        })
        this.systemService.pingSystem(10)
      })
      .catch((err) => {

      })
  }

  factoryReset() {
    Swal.fire({
      title: "System Factory Reset",
      text: "Please don't refresh and close this window",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
        this.systemService.systemFactoryReset()
          .then((res) => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
          })
          .catch((err) => console.log)
      },
    })

  }

  makeEditable(){
    this.isEdit = true
  }
  editCancel(){
    this.isEdit = false
  }

  saveSystemConfig(){
    if(this.systemConForm.valid){
      this.systemService.saveSystemConfig(this.systemConForm.value)
      .then((res)=>{
        this.config = res
        this.systemConForm.patchValue({ 
          ...res, 
          serialNumber: res.as_uid, 
          licenceExpiryDate: res.as_validityKey,
          sensorDataRetentionPeriod: res.sensorDataRetention,
          logRetentionPeriod: res.logRetentionDays
         })
        this.isEdit = false
        Swal.fire({
          title:"System config Saved",
          timer: 2000,
          toast: true,
          position: 'top-right'
        })
      })
      .catch((err)=>console.log)      
    }
  }

}
