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
-   **Negativas**: Mayor complejidad en el proceso de construcción y linkeo. Los errores de ruta en el shim pueden bloquear el compilador (como se vio en \`swift-rs\`).

---

## [2026-05-18] - Límite de Concurrencia en Cámaras y Simplificación de UI

### Contexto
La ejecución de múltiples modelos de detección de pose (YOLO/Mediapipe) sobre streams de video simultáneos consume recursos significativos de CPU/GPU. Permitir un número ilimitado de cámaras o vistas densas (como 3x3) degradaba la experiencia del usuario y la precisión de los landmarks debido a la latencia de procesamiento.

### Decisión
1.  **Límite de Hardware**: Restringir el número máximo de cámaras activas a 4.
2.  **Eliminación de Vista 3x3**: Estandarizar el monitor en vistas \`single\` y \`2x2\`.
3.  **Gestión de Advertencias**: Implementar un sistema de feedback temporal (\`cameraLimitWarning\`) en lugar de diálogos de error obstructivos.

### Consecuencias
-   **Positivas**: Rendimiento estable y predecible. Interfaz de usuario más limpia y enfocada. Reducción de la carga térmica en equipos portátiles.
-   **Negativas**: Usuarios con configuraciones de más de 4 cámaras no podrán utilizarlas todas simultáneamente.

---

## [2026-05-18] - Sistema Híbrido de Alertas de Salud

### Contexto
Las notificaciones del sistema en macOS/Windows pueden ser fácilmente ignoradas o silenciadas (Modo Enfoque). Por otro lado, las ventanas emergentes intrusivas pueden interrumpir tareas críticas si son la única opción.

### Decisión
Implementar un campo \`alert_type\` en el estado de salud que permite al usuario elegir entre:
1.  **Notificaciones**: Menos intrusivas, persistentes en el centro de notificaciones.
2.  **Ventana de Alerta**: Una ventana de Tauri dedicada con un contador visual que fomenta el descanso activo.
3.  **Ambas**: El modo por defecto para máxima efectividad.

### Consecuencias
-   **Positivas**: Mayor flexibilidad para el usuario. El sistema es más difícil de ignorar sin ser forzosamente molesto.
-   **Negativas**: Incremento en la complejidad de la lógica de sincronización entre el backend de Rust y el gestor de ventanas del frontend.

---

## [2026-05-18] - Optimización de Latencia y Precisión del Motor de Salud

### Contexto
Un intervalo de `sleep` prolongado (60s o 30s) en el loop de salud de Rust generaba una "ventana de incertidumbre" donde el contador del frontend llegaba a cero pero la alerta tardaba en dispararse.

### Decisión
Reducir drásticamente el intervalo de chequeo a **5 segundos**.

### Consecuencias
-   **Positivas**: Alertas casi instantáneas y sincronización percibida perfecta entre el frontend y el backend.
-   **Negativas**: El hilo de fondo despierta con más frecuencia, aunque el impacto en CPU sigue siendo despreciable dada la simplicidad de las comprobaciones.

---

## [2026-05-18] - Overlays Multimonitor para Bloqueo de Interacción

### Contexto
En configuraciones con varios monitores, el popup de descanso solo aparecía en la pantalla principal, permitiendo al usuario continuar trabajando en las pantallas secundarias e invalidando el propósito del descanso.

### Decisión
Implementar un sistema que, al activarse un descanso, consulte los monitores disponibles a través de la API de Tauri y cree una ventana de oscurecimiento (`break_overlay`) en cada uno de ellos.

### Consecuencias
-   **Positivas**: Garantiza que el descanso sea efectivo al bloquear visualmente todas las áreas de trabajo del usuario.
-   **Negativas**: Incremento en el consumo de memoria al mantener múltiples instancias de Webview durante el descanso.

---

## [2026-05-18] - Control Nativo de Ocultación de Ventanas (Rust)

### Contexto
La llamada `hide()` desde JavaScript sobre ventanas de tipo `break_alert` mostraba un comportamiento errático en Tauri 2, dejando a veces la ventana o los overlays activos de forma fantasma.

### Decisión
Centralizar la lógica de ocultación en un comando de Rust (`hide_break_alert`) que gestiona nativamente tanto el popup como la destrucción de todos los overlays multimonitor.

### Consecuencias
-   **Positivas**: Cierre de UI 100% fiable y determinista. Limpieza completa de recursos en cada ciclo de descanso.
-   **Negativas**: Requiere una llamada IPC adicional desde el frontend al saltar el descanso.

---

## [2026-05-18] - Estandarización de Gráficas: Chart.js con Acciones de Svelte 5

### Contexto
Librerías de gráficas reactivas como `layerchart` presentaban problemas de renderizado y sincronización en el entorno híbrido de Tauri y el nuevo modelo de Svelte 5. Se requería una solución robusta y de bajo nivel que se integrara limpiamente con el DOM.

### Decisión
Adoptar **Chart.js** como la librería estándar de visualización, integrándola mediante **Svelte Actions** (`use:action`).
- Cada gráfica se encapsula en una función de acción que maneja `mount`, `update` y `destroy`.
- Se prohíbe el uso de wrappers como `svelte-chartjs` para mantener un control total sobre las instancias del canvas.

### Consecuencias
-   **Positivas**: Rendimiento óptimo, gestión de memoria garantizada y compatibilidad total con Svelte 5.
-   **Negativas**: Requiere un poco más de código boilerplate para cada tipo de gráfica.

---

## [2026-05-18] - Overlays de Descanso Nativo vs. CSS

### Contexto
Los overlays basados en CSS y filtros de desenfoque (`backdrop-filter`) solo afectaban al contenido dentro de la ventana de la aplicación PoseFix. En sistemas multi-monitor, esto permitía al usuario ignorar el descanso utilizando otras pantallas.

### Decisión
Migrar a **ventanas de Tauri nativas** independientes para cada monitor.
- Uso de `available_monitors()` en el backend de Rust para spawnear ventanas `always_on_top` y transparentes.
- Carga de una ruta mínima `/overlay` para el oscurecimiento visual.

### Consecuencias
-   **Positivas**: Bloqueo efectivo del escritorio a nivel de sistema operativo en todas las pantallas.
-   **Negativas**: Mayor complejidad en la gestión de permisos en `capabilities/default.json`.

---

## [2026-05-18] - Relay de Datos de Alta Frecuencia (Score)

### Contexto
Enviar el score de postura en tiempo real desde la ventana de cámara al Menubar vía IPC de Tauri (`emit` global) generaba una carga innecesaria en el puente Rust-JS para datos que son exclusivamente de visualización frontend.

### Decisión
Utilizar el bus de datos del navegador: **localStorage + evento storage**.
- La ventana emisora escribe el valor.
- La ventana receptora escucha el cambio de forma nativa.

### Consecuencias
-   **Positivas**: Latencia mínima y cero carga en el proceso principal de Rust.
-   **Negativas**: El dato persiste en el disco/caché del navegador hasta que se limpie manualmente.

---
*Documentado por: Documenter*
