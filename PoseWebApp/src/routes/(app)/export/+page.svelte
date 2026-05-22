<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import {
        Calendar,
        List,
        FileText,
        Download,
        Lock,
        Activity,
        CheckCircle,
        Loader,
        AlertCircle,
        CheckCircle2,
    } from "@lucide/svelte";
    import { getCurrentUser } from "$lib/auth";
    import {
        getSessionCountInRange,
        getSessionsInRange,
        getExercisesInRange,
        saveExportRecord,
        getExportHistory,
        type ExportRecord,
        type UserSession,
        type ExerciseLogExtended,
    } from "$lib/db";
    import { save } from "@tauri-apps/plugin-dialog";
    import { writeTextFile, writeFile } from "@tauri-apps/plugin-fs";
    import { jsPDF } from "jspdf";

    let userId = $state(0);

    function localDate(d: Date = new Date()): string {
        const p = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    }

    // --- Date Range ---
    const _start7 = new Date();
    _start7.setDate(_start7.getDate() - 7);
    let startDate = $state(localDate(_start7));
    let endDate = $state(localDate());
    let sessionCountInRange = $state(0);

    function setRange(days: number | "ytd") {
        const end = new Date();
        endDate = localDate(end);
        if (days === "ytd") {
            startDate = localDate(new Date(end.getFullYear(), 0, 1));
        } else {
            const start = new Date();
            start.setDate(end.getDate() - days);
            startDate = localDate(start);
        }
    }

    function daysDiff() {
        const a = new Date(startDate);
        const b = new Date(endDate);
        return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000));
    }

    $effect(() => {
        if (userId && startDate && endDate) {
            getSessionCountInRange(userId, startDate, endDate)
                .then((c) => (sessionCountInRange = c))
                .catch(() => {});
        }
    });

    // --- Categories ---
    let categories = $state([
        {
            id: "posture",
            label: () => $_("export.categories_list.posture"),
            enabled: true,
        },
        {
            id: "eye",
            label: () => $_("export.categories_list.eye"),
            enabled: true,
        },
        {
            id: "sensor",
            label: () => $_("export.categories_list.sensor"),
            enabled: false,
        },
        {
            id: "exercise",
            label: () => $_("export.categories_list.exercise"),
            enabled: true,
        },
    ]);

    let activeCount = $derived(categories.filter((c) => c.enabled).length);

    // --- Format ---
    let selectedFormat = $state<"pdf" | "csv" | "json">("csv");

    const formats = $derived([
        {
            id: "pdf" as const,
            label: $_("export.pdf"),
            sub: $_("export.pdfSub"),
        },
        {
            id: "csv" as const,
            label: $_("export.csv"),
            sub: $_("export.csvSub"),
        },
        {
            id: "json" as const,
            label: $_("export.json"),
            sub: $_("export.jsonSub"),
        },
    ]);

    // --- Export History ---
    let exportHistory = $state<ExportRecord[]>([]);

    async function loadHistory() {
        if (userId) {
            exportHistory = await getExportHistory(userId);
        }
    }

    // --- Toast / feedback ---
    let toast = $state<{ type: "success" | "error"; msg: string } | null>(null);
    let toastTimer: ReturnType<typeof setTimeout>;

    function showToast(type: "success" | "error", msg: string) {
        clearTimeout(toastTimer);
        toast = { type, msg };
        toastTimer = setTimeout(() => (toast = null), 4000);
    }

    // --- Generate CSV ---
    function buildCSV(
        sessions: UserSession[],
        exercises: ExerciseLogExtended[],
        enabledIds: string[]
    ): string {
        const lines: string[] = [];

        const needsSessions = enabledIds.some((id) =>
            ["posture", "eye", "sensor"].includes(id)
        );

        if (needsSessions && sessions.length > 0) {
            // Build header dynamically
            const cols: string[] = ["date", "duration_min"];
            if (enabledIds.includes("posture"))
                cols.push("posture_score", "warnings");
            if (enabledIds.includes("eye"))
                cols.push("eye_distance_cm", "blink_rate", "fatigue_score");
            if (enabledIds.includes("sensor")) cols.push("sensor_data");

            lines.push("# Sessions");
            lines.push(cols.join(","));

            for (const s of sessions) {
                const row: (string | number | null | undefined)[] = [
                    s.session_start?.slice(0, 10) ?? "",
                    s.duration != null ? Math.round(s.duration / 60) : "",
                ];
                if (enabledIds.includes("posture"))
                    row.push(s.posture_score ?? "", s.warnings);
                if (enabledIds.includes("eye"))
                    row.push(
                        s.eye_distance ?? "",
                        s.blink_rate ?? "",
                        s.fatigue_score ?? ""
                    );
                if (enabledIds.includes("sensor"))
                    row.push(
                        s.sensor_data ? `"${s.sensor_data.replace(/"/g, '""')}"` : ""
                    );
                lines.push(row.join(","));
            }
        }

        if (enabledIds.includes("exercise") && exercises.length > 0) {
            if (lines.length > 0) lines.push("");
            lines.push("# Exercises");
            lines.push("date,exercise,category,difficulty,duration_min,points");
            for (const e of exercises) {
                lines.push(
                    [
                        e.completed_at?.slice(0, 10) ?? "",
                        `"${(e.exercise ?? "").replace(/"/g, '""')}"`,
                        e.category ?? "",
                        e.difficulty ?? "",
                        e.duration ?? "",
                        e.points ?? 0,
                    ].join(",")
                );
            }
        }

        if (lines.length === 0) {
            lines.push("# No data found for selected range and categories");
        }

        return lines.join("\n");
    }

    // --- Generate JSON ---
    function buildJSON(
        sessions: UserSession[],
        exercises: ExerciseLogExtended[],
        enabledIds: string[]
    ): string {
        const output: Record<string, unknown> = {
            exported_at: new Date().toISOString(),
            range: { start: startDate, end: endDate },
            categories: enabledIds,
        };

        const needsSessions = enabledIds.some((id) =>
            ["posture", "eye", "sensor"].includes(id)
        );

        if (needsSessions) {
            output.sessions = sessions.map((s) => {
                const row: Record<string, unknown> = {
                    date: s.session_start?.slice(0, 10),
                    duration_min:
                        s.duration != null ? Math.round(s.duration / 60) : null,
                };
                if (enabledIds.includes("posture")) {
                    row.posture_score = s.posture_score;
                    row.warnings = s.warnings;
                }
                if (enabledIds.includes("eye")) {
                    row.eye_distance_cm = s.eye_distance;
                    row.blink_rate = s.blink_rate;
                    row.fatigue_score = s.fatigue_score;
                }
                if (enabledIds.includes("sensor")) {
                    try {
                        row.sensor_data = s.sensor_data
                            ? JSON.parse(s.sensor_data)
                            : null;
                    } catch {
                        row.sensor_data = s.sensor_data;
                    }
                }
                return row;
            });
        }

        if (enabledIds.includes("exercise")) {
            output.exercises = exercises.map((e) => ({
                date: e.completed_at?.slice(0, 10),
                exercise: e.exercise,
                category: e.category,
                difficulty: e.difficulty,
                duration_min: e.duration,
                points: e.points,
            }));
        }

        return JSON.stringify(output, null, 2);
    }

    // --- Generate PDF ---
    function buildPDF(
        sessions: UserSession[],
        exercises: ExerciseLogExtended[],
        enabledIds: string[]
    ): Uint8Array | ArrayBuffer {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 14;
        const colW = pageW - margin * 2;
        let y = 20;

        const needsSessions = enabledIds.some((id) =>
            ["posture", "eye", "sensor"].includes(id)
        );

        // ── Header ──────────────────────────────────────────
        doc.setFillColor(14, 165, 233); // sky-500
        doc.rect(0, 0, pageW, 16, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text("PoseFix — Data Export Report", margin, 10.5);
        doc.setFontSize(8);
        doc.text(`${startDate}  →  ${endDate}`, pageW - margin, 10.5, { align: "right" });

        y = 24;
        doc.setTextColor(100, 116, 139); // slate-500
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Categories: ${enabledIds.join(", ")}   •   Generated: ${new Date().toLocaleString()}`, margin, y);
        y += 8;

        // ── Helper: section header ───────────────────────────
        function sectionHeader(title: string) {
            if (y > 270) { doc.addPage(); y = 16; }
            doc.setFillColor(241, 245, 249); // slate-100
            doc.rect(margin, y, colW, 6, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85); // slate-700
            doc.text(title, margin + 2, y + 4.2);
            y += 8;
        }

        // ── Helper: table ────────────────────────────────────
        function table(headers: string[], rows: (string | number | null | undefined)[][], colWidths: number[]) {
            const rowH = 6;
            // header row
            if (y + rowH > 280) { doc.addPage(); y = 16; }
            doc.setFillColor(226, 232, 240); // slate-200
            doc.rect(margin, y, colW, rowH, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.setTextColor(71, 85, 105);
            let cx = margin + 1;
            for (let i = 0; i < headers.length; i++) {
                doc.text(String(headers[i]), cx, y + 4);
                cx += colWidths[i];
            }
            y += rowH;

            // data rows
            doc.setFont("helvetica", "normal");
            for (const row of rows) {
                if (y + rowH > 280) { doc.addPage(); y = 16; }
                // alternating bg
                if (rows.indexOf(row) % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, y, colW, rowH, "F");
                }
                doc.setTextColor(30, 41, 59);
                cx = margin + 1;
                for (let i = 0; i < row.length; i++) {
                    const cell = row[i] != null ? String(row[i]) : "—";
                    doc.text(cell.slice(0, 28), cx, y + 4);
                    cx += colWidths[i];
                }
                y += rowH;
            }
            y += 4;
        }

        // ── Sessions ─────────────────────────────────────────
        if (needsSessions) {
            sectionHeader("Sessions");
            const headers: string[] = ["Date", "Duration (min)"];
            const colWidths: number[] = [26, 28];
            if (enabledIds.includes("posture")) { headers.push("Posture Score", "Warnings"); colWidths.push(30, 24); }
            if (enabledIds.includes("eye"))     { headers.push("Eye Dist (cm)", "Blink Rate", "Fatigue"); colWidths.push(28, 26, 20); }

            const rows = sessions.map((s) => {
                const row: (string | number | null)[] = [
                    s.session_start?.slice(0, 10) ?? "—",
                    s.duration != null ? Math.round(s.duration / 60) : null,
                ];
                if (enabledIds.includes("posture")) { row.push(s.posture_score ?? null, s.warnings); }
                if (enabledIds.includes("eye"))     { row.push(s.eye_distance ?? null, s.blink_rate ?? null, s.fatigue_score ?? null); }
                return row;
            });

            if (rows.length === 0) {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text("No sessions in selected range.", margin + 2, y + 4);
                y += 10;
            } else {
                table(headers, rows, colWidths);
            }
        }

        // ── Exercises ────────────────────────────────────────
        if (enabledIds.includes("exercise")) {
            sectionHeader("Exercises");
            const headers = ["Date", "Exercise", "Category", "Difficulty", "Duration (min)", "Points"];
            const colWidths = [24, 44, 26, 22, 30, 20];
            const rows = exercises.map((e) => [
                e.completed_at?.slice(0, 10) ?? "—",
                e.exercise ?? "—",
                e.category ?? "—",
                e.difficulty ?? "—",
                e.duration ?? null,
                e.points ?? 0,
            ]);

            if (rows.length === 0) {
                doc.setFont("helvetica", "italic");
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text("No exercises in selected range.", margin + 2, y + 4);
                y += 10;
            } else {
                table(headers, rows, colWidths);
            }
        }

        // ── Footer on each page ──────────────────────────────
        const totalPages = (doc.internal as { getNumberOfPages(): number }).getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
            doc.setPage(p);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(`PoseFix  •  Page ${p} of ${totalPages}`, pageW / 2, 292, { align: "center" });
        }

        return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
    }

    // --- Generate Export ---
    let generating = $state(false);

    async function generate() {
        if (activeCount === 0) {
            showToast("error", $_("export.noCategoriesSelected"));
            return;
        }

        generating = true;
        try {
            const enabledIds = categories
                .filter((c) => c.enabled)
                .map((c) => c.id);

            const needsSessions = enabledIds.some((id) =>
                ["posture", "eye", "sensor"].includes(id)
            );
            const needsExercises = enabledIds.includes("exercise");

            const [sessions, exercises] = await Promise.all([
                needsSessions
                    ? getSessionsInRange(userId, startDate, endDate)
                    : Promise.resolve([] as UserSession[]),
                needsExercises
                    ? getExercisesInRange(userId, startDate, endDate)
                    : Promise.resolve([] as ExerciseLogExtended[]),
            ]);

            const ext = selectedFormat;
            const defaultName = `posefix-${startDate}-${endDate}.${ext}`;
            const filePath = await save({
                defaultPath: defaultName,
                filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
            });

            if (!filePath) return; // user cancelled

            if (ext === "pdf") {
                const pdfBytes = buildPDF(sessions, exercises, enabledIds);
                await writeFile(filePath, pdfBytes);
            } else {
                const content =
                    ext === "csv"
                        ? buildCSV(sessions, exercises, enabledIds)
                        : buildJSON(sessions, exercises, enabledIds);
                await writeTextFile(filePath, content);
            }

            const reportName = `PoseFix ${startDate} → ${endDate}`;
            await saveExportRecord(
                userId,
                reportName,
                ext.toUpperCase(),
                enabledIds.join(", "),
                startDate,
                endDate,
                filePath
            );

            await loadHistory();
            showToast("success", $_("export.savedTo"));
        } catch (err) {
            console.error(err);
            showToast("error", $_("export.failed"));
        } finally {
            generating = false;
        }
    }

    function formatDate(dt: string): string {
        return new Date(dt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    onMount(async () => {
        const user = await getCurrentUser();
        if (!user) {
            goto("/auth");
            return;
        }
        userId = user.id;
        await loadHistory();
    });

    // ─── ⌘⇧E Generate export shortcut ───────────────────────────────────────
    $effect(() => {
        function onkey(e: KeyboardEvent) {
            if (!((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e")) return;
            const tag = (e.target as HTMLElement).tagName.toLowerCase();
            if (tag === "input" || tag === "textarea") return;
            e.preventDefault();
            if (!generating && activeCount > 0) generate();
        }
        window.addEventListener("keydown", onkey);
        return () => window.removeEventListener("keydown", onkey);
    });
</script>

<!-- Toast -->
{#if toast}
    <div
        class="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
        {toast.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'}"
    >
        {#if toast.type === "success"}
            <CheckCircle2 class="w-4 h-4 shrink-0" />
        {:else}
            <AlertCircle class="w-4 h-4 shrink-0" />
        {/if}
        {toast.msg}
    </div>
{/if}

<div
    class="flex-1 p-6 overflow-y-auto bg-bright-snow-50 dark:bg-prussian-blue-900"
>
    <!-- Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
            {$_("export.title")}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {$_("export.subtitle")}
        </p>
    </div>

    <!-- Top row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Date Range -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-500"
                >
                    <Calendar class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.dateRange")}
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <label
                        for="start-date"
                        class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >{$_("export.startDate")}</label
                    >
                    <input
                        id="start-date"
                        type="date"
                        bind:value={startDate}
                        class="w-full px-3 py-2 rounded-xl text-sm
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-800 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                            transition-all"
                    />
                </div>
                <div>
                    <label
                        for="end-date"
                        class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5"
                        >{$_("export.endDate")}</label
                    >
                    <input
                        id="end-date"
                        type="date"
                        bind:value={endDate}
                        class="w-full px-3 py-2 rounded-xl text-sm
                            bg-slate-50 dark:bg-slate-800
                            border border-slate-200 dark:border-slate-700
                            text-slate-800 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
                            transition-all"
                    />
                </div>
            </div>

            <div class="flex gap-2 mb-3">
                {#each [[$_("export.last7"), 7], [$_("export.last30"), 30], [$_("export.yearToDate"), "ytd"]] as [label, val]}
                    <button
                        onclick={() => setRange(val as number | "ytd")}
                        class="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all
                            bg-slate-100 dark:bg-slate-800
                            text-slate-600 dark:text-slate-300
                            border border-slate-200 dark:border-slate-700
                            hover:border-sky-400 hover:text-sky-500
                            active:scale-95"
                    >
                        {label}
                    </button>
                {/each}
            </div>

            {#if sessionCountInRange > 0}
                <p class="text-xs text-slate-400">
                    <span class="text-sky-400 font-semibold"
                        >{sessionCountInRange}</span
                    > sessions in selected range
                </p>
            {:else if userId > 0}
                <p class="text-xs text-slate-400">No sessions in range</p>
            {/if}
        </div>

        <!-- Data Categories -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-500"
                >
                    <List class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.categories")}
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-3">
                {#each categories as cat}
                    <div
                        class="flex items-center justify-between px-3 py-2.5 rounded-xl
                        bg-slate-50 dark:bg-slate-800
                        border transition-colors
                        {cat.enabled
                            ? 'border-sky-300 dark:border-sky-700'
                            : 'border-slate-100 dark:border-slate-700'}"
                    >
                        <span
                            class="text-sm {cat.enabled
                                ? 'text-slate-800 dark:text-white'
                                : 'text-slate-400 dark:text-slate-500'}"
                            >{cat.label()}</span
                        >
                        <button
                            onclick={() => (cat.enabled = !cat.enabled)}
                            aria-label={cat.enabled ? `Disable ${cat.label()}` : `Enable ${cat.label()}`}
                            class="relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0
                                {cat.enabled
                                ? 'bg-sky-400'
                                : 'bg-slate-200 dark:bg-slate-600'}"
                        >
                            <span
                                class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                                {cat.enabled
                                    ? 'translate-x-5'
                                    : 'translate-x-0'}"
                            >
                            </span>
                        </button>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Middle row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Export Format -->
        <div
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
        >
            <div class="flex items-center gap-2 mb-4">
                <div
                    class="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500"
                >
                    <FileText class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.format")}
                </h2>
            </div>

            <div class="flex flex-col gap-2">
                {#each formats as fmt}
                    <button
                        onclick={() => (selectedFormat = fmt.id)}
                        class="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                            {selectedFormat === fmt.id
                            ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
                            border"
                    >
                        <div
                            class="w-9 h-9 rounded-lg
                            {selectedFormat === fmt.id
                                ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-500'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}
                            flex items-center justify-center flex-shrink-0 transition-colors"
                        >
                            <FileText class="w-4 h-4" />
                        </div>
                        <div class="flex-1">
                            <p
                                class="text-sm font-semibold text-slate-800 dark:text-white"
                            >
                                {fmt.label}
                            </p>
                            <p class="text-xs text-slate-400">{fmt.sub}</p>
                        </div>
                        {#if selectedFormat === fmt.id}
                            <div
                                class="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center flex-shrink-0"
                            >
                                <CheckCircle class="w-3.5 h-3.5 text-white" />
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Ready to compile -->
        <div
            class="rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4"
        >
            <div
                class="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center
                shadow-[0_0_40px_rgba(56,189,248,0.15)]"
            >
                <Activity class="w-9 h-9 text-sky-400" />
                <div
                    class="absolute inset-0 rounded-full bg-sky-400/10 animate-pulse"
                ></div>
            </div>

            <div>
                <h2 class="text-xl font-bold text-white mb-2">
                    {$_("export.ready")}
                </h2>
                <p class="text-sm text-slate-400 max-w-xs">
                    {$_("export.readyDesc", {
                        values: {
                            days: daysDiff(),
                            cats: activeCount,
                            fmt: selectedFormat.toUpperCase(),
                        },
                    })}
                </p>
            </div>

            <button
                onclick={generate}
                disabled={generating || activeCount === 0}
                class="flex items-center gap-2 px-8 py-3 rounded-2xl
                    bg-sky-400 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
                    text-white font-bold text-sm
                    shadow-lg shadow-sky-400/30
                    transition-all duration-200 active:scale-95"
            >
                {#if generating}
                    <Loader class="w-4 h-4 animate-spin" />
                    {$_("export.generating")}
                {:else}
                    <Download class="w-4 h-4" />
                    {$_("export.generate")}
                {/if}
            </button>

            <div class="flex items-center gap-4 text-xs">
                <div class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    {$_("export.systemReady")}
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                    <Lock class="w-3 h-3" />
                    {$_("export.encryption")}
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Exports -->
    <div
        class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-5"
    >
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <div
                    class="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-500"
                >
                    <Activity class="w-4 h-4" />
                </div>
                <h2 class="font-semibold text-slate-800 dark:text-white">
                    {$_("export.recent")}
                </h2>
            </div>
        </div>

        {#if exportHistory.length === 0}
            <p class="text-sm text-slate-400 text-center py-6">
                {$_("export.noHistory")}
            </p>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr
                            class="border-b border-slate-100 dark:border-slate-800"
                        >
                            {#each ["Report Name", "Date Generated", "Format", "Categories", "Date Range"] as col}
                                <th
                                    class="text-left text-xs font-bold uppercase tracking-wider text-slate-400 pb-3 pr-4"
                                    >{col}</th
                                >
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each exportHistory as row}
                            <tr
                                class="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                <td class="py-3 pr-4">
                                    <p
                                        class="font-medium text-slate-800 dark:text-white truncate max-w-[180px]"
                                    >
                                        {row.name}
                                    </p>
                                    {#if row.file_path}
                                        <p
                                            class="text-xs text-slate-400 truncate max-w-[180px]"
                                            title={row.file_path}
                                        >
                                            {row.file_path
                                                .split(/[\\/]/)
                                                .pop() ?? row.file_path}
                                        </p>
                                    {/if}
                                </td>
                                <td
                                    class="py-3 pr-4 text-slate-500 dark:text-slate-400 whitespace-nowrap"
                                >
                                    {formatDate(row.created_at)}
                                </td>
                                <td class="py-3 pr-4">
                                    <span
                                        class="px-2 py-0.5 rounded-md text-xs font-bold
                                        {row.format === 'PDF'
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                            : row.format === 'CSV'
                                              ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                                              : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'}"
                                    >
                                        {row.format}
                                    </span>
                                </td>
                                <td
                                    class="py-3 pr-4 text-slate-500 dark:text-slate-400 text-xs"
                                >
                                    {row.categories}
                                </td>
                                <td
                                    class="py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap"
                                >
                                    {row.start_date} → {row.end_date}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
