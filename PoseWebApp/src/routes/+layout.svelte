<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";
    import { isLoading } from "svelte-i18n";
    let { children } = $props();
    import Toaster from "$lib/components/ui/toast/Toaster.svelte";
</script>

<svelte:head>
    <link href={favicon} rel="icon" />
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
    <Toaster />
    {@render children()}
{/if}
