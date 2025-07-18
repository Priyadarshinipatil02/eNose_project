import json
import math
from flask_restful import Resource
from flask_jwt_extended import jwt_required, current_user
from .db import select_one, update
from .Type import UserType
from flask import current_app, request
import os
import shutil
from datetime import datetime
import platform
from cachetools import TTLCache
from datetime import datetime
from collections import defaultdict
from instance.config import  defaultUpdateFrequency
from threading import Lock
import logging
sample_data_lock = Lock()






temp_cache = TTLCache(maxsize=1000000, ttl=300000)
##sensor_data_list =[]
## is_sample_test_start
sample_sensor_data_list =[]
temp_sample_sensor_data = []

## New Logic
sampleStarted = False
last_calculated_mean = []

## self test api
class SelfTest(Resource):
   ## @jwt_required()
    def post(self):
        data = request.json
        if "sensors" in data and data["sensors"]:  # Check if 'sensors' key exists and is not empty
             sensor_list = [
             {
                "mkDeviceId":  1,
                "fwDeviceId": idx + 1,
                "status": 1,
                "samplingRate": 3,
                "defaultUpdateFrequency": defaultUpdateFrequency,
                "sensorId": int('1' + str(idx + 1)),  # sequential ID starting from 1
                "sensorName": sensor["sensorName"],
                "sensorBusAddress": sensor["sensorBusAddress"],
                "sensorTypeId": sensor["sensorTypeId"],
                "channel": sensor["channel"]
             }
             for idx, sensor in enumerate(data["sensors"])
             ]
             current_app.sensor_self_test_data = sensor_list
             ##temp_cache['sensor_self_test_data'] = sensor_list
             return {'StatusCode': 200, 'Message': 'Success'}
        else:
            current_app.sensor_self_test_data  = []
            return {'StatusCode': 401, 'Message': 'No sensor data found'}



## get all sensors api
class GetAllSensors(Resource):
    @jwt_required()
    def get(self):
        data = current_app.sensor_self_test_data
        if "Not found" not in data and data:
            test_result = data
            return test_result
        else:
            return {'StatusCode': 401, 'Message': 'No sensor data found'}

## firmware sensor data  api
class Firmware(Resource):
    @jwt_required()
    def get(self):
        data = current_app.sensor_data_list ##temp_cache.get('sensor_data_list', 'Not found')
        return data

    @jwt_required()
    def post(self):
        args = request.json
        print('sensor data recorded')
        if  args is not None:
            sensor_data = {"timestamp": datetime.now().isoformat(),"data": args}
            logging.info(sensor_data['data'])
            current_app.sensor_data_list.append(sensor_data)
            ## New changes
            with sample_data_lock:
                if current_app.sample_start and len(sample_sensor_data_list) < defaultUpdateFrequency:
                    current_app.collected_sample_data.append(sensor_data)

            if len(current_app.sensor_data_list) == defaultUpdateFrequency:
                current_app.last_calculated_mean = calculate_data(current_app.sensor_data_list)
                print('Calculated Mean Values: ', current_app.last_calculated_mean)
                current_app.sensor_data_list.clear()

            return args
        else:
            return {'StatusCode': 401, 'Message': 'No sensor data found'}


## api's for flash web abb ---In Use
class FlashWebApp1(Resource):
    def get(self):
        with sample_data_lock:
            data =   current_app.collected_sample_data #
            print('Collected Sample Count: ', len(data))
            if len(data) == defaultUpdateFrequency: # frequency matched
                current_app.sample_start = False
                current_reading = calculate_data(data)
                last_reading = current_app.last_calculated_mean  ## get the last calculated mean data

                percent_changes = []
                if current_reading and last_reading:
                    percent_changes = get_mean_percentage(last_reading, current_reading)

                result = check_large_changes(percent_changes)
                return {'StatusCode': 200, 'Message': 'Success', "is_matched": result,'is_process_finished': True,'Data': defaultUpdateFrequency,'defaultUpdateFrequency': defaultUpdateFrequency }
            else:
             # Not enough data
             return { 'StatusCode': 200,'Message': 'Success','is_process_finished': False,'Data': len(data)}


class SampleStart(Resource):
    def get(self):
        current_app.sample_start = True
        sample_status = current_app.sample_start
        current_app.collected_sample_data.clear()
        print('sampling started...')
        return sample_status



class SampleReset(Resource):
    def get(self):
        current_app.sample_start = False
        sample_status = current_app.sample_start
        current_app.collected_sample_data.clear()
        print('Sampling stopped')
        return sample_status

        
def calculate_data(sensor_data):
    # Initialize data storage
    sums = defaultdict(float)
    counts = defaultdict(int)

    # Aggregate values
    for entry in sensor_data:
        for sensor in entry['data']:
            sid = sensor['sensorId']
            value = float(sensor['data'])
            sums[sid] += value
            counts[sid] += 1

    # Compute mean
    means = {sid: sums[sid] / counts[sid] for sid in sorted(sums)}

    # Output result
    result = []
    ##print("Mean value per sensor:")
    for sid, mean in means.items():
        n = "Sensor"+ str(sid)
        d = {n:mean}
        result.append(d)
        ##print('d: ',d)

    ##print('Final Result: ',result )
    return result

def get_mean_percentage(last_reading, current_reading):
    current = flatten_readings(current_reading)
    last = flatten_readings(last_reading)
    percent_change_reading = []
    for sensor in current:
        current_val = current[sensor]
        last_val = last.get(sensor, 0)
        if last_val != 0:
            percent_change = ((current_val - last_val) / last_val) * 100
        else:
            percent_change = float('inf')  # handle divide by zero
        percent_change_reading.append({sensor: percent_change})

    print('Sample Test Reading Mean: ', current_reading)
    print("Previous Sensor Data Mean: ", last_reading)
    print('Percent Change Reading Mean: ', percent_change_reading)
    return  percent_change_reading

def flatten_readings(readings):
    return {list(d.keys())[0]: list(d.values())[0] for d in readings}

def check_large_changes(percent_changes):
    found = False
    for entry in percent_changes:
        for sensor, value in entry.items():
            if value > 20:
                print(f"✅  {sensor} has a large positive change: {value:.2f}%")
                found = True
                current_app.sample_start  = False
    if not found:
        print("⚠️ No sensor has a large positive change over 20%.")
        current_app.sample_start  = False
    return found



class SampleCount(Resource):
    def get(self):
       data = temp_cache.get('temp_sample_sensor_data', 'Not found')
       count =  len(data)
       print('Length of temp_sample_sensor_data: ', count)
       if count is not None:
           return count
       else:
           return 0


class Test(Resource):
    def get(self):
       data = temp_cache.get('temp_sample_sensor_data', 'Not found')
       count =  len(data)
       data1 = temp_cache.get('test_api')
       sample_start = temp_cache.get('is_sample_test_start')
       if count is not None and data is not None:
           return {'SampleCount':count, 'SampleData':data, 'SampleStatus':sample_start, 'API TEST':data1 }
       else:
           return 