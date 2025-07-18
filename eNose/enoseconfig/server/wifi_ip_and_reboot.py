import subprocess
from flask import Flask, jsonify, request
import argparse

def reboot_pi():
    subprocess.run(["sudo", "reboot"])

# def change_static_ip(ip_address, subnet_mask, gateway):
#     # Remove existing network configuration file
#     subprocess.run(["sudo", "rm", "/etc/dhcpcd.conf"])

#     # Create a new network configuration file
#     with open("dhcpcd.conf", "w") as file:
#         file.write(f"interface eth0\n")
#         file.write(f"static ip_address={ip_address}/{subnet_mask}\n")
#         file.write(f"static routers={gateway}\n")

#     # Move the new configuration file to the appropriate directory
#     subprocess.run(["sudo", "mv", "dhcpcd.conf", "/etc/"])

#     # Restart the network interface
#     subprocess.run(["sudo", "systemctl", "restart", "dhcpcd"])
def change_wifi_static_ip(new_bssid,new_ip):
    command = f"sudo nmcli connection modify {new_bssid} ipv4.method manual ipv4.addresses {new_ip}/24"
    result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
    if result.returncode == 0:
            # Extract and return the ESSID
            return result.stdout.strip()
    else:
        # If there was an error, print the stderr
        return None
    

import ipaddress

def is_valid_ip(ip_str):
    try:
        ipaddress.IPv4Address(ip_str)
        return True
    except ipaddress.AddressValueError:
        return False
def update_wifi_ip_address(current_bssid):
    current_bssid = current_bssid
    ip_address = request.json.get("ip_address")
    # print("ip_adresss222222222222222",ip_address)
    # print("77777777777777777777777777")
    subnet_mask = request.json.get("subnet_mask")
    gateway = request.json.get("gateway")
    if ip_address is None:
        return jsonify({"message":"Please Provide the ip address in the payload"})
    if subnet_mask is None:
        return jsonify({"message":"Please Provide the subnet mask address in the payload"})
    if gateway is None:
        return jsonify({"message":"Please Provide the gateway in the payload"})
    

    if not is_valid_ip(ip_address):
        # print("amaann")
        return jsonify({"error": "Invalid IP address format"})
        
    print("88888888888888888888888888888888")
    change_wifi_static_ip(current_bssid,ip_address)
    # change_static_ip(ip_address, subnet_mask, gateway)
    # release_dhcp = "sudo dhclient -r wlan0"
    # subprocess.run(release_dhcp, shell=True, check=True)
    refresh_dynamic_ip = f"sudo nmcli connection modify {current_bssid} ipv4.method auto"
    subprocess.run(refresh_dynamic_ip, shell=True, check=True)

    # print("dhcp releaseddddddddddd")

    restart_net_service = "sudo systemctl restart networking.service"
    subprocess.run(restart_net_service, shell=True, check=True)

    # print("dhcp renewweeeeeedddddddddd")

    # Command to restart the NetworkManager service
    restart_command = "sudo systemctl restart NetworkManager"
    
    # Run the command to restart NetworkManager
    subprocess.run(restart_command, shell=True, check=True)
    # print("NetworkManager service restarted.")

    # reboot_pi()  # Reboot to apply changes
    reboot_command = "sudo reboot"
    subprocess.run(reboot_command, shell=True, check=True, capture_output=True, text=True)
    return jsonify({"ip_address": ip_address,"subnet_mask":subnet_mask , "gateway":gateway})


# if __name__ == "__main__":
#     # Example usage
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Change static IP configuration or reboot the system.")
    parser.add_argument("--reboot", action="store_true", help="Reboot the system")
    parser.add_argument("--ip_address", type=str, help="IP address")
    parser.add_argument("--subnet_mask", type=str, help="Subnet mask")
    parser.add_argument("--gateway", type=str, help="Gateway address")
    args = parser.parse_args()

    if args.reboot:
        reboot_pi()
    else:
        if args.ip_address is None or args.subnet_mask is None or args.gateway is None:
            parser.error("IP address, subnet mask, and gateway must be provided.")
        change_wifi_static_ip(args.ip_address, args.subnet_mask, args.gateway)

