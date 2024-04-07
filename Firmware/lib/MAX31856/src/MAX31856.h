#pragma once

#include <Arduino.h>
#include <SPI.h>

#define CJTH_REG 0x0A
#define LTCBH_REG 0x0C
#define SR_REG 0x0F

/**
 * \brief MAX31856 class
 * \details This class is used to interface with the MAX31856 thermocouple amplifier using SPI
 */
class MAX31856
{
private:
    /// \brief The chip select pin for the MAX31856
    int chipSelectPin;

    /// \brief The number of registers that can be read and written to
    const int totalNumberofRWRegisters = 10;

    /// \brief A variable containing values of the registers that can be read and written to
    const byte RWRegisterValues[10] = {0x90, 0x03, 0xFC, 0x7F, 0xC0, 0x7F, 0xFF, 0x80, 0x00, 0x00};

    /// \brief A variable containing names of the registers that can be read and written to
    String RWRegisterNames[10] = {"CR0", "CR1", "MASK", "CJHF", "CJLF", "LTHFTH", "LTHFTL", "LTLFTH", "LTLFTL", "CJTO"};

    /// \brief A variable containing addresses of the registers that can be read and written to
    const byte RWRegisterAddresses[10] = {0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09};

    /**
     * \brief This function is used to write to a register
     * \param Register The register to write to
     * \param Data The data to write to the register
     * \return None
     */
    void writeRegister(byte Register, byte Data);

    /**
     * \brief This function is used to read from a register
     * \param Register The register to read from
     * \param numBytes The number of bytes to read from consecutive registers
     * \return The data read from the register
     */
    unsigned long readRegister(byte Register, int numBytes);

public:
    /**
     * \brief The MAX31856 class constructor
     */
    MAX31856();

    /**
     * \brief The MAX31856 class destructor
     */
    ~MAX31856();

    /**
     * \brief This function is used to initialize the MAX31856
     * \return None
     */
    void begin(int CSPin);

    /**
     * \brief This function is used to read the thermocouple temperature
     * \return The thermocouple temperature in degrees Celsius
     */
    double readThermocoupleTemperature();

    /**
     * \brief This function is used to read the cold junction temperature
     * \return The cold junction temperature in degrees Celsius
     */
    double readCJTemperature();

    /**
     * \brief This function is used to read the fault status of the MAX31856
     */
    void readFault();

    /**
     * \brief THis function is used to verify register values with whatever is written to them
     * \return True if the registers are correct, false if not
     */
    bool verifyRegisters();
};