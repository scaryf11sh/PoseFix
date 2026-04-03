<script lang="ts">
    interface Props {
        title: string;
        duration: string;
        tags: string[];
        image: string;
        recommended?: boolean;
        recommendedLabel?: string;
        onStart?: () => void;
    }

    let {
        title,
        duration,
        tags,
        image,
        recommended = false,
        recommendedLabel = "",
        onStart = () => {},
    }: Props = $props();
</script>

<div
    class="group relative rounded-2xl overflow-hidden cursor-pointer
    bg-white dark:bg-slate-900
    border border-slate-100 dark:border-slate-800
    shadow-sm hover:shadow-xl dark:hover:shadow-black/40
    transition-all duration-300 hover:-translate-y-1 max-w-sm flex flex-col justify-between"
>
    <!-- Image -->
    <div class="relative h-52 overflow-hidden">
        <img
            src={image}
            alt={title}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Duration badge -->
        <div
            class="absolute top-3 left-3 flex items-center gap-1.5
            bg-black/40 dark:bg-black/60 backdrop-blur-md
            text-white text-xs font-medium
            px-2.5 py-1 rounded-full border border-white/10"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5 text-sky-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            {duration}
        </div>

        <!-- Recommended badge -->
        {#if recommended}
            <div
                class="absolute top-3 right-3 flex items-center gap-2
                bg-black/50 backdrop-blur-md
                text-white text-xs px-2.5 py-1.5 rounded-full
                border border-white/10"
            >
                <div
                    class="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3 h-3 text-black"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <div>
                    <p
                        class="text-[9px] text-slate-400 uppercase tracking-wider leading-none mb-0.5"
                    >
                        Next recommended
                    </p>
                    <p class="font-medium leading-none">{recommendedLabel}</p>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </div>
        {/if}
    </div>

    <!-- Glass info panel — overlaps image slightly -->
    <div
        class="relative -mt-4 mx-2 mb-2 rounded-xl
        bg-white/80 dark:bg-slate-800/80
        backdrop-blur-xl
        border border-white/60 dark:border-slate-700/60
        shadow-lg dark:shadow-black/30
        px-4 pt-3 pb-4"
    >
        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 mb-2">
            {#each tags as tag}
                <span
                    class="text-[10px] font-bold tracking-wider uppercase
                    px-2 py-0.5 rounded-full
                    bg-slate-100 dark:bg-slate-700
                    text-slate-600 dark:text-slate-300
                    border border-slate-200 dark:border-slate-600"
                >
                    {tag}
                </span>
            {/each}
        </div>

        <!-- Title -->
        <h3
            class="text-base font-bold text-slate-800 dark:text-white mb-3 leading-tight"
        >
            {title}
        </h3>

        <!-- Start button -->
        <button
            onclick={onStart}
            class="w-full py-2.5 rounded-xl
                bg-green-400 hover:bg-green-500
                text-black font-bold text-sm
                flex items-center justify-center gap-2
                transition-all duration-200
                shadow-lg shadow-green-400/30 hover:shadow-green-400/50
                active:scale-95"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Exercise
        </button>
    </div>
</div>
