from flask import Flask, jsonify, request
from flask_jwt_extended import jwt_required
from flask_restful import Resource,reqparse
from subprocess import check_output
from . import ipaddress_and_reboot
parser = reqparse.RequestParser()
parser = reqparse.RequestParser()
parser.add_argument("ip_address", type=str, required=True)
parser.add_argument("subnet_mask", type=str, required=True)
parser.add_argument("gateway", type=str, required=True)
import subprocess
import ipaddress
import re



class RasberryPiEtherDynamic(Resource):

    def get(self):
        return self.get_ethernet_ip()
    
    def post(self):
        return self.nullify_static_ip()

    @staticmethod
    def check_ethernet_connection():
        try:
            # Run nmcli to get device information
            print("started checking ethernet connnection::::::::::::")
            output = subprocess.check_output(['nmcli', 'device', 'show', 'eth0']).decode('utf-8')
            output = str(output)
            print("output:ethernettt::::::::::::::::",output)
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

    # @staticmethod
    # def check_wifi_connection():
    #     try:
    #         # Run nmcli to get device information
    #         print("started checking ethernet connnection::::::::::::")
    #         output = subprocess.check_output(['nmcli', 'device', 'show', 'wlan0']).decode('utf-8')
    #         output = str(output)
    #         print("output wififif:::::::::::::::::",output)
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
    
    
    @jwt_required()
    def get_ethernet_ip(self):
        check_ethernet_connection = self.check_ethernet_connection()
        if check_ethernet_connection:
            try:
                # ip_data = subprocess.run(["ip", "-o", "address", "show", "eth0"], capture_output=True, text=True, check=True)
                print("check ethernet connnectionsssssss:::::::::::",check_ethernet_connection)
                ip_data = subprocess.run(["ip", "addr", "show", "eth0"], capture_output=True, text=True, check=True)
                ip_data = str(ip_data)
                print("ipdattaaa",ip_data)       
                # Extract IP, subnet mask, and gateway from the parsed output
                subnet_mask=""
                ip_data = str(ip_data)
                # Modified regular expression pattern to match the desired IPv4 address format
                # ipv4_pattern = r'inet (\d+\.\d+\.\d+\.\d+)/24\s+.*\bsecondary\b'
                # ipv4_pattern = r'inet (\d+\.\d+\.\d+\.\d+)/24\s+.*\bglobal secondary\b'
                ipv4_pattern =  r'inet ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)'
                ipv4_pattern2 = r'inet (\d+\.\d+\.\d+\.\d+)/24'
                print("patternhnnnnnnnnnnnnn::",ipv4_pattern)
                # match = re.search(ipv4_pattern, ip_data)
                match = re.findall(ipv4_pattern, ip_data)
                desired_ip = match[0] if match else None
                match2 = re.search(ipv4_pattern2, ip_data)
                print("matchhh::::::::",match)
                print("match2:::::::::::::",match2)
                
                dhcp_enabled = True
                if len(match)!=1 and len(match)!=0:
                    dhcp_enabled = False
                if match:
                    print("match one matchedddddddddddddddddd")
                    # ip_data = match.group(1)
                    ip_data = desired_ip
                    subnet_mask =subnet_mask +"255.255.255.0"
                    gateway = self.get_gateway()
                    return jsonify({
                        "default_ip_address": ip_data,
                        "default_subnet_mask": subnet_mask,
                        "default_gateway": gateway,
                        "dhcp_enabled": dhcp_enabled
                    })
                # elif match2:
                #     print("match 2 mappeddddddddddddd")
                #     ip_data = match2.group(1)
                #     subnet_mask =subnet_mask +"255.255.255.0"
                #     gateway = self.get_gateway()
                #     return ({
                #         "default_ip_address": ip_data,
                #         "default_subnet_mask": subnet_mask,
                #         "default_gateway": gateway,
                #         "dhcp_enabled": dhcp_enabled
                #     })
                else:
                    return None
            except Exception as e:
                print("Error:", e)
                return jsonify({"default_ip_address":"106.203.210.15","default_subnet_mask":"255.255.255.0","default_gateway":"192.68.1.1","dhcp_enabled": True})
        # check_wifi_connection = self.check_wifi_connection()
        # if check_wifi_connection:
        #     try:
        #         # ip_data = subprocess.run(["ip", "-o", "address", "show", "eth0"], capture_output=True, text=True, check=True)
        #         print("check wifi connnection:::::::::::",check_wifi_connection)
        #         ip_data = subprocess.run(["ip", "addr", "show", "wlan0"], capture_output=True, text=True, check=True)
        #         ip_data = str(ip_data)
        #         print("ipdattaaa",ip_data)       
        #         # Extract IP, subnet mask, and gateway from the parsed output
        #         subnet_mask=""
        #         ip_data = str(ip_data)
        #         # Modified regular expression pattern to match the desired IPv4 address format
        #         ipv4_pattern = r'inet (\d+\.\d+\.\d+\.\d+)/24'
        #         match = re.search(ipv4_pattern, ip_data)
        #         if match:
        #             ip_data = match.group(1)
        #             subnet_mask =subnet_mask +"255.255.0.0"
        #             gateway = self.get_gateway()
        #             return jsonify({
        #                 "default_ip_address": ip_data,
        #                 "default_subnet_mask": subnet_mask,
        #                 "default_gateway": gateway,
        #                 "dhcp_enabled": True
        #             })
        #         else:
        #             return None
        #     except Exception as e:
        #         print("Error:", e)
        #         return None
       
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

        else:
            return jsonify({"default_ip_address":"106.203.210.15","default_subnet_mask":"255.255.255.0","default_gateway":"192.68.1.1","dhcp_enabled": True})
   

    @jwt_required()
    def nullify_static_ip(self):
        try:
            dhcpcd_conf_path = '/etc/dhcpcd.conf'

            # Read the current dhcpcd.conf
            with open(dhcpcd_conf_path, 'r') as file:
                lines = file.readlines()

            # Modify the relevant lines
            for i, line in enumerate(lines):
                if line.startswith('interface eth0'):
                    # Assuming the static ip_address line follows immediately after 'interface eth0'
                    lines[i+1] = 'static ip_address=\n'
                    break

            # Write the modified configuration back to dhcpcd.conf
            with open(dhcpcd_conf_path, 'w') as file:
                file.writelines(lines)
            
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
        except Exception as e:
            return {"message":"An exception occured while processing the request may be the"}

# Call the function to change the static IP address to null


    # def update_ip(self):
    #     try:
    #         print("HHHHHHHHHHHHHHHHHHHHHHHHHHHHhhh")
    #         result = ipaddress_and_reboot.update_ip_address()
    #         return result
    #     except Exception as e:
    #         return jsonify({"default_ip_updated":"106.204.210.00"})