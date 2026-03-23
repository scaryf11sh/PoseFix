<script>
    import {onMount} from 'svelte';
    import {page} from "$app/state";
    import {LayoutDashboard, Video, Dumbbell, FileDown, Settings2} from '@lucide/svelte';
    let darkMode = $state(false);

    $effect(() => {
        // Resaltar el enlace activo
        const currentPath = page.url.pathname;
        document.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('bg-alabaster-800', 'dark:bg-twilight-indigo-600');
                link.classList.remove('hover:bg-alabaster-800', 'dark:hover:bg-twilight-indigo-600');
            } else {
                link.classList.remove('bg-alabaster-800', 'dark:bg-twilight-indigo-600');
                link.classList.add('hover:bg-alabaster-800', 'dark:hover:bg-twilight-indigo-600');
            }
        });
    });
</script>

<aside class="h-screen p-6">
    <div class="h-full flex flex-col justify-between">
        <!-- Main Navigation -->
        <div class="rounded-full h-auto bg-twilight-indigo-50 dark:bg-rich-cerulean-900 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 dark:border dark:border-twilight-indigo-950 px-3 py-7 text-electric-green-600 font-medium flex flex-col justify-center items-center gap-4">
            <a
                    aria-label="Dashboard"
                    class="rounded-full p-3 hover:bg-alabaster-800 dark:hover:bg-twilight-indigo-600 ease-in-out transition cursor-pointer transform "
                    href="/"
                    id="nav-dashboard"
            >
                <LayoutDashboard />
            </a>

            <a
                    aria-label="Camera"
                    class="rounded-full p-3 hover:bg-alabaster-800 dark:hover:bg-twilight-indigo-600 ease-in-out transition cursor-pointer transform"
                    href="/camera"
                    id="nav-camera"
            >
                <Video />
            </a>

            <a
                    aria-label="Exercises"
                    class="rounded-full p-3 hover:bg-alabaster-800 dark:hover:bg-twilight-indigo-600 ease-in-out transition cursor-pointer transform"
                    href="/exercises"
                    id="nav-exercises"
            >
                <Dumbbell />
            </a>

            <a
                    aria-label="Export Data"
                    class="rounded-full p-3 hover:bg-alabaster-800 dark:hover:bg-twilight-indigo-600 ease-in-out transition cursor-pointer transform"
                    href="/export"
                    id="nav-export"
            >
                <FileDown />
            </a>
        </div>

        <!-- Settings -->
        <div class="rounded-full h-auto bg-twilight-indigo-50 dark:bg-rich-cerulean-900 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 dark:border dark:border-twilight-indigo-950 px-3 py-7 text-electric-green-600 font-medium flex flex-col justify-center items-center gap-4">
            <a
                    aria-label="Settings"
                    class="rounded-full p-3 hover:bg-alabaster-800 dark:hover:bg-twilight-indigo-600 ease-in-out transition cursor-pointer transform"
                    href="/settings"
                    id="nav-settings"
            >
                <Settings2 />
            </a>
            <div id="user-icon" class="rounded-full outline outline-carbon-950 p-[1px]">
                <div class="rounded-full bg-Tuscan-400 ">
                    <img src="/profile-img.jpg" alt="User Profile Picture" class="rounded-full size-10 object-fill">
                </div>
            </div>
        </div>
    </div>
</aside>
