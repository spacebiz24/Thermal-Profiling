#!/bin/bash

# Infinite loop to keep checking for the inserted device
while true; do
    # Check if the inserted device is a storage device
    if [ -b "/dev/$1" ]; then
        # Get the device type
        device_type=$(udevadm info --query=property --name="/dev/$1" | grep "ID_BUS=" | cut -d "=" -f2)

        # Check if the device is a USB mass storage device or a card reader
        if [ "$device_type" = "usb" ] || [ "$device_type" = "mmc" ]; then
            # Mount the device
            mount "/dev/$1" /mnt

            # Check if data.txt exists on the mounted device
            if [ -f "/mnt/data.txt" ]; then
                # Copy data.txt to the desired location
                cp "/mnt/data.txt" "/home/DRDO"

                # Unmount the device
                umount /mnt
            else
                echo "data.txt not found on the inserted device."
                # Unmount the device
                umount /mnt
            fi
        else
            echo "The inserted device is not a USB mass storage device or a card reader."
        fi
    else
        echo "Invalid device."
    fi

    # Add a delay (sleep) to avoid constant looping and reduce system load
    sleep 10
done
#!/bin/bash

# Check if the inserted device is a storage device
if [ -b "/dev/$1" ]; then
   # Get the device type
   device_type=$(udevadm info --query=property --name="/dev$1" | grep "ID_BUS=" | cut -d"=" -f2)

   # Check if storage or card reader
   if ["$device_type" = "usb"] || ["$device_type" = "mmc"]; then
      # Mount device
      mount "/dev/$1" /mnt

      # Check if data.txt exists
      if [ -f "/mnt/data.txt" ]; then
         # Copy data.txt
         cp "/mnt/data.txt" "/home/DRDO/"

         # Unmount device
         unmount /mnt
      else
         echo "data.txt not found"
         # Unmount
         unmount /mnt
      fi
   else
      echo "storage device not found - not mmc or usb"
   fi
else
   echo "Invalid device"
fi
