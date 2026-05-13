# Arquitectura del Sistema - PoseFix

PoseFix es un sistema integral para la corrección de postura que combina hardware (sensores), una aplicación de escritorio (Tauri/SvelteKit) y procesamiento de visión (Python).

## Componentes Principales

### 1. PoseFixSensor (Hardware/Firmware)
Localizado en `/PoseFixSensor/`.
- **Plataforma**: ESP32-S3 (Seeed XIAO ESP32S3).
- **Tecnología**: C++ con PlatformIO.
- **Funcionalidad**: Captura de datos de movimiento mediante sensores inerciales (BNO055) y comunicación vía Bluetooth Low Energy (BLE).

### 2. PoseWebApp (Aplicación de Escritorio)
Localizado en `/PoseWebApp/`.
- **Frontend**: SvelteKit con TypeScript y CSS vainilla.
- **Backend de Escritorio**: Rust (Tauri).
    - **Comunicación con Hardware**: Utiliza `btleplug` en el backend de Rust para escanear y conectarse a los sensores PoseFix.
    - **Gestión de Salud (AppHealthState)**: Módulo en Rust que rastrea el tiempo de sesión, intervalos de descanso y notificaciones mediante `tauri::async_runtime`.
    - **Interfaz de Bandeja (Tray Icon)**: Proporciona persistencia en segundo plano y acceso rápido a controles de sesión.
- **Integración de Comandos**: Implementa comandos de Tauri para control de BLE (scan, connect, start/stop data) y configuración de salud.

### 3. Pose Server (Visión/IA)
Localizado en `/PoseWebApp/pose-server/`.
- **Lenguaje**: Python.
- **Funcionalidad**: Procesamiento de imagen y detección de pose (posiblemente utilizando YOLO o mediapipe, basado en archivos como `yolov8n-pose.pt`).

## Flujo de Datos

1. El **Sensor** recopila datos de orientación y los envía por BLE.
2. La **WebApp (Tauri Backend)** recibe los datos mediante una suscripción BLE.
3. El **Frontend** visualiza la información y permite al usuario interactuar con el sistema.
4. (TBD) El **Pose Server** procesa señales de video para complementar la información de los sensores.

## Funcionalidades Transversales

### Sistema de Atajos de Teclado
La aplicación implementa un sistema robusto de atajos de teclado para mejorar la eficiencia del usuario:

- **Atajos Globales**:
    - `⌘1-5`: Navegación rápida entre las secciones principales del sidebar.
    - `⌘,`: Apertura de Ajustes/Configuración.
    - `?`: Visualización de un overlay de ayuda con todos los comandos.
- **Atajos Específicos de Página**:
    - `⌘↩`: Iniciar/Finalizar sesión (en la vista de monitoreo).
    - `⌘⇧E`: Exportar datos de la sesión actual.
- **Interfaz**: Se han añadido "badges" indicadores en los elementos de navegación del sidebar que se revelan al pasar el mouse (hover), educando al usuario sobre los atajos disponibles.

## Decisiones Técnicas Recientes

- **BLE Handshake**: Implementación de un protocolo de apretón de manos dinámico para el descubrimiento de múltiples sensores BNO055.
- **Manejo de Errores BLE**: Uso de `spawn_blocking` y `catch_unwind` en Rust para evitar cierres del sistema por fallos en el driver de Bluetooth de macOS.
- **Firma de Binarios**: Re-firma ad-hoc necesaria en macOS para habilitar permisos de Bluetooth y Cámara en modo desarrollo.
- **Linker Wrapper y Exec Shim**: Implementación de un wrapper para el linker que genera un bundle `.app` automáticamente y un shim de ejecución para evitar crashes de TCC en macOS 26 Tahoe.
