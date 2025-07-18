import json

from flask_restful import Resource
from flask_jwt_extended import jwt_required, current_user
from .db import select_one, update
from .Type import UserType
from flask import current_app, request
import os
import shutil
from datetime import datetime
import platform


class SystemConfig(Resource):
    @jwt_required()
    def get(self):
        config = select_one("FW_Config")
        return config

    @jwt_required()
    def post(self):
        args = request.json
        update_data = {
            "deviceName": args.get("deviceName"),
            "firmwareVersion": args.get("firmwareVersion"),
            "raspberry_pi_timezone": args.get("timeZone"),
            "base_url": args.get("hosturl"),
            "logRetentionDays": args.get("logRetentionDays"),
            "enable_sensor_data_log": args.get("captureSensorData"),
            "demo_mode": args.get("demoMode"),
        }
        update("FW_Config", update_data, {"composite_key": args.get("serialNumber")})
        current_app.logger.info("Firmware config updated request={}".format(json.dumps(args)),
                                extra={"userId": current_user.get("userId")})
        config = select_one("FW_Config")
        return config


class SystemRestart(Resource):
    @jwt_required()
    def get(self):
        if current_user.get("userType") == UserType.ADMIN.value:
            if platform.system() == "Linux":
                os.system("shutdown -r now")
            else:
                os.system("shutdown /r now")
            current_app.logger.info("System restarted", extra={"userId": current_user.get("userId")})
        else:
            return {"status": "error", "message": "You don't have permission to perform this action."}


class SystemFactoryReset(Resource):
    @jwt_required()
    def get(self):
        if current_user.get("userType") == UserType.ADMIN.value:
            dbfile = current_app.config['DATABASE']
            if os.path.exists(dbfile):
                filename, ext = os.path.splitext(dbfile)
                shutil.copyfile(dbfile, "{}_{}{}".format(filename, datetime.utcnow().strftime("%Y%m%d%H%M%S"), ext))
                os.system("flask init-db")
            current_app.logger.info("System factory reset", extra={"userId": current_user.get("userId")})
        else:
            return {"status": "error", "message": "You don't have permission to perform this action."}
