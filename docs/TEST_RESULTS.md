# Resultados de Pruebas - PoseFix

## 2026-05-06

### Resumen de Pruebas Técnicas

| Prueba | Estado | Notas |
| :--- | :---: | :--- |
| Flujo de escaneo BLE | ⚠️ | Implementado en `src-tauri/src/lib.rs`. Análisis estático confirma uso de `btleplug` con `spawn_blocking` y `catch_unwind`. Fallo en ejecución vía `cargo test` por problemas con la ruta del shim. |
| Permisos de Cámara | ✅ | Verificado: `Info.plist` contiene `NSCameraUsageDescription`. El frontend gestiona el estado de permisos en las páginas de SvelteKit. |
| Estructura del Bundle | ✅ | Verificado. Binario presente en: `src-tauri/target/debug/PoseFix.app/Contents/MacOS/PoseFix`. |
| Firma de Código (Codesign) | ✅ | Verificado. Identifier: `app-6a02577012df23eb`, flags: `0x20002` (adhoc, linker-signed). |
| Shim del Ejecutable | ✅ | Verificado. `src-tauri/target/debug/app` es un shell script que hace `exec` al binario. |
| Cargo Check | ❌ | **FALLIDO**. El script de build de `swift-rs v1.0.7` falló con status 126 (problema de ruta del shim). |

---

### Detalles de Fallos

#### 1. Fallo en Cargo Check (swift-rs)
- **Error**: Exit status 126 durante el build script.
- **Contexto**: Relacionado con la configuración de rutas del shim en el entorno de desarrollo de macOS.
- **Impacto**: Bloquea el chequeo estático completo del proyecto mediante Cargo.

#### 2. Fallo en Ejecución de Tests BLE
- **Causa**: El entorno de test no resuelve correctamente las rutas relativas al shim del bundle.
