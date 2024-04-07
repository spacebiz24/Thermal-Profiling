# SDA Troubleshooting Device

Sensor Data Analysis and Troubleshooting Device

## GUI component for a project intended for DRDO 

- Automatically mounts any drive (storage - USB, MMC)
- Copies data from the mounted drive and reboots
- Automatically runs the GUI on startup

## Setup:

1. Edit autorun to run UIV20.py on startup
2. Edit rc.local to run copy_meow.py in background
3. Reboot pi and have fun :)

### Note: Please do clone the repository and then install the dependencies.

```
git clone https://github.com/DivakarGC/SDA-troubleshooting-device.git

pip install -r requirements.txt
```

