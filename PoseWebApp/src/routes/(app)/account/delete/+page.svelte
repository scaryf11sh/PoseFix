<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { getCurrentUser, clearCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import { ChevronLeft, AlertTriangle, Trash2 } from "@lucide/svelte";

    let loading = $state(true);
    let step = $state<"warn" | "confirm">("warn");
    let inputVal = $state("");
    let deleting = $state(false);
    let error = $state("");

    let user = $derived($userStore.user);
    let confirmWord = "DELETE";

    onMount(async () => {
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(current);
        loading = false;
    });

    async function deleteAccount() {
        if (inputVal !== confirmWord) {
            error = `Type "${confirmWord}" to confirm.`;
            return;
        }
        if (!user) return;
        deleting = true;
        try {
            // TODO: delete user from DB
            // await deleteUser(user.id);
            clearCurrentUser();
            userStore.clear();
            goto("/auth");
        } finally {
            deleting = false;
        }
    }

    const consequences = [
        "All your posture session history will be permanently deleted.",
        "Your exercise logs and progress data will be erased.",
        "Your profile, avatar, and personal information will be removed.",
        "This action cannot be undone under any circumstances.",
    ];
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
        <a
            href="/account"
            class="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                flex items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-400
                transition-all cursor-pointer shadow-sm"
        >
            <ChevronLeft class="w-5 h-5" />
        </a>
        <div>
            <h1 class="text-2xl font-bold text-red-500">
                {$_("account.danger_zone")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                {$_("account.delete_account")}
            </p>
        </div>
    </div>

    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div
                class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
            ></div>
        </div>
    {:else}
        <div class="max-w-lg mx-auto flex flex-col gap-4">
            {#if step === "warn"}
                <!-- Warning card -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-sm p-6"
                >
                    <div
                        class="flex flex-col items-center text-center gap-4 mb-6"
                    >
                        <div
                            class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                        >
                            <AlertTriangle class="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h2
                                class="text-xl font-bold text-slate-900 dark:text-white mb-1"
                            >
                                Are you absolutely sure?
                            </h2>
                            <p
                                class="text-sm text-slate-500 dark:text-slate-400"
                            >
                                {$_("account.danger_desc")}
                            </p>
                        </div>
                    </div>

                    <div
                        class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-6"
                    >
                        <p
                            class="text-xs font-bold uppercase tracking-wider text-red-500 mb-3"
                        >
                            This will permanently delete:
                        </p>
                        <ul class="flex flex-col gap-2">
                            {#each consequences as c}
                                <li
                                    class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                                >
                                    <span class="text-red-400 mt-0.5 shrink-0"
                                        >✕</span
                                    >
                                    {c}
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div class="flex gap-3">
                        <a
                            href="/account"
                            class="flex-1 py-3 rounded-xl text-sm font-medium text-center cursor-pointer
                                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            {$_("common.cancel")}
                        </a>
                        <button
                            onclick={() => (step = "confirm")}
                            class="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer
                                bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white
                                border border-red-500/30 hover:border-red-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Trash2 class="w-4 h-4" />
                            Continue
                        </button>
                    </div>
                </div>
            {:else}
                <!-- Confirm card -->
                <div
                    class="rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 shadow-sm p-6"
                >
                    <div class="flex items-center gap-3 mb-5">
                        <div
                            class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                        >
                            <Trash2 class="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <h2
                                class="font-bold text-slate-900 dark:text-white"
                            >
                                Final confirmation
                            </h2>
                            <p class="text-xs text-slate-400">
                                This cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div class="mb-5">
                        <label
                            for="confirm-info"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            Type <span class="text-red-400 font-mono"
                                >{confirmWord}</span
                            > to confirm
                        </label>
                        <input
                            id="confirm-info"
                            type="text"
                            bind:value={inputVal}
                            placeholder={confirmWord}
                            class="w-full px-3 py-3 rounded-xl text-sm font-mono
                                bg-slate-50 dark:bg-slate-800
                                border {error
                                ? 'border-red-400'
                                : 'border-slate-200 dark:border-slate-700'}
                                text-slate-800 dark:text-white placeholder:text-slate-300
                                focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-all"
                        />
                        {#if error}<p class="text-xs text-red-400 mt-1">
                                {error}
                            </p>{/if}
                    </div>

                    <div class="flex gap-3">
                        <button
                            onclick={() => {
                                step = "warn";
                                inputVal = "";
                                error = "";
                            }}
                            class="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer
                                bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            {$_("common.back")}
                        </button>
                        <button
                            onclick={deleteAccount}
                            disabled={deleting || inputVal !== confirmWord}
                            class="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer
                                bg-red-500 hover:bg-red-600 text-white
                                disabled:opacity-40 disabled:cursor-not-allowed
                                transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {#if deleting}
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
                                <Trash2 class="w-4 h-4" />
                            {/if}
                            {$_("account.delete_account")}
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
