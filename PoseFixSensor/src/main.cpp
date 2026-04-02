#include <Adafruit_BNO055.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <Wire.h>
#include <stdint.h>
#include <string.h>
#include <utility/imumaths.h>

#include "mbedtls/gcm.h"
#include "utils.h"

uint16_t BNO055_SAMPLERATE_DELAY_MS = 15;

Adafruit_BNO055 backSensor = Adafruit_BNO055(55, BACK_ADR);

NimBLECharacteristic* pTxCharacteristic = nullptr;
bool deviceConnected = false;

#define POSEFIX_SERVICE_UUID "15464a70-4048-45e7-9069-b9d37aaea15e"
#define POSEFIX_CHAR_TX_UUID "1fdfc708-b552-4d80-bd1c-761f14d009fe"

class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Cliente conectado");
  };

  void onDisconnect(NimBLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Cliente desconectado");
    NimBLEDevice::startAdvertising();  // Restart advertising cuando un cliente
                                       // se desconecta
  };
};

void setupBLE() {
  NimBLEDevice::init("PoseFix");
  NimBLEDevice::setMTU(512);
  NimBLEServer* pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  NimBLEService* pService = pServer->createService(POSEFIX_SERVICE_UUID);
  pTxCharacteristic = pService->createCharacteristic(POSEFIX_CHAR_TX_UUID,
                                                     NIMBLE_PROPERTY::NOTIFY);
  // pService->start();
  // ya no es necesario llamar a start() en el servicio, NimBLE lo hace
  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(POSEFIX_SERVICE_UUID);
  pAdvertising->start();
}

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Wire.begin(SDA_PIN, SCL_PIN);
  if (!backSensor.begin()) {
    Serial.println("No se pudo encontrar el sensor de espalda");
    // while (1);
  }

  // setupBLE();
  Serial.println("Sensores inicializados correctamente");
  backSensor.setExtCrystalUse(true);
  delay(1000);
}

void loop() {
  sensors_event_t event;
  backSensor.getEvent(&event);
  SensorData backData = {.pitch = normalize_angle(event.orientation.x),
                         .roll = normalize_angle(event.orientation.y),
                         .yaw = normalize_angle(event.orientation.z)};
  Serial.printf("Back - Pitch: %d, Roll: %d, Yaw: %d\n", backData.pitch,
                backData.roll, backData.yaw);
  Payload payload;
  payload.nonce =
      ++global_nonce_counter;  // Incrementamos el nonce para cada nuevo payload
  payload.BackData = backData;

  if (deviceConnected) {
    // Enviar datos a través de BLE
    pTxCharacteristic->setValue((uint8_t*)&payload, sizeof(Payload));
    pTxCharacteristic->notify();
  }

  delay(BNO055_SAMPLERATE_DELAY_MS);
}
