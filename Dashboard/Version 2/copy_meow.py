import os
import time
import shutil
import subprocess

def copy_data_file():
    try:
        # Define the target directory
        destination_path = '/home/DRDO/'

        while True:
            # Get a list of all mounted drives
            mounted_drives = os.listdir('/media/DRDO/')  # Assuming the mount point is /media/pi/

            # Search for 'data.txt' on each mounted drive
            for drive in mounted_drives:
                data_file_path = os.path.join('/media/DRDO/', drive, 'data.txt')
                if os.path.exists(data_file_path):
                    # Copy the file
                    shutil.copy(data_file_path, destination_path)
                    print(f"File 'data.txt' copied from {data_file_path} to {destination_path}")

                    # Execute the UIV20.py script
                    uiv_script_path = os.path.join(destination_path, 'UIV20.py')
                    subprocess.Popen(["x-terminal-emulator", "-e", "python", uiv_script_path])

                    # Display countdown message in the current terminal
                    for i in range(5, 0, -1):
                        print(f"{i}... ", end='', flush=True)
                        time.sleep(1)
                    print("Remove the drive now!")
                    
                    # Reboot pi after 5s
                    time.sleep(5)
                    os.system("sudo reboot now")
                    break  # Stop searching after finding the file

            # Wait for 1 second before checking again
            time.sleep(1)

        else:
            print("No 'data.txt' file found on any connected USB drive or card reader.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    copy_data_file()

'''
import os
import shutil

def copy_data_file():
    try:
        # Define the target directory
        destination_path = '/home/DRDO/'

        # Get a list of all mounted drives
        mounted_drives = os.listdir('/media/DRDO/')  # Assuming the mount point is /media/pi/

        # Search for 'data.txt' on each mounted drive
        for drive in mounted_drives:
            data_file_path = os.path.join('/media/DRDO/', drive, 'data.txt')
            if os.path.exists(data_file_path):
                # Copy the file
                shutil.copy(data_file_path, destination_path)
                print(f"File 'data.txt' copied from {data_file_path} to {destination_path}")
                break  # Stop searching after finding the file

        else:
            print("No 'data.txt' file found on any connected USB drive or card reader.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    copy_data_file()
'''
'''
import os
import time
import shutil

def copy_data_file():
    try:
        # Define the target directory
        destination_path = '/home/DRDO/'

        while True:
            # Get a list of all mounted drives
            mounted_drives = os.listdir('/media/DRDO/')  # Assuming the mount point is /media/pi/

            # Search for 'data.txt' on each mounted drive
            for drive in mounted_drives:
                data_file_path = os.path.join('/media/DRDO/', drive, 'data.txt')
                if os.path.exists(data_file_path):
                    # Copy the file
                    shutil.copy(data_file_path, destination_path)
                    print(f"File 'data.txt' copied from {data_file_path} to {destination_path}")
                    break  # Stop searching after finding the file

            # Wait for 1 second before checking again
            time.sleep(1)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    copy_data_file()
'''
