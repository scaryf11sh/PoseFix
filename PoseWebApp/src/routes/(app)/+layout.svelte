<script lang="ts">
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";
    let { children } = $props();
</script>

<main
    class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <SideBar />
    <div class="flex-1 overflow-y-auto">
        {@render children()}
    </div>
</main>
