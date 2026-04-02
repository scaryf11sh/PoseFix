<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import "../app.css";
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <link href={favicon} rel="icon" />
</svelte:head>

    <!-- Blob 1 - top left -->
    <!-- <div -->
    <!--  class="absolute top-[-20%] left-[-10%] w-150 h-150 rounded-full blur-[120px] opacity-30 pointer-events-none bg-tuscan-300 dark:bg-frozen-water-900" -->
    <!--  ></div> -->

    <!-- Blob 2 - bottom right -->
    <!-- <div -->
    <!-- class="absolute bottom-[-10%] right-[-5%] w-125 h-125 rounded-full blur-[100px] opacity-20 pointer-events-none bg-electric-green-400 dark:bg-twilight-indigo-700" -->
    <!-- ></div> -->

    <main class="flex flex-row bg-bright-snow-50 dark:bg-prussian-blue-900 text-frozen-lake-200">
        <SideBar />
        {@render children()}
    </main>
