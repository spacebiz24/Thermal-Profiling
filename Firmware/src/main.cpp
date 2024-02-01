#include <Arduino.h>
#include <MAX31856.h>

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

#define SWITCHING_DELAY_MS 100

const int BOARD_PINS[] = {LED_PIN, MAX_CS, SD_CS, OUTPUT_ENABLE, SD_CD, MAX_FAULT, MAX_DRDY};
const int BOARD_PIN_DIR[] = {OUTPUT, OUTPUT, OUTPUT, OUTPUT, INPUT, INPUT, INPUT};
const int MUX_PINS[] = {MUX_PIN_A, MUX_PIN_B, MUX_PIN_C};

MAX31856 MAX(MAX_CS);

void selectPin(int Value)
{
	for (int Pin = 0; Pin < 3; Pin++)
		digitalWrite(MUX_PINS[Pin], (Value & (1 << Pin)) != 0);
}

void cycleThroughPins()
{
	for (int Counter = 0; Counter < 8; Counter++)
	{
		selectPin(Counter);
		delay(SWITCHING_DELAY_MS);
	}
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
	selectPin(7);
	Serial.begin(9600);
	MAX.begin();
	MAX.verifyRegisters();
	Serial.println("\n");
	MAX.readFault();
}

void loop()
{
	Serial.println("\n");
	Serial.print("Thermocouple temperature: ");
	Serial.print(MAX.readThermocoupleTemperature());
	Serial.println(" *C");
	Serial.print("Cold junction temperature: ");
	Serial.print(MAX.readCJTemperature());
	Serial.println(" *C");
	delay(2000);
}