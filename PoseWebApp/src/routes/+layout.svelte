<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import "../app.css"
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";

    let {children} = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon"/>
</svelte:head>

<div class="relative flex h-screen w-screen overflow-hidden bg-soft-100 dark:bg-ink-black-950 text-graphite-900 dark:text-powder-blue-100 font-psans">

    <!-- Blob 1 - top left -->
    <div class="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full blur-[120px] opacity-30 pointer-events-none bg-tuscan-300 dark:bg-frozen-water-900"></div>

    <!-- Blob 2 - bottom right -->
    <div class="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full blur-[100px] opacity-20 pointer-events-none bg-electric-green-400 dark:bg-twilight-indigo-700"></div>


    <SideBar/>
    <main class="relative z-10 flex-1 overflow-auto">
        {@render children()}
    </main>
</div>
