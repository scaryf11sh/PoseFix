<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { open } from "@tauri-apps/plugin-dialog";
    import { readFile, BaseDirectory } from "@tauri-apps/plugin-fs";
    import { appDataDir, join } from "@tauri-apps/api/path";
    import { invoke } from "@tauri-apps/api/core";
    import {
        updateUser,
        updateAvatar,
        isUsernameTaken,
        getSessionStats,
        getExerciseCount,
        type SessionStats,
    } from "$lib/db";
    import { getCurrentUser } from "$lib/auth";
    import { userStore } from "$lib/stores/user";
    import AvatarCropModal from "$lib/components/ui/modals/AvatarCropModal.svelte";
    import {
        Camera,
        Shield,
        Bell,
        ChevronRight,
        Star,
        Save,
        AlertTriangle,
    } from "@lucide/svelte";

    // --- State ---
    let stats = $state<SessionStats | null>(null);
    let exerciseCount = $state(0);
    let loading = $state(true);
    let editing = $state(false);
    let saving = $state(false);
    let saved = $state(false);

    // Form fields
    let username = $state("");
    let fullName = $state("");
    let email = $state("");
    let profession = $state("");
    let age = $state("");
    let usernameError = $state("");

    // Avatar modal
    let showCropModal = $state(false);
    let cropSrc = $state("");

    let avatarUrl = $derived($userStore.avatarUrl);
    let user = $derived($userStore.user);

    onMount(async () => {
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }
        if (!$userStore.user) userStore.setUser(current);
        username = current.username;
        fullName = (current as any).full_name ?? current.username;
        email = current.email;
        profession = current.profession ?? "";
        age = current.age?.toString() ?? "";
        stats = await getSessionStats(current.id);
        exerciseCount = await getExerciseCount(current.id);
        loading = false;
    });

    // --- Username validation ---
    async function validateUsername(): Promise<boolean> {
        if (!username.trim()) {
            usernameError = "Username is required.";
            return false;
        }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            usernameError = "3-20 chars: letters, numbers, underscore only.";
            return false;
        }
        if (user && username !== user.username) {
            const taken = await isUsernameTaken(username, user.id);
            if (taken) {
                usernameError = "This username is already taken.";
                return false;
            }
        }
        usernameError = "";
        return true;
    }

    // --- Save ---
    async function saveChanges() {
        if (!user) return;
        const ok = await validateUsername();
        if (!ok) return;
        saving = true;
        try {
            await updateUser(user.id, {
                username,
                profession: profession || undefined,
                age: age ? parseInt(age) : undefined,
            });
            userStore.setUser({
                ...user,
                username,
                full_name: fullName,
                profession,
                age: age ? parseInt(age) : undefined,
            } as any);
            editing = false;
            saved = true;
            setTimeout(() => (saved = false), 2500);
        } finally {
            saving = false;
        }
    }

    function cancelEdit() {
        if (!user) return;
        username = user.username;
        fullName = (user as any).full_name ?? user.username;
        email = user.email;
        profession = user.profession ?? "";
        age = user.age?.toString() ?? "";
        usernameError = "";
        editing = false;
    }

    // --- Avatar picker ---
    async function pickAvatar() {
        const selected = await open({
            filters: [
                { name: "Image", extensions: ["png", "jpg", "jpeg", "webp"] },
            ],
        });
        if (!selected || typeof selected !== "string") return;

        // Lee el archivo seleccionado como base64 para el modal
        const bytes = await readFile(selected);
        const arr = new Uint8Array(bytes);
        let bin = "";
        arr.forEach((b) => (bin += String.fromCharCode(b)));
        const b64 = btoa(bin);
        const ext = selected.split(".").pop()?.toLowerCase() ?? "jpeg";
        const mime = ext === "png" ? "image/png" : "image/jpeg";
        cropSrc = `data:${mime};base64,${b64}`;
        showCropModal = true;
    }

    // --- Avatar confirmed (cropped dataUrl from canvas) ---
    async function onAvatarConfirmed(croppedDataUrl: string) {
        if (!user) return;
        showCropModal = false;

        // Convierte dataUrl → Uint8Array
        const base64 = croppedDataUrl.split(",")[1];
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

        // Guarda via comando Tauri (evita problema de permisos de plugin-fs)
        const dir = await appDataDir();
        const dest = await join(dir, "avatar.png");

        // Usa invoke para escribir el archivo desde Rust
        await invoke("save_avatar", { path: dest, data: Array.from(bytes) });

        // Actualiza DB
        await updateAvatar(user.id, dest);

        // Actualiza store con el dataUrl del canvas → inmediato, sin caché
        userStore.setAvatarDataUrl(croppedDataUrl, dest);
    }

    function onAvatarCancelled() {
        showCropModal = false;
        cropSrc = "";
    }

    async function onAvatarChange() {
        showCropModal = false;
        cropSrc = "";
        await pickAvatar();
    }

    let initials = $derived(
        fullName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?",
    );
    let postureScore = $derived(Math.round(stats?.avg_score ?? 0));
</script>

{#if showCropModal && cropSrc}
    <AvatarCropModal
        src={cropSrc}
        onconfirm={onAvatarConfirmed}
        oncancel={onAvatarCancelled}
        onchange={onAvatarChange}
    />
{/if}

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {$_("account.title")}
    </h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
        {$_("account.subtitle")}
    </p>

    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div
                class="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
            ></div>
        </div>
    {:else if !user}
        <div
            class="flex flex-col items-center justify-center h-64 gap-3 text-slate-400"
        >
            <AlertTriangle class="w-12 h-12" />
            <p class="text-sm">{$_("account.no_user")}</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <!-- Profile card -->
            <div
                class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center gap-4"
            >
                <!-- Avatar -->
                <div class="relative">
                    {#if avatarUrl}
                        <img
                            src={avatarUrl}
                            alt={fullName}
                            class="w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-sky-400/30"
                        />
                    {:else}
                        <div
                            class="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600
                            flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-400/20"
                        >
                            {initials}
                        </div>
                    {/if}
                    <button
                        onclick={pickAvatar}
                        aria-label="Change profile picture"
                        class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-400 hover:bg-sky-500
                            flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                    >
                        <Camera class="w-4 h-4 text-white" />
                    </button>
                </div>

                <div class="text-center">
                    <h2
                        class="text-lg font-bold text-slate-800 dark:text-white"
                    >
                        {fullName}
                    </h2>
                    <p class="text-sm text-sky-400 font-medium">@{username}</p>
                    <p class="text-xs text-slate-400 mt-0.5">
                        {profession || "—"}
                    </p>
                </div>

                <!-- Posture score -->
                <div class="w-full px-2">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-slate-400"
                            >{$_("account.avg_score")}</span
                        >
                        <span class="text-xs font-bold text-sky-400"
                            >{postureScore}/100</span
                        >
                    </div>
                    <div
                        class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden"
                    >
                        <div
                            class="h-full rounded-full bg-sky-400 transition-all duration-700"
                            style="width: {postureScore}%"
                        ></div>
                    </div>
                </div>

                <!-- Mini stats -->
                <div class="w-full grid grid-cols-3 gap-2">
                    <div
                        class="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p
                            class="text-base font-bold text-slate-800 dark:text-white"
                        >
                            {stats?.total_sessions ?? 0}
                        </p>
                        <p class="text-[10px] text-slate-400">
                            {$_("account.sessions")}
                        </p>
                    </div>
                    <div
                        class="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p
                            class="text-base font-bold text-slate-800 dark:text-white"
                        >
                            {exerciseCount}
                        </p>
                        <p class="text-[10px] text-slate-400">
                            {$_("account.exercises")}
                        </p>
                    </div>
                    <div
                        class="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    >
                        <p
                            class="text-base font-bold text-slate-800 dark:text-white"
                        >
                            {stats?.total_warnings ?? 0}
                        </p>
                        <p class="text-[10px] text-slate-400">
                            {$_("account.alerts")}
                        </p>
                    </div>
                </div>

                <div
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800"
                >
                    <Star class="w-3.5 h-3.5 text-sky-400" />
                    <span class="text-xs font-bold text-sky-500"
                        >{$_("account.premium")}</span
                    >
                </div>
            </div>

            <!-- Personal Information -->
            <div
                class="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6"
            >
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-2">
                        <div
                            class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                        >
                            <Shield class="w-4 h-4" />
                        </div>
                        <h2
                            class="font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("account.personal_info")}
                        </h2>
                    </div>
                    <button
                        onclick={() =>
                            editing ? cancelEdit() : (editing = true)}
                        aria-label={editing ? "Cancel editing" : "Edit profile"}
                        class="text-xs font-bold text-sky-400 hover:text-sky-500 transition-colors cursor-pointer"
                    >
                        {editing ? $_("common.cancel_edit") : $_("common.edit")}
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    <!-- Username -->
                    <div class="col-span-2">
                        <label
                            for="field-username"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            Username
                        </label>
                        <div class="relative">
                            <span
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none"
                                >@</span
                            >
                            <input
                                id="field-username"
                                type="text"
                                bind:value={username}
                                oninput={() => {
                                    usernameError = "";
                                }}
                                placeholder="johndoe92"
                                disabled={!editing}
                                class="w-full pl-7 pr-4 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border {usernameError
                                    ? 'border-red-400'
                                    : 'border-slate-200 dark:border-slate-700'}
                                    placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        </div>
                        {#if usernameError}
                            <p class="text-xs text-red-400 mt-1">
                                {usernameError}
                            </p>
                        {:else}
                            <p class="text-[10px] text-slate-400 mt-1">
                                3-20 characters · letters, numbers and _
                            </p>
                        {/if}
                    </div>

                    <!-- Full Name -->
                    <div>
                        <label
                            for="field-fullname"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            {$_("account.full_name")}
                        </label>
                        <input
                            id="field-fullname"
                            type="text"
                            bind:value={fullName}
                            placeholder="John Doe"
                            disabled={!editing}
                            class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                    </div>

                    <!-- Email (read-only) -->
                    <div>
                        <label
                            for="field-email"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            {$_("account.email")}
                        </label>
                        <input
                            id="field-email"
                            type="email"
                            value={email}
                            disabled
                            title="Email cannot be changed here"
                            class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                opacity-60 cursor-not-allowed"
                        />
                    </div>

                    <!-- Profession -->
                    <div>
                        <label
                            for="field-profession"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            {$_("account.profession")}
                        </label>
                        <input
                            id="field-profession"
                            type="text"
                            bind:value={profession}
                            placeholder="Engineer"
                            disabled={!editing}
                            class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                    </div>

                    <!-- Age -->
                    <div>
                        <label
                            for="field-age"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >
                            {$_("account.age")}
                        </label>
                        <input
                            id="field-age"
                            type="number"
                            bind:value={age}
                            placeholder="25"
                            disabled={!editing}
                            class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                                placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed
                                focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                        />
                    </div>
                </div>

                <div class="flex justify-end gap-3 items-center">
                    {#if saved}
                        <span
                            class="flex items-center gap-1.5 text-sm text-green-500 font-medium"
                        >
                            <Save class="w-4 h-4" />{$_("common.saved")}
                        </span>
                    {/if}
                    <button
                        onclick={cancelEdit}
                        aria-label="Cancel changes"
                        class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300
                            hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        {$_("common.cancel")}
                    </button>
                    <button
                        onclick={saveChanges}
                        aria-label="Save profile changes"
                        disabled={!editing || saving}
                        class="px-5 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-sky-500 text-white
                            hover:bg-slate-700 dark:hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
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
        </div>

        <!-- Security -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-4"
        >
            <div class="flex items-center gap-2 mb-5">
                <div
                    class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                >
                    <Shield class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("account.security")}
                </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                    href="/account/password"
                    aria-label="Change password"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800
                        border border-slate-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700
                        transition-all group cursor-pointer"
                >
                    <div
                        class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 shrink-0"
                    >
                        <Shield class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("account.password")}
                        </p>
                        <p class="text-xs text-slate-400">
                            {$_("account.password_sub")}
                        </p>
                    </div>
                    <ChevronRight
                        class="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors shrink-0"
                    />
                </a>

                <a
                    href="/account/notifications"
                    aria-label="Manage notifications"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800
                        border border-slate-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700
                        transition-all group cursor-pointer"
                >
                    <div
                        class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 shrink-0"
                    >
                        <Bell class="w-5 h-5" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p
                            class="text-sm font-semibold text-slate-800 dark:text-white"
                        >
                            {$_("account.notifications")}
                        </p>
                        <p class="text-xs text-slate-400">
                            {$_("account.notif_sub")}
                        </p>
                    </div>
                    <ChevronRight
                        class="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors shrink-0"
                    />
                </a>
            </div>
        </div>

        <!-- Danger Zone -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 shadow-sm p-6 flex items-center justify-between gap-4"
        >
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <AlertTriangle class="w-5 h-5 text-red-500" />
                    <h2 class="font-bold text-red-500">
                        {$_("account.danger_zone")}
                    </h2>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                    {$_("account.danger_desc")}
                </p>
            </div>
            <a
                href="/account/delete"
                aria-label="Delete account"
                class="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer
                    bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white
                    border border-red-500/30 hover:border-red-500 transition-all duration-200 active:scale-95"
            >
                {$_("account.delete_account")}
            </a>
        </div>
    {/if}
</div>
