# import random
# import threading
# from time import sleep
# from datetime import datetime
# import random
# import sqlite3
#
# data_collection = {}
# db = sqlite3.connect(database="./raspberry.sqlite", detect_types=sqlite3.PARSE_COLNAMES, check_same_thread=False)
# db.row_factory = sqlite3.Row
#
#
# def collect_data(sensor):
#     sampling_rate = sensor.get("samplingRate")
#     sensor_id = sensor.get("sensorId")
#     while True:
#         global data_collection
#         key = "data_{}".format(sensor_id)
#         data = data_collection.get(key)
#         data.append(random.randint(15, 45))
#         # Your data collection logic
#         data_collection[key] = data
#         sleep(sampling_rate)
#         print(data_collection)
#
#
# def store_data(sensor, config):
#     global db
#     default_update_frequency = sensor.get("defaultUpdateFrequency")
#     sensor_id = sensor.get("sensorId")
#     sensor_type_id = sensor.get("sensorTypeId")
#     is_create_csv = config.get("sensorDataFile") == 1
#     table_name = "other_sensor_reading"
#     if sensor_type_id == 1:
#         table_name = "gas_sensor_reading"
#     key = "data_{}".format(sensor_id)
#     while True:
#         sleep(default_update_frequency)
#         global data_collection
#         # local copy of data collection array
#         local_data_collection = data_collection.get(key)
#         # Empty global data collection array
#         data_collection[key] = []
#         if len(local_data_collection) > 0:
#             # Your logic to save data to db OR csv file
#             mean_value = sum(local_data_collection) / len(local_data_collection)
#             variance = sum([((x - mean_value) ** 2) for x in local_data_collection]) / len(local_data_collection)
#             sd = variance ** 0.5
#             data = {
#                 "sensorId": sensor_id,
#                 "captureTime": datetime.utcnow(),
#                 "updateFrequency": default_update_frequency,
#                 "meanValue": mean_value,
#                 "minimumValue": min(local_data_collection),
#                 "maximumValue": max(local_data_collection)
#             }
#             if sensor_type_id == 1:
#                 data.update({"standardDeviation": sd})
#             sql = "insert into {} (`{}`) values ({})".format(table_name, "`,`".join([key for key in data.keys()]),
#                                                              ",".join(['?' for key in data.keys()]))
#
#             if is_create_csv:
#                 pass
#             # create your csv file here
#
#             try:
#                 db.execute(sql, tuple([value for value in data.values()]))
#                 db.commit()
#             except:
#                 sleep(2)
#                 db.execute(sql, tuple([value for value in data.values()]))
#                 db.commit()
#             print("data inserted for sensor id {}".format(sensor_id))
#
#
# sensors = db.execute("select * from sensors where status=3").fetchall()
# if len(sensors) > 0:
#     sensors = [dict(zip(row.keys(), row)) for row in sensors]
#     sys_config = db.execute("select sensorDataFile from sys_config").fetchone()
#     sys_config = dict(zip(sys_config.keys(), sys_config))
#     for sensor in sensors:
#         key = "data_{}".format(sensor.get("sensorId"))
#         thread_name_one = "{} collection".format(key)
#         thread_name_two = "{} store".format(key)
#         data_collection[key] = []
#         # thread for collect data
#         thread_collectd_data = threading.Thread(name=thread_name_one, target=collect_data, args=(sensor,))
#         thread_collectd_data.start()
#         # thread for store data
#         thread_store_data = threading.Thread(name=thread_name_two, target=store_data, args=(sensor, sys_config))
#         thread_store_data.start()

# import math
# data = [510,520,420,315,600]
# length = len(data)
# mean = sum(data)/length
# sd = math.sqrt(sum([((x - mean) ** 2) for x in data])/(length-1))
# sd2 = sd*0.5
# sd3 = sd*0.25
# sd4 = sd*0.125
# print("Data = {}".format(str(data)))
# print("Length = {}".format(str(len(data))))
# print("Mean = {}".format(str(mean)))
# print("SD1 = {}".format(str(sd)))
# print("Min1 = {}, Max1 = {}".format(str(mean-sd),str(mean+sd)))
# print("SD2 = {}".format(str(sd2)))
# print("Min2 = {}, Max2 = {}".format(str(mean-sd2),str(mean+sd2)))
# print("SD3 = {}".format(str(sd3)))
# print("Min3 = {}, Max3 = {}".format(str(mean-sd3),str(mean+sd3)))
# print("SD4 = {}".format(str(sd4)))
# print("Min4 = {}, Max4 = {}".format(str(mean-sd4),str(mean+sd4)))

from wifi import Cell, Scheme

print(Cell.all("wlan0"))
