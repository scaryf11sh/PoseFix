<script lang="ts">
    import { FileDown } from '@lucide/svelte';
    import { cn } from '$lib/utils/cn';

    type DataFormat = 'csv' | 'json' | 'pdf';
    let selectedFormat = $state<DataFormat>('csv');
    let dateRange = $state({ start: '', end: '' });
    let isExporting = $state(false);

    function exportData() {
        isExporting = true;

        // Simulación de exportación
        setTimeout(() => {
            const mockData = {
                sessions: [
                    { date: '2026-03-15', duration: '2h 30m', avgScore: 78 },
                    { date: '2026-03-16', duration: '3h 15m', avgScore: 82 },
                    { date: '2026-03-17', duration: '1h 45m', avgScore: 85 }
                ],
                weeklyAverage: 82,
                totalSessions: 15
            };

            const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `posefix-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            isExporting = false;
        }, 1000);
    }
</script>

<div class="h-full w-full p-8">
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">
            Exportar Datos
        </h1>
        <p class="text-electric-green-600 dark:text-frozen-water-400 mb-6">
            Descarga tu historial de sesiones y métricas de postura
        </p>

        <div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950">
            <!-- Formato de archivo -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-carbon-700 dark:text-powder-blue-300 mb-3">
                    Formato de archivo
                </label>
                <div class="flex gap-3">
                    {#each ['csv', 'json', 'pdf'] as format}
                        <button
                            onclick={() => selectedFormat = format as DataFormat}
                            class={cn(
                                'px-4 py-2 rounded-lg border font-medium transition',
                                selectedFormat === format
                                    ? 'bg-electric-green-600 text-twilight-indigo-50 border-electric-green-600'
                                    : 'bg-alabaster-100 dark:bg-twilight-indigo-900 text-carbon-700 dark:text-powder-blue-300 border-carbon-300 dark:border-twilight-indigo-700 hover:border-electric-green-400'
                            )}
                        >
                            {format.toUpperCase()}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Rango de fechas -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-carbon-700 dark:text-powder-blue-300 mb-3">
                    Rango de fechas
                </label>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs text-carbon-500 dark:text-powder-blue-400 mb-1">Desde</label>
                        <input
                            type="date"
                            bind:value={dateRange.start}
                            class="w-full px-3 py-2 rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-900 border border-carbon-300 dark:border-twilight-indigo-700 text-carbon-900 dark:text-powder-blue-100"
                        />
                    </div>
                    <div>
                        <label class="block text-xs text-carbon-500 dark:text-powder-blue-400 mb-1">Hasta</label>
                        <input
                            type="date"
                            bind:value={dateRange.end}
                            class="w-full px-3 py-2 rounded-lg bg-alabaster-100 dark:bg-twilight-indigo-900 border border-carbon-300 dark:border-twilight-indigo-700 text-carbon-900 dark:text-powder-blue-100"
                        />
                    </div>
                </div>
            </div>

            <!-- Resumen de datos -->
            <div class="mb-6 p-4 rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900">
                <h3 class="text-sm font-medium text-carbon-700 dark:text-powder-blue-300 mb-3">
                    Datos a exportar
                </h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-carbon-600 dark:text-powder-blue-400">Sesiones totales</span>
                        <span class="text-graphite-900 dark:text-powder-blue-100">15</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-carbon-600 dark:text-powder-blue-400">Primera sesión</span>
                        <span class="text-graphite-900 dark:text-powder-blue-100">2026-03-01</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-carbon-600 dark:text-powder-blue-400">Última sesión</span>
                        <span class="text-graphite-900 dark:text-powder-blue-100">2026-03-17</span>
                    </div>
                </div>
            </div>

            <!-- Botón exportar -->
            <button
                onclick={exportData}
                disabled={isExporting}
                class="w-full py-3 rounded-xl bg-electric-green-600 text-twilight-indigo-50 font-medium hover:bg-electric-green-500 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <FileDown class="w-5 h-5" />
                {isExporting ? 'Exportando...' : 'Exportar datos'}
            </button>
        </div>
    </div>
</div>
