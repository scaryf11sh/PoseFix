<script lang="ts">
    import { page } from "$app/state";
    import { X } from "@lucide/svelte";

    interface Props {
        onclose: () => void;
    }
    let { onclose }: Props = $props();

    let currentPath = $derived(page.url.pathname);

    const nav = [
        { label: "Dashboard",   shortcut: "⌘1" },
        { label: "Monitor",     shortcut: "⌘2" },
        { label: "Exercises",   shortcut: "⌘3" },
        { label: "Progress",    shortcut: "⌘4" },
        { label: "Export",      shortcut: "⌘5" },
        { label: "Settings",    shortcut: "⌘," },
        { label: "Show shortcuts", shortcut: "?" },
    ];

    const PAGE_ACTIONS: Record<string, Array<{ label: string; shortcut: string }>> = {
        "/":       [{ label: "Start / Stop session", shortcut: "⌘↩" }],
        "/export": [{ label: "Generate export",      shortcut: "⌘⇧E" }],
    };

    let actions = $derived(PAGE_ACTIONS[currentPath] ?? []);
</script>

<!-- Backdrop -->
<div role="dialog" aria-modal="true" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <button
        class="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
        onclick={onclose}
        aria-label="Close shortcuts"
    ></button>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-md rounded-2xl
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
        shadow-2xl p-6">

        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
            <div>
                <h2 class="font-bold text-slate-800 dark:text-white text-base">Keyboard Shortcuts</h2>
                <p class="text-[11px] text-slate-400 mt-0.5">⌘ = Cmd on macOS · Ctrl on Windows/Linux</p>
            </div>
            <button
                onclick={onclose}
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <!-- Navigation column -->
            <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Navigation</p>
                <div class="space-y-2">
                    {#each nav as row}
                        <div class="flex items-center justify-between gap-3">
                            <span class="text-sm text-slate-600 dark:text-slate-300 truncate">{row.label}</span>
                            <kbd class="shrink-0 text-[10px] font-mono px-1.5 py-0.5
                                rounded-md
                                bg-slate-100 dark:bg-slate-800
                                border border-slate-200 dark:border-slate-600
                                border-b-2 border-b-slate-300 dark:border-b-slate-500
                                text-slate-600 dark:text-slate-300
                                shadow-sm">{row.shortcut}</kbd>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Page-specific column -->
            <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Current page</p>
                {#if actions.length > 0}
                    <div class="space-y-2">
                        {#each actions as row}
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-sm text-slate-600 dark:text-slate-300 truncate">{row.label}</span>
                                <kbd class="shrink-0 text-[10px] font-mono px-1.5 py-0.5
                                    rounded-md
                                    bg-slate-100 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-600
                                    border-b-2 border-b-slate-300 dark:border-b-slate-500
                                    text-slate-600 dark:text-slate-300
                                    shadow-sm">{row.shortcut}</kbd>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="text-xs text-slate-400 italic">No shortcuts on this page.</p>
                {/if}
            </div>
        </div>

        <!-- Footer hint -->
        <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
            <kbd class="font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">?</kbd>
            <span>toggle · </span>
            <kbd class="font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">Esc</kbd>
            <span>close</span>
        </div>
    </div>
</div>
