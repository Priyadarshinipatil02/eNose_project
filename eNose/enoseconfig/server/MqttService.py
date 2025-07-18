import paho.mqtt.client as mqtt
import instance.config as mqttconfig

latest_message = ''


# MQTT callback when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    client.subscribe(mqttconfig.MQTT_TOPIC)  # Subscribe to the topic


# MQTT callback when a message is received from the broker
def on_message(client, userdata, msg):
    global latest_message
    latest_message = msg.payload.decode()
    print(f"Received message : {latest_message}")


# Function to start the MQTT client loop in a separate thread
def start_mqtt():
    try:
        client = mqtt.Client()
        client.connect(mqttconfig.MQTT_BROKER, 1883, 60)
        client.loop_forever()
    except Exception as e:
        print(f"MQTT connection failed: {e}")