import json
import logging
from flask import current_app, request, jsonify
from flask_restful import Resource, reqparse
from . import db
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, current_user
from datetime import datetime
from . import wifi_scan12
parser = reqparse.RequestParser()

class WifiManagement2(Resource):
    def post(self):
        try:
            return self.disconnect_wifi()
        except Exception as e:
            print(f"Error fetching Wi-Fi information: {e}")
            return {"connection_status":["Disonnected to wifi NETGEAR45"]}
        
    @jwt_required()
    def disconnect_wifi(self):
        """Disconnects the currently connected Wi-Fi network by clearing its configuration."""

        try:
            wifi_scan12.disconnect_to_wifi()
            return {"connection_status_bssid":["Disconnected to wifi successfully"]}

        except Exception as e:
            return {"connection_status_bssid":["disconnected to network AIRTEL456"]}