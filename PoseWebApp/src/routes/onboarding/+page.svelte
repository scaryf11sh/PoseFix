<script lang="ts">
    import { theme, type ThemeMode } from "$lib/stores/theme";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";

    // --- Step ---
    let step = $state(1);
    const totalSteps = 3;

    // --- Step 1: Profile ---
    let username = $state("");
    let fullName = $state("");
    let email = $state("");
    let profession = $state("");
    const professions = [
        "Software Engineer",
        "Software Architect",
        "Designer",
        "Product Manager",
        "Data Scientist",
        "DevOps Engineer",
        "Student",
        "Other",
    ];

    // --- Step 2: Hardware ---
    const cameras = [
        "FaceTime HD Camera (Built-in)",
        "External USB WebCam (Logitech C920)",
        "No camera",
    ];
    let selectedCamera = $state(cameras[0]);
    let showCameraMenu = $state(false);

    type SensorStatus = "Connected" | "Ready" | "Searching...";
    let sensors = $state([
        {
            id: 1,
            name: "L-Spine Tracker",
            sub: "BT Low Energy",
            status: "Connected" as SensorStatus,
            icon: "M12 2a7 7 0 0 1 5 11.9V17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3.1A7 7 0 0 1 12 2z",
            iconColor: "text-sky-400 bg-sky-400/10",
            enabled: true,
        },
        {
            id: 2,
            name: "Neck Pivot Pro",
            sub: "USB-C",
            status: "Ready" as SensorStatus,
            icon: "M12 2v20M2 12h20",
            iconColor: "text-purple-400 bg-purple-400/10",
            enabled: false,
        },
        {
            id: 3,
            name: "Glacier Band 2.0",
            sub: "BT Low Energy",
            status: "Connected" as SensorStatus,
            icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
            iconColor: "text-green-400 bg-green-400/10",
            enabled: true,
        },
    ]);

    // --- Step 3: Preferences ---
    let prefs = $state([
        {
            id: "posture",
            label: "Posture Alerts",
            sub: "Real-time correction notifications",
            icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
            enabled: true,
        },
        {
            id: "stretch",
            label: "Stretch Reminders",
            sub: "Hourly micro-break suggestions",
            icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
            enabled: true,
        },
        {
            id: "reports",
            label: "Weekly Reports",
            sub: "Detailed summary of your progress",
            icon: "M22 12h-4l-3 9L9 3l-3 9H2",
            enabled: true,
        },
    ]);

    let selectedTheme = $state<ThemeMode>($theme ?? "dark");

    function applyThemePreview(t: ThemeMode) {
        selectedTheme = t;
        theme.set(t);
    }

    // --- Validation ---
    let canNext = $derived(
        step === 1
            ? fullName.trim() !== "" &&
                  username.trim() !== "" &&
                  profession !== ""
            : step === 2
              ? true
              : true,
    );

    function next() {
        if (step < totalSteps) step++;
        else goto("/dashboard");
    }

    function back() {
        if (step > 1) step--;
    }

    const stepLabels = [
        "Establishing your basic identity",
        "Connecting your hardware devices",
        "Setting up your preferences",
    ];
</script>

<!-- Full screen backdrop -->
<div
    class="min-h-screen w-full flex flex-col items-center justify-center
    bg-slate-50 dark:bg-slate-950 relative overflow-hidden px-4 py-8"
>
    <!-- Background glow -->
    <div
        class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-150 h-100 rounded-full
        bg-sky-400/5 dark:bg-sky-400/10
        blur-[120px] pointer-events-none"
    ></div>

    <!-- Logo -->
    <div class="absolute top-5 left-6 flex items-center gap-2">
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
        <span class="text-base font-bold text-slate-800 dark:text-white"
            >Glacier</span
        >
    </div>

    <!-- Card -->
    <div
        class="w-full max-w-md relative z-10
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40
        overflow-hidden"
    >
        <!-- Progress bar -->
        <div class="h-1 bg-slate-100 dark:bg-slate-800">
            <div
                class="h-full bg-sky-400 transition-all duration-500 ease-out"
                style="width: {(step / totalSteps) * 100}%"
            ></div>
        </div>

        <div class="p-7">
            <!-- Step indicator dots -->
            <div class="flex items-center gap-1.5 mb-5">
                {#each Array.from({ length: totalSteps }) as _, i}
                    <div
                        class="h-1.5 rounded-full transition-all duration-300
                        {i + 1 === step
                            ? 'w-6 bg-sky-400'
                            : i + 1 < step
                              ? 'w-4 bg-sky-400/50'
                              : 'w-4 bg-slate-200 dark:bg-slate-700'}"
                    ></div>
                {/each}
                <span
                    class="ml-auto text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                    Step {step} of {totalSteps}
                </span>
            </div>

            <!-- ===================== STEP 1 ===================== -->
            {#if step === 1}
                <div class="flex flex-col items-center text-center mb-6">
                    <div
                        class="w-14 h-14 rounded-2xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-7 h-7 text-sky-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                        >
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                            />
                        </svg>
                    </div>
                    <h1
                        class="text-2xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                        Welcome to Glacier
                    </h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Let's set up your profile to optimize your workspace
                        posture.
                    </p>
                </div>

                <!-- Info pre-llenada -->
                {#if email}
                    <div
                        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 mb-4"
                    >
                        <div
                            class="w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center text-white text-xs font-bold shrink-0"
                        >
                            {fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "?"}
                        </div>
                        <div>
                            <p
                                class="text-sm font-semibold text-slate-800 dark:text-white"
                            >
                                {fullName}
                            </p>
                            <p class="text-xs text-slate-400">{email}</p>
                        </div>
                    </div>
                {/if}

                <div class="space-y-4">
                    <!-- Username -->
                    <div>
                        <label
                            for="username_input"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >{$_("onboarding.username")}</label
                        >
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
                                id="username_input"
                                type="text"
                                bind:value={username}
                                placeholder="e.g. johndoe92"
                                class="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    text-slate-800 dark:text-white placeholder:text-slate-400
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        </div>
                        <p class="text-[10px] text-slate-400 mt-1">
                            {$_("onboarding.username_hint")}
                        </p>
                    </div>

                    <!-- Full name -->
                    <div>
                        <label
                            for="ob_full_name_input"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            >{$_("auth.full_name")}</label
                        >
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
                                id="ob_full_name_input"
                                type="text"
                                bind:value={fullName}
                                placeholder="John Doe"
                                class="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    text-slate-800 dark:text-white placeholder:text-slate-400
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                            for="ob_profession_input"
                        >
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
                                        x="2"
                                        y="7"
                                        width="20"
                                        height="14"
                                        rx="2"
                                    /><path
                                        d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
                                    />
                                </svg>
                                <select
                                    id="ob_profession_input"
                                    bind:value={profession}
                                    class="w-full appearance-none pl-10 pr-8 py-3 rounded-xl text-sm
                                    bg-slate-50 dark:bg-slate-800
                                    border border-slate-200 dark:border-slate-700
                                    text-slate-800 dark:text-white
                                    focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 transition-all
                                    {profession === '' ? 'text-slate-400' : ''}"
                                >
                                    <option value="" disabled selected
                                        >Select your field</option
                                    >
                                    {#each professions as p}
                                        <option value={p}>{p}</option>
                                    {/each}
                                </select>
                                <svg
                                    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- ===================== STEP 2 ===================== -->
            {:else if step === 2}
                <div class="mb-6">
                    <h1
                        class="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                    >
                        Connect Your Hardware
                    </h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Glacier syncs with your devices to monitor posture in
                        real-time.
                    </p>
                </div>

                <!-- Primary Camera -->
                <div class="mb-5">
                    <label
                        for="ob_camera_input"
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2"
                        >Primary Camera</label
                    >
                    <div class="relative">
                        <button
                            onclick={() => (showCameraMenu = !showCameraMenu)}
                            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left
                                bg-slate-50 dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700
                                text-slate-800 dark:text-white
                                hover:border-sky-400 transition-all"
                        >
                            {selectedCamera}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4 text-slate-400 transition-transform {showCameraMenu
                                    ? 'rotate-180'
                                    : ''}"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        {#if showCameraMenu}
                            <div
                                class="absolute top-full mt-1 left-0 right-0 z-10 rounded-xl shadow-lg
                                bg-white dark:bg-slate-800
                                border border-slate-100 dark:border-slate-700 overflow-hidden"
                            >
                                {#each cameras as cam}
                                    <button
                                        onclick={() => {
                                            selectedCamera = cam;
                                            showCameraMenu = false;
                                        }}
                                        class="w-full text-left px-4 py-2.5 text-sm transition-colors
                                            {selectedCamera === cam
                                            ? 'text-sky-400 font-semibold bg-sky-50 dark:bg-sky-900/20'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'}"
                                    >
                                        {cam}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Active Sensors -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label
                            for="ob_sensors_input"
                            class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                            >Active Sensors</label
                        >
                        <span
                            class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400"
                        >
                            <span
                                class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"
                            ></span>
                            Scanning
                        </span>
                    </div>
                    <div class="space-y-2">
                        {#each sensors as s}
                            <div
                                class="flex items-center gap-3 px-3 py-3 rounded-xl
                                bg-slate-50 dark:bg-slate-800
                                border border-slate-100 dark:border-slate-700"
                            >
                                <div
                                    class="w-9 h-9 rounded-xl {s.iconColor} flex items-center justify-center shrink-0"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path d={s.icon} />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p
                                        class="text-sm font-semibold text-slate-800 dark:text-white"
                                    >
                                        {s.name}
                                    </p>
                                    <p class="text-xs text-slate-400">
                                        {s.sub} • {s.status}
                                    </p>
                                </div>
                                <button
                                    aria-label=""
                                    onclick={() => (s.enabled = !s.enabled)}
                                    class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
                                        {s.enabled
                                        ? 'bg-sky-400'
                                        : 'bg-slate-200 dark:bg-slate-600'}"
                                >
                                    <span
                                        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                        {s.enabled
                                            ? 'translate-x-5'
                                            : 'translate-x-0'}"
                                    >
                                    </span>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- ===================== STEP 3 ===================== -->
            {:else}
                <div class="mb-6">
                    <h1
                        class="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                    >
                        Your Preferences
                    </h1>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        Customize how Glacier works for you.
                    </p>
                </div>

                <!-- Notification prefs -->
                <div class="space-y-2 mb-6">
                    {#each prefs as p}
                        <div
                            class="flex items-center gap-3 px-3 py-3 rounded-xl
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-100 dark:border-slate-700"
                        >
                            <div
                                class="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0 text-sky-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path d={p.icon} />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-semibold text-slate-800 dark:text-white"
                                >
                                    {p.label}
                                </p>
                                <p class="text-xs text-slate-400">{p.sub}</p>
                            </div>
                            <button
                                onclick={() => (p.enabled = !p.enabled)}
                                class="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0
                                    {p.enabled
                                    ? 'bg-sky-400'
                                    : 'bg-slate-200 dark:bg-slate-600'}"
                            >
                                <span
                                    class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                    {p.enabled
                                        ? 'translate-x-5'
                                        : 'translate-x-0'}"
                                >
                                </span>
                            </button>
                        </div>
                    {/each}
                </div>

                <!-- Interface Appearance -->
                <div>
                    <label
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3"
                        >Interface Appearance</label
                    >
                    <div class="grid grid-cols-3 gap-2">
                        {#each [{ val: "light", label: "Light", bg: "bg-slate-100", inner: "bg-white border border-slate-200" }, { val: "dark", label: "Dark", bg: "bg-slate-900", inner: "bg-slate-800 border border-slate-700" }, { val: "system", label: "System", bg: "bg-gradient-to-br from-slate-100 to-slate-800", inner: "bg-gradient-to-br from-white to-slate-700" }] as opt}
                            <button
                                onclick={() =>
                                    applyThemePreview(opt.val as ThemeMode)}
                                class="relative rounded-xl overflow-hidden border-2 transition-all duration-200
                                    {selectedTheme === opt.val
                                    ? 'border-sky-400 shadow-lg shadow-sky-400/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}"
                            >
                                <!-- Preview mockup -->
                                <div
                                    class="h-20 {opt.bg} p-2 flex flex-col gap-1"
                                >
                                    <div
                                        class="h-1.5 w-1/2 rounded-full {opt.inner} opacity-60"
                                    ></div>
                                    <div
                                        class="flex-1 rounded-lg {opt.inner}"
                                    ></div>
                                </div>
                                {#if selectedTheme === opt.val}
                                    <div
                                        class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-3 h-3 text-white"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="3"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                {/if}
                                <p
                                    class="text-center text-xs py-1.5 font-medium
                                    {selectedTheme === opt.val
                                        ? 'text-sky-400'
                                        : 'text-slate-500 dark:text-slate-400'}
                                    bg-white dark:bg-slate-900"
                                >
                                    {opt.label}
                                </p>
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Actions -->
            <div class="mt-7 flex flex-col gap-3">
                <div class="flex gap-3">
                    {#if step > 1}
                        <button
                            onclick={back}
                            class="flex-1 py-3 rounded-xl text-sm font-medium
                                bg-slate-100 dark:bg-slate-800
                                border border-slate-200 dark:border-slate-700
                                text-slate-700 dark:text-slate-200
                                hover:bg-slate-200 dark:hover:bg-slate-700
                                transition-all active:scale-95"
                        >
                            Back
                        </button>
                    {/if}
                    <button
                        onclick={next}
                        disabled={!canNext}
                        class="flex-1 py-3 rounded-xl text-sm font-bold
                            {step === totalSteps
                            ? 'bg-sky-400 hover:bg-sky-500 text-white shadow-lg shadow-sky-400/30'
                            : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white'}
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {#if step === totalSteps}
                            Get Started
                        {:else}
                            Next
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        {/if}
                    </button>
                </div>

                <!-- Step hint / skip -->
                <div class="text-center">
                    {#if step === totalSteps}
                        <button
                            onclick={() => goto("/dashboard")}
                            class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            Configure later in settings
                        </button>
                    {:else}
                        <p class="text-xs text-slate-400">
                            {stepLabels[step - 1]}
                        </p>
                    {/if}
                </div>
            </div>

            <!-- Security note (step 2 only) -->
            {#if step === 2}
                <div class="flex items-center justify-center gap-1.5 mt-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 text-slate-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <p class="text-[10px] text-slate-400">
                        End-to-end encrypted hardware pairing
                    </p>
                </div>
            {/if}
        </div>
    </div>
</div>
