import { Component, OnInit } from '@angular/core';
import { BredService } from '../layout/bread.service';
import { IpService } from './ipaddress.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { RxwebValidators,IpVersion } from '@rxweb/reactive-form-validators';


declare const Swal: any;
declare const bootstrap:any;

@Component({
  selector: 'app-ipaddress',
  templateUrl: './ipaddress.component.html',
  styleUrls: ['./ipaddress.component.css']
})
export class IpaddressComponent implements OnInit{
  registerForm!: FormGroup;
  isEdit = false
  models={} as any;
  firmwareFileName: string = '';
  selectedFile: File | null = null;
  successMessage!: string | undefined;

  constructor(private fb: FormBuilder,private bredService: BredService, private ipService: IpService) { }
  
  ngOnInit(): void{
    this.initializeForm();
    this.getIpInfo()
    this.bredService.title.next({
      icon: "microchip",
      // text: "Sensors"
      text: "IP Address"
  
    })
    this.models["firmwareUpdate"] = bootstrap.Modal.getOrCreateInstance(document.getElementById("firmwareUpdate"))

  }

  initializeForm() {
    this.registerForm = this.fb.group({
      default_ip_address: ['', [Validators.required, this.ipv4Validator]],
      default_subnet_mask: ['', [Validators.required, this.ipv4Validator]],
      default_gateway: ['', [Validators.required, this.ipv4Validator]],
      dhcp_enabled: ['', Validators.required],
      configuration: [null]
    });
  }


  ipv4Validator(control:any) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    if (control.value && !ipv4Regex.test(control.value)) {
      return { invalidIpv4: true };
    }

    return null;
  }
  getIpInfo() {
    this.ipService.getIpAdsress()
      .then((resp) => {
       console.log("resop",resp)
       this.registerForm.patchValue(resp)
       console.log(this.registerForm)
      })
      .catch((err) => {
        console.log("WIFI", err);
      });
  }

  makeEditable(){
    this.isEdit = true
  }

  editCancel(){
    this.isEdit = false
  }

  submitForm() {
    const formData = this.registerForm.value;
    console.log('Form submitted with data:', formData);
   const{default_ip_address,default_gateway,default_subnet_mask}=formData
  
      this.ipService.updateIpSetting(default_ip_address,default_subnet_mask,default_gateway)
      .then((res)=>{
      // this.successMessage = "User password has been updated."
      console.log(res,"upddd")
     
    
      })
      .catch((err) => {
        console.log("WIFI", err);
      });
    
    
    this.isEdit = false;
  }

  restart() {
    this.ipService.systemRestart()
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
        this.ipService.pingSystem(10)
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
        this.ipService.systemFactoryReset()
          .then((res) => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
          })
          .catch((err) => console.log)
      },
    })

  }

  openModel(){
  
    this.models['firmwareUpdate'].show();
    
  }

  
  closeModel(model:string){
    
    // this.models[model].hide()
    if(model === "firmwareUpdate"){
      // this.resetForm.reset();
      this.models['firmwareUpdate'].hide();
    }
   
  }


  // updateFirmware() {
  //   if (this.selectedFile) {
  //   Swal.fire({
  //     title: "System Factory Reset",
  //     text: "Please don't refresh and close this window",
  //     allowOutsideClick: false,
  //     showConfirmButton: false,
  //     didOpen: () => {
       
  //       if (this.selectedFile) {
  //         const formData = new FormData();
  //         formData.append('configuration', this.selectedFile, this.selectedFile.name);
    
  //         this.ipService.updateFirmware(formData)
  //         .then((res) => {
  //           console.log(res,"yyyy")
  //           // Swal.fire({
  //           //   title: "File uploading",
  //           //   text: "Please don't refresh and close this window",
  //           //   allowOutsideClick: false,
  //           //   showConfirmButton: false,
             
  //           // })
  //           // Swal.showLoading()
  //           this.models['firmwareUpdate'].hide();
  //           // this.ipService.pingSystem(3)
  //         })
  //         .catch((err) => console.log(err))
  //     }
  //   }})
  // }
  // }
  updateFirmware() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('configuration', this.selectedFile, this.selectedFile.name);

      this.ipService.updateFirmware(formData)
      .then((res) => {
        console.log(res,"yyyy")
        Swal.fire({
          title: "File uploading",
          text: "Please don't refresh and close this window",
          allowOutsideClick: false,
          showConfirmButton: false,

          didOpen: () => {
            Swal.showLoading()
          },
        })
        this.successMessage = "User has been registered."
        // this.ipService.pingSystem(3)
        setTimeout(() => {
          Swal.close();  // Close the loading indicator
        }, 3000); 
      })
      .catch((err) => {
console.log(err)
      })
      
    }

    this.models['firmwareUpdate'].hide();
  }

  

  handleFileInput(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.firmwareFileName = file ? file.name : '';
  }
  

  
  // updateFirmware(){
  //   this.ipService.updateFirmware(this.firmwareFileName)
  //   .then((res) => {
  //     Swal.fire({
  //       title: "System Restart",
  //       text: "Please don't refresh and close this window",
  //       allowOutsideClick: false,
  //       showConfirmButton: false,
  //       didOpen: () => {
  //         Swal.showLoading()
  //       },
  //     })
  //     this.ipService.pingSystem(10)
  //   })
  //   .catch((err) => {

  //   })
  // }


}
