<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import { open } from "@tauri-apps/plugin-dialog";
    import { copyFile } from "@tauri-apps/plugin-fs";
    import { appDataDir, join } from "@tauri-apps/api/path";
    import { convertFileSrc } from "@tauri-apps/api/core";
    import {
        getUser,
        updateUser,
        updateAvatar,
        getSessionStats,
        getExerciseCount,
        type User,
        type SessionStats,
    } from "$lib/db";
    import { getCurrentUser } from "$lib/auth";

    // --- State ---
    let user = $state<User | null>(null);
    let stats = $state<SessionStats | null>(null);
    let exerciseCount = $state(0);
    let loading = $state(true);
    let editing = $state(false);
    let saving = $state(false);
    let saved = $state(false);
    let avatarUrl = $state<string | null>(null);

    // Form fields
    let name = $state("");
    let email = $state("");
    let profession = $state("");
    let age = $state("");

    onMount(async () => {
        // --- Session guard ---
        const current = await getCurrentUser();
        if (!current) {
            goto("/auth");
            return;
        }

        loading = true;
        try {
            user = current;
            name = user.username;
            email = user.email;
            profession = user.profession ?? "";
            age = user.age?.toString() ?? "";
            stats = await getSessionStats(user.id);
            exerciseCount = await getExerciseCount(user.id);
            if (user.avatar_path) {
                avatarUrl = convertFileSrc(user.avatar_path);
            }
        } finally {
            loading = false;
        }
    });

    async function saveChanges() {
        if (!user) return;
        saving = true;
        try {
            await updateUser(user.id, {
                username: name,
                email,
                profession: profession || undefined,
                age: age ? parseInt(age) : undefined,
            });
            user = {
                ...user,
                username: name,
                email,
                profession,
                age: age ? parseInt(age) : undefined,
            };
            editing = false;
            saved = true;
            setTimeout(() => (saved = false), 2500);
        } finally {
            saving = false;
        }
    }

    async function pickAvatar() {
        if (!user) return;
        const selected = await open({
            filters: [
                { name: "Image", extensions: ["png", "jpg", "jpeg", "webp"] },
            ],
        });
        if (!selected || typeof selected !== "string") return;
        const dir = await appDataDir();
        const dest = await join(dir, "avatar.png");
        await copyFile(selected, dest);
        await updateAvatar(user.id, dest);
        avatarUrl = convertFileSrc(dest) + "?t=" + Date.now();
        user = { ...user, avatar_path: dest };
    }

    function cancelEdit() {
        if (!user) return;
        name = user.username;
        email = user.email;
        profession = user.profession ?? "";
        age = user.age?.toString() ?? "";
        editing = false;
    }

    let initials = $derived(
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
    );
    let postureScore = $derived(Math.round(stats?.avg_score ?? 0));
</script>

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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
                    cx="12"
                    cy="7"
                    r="4"
                />
            </svg>
            <p class="text-sm">{$_("account.no_user")}</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            <!-- Profile card -->
            <div
                class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center gap-4"
            >
                <div class="relative">
                    {#if avatarUrl}
                        <img
                            src={avatarUrl}
                            alt={name}
                            class="w-24 h-24 rounded-full object-cover shadow-lg"
                        />
                    {:else}
                        <div
                            class="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-400/20"
                        >
                            {initials}
                        </div>
                    {/if}
                    <button
                        onclick={pickAvatar}
                        aria-label="Change avatar"
                        class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-sky-400 hover:bg-sky-500 flex items-center justify-center shadow-lg transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                            />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                </div>

                <div class="text-center">
                    <h2
                        class="text-lg font-bold text-slate-800 dark:text-white"
                    >
                        {name}
                    </h2>
                    <p class="text-sm text-slate-400">{profession || "—"}</p>
                </div>

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

                <div class="w-full grid grid-cols-3 gap-2">
                    {#each [{ label: $_("account.sessions"), value: stats?.total_sessions ?? 0 }, { label: $_("account.exercises"), value: exerciseCount }, { label: $_("account.alerts"), value: stats?.total_warnings ?? 0 }] as s}
                        <div
                            class="flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                        >
                            <p
                                class="text-base font-bold text-slate-800 dark:text-white"
                            >
                                {s.value}
                            </p>
                            <p class="text-[10px] text-slate-400">{s.label}</p>
                        </div>
                    {/each}
                </div>

                <div
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5 text-sky-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                        />
                    </svg>
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                /><circle cx="12" cy="7" r="4" />
                            </svg>
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
                        class="text-xs font-bold text-sky-400 hover:text-sky-500 transition-colors"
                    >
                        {editing ? $_("common.cancel_edit") : $_("common.edit")}
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-6">
                    {#each [{ label: $_("account.full_name"), value: name, setter: (v: string) => (name = v), type: "text", placeholder: "John Doe" }, { label: $_("account.email"), value: email, setter: (v: string) => (email = v), type: "email", placeholder: "john@example.com" }, { label: $_("account.profession"), value: profession, setter: (v: string) => (profession = v), type: "text", placeholder: "Engineer" }, { label: $_("account.age"), value: age, setter: (v: string) => (age = v), type: "number", placeholder: "25" }] as field}
                        <div>
                            <label
                                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                                >{field.label}</label
                            >
                            <input
                                type={field.type}
                                value={field.value}
                                oninput={(e) =>
                                    field.setter(
                                        (e.target as HTMLInputElement).value,
                                    )}
                                placeholder={field.placeholder}
                                disabled={!editing}
                                class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    placeholder:text-slate-400
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        </div>
                    {/each}
                </div>

                <div class="flex justify-end gap-3 items-center">
                    {#if saved}
                        <span
                            class="flex items-center gap-1.5 text-sm text-green-500 font-medium"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {$_("common.saved")}
                        </span>
                    {/if}
                    <button
                        onclick={cancelEdit}
                        class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {$_("common.cancel")}
                    </button>
                    <button
                        onclick={saveChanges}
                        disabled={!editing || saving}
                        class="px-5 py-2 rounded-xl text-sm font-bold
                            bg-slate-900 dark:bg-sky-500 text-white
                            hover:bg-slate-700 dark:hover:bg-sky-400
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        {#if saving}
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("account.security")}
                </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                {#each [{ icon: "M15 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 20v-1a7 7 0 0 1 14 0v1", label: $_("account.password"), sub: $_("account.password_sub"), accent: "" }, { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: $_("account.two_factor"), sub: $_("account.two_factor_sub"), accent: "text-green-400" }, { icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0", label: $_("account.notifications"), sub: $_("account.notif_sub"), accent: "" }] as item}
                    <button
                        class="flex items-center gap-3 px-4 py-3 rounded-xl
                        bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700
                        hover:border-sky-300 dark:hover:border-sky-700 text-left transition-all group"
                    >
                        <div
                            class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 shrink-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path d={item.icon} />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p
                                class="text-sm font-semibold text-slate-800 dark:text-white"
                            >
                                {item.label}
                            </p>
                            <p
                                class="text-xs {item.accent ||
                                    'text-slate-400'}"
                            >
                                {item.sub}
                            </p>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Danger Zone -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 shadow-sm p-6 flex items-center justify-between gap-4"
        >
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-red-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                        />
                        <line x1="12" y1="9" x2="12" y2="13" /><line
                            x1="12"
                            y1="17"
                            x2="12.01"
                            y2="17"
                        />
                    </svg>
                    <h2 class="font-bold text-red-500">
                        {$_("account.danger_zone")}
                    </h2>
                </div>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                    {$_("account.danger_desc")}
                </p>
            </div>
            <button
                class="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold
                bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white
                border border-red-500/30 hover:border-red-500
                transition-all duration-200 active:scale-95"
            >
                {$_("account.delete_account")}
            </button>
        </div>
    {/if}
</div>
