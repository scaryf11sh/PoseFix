#include <Adafruit_BNO055.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <Wire.h>
#include <stdint.h>
#include <string.h>
#include <utility/imumaths.h>

#include "utils.h"

uint16_t BNO055_SAMPLERATE_DELAY_MS = 15;

// Up to 2 BNO055s — HEAD_ADR=0x28, BACK_ADR=0x29
Adafruit_BNO055 imu[2] = {
    Adafruit_BNO055(55, HEAD_ADR),
    Adafruit_BNO055(56, BACK_ADR),
};
bool imuOk[2] = {false, false};

NimBLECharacteristic* pTxChar = nullptr;
NimBLECharacteristic* pRxChar = nullptr;
bool deviceConnected = false;
bool isStreaming      = false;  // frozen until app sends CMD_START

#define POSEFIX_SERVICE_UUID "15464a70-4048-45e7-9069-b9d37aaea15e"
#define POSEFIX_TX_UUID      "1fdfc708-b552-4d80-bd1c-761f14d009fe"
#define POSEFIX_RX_UUID      "2b3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f"

#define CMD_START 0x01
#define CMD_STOP  0x02

// ── BLE server callbacks ─────────────────────────────────────────────────────

class ServerCBs : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer*) override {
    deviceConnected = true;
    isStreaming      = false;  // wait for handshake
    Serial.println("[BLE] cliente conectado — esperando CMD_START");
  }
  void onDisconnect(NimBLEServer*) override {
    deviceConnected = false;
    isStreaming      = false;
    Serial.println("[BLE] cliente desconectado — reiniciando advertising");
    NimBLEDevice::startAdvertising();
  }
};

// ── RX characteristic callbacks (app → sensor) ───────────────────────────────

class RxCBs : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pChar) override {
    std::string val = pChar->getValue();
    if (val.empty()) return;
    switch ((uint8_t)val[0]) {
      case CMD_START:
        isStreaming = true;
        Serial.println("[BLE] CMD_START — streaming iniciado");
        break;
      case CMD_STOP:
        isStreaming = false;
        Serial.println("[BLE] CMD_STOP — streaming detenido");
        break;
      default:
        break;
    }
  }
};

// ── BLE init ─────────────────────────────────────────────────────────────────

void setupBLE() {
  NimBLEDevice::init("PoseFix");
  NimBLEDevice::setMTU(512);

  NimBLEServer*  pServer  = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCBs());

  NimBLEService* pService = pServer->createService(POSEFIX_SERVICE_UUID);

  // TX: sensor → app (notify)
  pTxChar = pService->createCharacteristic(POSEFIX_TX_UUID, NIMBLE_PROPERTY::NOTIFY);

  // RX: app → sensor (write)
  pRxChar = pService->createCharacteristic(
      POSEFIX_RX_UUID,
      NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::WRITE_NR);
  pRxChar->setCallbacks(new RxCBs());

  NimBLEAdvertising* pAdv = NimBLEDevice::getAdvertising();
  pAdv->addServiceUUID(POSEFIX_SERVICE_UUID);
  pAdv->start();

  Serial.println("[BLE] advertising iniciado como \"PoseFix\"");
}

// ── Arduino setup ────────────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Wire.begin(SDA_PIN, SCL_PIN);

  // Dynamic sensor discovery — try both I2C addresses
  const uint8_t addrs[2] = {HEAD_ADR, BACK_ADR};
  for (int i = 0; i < 2; i++) {
    if (imu[i].begin()) {
      imu[i].setExtCrystalUse(true);
      imuOk[i] = true;
      Serial.printf("[IMU] sensor %d (0x%02X) OK\n", i, addrs[i]);
    } else {
      Serial.printf("[IMU] sensor %d (0x%02X) no encontrado\n", i, addrs[i]);
    }
  }

  if (!imuOk[0] && !imuOk[1]) {
    Serial.println("[IMU] advertencia: ningun sensor BNO055 detectado");
  }

  setupBLE();
  delay(500);
}

// ── Arduino loop ─────────────────────────────────────────────────────────────

void loop() {
  Payload payload = {};
  payload.nonce   = ++global_nonce_counter;

  // Head sensor (id=0, addr 0x28)
  if (imuOk[0]) {
    sensors_event_t e;
    imu[0].getEvent(&e);
    payload.HeadData = {
        .id    = 0,
        .pitch = normalize_angle(e.orientation.x),
        .roll  = normalize_angle(e.orientation.y),
        .yaw   = normalize_angle(e.orientation.z),
    };
  } else {
    payload.HeadData = {.id = 0xFF, .pitch = 0, .roll = 0, .yaw = 0};
  }

  // Back sensor (id=1, addr 0x29)
  if (imuOk[1]) {
    sensors_event_t e;
    imu[1].getEvent(&e);
    payload.BackData = {
        .id    = 1,
        .pitch = normalize_angle(e.orientation.x),
        .roll  = normalize_angle(e.orientation.y),
        .yaw   = normalize_angle(e.orientation.z),
    };
  } else {
    payload.BackData = {.id = 0xFF, .pitch = 0, .roll = 0, .yaw = 0};
  }

  payload.status.status = !(imuOk[0] || imuOk[1]);

  if (deviceConnected && isStreaming) {
    pTxChar->setValue((uint8_t*)&payload, sizeof(Payload));
    pTxChar->notify();
    Serial.printf("[TX] nonce=%lu H:p=%d,r=%d,y=%d B:p=%d,r=%d,y=%d\n",
                  (unsigned long)payload.nonce,
                  payload.HeadData.pitch, payload.HeadData.roll, payload.HeadData.yaw,
                  payload.BackData.pitch, payload.BackData.roll, payload.BackData.yaw);
  }

  delay(BNO055_SAMPLERATE_DELAY_MS);
}
