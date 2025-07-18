import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from './deviceinfo.service';

declare const Swal: any;
declare const bootstrap: any;
@Component({
  selector: 'app-deviceinfo',
  templateUrl: './deviceinfo.component.html',
  styleUrls: ['./deviceinfo.component.css']
})
export class DeviceinfoComponent {


  deviceInfoForm!: FormGroup
  captureSensorDataList: any = [0, 1, 2, 3, 4, 5, 6, 7]
  logRetentionDays: any

  constructor(private deviceService: DeviceService) { }
  restart() {
    this.deviceService.systemRestart()
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
        this.deviceService.pingSystem(10)
      })
      .catch((err) => {

      })
  }



  ngOnInit() {
    this.getSetDevicInfo()
  }

  getSetDevicInfo() {
    this.deviceInfoForm = new FormGroup({
      deviceName: new FormControl("", [Validators.required]),
      firmwareVersion: new FormControl("", [Validators.required]),
      serialNumber: new FormControl("", [Validators.required]),
      timeZone: new FormControl("", [Validators.required]),
      hosturl: new FormControl("", [Validators.required]),
      captureSensorData: new FormControl(1, [Validators.required]),
      upgradeFirmware: new FormControl(1, [Validators.required]),
      demoMode: new FormControl("",),


    })
    this.deviceService.getSystemConfig()
      .then((c: any) => {
        this.deviceInfoForm.patchValue({
          ...c,
          deviceName: c.deviceName,
          firmwareVersion: c.firmwareVersion,
          serialNumber: c.composite_key,
          timeZone: c.raspberry_pi_timezone,
          hosturl: c.base_url,
          //demoMode: [false],//c.demo_mode,
          captureSensorData: c.enable_sensor_data_log
        });
        this.logRetentionDays = c.logRetentionDays;
        this.deviceInfoForm.get('demoMode')?.setValue(c.demo_mode == 1 || c.demo_mode === 'True' ? true : false); // or false
      })
  }



  saveDeviceInfo() {
    let form_data = this.deviceInfoForm.value;
    let x = Number(form_data.captureSensorData);
    form_data.captureSensorData = x > 0 ? 1 : 0;
    form_data.logRetentionDays = x > 0 ? x : this.logRetentionDays;
    this.deviceService.updateDeviceInfo(this.deviceInfoForm.value)
      .then((c: any) => {
        this.deviceInfoForm.patchValue({
          ...c,
          deviceName: c.deviceName,
          firmwareVersion: c.firmwareVersion,
          serialNumber: c.composite_key,
          timeZone: c.raspberry_pi_timezone,
          hosturl: c.base_url,
          captureSensorData: x,
        });
        this.logRetentionDays = c.logRetentionDays
        this.deviceInfoForm.get('demoMode')?.setValue(c.demo_mode == 1 || c.demo_mode === 'True' ? true : false); // or false
      })
  }
}


