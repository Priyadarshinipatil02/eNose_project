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


class Bssid (Resource):

    def get(self):
        return self.get_wifi_essid()

    # def put(self):
    #     return self.edit_wifi_ip()
    
    # def put(self):
    #     return self.update_ip()

    # @staticmethod
    # def check_ethernet_connection():
    #     try:
    #         # Run nmcli to get device information
    #         print("started checking ethernet connnection::::::::::::")
    #         output = subprocess.check_output(['nmcli', 'device', 'show', 'eth0']).decode('utf-8')
    #         output = str(output)
    #         print("output:ethernettt::::::::::::::::",output)
    #         state_match = re.search(r'GENERAL.STATE:\s+(\d+)\s+\((\w+)\)', output)
    #         if state_match:
    #             state_code = int(state_match.group(1))
    #             state = state_match.group(2)
    #             if state == 'connected':
    #                 return True
    #             else:
    #                 return False
    #         else:
    #             # If GENERAL.STATE field is not found, assume not connected
    #             return False
    #     except Exception as e:
    #         print("Error:", e)
    #         return False

    @staticmethod
    def check_wifi_connection():
        try:
            # Run nmcli to get device information
            print("started checking ethernet connnection::::::::::::")
            output = subprocess.check_output(['nmcli', 'device', 'show', 'wlan0']).decode('utf-8')
            output = str(output)
            print("output wififif:::::::::::::::::",output)
            state_match = re.search(r'GENERAL.STATE:\s+(\d+)\s+\((\w+)\)', output)
            if state_match:
                state_code = int(state_match.group(1))
                state = state_match.group(2)
                if state == 'connected':
                    return True
                else:
                    return False
            else:
                # If GENERAL.STATE field is not found, assume not connected
                return False
        except Exception as e:
            print("Error:", e)
            return False
    
    # @jwt_required
    @staticmethod
    def get_gateway():
        try:
            print("aman:::::::::::::::::::::::::::::::")
            output = subprocess.run(['ip', 'route', 'show', 'default'], capture_output=True, text=True,check = True)
            # result = "default via 192.168.3.2 dev eth0 proto dhcp src 192.168.3.146 metric 100"
            print("output",output)
            output = str(output)
            gateway_match = re.search(r'default via (\S+)', output)
            if gateway_match:
                gateway = gateway_match.group(1)
                return gateway
            else:
                return None
        except Exception as e:
            print("Error:", e)
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
    
    
    @jwt_required()
    def get_wifi_essid(self):
    # Command to retrieve ESSID using iwconfig, grep, and awk
        # command = "iwconfig wlan0 | grep 'ESSID'"
        wifi_bssid = self.get_bssid()
        # return wifi_bssid
        return {        
                "connected_wifi_network": wifi_bssid
            }
        # command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
        # # Run the command and capture the output
        # result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        # # command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
            
        # # Check if the command was successful
        # if result.returncode == 0:
        #     # Extract and return the ESSID
        #     return result.stdout.strip()
        # else:
        #     # If there was an error, print the stderr
        #     return None
       
        #     print('ip:::::::data::::::::',ip_data,'typeeeeeeeeeeeeee::::',type(ip_data))
        #     ip_address, subnet_mask, gateway = ip_data.stdout.splitlines()[1].split()[3:6]

        #     # Check for DHCP configuration
        #     dhcp_enabled = "dhcp" in subprocess.run(["grep", "dhcp", "/etc/dhcpcd.conf"], capture_output=True, text=True).stdout.lower()
                        
        #     # ip_address = "106.253.20.15"
        #     # subnet_mask = "106.253.20.15"
        #     # gateway = "106.253.20.15"
        #     # dhcp_enabled = True
            
        #     return jsonify({
        #         "default_ip_address": ip_address,
        #         "default_subnet_mask": subnet_mask,
        #         "default_gateway": gateway,
        #         "dhcp_enabled": dhcp_enabled
        #     })

        # else:
        #     return jsonify({"default_ip_address":"106.203.210.15","default_subnet_mask":"255.255.255.0","default_gateway":"192.68.1.1","dhcp_enabled": True})
   

    # @jwt_required()
    # def edit_wifi_ip(self):
    #     try:
    #         print("HHHHHHHHHHHHHHHHHHHHHHHHHHHHhhh")
    #         current_bssid = self.get_bssid()
    #         result = wifi_ip_and_reboot.update_wifi_ip_address(current_bssid)
    #         return result
    #     except Exception as e:
    #         return jsonify({"default_ip_updated":"106.204.210.00"})
