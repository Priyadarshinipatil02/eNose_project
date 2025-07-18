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

class WifiManagement(Resource):
    
    # def get(self):  # Explicitly define the GET method
    #     return self.fetch_available_ssids(), self.fetch_all_available_networks()# Call the renamed function
    def get(self):
        try:
            ssid_list = self.fetch_available_ssids()
            available_networks = self.fetch_all_available_networks()
            return {
                "available_ssids": ssid_list,
                "available_networks": available_networks
            }

        except Exception as e:
            print(f"Error fetching Wi-Fi information: {e}")
            return {"ssid_list":["NETGEAR35", "TP-LINK_4F8D", "Linksys4630"]}
    
    # def post(self):
    #     try:
    #         connect_wifi = self.connect_to_bssid()
    #         disconnect_wifi = self.disconnect_wifi()
    #         return {
    #             "connect_wifi": connect_wifi,
    #             "disconnect_wifi": disconnect_wifi
    #         }

    #     except Exception as e:
    #         print(f"Error fetching Wi-Fi information: {e}")
    #         return {"connection_status":["Connected to wifi NETGEAR45"]}
    def post(self):
        try:
            return self.connect_to_bssid()
        except Exception as e:
            print(f"Error fetching Wi-Fi information: {e}")
            return {"connection_status":["Connected to wifi NETGEAR45"]}
            # return jsonify({"error": "Incorrect password provided"}), 401

    
    @jwt_required()
    def fetch_available_ssids(self):

        try:
            ssid_list = wifi_scan12.scan_wifi()
            # json_ssid_list = json.dumps(ssid_list) #converts the list to json
            # return ssid_list
            return {"default_ssids":ssid_list}

        except Exception as e:
            print(f"Error scanning Wi-Fi networks: {e}")
            return {"default_ssids":["NETGEAR35", "TP-LINK_4F8D", "Linksys4630"]}# Example list of SSIDs
                    # Return a blank list in case of errors
        
    # def post(self):
    #     return self.connect_to_bssid()
    
    

    @jwt_required() 
    def fetch_all_available_networks(self):
        """Scans for available Wi-Fi networks and prints their SSIDs."""

        try:
            ssid_list = wifi_scan12.scan_wifi()
            print("Returning ssid list")
            # return ssid_list
            return {"default_wifi_networks":ssid_list}

        except Exception as e:
            print(f"Error scanning Wi-Fi networks: {e}")
            return {"default_wifi_networks":["tikona","airtel987","wifi_bsnl"]}

    # @jwt_required()
    # def disconnect_wifi(self):
    #     """Disconnects the currently connected Wi-Fi network by clearing its configuration."""

    #     try:
    #         subprocess.run(["sudo", "rm", "/etc/wpa_supplicant/wpa_supplicant.conf"], check=True)
    #         subprocess.run(["sudo", "systemctl", "restart", "dhcpcd"], check=True)

    #         return "Wi-Fi disconnected successfully", 200

    #     except Exception as e:
    #         return f"Failed to disconnect Wi-Fi: {e}"
    # @jwt_required()
    # def disconnect_wifi(self):
    #     """Disconnects the currently connected Wi-Fi network by clearing its configuration."""

    #     try:
    #         wifi_scan12.disconnect_to_wifi()

    #     except Exception as e:
    #         return {"connection_status_bssid":["disconnected to network AIRTEL456"]}
        
    # @jwt_required()
    # def connect_to_bssid(self):
    #     bssid = request.json.get("bssid")
    #     password = request.json.get("password")

    #     if not all([bssid, password]):
    #         return jsonify({"error": "Missing required parameters: bssid and password"}), 400

    #     try:
    #         wifisetup2.change_wifi_config(bssid, password)  # Assuming SSID is not needed for BSSID-based connection
    #         ipaddress_and_reboot.reboot_pi()  # Reboot to apply changes
    #         return jsonify({"message": "Connected to Wi-Fi successfully"}), 200
    #     except Exception as e:
    #         return f"Failed to connect Wi-Fi: {e}"
    
    @jwt_required()
    def connect_to_bssid(self):
        try:
            wifi_scan12.connection_to_bssid()
            return {"connection_status_bssid":["Connected to wifi successfully"]}
        except Exception as e:
            return {"connection_status_bssid":["Incorrect Password Provided"]},200
    
    