<script lang="ts">
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { registerUser, loginUser, setCurrentUser } from "$lib/auth";

    // --- Mode ---
    let mode = $state<"signup" | "login">("signup");

    // --- Fields ---
    let fullName = $state("");
    let email = $state("");
    let password = $state("");
    let confirm = $state("");
    let agreed = $state(false);
    let showPass = $state(false);

    // --- State ---
    let loading = $state(false);
    let errors = $state<Record<string, string>>({});

    function validate(): boolean {
        const e: Record<string, string> = {};

        if (mode === "signup" && !fullName.trim())
            e.name = $_("auth.errors.name_required");

        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            e.email = $_("auth.errors.email_invalid");

        if (password.length < 8) e.password = $_("auth.errors.password_short");

        if (mode === "signup" && password !== confirm)
            e.confirm = $_("auth.errors.password_mismatch");

        if (mode === "signup" && !agreed)
            e.terms = $_("auth.errors.terms_required");

        errors = e;
        return Object.keys(e).length === 0;
    }

    async function submit() {
        if (!validate()) return;
        loading = true;
        errors = {};

        try {
            if (mode === "signup") {
                const result = await registerUser({
                    username: fullName,
                    email,
                    password,
                });
                if (!result.success) {
                    errors = { email: $_("auth.errors.email_taken") };
                    return;
                }
                setCurrentUser(result.userId);
                goto("/onboarding");
            } else {
                const result = await loginUser({ email, password });
                if (!result.success) {
                    errors = {
                        password: $_("auth.errors.invalid_credentials"),
                    };
                    return;
                }
                setCurrentUser(result.user.id);
                goto("/");
            }
        } finally {
            loading = false;
        }
    }

    function switchMode() {
        mode = mode === "signup" ? "login" : "signup";
        errors = {};
        password = "";
        confirm = "";
    }
</script>

<div
    class="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
>
    <!-- Background glow -->
    <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full
        bg-sky-400/5 dark:bg-sky-400/8 blur-[140px] pointer-events-none"
    ></div>
    <div
        class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full
        bg-blue-600/5 dark:bg-blue-600/8 blur-[120px] pointer-events-none"
    ></div>

    <!-- Top bar -->
    <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-2">
            <div
                class="w-8 h-8 rounded-xl bg-sky-400 flex items-center justify-center shadow-lg shadow-sky-400/30"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    />
                </svg>
            </div>
            <span class="text-base font-bold text-sky-400">Glacier</span>
        </div>
        <button
            aria-label="Help"
            class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors shadow-sm"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="10" /><path
                    d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        </button>
    </div>

    <!-- Card -->
    <div class="flex-1 flex items-center justify-center px-4 py-8">
        <div
            class="w-full max-w-md
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40
            overflow-hidden"
        >
            <div
                class="h-0.5 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400"
            ></div>

            <div class="p-8">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1
                        class="text-2xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                        {mode === "signup"
                            ? $_("auth.get_started")
                            : $_("auth.sign_in_title")}
                    </h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        {mode === "signup"
                            ? $_("auth.tagline")
                            : $_("auth.sign_in_tagline")}
                    </p>
                </div>

                <div class="space-y-4">
                    <!-- Full Name -->
                    {#if mode === "signup"}
                        <div>
                            <label
                                for="fullName"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                {$_("auth.full_name")}
                            </label>
                            <div class="relative">
                                <svg
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    /><circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="fullName"
                                    type="text"
                                    bind:value={fullName}
                                    placeholder="John Doe"
                                    class="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                        bg-slate-50 dark:bg-slate-800
                                        border {errors.name
                                        ? 'border-red-400'
                                        : 'border-slate-200 dark:border-slate-700'}
                                        text-slate-800 dark:text-white placeholder:text-slate-400
                                        focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                                />
                            </div>
                            {#if errors.name}
                                <p class="text-xs text-red-400 mt-1">
                                    {errors.name}
                                </p>
                            {/if}
                        </div>
                    {/if}

                    <!-- Email -->
                    <div>
                        <label
                            for="email"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            {$_("auth.email")}
                        </label>
                        <div class="relative">
                            <svg
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                /><polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                id="email"
                                type="email"
                                bind:value={email}
                                placeholder="john@example.com"
                                class="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                    bg-slate-50 dark:bg-slate-800
                                    border {errors.email
                                    ? 'border-red-400'
                                    : 'border-slate-200 dark:border-slate-700'}
                                    text-slate-800 dark:text-white placeholder:text-slate-400
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        </div>
                        {#if errors.email}
                            <p class="text-xs text-red-400 mt-1">
                                {errors.email}
                            </p>
                        {/if}
                    </div>

                    <!-- Password -->
                    <div>
                        <div class="flex justify-between items-center mb-1.5">
                            <label
                                for="password"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                            >
                                {$_("auth.password")}
                            </label>
                            {#if mode === "login"}
                                <button
                                    type="button"
                                    class="text-[10px] text-sky-400 hover:text-sky-500 font-medium transition-colors"
                                >
                                    {$_("auth.forgot_password")}
                                </button>
                            {/if}
                        </div>
                        <div class="relative">
                            <svg
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="password"
                                type={showPass ? "text" : "password"}
                                bind:value={password}
                                placeholder="••••••••"
                                class="w-full pl-10 pr-10 py-3 rounded-xl text-sm
                                    bg-slate-50 dark:bg-slate-800
                                    border {errors.password
                                    ? 'border-red-400'
                                    : 'border-slate-200 dark:border-slate-700'}
                                    text-slate-800 dark:text-white placeholder:text-slate-400
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                            <button
                                type="button"
                                aria-label={showPass
                                    ? "Hide password"
                                    : "Show password"}
                                onclick={() => (showPass = !showPass)}
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors"
                            >
                                {#if showPass}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                        />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                {:else}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                        /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                {/if}
                            </button>
                        </div>
                        {#if errors.password}
                            <p class="text-xs text-red-400 mt-1">
                                {errors.password}
                            </p>
                        {/if}
                    </div>

                    <!-- Confirm Password -->
                    {#if mode === "signup"}
                        <div>
                            <label
                                for="confirm"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                {$_("auth.confirm_password")}
                            </label>
                            <div class="relative">
                                <svg
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <rect
                                        x="3"
                                        y="11"
                                        width="18"
                                        height="11"
                                        rx="2"
                                        ry="2"
                                    /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="confirm"
                                    type="password"
                                    bind:value={confirm}
                                    placeholder="••••••••"
                                    class="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                        bg-slate-50 dark:bg-slate-800
                                        border {errors.confirm
                                        ? 'border-red-400'
                                        : 'border-slate-200 dark:border-slate-700'}
                                        text-slate-800 dark:text-white placeholder:text-slate-400
                                        focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                                />
                            </div>
                            {#if errors.confirm}
                                <p class="text-xs text-red-400 mt-1">
                                    {errors.confirm}
                                </p>
                            {/if}
                        </div>

                        <!-- Terms -->
                        <div>
                            <label
                                class="flex items-start gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={agreed}
                                    class="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-sky-400 shrink-0"
                                />
                                <span
                                    class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                                >
                                    {$_("auth.terms_prefix")}
                                    <a
                                        href="#terms"
                                        class="text-sky-400 hover:underline"
                                        >{$_("auth.terms_link")}</a
                                    >
                                    {$_("auth.terms_and")}
                                    <a
                                        href="#privacy"
                                        class="text-sky-400 hover:underline"
                                        >{$_("auth.privacy_link")}</a
                                    >.
                                </span>
                            </label>
                            {#if errors.terms}
                                <p class="text-xs text-red-400 mt-1">
                                    {errors.terms}
                                </p>
                            {/if}
                        </div>
                    {/if}
                </div>

                <!-- Submit -->
                <button
                    type="button"
                    onclick={submit}
                    disabled={loading}
                    class="w-full mt-6 py-3.5 rounded-xl font-bold text-sm
                        bg-slate-800 dark:bg-sky-500 hover:bg-slate-700 dark:hover:bg-sky-400
                        text-sky-400 dark:text-white
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all shadow-lg active:scale-95
                        flex items-center justify-center gap-2"
                >
                    {#if loading}
                        <svg
                            class="w-4 h-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
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
                        {$_("common.loading")}
                    {:else}
                        {mode === "signup"
                            ? $_("auth.create_account")
                            : $_("auth.sign_in")}
                    {/if}
                </button>

                <!-- Divider -->
                <div class="flex items-center gap-3 my-5">
                    <div
                        class="flex-1 h-px bg-slate-200 dark:bg-slate-700"
                    ></div>
                    <span
                        class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                    >
                        {$_("auth.or_continue_with")}
                    </span>
                    <div
                        class="flex-1 h-px bg-slate-200 dark:bg-slate-700"
                    ></div>
                </div>

                <!-- Google -->
                <button
                    type="button"
                    class="w-full py-3 rounded-xl text-sm font-medium
                        bg-white dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        text-slate-700 dark:text-slate-200
                        hover:border-sky-300 hover:shadow-sm
                        transition-all flex items-center justify-center gap-3"
                >
                    <svg class="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {$_("auth.google")}
                </button>

                <!-- Switch mode -->
                <p
                    class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6"
                >
                    {mode === "signup"
                        ? $_("auth.have_account")
                        : $_("auth.no_account")}
                    <button
                        type="button"
                        onclick={switchMode}
                        class="text-sky-400 hover:text-sky-500 font-bold ml-1 transition-colors"
                    >
                        {mode === "signup"
                            ? $_("auth.sign_in")
                            : $_("auth.create_account")}
                    </button>
                </p>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-center gap-6 py-4 px-6 flex-wrap">
        <p class="text-[10px] uppercase tracking-widest text-slate-400">
            © 2024 Glacier Ergonomics. Precision in Posture.
        </p>
        <div class="flex gap-4">
            {#each ["Privacy", "Terms", "Support"] as link}
                <button
                    type="button"
                    class="text-[10px] uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors"
                >
                    {link}
                </button>
            {/each}
        </div>
    </div>
</div>
