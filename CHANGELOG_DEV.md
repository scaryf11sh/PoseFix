# CHANGELOG DEV — PoseFix

Registro técnico de bugs, fixes y cambios. Más reciente primero.

---

## 2026-05-06

### Bug 1 — Compile error: símbolo `_EMBED_INFO_PLIST` duplicado

**Síntoma**
`bun tauri dev` fallaba con:
```
error: symbol `_EMBED_INFO_PLIST` is already defined
  --> src/lib.rs:1072:16
   |
   .build(tauri::generate_context!())
```

**Causa raíz**
`lib.rs` llamaba manualmente `embed_plist::embed_info_plist!("../Info.plist")` en las primeras líneas. El macro `tauri::generate_context!()` también llama `embed_info_plist_bytes!` internamente (ya que `tauri.conf.json` tiene `bundle.macOS.infoPlist = "Info.plist"`). Dos llamadas al mismo macro → símbolo `_EMBED_INFO_PLIST` definido dos veces → error de linkeo.

La llamada manual fue añadida intentando resolver el Bug 2 (crash BLE), pero era completamente redundante: Tauri ya embebe el plist correctamente.

**Fix aplicado**
- `src-tauri/src/lib.rs`: removidas líneas 1-2 (`#[cfg(target_os = "macos")] embed_plist::embed_info_plist!("../Info.plist")`)
- `src-tauri/Cargo.toml`: removida dependencia `embed_plist = "1"`

**Estado:** ✅ Resuelto

---

### Bug 2 — App crashea (SIGABRT) al escanear sensores BLE

**Síntoma**
La app crashea al iniciar escaneo BLE desde la pantalla de Settings. El crash ocurre en el comando Tauri `ble_scan`.

**Causa raíz probable**
`CBCentralManager` (CoreBluetooth de macOS, usado internamente por `btleplug 0.11`) genera un `SIGABRT` o `NSException` cuando el permiso Bluetooth no ha sido otorgado o está denegado en el sistema. Este tipo de crash **no es capturado** por el panic handler de Rust ni por `tokio::task::spawn()`.

Contexto adicional:
- `NSBluetoothAlwaysUsageDescription` sí estaba presente en `Info.plist` ✓
- Tauri embebe el plist correctamente vía `generate_context!()` ✓
- El problema es de runtime permissions (macOS TCC)
- No existe archivo de entitlements en `src-tauri/`

**Fix aplicado**
1. `src-tauri/macos/entitlements.plist` creado con `com.apple.security.bluetooth = true` y sandbox desactivado (`com.apple.security.app-sandbox = false`)
2. `tauri.conf.json` actualizado: añadido `"entitlements": "macos/entitlements.plist"` en `bundle.macOS`
3. `ble_scan` en `lib.rs` reescrito: cambiado de `tokio::task::spawn(async {})` a `tokio::task::spawn_blocking(move || { std::panic::catch_unwind(AssertUnwindSafe(|| { handle.block_on(async { ... }) })) })`:
   - `spawn_blocking` da a CoreBluetooth un thread OS con run loop propio (requerimiento de `CBCentralManager`)
   - `catch_unwind(AssertUnwindSafe(...))` captura panics de btleplug (p.ej. `CBManagerStateUnauthorized`) y los convierte en `Err(String)` en lugar de SIGABRT

**Caveat importante**: `catch_unwind` NO intercepta un SIGABRT enviado directamente por el OS/ObjC runtime. Si macOS fuerza el abort, la única solución confiable es que el permiso BT esté otorgado (vía el dialog de `NSBluetoothAlwaysUsageDescription`) y que la app esté firmada con los entitlements.

**`cargo check`**: ✅ Pasa (6.74s)

**Estado:** ✅ Resuelto (pendiente prueba en hardware)

---

### Bug 2b — Permisos Bluetooth/Cámara nunca muestran diálogo (causa raíz real)

**Síntoma**
- No aparecía diálogo "PoseFix quiere usar Bluetooth"
- No aparecía diálogo de permisos de cámara
- App crasheaba en `ble_scan`

**Causa raíz** (encontrada via `codesign -dv`)
El binario compilado por Cargo tiene firma de enlazador con:
```
Identifier=app-6a02577012df23eb  ← hash de archivo, NO el bundle ID real
Info.plist=not bound             ← plist NO vinculada a la firma
```
Sin `Identifier=com.posefix.dev` y sin plist vinculada, macOS TCC no asocia solicitudes de permisos con la app → diálogos nunca aparecen → CoreBluetooth entra en estado no autorizado → btleplug crashea.

Adicionalmente: `CFBundleIdentifier` faltaba en `src-tauri/Info.plist`.

TCC DB consultada: cero registros para PoseFix → nunca llegó a pedir permisos.

**Fix aplicado**
1. `src-tauri/Info.plist`: añadido `CFBundleIdentifier = "com.posefix.dev"`
2. `tauri.conf.json`: añadido `"signingIdentity": "-"` en `bundle.macOS` → Tauri re-firma en dev mode con ad-hoc + entitlements
3. `macos/entitlements.plist`: removido `com.apple.security.app-sandbox = false` (innecesario)
4. Binario re-firmado manualmente:
   `codesign --force --sign - --identifier "com.posefix.dev" --entitlements macos/entitlements.plist target/debug/app`
   → Resultado: `Identifier=com.posefix.dev`, `Info.plist entries=7` ✓
5. `macos/resign-dev.sh`: script de re-firma de fallback

**Estado:** ✅ Resuelto

---
