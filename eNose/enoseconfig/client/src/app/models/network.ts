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
  
  export interface ipInfo {
    ip_address: string;
    subnet_mask: string;
    gateway: string;
  }

  export interface connectedWifi {
    ip_address: string;
   connected_wifi_networks:string;
  }

 