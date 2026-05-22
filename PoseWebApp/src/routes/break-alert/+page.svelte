<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/core";
  import { _ } from "svelte-i18n";
  import { Coffee, X } from "@lucide/svelte";

  let totalSeconds = $state(5 * 60);
  let remaining = $state(totalSeconds);
  let interval: ReturnType<typeof setInterval> | null = null;

  function startCountdown(durationMin: number) {
    if (interval) clearInterval(interval);
    totalSeconds = durationMin * 60;
    remaining = totalSeconds;
    interval = setInterval(() => {
       remaining--;
       if (remaining <= 0) {
         clearInterval(interval!);
         interval = null;
         invoke("hide_break_alert");
       }

    }, 1000);
  }

   function skip() {
     if (interval) { clearInterval(interval); interval = null; }
     invoke("hide_break_alert");
   }


  let timeStr = $derived(
    (() => {
      const m = Math.floor(remaining / 60).toString().padStart(2, "0");
      const s = (remaining % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    })()
  );

  let progressPct = $derived(
    totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0
  );

  onMount(() => {
    const unlistenPromise = listen<{ duration: number }>(
      "posefix:break-start",
      (e) => {
        startCountdown(e.payload.duration);
      }
    );
    return () => {
      unlistenPromise.then((fn) => fn());
    };
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<!-- Full-screen dark panel, draggable, transparent-ready -->
<div
  data-tauri-drag-region
  class="w-screen h-screen p-[1px] flex items-center justify-center"
  style="background: transparent;"
>
  <!-- Glowing card -->
  <div
    class="relative w-full h-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-6"
    style="
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      box-shadow: 0 0 0 1px rgba(99, 179, 237, 0.25), 0 0 40px rgba(99, 179, 237, 0.08), inset 0 0 60px rgba(15, 52, 96, 0.4);
    "
  >
    <!-- Subtle top glow line -->
    <div
      class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
      style="background: linear-gradient(90deg, transparent, rgba(99,179,237,0.6), transparent);"
    ></div>

    <!-- Skip / close button top-right -->
    <button
      onclick={skip}
      class="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all duration-150"
      aria-label="Skip break"
    >
      <X size={18} />
    </button>

    <!-- Coffee icon -->
    <div
      class="flex items-center justify-center w-20 h-20 rounded-full"
      style="
        background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 70%);
        box-shadow: 0 0 24px rgba(251, 191, 36, 0.2);
      "
    >
      <Coffee size={40} class="text-amber-400" strokeWidth={1.5} />
    </div>

    <!-- Title & subtitle -->
    <div class="text-center px-8 space-y-2">
      <h1 class="text-2xl font-semibold text-slate-100 tracking-tight">
        {$_("break_alert.title")}
      </h1>
      <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
        {$_("break_alert.subtitle")}
      </p>
    </div>

    <!-- Countdown timer -->
    <div class="flex flex-col items-center gap-1">
      <span
        class="font-mono font-bold tabular-nums leading-none select-none"
        style="font-size: clamp(3.5rem, 12vw, 6rem); color: #38bdf8; text-shadow: 0 0 30px rgba(56, 189, 248, 0.4);"
      >
        {timeStr}
      </span>
      <span class="text-xs text-slate-500 uppercase tracking-widest">remaining</span>
    </div>

    <!-- Skip button -->
    <button
      onclick={skip}
      class="mt-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
             text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-slate-100
             hover:bg-white/5 active:scale-95"
    >
      {$_("break_alert.skip")}
    </button>

    <!-- Progress bar pinned to bottom -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/60">
      <div
        class="h-full transition-[width] duration-1000 ease-linear rounded-full"
        style="
          width: {progressPct}%;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          box-shadow: 0 0 8px rgba(56, 189, 248, 0.5);
        "
      ></div>
    </div>
  </div>
</div>
