# Reporte Técnico: Proyecto PoseFix
**Sistema Híbrido de Monitoreo Postural y Salud Ocupacional**

## 1. Resumen
PoseFix es una solución integral de salud ocupacional diseñada para entornos de escritorio (macOS). El sistema aborda el sedentarismo y los problemas ergonómicos mediante un enfoque de monitoreo dual: sensores inerciales (*wearables*) y visión computacional (IA). 

A diferencia de otras soluciones, PoseFix opera bajo un paradigma de **Privacidad por Diseño**, ejecutando el procesamiento de IA y el almacenamiento de datos de forma 100% local (offline), eliminando riesgos de seguridad asociados a la nube. El objetivo principal es proporcionar feedback en tiempo real sobre la postura cervical/torácica y la fatiga visual, integrando ejercicios correctivos y estadísticas de progreso.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend** | Svelte 5 (Runes) | Framework reactivo de alto rendimiento. |
| **UI/UX** | Tailwind CSS v4 | Estilizado moderno y utilitario. |
| **Visualización** | LayerChart / Lucide | Gráficas complejas y set de iconos ergonómicos. |
| **Core Desktop** | Tauri v2 (Rust) | Orquestador nativo y seguridad de memoria. |
| **Base de Datos** | SQLite (Modo WAL) | Motor local con migraciones gestionadas por plugin. |
| **Visión / IA** | YOLOv8-pose / Python | Modelo de estimación de pose en tiempo real. |
| **Hardware** | ESP32-S3 / BNO055 | Procesamiento de orientación absoluta (9 ejes). |
| **Comunicación** | BLE / WebSockets | Protocolos de baja latencia para sensores e IPC. |

---

## 3. Arquitectura del Sistema

El sistema utiliza una arquitectura de **Lazo de Retroalimentación Híbrido**.

### Capas de Interacción:
1.  **Capa de Sensores (Hardware):** Un ESP32-S3 Sense recolecta datos de dos sensores BNO055 (cervical y torácico). Los datos se cifran (AES) y se transmiten vía BLE tras un *handshake* de seguridad.
2.  **Capa de Visión (Subproceso):** El `pose_server.py` (proceso hijo de Tauri) gestiona la cámara mediante OpenCV y ejecuta inferencia YOLOv8-pose. Se comunica con el frontend mediante un WebSocket local (`ws://localhost:8765`).
3.  **Capa de Orquestación (Tauri/Rust):** Gestiona el ciclo de vida de los procesos, la persistencia en SQLite y la lógica de fusión de datos (promedios ponderados y suavizado EMA).
4.  **Capa de Presentación (SvelteKit):** Renderiza la UI, maneja el estado global de la sesión y las visualizaciones de LayerChart.

### Diagrama de Flujo de Datos (ASCII):
```text
[Wearable Sensor] --(BLE/AES)--> [Tauri (Rust)] <==> [SQLite Local]
                                     ||
                               (Tauri Commands)
                                     ||
[Cámara Web] --(OpenCV)--> [Pose Server (Python)] <--(WS)--> [Dashboard (Svelte)]
                                |
                         [YOLOv8 Inference]
```

---

## 4. Páginas y Funcionalidades

| Ruta | Nombre | Funcionalidad Clave |
| :--- | :--- | :--- |
| `/` | Dashboard | Vista general, gauge de postura (PieChart) y tips del día. |
| `/camera` | Monitor | Visualización de landmarks YOLO y feedback visual. |
| `/progress` | Progreso | Análisis histórico semanal (LineChart) de scores posturales. |
| `/exercises` | Ejercicios | Integración con ExerciseDB API para pausas activas. |
| `/gallery` | Historial | Galería de sesiones anteriores y eventos de advertencia. |
| `/export` | Exportar | Generación de reportes detallados en formato JSON y PDF. |
| `/settings` | Configuración | Escaneo BLE, gestión de cámara y personalización (ES/EN). |
| `/account` | Perfil | Gestión de metas diarias y datos biométricos básicos. |

---

## 5. Esquema de Base de Datos (SQLite)

El diseño de la base de datos prioriza la integridad relacional y el rendimiento en consultas de agregación.

-   **`users`:** Almacena perfil, `posture_goal` y `avatar_path`. El campo `username` actúa como identificador único para la lógica de auth local.
-   **`sessions`:** Registra el histórico de uso. Incluye un campo `sensor_data` (JSON) para análisis granular post-sesión.
-   **`warnings`:** Almacena cada evento de mala postura detectado (tipo, gravedad, duración).
-   **Vistas Optimización:**
    -   `weekly_stats`: Proporciona medias de score y totales de duración agrupados por día.
    -   `session_summaries`: Clasifica la postura en categorías clínicas: **EXCELLENT (≥95), GOOD (≥80), FAIR (≥60), POOR (<60)**.

---

## 6. Evolución Cronológica (Timeline)

-   **Fase 0 (Abril 3-4):** Cimentación. Setup de Tauri + SvelteKit. Implementación de AES en firmware.
-   **Fase 1 (Abril 4-5):** Persistencia. Migración de SQLite y sistema de autenticación local.
-   **Fase 2 (Abril 5-6):** Visualización. Integración de LayerChart y rediseño de UI con Tailwind 4.
-   **Fase 3 (Abril 5-15):** Inteligencia. Integración de YOLOv8-pose y reglas de goniometría (Norkin & White).
-   **Fase 4 (Abril 15-27):** Conectividad. Reescritura del sensor ESP32 para soporte BLE nativo en lugar de IP.
-   **Fase 5 (Mayo 2026):** Estabilidad y Background. Implementación de System Tray, modo segundo plano y sistema de descansos programables.
-   **Fase 6 (Mayo 13, 2026):** Salud Visual y i18n. Implementación de estimación de distancia ojo-monitor y soporte multilenguaje completo en ajustes.

---

## 7. Sistema de Descansos y Background Mode

Para garantizar una protección continua sin interrumpir el flujo de trabajo, PoseFix implementa un motor de ejecución en segundo plano persistente.

### Funcionalidades Clave:
1.  **System Tray (Barra de Menú):**
    -   Muestra el estado en tiempo real (PF: [Analizando]).
    -   Contador de tiempo de sesión y cronómetro para el próximo descanso directamente en el título del tray (macOS).
    -   Acceso rápido para restaurar la ventana o salir de la aplicación.
2.  **Ciclo de Vida Persistente:**
    -   La aplicación intercepta el evento de cierre (`Cmd+W` o botón cerrar).
    -   En lugar de terminar el proceso, la ventana se oculta (`hide`), manteniendo activa la lógica de análisis y los temporizadores en Rust.
3.  **Gestor de Salud (Health Engine):**
    -   **Frecuencia configurable:** Ajuste de intervalos de trabajo (15-120 min).
    -   **Duración de pausa:** Definición de tiempo de descanso sugerido.
    -   **Notificaciones Nativas:** Envío de recordatorios mediante el sistema de notificaciones de macOS al cumplirse el intervalo.

### Arquitectura de Fondo:
La lógica de tiempo reside en un hilo dedicado de Rust (`tauri::async_runtime`), lo que asegura que los recordatorios funcionen incluso si el motor de renderizado de la interfaz está pausado por el sistema operativo para ahorrar energía.

---

## 8. Salud Visual (Eye Health)
PoseFix utiliza la cámara para estimar la distancia entre el usuario y el monitor, promoviendo hábitos que reducen la fatiga visual.
- **Modelo Pinhole**: Estimación basada en el ancho del video y la distancia interpupilar estándar (6.3cm).
- **Alertas Proactivas**: El sistema notifica visualmente si el usuario se mantiene fuera del rango recomendado (50-70cm).

---

## 9. Registro de Bugs y Soluciones

| Bug | Síntoma | Causa Raíz | Solución |
| :--- | :--- | :--- | :--- |
| **Símbolo Duplicado** | Fallo de compilación Tauri | Doble inclusión de `embed_plist`. | Remoción de dependencia externa; Tauri ya incluye la macro. |
| **SIGABRT BLE** | Crash al escanear Bluetooth | Denegación de permiso TCC en macOS. | Configuración de `entitlements.plist` y re-firma ad-hoc del binario. |
| **TCC macOS 26** | Crash instantáneo en Tahoe | TCC bloquea binarios fuera de `.app`. | Uso de `linker-wrapper.sh` y shim para ejecutar desde el bundle. |
| **Comando ble_scan** | 'Command not found' en bundle | WebView conectada a cache viejo sin Vite. | Workflow unificado: siempre iniciar Vite antes de abrir el `.app`. |
| **i18n Settings** | Textos en ES/EN mezclados | Falta de claves en archivos de traducción. | Migración completa a `$t()` para secciones Health y AI. |
| **Tray Icon Tahoe** | Icono desaparece al cerrar | `set_activation_policy` rompe el tray en Tahoe. | Eliminación de política de activación; `TrayIcon` en managed state. |

---

## 10. Features Agregados y Removidos

-   **Agregado:** Sistema de atajos de teclado globales para navegación rápida en escritorio.
-   **Agregado:** Handshake de seguridad BLE para prevenir *sniffing* de datos biométricos.
-   **Agregado:** Estimación de distancia ojo-monitor mediante visión computacional.
-   **Cambiado:** El sensor basado en IP (WiFi) fue descartado por alta latencia y consumo energético, siendo reemplazado por **BLE 5.0**.
-   **Cambiado:** El motor de IA pasó de ser un proceso independiente a un subproceso gestionado directamente por el ciclo de vida de Tauri (Tauri Sidecar).
-   **Agregado:** MediaPipe Face Mesh con FaceMeshCoordinator (solo la mejor cámara corre Face Mesh).
-   **Agregado:** Métricas oculares en tiempo real: EAR, blink rate, irritation level.
-   **Agregado:** Visualización de face landmarks en canvas con grupos coloreados y toggle on/off.
-   **Agregado:** Skeleton YOLO mejorado: colores por zona corporal (cara=cyan, torso=indigo, brazos=emerald, piernas=naranja) con opacidad por visibility.
-   **Agregado:** AI Smart Tips (ai-client.ts): tips personalizados via AI con anti-prompt-injection.
-   **Agregado:** Ergonomics Coach chat (ai-chat.ts): chat restringido a ergonomía/salud con disclaimer obligatorio.
-   **Agregado:** Rust WS Bridge para mantener score activo en segundo plano.
-   **Removido:** Botón de autenticación con Google (OAuth no implementado).

---

## 11. Estado Actual y Pendientes

**Estado:** Prototipo funcional de alta fidelidad (v0.8).
-   **Completado:** Core de visión, persistencia, UI reactiva y comunicación BLE.
-   **En Progreso:** Refactorización del store `ble.ts` para mayor robustez en reconexiones.
-   **En Progreso:** Finalización de la política de activación del Dock para modo Accesorio.
-   **Pendiente:** Test de estrés prolongado con hardware real para validar el consumo de batería del ESP32.
-   **Pendiente:** Integración final del motor de consejos dinámicos (AI Store).

---

## 12. Notas Técnicas Importantes

-   **Inferencia Paralela:** El `pose_server` utiliza `CameraWorker` con hilos dedicados para evitar bloqueos en el event loop de Python, permitiendo inferencia multihilo real si se conectan varias cámaras.
-   **Goniometría Clínica:** Los umbrales de advertencia no son arbitrarios; se basan en estándares de goniometría clínica para ángulos de inclinación cervical y torácica.
-   **Latencia IPC:** La comunicación vía WebSocket localhost mantiene una latencia de ~0.3ms, lo cual es despreciable comparado con los 30-50ms de procesamiento de YOLO.
- **Seguridad macOS:** Se implementó un script de re-firma (`resign-dev.sh`) para asegurar que las capacidades de Bluetooth y Cámara sean reconocidas correctamente por el sistema TCC (Transparency, Consent, and Control) de Apple durante el desarrollo.

---

## 13. Diagramas del Sistema

### 13.1 Diagrama Entidad-Relación (Base de Datos)

```mermaid
erDiagram
    users {
        INTEGER id PK
        TEXT username UK
        TEXT email UK
        TEXT full_name
        TEXT profession
        INTEGER age
        TEXT avatar_path
        INTEGER posture_goal
        TEXT password_hash
        TEXT created_at
    }
    user_sessions {
        INTEGER id PK
        INTEGER user_id FK
        TEXT session_start
        TEXT session_end
        INTEGER duration
        INTEGER posture_score
        INTEGER warnings
        INTEGER fatigue_score
        REAL eye_distance
        INTEGER blink_rate
        TEXT sensor_data
    }
    warnings {
        INTEGER id PK
        INTEGER session_id FK
        TEXT warning_type
        TEXT label
        TEXT start
        INTEGER duration
        INTEGER severity
        INTEGER resolved
        INTEGER resolved_after
    }
    exercises_log {
        INTEGER id PK
        INTEGER user_id FK
        TEXT exercise
        TEXT exercise_id
        TEXT category
        TEXT difficulty
        INTEGER duration
        INTEGER points
        TEXT source
        TEXT completed_at
    }
    export_history {
        INTEGER id PK
        INTEGER user_id FK
        TEXT name
        TEXT format
        TEXT categories
        TEXT start_date
        TEXT end_date
        TEXT file_path
        TEXT created_at
    }

    users ||--o{ user_sessions : "tiene"
    users ||--o{ exercises_log : "registra"
    users ||--o{ export_history : "genera"
    user_sessions ||--o{ warnings : "contiene"
```

### 13.2 Diagrama de Arquitectura del Sistema

```mermaid
graph TB
    subgraph Hardware["Capa Hardware"]
        ESP32["ESP32-S3 Sense
(BNO055 x2)"]
        CAM["Cámara Web"]
    end

    subgraph Python["Capa Visión — Python"]
        PS["pose_server.py
WebSocket :8765"]
        YOLO["YOLOv8n-pose
17 keypoints COCO"]
        MP["MediaPipe Face Mesh
478 landmarks"]
        FC["FaceCoordinator
(mejor cámara)"]
        CW["CameraWorker
(1 hilo por cámara)"]
    end

    subgraph Tauri["Capa Orquestación — Tauri/Rust"]
        LIB["lib.rs"]
        ANA["analyze_multi_camera
(EMA α=0.25)"]
        BLE_R["ble_scan / ble_connect
(btleplug)"]
        HEALTH["AppHealthState
(break timer)"]
        DB["SQLite WAL
posefix.db"]
    end

    subgraph Frontend["Capa Presentación — SvelteKit/Svelte 5"]
        DASH["/  Dashboard"]
        CAMERA["/camera  Monitor"]
        SETTINGS["/settings"]
        TRAY["menubar/  Tray Popup"]
        BREAK["break-alert/  Overlay"]
    end

    ESP32 -->|BLE 5.0 notify| BLE_R
    CAM -->|OpenCV VideoCapture| CW
    CW --> YOLO
    CW --> FC
    FC --> MP
    CW -->|JSON WS| CAMERA
    PS -->|ws://localhost:8765| CAMERA
    CAMERA -->|invoke IPC| ANA
    ANA --> DB
    BLE_R --> DB
    HEALTH -->|show window| BREAK
    LIB --> DB
    CAMERA --> DASH
    SETTINGS --> LIB
```

### 13.3 Diagrama de Secuencia — Flujo de Detección de Postura

```mermaid
sequenceDiagram
    participant CAM as Cámara Web (Browser)
    participant PY as pose_server.py
    participant YOLO as YOLOv8n-pose
    participant WS as WebSocket
    participant FE as camera/+page.svelte
    participant RUST as Tauri (lib.rs)
    participant DB as SQLite

    CAM->>PY: frame (OpenCV VideoCapture)
    PY->>YOLO: predict(frame, conf=0.35)
    YOLO-->>PY: keypoints xyn[17] + conf[17]
    PY->>PY: filtrar >= 2 de {sh_L,sh_R,hip_L,hip_R} >= 0.35
    PY->>WS: {camera_index, landmarks[17], timestamp}
    WS->>FE: onmessage(payload)
    FE->>FE: latestLandmarksByCamera.set(idx, lms)
    FE->>FE: calcular eyeDistanceCm (pinhole: 6.3cm IPD, 70 FOV)
    FE->>RUST: invoke("analyze_multi_camera", cameras[])
    RUST->>RUST: compute_posture() x cam, EMA(0.25), weighted avg
    RUST-->>FE: PostureAnalysis {score, metrics[], warnings[]}
    FE->>FE: postureScore, fusedAnalysis ($state)
    FE->>FE: livePostureScore.set(score)
    Note over FE,DB: Al terminar sesion
    FE->>DB: endSession(score, blinks, eye_distance)
```

### 13.4 Diagrama de Secuencia — Detección Visual de Ojo (MediaPipe)

```mermaid
sequenceDiagram
    participant CW as CameraWorker (hilo)
    participant FC as FaceCoordinator
    participant MP as MediaPipe FaceMesh
    participant WS as WebSocket
    participant FE as camera/+page.svelte

    CW->>FC: get_best_camera()
    FC-->>CW: cam_idx (mayor visibilidad)
    alt Este worker ES la mejor camara
        CW->>MP: FaceMesh.process(frame_rgb)
        MP-->>CW: 478 landmarks
        CW->>CW: EAR = (v1+v2)/(2h), EYE_LEFT[16] + EYE_RIGHT[16]
        CW->>CW: blink si EAR < 0.2, buffer 5s, blink_rate_bpm
        CW->>CW: irritation = 1 - (mean_EAR/0.3)
        CW->>WS: payload incluye eye_data {blink_rate_bpm, irritation_level}
        WS->>FE: onmessage(payload)
        Note over FE: eye_data embebido en payload pose, gap actual sin procesar
    else No es la mejor camara
        CW->>WS: payload sin eye_data
    end
```

### 13.5 Diagrama de Secuencia — Sistema de Recordatorio de Descansos

```mermaid
sequenceDiagram
    participant USER as Usuario
    participant FE as Frontend (Svelte)
    participant RUST as Tauri Health Loop (Rust)
    participant NOTIF as macOS Notifications
    participant OVERLAY as break_overlay_N
    participant ALERT as break_alert window

    USER->>FE: Inicia sesion (Dashboard)
    FE->>RUST: invoke("set_session_active", true)
    RUST->>RUST: session_start = Instant::now()

    loop cada 5 segundos
        RUST->>RUST: elapsed > break_interval?
        alt Intervalo cumplido
            alt alert_type notification or both
                RUST->>NOTIF: show("Time for a break!")
            end
            alt alert_type window or both
                RUST->>ALERT: show() + set_always_on_top()
                loop por cada monitor
                    RUST->>OVERLAY: show fullscreen overlay
                end
                RUST->>ALERT: emit("posefix:break-start", {duration})
            end
            RUST->>RUST: last_break = Instant::now()
        end
    end

    USER->>ALERT: Click "Terminar descanso"
    ALERT->>RUST: invoke("hide_break_alert")
    RUST->>OVERLAY: hide() todos los overlays
```

### 13.6 Diagrama de Componentes — Tipos Rust (lib.rs)

```mermaid
classDiagram
    class Landmark {
        +f64 x
        +f64 y
        +f64 z
        +Option~f64~ visibility
    }
    class MetricResult {
        +String id
        +String name
        +f64 value
        +String level
        +u8 status_code
    }
    class PostureAnalysis {
        +u8 posture_score
        +Vec~MetricResult~ metrics
        +Vec~String~ warnings
    }
    class PostureState {
        -Mutex~HashMap~u32-f64~~ ema_scores
        +new() PostureState
    }
    class CameraData {
        +u32 camera_index
        +Vec~Landmark~ landmarks
    }
    class AppHealthState {
        -Mutex~Instant~ session_start
        -Mutex~bool~ session_active
        -Mutex~u64~ break_interval
        -Mutex~u64~ break_duration
        -Mutex~Instant~ last_break
        -Mutex~bool~ mute
        -Mutex~String~ alert_type
    }
    class BleState {
        -Mutex~Option~BleManager~~ manager
        -Mutex~Option~Adapter~~ adapter
        -Mutex~Option~Peripheral~~ peripheral
        -Mutex~Option~JoinHandle~~ task_handle
    }
    class PoseServerState {
        -Arc~Mutex~Option~Child~~~ process
    }
    class SensorAngle {
        +f32 pitch
        +f32 roll
        +f32 yaw
    }
    class BleSensorEvent {
        +u32 nonce
        +Option~SensorAngle~ head
        +Option~SensorAngle~ back
    }
    PostureAnalysis "1" *-- "many" MetricResult
    CameraData "many" *-- "many" Landmark
    BleSensorEvent *-- SensorAngle
    PostureState ..> PostureAnalysis : produce
    CameraData ..> PostureAnalysis : via analyze_multi_camera
```

### 13.7 Diagrama de Flujo — Ciclo de Vida de Camara

```mermaid
flowchart TD
    START([Abrir /camera]) --> PERM{Permiso camara?}
    PERM -->|Denegado| DENIED[Mostrar error + boton Refresh]
    PERM -->|Concedido| ENUM[enumerateDevices, filtrar videoinput]
    ENUM --> FILTER{posefix_enabled_cameras en LS?}
    FILTER -->|Si| SUBSET[Filtrar por IDs guardados]
    FILTER -->|No| ALL[Usar todas]
    SUBSET --> OPEN[Abrir MediaStream 1920x1080 zoom=min]
    ALL --> OPEN
    OPEN --> WS_CONN[connectWs ws://localhost:8765]
    WS_CONN --> WSONOPEN[ws.onopen: set_precision, start_camera x cam]
    WSONOPEN --> RAF[startRaf requestAnimationFrame loop]
    RAF --> DRAW[drawPose: drawImage video + skeleton overlay]
    subgraph Por cada frame YOLO recibido
        MSG[ws.onmessage] --> STORE[latestPayloads / latestLandmarksByCamera]
        STORE --> EYE[Calcular eyeDistanceCm pinhole model]
        EYE --> INVOKE[invoke analyze_multi_camera]
        INVOKE --> EMA[Rust: EMA score]
        EMA --> STATE[postureScore / fusedAnalysis]
    end
    DRAW -.->|Payload mas reciente| MSG
    STATE --> WARN{score < 60 + sesion activa?}
    WARN -->|Si cada 30s| DB_WARN[addWarning SQLite]
    WARN -->|No| LOOP[Continuar]
```
