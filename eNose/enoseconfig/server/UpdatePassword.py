from flask import request, jsonify, current_app, request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import datetime
from . import db
from flask_bcrypt import Bcrypt

rparser = reqparse.RequestParser()
# rparser.add_argument('username', type=str, help='User username')
rparser.add_argument('old_password', type=str, help='Old User password')
rparser.add_argument('new_password', type=str, help='New_password')
rparser.add_argument('confirm_password', type=str, help='Confirm_password')

print("inital imports crossed")

class UpdatePassword(Resource):
    @jwt_required()
    def put(self):
        print("Entered the class")
        bcrypt = Bcrypt(current_app)
        username  = get_jwt_identity()  # Get username from JWT token
        print("usernameeeeeeeeeeee",username)
        # username = rparser.parse_args().get("username")
        old_password = rparser.parse_args().get("old_password")
        new_password = rparser.parse_args().get("new_password")
        confirm_password = rparser.parse_args().get("confirm_password")

        user = db.select_one("user", ["userId", "password"], {"userId": username })
        print("USERRRRRRRRRRRRRR",user)
        

        if user is None:
            print("Entered If loop")
            # current_app.logger.error(f"Incorrect Username: {username}")
            return {"status": "error", "message": "Incorrect Username"}, 422

        elif not bcrypt.check_password_hash(user.get("password"), old_password):
            print("Entered elif loop1")
            # current_app.logger.error(f"Incorrect Old Password for user: {username}")
            return {"status": "error", "message": "Incorrect Old Password"}, 422
        
        elif old_password == new_password:
            return jsonify({"message":"Old password and new password cant be same"})

        elif new_password != confirm_password:
            print("Entered elif loop 02")
            return {"status": "error", "message": "New password and confirm password do not match"}, 422

        else:
            print("entered else loop")
            # Hash the new password before updating in the database
            hashed_new_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            # Update the user's password in the database
            db.update("user", {"password": hashed_new_password, "passwordChanged": datetime.utcnow()}, {"userId": username })

            current_app.logger.info(f"Password updated for user {user.get('userId')}")
            return jsonify({"message": "Password updated successfully"})
