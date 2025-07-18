export const BALSE_URL = `http://${window.location.hostname}:5000/api`;
export const ENDPOINTS = {
    PING: `${BALSE_URL}/ping`,
    LOGIN: `${BALSE_URL}/login`,
    SEARCH_USER: `${BALSE_URL}/user`,
    USER: `${BALSE_URL}/users`,
    DUPLICATE_USERNAME: `${BALSE_URL}/duplicate-username`,
    DASHBOARD_CHART: `${BALSE_URL}/charts`,
    LOG: `${BALSE_URL}/logs`,
    CALIBRATION_START: `${BALSE_URL}/calibration-start`,
    CALIBRATION_DATA: `${BALSE_URL}/calibration-data`,
    CALIBRATION_CANCEL: `${BALSE_URL}/calibration-cancel`,
    SENSORS: `${BALSE_URL}/sensors`,
    CHANGE_SENSOR_STATUS: `${BALSE_URL}/sensor-status`,
    MODELS: `${BALSE_URL}/models`,
    MODEL_DELETE: `${BALSE_URL}/model-delete`,
    MODEL_UPDATE: `${BALSE_URL}/model-update`,
    SYSTEM_CONFIG: `${BALSE_URL}/system-config`,
    SYSTEM_RESTART: `${BALSE_URL}/system-restart`,
    SYSTEM_FACTORY_RESET: `${BALSE_URL}/system-factory-reset`,
    GETALLWIFI: `${BALSE_URL}/wificonnect`,
    WIFICONNECT: `${BALSE_URL}/wificonnect`,
    WIFIDISCONNECT: `${BALSE_URL}/wifidisconnect`,
    GETIP: `${BALSE_URL}/raspberry`,
    EDITIP: `${BALSE_URL}/raspberry_static`,
    UPDATEPWD: `${BALSE_URL}/updatepassword`,
    UPDATEFIRMWARE: `${BALSE_URL}/updatefirmware`,
    EDITDYNAMICWIFIIP: `${BALSE_URL}/wifidynamic`,
    GETDYNAMICWIFIIP: `${BALSE_URL}/wifidynamic`,
    EDITSTATICWIFIIP: `${BALSE_URL}/wifistatic`,
    GETSTATICWIFIIP: `${BALSE_URL}/wifistatic`,
    GETDYNAMICETHERIP: `${BALSE_URL}/raspberry_dynamic`,
    EDITDYNAMICETHERIP: `${BALSE_URL}/raspberry_dynamic`,
    GETSTATICETHERIP: `${BALSE_URL}/raspberry_static`,
    EDITSTATICETHERIP: `${BALSE_URL}/raspberry_static`,
    GETCONNECTEDWIFI: `${BALSE_URL}/wifi_current`,
    GETDEVICE: `${BALSE_URL}/deviceInfo`,
    UPDATEDEVICEINFO: `${BALSE_URL}/updatedeviceInfo`,
    GETSAMPLETESTRESULT: `${BALSE_URL}/FlashWeb`,
    GETSAMPLETESTRESULT1: `${BALSE_URL}/FlashWeb1`,
    GETSAMPLETESTCOUNT: `${BALSE_URL}/SampleCount`,
    SAMPLERESET: `${BALSE_URL}/SampleReset`,
    SAMPLESTART: `${BALSE_URL}/start`,
}
export const CHART_COLORS = {
    "line": {
        MEAN_VALUE: {
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            fill: 'origin'
        },
        STANDERD_DEVIATION: {
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)',
            fill: 'origin'
        },
        MINIMUM_VALUE: {
            backgroundColor: 'rgba(255,0,0,0.3)',
            borderColor: 'red',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            fill: 'origin'
        },
        MAXIMUM_VALUE: {
            backgroundColor: 'rgba(125,83,0,0.3)',
            borderColor: 'red',
            pointBackgroundColor: 'rgba(180,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(180,159,177,0.8)',
            fill: 'origin'
        }
    }
} as any