//=================================================================
//
// Copyright (c) 2024 by Siddhaanth S Iyer. All rights reserved.
//
// This material may not be reproduced, displayed, modified or
// distributed without the express prior written permission of the
// copyright holder. For permission, contact Siddhaanth S Iyer.
//
//=================================================================
//
//=======================================
// !!!!!!!!!!! Please read the README.md
// file before coming here !!!!!!!!!!!!!
//=======================================

#include "MAX31856.h"

MAX31856::MAX31856()
{
}

MAX31856::~MAX31856()
{
}

void MAX31856::writeRegister(byte Register, byte Data)
{
    digitalWrite(chipSelectPin, LOW);
    delayMicroseconds(1);
    SPI.transfer(Register | 0x80);
    delayMicroseconds(1);
    SPI.transfer(Data);
    digitalWrite(chipSelectPin, HIGH);
}

unsigned long MAX31856::readRegister(byte Register, int numBytes)
{
    digitalWrite(chipSelectPin, LOW);
    unsigned long data = 0;
    SPI.transfer(Register & 0x7F);
    delayMicroseconds(1);
    if (numBytes > 1)
        for (int i = 0; i < numBytes; i++)
            data = (data << 8) | SPI.transfer(0);
    else
        data = SPI.transfer(0);
    digitalWrite(chipSelectPin, HIGH);
    return data;
}

bool MAX31856::verifyRegisters()
{
    int ErrorCount = 0;
    for (int i = 0; i < totalNumberOfRWRegisters; i++)
    {
        byte RegVal = readRegister(RWRegisterAddresses[i], 1);
        if (RegVal != RWRegisterValues[i])
        {
            Serial.print(RWRegisterNames[i]);
            Serial.print("\t has 0x");
            Serial.print(RegVal, HEX);
            Serial.print(" and should have 0x");
            Serial.println(RWRegisterValues[i], HEX);
            ErrorCount++;
        }
        delayMicroseconds(100);
    }
    if (ErrorCount == 0)
    {
        Serial.println("No discrepancies found");
        return true;
    }
    else
    {
        Serial.print(ErrorCount);
        Serial.println(" discrepancies found");
        return false;
    }
}

void MAX31856::begin(int CSPin)
{
    chipSelectPin = CSPin;
    pinMode(chipSelectPin, OUTPUT);
    digitalWrite(chipSelectPin, HIGH);
    SPI.begin();
    SPI.beginTransaction(SPISettings(5000000, MSBFIRST, SPI_MODE1));
    for (int i = 0; i < totalNumberOfRWRegisters; i++)
    {
        writeRegister(RWRegisterAddresses[i], RWRegisterValues[i]);
        delayMicroseconds(100);
    }
}

bool MAX31856::readFault()
{
    byte Fault = readRegister(SR_REG, 1);
    Serial.print("Fault: 0b");
    Serial.println(Fault, BIN);
    if (Fault & 0b00000001)
        Serial.println("Thermocouple open");
    if (Fault & 0b00000010)
        Serial.println("Thermocouple short to GND");
    if (Fault & 0b00000100)
        Serial.println("Thermocouple Temperature lower than low threshold");
    if (Fault & 0b00001000)
        Serial.println("Thermocouple Temperature higher than high threshold");
    if (Fault & 0b00010000)
        Serial.println("Cold Junction Temperature lower than low threshold");
    if (Fault & 0b00100000)
        Serial.println("Cold Junction Temperature higher than high threshold");
    if (Fault & 0b01000000)
        Serial.println("Thermocouple Temperature out of range");
    if (Fault & 0b10000000)
        Serial.println("Cold Junction Temperature out of range");
    else if (Fault == 0)
    {
        Serial.println("No faults detected");
        return false;
    }
    return true;
}
double MAX31856::readThermocoupleTemperature()
{
    double temperature;
    long int data;
    data = readRegister(LTCBH_REG, 4);
    data = data >> 13;
    temperature = (double)data * 0.0078125;
    return temperature;
}

double MAX31856::readCJTemperature()
{
    double temperature;
    long int data;
    data = readRegister(CJTH_REG, 2);
    data = data >> 2;
    temperature = (double)data * 0.015625;
    return temperature;
}