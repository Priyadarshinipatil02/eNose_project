import sqlite3

from flask import request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, current_user
from .db import select, insert
from datetime import datetime

logData = reqparse.RequestParser()
logData.add_argument("code", type=str, help="Log code")
logData.add_argument("type", type=str, help="Log type")
logData.add_argument("description", type=str, help="Log message")


class Log(Resource):

    @jwt_required()
    def get(self):
        query = request.args.to_dict()
        type = query.get("type")
        logs = []
        if type == "login":
            logs = select("logs", ["*"],
                          {"Description": "Login successful", "LoggedBy": current_user.get("userId")},
                          {"LoggerID": "DESC"}
                          )
        return logs

    @jwt_required()
    def post(self):
        """
        Create log
        ---
        tags:
           - Log
        security:
            - Bearer: []
        definitions:
            - schema:
                id: LogRequest
                properties:
                    code:
                        type: string
                        description: Log code
                    type:
                        type: string
                        description: Log type
                    description:
                        type: string
                        description: Login message

        parameters:
            - in: body
              name: body
              schema:
                $ref: "#/definitions/LogRequest"
        responses:
            200:
                schema:
                    $ref: "#/definitions/Error"
                description: Log created
        :return:
        """
        args = logData.parse_args()
        data = {
            "Logtime": datetime.utcnow(),
            "LogType": args.get("type"),
            "Description": args.get("description"),
            "LoggedBy": current_user.get("userId")
        }
        try:
            insert("logs", data)
        except sqlite3.OperationalError:
            pass
        return {"status": "success", "message": "Log has been added"}
