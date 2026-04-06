<script lang="ts">
    import { X, RefreshCw, Check } from "@lucide/svelte";

    interface Props {
        src: string; // dataUrl de la imagen original
        onconfirm: (croppedDataUrl: string) => void;
        oncancel: () => void;
        onchange: () => void; // pide nueva imagen
    }

    let { src, onconfirm, oncancel, onchange }: Props = $props();

    // Canvas refs
    let canvas = $state<HTMLCanvasElement | null>(null);
    let containerEl = $state<HTMLDivElement | null>(null);

    // Image state
    let img = $state<HTMLImageElement | null>(null);
    let imgLoaded = $state(false);

    // Pan state
    let offsetX = $state(0);
    let offsetY = $state(0);
    let scale = $state(1);
    let dragging = $state(false);
    let lastX = 0;
    let lastY = 0;

    const SIZE = 280; // canvas size px

    $effect(() => {
        if (!src) return;
        const image = new Image();
        image.onload = () => {
            img = image;
            imgLoaded = true;
            // Center image
            const s = Math.max(SIZE / image.width, SIZE / image.height);
            scale = s;
            offsetX = (SIZE - image.width * s) / 2;
            offsetY = (SIZE - image.height * s) / 2;
            draw();
        };
        image.src = src;
    });

    $effect(() => {
        if (imgLoaded) draw();
    });

    function draw() {
        if (!canvas || !img) return;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, SIZE, SIZE);

        // Circular clip
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

        // Overlay ring
        ctx.strokeStyle = "rgba(56,189,248,0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
        ctx.stroke();
    }

    function onMouseDown(e: MouseEvent) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
    }

    function onMouseMove(e: MouseEvent) {
        if (!dragging || !img) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        const newX = offsetX + dx;
        const newY = offsetY + dy;

        // Clamp so image always covers circle
        const w = img.width * scale;
        const h = img.height * scale;
        offsetX = Math.min(0, Math.max(SIZE - w, newX));
        offsetY = Math.min(0, Math.max(SIZE - h, newY));
        draw();
    }

    function onMouseUp() {
        dragging = false;
    }

    function onWheel(e: WheelEvent) {
        if (!img) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(
            5,
            Math.max(SIZE / Math.min(img.width, img.height), scale * delta),
        );
        const ratio = newScale / scale;
        scale = newScale;
        offsetX = SIZE / 2 - (SIZE / 2 - offsetX) * ratio;
        offsetY = SIZE / 2 - (SIZE / 2 - offsetY) * ratio;

        // Clamp
        const w = img.width * scale;
        const h = img.height * scale;
        offsetX = Math.min(0, Math.max(SIZE - w, offsetX));
        offsetY = Math.min(0, Math.max(SIZE - h, offsetY));
        draw();
    }

    // Touch support
    let lastTouchDist = 0;
    function onTouchStart(e: TouchEvent) {
        if (e.touches.length === 1) {
            dragging = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            lastTouchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
        }
    }

    function onTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 1 && dragging && img) {
            const dx = e.touches[0].clientX - lastX;
            const dy = e.touches[0].clientY - lastY;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            const w = img.width * scale;
            const h = img.height * scale;
            offsetX = Math.min(0, Math.max(SIZE - w, offsetX + dx));
            offsetY = Math.min(0, Math.max(SIZE - h, offsetY + dy));
            draw();
        } else if (e.touches.length === 2 && img) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
            const delta = dist / lastTouchDist;
            lastTouchDist = dist;
            const newScale = Math.min(
                5,
                Math.max(SIZE / Math.min(img.width, img.height), scale * delta),
            );
            const ratio = newScale / scale;
            scale = newScale;
            offsetX = SIZE / 2 - (SIZE / 2 - offsetX) * ratio;
            offsetY = SIZE / 2 - (SIZE / 2 - offsetY) * ratio;
            const w = img.width * scale;
            const h = img.height * scale;
            offsetX = Math.min(0, Math.max(SIZE - w, offsetX));
            offsetY = Math.min(0, Math.max(SIZE - h, offsetY));
            draw();
        }
    }

    function onTouchEnd() {
        dragging = false;
    }

    function confirm() {
        if (!canvas) return;
        // Export as JPEG for smaller size
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        onconfirm(dataUrl);
    }
</script>

<!-- Backdrop -->
<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    role="button"
    tabindex="0"
    aria-label="Close modal backdrop"
    onclick={(e) => {
        if (e.target === e.currentTarget) oncancel();
    }}
    onkeydown={(e) => {
        if (
            e.target === e.currentTarget &&
            (e.key === "Enter" || e.key === " ")
        ) {
            e.preventDefault();
            oncancel();
        }
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
                aria-label="Close"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center
                    text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <!-- Canvas -->
        <div class="relative" bind:this={containerEl}>
            <canvas
                bind:this={canvas}
                width={SIZE}
                height={SIZE}
                class="rounded-full cursor-grab active:cursor-grabbing shadow-lg select-none"
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
            Drag to reposition · Scroll to zoom
        </p>

        <!-- Actions -->
        <div class="flex gap-3 w-full">
            <button
                onclick={onchange}
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium cursor-pointer
                    bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-all"
            >
                <RefreshCw class="w-4 h-4" />
                Change
            </button>
            <button
                onclick={confirm}
                class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold cursor-pointer
                    bg-sky-400 hover:bg-sky-500 text-white shadow-lg shadow-sky-400/20 transition-all active:scale-95"
            >
                <Check class="w-4 h-4" />
                Apply
            </button>
        </div>
    </div>
</div>
