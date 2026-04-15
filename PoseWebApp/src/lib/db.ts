import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

async function getDb(): Promise<Database> {
    if (!db) {
        db = await Database.load("sqlite:posefix.db");
        // Foreign keys están desactivadas por default en SQLite
        await db.execute("PRAGMA foreign_keys = ON");
        await db.execute("PRAGMA journal_mode = WAL"); // mejor performance
    }
    return db;
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type User = {
    id: number;
    username: string;     // handle único @johndoe
    full_name?: string;   // nombre real "John Doe"
    email: string;
    profession?: string;
    age?: number;
    avatar_path?: string;
    posture_goal: number;
    created_at: string;
};

// Verifica si un username ya está tomado por otro usuario
export async function isUsernameTaken(username: string, excludeId?: number): Promise<boolean> {
    const db = await getDb();
    const rows = await db.select<{ id: number }[]>(
        excludeId
            ? "SELECT id FROM users WHERE username = $1 AND id != $2"
            : "SELECT id FROM users WHERE username = $1",
        excludeId ? [username, excludeId] : [username]
    );
    return rows.length > 0;
}

export type UserSession = {
    id: number;
    user_id: number;
    session_start: string;
    session_end?: string;
    duration?: number;        // segundos
    posture_score?: number;
    warnings: number;
    fatigue_score?: number;
    eye_distance?: number;
    blink_rate?: number;
    sensor_data?: string;     // JSON string
};

export type SessionSummary = UserSession & {
    posture_label: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
    total_warnings: number;
    resolved_warnings: number;
};

export type WeeklyStats = {
    user_id: number;
    day: string;              // "YYYY-MM-DD"
    avg_score: number;
    total_duration: number;   // segundos
    session_count: number;
    total_warnings: number;
};

export type Warning = {
    id: number;
    session_id: number;
    warning_type?: string;
    label?: string;
    start?: string;
    duration?: number;        // segundos
    severity?: number;
    resolved: number;         // 0 | 1
    resolved_after?: number;  // segundos
};

export type ExerciseLog = {
    id: number;
    user_id: number;
    exercise: string;
    duration?: number;
    completed_at: string;
};

export type SessionStats = {
    total_sessions: number;
    avg_score: number;
    total_duration: number;
    total_warnings: number;
};

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────

export async function createUser(
    data: Omit<User, "id" | "created_at">
): Promise<number> {
    const db = await getDb();
    const result = await db.execute(
        `INSERT INTO users (username, email, profession, age, avatar_path, posture_goal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            data.username,
            data.email,
            data.profession ?? null,
            data.age ?? null,
            data.avatar_path ?? null,
            data.posture_goal,
        ]
    );
    return result.lastInsertId ?? 0;
}

export async function getUser(id: number): Promise<User | null> {
    const db = await getDb();
    const rows = await db.select<User[]>(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    return rows[0] ?? null;
}

export async function getFirstUser(): Promise<User | null> {
    const db = await getDb();
    const rows = await db.select<User[]>(
        "SELECT * FROM users ORDER BY id ASC LIMIT 1"
    );
    return rows[0] ?? null;
}

export async function updateUser(
    id: number,
    data: Partial<Omit<User, "id" | "created_at">>
): Promise<void> {
    const db = await getDb();
    const keys = Object.keys(data);
    if (keys.length === 0) return;
    const fields = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");
    const values = [id, ...Object.values(data)];
    await db.execute(`UPDATE users SET ${fields} WHERE id = $1`, values);
}

export async function updateAvatar(id: number, avatarPath: string): Promise<void> {
    const db = await getDb();
    await db.execute(
        "UPDATE users SET avatar_path = $1 WHERE id = $2",
        [avatarPath, id]
    );
}

export async function userExists(): Promise<boolean> {
    const db = await getDb();
    const rows = await db.select<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM users"
    );
    return (rows[0]?.count ?? 0) > 0;
}

// ─────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────

export async function startSession(userId: number): Promise<number> {
    const db = await getDb();
    const result = await db.execute(
        `INSERT INTO user_sessions (user_id, session_start)
         VALUES ($1, datetime('now'))`,
        [userId]
    );
    return result.lastInsertId ?? 0;
}

export async function endSession(
    sessionId: number,
    data: {
        posture_score: number;
        fatigue_score: number;
        eye_distance: number;
        blink_rate: number;
        sensor_data?: object;
    }
): Promise<void> {
    const db = await getDb();
    await db.execute(
        `UPDATE user_sessions SET
            session_end   = datetime('now'),
            duration      = CAST((julianday('now') - julianday(session_start)) * 86400 AS INTEGER),
            posture_score = $2,
            fatigue_score = $3,
            eye_distance  = $4,
            blink_rate    = $5,
            sensor_data   = $6
         WHERE id = $1`,
        [
            sessionId,
            data.posture_score,
            data.fatigue_score,
            data.eye_distance,
            data.blink_rate,
            data.sensor_data ? JSON.stringify(data.sensor_data) : null,
        ]
    );
}

export async function getSessions(
    userId: number,
    limit = 10,
    offset = 0
): Promise<UserSession[]> {
    const db = await getDb();
    return await db.select<UserSession[]>(
        `SELECT * FROM user_sessions
         WHERE user_id = $1
         ORDER BY session_start DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
}

export async function getSessionSummaries(
    userId: number,
    limit = 10,
    offset = 0
): Promise<SessionSummary[]> {
    const db = await getDb();
    return await db.select<SessionSummary[]>(
        `SELECT * FROM session_summary
         WHERE user_id = $1
         ORDER BY session_start DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
}

export async function getSessionCount(userId: number): Promise<number> {
    const db = await getDb();
    const rows = await db.select<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM user_sessions WHERE user_id = $1",
        [userId]
    );
    return rows[0]?.count ?? 0;
}

export async function getSessionStats(userId: number): Promise<SessionStats> {
    const db = await getDb();
    const rows = await db.select<SessionStats[]>(
        `SELECT
            COUNT(*)                  AS total_sessions,
            ROUND(AVG(posture_score)) AS avg_score,
            COALESCE(SUM(duration), 0)  AS total_duration,
            COALESCE(SUM(warnings), 0)  AS total_warnings
         FROM user_sessions
         WHERE user_id = $1`,
        [userId]
    );
    return rows[0] ?? { total_sessions: 0, avg_score: 0, total_duration: 0, total_warnings: 0 };
}

export async function getWeeklyStats(userId: number): Promise<WeeklyStats[]> {
    const db = await getDb();
    return await db.select<WeeklyStats[]>(
        "SELECT * FROM weekly_stats WHERE user_id = $1 ORDER BY day ASC",
        [userId]
    );
}

export async function getActiveSession(userId: number): Promise<UserSession | null> {
    const db = await getDb();
    const rows = await db.select<UserSession[]>(
        `SELECT * FROM user_sessions
         WHERE user_id = $1 AND session_end IS NULL
         ORDER BY session_start DESC LIMIT 1`,
        [userId]
    );
    return rows[0] ?? null;
}

export async function getSessionById(sessionId: number): Promise<UserSession | null> {
    const db = await getDb();
    const rows = await db.select<UserSession[]>(
        "SELECT * FROM user_sessions WHERE id = $1",
        [sessionId]
    );
    return rows[0] ?? null;
}

export async function getSessionCountInRange(
    userId: number,
    startDate: string,
    endDate: string
): Promise<number> {
    const db = await getDb();
    const rows = await db.select<{ count: number }[]>(
        `SELECT COUNT(*) as count FROM user_sessions
         WHERE user_id = $1 AND session_start >= $2 AND session_start <= $3`,
        [userId, startDate, endDate]
    );
    return rows[0]?.count ?? 0;
}

// ─────────────────────────────────────────────
// WARNINGS
// ─────────────────────────────────────────────

export async function addWarning(
    data: Omit<Warning, "id" | "resolved">
): Promise<number> {
    const db = await getDb();
    const result = await db.execute(
        `INSERT INTO warnings (session_id, warning_type, label, start, duration, severity)
         VALUES ($1, $2, $3, datetime('now'), $4, $5)`,
        [
            data.session_id,
            data.warning_type ?? null,
            data.label ?? null,
            data.duration ?? null,
            data.severity ?? null,
        ]
    );
    return result.lastInsertId ?? 0;
}

export async function resolveWarning(
    id: number,
    resolvedAfter: number
): Promise<void> {
    const db = await getDb();
    await db.execute(
        "UPDATE warnings SET resolved = 1, resolved_after = $2 WHERE id = $1",
        [id, resolvedAfter]
    );
}

export async function getSessionWarnings(
    sessionId: number
): Promise<Warning[]> {
    const db = await getDb();
    return await db.select<Warning[]>(
        "SELECT * FROM warnings WHERE session_id = $1 ORDER BY start ASC",
        [sessionId]
    );
}

// ─────────────────────────────────────────────
// EXERCISES
// ─────────────────────────────────────────────

export async function logExercise(
    userId: number,
    exercise: string,
    duration?: number
): Promise<void> {
    const db = await getDb();
    await db.execute(
        `INSERT INTO exercises_log (user_id, exercise, duration)
         VALUES ($1, $2, $3)`,
        [userId, exercise, duration ?? null]
    );
}

export async function getExerciseLog(
    userId: number,
    limit = 20
): Promise<ExerciseLog[]> {
    const db = await getDb();
    return await db.select<ExerciseLog[]>(
        `SELECT * FROM exercises_log
         WHERE user_id = $1
         ORDER BY completed_at DESC
         LIMIT $2`,
        [userId, limit]
    );
}

export async function getExerciseCount(userId: number): Promise<number> {
    const db = await getDb();
    const rows = await db.select<{ count: number }[]>(
        "SELECT COUNT(*) as count FROM exercises_log WHERE user_id = $1",
        [userId]
    );
    return rows[0]?.count ?? 0;
}

export type ExerciseLogExtended = {
    id: number;
    user_id: number;
    exercise: string;
    exercise_id?: string;
    category?: string;
    difficulty?: string;
    duration?: number;
    points: number;
    source?: string;
    completed_at: string;
};

export type ExerciseDailyStat = {
    day: string;            // 'YYYY-MM-DD'
    exercise_count: number;
    total_points: number;
    total_duration_min: number;
};

export type ExerciseTotals = {
    total_exercises: number;
    total_points: number;
    best_day_points: number;
};

function localNow(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export async function logExerciseWithScore(
    userId: number,
    data: {
        title: string;
        exercise_id: string;
        category: string;
        difficulty?: string;
        durationVal: number;
        points: number;
        source: string;
    }
): Promise<void> {
    const db = await getDb();
    await db.execute(
        `INSERT INTO exercises_log (user_id, exercise, exercise_id, category, difficulty, duration, points, source, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [userId, data.title, data.exercise_id, data.category, data.difficulty ?? null, data.durationVal, data.points, data.source, localNow()]
    );
}

export async function getExerciseDailyStats(userId: number, days = 14): Promise<ExerciseDailyStat[]> {
    const db = await getDb();
    return await db.select<ExerciseDailyStat[]>(
        `SELECT day, exercise_count, total_points, total_duration_min
         FROM exercise_daily_stats
         WHERE user_id = $1 AND day >= DATE('now', 'localtime', $2)
         ORDER BY day ASC`,
        [userId, `-${days} days`]
    );
}

export async function getExerciseTotals(userId: number): Promise<ExerciseTotals> {
    const db = await getDb();
    const rows = await db.select<{ total_exercises: number; total_points: number }[]>(
        `SELECT COUNT(*) as total_exercises, COALESCE(SUM(points), 0) as total_points
         FROM exercises_log WHERE user_id = $1`,
        [userId]
    );
    const best = await db.select<{ best: number }[]>(
        `SELECT COALESCE(MAX(total_points), 0) as best FROM exercise_daily_stats WHERE user_id = $1`,
        [userId]
    );
    return {
        total_exercises: rows[0]?.total_exercises ?? 0,
        total_points: rows[0]?.total_points ?? 0,
        best_day_points: best[0]?.best ?? 0,
    };
}

export async function getRecentExerciseLogs(userId: number, limit = 8): Promise<ExerciseLogExtended[]> {
    const db = await getDb();
    return await db.select<ExerciseLogExtended[]>(
        `SELECT * FROM exercises_log WHERE user_id = $1 ORDER BY completed_at DESC LIMIT $2`,
        [userId, limit]
    );
}

// ─────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────

export type ExportRecord = {
    id: number;
    user_id: number;
    name: string;
    format: string;
    categories: string;
    start_date: string;
    end_date: string;
    file_path?: string;
    created_at: string;
};

export async function getSessionsInRange(
    userId: number,
    startDate: string,
    endDate: string
): Promise<UserSession[]> {
    const db = await getDb();
    return await db.select<UserSession[]>(
        `SELECT * FROM user_sessions
         WHERE user_id = $1
           AND session_start >= $2
           AND session_start <= $3 || ' 23:59:59'
           AND session_end IS NOT NULL
         ORDER BY session_start ASC`,
        [userId, startDate, endDate]
    );
}

export async function getExercisesInRange(
    userId: number,
    startDate: string,
    endDate: string
): Promise<ExerciseLogExtended[]> {
    const db = await getDb();
    return await db.select<ExerciseLogExtended[]>(
        `SELECT * FROM exercises_log
         WHERE user_id = $1
           AND completed_at >= $2
           AND completed_at <= $3 || ' 23:59:59'
         ORDER BY completed_at ASC`,
        [userId, startDate, endDate]
    );
}

export async function saveExportRecord(
    userId: number,
    name: string,
    format: string,
    categories: string,
    startDate: string,
    endDate: string,
    filePath?: string
): Promise<number> {
    const db = await getDb();
    const result = await db.execute(
        `INSERT INTO export_history (user_id, name, format, categories, start_date, end_date, file_path)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, name, format, categories, startDate, endDate, filePath ?? null]
    );
    return result.lastInsertId ?? 0;
}

export async function getExportHistory(
    userId: number,
    limit = 10
): Promise<ExportRecord[]> {
    const db = await getDb();
    return await db.select<ExportRecord[]>(
        `SELECT * FROM export_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2`,
        [userId, limit]
    );
}
