//============================================
// !!!!!!!!!!! Please read the README.md file
// to learn how to use this code !!!!!!!!!!!
//============================================

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
#define MAX_DRDY 2
#define OUTPUT_ENABLE A0

#define SWITCHING_DELAY_MS 220
#define numberofThermocouples 8

const int BOARD_PINS[] = {LED_PIN, MAX_CS, SD_CS, OUTPUT_ENABLE, SD_CD, MAX_FAULT, MAX_DRDY};
const int BOARD_PIN_DIR[] = {OUTPUT, OUTPUT, OUTPUT, OUTPUT, INPUT, INPUT, INPUT};
const int MUX_PINS[] = {MUX_PIN_A, MUX_PIN_B, MUX_PIN_C};

double ColdJunctionTemp;
double ThermocoupleTemp[numberofThermocouples];
int timeStamp;

MAX31856 MAX;
SdFat SD;
File dataFile;

void selectPin(int Value)
{
	for (int Pin = 0; Pin < 3; Pin++)
		digitalWrite(MUX_PINS[Pin], (Value & (1 << Pin)) != 0);
}

void readSinglePin(int Value)
{
	selectPin(Value - 1);
	delay(SWITCHING_DELAY_MS);
	ThermocoupleTemp[Value - 1] = MAX.readThermocoupleTemperature();
}

void cycleThroughPins()
{
	for (int i = 1; i <= numberofThermocouples; i++)
		readSinglePin(i);

	ColdJunctionTemp = MAX.readCJTemperature();
	Serial.print(timeStamp);
	Serial.print(",");
	for (int i = 0; i < numberofThermocouples; i++)
	{
		Serial.print(ThermocoupleTemp[i]);
		Serial.print(",");
	}
	Serial.println(ColdJunctionTemp);
}

void setup()
{
	for (int i = 0; i < 7; i++)
		pinMode(BOARD_PINS[i], BOARD_PIN_DIR[i]);
	for (int i = 0; i < 3; i++)
		pinMode(MUX_PINS[i], OUTPUT);
	delayMicroseconds(10);
	digitalWrite(OUTPUT_ENABLE, HIGH);
	delayMicroseconds(10);
	digitalWrite(MAX_CS, HIGH);
	digitalWrite(SD_CS, HIGH);
	SD.begin(SD_CS);
	SD.remove("data.txt");
	SD.end();
	Serial.begin(9600);
}

void loop()
{
	delay(1);
	digitalWrite(SD_CS, HIGH);
	MAX.begin(MAX_CS);
	timeStamp = millis();
	cycleThroughPins();
	delay(1);
	digitalWrite(MAX_CS, HIGH);
	SD.begin(SD_CS);
	dataFile = SD.open("data.txt", FILE_WRITE);
	if (dataFile)
	{
		dataFile.print(timeStamp);
		dataFile.print(",");
		for (int i = 0; i < numberofThermocouples; i++)
		{
			dataFile.print(ThermocoupleTemp[i]);
			dataFile.print(",");
		}
		dataFile.println(ColdJunctionTemp);
		dataFile.close();
	}
	SD.end();
}