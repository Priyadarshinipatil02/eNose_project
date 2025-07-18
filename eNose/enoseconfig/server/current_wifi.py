from flask import Flask, jsonify, request,current_app
from flask_jwt_extended import jwt_required
from flask_restful import Resource,reqparse
from subprocess import check_output
from . import ipaddress_and_reboot
from . import wifi_ip_and_reboot
parser = reqparse.RequestParser()
parser = reqparse.RequestParser()
parser.add_argument("ip_address", type=str, required=True)
parser.add_argument("subnet_mask", type=str, required=True)
parser.add_argument("gateway", type=str, required=True)
import subprocess
import ipaddress
import re
import shlex


class Current_Wifi(Resource):

    def get(self):
        return self.get_wifi_essid()

    @staticmethod
    def get_ip_address():
        command = "ip addr show wlan0 | grep 'inet ' | grep 'dynamic' | awk '{ print $2; }' | awk -F'/' '{ print $1; }'"
        # result = subprocess.run(['ip', 'addr', 'show', 'wlan0'], stdout=subprocess.PIPE)
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        # ip_address = result.stdout.decode().split('inet ')[1].split('/')[0]
        if result.returncode == 0:
            # Extract and return the ESSID
            return result.stdout.strip()
        else:
            # If there was an error, print the stderr
            return None

    @staticmethod
    def get_bssid():
        command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
        # Run the command and capture the output
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        # command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
            
        # Check if the command was successful
        if result.returncode == 0:
            # Extract and return the ESSID
            return result.stdout.strip()
        else:
            # If there was an error, print the stderr
            return None
    
    
    
    def get_wifi_essid(self):
        try:
            wifi_bssid = self.get_bssid()
            if wifi_bssid is None:
                raise Exception("No Wi-Fi network connected")

            wifi_ipaddress = self.get_ip_address()
            if wifi_ipaddress is None:
                print("hhhhhhhhhhhhhhhhhhhh")
                raise Exception("No IP address found for Wi-Fi network")
            
            return {
                "connected_wifi_network": wifi_bssid,
                "ip_address": wifi_ipaddress
            }
        except Exception as e:
            current_app.logger.error(str(e))
            print("Addddddddddddddddddd")
            return {
                "connected_wifi_network": None,
                "ip_address": None
            }
