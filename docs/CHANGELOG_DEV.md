  # Changelog de Desarrollo - PoseFix

## [2026-05-06]

### Bugs Corregidos

#### Bug 1 — Error de Compilación: Símbolo `_EMBED_INFO_PLIST` Duplicado
- **Síntoma**: `bun tauri dev` fallaba con el error: `error: symbol '_EMBED_INFO_PLIST' is already defined` en `src/lib.rs:1072`.
- **Causa**: El archivo `lib.rs` contenía `embed_plist::embed_info_plist!("../Info.plist")` en las líneas 1 y 2. Sin embargo, la macro `tauri::generate_context!()` ya invoca `embed_info_plist_bytes!` internamente (basándose en la configuración `bundle.macOS.infoPlist` de `tauri.conf.json`), lo que generaba un símbolo duplicado durante la fase de enlazado (linking).
- **Solución**: Se eliminaron las líneas 1 y 2 de `src-tauri/src/lib.rs` y se removió la dependencia `embed_plist = "1"` de `Cargo.toml`.

#### Bug 2 — Escaneo BLE: Mejora en el Manejo de Errores
- **Cambio**: Se reescribió la lógica de `ble_scan`.
- **Detalle**: Se cambió el uso de `tokio::task::spawn(async{})` por `spawn_blocking` combinado con `catch_unwind(AssertUnwindSafe)`.
- **Objetivo**: Asegurar que CoreBluetooth tenga su propio run loop y que cualquier *panic* proveniente de la librería `btleplug` se capture como un `Err` en lugar de provocar un cierre abrupto del proceso mediante `SIGABRT`.
- **Archivos afectados**: `src-tauri/src/lib.rs`.

#### Bug 3 — Permisos de Bluetooth/Cámara: Diálogos no se mostraban
- **Síntoma**: La aplicación no solicitaba permisos para Bluetooth ni Cámara al usuario, y fallaba (crash) al intentar realizar el escaneo BLE.
- **Causa Raíz**: Una inspección con `codesign -dv` reveló que el binario tenía el identificador genérico `app-6a02577012df23eb` (basado en el hash del archivo) y el campo `Info.plist` aparecía como `not bound`. El sistema TCC de macOS no puede asociar solicitudes de permisos si no hay un Bundle ID válido vinculado a la firma. Además, faltaba la entrada `CFBundleIdentifier` en `src-tauri/Info.plist`.
- **Soluciones Aplicadas**:
  1. **Info.plist**: Se añadió `CFBundleIdentifier = com.posefix.dev` en `src-tauri/Info.plist`.
  2. **Configuración de Tauri**: En `tauri.conf.json` -> `bundle.macOS`, se añadió `signingIdentity: "-"` para forzar a Tauri a refirmar el binario en modo desarrollo con una firma *ad-hoc* y los *entitlements* correspondientes.
  3. **Entitlements**: Se actualizó `src-tauri/macos/entitlements.plist` eliminando `com.apple.security.app-sandbox=false` (innecesario al no usar sandbox) y manteniendo únicamente `com.apple.security.bluetooth=true`.
  4. **Refirma Manual**: Se ejecutó `codesign --force --sign - --identifier com.posefix.dev --entitlements macos/entitlements.plist target/debug/app`, logrando un identificador correcto y el vínculo con las entradas de `Info.plist`.
  5. **Script de Fallback**: Se creó `src-tauri/macos/resign-dev.sh` para automatizar la refirma en caso de que `cargo rebuild` elimine la firma existente.

## 2026-05-06 (continuación)

### Bug 2c — App crashea con TCC_CRASHING_DUE_TO_PRIVACY_VIOLATION en macOS 26 Tahoe

**Síntoma**
En macOS 26 Tahoe beta, la app crashea SIEMPRE al tocar APIs de privacidad (Bluetooth, Cámara), incluso con firma correcta (Identifier=com.posefix.dev). Diálogos de permisos nunca aparecen.

**Causa raíz**
macOS 26 Tahoe endureció TCC: binarios ejecutados fuera de un bundle .app son crasheados directamente por el OS (SIGABRT vía __TCC_CRASHING_DUE_TO_PRIVACY_VIOLATION__). No es un panic de Rust — catch_unwind no lo captura. Requiere que el proceso corra desde PoseFix.app/Contents/MacOS/PoseFix.

**Fix aplicado**
1. src-tauri/macos/bundle-Info.plist (nuevo): Info.plist completo para el bundle con CFBundleExecutable, CFBundlePackageType=APPL, CFBundleIdentifier=com.posefix.dev, y todos los NSUsageDescription keys.
2. src-tauri/macos/linker-wrapper.sh actualizado: después de firmar el binario, crea automáticamente target/debug/PoseFix.app/Contents/MacOS/ con el binario copiado y firmado (codesign --deep), y luego reemplaza el output del linker con un shell shim que hace exec al binario del bundle. Cargo copia el shim a target/debug/app. bun tauri dev ejecuta el shim → exec del bundle binary → TCC ve proceso en .app → muestra diálogos de permisos.
3. src-tauri/macos/dev-macos.sh (nuevo): script alternativo de workflow que inicia Vite + cargo build + open PoseFix.app para macOS 26.

**Resultado verificado**
- Ejecutando via open target/debug/PoseFix.app: diálogo de permisos de Cámara aparece ✓
- BLE scan no crashea ✓
- Identifier=com.posefix.dev, Info.plist entries=12, flags=adhoc ✓

**Estado:** ✅ Resuelto para workflow open .app / En prueba para bun tauri dev

---

### Bug 3 — 'Command ble_scan not found' al correr el bundle

**Síntoma**
Al correr open target/debug/PoseFix.app sin Vite corriendo, la WebView carga un frontend cacheado/viejo que devuelve 'Command ble_scan not found'.

**Causa**
Bundle binary correcto (ble_scan registrado en invoke_handler línea 1061). Error ocurre porque Vite dev server no estaba corriendo — WebView no puede conectar a localhost:5173.

**Fix**
Correr siempre Vite primero: bun run dev, luego open target/debug/PoseFix.app. O usar dev-macos.sh que automatiza ambos pasos.

**Estado:** ✅ Resuelto (workflow)
