#include "utils.h"

#include <string.h>

#include "mbedtls/gcm.h"

// inicializamos las variables globales declaradas en utils.h
const unsigned char SECRET_KEY[16] = "POSEFIXKEY_2026";
mbedtls_gcm_context gcm_ctx;
uint32_t global_nonce_counter = 0;

void setup_encryption() {
  mbedtls_gcm_init(&gcm_ctx);
  mbedtls_gcm_setkey(&gcm_ctx, MBEDTLS_CIPHER_ID_AES, SECRET_KEY, 128);
}

void encrypt_payload(Payload* payload) {
  // El "Texto Plano" que queremos cifrar son los 12 bytes de datos reales
  uint8_t plaintext[13];
  memcpy(
      plaintext, &payload->HeadData,
      6);  // Pitch, Roll, Yaw de la cabeza, cada uno de 2 bytes (total 6 bytes)
  memcpy(plaintext + 6, &payload->BackData, 6);
  memcpy(plaintext + 12, &payload->status.byte, 1);

  // Búfer para el texto cifrado (mismo tamaño que el plano)
  uint8_t ciphertext[13];

  // Para AES-GCM, el vector de inicialización (IV) debe tener al menos 8 bytes,
  // ideal 12. Usaremos el nonce (4 bytes) repetido o rellenado para generar un
  // IV de 12 bytes.
  uint8_t iv[12] = {0};
  memcpy(iv, &payload->nonce,
         4);  // Llenamos los primeros 4 bytes con nuestro contador
  uint8_t temp_tag[8] = {0};  // Buffer temporal para el tag de 8 bytes

  // Ciframos y generamos el Tag de 7 bytes
  mbedtls_gcm_crypt_and_tag(&gcm_ctx, MBEDTLS_GCM_ENCRYPT,
                            13,       // Tamaño de los datos a cifrar
                            iv, 12,   // Vector de inicialización
                            NULL, 0,  // Datos adicionales (AAD) - no usamos
                            plaintext, ciphertext, 8,
                            temp_tag);  // Generar tag de 7 bytes

  // Rellenamos el payload con los datos cifrados
  memcpy(&payload->HeadData, ciphertext,
         6);  // Los primeros 6 bytes del ciphertext van para la cabeza
  memcpy(&payload->BackData, ciphertext + 6,
         6);  // Los siguientes 6 bytes van para la espalda
  memcpy(&payload->status, ciphertext + 12,
         1);                          // El último byte va para el estado
  memcpy(payload->tag, temp_tag, 8);  // Copiamos el tag generado al payload
}

uint16_t normalize_angle(float angle) {
  // Normalizamos el ángulo a un rango de 0 a 360 grados
  while (angle < 0) angle += 360.0f;
  while (angle >= 360) angle -= 360.0f;

  // Mapeamos el rango de 0-360 a 0-65535 (16 bits)
  return (uint16_t)(angle * 100);
}
