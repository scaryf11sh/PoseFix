<script lang="ts">
    import { LayoutDashboard, Video, Cpu, Activity, Thermometer, Gyroscope, Waves, Zap, Signal, Server, Camera, HardDrive, Clock, TrendingUp, AlertCircle, CheckCircle } from '@lucide/svelte';
    import { currentPose, isStreaming, sessions, weeklyScore, sessionError } from '$lib/api/store';
    import { cn } from '$lib/utils/cn';

    type CameraInfo = {
        id: string;
        name: string;
        status: 'active' | 'inactive' | 'error';
        resolution: string;
        fps: number;
        selected: boolean;
    };

    type ESP32Info = {
        deviceId: string;
        name: string;
        status: 'connected' | 'disconnected' | 'syncing';
        batteryLevel: number;
        wifiStrength: number;
        uptime: string;
        firmwareVersion: string;
    };

    type BNO055Data = {
        orientation: { w: number; x: number; y: number; z: number };
        euler: { heading: number; roll: number; pitch: number };
        acceleration: { x: number; y: number; z: number };
        gyroscope: { x: number; y: number; z: number };
        temperature: number;
        calibrationStatus: number;
    };

    // Estado reactivo
    let cameras = $state<CameraInfo[]>([
        { id: 'cam-1', name: 'Cámara Frontal', status: 'active', resolution: '1920x1080', fps: 30, selected: true },
        { id: 'cam-2', name: 'Cámara Lateral', status: 'inactive', resolution: '1280x720', fps: 60, selected: false },
        { id: 'cam-3', name: 'Cámara Profundidad', status: 'active', resolution: '848x480', fps: 90, selected: true }
    ]);

    let esp32 = $state<ESP32Info>({
        deviceId: 'ESP32-S3-001',
        name: 'PoseFix Sensor Hub',
        status: 'connected',
        batteryLevel: 87,
        wifiStrength: 92,
        uptime: '4h 23m',
        firmwareVersion: 'v2.4.1'
    });

    let bno055 = $state<BNO055Data>({
        orientation: { w: 0.92, x: 0.15, y: -0.23, z: 0.31 },
        euler: { heading: 45.2, roll: 12.5, pitch: -8.3 },
        acceleration: { x: 0.12, y: 9.81, z: 0.05 },
        gyroscope: { x: 0.02, y: -0.15, z: 0.08 },
        temperature: 32.5,
        calibrationStatus: 3
    });

    // Simular actualización de datos del sensor en tiempo real
    let lastUpdate = $state(new Date());

    $effect(() => {
        const interval = setInterval(() => {
            // Simular pequeñas variaciones en los datos del sensor
            bno055 = {
                ...bno055,
                euler: {
                    heading: bno055.euler.heading + (Math.random() - 0.5) * 0.5,
                    roll: bno055.euler.roll + (Math.random() - 0.5) * 0.3,
                    pitch: bno055.euler.pitch + (Math.random() - 0.5) * 0.3
                },
                acceleration: {
                    x: bno055.acceleration.x + (Math.random() - 0.5) * 0.01,
                    y: 9.81 + (Math.random() - 0.5) * 0.02,
                    z: bno055.acceleration.z + (Math.random() - 0.5) * 0.01
                },
                temperature: Math.max(30, Math.min(40, bno055.temperature + (Math.random() - 0.5) * 0.1))
            };
            lastUpdate = new Date();
        }, 100);

        return () => clearInterval(interval);
    });

    function toggleCamera(id: string) {
        cameras = cameras.map(cam =>
            cam.id === id ? { ...cam, selected: !cam.selected } : cam
        );
    }

    function getCalibrationLabel(status: number): string {
        const labels = ['No calibrado', 'Calibrando', 'Parcial', 'Completo'];
        return labels[status] || 'Desconocido';
    }

    function getCalibrationColor(status: number): string {
        const colors = ['bg-red-ribbon-500', 'bg-Tuscan-400', 'bg-electric-green-400', 'bg-electric-green-600'];
        return colors[status] || 'bg-carbon-400';
    }
</script>

<div class="h-full w-full p-6 overflow-auto">
    <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-2">
            <div>
                <h1 class="text-4xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
                    Dashboard
                </h1>
                <p class="text-electric-green-600 dark:text-frozen-water-400">
                    Monitor de postura y sensores en tiempo real
                </p>
            </div>
            <div class="flex items-center gap-3">
                <span class={cn(
                    'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2',
                    isStreaming ? 'bg-electric-green-600 text-twilight-indigo-50' : 'bg-carbon-400 text-powder-blue-100'
                )}>
                    <Activity class="w-4 h-4" />
                    {isStreaming ? 'Tracking Activo' : 'Tracking Inactivo'}
                </span>
            </div>
        </div>

        <!-- Error Banner -->
        {#if sessionError}
            <div class="p-4 rounded-xl bg-red-ribbon-600/20 border border-red-ribbon-500 text-red-ribbon-400 flex items-center gap-3">
                <AlertCircle class="w-5 h-5" />
                <span>{sessionError}</span>
            </div>
        {/if}

        <!-- Stats Row - Quick Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="rounded-2xl bg-gradient-to-br from-twilight-indigo-50 to-twilight-indigo-100 dark:from-rich-cerulean-900 dark:to-twilight-indigo-900 p-5 shadow-xl shadow-port-gore-100 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800">
                <div class="flex items-center gap-3 mb-2">
                    <LayoutDashboard class="w-5 h-5 text-electric-green-600" />
                    <span class="text-sm text-carbon-600 dark:text-powder-blue-400">Sesiones totales</span>
                </div>
                <p class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100">15</p>
                <div class="flex items-center gap-1 mt-2 text-xs text-electric-green-600">
                    <TrendingUp class="w-3 h-3" />
                    <span>+3 esta semana</span>
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-electric-green-50 to-electric-green-100 dark:from-electric-green-900/30 dark:to-electric-green-900/50 p-5 shadow-xl shadow-port-gore-100 dark:shadow-port-gore-400 border border-electric-green-200 dark:border-electric-green-800">
                <div class="flex items-center gap-3 mb-2">
                    <CheckCircle class="w-5 h-5 text-electric-green-600" />
                    <span class="text-sm text-carbon-600 dark:text-powder-blue-400">Postura actual</span>
                </div>
                <p class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100">
                    {currentPose?.status ?? 'inactive'}
                </p>
                <div class="flex items-center gap-1 mt-2 text-xs text-electric-green-600">
                    <span>{currentPose?.neckAngle ?? 0}° cuello</span>
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-Tuscan-50 to-Tuscan-100 dark:from-Tuscan-900/30 dark:to-Tuscan-900/50 p-5 shadow-xl shadow-port-gore-100 dark:shadow-port-gore-400 border border-Tuscan-200 dark:border-Tuscan-800">
                <div class="flex items-center gap-3 mb-2">
                    <Clock class="w-5 h-5 text-Tuscan-600" />
                    <span class="text-sm text-carbon-600 dark:text-pictures-blue-400">Tiempo sesión</span>
                </div>
                <p class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100">2h 30m</p>
                <div class="flex items-center gap-1 mt-2 text-xs text-Tuscan-600">
                    <span>desde 09:00</span>
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-frozen-water-50 to-frozen-water-100 dark:from-frozen-water-900/30 dark:to-frozen-water-900/50 p-5 shadow-xl shadow-port-gore-100 dark:shadow-port-gore-400 border border-frozen-water-200 dark:border-frozen-water-800">
                <div class="flex items-center gap-3 mb-2">
                    <Signal class="w-5 h-5 text-frozen-water-600" />
                    <span class="text-sm text-carbon-600 dark:text-powder-blue-400">Score semanal</span>
                </div>
                <p class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100">{weeklyScore.average || 82}</p>
                <div class="flex items-center gap-1 mt-2 text-xs text-frozen-water-600">
                    <TrendingUp class="w-3 h-3" />
                    <span>{weeklyScore.trend || 5}% mejora</span>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Cámaras Section -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-electric-green-600/20">
                            <Camera class="w-5 h-5 text-electric-green-600" />
                        </div>
                        <div>
                            <h2 class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">
                                Cámaras
                            </h2>
                            <p class="text-xs text-carbon-500 dark:text-powder-blue-400">
                                Dispositivos de captura seleccionados
                            </p>
                        </div>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs bg-electric-green-600 text-twilight-indigo-50 font-medium">
                        {cameras.filter(c => c.selected).length} activas
                    </span>
                </div>

                <div class="space-y-3">
                    {#each cameras as camera}
                        <div class={cn(
                            'rounded-xl p-4 border transition-all cursor-pointer',
                            camera.selected
                                ? 'bg-electric-green-50 dark:bg-electric-green-900/20 border-electric-green-400'
                                : 'bg-alabaster-100 dark:bg-twilight-indigo-800 border-carbon-200 dark:border-twilight-indigo-700 hover:border-electric-green-300'
                        )}
                        onclick={() => toggleCamera(camera.id)}>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class={cn(
                                        'w-3 h-3 rounded-full',
                                        camera.status === 'active' ? 'bg-electric-green-500' :
                                        camera.status === 'error' ? 'bg-red-ribbon-500' : 'bg-carbon-400'
                                    )}></div>
                                    <div>
                                        <p class="font-medium text-graphite-900 dark:text-powder-blue-100">
                                            {camera.name}
                                        </p>
                                        <p class="text-xs text-carbon-500 dark:text-powder-blue-400">
                                            {camera.resolution} @ {camera.fps}fps
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    {#if camera.selected}
                                        <CheckCircle class="w-5 h-5 text-electric-green-600" />
                                    {/if}
                                    <div class={cn(
                                        'w-10 h-6 rounded-full transition-colors',
                                        camera.selected ? 'bg-electric-green-600' : 'bg-carbon-400'
                                    )} style="position: relative;">
                                        <div class={cn(
                                            'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                                            camera.selected ? 'left-5' : 'left-1'
                                        )}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Active Cameras Info -->
                <div class="mt-4 p-3 rounded-lg bg-carbon-100 dark:bg-twilight-indigo-900/50 border border-carbon-200 dark:border-twilight-indigo-700">
                    <div class="flex items-start gap-2">
                        <Signal class="w-4 h-4 text-frozen-water-400 mt-0.5" />
                        <div>
                            <p class="text-xs font-medium text-carbon-700 dark:text-powder-blue-300 mb-1">
                                Cámaras en uso:
                            </p>
                            <p class="text-xs text-carbon-600 dark:text-powder-blue-400">
                                {cameras.filter(c => c.selected).map(c => c.name).join(', ') || 'Ninguna'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ESP32-S3 Section -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg bg-frozen-water-600/20">
                            <Cpu class="w-5 h-5 text-frozen-water-600" />
                        </div>
                        <div>
                            <h2 class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">
                                ESP32-S3
                            </h2>
                            <p class="text-xs text-carbon-500 dark:text-pictures-blue-400">
                                {esp32.deviceId}
                            </p>
                        </div>
                    </div>
                    <span class={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        esp32.status === 'connected' ? 'bg-electric-green-600 text-twilight-indigo-50' :
                        esp32.status === 'syncing' ? 'bg-Tuscan-400 text-twilight-indigo-50' : 'bg-red-ribbon-600 text-powder-blue-100'
                    )}>
                        {esp32.status === 'connected' ? 'Conectado' : esp32.status === 'syncing' ? 'Sincronizando' : 'Desconectado'}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-800 p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <Zap class="w-4 h-4 text-Tuscan-500" />
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Batería</span>
                        </div>
                        <p class="text-lg font-medium text-graphite-900 dark:text-pictures-blue-100">{esp32.batteryLevel}%</p>
                        <div class="w-full bg-carbon-300 dark:bg-twilight-indigo-700 rounded-full h-1.5 mt-2">
                            <div class="bg-Tuscan-500 h-1.5 rounded-full" style="width: {esp32.batteryLevel}%"></div>
                        </div>
                    </div>

                    <div class="rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-800 p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <Signal class="w-4 h-4 text-electric-green-500" />
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">WiFi</span>
                        </div>
                        <p class="text-lg font-medium text-graphite-900 dark:text-pictures-blue-100">{esp32.wifiStrength}%</p>
                        <div class="w-full bg-carbon-300 dark:bg-twilight-indigo-700 rounded-full h-1.5 mt-2">
                            <div class="bg-electric-green-500 h-1.5 rounded-full" style="width: {esp32.wifiStrength}%"></div>
                        </div>
                    </div>

                    <div class="rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-800 p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <Clock class="w-4 h-4 text-frozen-water-500" />
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Uptime</span>
                        </div>
                        <p class="text-lg font-medium text-graphite-900 dark:text-pictures-blue-100">{esp32.uptime}</p>
                    </div>

                    <div class="rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-800 p-3">
                        <div class="flex items-center gap-2 mb-1">
                            <Server class="w-4 h-4 text-port-gore-400" />
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Firmware</span>
                        </div>
                        <p class="text-lg font-medium text-graphite-900 dark:text-pictures-blue-100">{esp32.firmwareVersion}</p>
                    </div>
                </div>

                <div class="p-3 rounded-lg bg-carbon-100 dark:bg-twilight-indigo-900/50 border border-carbon-200 dark:border-twilight-indigo-700">
                    <div class="flex items-start gap-2">
                        <HardDrive class="w-4 h-4 text-frozen-water-400 mt-0.5" />
                        <div>
                            <p class="text-xs font-medium text-carbon-700 dark:text-pictures-blue-300 mb-1">
                                Nombre del dispositivo:
                            </p>
                            <p class="text-xs text-carbon-600 dark:text-pictures-blue-400">
                                {esp32.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- BNO055 Sensor Section -->
        <div class="rounded-2xl bg-gradient-to-br from-twilight-indigo-50 to-twilight-indigo-100 dark:from-rich-cerulean-900 dark:to-twilight-indigo-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg bg-shamrock-600/20">
                        <Gyroscope class="w-6 h-6 text-shamrock-600" />
                    </div>
                    <div>
                        <h2 class="text-xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            Sensor BNO055
                        </h2>
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400">
                            Última actualización: {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <div class={cn(
                        'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2',
                        getCalibrationColor(bno055.calibrationStatus)
                    )}>
                        <div class="w-2 h-2 rounded-full bg-white"></div>
                        {getCalibrationLabel(bno055.calibrationStatus)}
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Orientación Euler -->
                <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Activity class="w-4 h-4 text-electric-green-500" />
                        <h3 class="text-sm font-medium text-carbon-700 dark:text-pictures-blue-300">
                            Orientación (Euler)
                        </h3>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Heading</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.euler.heading.toFixed(1)}°
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Roll</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.euler.roll.toFixed(1)}°
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Pitch</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.euler.pitch.toFixed(1)}°
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Aceleración -->
                <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Waves class="w-4 h-4 text-frozen-water-500" />
                        <h3 class="text-sm font-medium text-carbon-700 dark:text-pictures-blue-300">
                            Aceleración (m/s²)
                        </h3>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">X</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.acceleration.x.toFixed(2)}
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Y</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.acceleration.y.toFixed(2)}
                            </span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Z</span>
                            <span class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                                {bno055.acceleration.z.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Giroscopio + Temperatura -->
                <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <Thermometer class="w-4 h-4 text-Tuscan-500" />
                        <h3 class="text-sm font-medium text-carbon-700 dark:text-pictures-blue-300">
                            Temperatura
                        </h3>
                    </div>
                    <div class="mb-3">
                        <p class="text-2xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {bno055.temperature.toFixed(1)}°C
                        </p>
                    </div>
                    <div class="pt-3 border-t border-carbon-200 dark:border-twilight-indigo-700">
                        <div class="flex items-center gap-2 mb-2">
                            <Gyroscope class="w-3 h-3 text-port-gore-400" />
                            <span class="text-xs text-carbon-500 dark:text-pictures-blue-400">Giroscopio</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-carbon-600 dark:text-pictures-blue-400">X: {bno055.gyroscope.x.toFixed(2)}</span>
                            <span class="text-carbon-600 dark:text-pictures-blue-400">Y: {bno055.gyroscope.y.toFixed(2)}</span>
                            <span class="text-carbon-600 dark:text-pictures-blue-400">Z: {bno055.gyroscope.z.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quaternion Orientation -->
            <div class="mt-4 p-4 rounded-xl bg-carbon-100 dark:bg-twilight-indigo-900/50 border border-carbon-200 dark:border-twilight-indigo-700">
                <h3 class="text-xs font-medium text-carbon-700 dark:text-pictures-blue-300 mb-2">
                    Orientación (Quaternion)
                </h3>
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-1">W</p>
                        <p class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {bno055.orientation.w.toFixed(3)}
                        </p>
                    </div>
                    <div class="text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-1">X</p>
                        <p class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {bno055.orientation.x.toFixed(3)}
                        </p>
                    </div>
                    <div class="text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-1">Y</p>
                        <p class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {bno055.orientation.y.toFixed(3)}
                        </p>
                    </div>
                    <div class="text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-1">Z</p>
                        <p class="text-sm font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {bno055.orientation.z.toFixed(3)}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Postura en Tiempo Real -->
        <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg bg-electric-green-600/20">
                        <Activity class="w-5 h-5 text-electric-green-600" />
                    </div>
                    <div>
                        <h2 class="text-xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            Tracking de Postura
                        </h2>
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400">
                            Análisis biomecánico en tiempo real
                        </p>
                    </div>
                </div>
            </div>

            {#if currentPose}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4 text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-2">Ángulo Cuello</p>
                        <p class="text-3xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {currentPose.neckAngle.toFixed(1)}°
                        </p>
                        <div class={cn(
                            'mt-2 px-3 py-1 rounded-full text-xs inline-block',
                            currentPose.neckAngle < 15 ? 'bg-electric-green-600 text-twilight-indigo-50' :
                            currentPose.neckAngle < 30 ? 'bg-Tuscan-400 text-twilight-indigo-50' : 'bg-red-ribbon-600 text-powder-blue-100'
                        )}>
                            {currentPose.neckAngle < 15 ? 'Óptimo' : currentPose.neckAngle < 30 ? 'Moderado' : 'Crítico'}
                        </div>
                    </div>

                    <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4 text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-2">Ángulo Espalda</p>
                        <p class="text-3xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {currentPose.backAngle.toFixed(1)}°
                        </p>
                        <div class={cn(
                            'mt-2 px-3 py-1 rounded-full text-xs inline-block',
                            currentPose.backAngle < 10 ? 'bg-electric-green-600 text-twilight-indigo-50' :
                            currentPose.backAngle < 25 ? 'bg-Tuscan-400 text-twilight-indigo-50' : 'bg-red-ribbon-600 text-powder-blue-100'
                        )}>
                            {currentPose.backAngle < 10 ? 'Óptimo' : currentPose.backAngle < 25 ? 'Moderado' : 'Crítico'}
                        </div>
                    </div>

                    <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-800 p-4 text-center">
                        <p class="text-xs text-carbon-500 dark:text-pictures-blue-400 mb-2">Ángulo Hombros</p>
                        <p class="text-3xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                            {currentPose.shoulderAngle.toFixed(1)}°
                        </p>
                        <div class={cn(
                            'mt-2 px-3 py-1 rounded-full text-xs inline-block',
                            currentPose.shoulderAngle < 20 ? 'bg-electric-green-600 text-twilight-indigo-50' :
                            currentPose.shoulderAngle < 40 ? 'bg-Tuscan-400 text-twilight-indigo-50' : 'bg-red-ribbon-600 text-powder-blue-100'
                        )}>
                            {currentPose.shoulderAngle < 20 ? 'Óptimo' : currentPose.shoulderAngle < 40 ? 'Moderado' : 'Crítico'}
                        </div>
                    </div>
                </div>
            {:else}
                <div class="p-8 text-center text-carbon-500 dark:text-pictures-blue-400">
                    <Activity class="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Inicia una sesión para ver el tracking de postura</p>
                </div>
            {/if}
        </div>
    </div>
</div>
