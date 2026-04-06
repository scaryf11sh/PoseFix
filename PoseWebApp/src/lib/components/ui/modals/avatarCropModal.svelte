<script lang="ts">
    import { X, RefreshCw, Check } from "@lucide/svelte";

    interface Props {
        src: string;
        onconfirm: (croppedDataUrl: string) => void;
        oncancel: () => void;
        onchange: () => void;
    }

    let { src, onconfirm, oncancel, onchange }: Props = $props();

    let canvas = $state<HTMLCanvasElement | null>(null);
    let imgLoaded = $state(false);

    let img: HTMLImageElement | null = null;
    let offsetX = $state(0);
    let offsetY = $state(0);
    let scale = $state(1);
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastTouchDist = 0;

    const SIZE = 280;

    $effect(() => {
        if (!src) return;
        imgLoaded = false;
        const image = new Image();
        image.onload = () => {
            img = image;
            const s = Math.max(SIZE / image.width, SIZE / image.height);
            scale = s;
            offsetX = (SIZE - image.width * s) / 2;
            offsetY = (SIZE - image.height * s) / 2;
            imgLoaded = true;
            draw();
        };
        image.src = src;
    });

    function draw() {
        if (!canvas || !img) return;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.save();
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            img,
            offsetX,
            offsetY,
            img.width * scale,
            img.height * scale,
        );
        ctx.restore();
        ctx.strokeStyle = "rgba(56,189,248,0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
        ctx.stroke();
    }

    function clampOffsets() {
        if (!img) return;
        const w = img.width * scale;
        const h = img.height * scale;
        offsetX = Math.min(0, Math.max(SIZE - w, offsetX));
        offsetY = Math.min(0, Math.max(SIZE - h, offsetY));
    }

    function onMouseDown(e: MouseEvent) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }

    function onMouseMove(e: MouseEvent) {
        if (!dragging) return;
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        clampOffsets();
        draw();
    }

    function onMouseUp() {
        dragging = false;
    }

    function onWheel(e: WheelEvent) {
        if (!img) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const min = SIZE / Math.min(img.width, img.height);
        const newS = Math.min(5, Math.max(min, scale * delta));
        const ratio = newS / scale;
        scale = newS;
        offsetX = SIZE / 2 - (SIZE / 2 - offsetX) * ratio;
        offsetY = SIZE / 2 - (SIZE / 2 - offsetY) * ratio;
        clampOffsets();
        draw();
    }

    function onTouchStart(e: TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 1) {
            dragging = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            dragging = false;
            lastTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
        }
    }

    function onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (!img) return;
        if (e.touches.length === 1 && dragging) {
            offsetX += e.touches[0].clientX - lastX;
            offsetY += e.touches[0].clientY - lastY;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            clampOffsets();
            draw();
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
            const ratio = dist / lastTouchDist;
            lastTouchDist = dist;
            const min = SIZE / Math.min(img.width, img.height);
            const newS = Math.min(5, Math.max(min, scale * ratio));
            const r2 = newS / scale;
            scale = newS;
            offsetX = SIZE / 2 - (SIZE / 2 - offsetX) * r2;
            offsetY = SIZE / 2 - (SIZE / 2 - offsetY) * r2;
            clampOffsets();
            draw();
        }
    }

    function onTouchEnd() {
        dragging = false;
    }

    function confirm() {
        if (!canvas) return;
        onconfirm(canvas.toDataURL("image/jpeg", 0.92));
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onclick={(e) => {
        if (e.target === e.currentTarget) oncancel();
    }}
>
    <div
        class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-5 w-90
        border border-slate-100 dark:border-slate-800"
    >
        <!-- Header -->
        <div class="flex items-center justify-between w-full">
            <h2 class="font-bold text-slate-800 dark:text-white">
                Adjust Photo
            </h2>
            <button
                onclick={oncancel}
                aria-label="Close modal"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                    text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <!-- Canvas -->
        <div class="relative">
            <canvas
                bind:this={canvas}
                width={SIZE}
                height={SIZE}
                class="rounded-full select-none {imgLoaded
                    ? 'cursor-grab active:cursor-grabbing'
                    : ''}"
                style="width: {SIZE}px; height: {SIZE}px;"
                onmousedown={onMouseDown}
                onmousemove={onMouseMove}
                onmouseup={onMouseUp}
                onmouseleave={onMouseUp}
                onwheel={onWheel}
                ontouchstart={onTouchStart}
                ontouchmove={onTouchMove}
                ontouchend={onTouchEnd}
            ></canvas>
            {#if !imgLoaded}
                <div
                    class="absolute inset-0 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                >
                    <div
                        class="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin"
                    ></div>
                </div>
            {/if}
        </div>

        <p class="text-xs text-slate-400">
            Drag to reposition · Scroll or pinch to zoom
        </p>

        <!-- Actions -->
        <div class="flex gap-3 w-full">
            <button
                onclick={onchange}
                aria-label="Change image"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium cursor-pointer
                    bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-all"
            >
                <RefreshCw class="w-4 h-4" />
                Change
            </button>
            <button
                onclick={confirm}
                aria-label="Apply crop"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold cursor-pointer
                    bg-sky-400 hover:bg-sky-500 text-white shadow-lg shadow-sky-400/20 transition-all active:scale-95"
            >
                <Check class="w-4 h-4" />
                Apply
            </button>
        </div>
    </div>
</div>
