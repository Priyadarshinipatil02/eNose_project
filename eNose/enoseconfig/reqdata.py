import random
import threading
from time import sleep
from datetime import datetime
import random
from requests import get, post
from pytz import utc

from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()

url = "http://localhost:5000/api/sensors"
jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY4NjgxNTY3MCwianRpIjoiOTIxYTVmMGYtNDQyNy00NjAxLThlZDMtZTZmMWUwMTkyMmE5IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNjg2ODE1NjcwLCJhdWQiOjEsImludm9rZSI6IlpuTmpBQUlYUTFxV3R1SCsrTGErUEYxcWVHU2VOUW00czZwajdRc1Q2ZTl1Mktwdm55cS8rUlNCUmVpOXlHRmlxVFN1enIxQ2ZKZDYyYWIvcUtRRG1mZzZhQ25GdFFyTGFvaDBUVUprIn0.PMTsuqQCvko5imbcPFGzRSBUWugBKZ1dtNairMxsRr0"


def collect_data(sensor):
    sensor_id = sensor.get("sensorId")
    while True:
        global url
        data = random.randint(15, 45)
        post(url, headers={"Authorization": "Bearer {}".format(jwt)}, json={
            "sensorId": sensor_id,
            "data": data,
            "status": 1
        })


request = get(url, headers={"Authorization": "Bearer {}".format(jwt)})
if request.status_code == 200:
    sensors = request.json()
    if len(sensors) > 0:
        for sensor in sensors:
            sensor_id = sensor.get("sensorId")
            sampling_rate = sensor.get("samplingRate")
            scheduler.add_job(
                id="{}".format(sensor_id),
                func=collect_data,
                trigger="interval",
                seconds=sampling_rate,
                replace_existing=True,
                args=(sensor,)
            )
            print("job added")

scheduler.start()

while True:
    sleep(1)
