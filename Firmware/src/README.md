# Temperature Thing Firmware
<p align="center">
    <i align="center">The firmware running the temperature sensing platform built for DRDO. 🌡️ </i>
</p>
<p align="center">
    <img src="https://img.shields.io/github/last-commit/spacebiz24/Thermal-Profiling?display_timestamp=author&style=for-the-badge&logo=platformio&logoColor=orange&color=blue" alt="last-commit" width="250">
    <img src="https://img.shields.io/github/license/spacebiz24/Thermal-Profiling?style=for-the-badge&logo=unlicense&logoColor=white&color=blue" alt="license" width="200">
    <br>
    <img src="https://img.shields.io/github/contributors/spacebiz24/Thermal-Profiling?color=blue&style=for-the-badge&logo=contributor-covenant&logoColor=green" alt="contributors" width="200">
    <img src="https://img.shields.io/github/actions/workflow/status/spacebiz24/Thermal-Profiling/main.yml?branch=main&style=for-the-badge&logo=github&logoColor=white&color=green" alt="ci" width="200">
</p>

___

## Contents
1. [Architecture of the Firmware](#architecture-of-the-firmware)
1. [Some important pointers about the firmware](#some-important-pointers-about-the-firmware)
1. [Functions in the Firmware](#functions-in-the-firmware)
1. [Continuous Integration Pipeline](#continuous-integration-pipeline)
1. [Authors and Reviewers](#authors-and-reviewers)
1. [License](#license)

## Architecture of the Firmware
This firmware was written to interface the ATMega328P with MAX31856 ADC.
All the underlying code is written in C++ and is built using the PlatformIO framework.
The main code loop heavily relies upon the custom built MAX31856 library which is 
covered in detail in the
[library documentation](https://github.com/spacebiz24/Thermal-Profiling/tree/main/Firmware/lib/MAX31856/).

The actions performed by this firmware are:
- Choose a specific thermocouple using the MUX
- Read the temperature from the MAX31856
- Write the temperature to the serial port and SD card in CSV format
- Repeat the process all over again

The following flow chart describes the overall working of the firmware.
```mermaid
graph TD;
A[Initialise the ATMega328P Pins] --> B[Remove the existing 'data.txt' file from the SD card];
B --> C[Disable the SD card];
C --> D[Enable the MAX31856];
D --> E[Cycle through all the thermocouples and store data];
E --> F[Disable the MAX31856];
F --> G[Enable the SD card];
G --> H[Write the data to the SD card];
H --> C;
```

## Some important pointers about the firmware
All board pins are defined in the beginning of the firmware and must not be changed
as long as hardware does not change. The `SWITCHING_DELAY_MS` defines the delay between
every thermocouple and is set to ensure appropriate time for the ADC readings to be stored
without any mix up.

### Functions in the Firmware
- `selectPin(int Pin_Number)`
    - This function is used to select a specific pin using the MUX.
    - Parameters:
        - `Pin_Number`: The pin number to be selected on the MUX.
    - Returns:
        - None
- `readSingleThermocouple(int Thermocouple_Number)`
    - This function is used to read the temperature from a single thermocouple.
    It selects a thermocouple by invoking the `selectPin()` function and then reads
    the temperature from the MAX31856.
    - Parameters:
        - None
    - Returns:
        - None
- `cycleThroughThermocouples()`
    - This function is used to cycle through all the thermocouples and store the data.
    - Parameters:
        - None
    - Returns:
        - None

The `setup()` function in the firmware initialises all the pins and their directions by using the
`BOARD_PINS` and `MUX_PINS` arrays which are defined in the beginning of the firmware.
The `BOARD_PINS_DIR` array defines the direction of the pins in the `BOARD_PINS` array.
The same is not needed for `MUX_PINS` as all the pins are set as `OUTPUT`.

The `setup()` function also removes the existing data file from the SD card to ensure that new data
is always written every time. It also initialises serial communication.

The `loop()` function follows all the steps as described in the flow chart above and calls the
`cycleThroughThermocouples()` function to cycle through all the thermocouples before writing
the same data to the SD card along with the time stamp to allow easier logging.

## Continuous Integration Pipeline
The firmware is built using the PlatformIO framework and is tested using the GitHub Actions CI pipeline.
The pipeline is triggered on every push to the repository and runs the firmware on a virtual environment
and the same is configured using the `.github/workflows/main.yml` file.

## Authors
<p align="center">
<center>
<div style="display: flex; justify-content: center;" align="center">
<figure>
    <a href="https://github.com/spacebiz24">
        <img src="https://avatars.githubusercontent.com/u/78657717?v=4" title="spacebiz24" width="100">
    </a>
</figure>
</div>
</center>
</p>

## Reviewers
<p align="center">
<center>
<div style="display: flex; justify-content: center;" align="center">
<figure>
    <a href="https://github.com/Eloquencere">
        <img src="https://avatars.githubusercontent.com/u/106532953?v=4" title="Eloquencere" width="100">
    </a>
</figure>
<figure>
    <a href="https://github.com/Tejas-M-Nayak">
        <img src="https://avatars.githubusercontent.com/u/111493008?v=4" title="Tejas-M-Nayak" width="100">
    </a>
</figure>
</div>
</center>
</p>

## License
As most of the project except the SD card library is custom developed,
without prior written permission of the author, this code must not be
reproduced, displayed, modified or distributed. The SD card library is
not covered under the above license. For more information, please refer
to the LICENSE file in the root directory of the repository.

___

Made with :heart: by [spacebiz24](https://github.com/spacebiz24)
