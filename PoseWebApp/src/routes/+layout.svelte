<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon" />
</svelte:head>

<main class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900 text-frozen-lake-200">
    <SideBar />
    <div class="flex-1 p-6 h-full overflow-y-auto">
        {@render children()}
    </div>
</main>
