# Tareas Pendientes (TODO) - PoseFix

## Documentación
- [x] Completar la descripción técnica de los atajos de teclado globales y específicos de página.
- [ ] Documentar el proceso de calibración de los sensores BNO055.
- [ ] Detallar la estructura de mensajes del protocolo BLE Handshake.
- [ ] Crear guías de configuración inicial para nuevos desarrolladores (Setup Guide).

## Desarrollo (Inferido)
- [x] Validar la integración del \`Pose Server\` (Python) con el frontend de SvelteKit (YOLOv8).
- [ ] Mejorar la visualización de datos en tiempo real de los sensores duales.
- [x] Implementar un sistema de logs persistentes en la aplicación Tauri para facilitar el debugging de BLE.
- [ ] Resolver conflicto de ruta de ejecución (Exit status 126) en el script de build de \`swift-rs\` causado por el shim.
- [ ] Ajustar la resolución de rutas relativas en el entorno de \`cargo test\` para soportar la estructura del bundle generado por el linker wrapper.
- [x] Finalizar comportamiento del Tray Icon (Activation Policy y Reopen handler).
- [x] Implementar sistema híbrido de alertas (Notificación / Ventana).
- [x] Sincronización de idioma en tiempo real entre ventanas.
- [x] Sincronización proactiva de ajustes de salud al iniciar sesión.
- [x] Ajuste de precisión máxima del ciclo de monitoreo (5s).
- [x] Sistema de overlays multimonitor para bloqueos de descanso.
- [x] Control nativo de ocultación de ventanas y limpieza de recursos (Rust).
- [x] Sincronización de score de postura en tiempo real en Menubar.
- [ ] Refinar estimación de distancia ocular para diferentes resoluciones de cámara.

## Bloqueos / Dudas
- [TBD] Confirmar si el servidor de pose requiere GPU o si puede ejecutarse localmente en CPU con YOLOv8.
- [TBD] Verificar si es necesaria la publicación en la App Store de macOS o si se mantendrá como distribución ad-hoc/DMG.
