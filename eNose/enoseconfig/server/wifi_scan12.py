import argparse
import subprocess
import re
import shlex
from flask import current_app, request, jsonify
from . import wifisetup2
from . import ipaddress_and_reboot

def scan_wifi():
    print("Wifi scanning starts......")
    current_app.logger.info("Wifi scanning is starting................")
    result = subprocess.run(["sudo", "iwlist", "wlan0", "scan"], capture_output=True, text=True)
    if result:
        current_app.logger.info(f"The data type of result is ::::::::::{type(result)}")
    result = f"{result}"
    current_app.logger.info("function for pattern has startedd::::::::::::")
    pattern = r'ESSID:"(.*?)"'
    matches = re.findall(pattern, result)
    current_app.logger.info("regex matching is done :::::::::::::::::::::")
    # Store the extracted ESSIDs in a list
    # ssid_list = {
    #     "ssid_key": matches
    # }
    ssid_list=matches
    return ssid_list
    
    
# def disconnect_to_wifi():
#     """Disconnects the currently connected Wi-Fi network by clearing its configuration."""

    
#     subprocess.run(["sudo", "rm", "/etc/wpa_supplicant/wpa_supplicant.conf"], check=True)
#     subprocess.run(["sudo", "systemctl", "restart", "dhcpcd"], check=True)

#     print("Wi-Fi disconnected successfully")
def disconnect_to_wifi():
    try:
        subprocess.run(["sudo", "nmcli", "device", "disconnect","wlan0"], check=True)
        current_app.logger.info("Disconnected from Wi-Fi network successfully")
        # return jsonify({"connection_status_bssid": "Disonnected to Wi-Fi successfully"}), 200
    except subprocess.CalledProcessError as e:
        current_app.logger.error("Error disconnecting from Wi-Fi network: %s", e)
        # Handle error as needed
        return False

def connection_to_bssid():
    current_app.logger.info("entered connection to bssid in wifiscan12 file")
    print("entered connection to bssid in wifiscan12")
    bssid = request.json.get("bssid")
    password = request.json.get("password")
    current_app.logger.info("after bssid and passworkd")
    print("after bssid and password")
    # if not all([bssid, password]):
    #     return jsonify({"error": "Missing required parameters: bssid and password"}), 400

    
    wifisetup2.change_wifi_config(bssid, password)  # Assuming SSID is not needed for BSSID-based connection
    # ipaddress_and_reboot.reboot_pi()  # Reboot to apply changes
    return jsonify({"connection_status_bssid": "Connected to Wi-Fi successfully"}), 200
    

    

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scan Wi-Fi networks and print SSID names.")
    parser.add_argument("--scan", action="store_true", help="Scan for Wi-Fi networks")
    args = parser.parse_args()

    if args.scan:
        scan_wifi()
    else:
        parser.print_help()
        
  # sudo python3 wifi_scan1.py --scan
