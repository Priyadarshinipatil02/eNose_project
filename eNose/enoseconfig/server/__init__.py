import logging
import os
import mimetypes
import  threading
from werkzeug.exceptions import HTTPException
from flask import Flask, render_template, redirect, jsonify, send_from_directory
from flask_bcrypt import Bcrypt
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_simple_crypt import SimpleCrypt
from zipfile import ZipFile
from logging import FileHandler
from flask_swagger import swagger

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__,
                instance_relative_config=True,
                template_folder="../client",
                static_folder="../client/dist",
                static_url_path="/")
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'eNoseFW.sqlite'),
    )
    Bcrypt(app)
    jwt = JWTManager(app)
    CORS(app)

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    log_file_path = os.path.join(app.instance_path, 'app.log')
    file_handler = FileHandler(log_file_path)
    file_handler.setLevel(logging.INFO)  # Set the desired logging level
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    file_handler.setFormatter(formatter)

    # Add the file handler to the root logger
    logging.getLogger().addHandler(file_handler)
    app.sensor_data = {}
    app.calibration_start = False
    app.sample_start = False
    app.collected_data = {}
    app.sensor_self_test_data = []
    app.sensor_data_list = []
    app.last_calculated_mean = []
    app.collected_sample_data = []
    app.sensor_status = {}
    cipher = SimpleCrypt()
    cipher.init_app(app)
    app.config.update({"encrypt": cipher.encrypt})
    app.config.update({"decrypt": cipher.decrypt})
    from . import command
    command.init_app(app)

    #from . import MqttService
    #mqtt_thread = threading.Thread(target=MqttService.start_mqtt)
    #mqtt_thread.start()

    enose_file = os.path.join(app.instance_path, 'config.enose')
    if os.path.exists(enose_file):
        with ZipFile(enose_file, "r") as enose_config:
            e_config = enose_config.read("config.enose")
            if e_config:
                from . import db
                db.init_app(app)

                from . import SqliteLogHandler
                sh = SqliteLogHandler.SqliteLogHandler()
                sh.init_app(app)
                sh.setLevel(logging.INFO)

                logger = logging.getLogger(__name__)
                loggers = [logger, logging.getLogger('flask.app')]

                for l in loggers:
                    l.addHandler(sh)

                from . import User
                # from . import Chart
                # from .DataCollection import DataCollection, CalibrationStart, CalibrationData, CalibrationStop
                # from .SensorStatusUpdate import SensorStatusUpdate
                from .SystemUid import SystemUid
                from .Log import Log
                # from .ModelData import ModelData, ModelDataDelete, ModelDataUpdate
                # from .SelfTestStatus import SelfTestStatus
                from .SystemConfig import SystemConfig, SystemRestart, SystemFactoryReset
                from . import WifiManagement, WifiMangement2, UpdatePassword, UpdateFirmware
                from . import WifiManagement_Static, WifiManagement_Dynamic, bssid, RasberryPiEtherStatic, RasberryPiEtherDynamic, current_wifi
                from .DemoMode import SelfTest,GetAllSensors, Firmware, FlashWebApp1, SampleCount, Test, SampleReset, SampleStart
                api = Api(app, "/api")
                api.add_resource(User.UserLogin, "/login")

                api.add_resource(User.UserList, "/users")
                api.add_resource(User.FindUser, "/user")
                api.add_resource(SystemUid, "/as-system-uid")
                api.add_resource(Log, "/logs")
                api.add_resource(WifiManagement.WifiManagement,"/wificonnect") ##for connection
                api.add_resource(WifiMangement2.WifiManagement2,"/wifidisconnect")##for disconnection
                api.add_resource(WifiManagement_Static.WifiManagement_Static,"/wifistatic")
                api.add_resource(WifiManagement_Dynamic.WifiManagement_Dynamic,"/wifidynamic")
                api.add_resource(RasberryPiEtherDynamic.RasberryPiEtherDynamic,"/raspberry_dynamic")
                api.add_resource(RasberryPiEtherStatic.RasberryPiEtherStatic,"/raspberry_static")
                api.add_resource(UpdatePassword.UpdatePassword,"/updatepassword")
                api.add_resource(UpdateFirmware.FirmwareUpdateClass,"/updatefirmware")
                api.add_resource(bssid.Bssid,"/wifi_bssid")
                api.add_resource(current_wifi.Current_Wifi, "/wifi_current")
                api.add_resource(SystemConfig, "/deviceInfo")
                api.add_resource(SystemRestart, "/system-restart")
                api.add_resource(SystemFactoryReset, "/system-factory-reset")
                api.add_resource(SelfTest, "/SelfTest")
                api.add_resource(GetAllSensors, "/GetAll")
                api.add_resource(Firmware, "/FirmwareSensors")
                api.add_resource(FlashWebApp1, "/FlashWeb1")
                api.add_resource(SampleCount, "/SampleCount")
                api.add_resource(Test, "/test")
                api.add_resource(SampleReset, "/SampleReset")
                api.add_resource(SampleStart, "/start")


                # Add and run scheduler
                from .Scheduler import scheduler
                scheduler.init_app(app)
                # from .DataStore import DataStore
                # store = DataStore(app)
                # store.start_thread()
                scheduler.start()

                @app.route("/api/spec")
                def spec():
                    swag = swagger(app)
                    swag['swagger'] = '2.0'
                    swag['info']['version'] = "1.0.0"
                    swag['info']['title'] = "eNose Api"
                    swag["securityDefinitions"] = {
                        "Bearer": {"type": "apiKey", "name": "Authorization", "in": "header"}}
                    return jsonify(swag)

                from .Swagger import swagger as swaggerbp

                app.register_blueprint(swaggerbp)

                # a simple page that says hello
                @app.route('/', defaults={'path': ''})
                @app.route('/<path:path>')
                def serve_vue(path):
                    full_path = os.path.join(app.static_folder, path)
                    if path != "" and os.path.exists(full_path):
                        return send_from_directory(app.static_folder, path)
                    else:
                        return send_from_directory(app.static_folder, 'index.html')

                @app.errorhandler(404)
                def not_found(e):
                    return send_from_directory(app.static_folder, 'index.html')

                @jwt.user_identity_loader
                def user_identity_lookup(user):
                    print(user)

                @jwt.user_lookup_loader
                def user_lookup_callback(_jwt_header, jwt_data):
                    identity = jwt_data["sub"]
                    user = db.select_one("user", ["userId", "userName", "email", "userType", "invoke"],
                                         {"userId": identity, "status": 1})
                    if user.get("invoke") == jwt_data['invoke']:
                        return user

                @jwt.user_lookup_error_loader
                def user_lookup_error_loader(_jwt_header, jwt_data):
                    return {"msg": "Invalid Token"}, 422

            else:
                @app.route('/')
                def routes():
                    return render_template("expired.html")

                @app.errorhandler(404)
                def index(e):
                    return redirect("/")

    else:
        @app.route('/')
        def routes():
            return render_template("expired.html")

        @app.errorhandler(404)
        def index(e):
            return redirect("/")

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        app.logger.error(str(e))
        return {"message": "Licence expired"}, e.code

    @app.route("/api/ping")
    def ping():
        return jsonify({"message": "pong"})

    return app
