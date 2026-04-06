<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { settingsStore } from "$lib/stores/settings";
    import {
        ChevronLeft,
        Bell,
        BellOff,
        Save,
        CheckCircle,
    } from "@lucide/svelte";

    let loading = $state(true);
    let saving = $state(false);
    let saved = $state(false);

    type NotifKey = "posture" | "weekly" | "stretch" | "drift";
    let notifs = $state({ ...$settingsStore.notifications });

    onMount(async () => {
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(current);
        loading = false;
    });

    async function savePreferences() {
        saving = true;
        try {
            settingsStore.save({
                ...$settingsStore,
                notifications: { ...notifs },
            });
            saved = true;
            setTimeout(() => (saved = false), 2500);
        } finally {
            saving = false;
        }
    }

    const items: { key: NotifKey; icon: typeof Bell; color: string }[] = [
        {
            key: "posture",
            icon: Bell,
            color: "text-sky-500 bg-sky-100 dark:bg-sky-900/40",
        },
        {
            key: "weekly",
            icon: Bell,
            color: "text-purple-500 bg-purple-100 dark:bg-purple-900/40",
        },
        {
            key: "stretch",
            icon: Bell,
            color: "text-green-500 bg-green-100 dark:bg-green-900/40",
        },
        {
            key: "drift",
            icon: BellOff,
            color: "text-red-500 bg-red-100 dark:bg-red-900/40",
        },
    ];
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div class="flex items-center gap-3">
            <a
                href="/account"
                class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    flex items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-400
                    transition-all cursor-pointer shadow-sm"
            >
                <ChevronLeft class="w-5 h-5" />
            </a>
            <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                    {$_("account.notifications")}
                </h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                    {$_("account.notif_sub")}
                </p>
            </div>
        </div>
        <div class="flex items-center gap-3">
            {#if saved}
                <span
                    class="flex items-center gap-1.5 text-sm text-green-500 font-medium"
                >
                    <CheckCircle class="w-4 h-4" />{$_("common.saved")}
                </span>
            {/if}
            <button
                onclick={savePreferences}
                disabled={saving}
                class="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-500 text-white text-sm font-bold
                    transition-all shadow-lg shadow-sky-400/20 active:scale-95 disabled:opacity-60
                    flex items-center gap-2 cursor-pointer"
            >
                {#if saving}
                    <svg
                        class="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                        />
                    </svg>
                {:else}
                    <Save class="w-4 h-4" />
                {/if}
                {$_("common.save")}
            </button>
        </div>
    </div>

    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div
                class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
            ></div>
        </div>
    {:else}
        <div class="max-w-2xl flex flex-col gap-3">
            {#each items as item}
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5
                    flex items-center gap-4"
                >
                    <div
                        class="w-11 h-11 rounded-xl {item.color} flex items-center justify-center shrink-0"
                    >
                        <svelte:component this={item.icon} class="w-5 h-5" />
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-slate-800 dark:text-white">
                            {$_(`settings.notifs.${item.key}`)}
                        </p>
                        <p class="text-sm text-slate-400">
                            {$_(`settings.notifs.${item.key}_sub`)}
                        </p>
                    </div>
                    <button
                        onclick={() => (notifs[item.key] = !notifs[item.key])}
                        class="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 cursor-pointer
                            {notifs[item.key]
                            ? 'bg-sky-400'
                            : 'bg-slate-200 dark:bg-slate-600'}"
                    >
                        <span
                            class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                            {notifs[item.key]
                                ? 'translate-x-6'
                                : 'translate-x-0'}"
                        >
                        </span>
                    </button>
                </div>
            {/each}

            <p class="text-xs text-slate-400 text-center mt-2">
                System notifications will appear as native OS alerts when a
                posture warning is detected.
            </p>
        </div>
    {/if}
</div>
