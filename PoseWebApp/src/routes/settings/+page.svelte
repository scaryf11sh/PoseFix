<script lang="ts">
    import { Settings2, Bell, Eye, Clock, User } from '@lucide/svelte';
    import { cn } from '$lib/utils/cn';

    let darkMode = $state(false);
    let notificationsEnabled = $state(true);
    let breakInterval = $state(30); // minutos
    let eyeStrainThreshold = $state(60); // minutos
    let userName = $state('Jaime');

    function toggleDarkMode() {
        darkMode = !darkMode;
        document.documentElement.classList.toggle('dark');
    }
</script>

<div class="h-full w-full p-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
            Configuración
        </h1>
        <p class="text-electric-green-600 dark:text-frozen-water-400 mb-6">
            Personaliza tu experiencia de tracking de postura
        </p>

        <div class="space-y-4">
            <!-- Apariencia -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center gap-3 mb-4">
                    <Eye class="w-5 h-5 text-electric-green-600" />
                    <h2 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                        Apariencia
                    </h2>
                </div>
                <div class="flex items-center justify-between py-3">
                    <div>
                        <p class="text-carbon-700 dark:text-powder-blue-300">Modo oscuro</p>
                        <p class="text-xs text-carbon-500 dark:text-powder-blue-400">
                            Cambiar tema de la interfaz
                        </p>
                    </div>
                    <button
                        onclick={toggleDarkMode}
                        class={cn(
                            'relative w-14 h-7 rounded-full transition',
                            darkMode ? 'bg-electric-green-600' : 'bg-carbon-400'
                        )}
                    >
                        <div class={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                            darkMode ? 'left-8' : 'left-1'
                        )}></div>
                    </button>
                </div>
            </div>

            <!-- Notificaciones -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center gap-3 mb-4">
                    <Bell class="w-5 h-5 text-electric-green-600" />
                    <h2 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                        Notificaciones
                    </h2>
                </div>
                <div class="flex items-center justify-between py-3">
                    <div>
                        <p class="text-carbon-700 dark:text-powder-blue-300">Alertas de descanso</p>
                        <p class="text-xs text-carbon-500 dark:text-picture-blue-400">
                            Recordarte cuando es hora de tomar un descanso
                        </p>
                    </div>
                    <button
                        onclick={() => notificationsEnabled = !notificationsEnabled}
                        class={cn(
                            'relative w-14 h-7 rounded-full transition',
                            notificationsEnabled ? 'bg-electric-green-600' : 'bg-carbon-400'
                        )}
                    >
                        <div class={cn(
                            'absolute top-1 w-5 h-5 rounded-full bg-white transition-transform',
                            notificationsEnabled ? 'left-8' : 'left-1'
                        )}></div>
                    </button>
                </div>
            </div>

            <!-- Descansos -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center gap-3 mb-4">
                    <Clock class="w-5 h-5 text-electric-green-600" />
                    <h2 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                        Descansos
                    </h2>
                </div>
                <div class="py-3">
                    <label class="block text-carbon-700 dark:text-powder-blue-300 mb-2">
                        Intervalo de descanso: {breakInterval} minutos
                    </label>
                    <input
                        type="range"
                        min="15"
                        max="120"
                        step="15"
                        bind:value={breakInterval}
                        class="w-full h-2 bg-carbon-300 dark:bg-twilight-indigo-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div class="flex justify-between mt-1 text-xs text-carbon-500 dark:text-powder-blue-400">
                        <span>15 min</span>
                        <span>120 min</span>
                    </div>
                </div>
            </div>

            <!-- Fatiga visual -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center gap-3 mb-4">
                    <Eye class="w-5 h-5 text-electric-green-600" />
                    <h2 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                        Fatiga visual
                    </h2>
                </div>
                <div class="py-3">
                    <label class="block text-carbon-700 dark:text-powder-blue-300 mb-2">
                        Umbral de alerta: {eyeStrainThreshold} minutos
                    </label>
                    <input
                        type="range"
                        min="30"
                        max="180"
                        step="30"
                        bind:value={eyeStrainThreshold}
                        class="w-full h-2 bg-carbon-300 dark:bg-twilight-indigo-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div class="flex justify-between mt-1 text-xs text-carbon-500 dark:text-powder-blue-400">
                        <span>30 min</span>
                        <span>180 min</span>
                    </div>
                </div>
            </div>

            <!-- Perfil -->
            <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
                <div class="flex items-center gap-3 mb-4">
                    <User class="w-5 h-5 text-electric-green-600" />
                    <h2 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">
                        Perfil
                    </h2>
                </div>
                <div class="py-3">
                    <label class="block text-carbon-700 dark:text-powder-blue-300 mb-2">
                        Nombre
                    </label>
                    <input
                        type="text"
                        bind:value={userName}
                        class="w-full px-3 py-2 rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-900 border border-carbon-300 dark:border-twilight-indigo-700 text-carbon-900 dark:text-powder-blue-100"
                    />
                </div>
            </div>
        </div>
    </div>
</div>
