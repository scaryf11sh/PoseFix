<script lang="ts">
    import { toast, type Toast } from "$lib/stores/toast";
    import { CheckCircle, XCircle, AlertTriangle, Info, X } from "@lucide/svelte";
    import { fly } from "svelte/transition";

    const icons = {
        success: CheckCircle,
        error:   XCircle,
        warning: AlertTriangle,
        info:    Info,
    };

    const styles = {
        success: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300",
        error:   "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300",
        warning: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300",
        info:    "bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300",
    };

    const iconStyles = {
        success: "text-green-500",
        error:   "text-red-500",
        warning: "text-yellow-500",
        info:    "text-sky-500",
    };
</script>

<!-- Fixed container top-center -->
<div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 w-full max-w-sm px-4 pointer-events-none">
    {#each $toast as t (t.id)}
        <div
            role="alert"
            transition:fly={{ y: -16, duration: 250 }}
            class="w-full flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg pointer-events-auto
                backdrop-blur-sm {styles[t.type]}"
        >
            <!-- Icon -->
            <div class="shrink-0 mt-0.5 {iconStyles[t.type]}">
                {#if t.type === "success"}
                    <CheckCircle class="w-4 h-4" />
                {:else if t.type === "error"}
                    <XCircle class="w-4 h-4" />
                {:else if t.type === "warning"}
                    <AlertTriangle class="w-4 h-4" />
                {:else}
                    <Info class="w-4 h-4" />
                {/if}
            </div>

            <!-- Message -->
            <p class="flex-1 text-sm font-medium leading-snug">{t.message}</p>

            <!-- Dismiss -->
            <button
                onclick={() => toast.remove(t.id)}
                aria-label="Dismiss notification"
                class="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer mt-0.5">
                <X class="w-4 h-4" />
            </button>
        </div>
    {/each}
</div>
