<script>
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import {
        LayoutDashboard,
        Video,
        Dumbbell,
        FileDown,
        Settings2,
        ClipboardClock,
        LogOut,
    } from "@lucide/svelte";

    function handleLogout() {
        goto("/");
    }
    let darkMode = $state(false);

    $effect(() => {
        // Resaltar el enlace activo
        const currentPath = page.url.pathname;
        document.querySelectorAll("a").forEach((link) => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add(
                    "outline",
                    "dark:outline-frozen-lake-800",
                    "outline-frozen-lake-400/60",
                    "bg-frozen-lake-400/15",
                    "dark:text-frozen-lake-200",
                    "text-deep-twilight-900",
                );
                link.classList.remove(
                    "hover:bg-gray-200/50",
                    "dark:hover:bg-gray-800/50",
                    "dark:text-frozen-lake-200/50",
                    "text-deep-twilight-900/50",
                );
            } else {
                link.classList.remove(
                    "outline",
                    "dark:outline-frozen-lake-800",
                    "outline-frozen-lake-400/60",
                    "bg-frozen-lake-400/15",
                    "dark:text-frozen-lake-200",
                    "text-deep-twilight-900",
                );
                link.classList.add(
                    "hover:bg-gray-200/50",
                    "dark:hover:bg-gray-800/50",
                    "dark:text-frozen-lake-200/50",
                    "text-deep-twilight-900/50",
                );
            }
        });
    });
</script>

<aside
    class="h-screen hidden md:flex p-4 w-64 dark:bg-slate-950/75 border-r backdrop-blur-3xl border-sky-400/10 shadow-2xl z-40"
>
    <div class="h-full flex flex-col justify-between w-full">
        <!-- Main Navigation -->
        <div>
            <div class="flex flex-row items-center gap-x-1 mb-8">
                <div>
                    <img src="/icon.png" alt="Logo" class="w-12 h-12" />
                </div>
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
            <div class="flex flex-col gap-2">
                <a
                    aria-label="Dashboard"
                    href="/"
                    id="nav-dashboard"
                    class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 *:cursor-pointer"
                >
                    <LayoutDashboard />
                    <label class="flex-1">Dashboard</label>
                </a>

                <a
                    aria-label="Camera"
                    href="/camera"
                    id="nav-camera"
                    class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 *:cursor-pointer"
                >
                    <Video />
                    <label class="flex-1">Monitor</label>
                </a>

                <a
                    aria-label="Exercises"
                    href="/exercises"
                    id="nav-exercises"
                    class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 *:cursor-pointer"
                >
                    <Dumbbell />
                    <label class="flex-1">Exercises</label>
                </a>

                <a
                    aria-label="Progress"
                    href="/progress"
                    id="nav-progress"
                    class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 *:cursor-pointer"
                >
                    <ClipboardClock />
                    <label class="flex-1">Progress</label>
                </a>

                <a
                    aria-label="Export Data"
                    href="/export"
                    id="nav-export"
                    class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 *:cursor-pointer"
                >
                    <FileDown />
                    <label class="flex-1">Export</label>
                </a>
            </div>
        </div>

        <!-- Settings -->
        <div
            class="flex flex-col *:flex *:flex-row gap-2 *:gap-2 *:rounded-full *:py-3 *:px-5 *:duration-200 *:items-center *:hover:translate-x-3 *:transition-all"
        >
            <a
                aria-label="Settings"
                href="/settings"
                id="nav-settings"
                class="*:cursor-pointer"
            >
                <Settings2 />
                <label>Settings</label>
            </a>
            <a
                aria-label="Account"
                href="/account"
                id="nav-account"
                class="*:cursor-pointer"
            >
                <div class="p-[1.5px] rounded-full bg-jade-green-400 shrink-0">
                    <div class="p-[1px] rounded-full dark:bg-slate-950/75">
                        <div class="rounded-full size-7 overflow-hidden">
                            <img
                                src="/profile-img.jpg"
                                alt="User Profile Picture"
                            />
                        </div>
                    </div>
                </div>
                <label>Account</label>
            </a>
            <button
                aria-label="Logout"
                id="nav-logout"
                onclick={handleLogout}
                class="flex flex-row items-center gap-2 rounded-full py-3 px-5 w-full hover:translate-x-3 transition-all duration-200 cursor-pointer text-red-500 dark:text-red-400 hover:bg-red-500/10"
            >
                <LogOut />
                <label class="cursor-pointer">Logout</label>
            </button>
        </div>
    </div>
</aside>
