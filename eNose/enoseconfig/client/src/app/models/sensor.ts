export type Sensor={
    sensorId:number,
    sensorName:string,
    sensorTypeId:number,
    samplingRate:number,
    defaultUpdateFrequency:number,
    status:number,
    chartType:string
}

export type SensorData={
    captureTime:string,
    meanValue:number,
    minimumValue:number,
    maximumValue:number,
    standardDeviation:number,
}

export type SensorChart= Sensor & {
    data: SensorData[]
}

export type SensorChartType= {
    gas: SensorChart[],
    other: SensorChart[]
}

export type ChartInterface ={
    name:string,
    chartId:number,
    duration:string,
    type:string,
    data:{
        labels?: any,
        datasets: any
      }
}


export type WifiResponse ={
    available_ssids: {
      default_ssids: string[];
    };
    available_networks: {
      default_wifi_networks: string[];
    };
  }

  export type wifiPassword={
    password:string
    bssid:string
  }