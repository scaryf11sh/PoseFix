<script lang="ts">
    import { Video, VideoOff, Camera, Activity, Eye, Ruler, Clock, Zap, AlertCircle, CheckCircle, Settings, Maximize2, Minimize2 } from '@lucide/svelte';
    import { currentPose, isStreaming, startVideoStream, stopVideoStream } from '$lib/api/store';
    import { cn } from '$lib/utils/cn';

    let videoStream: MediaStream | null = $state(null);
    let videoElement: HTMLVideoElement | null = $state(null);
    let isLocalStreaming = $state(false);
    let errorMessage = $state<string | null>(null);
    let isFullScreen = $state(false);
    let selectedCamera = $state<string>('user');
    let skeletonOverlay = $state(true);

    const cameras = [
        { id: 'user', name: 'Cámara Frontal', facingMode: 'user' },
        { id: 'environment', name: 'Cámara Trasera', facingMode: 'environment' }
    ];

    async function startCamera() {
        try {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
            }

            const cameraConfig = cameras.find(c => c.id === selectedCamera);
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: cameraConfig?.facingMode || 'user'
                }
            });

            if (videoElement) {
                videoElement.srcObject = videoStream;
            }
            isLocalStreaming = true;
            errorMessage = null;
        } catch (error) {
            errorMessage = 'No se pudo acceder a la cámara. Verifica los permisos.';
            console.error('Camera error:', error);
        }
    }

    function stopCamera() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
            videoStream = null;
            isLocalStreaming = false;
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            videoElement?.requestFullscreen();
            isFullScreen = true;
        } else {
            document.exitFullscreen();
            isFullScreen = false;
        }
    }

    $effect(() => {
        return () => stopCamera();
    });

    // Pose data simulada para visualización
    let posePoints = $state([
        { x: 50, y: 15, label: 'head' },
        { x: 50, y: 25, label: 'neck' },
        { x: 35, y: 35, label: 'l-shoulder' },
        { x: 65, y: 35, label: 'r-shoulder' },
        { x: 30, y: 50, label: 'l-elbow' },
        { x: 70, y: 50, label: 'r-elbow' },
        { x: 25, y: 65, label: 'l-wrist' },
        { x: 75, y: 65, label: 'r-wrist' },
        { x: 50, y: 45, label: 'spine' },
        { x: 40, y: 60, label: 'l-hip' },
        { x: 60, y: 60, label: 'r-hip' }
    ]);
</script>

<div class="h-full w-full p-6 overflow-auto">
    <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
                    Cámara en Vivo
                </h1>
                <p class="text-electric-green-600 dark:text-frozen-water-400">
                    Visualiza el tracking de postura con skeleton overlay en tiempo real
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button
                    onclick={toggleFullScreen}
                    class="p-3 rounded-xl bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-700 dark:text-powder-blue-300 hover:bg-electric-green-600 hover:text-twilight-indigo-50 transition"
                >
                    {isFullScreen ? Minimize2 : Maximize2}
                </button>
                <button
                    onclick={() => skeletonOverlay = !skeletonOverlay}
                    class={cn(
                        'p-3 rounded-xl transition',
                        skeletonOverlay
                            ? 'bg-electric-green-600 text-twilight-indigo-50'
                            : 'bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-700 dark:text-pictures-blue-300 hover:bg-electric-green-600 hover:text-twilight-indigo-50'
                    )}
                >
                    <Activity class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- Camera Controls -->
        <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 bg-alabaster-100 dark:bg-twilight-indigo-900 rounded-xl p-1">
                {#each cameras as cam}
                    <button
                        onclick={() => { selectedCamera = cam.id; if (isLocalStreaming) { stopCamera(); startCamera(); }}}
                        class={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition',
                            selectedCamera === cam.id
                                ? 'bg-electric-green-600 text-twilight-indigo-50'
                                : 'text-carbon-600 dark:text-pictures-blue-400 hover:bg-electric-green-600/20'
                        )}
                    >
                        {cam.name}
                    </button>
                {/each}
            </div>

            {#if isLocalStreaming}
                <button
                    onclick={stopCamera}
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-ribbon-600 text-powder-blue-100 font-medium hover:bg-red-ribbon-500 transition shadow-lg shadow-red-ribbon-600/20"
                >
                    <VideoOff class="w-4 h-4" />
                    Detener cámara
                </button>
            {:else}
                <button
                    onclick={startCamera}
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-green-600 text-twilight-indigo-50 font-medium hover:bg-electric-green-500 transition shadow-lg shadow-electric-green-600/20"
                >
                    <Video class="w-4 h-4" />
                    Iniciar cámara
                </button>
            {/if}
        </div>

        <!-- Main Video Display -->
        <div class={cn(
            'rounded-3xl overflow-hidden shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-200 dark:border-twilight-indigo-800',
            isFullScreen ? '' : 'bg-carbon-950'
        )}>
            <div class="relative aspect-video bg-carbon-950">
                {#if isLocalStreaming}
                    <video
                        bind:this={videoElement}
                        autoplay
                        playsinline
                        class="w-full h-full object-cover"
                    />
                    {#if skeletonOverlay}
                        <!-- Skeleton Overlay -->
                        <div class="absolute inset-0 pointer-events-none">
                            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <!-- Head to Neck -->
                                <line x1="{posePoints[0].x}" y1="{posePoints[0].y}" x2="{posePoints[1].x}" y2="{posePoints[1].y}" stroke="#8FECAB" stroke-width="0.8" opacity="0.8"/>
                                <circle cx="{posePoints[0].x}" cy="{posePoints[0].y}" r="2" fill="#8FECAB" opacity="0.9"/>

                                <!-- Neck to Shoulders -->
                                <line x1="{posePoints[1].x}" y1="{posePoints[1].y}" x2="{posePoints[2].x}" y2="{posePoints[2].y}" stroke="#8FECAB" stroke-width="0.6" opacity="0.7"/>
                                <line x1="{posePoints[1].x}" y1="{posePoints[1].y}" x2="{posePoints[3].x}" y2="{posePoints[3].y}" stroke="#8FECAB" stroke-width="0.6" opacity="0.7"/>
                                <circle cx="{posePoints[1].x}" cy="{posePoints[1].y}" r="1.5" fill="#8FECAB" opacity="0.8"/>

                                <!-- Shoulders -->
                                <line x1="{posePoints[2].x}" y1="{posePoints[2].y}" x2="{posePoints[3].x}" y2="{posePoints[3].y}" stroke="#8FECAB" stroke-width="0.6" opacity="0.5"/>
                                <circle cx="{posePoints[2].x}" cy="{posePoints[2].y}" r="1.5" fill="#8FECAB" opacity="0.7"/>
                                <circle cx="{posePoints[3].x}" cy="{posePoints[3].y}" r="1.5" fill="#8FECAB" opacity="0.7"/>

                                <!-- Arms -->
                                <line x1="{posePoints[2].x}" y1="{posePoints[2].y}" x2="{posePoints[4].x}" y2="{posePoints[4].y}" stroke="#8FECAB" stroke-width="0.5" opacity="0.6"/>
                                <line x1="{posePoints[3].x}" y1="{posePoints[3].y}" x2="{posePoints[5].x}" y2="{posePoints[5].y}" stroke="#8FECAB" stroke-width="0.5" opacity="0.6"/>
                                <line x1="{posePoints[4].x}" y1="{posePoints[4].y}" x2="{posePoints[6].x}" y2="{posePoints[6].y}" stroke="#8FECAB" stroke-width="0.4" opacity="0.5"/>
                                <line x1="{posePoints[5].x}" y1="{posePoints[5].y}" x2="{posePoints[7].x}" y2="{posePoints[7].y}" stroke="#8FECAB" stroke-width="0.4" opacity="0.5"/>

                                <!-- Spine -->
                                <line x1="{posePoints[1].x}" y1="{posePoints[1].y}" x2="{posePoints[8].x}" y2="{posePoints[8].y}" stroke="#8FECAB" stroke-width="0.7" opacity="0.6"/>
                                <circle cx="{posePoints[8].x}" cy="{posePoints[8].y}" r="1.5" fill="#8FECAB" opacity="0.7"/>

                                <!-- Hips -->
                                <line x1="{posePoints[8].x}" y1="{posePoints[8].y}" x2="{posePoints[9].x}" y2="{posePoints[9].y}" stroke="#8FECAB" stroke-width="0.5" opacity="0.5"/>
                                <line x1="{posePoints[8].x}" y1="{posePoints[8].y}" x2="{posePoints[10].x}" y2="{posePoints[10].y}" stroke="#8FECAB" stroke-width="0.5" opacity="0.5"/>
                                <line x1="{posePoints[9].x}" y1="{posePoints[9].y}" x2="{posePoints[10].x}" y2="{posePoints[10].y}" stroke="#8FECAB" stroke-width="0.5" opacity="0.4"/>

                                <!-- Joint labels -->
                                <text x="{posePoints[0].x}" y="{posePoints[0].y - 3}" font-size="2" fill="#8FECAB" text-anchor="middle">Head</text>
                            </svg>
                        </div>
                    {/if}

                    <!-- Live Badge -->
                    <div class="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-ribbon-600/90 text-powder-blue-100 text-xs font-medium animate-pulse">
                        <div class="w-2 h-2 rounded-full bg-powder-blue-100"></div>
                        EN VIVO
                    </div>
                {:else}
                    <div class="w-full h-full flex flex-col items-center justify-center text-powder-blue-100/50">
                        <div class="p-6 rounded-full bg-carbon-800/50 mb-4">
                            <Camera class="w-20 h-20" />
                        </div>
                        <p class="text-lg font-medium">Cámara desactivada</p>
                        <p class="text-sm mt-1">Inicia la cámara para ver el tracking</p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Error Message -->
        {#if errorMessage}
            <div class="p-4 rounded-xl bg-red-ribbon-600/20 border border-red-ribbon-500 text-red-ribbon-400 flex items-center gap-3">
                <AlertCircle class="w-5 h-5" />
                <span>{errorMessage}</span>
            </div>
        {/if}

        <!-- Real-time Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="rounded-2xl bg-gradient-to-br from-electric-green-50 to-electric-green-100 dark:from-electric-green-900/30 dark:to-electric-green-900/50 p-5 shadow-xl border border-electric-green-200 dark:border-electric-green-800">
                <div class="flex items-center gap-3 mb-2">
                    <Eye class="w-5 h-5 text-electric-green-600" />
                    <span class="text-sm text-carbon-600 dark:text-pictures-blue-400">Estado</span>
                </div>
                <p class="text-2xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                    {isLocalStreaming ? 'Activo' : 'Inactivo'}
                </p>
                {#if currentPose}
                    <div class="flex items-center gap-1 mt-2 text-xs text-electric-green-600">
                        <CheckCircle class="w-3 h-3" />
                        <span>{currentPose.status}</span>
                    </div>
                {/if}
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-twilight-indigo-50 to-twilight-indigo-100 dark:from-rich-cerulean-900 dark:to-twilight-indigo-900 p-5 shadow-xl border border-twilight-indigo-200 dark:border-twilight-indigo-800">
                <div class="flex items-center gap-3 mb-2">
                    <Ruler class="w-5 h-5 text-frozen-water-600" />
                    <span class="text-sm text-carbon-600 dark:text-pictures-blue-400">Cuello</span>
                </div>
                <p class="text-2xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                    {currentPose?.neckAngle ?? '--'}°
                </p>
                <div class="mt-2 text-xs text-carbon-500 dark:text-pictures-blue-400">
                    {#if typeof currentPose?.neckAngle === 'number'}
                        {#if currentPose.neckAngle < 15}
                            <span class="text-electric-green-600">Óptimo</span>
                        {:else}
                            <span class="text-Tuscan-600">Revisar postura</span>
                        {/if}
                    {:else}
                        --
                    {/if}
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-Tuscan-50 to-Tuscan-100 dark:from-Tuscan-900/30 dark:to-Tuscan-900/50 p-5 shadow-xl border border-Tuscan-200 dark:border-Tuscan-800">
                <div class="flex items-center gap-3 mb-2">
                    <Activity class="w-5 h-5 text-Tuscan-600" />
                    <span class="text-sm text-carbon-600 dark:text-pictures-blue-400">Espalda</span>
                </div>
                <p class="text-2xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                    {currentPose?.backAngle ?? '--'}°
                </p>
                <div class="mt-2 text-xs text-carbon-500 dark:text-pictures-blue-400">
                    {#if typeof currentPose?.backAngle === 'number'}
                        {#if currentPose.backAngle < 10}
                            <span class="text-electric-green-600">Óptimo</span>
                        {:else}
                            <span class="text-Tuscan-600">Revisar postura</span>
                        {/if}
                    {:else}
                        --
                    {/if}
                </div>
            </div>

            <div class="rounded-2xl bg-gradient-to-br from-frozen-water-50 to-frozen-water-100 dark:from-frozen-water-900/30 dark:to-frozen-water-900/50 p-5 shadow-xl border border-frozen-water-200 dark:border-frozen-water-800">
                <div class="flex items-center gap-3 mb-2">
                    <Clock class="w-5 h-5 text-frozen-water-600" />
                    <span class="text-sm text-carbon-600 dark:text-pictures-blue-400">Tiempo</span>
                </div>
                <p class="text-2xl font-medium text-graphite-900 dark:text-pictures-blue-100">
                    {isLocalStreaming ? '00:00' : '--'}
                </p>
                <div class="mt-2 text-xs text-carbon-500 dark:text-pictures-blue-400">
                    {isLocalStreaming ? 'En sesión' : 'Sin sesión'}
                </div>
            </div>
        </div>

        <!-- Posture Tips -->
        {#if currentPose && (currentPose.neckAngle > 20 || currentPose.backAngle > 15)}
            <div class="rounded-2xl bg-Tuscan-50 dark:bg-Tuscan-900/30 p-6 border border-Tuscan-200 dark:border-Tuscan-800">
                <div class="flex items-start gap-3">
                    <AlertCircle class="w-6 h-6 text-Tuscan-600 mt-0.5" />
                    <div>
                        <h3 class="font-medium text-Tuscan-800 dark:text-Tuscan-300 mb-2">
                            Recomendación de postura
                        </h3>
                        <p class="text-sm text-Tuscan-700 dark:text-Tuscan-400">
                            {#if currentPose.neckAngle > 20}
                                Tu cuello está inclinado {currentPose.neckAngle.toFixed(1)}°. Intenta mantener la cabeza alineada con la columna. Reduce la inclinación para evitar tensión cervical.
                            {:else if currentPose.backAngle > 15}
                                Tu espalda está inclinada {currentPose.backAngle.toFixed(1)}°. Siéntate con la espalda recta y los hombros relajados.
                            {/if}
                        </p>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
