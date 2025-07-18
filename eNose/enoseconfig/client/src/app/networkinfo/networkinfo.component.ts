import { Component } from '@angular/core';
import { NetworkService } from './networkinfo.service';
import { WifiResponse } from '../models/network';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-networkinfo',
  templateUrl: './networkinfo.component.html',
  styleUrls: ['./networkinfo.component.css']
})
export class NetworkinfoComponent {
  registerFormWifi!: FormGroup;
  registerFormEther!: FormGroup;
  _WifiResponse!: WifiResponse
  selectedNetwork: string = 'not-connected';
  selectedWifiSwitch: string = 'dynamic';
  selectedEtherSwitch: string = 'dynamic';
  wifiPassword: string = '';
  isPasswordEmpty: boolean = false;
  isConnected: boolean = false;
  isDisConnected: boolean = false;
  connectedWifi: string = "";
  connectedWifiResponse: any;
  isEdit = false
  isEditWifi = false
  originalEtherFormValues = {} as any;
  originalWifiFormValues = {} as any;
  constructor(private fb: FormBuilder, private connectionService: NetworkService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.currentWifi()
    this._getAllWifi()
    this.getEtherIpInfo()
    this.initializeFormWifi();
    this.initializeFormEther()

    // this.getWifiIpInfo()
  }

  currentWifi() {
    this.connectionService.connectedWifi().then((response) => {

      this.connectedWifiResponse = response;

      if (this.connectedWifiResponse.connected_wifi_network !== null &&
        this.connectedWifiResponse.connected_wifi_network !== '') {
        this.selectedNetwork = this.connectedWifiResponse.connected_wifi_network
        this.getWifiIpInfo()
        this.isConnected = false;
        this.isDisConnected = true;

      }

    }).catch((err) => {
      console.error('Error in connectedWifi():', err);
    });
  }

  initializeFormWifi() {

    this.registerFormWifi = this.fb.group({
      default_ip_address: ['', [Validators.required, this.ipv4Validator]],
      default_subnet_mask: ['', [Validators.required, this.ipv4Validator]],
      default_gateway: ['', [Validators.required, this.ipv4Validator]],
      dhcp_enabled: ['', Validators.required],
      configuration: [null]
    });
  }

  initializeFormEther() {

    this.registerFormEther = this.fb.group({
      default_ip_address: ['', [Validators.required, this.ipv4Validator]],
      default_subnet_mask: ['', [Validators.required, this.ipv4Validator]],
      default_gateway: ['', [Validators.required, this.ipv4Validator]],
      dhcp_enabled: ['', Validators.required],
      configuration: [null]
    });
  }


  ipv4Validator(control: any) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (control.value && !ipv4Regex.test(control.value)) {
      return { invalidIpv4: true };
    }

    return null;
  }

  _getAllWifi() {
    this.connectionService.getAllWifi()
      .then((resp) => {
        this._WifiResponse = resp;
      })
      .catch((err) => {
        console.log("WIFI", err);
      });
  }

  selectNetwork(network: string) {
    this.isConnected = true
    this.selectedNetwork = network;
    this.wifiPassword = ""
    this.initializeFormWifi();
  }
  // connectToWifi() {
  //   console.log(this.wifiPassword,"wifiipassword",this.selectedNetwork)

  //   this.connectionService.wifiConnection(this.wifiPassword,this.selectedNetwork)
  //     .then((res) => {
  //       console.log(res)
  //       this.getWifiIpInfo()
  //       this.isConnected = false;
  //       this.isDisConnected=true
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     })
  // }

  connectToWifi() {

    if (!this.wifiPassword.trim()) {
      this.isPasswordEmpty = true;
      return;
    }
    this.isPasswordEmpty = false;
    this.connectionService.wifiConnection(this.wifiPassword, this.selectedNetwork)
      .then((res) => {
        this.getWifiIpInfo();
        this.isConnected = false;
        this.isDisConnected = true;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  disconnectFromWifi() {
    this._getAllWifi()
    if (this.selectedNetwork !== 'not-connected') {
      this.connectionService.wifiDisConnect()
        .then((res) => {
          this.initializeFormWifi();
          this.isConnected = false;
          this.wifiPassword = ""
          this.selectedNetwork = 'not-connected'
          this.isDisConnected = false
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  makeEditable() {
    this.isEdit = true
  }

  editCancel() {
    this.isEdit = false
    // if (this.selectedNetwork !== 'not-connected') {
    //   this.getWifiIpInfo()
    // }
  }

  makeEditableWifi() {
    this.isEditWifi = true
  }

  editCancelWifi() {
    this.isEditWifi = false
    if (this.selectedNetwork !== 'not-connected') {
      this.getWifiIpInfo()
    }
  }

  toggleWifiIp(name: string) {
    if (name === 'static') {
      this.selectedWifiSwitch = 'static'
      this.getWifiIpInfo()
    } if (name === 'dynamic') {
      this.selectedWifiSwitch = 'dynamic'
      this.getWifiIpInfo()
    }

  }

  getWifiIpInfo() {
    if (this.selectedWifiSwitch === 'static') {
      this.connectionService.getStaticWifiIpAddress()
        .then((resp) => {
          this.registerFormWifi.patchValue(resp);
          this.originalWifiFormValues = { ...this.registerFormWifi.getRawValue() };  // Get original form values

        })
        .catch((err) => {
          console.error("Error fetching IP info:", err);
        });
    } else {
      this.connectionService.getDynamicWifiIpAddress()
        .then((resp) => {
          this.registerFormWifi.patchValue(resp);
        })
        .catch((err) => {
          console.error("Error fetching IP info:", err);
        });
    }

  }

  toggleEtherIp(name: string) {
    if (name === 'static') {
      this.selectedEtherSwitch = 'static'
      this.getEtherIpInfo()
    } if (name === 'dynamic') {
      this.selectedEtherSwitch = 'dynamic'
      this.getEtherIpInfo()
    }

  }

  getEtherIpInfo() {
    if (this.selectedEtherSwitch === 'static') {
      this.connectionService.getStaticEtherIpAddress()
        .then((resp) => {
          this.registerFormEther.patchValue(resp);
          this.originalEtherFormValues = { ...this.registerFormEther.getRawValue() };  // Get original form values

        })
        .catch((err) => {
          console.error("Error fetching IP info:", err);
        });
    } else {
      this.connectionService.getDynamicEtherIpAddress()
        .then((resp) => {
          this.registerFormEther.patchValue(resp);
        })
        .catch((err) => {
          console.error("Error fetching IP info:", err);
        });
    }

  }

  submitFormEther() {
    if (this.selectedEtherSwitch === 'static') {
      const formData = this.registerFormEther.value;
      const { default_ip_address, default_gateway, default_subnet_mask } = formData

      this.connectionService.updateStaticEtherIpSetting(default_ip_address, default_subnet_mask, default_gateway)
        .then((res) => {
          this.originalEtherFormValues = { ...this.registerFormEther.getRawValue() };  // Get original form values

        })
        .catch((err) => {
          console.log("Ether", err);
        });


      this.isEdit = false;
    }
    if (this.selectedEtherSwitch === 'dynamic') {
      const formData = this.registerFormEther.value;
      const { default_ip_address, default_gateway, default_subnet_mask } = formData

      this.connectionService.updateDynamicEtherIpSetting(default_ip_address, default_subnet_mask, default_gateway)
        .then((res) => {

        })
        .catch((err) => {
          console.log("Ether", err);
        });


      this.isEdit = false;
    }
  }

  // submitFormEther() {
  //   if (this.selectedEtherSwitch === 'static') {
  //     const formData = this.registerFormEther.value;
  //     const { default_ip_address, default_gateway, default_subnet_mask } = formData
  //     console.log(formData, "ggggggggggggg")
  //     this.connectionService.updateStaticEtherIpSetting(default_ip_address, default_subnet_mask, default_gateway)
  //       .then((res) => {
  //         this.originalEtherFormValues = { ...this.registerFormEther.getRawValue() };  // Get original form values

  //       })
  //       .catch((err) => {
  //         console.log("Ether", err);
  //       });


  //     this.isEdit = false;
  //   }
  //   if (this.selectedEtherSwitch === 'dynamic') {
  //     const formData = this.registerFormEther.value;
  //     const { default_ip_address, default_gateway, default_subnet_mask } = formData

  //     this.connectionService.updateDynamicEtherIpSetting(default_ip_address, default_subnet_mask, default_gateway)
  //       .then((res) => {

  //       })
  //       .catch((err) => {
  //         console.log("Ether", err);
  //       });


  //     this.isEdit = false;
  //   }
  // }

  submitFormWifi() {
    if (this.selectedWifiSwitch === 'static') {
      const formData = this.registerFormWifi.value;
      const { default_ip_address, default_gateway, default_subnet_mask } = formData

      this.connectionService.updateStaticWifiIpSetting(default_ip_address, default_subnet_mask, default_gateway)
        .then((res) => {
          this.originalEtherFormValues = { ...this.registerFormWifi.getRawValue() };  // Get original form values

        })
        .catch((err) => {
          console.log("Ether", err);
        });


      this.isEditWifi = false;
    }
    if (this.selectedWifiSwitch === 'dynamic') {
      const formData = this.registerFormWifi.value;
      const { default_ip_address, default_gateway, default_subnet_mask } = formData

      this.connectionService.updateDynamicWifiIpSetting(default_ip_address, default_subnet_mask, default_gateway)
        .then((res) => {

        })
        .catch((err) => {
          console.log("Ether", err);
        });


      this.isEditWifi = false;
    }
  }
  // submitFormWifi() {
  //   if (this.selectedEtherSwitch === 'static') {
  //     const formData = this.registerFormWifi.value;
  //     const { default_ip_address, default_gateway, default_subnet_mask } = formData
  //     this.connectionService.updateStaticWifiIpSetting(default_ip_address, default_subnet_mask, default_gateway)
  //       .then((res) => {
  //         this.originalWifiFormValues = { ...this.registerFormWifi.getRawValue() };  // Get original form values

  //       })
  //       .catch((err) => {
  //         console.log("Ether", err);
  //       });


  //     this.isEdit = false;
  //   }
  //   if (this.selectedEtherSwitch === 'dynamic') {
  //     const formData = this.registerFormWifi.value;
  //     const { default_ip_address, default_gateway, default_subnet_mask } = formData

  //     this.connectionService.updateDynamicWifiIpSetting(default_ip_address, default_subnet_mask, default_gateway)
  //       .then((res) => {

  //       })
  //       .catch((err) => {
  //         console.log("Ether", err);
  //       });


  //     this.isEdit = false;
  //   }
  // }
  toggleOnSubmit() {
    const formData = this.registerFormEther.value;
    const { default_ip_address, default_gateway, default_subnet_mask } = formData;
    if (
      default_ip_address !== this.originalEtherFormValues.default_ip_address ||
      default_subnet_mask !== this.originalEtherFormValues.default_subnet_mask ||
      default_gateway !== this.originalEtherFormValues.default_gateway
    ) {
      this.submitFormEther()
    }
    if (Object.keys(this.originalWifiFormValues).length > 0) {
      const formData = this.registerFormWifi.value;
      const { default_ip_address, default_gateway, default_subnet_mask } = formData;
      if (
        default_ip_address !== this.originalWifiFormValues.default_ip_address ||
        default_subnet_mask !== this.originalWifiFormValues.default_subnet_mask ||
        default_gateway !== this.originalWifiFormValues.default_gateway
      ) {
        this.submitFormWifi()
      }
    }
  }

}


