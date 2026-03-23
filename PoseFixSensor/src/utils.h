#pragma once
#include <stdint.h>

#include "mbedtls/gcm.h"

#define HEAD_ADR 0x28
#define BACK_ADR 0x29
#define SDA_PIN 5
#define SCL_PIN 6

extern const unsigned char SECRET_KEY[16];
extern mbedtls_gcm_context gcm_ctx;
extern uint32_t global_nonce_counter;  // Contador para generar nonces únicos

#pragma pack( \
    push, 1)  // Asegura que no haya relleno entre los campos de la estructura
typedef struct {
  uint16_t pitch;  // 2 bytes para pitch normalizado y mapeado (-15.4->345.6) ->
                   // 34560
  uint16_t
      roll;  // 2 bytes para roll normalizado y mapeado (-15.4->345.6) -> 34560
  uint16_t
      yaw;  // 2 bytes para yaw normalizado y mapeado (-15.4->345.6) -> 34560
} SensorData;

typedef struct {
  uint8_t status : 1;       // bit 0 para estado (0 = ok, 1 = fallo)
  uint8_t calibration : 1;  // bit 1 para calibración (0 = ok, 1 = no calibrado)
  uint8_t power_source
      : 1;  // bit 2 para estado de carga (0 = bateria, 1 = usb)
  uint8_t battery_level : 5;  // bit 3-7 para carga de bateria (0-100%)
} PayloadStatus;

typedef struct {
  uint32_t nonce;        // 4 bytes para un nonce único por muestra
  SensorData HeadData;   // 6 bytes para los datos de la cabeza
  SensorData BackData;   // 6 bytes para los datos de la espalda
  PayloadStatus status;  // 1 byte para el estado del payload
  uint8_t tag[7];        // 7 bytes para la etiqueta
} Payload;
#pragma pack(pop)

void setup_encryption();
void send_secure_ble_packet(SensorData& Head_Data, SensorData& Back_Data,
                            PayloadStatus& current_status);
uint16_t normalize_angle(float angle);
