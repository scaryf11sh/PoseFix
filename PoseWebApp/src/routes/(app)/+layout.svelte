<script lang="ts">
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";
    import ShortcutsOverlay from "$lib/components/ui/ShortcutsOverlay.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { readFile } from "@tauri-apps/plugin-fs";

    let { children } = $props();
    let showShortcuts = $state(false);

    // ─── Global keyboard shortcuts ───────────────────────────────────────────
    const NAV_KEYS: Record<string, string> = {
        "1": "/",
        "2": "/camera",
        "3": "/exercises",
        "4": "/progress",
        "5": "/export",
        ",": "/settings",
    };

    $effect(() => {
        function handleKeydown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            const editable =
                tag === "input" ||
                tag === "textarea" ||
                tag === "select" ||
                (e.target as HTMLElement).isContentEditable;

            // ? → toggle shortcuts overlay
            if (e.key === "?" && !e.ctrlKey && !e.metaKey && !editable) {
                showShortcuts = !showShortcuts;
                return;
            }

            // Esc → close overlay
            if (e.key === "Escape" && showShortcuts) {
                showShortcuts = false;
                return;
            }

            // ⌘/Ctrl + 1-5 or , → navigate
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
                const route = NAV_KEYS[e.key];
                if (route !== undefined) {
                    e.preventDefault();
                    goto(route);
                }
            }
        }

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });

    // ─── Auth + avatar load ──────────────────────────────────────────────────
    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }

        userStore.setUser(user);

        if (user.avatar_path) {
            try {
                const bytes = await readFile(user.avatar_path);
                const base64 = btoa(String.fromCharCode(...bytes));
                const dataUrl = `data:image/png;base64,${base64}`;
                userStore.setAvatarDataUrl(dataUrl, user.avatar_path);
            } catch {}
        }
    });
</script>

{#if showShortcuts}
    <ShortcutsOverlay onclose={() => (showShortcuts = false)} />
{/if}

<main class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900">
    <SideBar />
    <div class="flex-1 overflow-y-auto">
        {@render children()}
    </div>
</main>
