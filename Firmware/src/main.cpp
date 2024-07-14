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

#include <Arduino.h>
#include <MAX31856.h>
#include <SdFat.h>

#define LED_PIN 9
#define MUX_PIN_A 5
#define MUX_PIN_B 6
#define MUX_PIN_C 7
#define MAX_CS 8
#define SD_CS 10
#define SD_CD 4
#define MAX_FAULT 3
#define MAX_DATA_READY 2

#define SWITCHING_DELAY_MS 220
#define NUM_THERMOCOUPLES 8

const int BOARD_PINS[] = {LED_PIN, MAX_CS, SD_CS, SD_CD, MAX_FAULT, MAX_DATA_READY};
const int BOARD_PIN_DIR[] = {OUTPUT, OUTPUT, OUTPUT, INPUT, INPUT, INPUT};
const int MUX_PINS[] = {MUX_PIN_A, MUX_PIN_B, MUX_PIN_C};

double ColdJunctionTemp;
double ThermocoupleTemp[NUM_THERMOCOUPLES];
unsigned int timeStamp;

MAX31856 MAX;
SdFat SD;
File dataFile;

/**
 * \brief Function to select a specific MUX pin
 * \param Pin_Number The pin to be selected (0-7)
 * \return None
 */
void selectPin(int Pin_Number)
{
	for (int Pin = 0; Pin < 3; Pin++)
		digitalWrite(MUX_PINS[Pin], (Pin_Number & (1 << Pin)) != 0);
}

/**
 * \brief Function to read a single thermocouple
 * \param Thermocouple_Number The pin number of the thermocouple to be read (1-8)
 * \return None
 */
void readSingleThermocouple(int Thermocouple_Number)
{
	selectPin(Thermocouple_Number - 1);
	delay(SWITCHING_DELAY_MS);
	ThermocoupleTemp[Thermocouple_Number - 1] = MAX.readThermocoupleTemperature();
}

/**
 * \brief Function to cycle through all thermocouples
 * \param None
 * \return None
 */
void cycleThroughThermocouples()
{
	digitalWrite(LED_PIN, HIGH);
	for (int i = 1; i <= NUM_THERMOCOUPLES; i++)
		readSingleThermocouple(i);

	ColdJunctionTemp = MAX.readCJTemperature();
	Serial.print(timeStamp);
	Serial.print(",");
	for (int i = 0; i < NUM_THERMOCOUPLES; i++)
	{
		Serial.print(ThermocoupleTemp[i]);
		Serial.print(",");
	}
	Serial.println(ColdJunctionTemp);
	digitalWrite(LED_PIN, LOW);
}

/// \brief Setup Function
void setup()
{
	for (int i = 0; i < int(sizeof(BOARD_PINS) / sizeof(int)); i++)
		pinMode(BOARD_PINS[i], BOARD_PIN_DIR[i]);
	for (int i = 0; i < 3; i++)
		pinMode(MUX_PINS[i], OUTPUT);
	delayMicroseconds(10);
	digitalWrite(MAX_CS, HIGH);
	digitalWrite(SD_CS, HIGH);
	SD.begin(SD_CS);
	SD.remove("data.txt");
	SD.end();
	Serial.begin(9600);
}

/// \brief Loop Function
void loop()
{
	delay(1);
	digitalWrite(SD_CS, HIGH);
	MAX.begin(MAX_CS);
	timeStamp = millis() / 1000;
	cycleThroughThermocouples();
	delay(1);
	digitalWrite(MAX_CS, HIGH);
	SD.begin(SD_CS);
	dataFile = SD.open("data.txt", FILE_WRITE);
	if (dataFile)
	{
		dataFile.print(timeStamp);
		dataFile.print(",");
		for (int i = 0; i < NUM_THERMOCOUPLES; i++)
		{
			dataFile.print(ThermocoupleTemp[i]);
			dataFile.print(",");
		}
		dataFile.println(ColdJunctionTemp);
		dataFile.close();
	}
	SD.end();
}