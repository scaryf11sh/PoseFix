<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { locale } from 'svelte-i18n';
    import { Video } from '@lucide/svelte';
    import { TAG_TO_FILTER_AREA } from '$lib/i18n/yoga-es';

    // ── Authenticated image cache (module-level, persists across renders) ────────
    const EDB_IMAGE_HOST = 'exercisedb.p.rapidapi.com';
    const EDB_HEADERS = {
        'x-rapidapi-key':  '41971f9f1emshc411ec3d031b22dp175bbfjsn803eeed97cc5',
        'x-rapidapi-host': EDB_IMAGE_HOST,
    };
    const _blobCache = new Map<string, string>();
    const _pending   = new Map<string, Promise<string>>();

    function fetchAuthImage(url: string): Promise<string> {
        if (_blobCache.has(url)) return Promise.resolve(_blobCache.get(url)!);
        if (_pending.has(url))   return _pending.get(url)!;

        const p = fetch(url, { headers: EDB_HEADERS, signal: AbortSignal.timeout(12000) })
            .then(r => {
                if (!r.ok) throw new Error(`${r.status}`);
                return r.blob();
            })
            .then(b => {
                const objUrl = URL.createObjectURL(b);
                _blobCache.set(url, objUrl);
                _pending.delete(url);
                return objUrl;
            })
            .catch(() => {
                _pending.delete(url);
                return '';   // caller will use fallback
            });

        _pending.set(url, p);
        return p;
    }

    interface Props {
        title: string;
        titleEs?: string;
        duration: string;
        tags: string[];        // English keys
        tagsEs?: string[];     // Spanish display labels (same order as tags)
        image?: string;
        recommended?: boolean;
        recommendedLabel?: string;
        hasVideo?: boolean;
        difficulty?: 'beginner' | 'intermediate' | 'advanced';
        source?: 'local' | 'exercisedb' | 'lunatic' | 'yoga-nzy4';
        onStart?: () => void;
        onTagClick?: (tag: string) => void;   // raw English key — parent resolves area/category
    }

    let {
        title,
        titleEs,
        duration,
        tags,
        tagsEs,
        image,
        recommended = false,
        recommendedLabel = '',
        hasVideo = false,
        difficulty,
        onStart = () => {},
        onTagClick,
    }: Props = $props();

    const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&auto=format';
    let imgSrc    = $state('');
    let imgLoaded = $state(false);

    $effect(() => {
        const src = image ?? '';
        imgLoaded = false;

        if (src.includes(EDB_IMAGE_HOST)) {
            // Serve from cache immediately if available
            if (_blobCache.has(src)) {
                imgSrc = _blobCache.get(src)!;
                return;
            }
            imgSrc = ''; // show skeleton while loading
            fetchAuthImage(src).then(blobUrl => {
                imgSrc = blobUrl || FALLBACK_IMG;
            });
        } else {
            imgSrc = src || FALLBACK_IMG;
        }
    });

    function handleImgError() {
        if (imgSrc !== FALLBACK_IMG) imgSrc = FALLBACK_IMG;
    }

    function handleImgLoad() {
        imgLoaded = true;
    }

    const isEs = $derived($locale?.startsWith('es') ?? false);
    const displayTitle = $derived(isEs && titleEs ? titleEs : title);

    function getDisplayTag(i: number): string {
        if (isEs && tagsEs?.[i]) return tagsEs[i];
        return tags[i] ?? '';
    }

    const DIFF_COLOURS: Record<string, string> = {
        beginner:     'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
        intermediate: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
        advanced:     'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    };

    function handleTagClick(tag: string) {
        onTagClick?.(tag);   // pass raw English key; parent decides what filter to activate
    }
</script>

<div
    class="group relative rounded-2xl overflow-hidden cursor-pointer
    bg-white dark:bg-slate-900
    border border-slate-100 dark:border-slate-800
    shadow-sm hover:shadow-xl dark:hover:shadow-black/40
    transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
>
    <!-- Image — no bottom badges here to avoid overlap bug -->
    <div class="relative h-44 overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
        {#if imgSrc}
            <!-- skeleton shown behind until image loads -->
            {#if !imgLoaded}
                <div class="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700"></div>
            {/if}
            <img
                src={imgSrc}
                alt={displayTitle}
                onerror={handleImgError}
                onload={handleImgLoad}
                class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105
                       {imgLoaded ? 'opacity-100' : 'opacity-0'}"
            />
        {:else}
            <!-- fetching auth image: pulsing skeleton -->
            <div class="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
            </div>
        {/if}

        <!-- Duration badge (top-left) -->
        <div class="absolute top-3 left-3 flex items-center gap-1.5
            bg-black/40 dark:bg-black/60 backdrop-blur-md
            text-white text-xs font-medium
            px-2.5 py-1 rounded-full border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-sky-400"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            {duration}
        </div>

        <!-- Recommended badge (top-right) -->
        {#if recommended}
            <div class="absolute top-3 right-3 flex items-center gap-1.5
                bg-black/50 backdrop-blur-md
                text-white text-xs px-2.5 py-1.5 rounded-full border border-white/10">
                <div class="w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                </div>
                <span class="font-medium leading-none text-[10px]">{recommendedLabel}</span>
            </div>
        {/if}
    </div>

    <!-- Info panel — no negative margin so no overlap with image badges -->
    <div class="mx-2 mb-2 mt-1 rounded-xl
        bg-white dark:bg-slate-800
        border border-slate-100 dark:border-slate-700
        px-3 pt-2.5 pb-3 flex flex-col gap-2">

        <!-- Row: Tags + difficulty badge + video badge -->
        <div class="flex flex-wrap items-center gap-1.5">
            {#each tags as tag, i}
                <button
                    type="button"
                    onclick={() => handleTagClick(tag)}
                    class="text-[10px] font-bold tracking-wider uppercase
                        px-2 py-0.5 rounded-full
                        bg-slate-100 dark:bg-slate-700
                        text-slate-600 dark:text-slate-300
                        border border-slate-200 dark:border-slate-600
                        {onTagClick ? 'hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 transition-colors cursor-pointer' : 'cursor-default'}"
                >
                    {getDisplayTag(i)}
                </button>
            {/each}

            <!-- Difficulty badge (in panel — no overlap issue) -->
            {#if difficulty}
                <span class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 {DIFF_COLOURS[difficulty] ?? ''}">
                    {$_(`exercises.difficulty.${difficulty}`)}
                </span>
            {/if}

            <!-- Video badge -->
            {#if hasVideo}
                <span class="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex-shrink-0">
                    <Video class="w-2.5 h-2.5" />
                    video
                </span>
            {/if}
        </div>

        <!-- Title -->
        <h3 class="text-sm font-bold text-slate-800 dark:text-white leading-tight line-clamp-2">
            {displayTitle}
        </h3>

        <!-- Start button -->
        <button
            onclick={onStart}
            class="w-full py-2 rounded-xl
                bg-green-400 hover:bg-green-500
                text-black font-bold text-sm
                flex items-center justify-center gap-2
                transition-all duration-200
                shadow-lg shadow-green-400/20 hover:shadow-green-400/40
                active:scale-95"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {$_('exercises.start')}
        </button>
    </div>
</div>
