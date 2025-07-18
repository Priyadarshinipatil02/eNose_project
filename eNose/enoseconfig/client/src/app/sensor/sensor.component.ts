import { Component, OnInit } from '@angular/core';
import { SensorService } from './sensor.service';
import * as moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModelData } from '../models/ModelData';
import { Sensor, WifiResponse} from '../models/sensor';
import { Model } from '../models/Model';
import { BredService } from '../layout/bread.service';
declare const Swal: any;
declare const bootstrap: any;

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})
export class SensorComponent implements OnInit {

  calibration_form!: FormGroup
  models = {} as any
  raw_data!: any
  sensors!: Sensor[]
  dbmodels!: Model[]
  _sensors!: Sensor[]
  _WifiResponse!: WifiResponse
  selectedNetwork: string = 'not-connected';
  showPasswordInput: boolean = false;
  wifiPassword: string = '';
  connectError: string = '';
  isConnected: boolean = false;
  defaultSensorType = 1;
  lastModelId = [] as any
  isUpdate = false
  selectedModel!: any;
  enableSaveButton = false;
  defaultFrequency = 100;
  sd!: number
  min!: number
  max!: number
  dbRanges!: any
  isEdit = false
  selectedSensor!: Sensor
  oldvalue!:any
  constructor(private sensorService: SensorService, private bredService: BredService) { }
  ngOnInit(): void {
    this.calibration_form = new FormGroup({
      model_name: new FormControl("", Validators.required),
      alert_name: new FormControl("", Validators.required),
      alert_status: new FormControl(1, Validators.required),
      event_criteria_type: new FormControl(1, Validators.required),
      selected_range: new FormControl('1'),
      range1_sd: new FormControl(0),
      range1_min: new FormControl(0),
      range1_max: new FormControl(0),
      range2_sd: new FormControl(0),
      range2_min: new FormControl(0),
      range2_max: new FormControl(0),
      range3_sd: new FormControl(0),
      range3_min: new FormControl(0),
      range3_max: new FormControl(0),
      range4_sd: new FormControl(0),
      range4_min: new FormControl(0),
      range4_max: new FormControl(0),
    })
    this.models["add_new_calibration"] = bootstrap.Modal.getOrCreateInstance(document.getElementById("add_new_calibration"))
    this._getAllSensor()
    this._getAllWifi()
    //this._getAllModels()
    this.calibration_form.valueChanges.subscribe((changes) => {
      console.log(JSON.stringify(this.oldvalue), JSON.stringify(changes))
        this.enableSaveButton = JSON.stringify(this.oldvalue) == JSON.stringify(changes)
    })
    this.bredService.title.next({
      icon: "microchip",
      // text: "Sensors"
      text: "Connections"

    })
  }

  chnageTab(sensorType: number) {
    console.log(sensorType,"sensorType")
    this.defaultSensorType = sensorType
    const types = sensorType == 1 ? [1] : [3, 2]
    this.sensors = this._sensors.filter((sensor) => types.includes(sensor.sensorTypeId))
    this.selectedSensor = this.sensors.filter(s => s.status == 3)[0]
    this._getModelBySensorId()

  }

  selectSensor(sensor: Sensor) {
    this.selectedSensor = sensor
    this._getModelBySensorId()
  }

  _getAllSensor() {
    this.sensorService.getAllSensors()
      .then((sensors) => {
        console.log(sensors,"kkk")
        this._sensors = sensors
        const frequency = sensors.map(f => f.sensorTypeId == 1 ? f.defaultUpdateFrequency : 0)
        this.defaultFrequency = Math.max(...frequency)
        this.chnageTab(1)
      })
      .catch((err) => {
        console.log("SENSORS", err)
      })
  }

  
  _getAllWifi() {
    this.sensorService.getAllWifi()
      .then((resp) => {
        this._WifiResponse = resp;
        console.log(resp, "llll", this._WifiResponse);
        this.chnageTab(1);
      })
      .catch((err) => {
        console.log("WIFI", err);
      });
  }

  connectToWifi() {
    console.log(this.wifiPassword,"wifiipassword",this.selectedNetwork)
    this.sensorService.wifiConnection(this.wifiPassword,this.selectedNetwork)
      .then((res) => {
        console.log(res)
        this.isConnected = true;
      })
      .catch((err) => {
        console.log(err)
      })
  }

  disconnectFromWifi() {
    this.sensorService.wifiDisConnect()
    .then((res) => {
      console.log(res)
      this.isConnected = false;
      this.wifiPassword=""
      this.selectedNetwork='not-connected'
    })
    .catch((err) => {
      console.log(err)
    })
    // Simulating a disconnection for demonstration purposes
    // In a real application, you would handle the disconnection logic accordingly
   
    console.log(`Disconnecting from ${this.selectedNetwork}`);
  }


  onNetworkChange() {
    if (this.isConnected) {
      // If currently connected, disconnect before changing the network
      this.sensorService.wifiDisConnect()
    .then((res) => {
      console.log(res)
      this.isConnected = false;
      this.wifiPassword=""
      // this.selectedNetwork='not-connected'
    })
    .catch((err) => {
      console.log(err)
    })
      
    }
    // Reset the password when the network changes
    this.wifiPassword = '';
  }

  // connectToWifi() {
    
  //   // Implement the logic to connect to the selected WiFi network with the provided password
  //   console.log(`Connecting to ${this.selectedNetwork} with password: ${this.wifiPassword}`);
  //   const randomError = Math.random() < 0.5;
  //   if (randomError) {
  //     this.connectError = 'Error connecting to WiFi. Please check your password.';
  //   console.log(`Connecting to ${this.selectedNetwork} with password: ${this.wifiPassword}`);

  //   } else {
  //     this.connectError = ''; // Clear any previous error message
  //     console.log(`Connecting to ${this.selectedNetwork} with password: ${this.wifiPassword}`);
  //   }
  // }
  

  _getModelBySensorId() {
    this.sensorService.getAllModelBySensorId(this.selectedSensor.sensorId)
      .then((model) => {
        if (model.length > 0) {
          this.selectedModel = model[0]
        }
      })
      .catch((err) => {
        console.log("MODELS", err)
      })
  }

  _getAllModels() {
    this.sensorService.getAllModels()
      .then((sensors) => {
        this.dbmodels = sensors
      })
      .catch((err) => {
        console.log("SENSORS", err)
      })
  }

  showPopup(model: string) {
    const model_name = `GAS_MODEL_${moment().format("DDMMYYHHmmss")}`
    if (model === "add_new_calibration") {
      this.calibration_form.setValue({
        model_name: model_name,
        alert_name: model_name,
        alert_status: 1,
        selected_range: "1",
        event_criteria_type: 1,
        range1_sd: 0,
        range1_min: 0,
        range1_max: 0,
        range2_sd: 0,
        range2_min: 0,
        range2_max: 0,
        range3_sd: 0,
        range3_min: 0,
        range3_max: 0,
        range4_sd: 0,
        range4_min: 0,
        range4_max: 0,
      })
    }
    this.models[model].show()
  }

  cancelProcess(isCloseModel = false) {
    this.sensorService.calibration_cancel()
      .then((res) => {
        console.log("user canceled the process")
        Swal.close()
        if (isCloseModel) {
          this.models['add_new_calibration'].hide()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  startDownload() {
    this.sensorService.calibration_start()
      .then((res) => {
        console.log("Data collection process Started", res)
      }).catch((err) => {
        console.error(err)
      })

  }

  _fileDownload(data: any, filename: string) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([data], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', `${filename}.csv`);
      a.click()
      setTimeout(() => {
        a.remove()
        resolve("")
      }, 200)
    })
  }

  finished() {
    this.sensorService.calibration_finished(this.calibration_form.value)
      .then(async (res: any) => {
        this.raw_data = res.data
        this.lastModelId = res.id
        this.dbRanges = res.ranges
        this._getModelBySensorId()
        this.models["add_new_calibration"].hide()
      })
      .catch((err) => {
        console.log(err)
      })

  }

  closeModel(model: string) {
    this.models[model].hide()
    if (model === "add_new_calibration") {
      this.calibration_form.reset();
      if (!this.isUpdate) {
        this.cancelProcess(true)
      }
    }
    this.isUpdate = false;
    this.selectedModel = undefined;
    this.raw_data = undefined
  }

  changeStatus(sensor: Sensor) {
    const status = sensor.status == 3 ? 1 : 3
    this.sensorService.change_status(sensor.sensorId, status.toString())
      .then((res) => {
        this._getAllSensor()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async download() {
    const datas = Object.values(this.raw_data) as any;
    console.log(datas.length)
    let csvData = "";
    let _headers = { "Date Time": 1 } as any;
    for (let i = 0; i < datas[0].length; i++) {
      let _csvData = [];
      for (let j = 0; j < datas.length; j++) {
        _csvData.push(datas[j][i].data)
        _headers[datas[j][i].sensorName] = 1;
      }
      csvData += `\n ${datas[0][i].dateTime},${_csvData.join(",")}`;
    }
    let header = Object.keys(_headers).join(',');
    let csv = header + csvData;
    for (let n = 1; n <= 4; n++) {
      let sd = `\nSD${n},`
      let min = `\nMin${n},`
      let max = `\nMax${n},`
      for (let r = 0; r < datas.length; r++) {
        const [_sd, _min, _max] = this.dbRanges[r][`range${n}`].split("__")
        sd += `${_sd},`
        min += `${_min},`
        max += `${_max},`
      }
      csv += "\n" + sd + min + max
    }
    await this._fileDownload(csv, this.calibration_form.value.model_name)
  }

  deleteLast() {
    this.sensorService.deleteModel(this.lastModelId)
      .then((res: any) => {
        Swal.fire({
          title: res.message,
          timer: 2000
        });
        this._getAllModels()
        if (this.isUpdate) {
          this.models['add_new_calibration'].hide()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  openModel(model: Model) {
    const [sd1,min1,max1] = model.range1.split("__")
    const [sd2,min2,max2] = model.range2.split("__")
    const [sd3,min3,max3] = model.range3.split("__")
    const [sd4,min4,max4] = model.range4.split("__")
    this.selectedModel = model
    this.isUpdate = true;
    this.lastModelId = [model.modelId]
    this.oldvalue = {
      event_criteria_type: model.eventCriteriaType,
      model_name: model.modelName,
      alert_name: model.alertName,
      alert_status: model.status,
      selected_range: model.selectedRange,
      range1_sd: sd1,
      range1_min: min1,
      range1_max: max1,
      range2_sd: sd2,
      range2_min: min2,
      range2_max: max2,
      range3_sd: sd3,
      range3_min: min3,
      range3_max: max3,
      range4_sd: sd4,
      range4_min: min4,
      range4_max: max4,
    }
    this.calibration_form.patchValue({...this.oldvalue})
    this.models['add_new_calibration'].show()
  }

  update() {
    const data = {
      ...this.calibration_form.value,
      modelId: this.selectedModel.modelId,
      range1: this.selectedModel.range1,
      range2: this.selectedModel.range2,
      range3: this.selectedModel.range3,
      range4: this.selectedModel.range4,
    }
    data[`range${this.calibration_form.value.selected_range}`] = `${this.sd}__${this.min}__${this.max}`
    data["alert_status"] = this.calibration_form.value.alert_status ? 1 : 0
    console.log(this.calibration_form.value)
    // this.sensorService.updateModel(data)
    //   .then((res: any) => {
    //     Swal.fire({
    //       title: res.message,
    //       timer: 2000,
    //       showConfirmButton: false,
    //       toast: true,
    //       position: 'top-right'
    //     })
    //     this._getAllModels()
    //     this.selectedModel = { ...this.selectedModel, alertStatus: data.alert_status }
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  }

  changeRange() {
    this.enableSaveButton = true
  }

  getSplitedRange(range: string) {
    const [sd, min, max] = range.split("__")
    return {
      sd: parseFloat(sd).toFixed(2),
      sdfull: sd,
      min: parseFloat(min).toFixed(2),
      minfull: min,
      max: parseFloat(max).toFixed(2),
      maxfull: max
    }
  }

  editModel() {
    this.isEdit = true
    this.openModel(this.selectedModel)
  }

}
