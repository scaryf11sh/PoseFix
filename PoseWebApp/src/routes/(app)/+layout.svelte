<script lang="ts">
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { readFile } from "@tauri-apps/plugin-fs";

    let { children } = $props();

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }

        // Carga el usuario básico primero
        userStore.setUser(user);

        // Si tiene avatar, léelo como base64 para evitar caché de Tauri
        if (user.avatar_path) {
            try {
                const bytes = await readFile(user.avatar_path);
                const base64 = btoa(String.fromCharCode(...bytes));
                const dataUrl = `data:image/png;base64,${base64}`;
                userStore.setAvatarDataUrl(dataUrl, user.avatar_path);
            } catch {
                // Si falla (archivo no existe), no hay avatar
            }
        }
    });
</script>

<main
    class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <SideBar />
    <div class="flex-1 overflow-y-auto">
        {@render children()}
    </div>
</main>
