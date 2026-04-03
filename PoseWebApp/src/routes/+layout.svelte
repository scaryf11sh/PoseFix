<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";
    import { theme } from "$lib/stores/theme";
    import { onMount } from "svelte";

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

<main
    class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900 text-frozen-lake-200"
>
    <SideBar />
    <div class="flex-1 overflow-y-auto">
        {@render children()}
    </div>
</main>
