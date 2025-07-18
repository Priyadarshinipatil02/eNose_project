import subprocess
import os
import shlex
from flask import current_app,jsonify
# def change_wifi_config(bssid, password):
#     current_app.logger.info("entered change wifi config function")
#     print("entered change wifi config function")
#     config_file = '/etc/wpa_supplicant/wpa_supplicant.conf'
#     if os.path.exists(config_file):
#         print("config_file exists")
#     else:
#         print("config_file does not exists")
#     new_config = f'''country=US
# ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
# update_config=1

# network={{
#     bssid="{bssid}"
#     psk="{password}"
#     key_mgmt=WPA-PSK
# }}'''

#     # Write the new configuration to a temporary file
#     current_app.logger.info("about to start writing process")
#     print("about to start writing process")
#     temp_file = '/tmp/temp_wpa_supplicant.conf'
#     # if os.path.exists(temp_file):
#     #     print("temp file exists")
#     # else:
#     #     print("temp file does not exists")
#     ## To read contents of a file"
#     # try:
#     #     with open(temp_file,'r') as f:
#     #         contents = f.read()
#     #         return contents
#     # except Exception as e:
#     #     print(f"error reading file: {temp_file} , error :{e}")
#     #     return None
#     # with open(temp_file, 'w') as file:
#     #     file.write(new_config)
#     try:
#         with open(temp_file, "w") as f:
#             f.write(new_config)
#     except OSError as e:
#         raise RuntimeError(f"Error writing to temporary file: {e}")
#     if os.path.exists(temp_file):
#         print("temp file exists")
#     else:
#         print("temp file does not exists")
#     ######################
#     print("ammmmmmmmmmmmmmmmmmmmmmmmmmm")
#     try:
#         with open(temp_file,'r') as f:
#             contents = f.read()
#             print("ssssssssscontents",contents)
#     except Exception as e:
#         print(f"error reading file: {temp_file} , error :{e}")
#         return None
#     # To read contents of a file"
#     print("amdddssssssssssssssssssssss")
#     print("temp_file:::::::::::::::::::::",temp_file)
#     current_app.logger.info("Completed writing process")
#     print("completed writing process")
#     # Move the temporary file to the actual configuration file
#     current_app.logger.info("readty to start sudo mv")
#     print("ready to start sudo mv")
#     try:
#         subprocess.run(['sudo', 'mv', temp_file, config_file], check=True)
#         current_app.logger.info("ready to start sudo chmod 600.....")
#         print("ready to start sudo chmod 600")
#         subprocess.run(['sudo', 'chmod', '600', config_file], check=True)
#         print("configgggggggggggggggg:::::::::::::::",config_file)
#         # Restart the networking ce
#         #subprocess.run(["sudo", "systemctl", "restart", "wpa_supplicant"], check=True)
#         subprocess.run(['sudo', 'systemctl', 'restart', 'dhcpcd'], check=True)
#         current_app.logger.info("restarted wifi::::::::::::::::::::::::::")
    
#     except subprocess.CalledProcessError as e:
#         current_app.logger.error("eror : ",e.output)
#         raise RuntimeError ("failed to configure to wifi")
def change_wifi_config(bssid, password):
    # Validate inputs
    if not all([bssid, password]):
        current_app.logger.info("Missing required parameters: BSSID and password")
        raise ValueError("Missing required parameters: BSSID and password")

    try:
        # Command to connect to a specific BSSID
        command = f"sudo nmcli device wifi connect '{bssid}' password '{password}'"
        current_app.logger.info(f"commandddd::::::::::{command}")
        # Execute the command
        subprocess.run(shlex.split(command), check=True)
        print("started connecting wififffffffffffffffffffff")

        current_app.logger.info("Successfully connected to Wi-Fi network with BSSID %s", bssid)
        print("Connected to wifi")
        return jsonify({"connection_status_bssid": "Connected to Wi-Fi + " + str(bssid)}), 200

    except subprocess.CalledProcessError as e:
        current_app.logger.error("Error connecting to Wi-Fi network: %s", e)
        print("error is coming")

        raise ConnectionError("Error connecting to Wi-Fi network") from e

    except Exception as e:
        current_app.logger.error("An unexpected error occurred: %s", e)
        raise e


# def change_wifi_config(bssid, password):
#     try:
#         # Formulate the nmcli command to connect to the Wi-Fi network
#         command = f"nmcli device wifi connect '{bssid}' password '{password}'"
        
#         # Execute the command and capture the output
#         result = subprocess.run(shlex.split(command), capture_output=True, text=True,  check=False)
        
#         # Check if the connection was successful based on the output
#         if "successfully activated" in result.stdout:
#             return True
#         else:
#             return False
            
#     except subprocess.CalledProcessError as e:
#         # Log the error if the command returns a non-zero exit status
#         print(f"Error connecting to Wi-Fi network: {e}")
#         return False

#     except Exception as e:
#         # Log any unexpected errors
#         print(f"An unexpected error occurred: {e}")
#         return False











 
