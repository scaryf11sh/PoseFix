# PoseFix 🧘‍♂️💻

**PoseFix** es una aplicación de escritorio de salud ocupacional diseñada para monitorear la postura y la fatiga visual en tiempo real. Utiliza un enfoque híbrido de **Edge Computing** (sensores inerciales) y **Visión Computacional** para proporcionar alertas proactivas, todo bajo un entorno estrictamente local y privado.

## 🚀 Características Principales

* **Monitoreo Biométrico Dual:**
    * **Wearable (C++/ESP32):** Sensores BNO055 que miden ángulos cervicales y torácicos con precisión clínica.
    * **Visión (Rust/YOLO):** Detección de fatiga visual, irritación ocular y landmarks posturales mediante la cámara web.
* **Privacidad por Diseño (100% Offline):** Sin procesamiento en la nube. Todo el análisis de IA y almacenamiento de datos ocurre localmente.
* **Cerebro de Inferencia Eficiente:** El procesamiento pesado de los ángulos se realiza en el ESP32-S3 (TinyML), liberando recursos de la computadora.
* **Goniometría Integrada:** Reglas basadas en estándares clínicos (Norkin & White) para determinar posturas óptimas, de advertencia y críticas.
* **Agente de Recomendaciones:** Un motor lógico que analiza tu historial en SQLite para sugerir ejercicios y pausas activas personalizadas.
* **Seguridad BLE:** Comunicación entre el wearable y la app protegida mediante un "Apretón de manos secreto" y cifrado de carga útil AES.

## 🛠️ Stack Tecnológico

### Frontend
* **Svelte 5:** Utilizando la nueva sintaxis de **Runes** para una reactividad ultra eficiente.
* **Tailwind CSS v4:** Para una interfaz moderna, minimalista y de alto rendimiento.
* **Lucide Svelte:** Set de iconos consistente.

### Backend (El Cerebro)
* **Tauri v2:** Orquestador multiplataforma nativo.
* **Rust:** Motor de alto rendimiento para el manejo de WebSockets, procesamiento de ONNX (YOLO) y comunicación BLE.
* **SQLite:** Persistencia local de sesiones y alertas.

### Hardware & Firmware
* **ESP32-S3 Sense (Seed Studio XIAO):** Microcontrolador principal.
* **BNO055:** Sensor de orientación absoluta de 9 ejes.
* **C++/Arduino:** Firmware optimizado para bajo consumo y baja latencia.

## 📐 Arquitectura de Datos

El sistema centraliza toda la información en un esquema relacional optimizado, permitiendo exportaciones en formato JSON que siguen la estructura `Sesion-Information-Estructure.json`:

* **Sesiones:** Registro de horas de inicio, fin y duración.
* **Advertencias:** Desglose por tipo (Postura vs. Ojos), severidad y tiempo de resolución.
* **Resúmenes:** Puntuaciones calculadas (`posture_score`) y métricas de fatiga.

## 📦 Instalación y Desarrollo

### Requisitos previos
* Rust (última versión estable)
* Node.js & PNPM
* PlatformIO (para el firmware del ESP32)

### Configuración del App
```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm tauri dev
```

### Configuración del Sensor
1. Abrir la carpeta `PoseFixSensor` en VS Code con PlatformIO.
2. Cargar el firmware al ESP32-S3.
3. El dispositivo iniciará el modo "Advertising" BLE automáticamente.

## 🔒 Seguridad
La comunicación Bluetooth utiliza un sistema de **Cifrado a Nivel de Aplicación**. El ESP32 no transmitirá datos reales hasta que la App de PoseFix realice el protocolo de autenticación inicial, asegurando que tus datos biométricos no sean interceptados por terceros.
