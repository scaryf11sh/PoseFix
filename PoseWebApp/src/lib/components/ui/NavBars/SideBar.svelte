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
    } from "@lucide/svelte";
    import { userStore } from "$lib/stores/user";
    import { clearCurrentUser } from "$lib/auth";

    let currentPath = $derived(page.url.pathname);

    function isActive(href: string) {
        return currentPath === href;
    }

    async function logout() {
        clearCurrentUser();
        userStore.clear();
        goto("/auth");
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
                <div class="p-[1.5px] rounded-full bg-jade-green-400 shrink-0">
                    <div class="p-[1px] rounded-full dark:bg-slate-950/75">
                        <div
                            class="rounded-full size-7 overflow-hidden bg-linear-to-br from-sky-400 to-blue-600 flex items-center justify-center"
                        >
                            {#if $userStore.avatarUrl}
                                <img
                                    src={$userStore.avatarUrl}
                                    alt="Profile"
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <span class="text-[10px] font-bold text-white"
                                    >{initials}</span
                                >
                            {/if}
                        </div>
                    </div>
                </div>
                <span class="flex-1 cursor-pointer">{$_("nav.account")}</span>
            </a>

            <!-- Logout -->
            <button
                onclick={logout}
                class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full transition-all duration-200 cursor-pointer
                    text-red-400/70 hover:text-red-400 hover:bg-red-400/10 hover:translate-x-3 text-left"
            >
                <LogOut class="w-5 h-5 shrink-0" />
                <span class="flex-1">{$_("nav.logout")}</span>
            </button>
        </div>
    </div>
</aside>
