<script lang="ts">
    import type { ExerciseDailyStat } from '$lib/db';
    import { _ } from 'svelte-i18n';

    interface Props {
        dailyStats: ExerciseDailyStat[];
        mode?: 'count' | 'points';
        days?: number;
    }

    let { dailyStats, mode = 'count', days = 7 }: Props = $props();

    // ── Layout constants ────────────────────────────────────────────────────────
    const W   = 440;
    const H   = 150;
    const PL  = 30;
    const PR  = 8;
    const PT  = 16;
    const PB  = 26;
    const cW  = W - PL - PR;
    const cH  = H - PT - PB;

    const color = $derived(mode === 'points' ? '#f59e0b' : '#38bdf8');  // amber / sky
    const colorDim = $derived(mode === 'points' ? '#fde68a' : '#bae6fd');
    const gradId = $derived(mode === 'points' ? 'grad-pts' : 'grad-cnt');

    // ── Helpers ─────────────────────────────────────────────────────────────────
    function localKey(d: Date): string {
        const p = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    }

    // ── Day array (for 7d & 14d) ────────────────────────────────────────────────
    function buildDays() {
        const statMap = new Map(dailyStats.map(s => [s.day, s]));
        const out: { key: string; value: number; isToday: boolean; shortLabel: string; dayNum: number; date: Date }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = localKey(d);
            const stat = statMap.get(key);
            const value = stat ? (mode === 'count' ? stat.exercise_count : stat.total_points) : 0;
            const shortLabel = d.toLocaleDateString('es', { weekday: 'short' }).slice(0, 2);
            out.push({ key, value, isToday: i === 0, shortLabel, dayNum: d.getDate(), date: d });
        }
        return out;
    }

    // ── Weekly aggregation (for 30d) ────────────────────────────────────────────
    function buildWeeks() {
        const allDays = buildDays();
        const weeks: { label: string; value: number; isCurrentWeek: boolean }[] = [];
        // chunk into groups of 7 (oldest first)
        for (let i = 0; i < allDays.length; i += 7) {
            const chunk = allDays.slice(i, i + 7);
            const total = chunk.reduce((s, d) => s + d.value, 0);
            const first = chunk[0].date;
            const last  = chunk[chunk.length - 1].date;
            const label = `${first.getDate()}/${first.getMonth() + 1}`;
            const isCurrentWeek = chunk.some(d => d.isToday);
            weeks.push({ label, value: total, isCurrentWeek });
        }
        return weeks;
    }

    // ── Derived data ─────────────────────────────────────────────────────────────
    let dayData  = $derived(buildDays());
    let weekData = $derived(buildWeeks());
    let hasData  = $derived(dayData.some(d => d.value > 0));

    let maxDay  = $derived(Math.max(...dayData.map(d => d.value), 1));
    let maxWeek = $derived(Math.max(...weekData.map(w => w.value), 1));
    let avgDay  = $derived(Math.round(dayData.reduce((s, d) => s + d.value, 0) / Math.max(dayData.filter(d => d.value > 0).length, 1)));

    // ── Bar chart helpers (7d) ──────────────────────────────────────────────────
    const BAR_W7 = $derived(Math.min(36, Math.floor((cW / 7) * 0.72)));

    function barProps7(i: number, v: number) {
        const gap = cW / 7;
        const x   = PL + i * gap + (gap - BAR_W7) / 2;
        const h   = Math.max(3, (v / maxDay) * cH);
        const y   = PT + cH - h;
        return { x, y, h };
    }

    // ── Line / area chart (14d) ─────────────────────────────────────────────────
    function linePoints14() {
        return dayData.map((d, i) => ({
            x: PL + (i / (dayData.length - 1)) * cW,
            y: PT + cH - (d.value / maxDay) * cH,
            value: d.value,
            isToday: d.isToday,
            dayNum: d.dayNum,
        }));
    }

    function bezierPath(pts: { x: number; y: number }[]): string {
        if (pts.length < 2) return '';
        let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
        for (let i = 1; i < pts.length; i++) {
            const cpx = (pts[i - 1].x + pts[i].x) / 2;
            d += ` C ${cpx.toFixed(1)} ${pts[i - 1].y.toFixed(1)} ${cpx.toFixed(1)} ${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
        }
        return d;
    }

    function areaPath14(pts: { x: number; y: number }[]): string {
        const base = PT + cH;
        return `${bezierPath(pts)} L ${pts[pts.length - 1].x.toFixed(1)} ${base} L ${pts[0].x.toFixed(1)} ${base} Z`;
    }

    let pts14      = $derived(linePoints14());
    let pathLine14 = $derived(bezierPath(pts14));
    let pathArea14 = $derived(areaPath14(pts14));
    const avgY14   = $derived(PT + cH - (avgDay / maxDay) * cH);

    // ── Weekly bar helpers (30d) ────────────────────────────────────────────────
    const WEEK_COUNT = $derived(weekData.length);
    const BAR_W30   = $derived(Math.min(52, Math.floor((cW / WEEK_COUNT) * 0.65)));

    function weekBarProps(i: number, v: number) {
        const gap = cW / WEEK_COUNT;
        const x   = PL + i * gap + (gap - BAR_W30) / 2;
        const h   = Math.max(3, (v / maxWeek) * cH);
        const y   = PT + cH - h;
        return { x, y, h };
    }

    // ── Y-axis tick labels ──────────────────────────────────────────────────────
    function yTicks(max: number) {
        const step = max <= 5 ? 1 : max <= 20 ? 5 : max <= 50 ? 10 : 25;
        const ticks = [];
        for (let v = 0; v <= max; v += step) ticks.push(v);
        if (ticks[ticks.length - 1] < max) ticks.push(max);
        return ticks.filter((v, i, a) => i === 0 || i === a.length - 1 || v % step === 0).slice(0, 5);
    }
</script>

<!-- SVG defs shared -->
<svg width="0" height="0" style="position:absolute">
    <defs>
        <linearGradient id="grad-cnt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.6"/>
        </linearGradient>
        <linearGradient id="grad-pts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#d97706" stop-opacity="0.6"/>
        </linearGradient>
        <linearGradient id="area-cnt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.01"/>
        </linearGradient>
        <linearGradient id="area-pts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.01"/>
        </linearGradient>
    </defs>
</svg>

<div class="w-full">
    {#if !hasData}
        <div class="flex items-center justify-center h-36 text-slate-300 dark:text-slate-600 text-sm">
            {$_('exercises.chart.noData')}
        </div>

    <!-- ═══════════════════════════════════════════════════════════
         7-DAY  →  Bar chart
    ═══════════════════════════════════════════════════════════════ -->
    {:else if days === 7}
        <svg viewBox="0 0 {W} {H}" class="w-full" style="height:160px" aria-hidden="true">
            <!-- grid lines -->
            {#each yTicks(maxDay) as tick}
                {@const ty = PT + cH - (tick / maxDay) * cH}
                <line x1={PL} y1={ty} x2={W - PR} y2={ty}
                      stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"/>
                <text x={PL - 4} y={ty + 3} text-anchor="end" font-size="8"
                      class="fill-slate-400 dark:fill-slate-500">{tick}</text>
            {/each}

            <!-- bars -->
            {#each dayData as d, i}
                {@const { x, y, h } = barProps7(i, d.value)}
                <!-- background track -->
                <rect x={x} y={PT} width={BAR_W7} height={cH} rx="5"
                      class="fill-slate-100 dark:fill-slate-800" opacity="0.5"/>
                <!-- value bar -->
                {#if d.value > 0}
                    <rect x={x} y={y} width={BAR_W7} height={h} rx="5"
                          fill="url(#{gradId})"
                          opacity={d.isToday ? 1 : 0.8}/>
                    <!-- today indicator line at top -->
                    {#if d.isToday}
                        <rect x={x} y={y} width={BAR_W7} height="3" rx="1.5" fill={color}/>
                    {/if}
                    <!-- value label -->
                    <text x={x + BAR_W7 / 2} y={y - 4}
                          text-anchor="middle" font-size="9" font-weight="700" fill={color}>{d.value}</text>
                {/if}
                <!-- day label -->
                <text x={x + BAR_W7 / 2} y={H - 6}
                      text-anchor="middle" font-size="9"
                      class={d.isToday
                          ? 'font-bold'
                          : 'fill-slate-400 dark:fill-slate-500'}
                      fill={d.isToday ? color : undefined}>{d.shortLabel}</text>
            {/each}
        </svg>

    <!-- ═══════════════════════════════════════════════════════════
         14-DAY  →  Smooth line + area
    ═══════════════════════════════════════════════════════════════ -->
    {:else if days === 14}
        <svg viewBox="0 0 {W} {H}" class="w-full" style="height:160px" aria-hidden="true">
            <!-- grid lines -->
            {#each yTicks(maxDay) as tick}
                {@const ty = PT + cH - (tick / maxDay) * cH}
                <line x1={PL} y1={ty} x2={W - PR} y2={ty}
                      stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"/>
                <text x={PL - 4} y={ty + 3} text-anchor="end" font-size="8"
                      class="fill-slate-400 dark:fill-slate-500">{tick}</text>
            {/each}

            <!-- area fill -->
            <path d={pathArea14} fill="url(#{mode === 'points' ? 'area-pts' : 'area-cnt'})"/>

            <!-- avg dashed line -->
            {#if avgDay > 0}
                <line x1={PL} y1={avgY14} x2={W - PR} y2={avgY14}
                      stroke={color} stroke-width="1" stroke-dasharray="4,3" opacity="0.35"/>
            {/if}

            <!-- line -->
            <path d={pathLine14} fill="none" stroke={color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>

            <!-- dots + labels -->
            {#each pts14 as pt, i}
                {#if pt.value > 0}
                    <circle cx={pt.x} cy={pt.y} r={pt.isToday ? 5 : 3.5}
                            fill={pt.isToday ? color : 'white'} stroke={color}
                            stroke-width={pt.isToday ? 0 : 2}/>
                    {#if pt.isToday || pt.value === maxDay}
                        <text x={pt.x} y={pt.y - 8}
                              text-anchor="middle" font-size="9" font-weight="700" fill={color}>{pt.value}</text>
                    {/if}
                {:else}
                    <circle cx={pt.x} cy={pt.y} r="2"
                            class="fill-slate-200 dark:fill-slate-700" stroke="none"/>
                {/if}
                <!-- day number every other label -->
                {#if i % 2 === 0 || pt.isToday}
                    <text x={pt.x} y={H - 6}
                          text-anchor="middle" font-size="8.5"
                          fill={pt.isToday ? color : undefined}
                          class={pt.isToday ? 'font-semibold' : 'fill-slate-400 dark:fill-slate-500'}>{pt.dayNum}</text>
                {/if}
            {/each}
        </svg>

    <!-- ═══════════════════════════════════════════════════════════
         30-DAY  →  Weekly grouped bars
    ═══════════════════════════════════════════════════════════════ -->
    {:else}
        <svg viewBox="0 0 {W} {H}" class="w-full" style="height:160px" aria-hidden="true">
            <!-- grid lines -->
            {#each yTicks(maxWeek) as tick}
                {@const ty = PT + cH - (tick / maxWeek) * cH}
                <line x1={PL} y1={ty} x2={W - PR} y2={ty}
                      stroke="currentColor" stroke-width="0.5" opacity="0.08" class="text-slate-500"/>
                <text x={PL - 4} y={ty + 3} text-anchor="end" font-size="8"
                      class="fill-slate-400 dark:fill-slate-500">{tick}</text>
            {/each}

            <!-- weekly bars -->
            {#each weekData as wk, i}
                {@const { x, y, h } = weekBarProps(i, wk.value)}
                <!-- background track -->
                <rect x={x} y={PT} width={BAR_W30} height={cH} rx="6"
                      class="fill-slate-100 dark:fill-slate-800" opacity="0.5"/>
                {#if wk.value > 0}
                    <rect x={x} y={y} width={BAR_W30} height={h} rx="6"
                          fill="url(#{gradId})"
                          opacity={wk.isCurrentWeek ? 1 : 0.7}/>
                    {#if wk.isCurrentWeek}
                        <rect x={x} y={y} width={BAR_W30} height="3" rx="1.5" fill={color}/>
                    {/if}
                    <text x={x + BAR_W30 / 2} y={y - 5}
                          text-anchor="middle" font-size="10" font-weight="700" fill={color}>{wk.value}</text>
                {/if}
                <!-- week label -->
                <text x={x + BAR_W30 / 2} y={H - 6}
                      text-anchor="middle" font-size="9"
                      fill={wk.isCurrentWeek ? color : undefined}
                      class={wk.isCurrentWeek ? 'font-semibold' : 'fill-slate-400 dark:fill-slate-500'}>{wk.label}</text>
            {/each}
        </svg>
    {/if}
</div>
