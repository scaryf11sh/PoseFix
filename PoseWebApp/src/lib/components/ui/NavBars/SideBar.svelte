<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import {
        LayoutDashboard,
        Video,
        Dumbbell,
        FileDown,
        Settings2,
        ClipboardClock,
        LogOut,
        AlertTriangle,
        X,
    } from "@lucide/svelte";
    import { userStore } from "$lib/stores/user";
    import { sessionStore } from "$lib/stores/session";
    import { clearCurrentUser } from "$lib/auth";
    import { endSession } from "$lib/db";
    import { invoke } from "@tauri-apps/api/core";

    let currentPath = $derived(page.url.pathname);

    function isActive(href: string) {
        return currentPath === href;
    }

    // ─── Logout modal ────────────────────────────────────────────────────────
    let showLogoutModal = $state(false);
    let loggingOut = $state(false);

    function handleLogoutClick() {
        if ($sessionStore !== null) {
            showLogoutModal = true;
        } else {
            doLogout();
        }
    }

    async function doLogout() {
        loggingOut = true;
        try {
            if ($sessionStore !== null) {
                await endSession($sessionStore, {
                    posture_score: 0,
                    fatigue_score: 0,
                    eye_distance: 0,
                    blink_rate: 0,
                }).catch(() => {});
                sessionStore.set(null);
            }
            try { await invoke("stop_pose_server"); } catch {}
        } finally {
            loggingOut = false;
            showLogoutModal = false;
            clearCurrentUser();
            userStore.clear();
            goto("/auth");
        }
    }

    // Initials fallback
    let initials = $derived(
        $userStore.user
            ? $userStore.user.username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
            : "?",
    );
</script>

<!-- Logout confirmation modal -->
{#if showLogoutModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onclick={() => (showLogoutModal = false)}
            aria-label="Close"
        ></button>
        <!-- Card -->
        <div class="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <button
                onclick={() => (showLogoutModal = false)}
                class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close"
            >
                <X class="w-4 h-4" />
            </button>

            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                    <AlertTriangle class="w-5 h-5" />
                </div>
                <div>
                    <h3 class="font-bold text-slate-800 dark:text-white">Active session running</h3>
                    <p class="text-xs text-slate-400">Logging out will end your current session.</p>
                </div>
            </div>

            <p class="text-sm text-slate-600 dark:text-slate-300 mb-6">
                You have an active posture monitoring session. Do you want to end it and log out?
            </p>

            <div class="flex flex-col gap-2">
                <button
                    onclick={doLogout}
                    disabled={loggingOut}
                    class="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                    {#if loggingOut}
                        <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                        Ending session…
                    {:else}
                        <LogOut class="w-4 h-4" />
                        End session & log out
                    {/if}
                </button>
                <button
                    onclick={() => (showLogoutModal = false)}
                    class="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Keep session active
                </button>
            </div>
        </div>
    </div>
{/if}

<aside
    class="h-screen hidden md:flex p-4 w-64 dark:bg-slate-950/75 border-r backdrop-blur-3xl border-sky-400/10 shadow-2xl z-40 sticky top-0"
>
    <div class="h-full flex flex-col justify-between w-full">
        <!-- Logo -->
        <div>
            <div class="flex flex-row items-center gap-x-1 mb-8">
                <img src="/icon.png" alt="Logo" class="w-12 h-12" />
                <div>
                    <h2
                        class="text-lg font-bold text-deep-twilight-900 dark:text-frozen-lake-400"
                    >
                        PoseFix
                    </h2>
                    <h3
                        class="text-xs uppercase text-deep-twilight-900/75 dark:text-frozen-lake-400/75"
                    >
                        Ergonomic Planner
                    </h3>
                </div>
            </div>

            <!-- Main nav -->
            <div class="flex flex-col gap-2">
                {#each [{ href: "/", icon: LayoutDashboard, label: $_("nav.dashboard") }, { href: "/camera", icon: Video, label: $_("nav.monitor") }, { href: "/exercises", icon: Dumbbell, label: $_("nav.exercises") }, { href: "/progress", icon: ClipboardClock, label: $_("nav.progress") }, { href: "/export", icon: FileDown, label: $_("nav.export") }] as item}
                    <a
                        href={item.href}
                        aria-label={item.label}
                        class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer
                            {isActive(item.href)
                            ? 'outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200'
                            : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3'}"
                    >
                        <svelte:component
                            this={item.icon}
                            class="w-5 h-5 shrink-0"
                        />
                        <span class="flex-1 cursor-pointer">{item.label}</span>
                    </a>
                {/each}
            </div>
        </div>

        <!-- Bottom: Settings, Account, Logout -->
        <div class="flex flex-col gap-2">
            <!-- Settings -->
            <a
                href="/settings"
                aria-label={$_("nav.settings")}
                class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer
                    {isActive('/settings')
                    ? 'outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200'
                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3'}"
            >
                <Settings2 class="w-5 h-5 shrink-0" />
                <span class="flex-1 cursor-pointer">{$_("nav.settings")}</span>
            </a>

            <!-- Account -->
            <a
                href="/account"
                aria-label={$_("nav.account")}
                class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer
                    {isActive('/account')
                    ? 'outline outline-frozen-lake-400/60 dark:outline-frozen-lake-800 bg-frozen-lake-400/15 text-deep-twilight-900 dark:text-frozen-lake-200'
                    : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50 text-deep-twilight-900/50 dark:text-frozen-lake-200/50 hover:translate-x-3'}"
            >
                <!-- Avatar -->
                <div
                    class="w-6 h-6 rounded-full shrink-0 ring-1 ring-sky-400/50 overflow-hidden bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center"
                >
                    {#if $userStore.avatarUrl}
                        <img
                            src={$userStore.avatarUrl}
                            alt="Profile"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <span
                            class="text-[8px] font-bold text-white leading-none"
                            >{initials}</span
                        >
                    {/if}
                </div>
                <span class="flex-1 cursor-pointer">{$_("nav.account")}</span>
            </a>

            <!-- Logout -->
            <button
                onclick={handleLogoutClick}
                class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer
                    text-red-400/70 hover:text-red-400 hover:bg-red-400/10 hover:translate-x-3 text-left"
            >
                <LogOut class="w-5 h-5 shrink-0" />
                <span class="flex-1">{$_("nav.logout")}</span>
            </button>
        </div>
    </div>
</aside>
