from flask import current_app
from flask_restful import Resource, reqparse
import subprocess
from zipfile import ZipFile
import os
import platform
from flask_jwt_extended import jwt_required

sensorStatusData = reqparse.RequestParser()
sensorStatusData.add_argument('mk_duid', type=str, help='System uid is required', required=True)


class SystemUid(Resource):
    @jwt_required()
    def post(self):
        """
        MK UID
        ---
        tags:
            - System
        security:
            - Bearer: []
        parameters:
            - in: body
              name: body
              schema:
                properties:
                    mk_duid:
                        type: string
                        description: MK uid for validation
        responses:
            200:
                schema:
                    $ref: "#/definitions/Error"
                description: Success
            404:
                schema:
                    $ref: "#/definitions/Error"
                description: Error
        :return:
        """
        args = sensorStatusData.parse_args()
        config_file = os.path.join(current_app.instance_path, 'config.enose')
        try:
            if args.get("mk_duid") is None:
                if os.path.isfile(config_file):
                    os.remove(config_file)
            else:
                with ZipFile(config_file, "w") as config:
                    enclicence = current_app.config.get("encrypt")(args.get("mk_duid")).decode()
                    config.writestr("config.enose", enclicence)
                    config.close()
            if platform.system() == "Linux":
                subprocess.run(["systemctl", "restart", "enose"])
            return {"status": "success", "message": "MK_DUID has been set"}
        except (OSError, FileNotFoundError) as e:
            return {"status": "error", "message": str(e), "file": config_file}, 404
