<script lang="ts">
    // --- Profile ---
    let name = $state("Marcus Chen");
    let email = $state("marcus.chen@example.com");
    let profession = $state("Software Architect");
    let age = $state("34");
    let editing = $state(false);
    let saved = $state(false);

    function saveChanges() {
        editing = false;
        saved = true;
        setTimeout(() => (saved = false), 2500);
    }

    // --- Security items ---
    const security = [
        {
            icon: "M15 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 20v-1a7 7 0 0 1 14 0v1",
            label: "Password",
            sub: "Updated 3 months ago",
            accent: "",
        },
        {
            icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
            label: "Two-Factor Auth",
            sub: "Enabled",
            accent: "text-green-400",
        },
        {
            icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
            label: "Notifications",
            sub: "Push and Email",
            accent: "",
        },
    ];

    let postureScore = 88;
</script>

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        Account Settings
    </h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Manage your profile information and account security.
    </p>

    <!-- Top row -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <!-- Profile card -->
        <div
            class="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center gap-4"
        >
            <!-- Avatar -->
            <div class="relative">
                <div
                    class="w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-sky-400/20"
                >
                    {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </div>
                <button
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
                <h2 class="text-lg font-bold text-slate-800 dark:text-white">
                    {name}
                </h2>
                <p class="text-sm text-slate-400">{profession}</p>
            </div>

            <!-- Posture Score -->
            <div class="w-full px-2">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs text-slate-400">Posture Score</span>
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

            <!-- Plan badge -->
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
                    >Premium Member</span
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
                    <h2 class="font-semibold text-slate-800 dark:text-white">
                        Personal Information
                    </h2>
                </div>
                <button
                    onclick={() => (editing = !editing)}
                    class="text-xs font-bold text-sky-400 hover:text-sky-500 transition-colors"
                >
                    {editing ? "Cancel Edit" : "Edit All"}
                </button>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
                {#each [{ label: "Full Name", bind: "name", placeholder: "Marcus Chen", type: "text" }, { label: "Email Address", bind: "email", placeholder: "marcus.chen@example.com", type: "email" }, { label: "Profession", bind: "profession", placeholder: "Software Architect", type: "text" }, { label: "Age", bind: "age", placeholder: "34", type: "number" }] as field}
                    <div>
                        <label
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >{field.label}</label
                        >
                        {#if field.bind === "name"}
                            <input
                                type={field.type}
                                bind:value={name}
                                placeholder={field.placeholder}
                                disabled={!editing}
                                class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    placeholder:text-slate-400
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        {:else if field.bind === "email"}
                            <input
                                type={field.type}
                                bind:value={email}
                                placeholder={field.placeholder}
                                disabled={!editing}
                                class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    placeholder:text-slate-400
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        {:else if field.bind === "profession"}
                            <input
                                type={field.type}
                                bind:value={profession}
                                placeholder={field.placeholder}
                                disabled={!editing}
                                class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    placeholder:text-slate-400
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        {:else}
                            <input
                                type={field.type}
                                bind:value={age}
                                placeholder={field.placeholder}
                                disabled={!editing}
                                class="w-full px-3 py-2.5 rounded-xl text-sm text-slate-800 dark:text-white
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    placeholder:text-slate-400
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="flex justify-end gap-3">
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
                        Saved!
                    </span>
                {/if}
                <button
                    onclick={() => (editing = false)}
                    class="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onclick={saveChanges}
                    disabled={!editing}
                    class="px-5 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-sky-500 text-white
                        hover:bg-slate-700 dark:hover:bg-sky-400
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all shadow-sm active:scale-95"
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>

    <!-- Security & Preferences -->
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
                Security & Preferences
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            {#each security as item}
                <button
                    class="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-slate-50 dark:bg-slate-800
                    border border-slate-100 dark:border-slate-700
                    hover:border-sky-300 dark:hover:border-sky-700
                    text-left transition-all group"
                >
                    <div
                        class="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 flex-shrink-0"
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
                        <p class="text-xs {item.accent || 'text-slate-400'}">
                            {item.sub}
                        </p>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 text-slate-300 group-hover:text-sky-400 transition-colors flex-shrink-0"
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
                <h2 class="font-bold text-red-500">Danger Zone</h2>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Once you delete your account, there is no going back. Please be
                certain.
            </p>
        </div>
        <button
            class="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold
            bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white
            border border-red-500/30 hover:border-red-500
            transition-all duration-200 active:scale-95"
        >
            Delete My Account
        </button>
    </div>
</div>
