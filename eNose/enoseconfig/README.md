# eNose

## Requirements
1. Python 3.9 OR above

## Copy all file to required directory
## Change directory permission
```python
chown -R {USER}:{GROUP} ./
```
## Setup
```python
python -m venv venv
source ./venv/bin/activate (Linux)
venv\Scripts\activate (Windows)
```
## Upgrade pip to latest
```python
python -m pip --upgrade pip
```
## Install required packages
```python
pip install -r requirements.txt
```
## Create a database first time
```python
flask init-db
```
## Raspbian Platform
```python
pip install gunicorn
sudo cp enoseconfig.service /lib/systemd/system
sudo systemctl daemon-reload
```
### Start Application
``
sudo systemctl start enoseconfig
``
### Stop Application
``
sudo systemctl stop enoseconfig
``
### Restart Application
``
sudo systemctl restart enoseconfig
``
### Check status of Application
``
sudo systemctl status enoseconfig
``
### Enable application start on boot
``
sudo  systemctl enable enoseconfig
``
### Disable application start on boot
``
sudo  systemctl disable enoseconfig
``
### Install and Start Network Manager --> First see the status

sudo systemctl status NetworkManager

# If the status is not showing "active" or "enabled" then run the below given commands
sudo apt-get install network-manager
sudo systemctl start NetworkManager
