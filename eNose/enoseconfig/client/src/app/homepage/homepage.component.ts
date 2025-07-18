import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService } from '../deviceinfo/deviceinfo.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  isSampleTestingShow: Boolean = false
  showModal = false;
  isLoading = false;
  status: 'success' | 'failed' | null = null;
  count: any
  intervalId: any
  last_Count: any


  constructor(private router: Router, private deviceService: DeviceService) { }


  ngOnInit() {
    this.getSetDevicInfo()
    this.sampleReset()
  }

  getSetDevicInfo() {
    this.deviceService.getSystemConfig()
      .then((c: any) => {
        this.isSampleTestingShow = c.demo_mode === 'True' ? true : false;
      });
  }
  navigateToInfo(name: string) {

    if (name == "device") {
      this.router.navigate(['/Device-Info']);
    }
    if (name == "network") {
      this.router.navigate(['/Network-Info']);
    }
    if (name == "account") {
      this.router.navigate(['/Account-Info']);
    }
  }


  async startSampling() {
    this.reset()
    this.isLoading = true;
    await this.sampleStart();
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.intervalId = setInterval(() => {
      this.deviceService.getSampleTestResult1()
        .then((response: any) => {
          console.log(response)
          if (response.is_process_finished && response.Data == response.defaultUpdateFrequency) {
            clearInterval(this.intervalId)
            this.sampleReset()
            if (response.is_matched) {
              this.showSuccess()
              this.count = -1;
            } else {
              this.showFailed()
              this.count = -1;
            }
          } else {
            this.count = response.Data != 0 ? response.Data : this.count
          }
        });
    }, 3000)

  }

  sampleStart() {
    return this.deviceService.sampleStart();
  }

  sampleReset() {
    this.deviceService.sampleReset()
      .then((response: any) => {
      });
  }

  startSampling1() {
    this.reset()
    this.isLoading = true;
    let rt = setInterval(() => {
      this.getSampleCount()
    }, 2000)

    this.deviceService.getSampleTestResult()
      .then((response: any) => {
        if (response.Data) {
          this.showSuccess()
          this.count = -1;
          clearInterval(rt)
        } else {
          this.showFailed()
          this.count = -1;
          clearInterval(rt)
        }
      });

  }

  getSampleCount() {
    this.deviceService.getSampleTestCount()
      .then((response: any) => {
        if (response != undefined) {
          this.count = response;
        }
      });
  }


  openModal() {
    this.isLoading = true;
    this.showModal = true;
    this.reset()
    this.startSampling()
  }

  closeModal() {
    this.showModal = false;
    this.sampleReset()
    clearInterval(this.intervalId)
  }

  showSuccess() {
    this.status = 'success';
    this.isLoading = false;
  }

  showFailed() {
    this.status = 'failed';
    this.isLoading = false;
  }

  reset() {
    this.status = null;
    this.count = undefined;
  }
}
