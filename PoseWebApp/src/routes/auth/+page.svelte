<script lang="ts">
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { registerUser, loginUser, setCurrentUser } from "$lib/auth";
    import { toast } from "$lib/stores/toast";
    import { Eye, EyeOff, Lock, Mail, User, AtSign } from "@lucide/svelte";

    let mode = $state<"signup" | "login">("login");

    // Fields
    let fullName = $state("");
    let emailOrUsername = $state(""); // login acepta ambos
    let email = $state(""); // solo signup
    let password = $state("");
    let confirm = $state("");
    let agreed = $state(false);
    let showPass = $state(false);
    let showConf = $state(false);

    let loading = $state(false);
    let errors = $state<Record<string, string>>({});

    function validate(): boolean {
        const e: Record<string, string> = {};
        if (mode === "signup") {
            if (!fullName.trim()) e.name = $_("auth.errors.name_required");
            if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                e.email = $_("auth.errors.email_invalid");
            if (password.length < 8)
                e.password = $_("auth.errors.password_short");
            if (password !== confirm)
                e.confirm = $_("auth.errors.password_mismatch");
            if (!agreed) e.terms = $_("auth.errors.terms_required");
        } else {
            if (!emailOrUsername.trim())
                e.identifier = $_("auth.errors.email_invalid");
            if (password.length < 8)
                e.password = $_("auth.errors.password_short");
        }
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
                    if (result.error === "email_taken") {
                        errors = { email: $_("auth.errors.email_taken") };
                        toast.error($_("auth.errors.email_taken"));
                    }
                    return;
                }
                toast.success("Account created! Setting up your profile...");
                setCurrentUser(result.userId);
                goto("/onboarding");
            } else {
                const result = await loginUser({ emailOrUsername, password });
                if (!result.success) {
                    if (result.error === "no_password") {
                        errors = {
                            password:
                                "This account has no password set. Please register again.",
                        };
                        toast.error(
                            "Account has no password set. Please create a new account.",
                        );
                    } else {
                        errors = {
                            password: $_("auth.errors.invalid_credentials"),
                        };
                        toast.error($_("auth.errors.invalid_credentials"));
                    }
                    return;
                }
                toast.success("Welcome back!");
                setCurrentUser(result.user.id);
                goto("/");
            }
        } catch (err) {
            console.error("Auth error:", err);
            toast.error("Something went wrong. Please try again.");
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

    // Input class helper
    const inputClass = (hasError: boolean) =>
        `w-full pl-10 pr-4 py-3 rounded-xl text-sm
         bg-slate-50 dark:bg-slate-800
         border ${hasError ? "border-red-400" : "border-slate-200 dark:border-slate-700"}
         text-slate-800 dark:text-white placeholder:text-slate-400
         focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all`;
</script>

<div
    class="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
>
    <!-- Glows -->
    <div
        class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-400/5 dark:bg-sky-400/8 blur-[140px] pointer-events-none"
    ></div>
    <div
        class="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/5 dark:bg-blue-600/8 blur-[120px] pointer-events-none"
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
            <span class="text-base font-bold text-sky-400">PoseFix</span>
        </div>
        <button
            aria-label="Help"
            class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
            flex items-center justify-center text-slate-400 hover:text-sky-400 transition-colors shadow-sm cursor-pointer"
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
                />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        </button>
    </div>

    <!-- Card -->
    <div class="flex-1 flex items-center justify-center px-4 py-8">
        <div
            class="w-full max-w-md bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden"
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
                    <!-- Full Name (signup) -->
                    {#if mode === "signup"}
                        <div>
                            <label
                                for="auth-fullname"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                {$_("auth.full_name")}
                            </label>
                            <div class="relative">
                                <User
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                />
                                <input
                                    id="auth-fullname"
                                    type="text"
                                    bind:value={fullName}
                                    placeholder="John Doe"
                                    class={inputClass(!!errors.name)}
                                />
                            </div>
                            {#if errors.name}<p
                                    class="text-xs text-red-400 mt-1"
                                >
                                    {errors.name}
                                </p>{/if}
                        </div>

                        <!-- Email (signup) -->
                        <div>
                            <label
                                for="auth-email"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                {$_("auth.email")}
                            </label>
                            <div class="relative">
                                <Mail
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                />
                                <input
                                    id="auth-email"
                                    type="email"
                                    bind:value={email}
                                    placeholder="john@example.com"
                                    class={inputClass(!!errors.email)}
                                />
                            </div>
                            {#if errors.email}<p
                                    class="text-xs text-red-400 mt-1"
                                >
                                    {errors.email}
                                </p>{/if}
                        </div>
                    {/if}

                    <!-- Email or Username (login) -->
                    {#if mode === "login"}
                        <div>
                            <label
                                for="auth-identifier"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                Email or Username
                            </label>
                            <div class="relative">
                                <AtSign
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                />
                                <input
                                    id="auth-identifier"
                                    type="text"
                                    bind:value={emailOrUsername}
                                    placeholder="john@example.com or johndoe92"
                                    class={inputClass(!!errors.identifier)}
                                />
                            </div>
                            {#if errors.identifier}<p
                                    class="text-xs text-red-400 mt-1"
                                >
                                    {errors.identifier}
                                </p>{/if}
                        </div>
                    {/if}

                    <!-- Password -->
                    <div>
                        <div class="flex justify-between items-center mb-1.5">
                            <label
                                for="auth-password"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                            >
                                {$_("auth.password")}
                            </label>
                            {#if mode === "login"}
                                <button
                                    type="button"
                                    aria-label="Forgot password"
                                    class="text-[10px] text-sky-400 hover:text-sky-500 font-medium transition-colors cursor-pointer"
                                >
                                    {$_("auth.forgot_password")}
                                </button>
                            {/if}
                        </div>
                        <div class="relative">
                            <Lock
                                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                            />
                            <input
                                id="auth-password"
                                type={showPass ? "text" : "password"}
                                bind:value={password}
                                placeholder="••••••••"
                                class={inputClass(!!errors.password).replace(
                                    "pr-4",
                                    "pr-10",
                                )}
                            />
                            <button
                                type="button"
                                aria-label={showPass
                                    ? "Hide password"
                                    : "Show password"}
                                onclick={() => (showPass = !showPass)}
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                            >
                                {#if showPass}
                                    <EyeOff class="w-4 h-4" />
                                {:else}
                                    <Eye class="w-4 h-4" />
                                {/if}
                            </button>
                        </div>
                        {#if errors.password}<p
                                class="text-xs text-red-400 mt-1"
                            >
                                {errors.password}
                            </p>{/if}
                    </div>

                    <!-- Confirm Password (signup) -->
                    {#if mode === "signup"}
                        <div>
                            <label
                                for="auth-confirm"
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >
                                {$_("auth.confirm_password")}
                            </label>
                            <div class="relative">
                                <Lock
                                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                />
                                <input
                                    id="auth-confirm"
                                    type={showConf ? "text" : "password"}
                                    bind:value={confirm}
                                    placeholder="••••••••"
                                    class={inputClass(!!errors.confirm).replace(
                                        "pr-4",
                                        "pr-10",
                                    )}
                                />
                                <button
                                    type="button"
                                    aria-label={showConf
                                        ? "Hide confirm password"
                                        : "Show confirm password"}
                                    onclick={() => (showConf = !showConf)}
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                                >
                                    {#if showConf}<EyeOff
                                            class="w-4 h-4"
                                        />{:else}<Eye class="w-4 h-4" />{/if}
                                </button>
                            </div>
                            {#if errors.confirm}<p
                                    class="text-xs text-red-400 mt-1"
                                >
                                    {errors.confirm}
                                </p>{/if}
                        </div>

                        <!-- Terms -->
                        <div>
                            <label
                                class="flex items-start gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    bind:checked={agreed}
                                    aria-label="Agree to terms"
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
                            {#if errors.terms}<p
                                    class="text-xs text-red-400 mt-1"
                                >
                                    {errors.terms}
                                </p>{/if}
                        </div>
                    {/if}
                </div>

                <!-- Submit -->
                <button
                    type="button"
                    aria-label={mode === "signup"
                        ? "Create account"
                        : "Sign in"}
                    onclick={submit}
                    disabled={loading}
                    class="w-full mt-6 py-3.5 rounded-xl font-bold text-sm cursor-pointer
                        bg-slate-800 dark:bg-sky-500 hover:bg-slate-700 dark:hover:bg-sky-400
                        text-sky-400 dark:text-white
                        disabled:opacity-60 disabled:cursor-not-allowed
                        transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    {#if loading}
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
                        {$_("common.loading")}
                    {:else}
                        {mode === "signup"
                            ? $_("auth.create_account")
                            : $_("auth.sign_in")}
                    {/if}
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
                         aria-label="Switch auth mode"
                         onclick={switchMode}
                         class="text-sky-400 hover:text-sky-500 font-bold ml-1 transition-colors cursor-pointer"
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
        @2026 PoseFix
        </p>
        <div class="flex gap-4">
            {#each ["Privacy", "Terms", "Support"] as link}
                <button
                    type="button"
                    aria-label={link}
                    class="text-[10px] uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                >
                    {link}
                </button>
            {/each}
        </div>
    </div>
</div>
