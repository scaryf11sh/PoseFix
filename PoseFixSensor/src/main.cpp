#include <Adafruit_BNO055.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <Wire.h>
#include <stdint.h>
#include <string.h>
#include <utility/imumaths.h>

#include "mbedtls/gcm.h"
#include "utils.h"

uint16_t BNO055_SAMPLERATE_DELAY_MS = 100;

Adafruit_BNO055 headSensor = Adafruit_BNO055(55, HEAD_ADR);
Adafruit_BNO055 backSensor = Adafruit_BNO055(55, BACK_ADR);

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Wire.begin(SDA_PIN, SCL_PIN);
  if (!headSensor.begin()) {
    Serial.println("No se pudo encontrar el sensor de cabeza");
    // while (1);
  }
  if (!backSensor.begin()) {
    Serial.println("No se pudo encontrar el sensor de espalda");
    // while (1);
  }

  headSensor.setExtCrystalUse(true);
  backSensor.setExtCrystalUse(true);
  delay(1000);
}

void loop() {
  sensors_event_t event;
  headSensor.getEvent(&event, Adafruit_BNO055::VECTOR_EULER);
  SensorData headData = {.pitch = normalize_angle(event.orientation.x),
                         .roll = normalize_angle(event.orientation.y),
                         .yaw = normalize_angle(event.orientation.z)};

  // Limpiamos la consola antes de imprimir los datos
  Serial.write("\033[2J\033[H");  // ANSI escape codes para limpiar la pantalla
                                  // y mover el cursor a la posición (0,0)

  Serial.write("Datos de la cabeza: ");
  Serial.write("Datos desnormalizados: ");
  Serial.write("Pitch: %d ", event.orientation.x);
  Serial.write("Roll: %d ", event.orientation.y);
  Serial.write("Yaw: %d\n", event.orientation.z);
  Serial.write("Datos normalizados: ");
  Serial.write("Pitch: %d ", headData.pitch);
  Serial.write("Roll: %d ", headData.roll);
  Serial.write("Yaw: %d\n", headData.yaw);

  backSensor.getEvent(&event, Adafruit_BNO055::VECTOR_EULER);
  SensorData backData = {.pitch = normalize_angle(event.orientation.x),
                         .roll = normalize_angle(event.orientation.y),
                         .yaw = normalize_angle(event.orientation.z)};
  Serial.write("Datos de la espalda: ");
  Serial.write("Datos desnormalizados: ");
  Serial.write("Pitch: %d ", event.orientation.x);
  Serial.write("Roll: %d ", event.orientation.y);
  Serial.write("Yaw: %d\n", event.orientation.z);
  Serial.write("Datos normalizados: ");
  Serial.write("Pitch: %d ", backData.pitch);
  Serial.write("Roll: %d ", backData.roll);
  Serial.write("Yaw: %d\n", backData.yaw);

  delay(BNO055_SAMPLERATE_DELAY_MS);
}
