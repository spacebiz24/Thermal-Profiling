# MAX31856 Library

This is a custom built MAX31856 library built for the Temperature Thing PCB
designed for the Defence Research and Development Organisation (DRDO).
The Library is designed to interface K type thermocouples specifically with
the MAX31856. The overall outline of the library is kept as simple as possible
to make it easy to use and understand. The datasheet for the MAX31856 can be
found here.
[MAX31856 Datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/max31856.pdf)

## Contents
1. [Functions List](#functions-list)
1. [Usage](#usage)
1. [Contributors](#contributors)
1. [License](#license)

## Functions List
### Public Functions
- `MAX31856()`
    - Constructor for the MAX31856 class
- `~MAX31856()`
    - Destructor for the MAX31856 class
- `begin(int CS)`
    - Initializes the MAX31856
    - Parameters:
        - `CS` : Chip Select pin of the MAX31856
    - Returns:
        - None
- `readThermocoupleTemperature()`
    - Reads the temperature of the thermocouple
    - Parameters:
        - None
    - Returns:
        - Temperature in Celsius in `double`
- `readCJTemperature()`
    - Reads the cold junction temperature
    - Parameters:
        - None
    - Returns:
        - Temperature in Celsius in `double`
- `readFault()`
    - Reads the fault status of the MAX31856 and prints the fault if it exists
    - Returns:
        - None
- `verifyRegisters()`
    - Verifies the registers of the MAX31856 by writing and reading back values
    - Parameters:
        - None
    - Returns:
        - True if registers are verified, False otherwise

### Private Functions
- `writeRegister(byte Register, byte Data)`
    - Writes data to a register as specified by the user
    - Parameters:
        - `Register` : Register to write to in `byte`
        - `Data` : Data to write in `byte`
    - Returns:
        - None
- `readRegister(byte Register, int numBytes)`
    - Reads data from a register as specified by the user
    - Parameters:
        - `Register` : Register to read from in `byte`
        - `numBytes` : Number of bytes to read in `int`
    - Returns:
        - Data read from the register in `unsigned long`

## Usage
To ensure proper working of the library, please ensure that the following
outline is followed. The below is a simple example on reading the thermocouple
and cold junction temperatures and printing the same.
```cpp
#include <Arduino.h>
#include <MAX31856.h>
// Any other libraries relevant to your
// project should be included here.

// Instance the MAX31856 class.
MAX31856 MAX;

float ThermocoupleTemperature;
float CJTemperature;

void setup()
{
    // Initialize the MAX31856
    MAX.begin(10);
    // 10 is the Chip Select pin of the MAX31856

    // Verify the registers of the MAX31856 and report errors if any
    MAX.verifyRegisters();

    // Stay in the while loop if a fault is detected.
    while(MAX.readFault())
    {
        Serial.println("Fault Detected");
        delay(10);
    }
}

void loop()
{
    // Read the temperature of the thermocouple
    ThermocoupleTemperature = MAX.readThermocoupleTemperature();
    // Read the cold junction temperature
    CJTemperature = MAX.readCJTemperature();

    // Print the temperatures to the Serial Monitor
    Serial.print("Thermocouple Temperature: ");
    Serial.print(ThermocoupleTemperature);
    Serial.println(" C");

    Serial.print("Cold Junction Temperature: ");
    Serial.print(CJTemperature);
    Serial.println(" C");

    // Delay for 1 second
    delay(1000);
}
```

## Contributors
<p align="center">
<center>
<div style="display: flex; justify-content: center;" align="center">
<figure>
    <a href="https://github.com/spacebiz24">
        <img src="https://avatars.githubusercontent.com/u/78657717?v=4" title="spacebiz24" width="200" height="200">
    </a>
</figure>
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
