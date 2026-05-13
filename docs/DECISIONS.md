# Registro de Decisiones de Arquitectura (ADR) - PoseFix

Este documento registra las decisiones clave tomadas durante el desarrollo del proyecto PoseFix.

## [2026-05-06] - Manejo de Robusto de BLE en macOS con Tauri

### Contexto
El escaneo y la comunicación BLE utilizando la librería `btleplug` en macOS a veces causaba cierres abruptos (*segfaults* o *SIGABRT*) si el hilo de ejecución de CoreBluetooth fallaba o si ocurría un *panic* dentro de un hilo asíncrono de Tokio. Además, las restricciones de seguridad de macOS impedían mostrar los diálogos de permisos si el binario no estaba correctamente identificado y firmado.

### Decisión
1.  **Aislamiento de Hilos**: Mover las operaciones de BLE a `spawn_blocking` y envolverlas en `catch_unwind` para evitar que fallos en el *run loop* de CoreBluetooth propaguen el cierre a toda la aplicación.
2.  **Identificación Unívoca**: Forzar el uso del Bundle ID `com.posefix.dev` en todos los archivos de configuración (`Info.plist`, `tauri.conf.json`).
3.  **Firma Automática y Manual**: Configurar Tauri para refirmar con `signingIdentity: "-"` y proveer un script de refirma manual (`resign-dev.sh`) para asegurar que los *entitlements* de Bluetooth y Cámara siempre estén vinculados al binario durante el desarrollo.

### Consecuencias
-   **Positivas**: Mayor estabilidad durante el desarrollo. La aplicación ahora solicita permisos correctamente. Se evitan cierres por errores de bajo nivel en Bluetooth.
-   **Negativas**: Se requiere un paso adicional de firma si las herramientas de construcción borran la firma del binario.

---

## [2026-05-06] - Simplificación del Manejo de Info.plist

### Contexto
Se estaba utilizando el crate `embed_plist` para incrustar manualmente el `Info.plist` en el binario de Rust, mientras que Tauri ya realiza este proceso de forma nativa mediante `tauri::generate_context!()`.

### Decisión
Eliminar la dependencia de `embed_plist` y confiar exclusivamente en la integración nativa de Tauri.

### Consecuencias
-   **Positivas**: Resolución de conflictos de símbolos duplicados en tiempo de linkeo. Código más limpio y alineado con los estándares de Tauri.

---

## [2026-05-06] - Bypass de TCC en macOS 26 Tahoe mediante Linker Wrapper

### Contexto
En macOS 26 Tahoe, el subsistema TCC (Transparency, Consent, and Control) cierra inmediatamente cualquier binario que intente acceder a APIs de privacidad (Bluetooth, Cámara) si no se está ejecutando desde un bundle `.app` válido. Los flujos estándar de `cargo run` o `bun tauri dev` ejecutan el binario directamente desde `target/debug/app`, lo que provoca un crash por violación de privacidad incluso si el binario está firmado.

### Decisión
Implementar un sistema de enmascaramiento de ejecución:
1.  **Linker Wrapper**: Usar un script personalizado (`linker-wrapper.sh`) que intercepta la fase final del linkeo para crear automáticamente una estructura de bundle `PoseFix.app` en el directorio de salida.
2.  **Shell Shim**: Reemplazar el binario esperado por las herramientas de construcción (`target/debug/app`) con un script de shell (shim) que redirige la ejecución a través de `open PoseFix.app` o ejecutando directamente el binario dentro del bundle Contents/MacOS.

### Consecuencias
-   **Positivas**: Se permite el desarrollo y debugging de APIs de privacidad en macOS 26 Tahoe sin sacrificar el flujo de trabajo de Tauri. El sistema operativo reconoce el proceso como parte de una aplicación legítima.
-   **Negativas**: Mayor complejidad en el proceso de construcción y linkeo. Los errores de ruta en el shim pueden bloquear el compilador (como se vio en `swift-rs`).
