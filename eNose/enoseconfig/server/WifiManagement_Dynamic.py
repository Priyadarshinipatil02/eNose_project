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



class WifiManagement_Dynamic(Resource):

    def get(self):
        return self.get_ethernet_ip()
    
    def post(self):
        return self.modify_connection()
    
    # def put(self):
    #     return self.edit_wifi_ip()

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

    # @staticmethod
    # def get_bssid():
    #     command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
    #     # Run the command and capture the output
    #     result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
    #     # command = "iwconfig wlan0 | grep 'ESSID' | awk -F'\"' '{print $2}'"
            
    #     # Check if the command was successful
    #     if result.returncode == 0:
    #         # Extract and return the ESSID
    #         return result.stdout.strip()
    #     else:
    #         # If there was an error, print the stderr
    #         return None

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
    
    
    @jwt_required()
    def get_ethernet_ip(self):
        check_wifi_connection = self.check_wifi_connection()
        if check_wifi_connection:
            try:
                # ip_data = subprocess.run(["ip", "-o", "address", "show", "eth0"], capture_output=True, text=True, check=True)
                print("check wifi connnection:::::::::::",check_wifi_connection)
                ip_data = subprocess.run(["ip", "addr", "show", "wlan0"], capture_output=True, text=True, check=True)
                ip_data = str(ip_data)
                print("ipdattaaa",ip_data)       
                # Extract IP, subnet mask, and gateway from the parsed output
                subnet_mask=""
                ip_data1 = str(ip_data)
                # Modified regular expression pattern to match the desired IPv4 address format
                ipv4_pattern1 = r'inet (\d+\.\d+\.\d+\.\d+)/24'
                match1 = re.findall(ipv4_pattern1, ip_data1)
                ip_data1 = match1
                print("LLiSSTTT",ip_data1)
                ipv4_pattern2 = r'inet (\d+\.\d+\.\d+\.\d+)/\d+.*dynamic'
                match2 = re.search(ipv4_pattern2, ip_data)
                dhcp_enabled = True
                if len(ip_data1)!=1 and len(ip_data1)!=0:
                    dhcp_enabled = False
                    if match1:
                        ip_data1 = ip_data1[-1]
                        current_app.logger.info(ip_data1)
                        print("newsssssssssssss",ip_data1)
                        subnet_mask =subnet_mask +"255.255.0.0"
                        gateway = self.get_gateway()
                        return jsonify({
                            "default_ip_address": ip_data1,
                            "default_subnet_mask": subnet_mask,
                            "default_gateway": gateway,
                            "dhcp_enabled": dhcp_enabled
                        })
                elif len(ip_data1) == 1:
                    if match2:
                        ip_data = match2.group(1)
                        subnet_mask =subnet_mask +"255.255.0.0"
                        gateway = self.get_gateway()
                        return jsonify({
                            "default_ip_address": ip_data,
                            "default_subnet_mask": subnet_mask,
                            "default_gateway": gateway,
                            "dhcp_enabled": True
                        })
                    else:
                        ip_data = None
                        subnet_mask =subnet_mask +"255.255.0.0"
                        gateway = self.get_gateway()
                        return jsonify({
                            "default_ip_address": ip_data,
                            "default_subnet_mask": subnet_mask,
                            "default_gateway": gateway,
                            "dhcp_enabled": True
                        })

                    
                else:
                    return None
            except Exception as e:
                print("Error:", e)
                return None

        else:
            return jsonify({"default_ip_address":"106.203.210.15","default_subnet_mask":"255.255.255.0","default_gateway":"192.68.1.1","dhcp_enabled": True})
   

    # @jwt_required()
    # def edit_wifi_ip(self):
    #     try:
    #         print("HHHHHHHHHHHHHHHHHHHHHHHHHHHHhhh")
    #         current_bssid = self.get_bssid()
    #         result = wifi_ip_and_reboot.update_wifi_ip_address(current_bssid)
    #         return result
    #     except Exception as e:
    #         return jsonify({"default_ip_updated":"106.204.210.00"})

    @jwt_required()
    def modify_connection(self):
        try:
            # Command to modify the network connection using nmcli
            modify_command = "sudo nmcli connection modify sphinxworldbiz ipv4.method auto ipv4.address ''"
            
            # Run the command to modify the connection
            subprocess.run(modify_command, shell=True, check=True)
            
            print("Network connection modified successfully.")

            release_dhcp = "sudo dhclient -r wlan0"
            subprocess.run(release_dhcp, shell=True, check=True)

            print("dhcp releaseddddddddddd")

            renew_dhcp = "sudo dhclient wlan0"
            subprocess.run(renew_dhcp, shell=True, check=True)

            print("dhcp renewweeeeeedddddddddd")

            # Command to restart the NetworkManager service
            restart_command = "sudo systemctl restart NetworkManager"
            
            # Run the command to restart NetworkManager
            subprocess.run(restart_command, shell=True, check=True)
            print("NetworkManager service restarted.")

            reboot_command = "sudo reboot"
            subprocess.run(reboot_command, shell=True, check=True)
            print("Raspberry pi is rebooting.")
            
            
        except subprocess.CalledProcessError as e:
            print("Error modifying network connection or restarting NetworkManager:", e)



