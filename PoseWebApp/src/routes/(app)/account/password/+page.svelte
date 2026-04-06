<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import {
        ChevronLeft,
        Lock,
        Eye,
        EyeOff,
        CheckCircle,
        AlertCircle,
    } from "@lucide/svelte";

    let loading = $state(true);
    let saving = $state(false);
    let saved = $state(false);
    let showOld = $state(false);
    let showNew = $state(false);
    let showConfirm = $state(false);

    let oldPassword = $state("");
    let newPassword = $state("");
    let confirmPass = $state("");
    let errors = $state<Record<string, string>>({});

    onMount(async () => {
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(current);
        loading = false;
    });

    function validate(): boolean {
        const e: Record<string, string> = {};
        if (!oldPassword) e.old = $_("auth.errors.password_short");
        if (newPassword.length < 8) e.new = $_("auth.errors.password_short");
        if (newPassword !== confirmPass)
            e.confirm = $_("auth.errors.password_mismatch");
        errors = e;
        return Object.keys(e).length === 0;
    }

    async function changePassword() {
        if (!validate()) return;
        saving = true;
        try {
            // TODO: implementar verificación de contraseña actual y actualización
            await new Promise((r) => setTimeout(r, 800)); // simulación
            saved = true;
            oldPassword = "";
            newPassword = "";
            confirmPass = "";
            setTimeout(() => (saved = false), 3000);
        } finally {
            saving = false;
        }
    }

    const requirements = [
        {
            label: "At least 8 characters",
            check: () => newPassword.length >= 8,
        },
        {
            label: "One uppercase letter",
            check: () => /[A-Z]/.test(newPassword),
        },
        { label: "One number", check: () => /[0-9]/.test(newPassword) },
        {
            label: "Passwords match",
            check: () => newPassword === confirmPass && confirmPass.length > 0,
        },
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
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                {$_("account.password")}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                {$_("account.password_sub")}
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
        <div class="max-w-md mx-auto flex flex-col gap-4">
            {#if saved}
                <div
                    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                    <CheckCircle class="w-5 h-5 text-green-500 shrink-0" />
                    <p
                        class="text-sm font-medium text-green-600 dark:text-green-400"
                    >
                        Password updated successfully.
                    </p>
                </div>
            {/if}

            <div
                class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col gap-4"
            >
                <div class="flex items-center gap-2 mb-2">
                    <div
                        class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                    >
                        <Lock class="w-4 h-4" />
                    </div>
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Change Password
                    </h2>
                </div>

                <!-- Current Password -->
                <div>
                    <label
                        for="current_password_input"
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >Current Password</label
                    >
                    <div class="relative">
                        <Lock
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        />
                        <input
                            id="current_password_input"
                            type={showOld ? "text" : "password"}
                            bind:value={oldPassword}
                            placeholder="••••••••"
                            class="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800
                                border {errors.old
                                ? 'border-red-400'
                                : 'border-slate-200 dark:border-slate-700'}
                                text-slate-800 dark:text-white placeholder:text-slate-400
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => (showOld = !showOld)}
                            aria-label="Toggle visibility"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                        >
                            {#if showOld}<EyeOff class="w-4 h-4" />{:else}<Eye
                                    class="w-4 h-4"
                                />{/if}
                        </button>
                    </div>
                    {#if errors.old}<p class="text-xs text-red-400 mt-1">
                            {errors.old}
                        </p>{/if}
                </div>

                <!-- New Password -->
                <div>
                    <label
                        for="new_password_input"
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >New Password</label
                    >
                    <div class="relative">
                        <Lock
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        />
                        <input
                            id="new_password_input"
                            type={showNew ? "text" : "password"}
                            bind:value={newPassword}
                            placeholder="••••••••"
                            class="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800
                                border {errors.new
                                ? 'border-red-400'
                                : 'border-slate-200 dark:border-slate-700'}
                                text-slate-800 dark:text-white placeholder:text-slate-400
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => (showNew = !showNew)}
                            aria-label="Toggle visibility"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                        >
                            {#if showNew}<EyeOff class="w-4 h-4" />{:else}<Eye
                                    class="w-4 h-4"
                                />{/if}
                        </button>
                    </div>
                    {#if errors.new}<p class="text-xs text-red-400 mt-1">
                            {errors.new}
                        </p>{/if}
                </div>

                <!-- Confirm Password -->
                <div>
                    <label
                        for="confirm_password_input"
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >Confirm New Password</label
                    >
                    <div class="relative">
                        <Lock
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        />
                        <input
                            id="confirm_password_input"
                            type={showConfirm ? "text" : "password"}
                            bind:value={confirmPass}
                            placeholder="••••••••"
                            class="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800
                                border {errors.confirm
                                ? 'border-red-400'
                                : 'border-slate-200 dark:border-slate-700'}
                                text-slate-800 dark:text-white placeholder:text-slate-400
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => (showConfirm = !showConfirm)}
                            aria-label="Toggle visibility"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                        >
                            {#if showConfirm}<EyeOff
                                    class="w-4 h-4"
                                />{:else}<Eye class="w-4 h-4" />{/if}
                        </button>
                    </div>
                    {#if errors.confirm}<p class="text-xs text-red-400 mt-1">
                            {errors.confirm}
                        </p>{/if}
                </div>

                <!-- Requirements -->
                {#if newPassword.length > 0}
                    <div
                        class="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 flex flex-col gap-1.5"
                    >
                        {#each requirements as req}
                            <div class="flex items-center gap-2">
                                {#if req.check()}
                                    <CheckCircle
                                        class="w-3.5 h-3.5 text-green-500 shrink-0"
                                    />
                                {:else}
                                    <div
                                        class="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0"
                                    ></div>
                                {/if}
                                <span
                                    class="text-xs {req.check()
                                        ? 'text-green-500'
                                        : 'text-slate-400'}">{req.label}</span
                                >
                            </div>
                        {/each}
                    </div>
                {/if}

                <button
                    onclick={changePassword}
                    disabled={saving}
                    class="w-full py-3 rounded-xl text-sm font-bold cursor-pointer
                        bg-sky-400 hover:bg-sky-500 text-white shadow-lg shadow-sky-400/20
                        disabled:opacity-60 transition-all active:scale-95 flex items-center justify-center gap-2"
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
                        <Lock class="w-4 h-4" />
                    {/if}
                    Update Password
                </button>
            </div>
        </div>
    {/if}
</div>
