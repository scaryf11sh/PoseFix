<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";
    import { theme } from "$lib/stores/theme";
    import { onMount } from "svelte";
    import { isLoading } from "svelte-i18n";
    let { children } = $props();

    onMount(() => {
        // Aplica el tema guardado al montar (por si el script inline no lo hizo)
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
            theme.set(stored);
        }
    });
</script>

<svelte:head>
    <link href={favicon} rel="icon" />
    <!-- Script inline para evitar flash de tema incorrecto -->
    <script>
        (function () {
            const t = localStorage.getItem("theme");
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            if (t === "dark" || (!t && prefersDark)) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        })();
    </script>
</svelte:head>

{#if $isLoading}
    <div
        class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
        <div
            class="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
        ></div>
    </div>
{:else}
    {@render children()}
{/if}
