import json
import logging

from flask import current_app, request
from flask_restful import Resource, reqparse
from . import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, current_user
from datetime import datetime

parser = reqparse.RequestParser()
parser.add_argument('username', type=str, help='User email address')
parser.add_argument('password', type=str, help='User password')


class UserLogin(Resource):

    def post(self):
        """
                User Login
                ---
                tags:
                    - Auth
                definitions:
                    - schema:
                        id: Login
                        properties:
                            userId:
                                type: number
                                description: Unique id of user
                            userName:
                                type: string
                                description: Username of user
                            email:
                                type: string
                                description: Email of user
                            userType:
                                type: number
                                description: User type 0=System 1=Admin 2=Operator
                            access_token:
                                type: string
                                description: Access token authorize for user
                parameters:
                    - in: body
                      name: body
                      properties:
                        username:
                            type: string
                            required: true
                        password:
                            type: string
                            required: true
                responses:
                    200:
                        description: Login success
                        schema:
                            $ref: "#/definitions/Login"
                    401:
                        description: Unauthorized
                        schema:
                            id: Error
                            properties:
                                status:
                                    type: string
                                    description: Error status
                                message:
                                    type: string
                                    description: Error message

                :return:
                """
        bcrypt = Bcrypt(current_app)
        args = parser.parse_args()
        user = db.select_one("user", ["userId", "userName", "email", "password", "userType"],
                             {"userName": args.get("username")})
        if user is None:
            current_app.logger.log(logging.ERROR, "Authentication failed `{}`".format(json.dumps(args)))
            return {"status": "error", "message": "Authentication fail"}, 401
        if bcrypt.check_password_hash(user.get("password"), args.get("password")) is False:
            current_app.logger.log(logging.ERROR, "Authentication failed `{}`".format(json.dumps(args)))
            return {"status": "error", "message": "Authentication fail"}, 401
        token_invoke = current_app.config.get("encrypt")("123654789").decode()
        additional_claims = {"sub": user.get("userId"), "aud": user.get("userId"), "invoke": token_invoke}
        token = create_access_token(identity=user.get("userId"), expires_delta=False,
                                    additional_claims=additional_claims)
        user.update({"access_token": token})
        user.pop("password")
        current_app.logger.log(logging.INFO, "Login successful", extra={"userId": user.get("userId")})
        db.update("user", {"lastLogin": datetime.utcnow(), "invoke": token_invoke}, {"userId": user.get("userId")})
        return user


rparser = reqparse.RequestParser()
rparser.add_argument('username', type=str, help='User username')
rparser.add_argument('email', type=str, help='User email address')
rparser.add_argument('password', type=str, help='User password')


class FindUser(Resource):

    @jwt_required()
    def get(self):
        """
        Search Users
        ---
        tags:
          - Users
        security:
            - Bearer: []
        definitions:
            - schema:
                id: User
                properties:
                    userId:
                        type: number
                        description: Unique id of user
                    userName:
                        type: string
                        description: Username of user
                    email:
                        type: string
                        description: Email of user
                    userType:
                        type: number
                        description: User type 0=System 1=Admin 2=Operator
                    status:
                        type: number
                        description: User status 1=Active 2=In-Active

        parameters:
            - in: query
              name: username
        responses:
            200:
                schema:
                    $ref: "#/definitions/User"
                description: User found
        :return:
        """
        query = request.args.to_dict()
        username = query.get("username")
        if username is None or username == "":
            return {"status": "error", "message": "User name cannot be null"}, 422
        user = db.select_one("user", ["userId", "userName", "email", "userType"], {"userName": username})
        if user is None:
            return {"status": "error", "message": "Please click ADD to add the user"}, 404
        current_app.logger.log(logging.INFO, "Search user: {}".format(username), extra={"userId": current_user.get("userId")})
        return user

    @jwt_required()
    def post(self):
        """
        Create user
        ---
        tags:
            - Users
        security:
            - Bearer: []
        parameters:
            - in: body
              name: body
              schema:
                  id: Register
                  properties:
                    userName:
                        type: string
                        required: true
                    email:
                        type: string
                        required: true
                    password:
                        type: string
                        required: true
                    userType:
                        type: number
                        description: User type 0=System 1=Admin 2=Operator
        responses:
            200:
                schema:
                    $ref: "#/definitions/User"
                description: User Added
            422:
                schema:
                    $ref: "#/definitions/Error"
                description: Validation Error

        :return:
        """
        bcrypt = Bcrypt(current_app)
        args = rparser.parse_args()
        user = db.select_one("user", ["userId"], {"userName": args.get("username")})
        if user is None:
            encPassword = bcrypt.generate_password_hash(args.get("password")).decode()
            args.update({"password": encPassword})
            db.insert("user", args)
            current_app.logger.log(logging.INFO, "User registration successful: {}".format(json.dumps(args)), extra={"userId": current_user.get("userId")})
            return args
        else:
            current_app.logger.log(logging.ERROR,
                                   "User registration failed username already exists: {}".format(json.dumps(args)), extra={"userId": current_user.get("userId")})
            return {"status": "error", "message": "Username already exists"}, 422

    @jwt_required()
    def put(self):
        """
        Update User Password
        ---
        tags:
            - Users
        security:
            - Bearer: []
        parameters:
            - in: body
              name: body
              schema:
                properties:
                    username:
                        type: string
                        description: Username of user
                    password:
                        type: string
                        description: Password of user
        responses:
            200:
                schema:
                    $ref: "#/definitions/User"
                description: User Password Updated
            422:
                schema:
                    $ref: "#/definitions/Error"
                description: User Not Found
        :return:
        """
        bcrypt = Bcrypt(current_app)
        username = rparser.parse_args().get("username")
        password = rparser.parse_args().get("password")
        user = db.select_one("user", ["userId"], {"userName": username})
        if user is None:
            current_app.logger.log(logging.ERROR,
                                   "Username not exists: {}".format(
                                       json.dumps({"username": username, "password": password})), extra={"userId": current_user.get("userId")})
            return {"status": "error", "message": "Username not exists"}, 422
        else:
            epassword = bcrypt.generate_password_hash(password).decode()
            db.update("user", {"password": epassword, "passwordChanged": datetime.utcnow()}, {"userName": username})
            current_app.logger.log(logging.INFO, "Password updated for user {} `{}`".format(user.get("userId"),
                                                                                            json.dumps(
                                                                                                {"username": username,
                                                                                                 "password": password})), extra={"userId": current_user.get("userId")})
            return user

    @jwt_required()
    def delete(self):
        """
        Delete User
        ---
        tags:
            - Users
        security:
            - Bearer: []
        parameters:
            - in: query
              name: userId
        responses:
            200:
                schema:
                    $ref: "#/definitions/User"
                description: User Password Updated
            422:
                schema:
                    $ref: "#/definitions/Error"
                description: User Not Found
        :return:
        """
        query = request.args.to_dict()
        user_id = query.get("userId")
        user = db.select_one("user", ["*"], {"userId": user_id})
        if user is None:
            current_app.logger.log(logging.ERROR,
                                   "Delete User not exists: {}".format(user_id), extra={"userId": current_user.get("userId")})
            return {"status": "error", "message": "User not exists"}, 422
        else:
            db.delete("user", {"userId": user_id})
            current_app.logger.log(logging.INFO, "User Deleted `{}`".format(json.dumps(user)), extra={"userId": current_user.get("userId")})
            return user


class UserList(Resource):

    @jwt_required()
    def get(self):
        """
        List All Users
        ---
        tags:
            - Users
        security:
            - Bearer: []
        responses:
            200:
                schema:
                    type: array
                    items:
                        $ref: "#/definitions/User"
                description: Users
            404:
                schema:
                    $ref: "#/definitions/Error"
                description: Users Not Found
        :return:
        """
        user = db.select("user", ["userId", "userName", "email", "userType", "status"])
        if user is None:
            return {"status": "error", "message": "Not found"}, 404
        current_app.logger.log(logging.INFO, "User list", extra={"userId": current_user.get("userId")})
        return user
