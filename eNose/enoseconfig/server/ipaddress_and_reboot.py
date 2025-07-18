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
def change_static_ip(new_ip):
    dhcpcd_conf_path = '/etc/dhcpcd.conf'

    # Read the current dhcpcd.conf
    with open(dhcpcd_conf_path, 'r') as file:
        lines = file.readlines()

    # Modify the relevant lines
    for i, line in enumerate(lines):
        if line.startswith('interface eth0'):
            # Assuming the static ip_address line follows immediately after 'interface eth0'
            lines[i+1] = f'static ip_address={new_ip}/24\n'
            break

    # Write the modified configuration back to dhcpcd.conf
    with open(dhcpcd_conf_path, 'w') as file:
        file.writelines(lines)

import ipaddress

def is_valid_ip(ip_str):
    try:
        ipaddress.IPv4Address(ip_str)
        return True
    except ipaddress.AddressValueError:
        return False
def update_ip_address():
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
    change_static_ip(ip_address)

    release_dhcp = "sudo dhclient -r eth0"
    subprocess.run(release_dhcp, shell=True, check=True)
    print("dhcp released for ethernet")
    
    renew_dhcp = "sudo dhclient eth0"
    subprocess.run(renew_dhcp, shell=True, check=True)

    print("dhcp renewweeeeeedddddddddd")

    # Command to restart the NetworkManager service
    # restart_command = "sudo systemctl restart networking"
    
    # # Run the command to restart NetworkManager
    # subprocess.run(restart_command, shell=True, check=True)
    # print("NetworkManager service restarted for ethernet.")
    # change_static_ip(ip_address, subnet_mask, gateway)
    reboot_pi()  # Reboot to apply changes
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
        change_static_ip(args.ip_address, args.subnet_mask, args.gateway)

