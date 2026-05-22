<script lang="ts">
    import SideBar from "$lib/components/ui/NavBars/SideBar.svelte";
    import ShortcutsOverlay from "$lib/components/ui/ShortcutsOverlay.svelte";
    import { onMount, onDestroy } from "svelte";
    import { goto, afterNavigate } from "$app/navigation";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { readFile } from "@tauri-apps/plugin-fs";
    import { listen } from "@tauri-apps/api/event";
    import { sessionStore } from "$lib/stores/session";
    import { invoke } from "@tauri-apps/api/core";
    import { _ } from "svelte-i18n";

    let { children } = $props();
    let showShortcuts = $state(false);
    let quitDialog = $state(false);
    let scrollDiv = $state<HTMLDivElement | null>(null);

    afterNavigate(() => { if (scrollDiv) scrollDiv.scrollTop = 0; });

    // ─── Global keyboard shortcuts ───────────────────────────────────────────
    function confirmQuit() { invoke("quit_app"); }

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

        // Reset session state when stopped from tray popup
        listen("posefix:session-stopped", () => {
            sessionStore.set(null);
            localStorage.removeItem("posefix_active_session_id");
            localStorage.removeItem("posefix_session_start_ts");
        });

        // Navigate to camera when session started from tray popup
        listen("posefix:session-started", () => {
            goto("/camera");
        });
        listen("posefix:quit-requested", () => { quitDialog = true; });
    });
</script>

{#if showShortcuts}
    <ShortcutsOverlay onclose={() => (showShortcuts = false)} />
{/if}

    {#if quitDialog}
      <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-80 space-y-4 shadow-2xl">
          <h2 class="text-base font-semibold text-slate-100">{$_("app.quit_title")}</h2>
          <p class="text-sm text-slate-400">{$_("app.quit_body")}</p>
          <div class="flex gap-3 justify-end">
            <button
              onclick={() => (quitDialog = false)}
              class="px-4 py-2 text-sm text-slate-300 border border-slate-600 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              {$_("common.cancel")}
            </button>
            <button
              onclick={confirmQuit}
              class="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
            >
              {$_("app.quit_confirm")}
            </button>
          </div>
        </div>
      </div>
    {/if}

    <main class="flex flex-row h-screen overflow-hidden bg-bright-snow-50 dark:bg-prussian-blue-900">

    <SideBar />
    <div class="flex-1 overflow-y-auto" bind:this={scrollDiv}>
        {@render children()}
    </div>
</main>
