use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        // ─── v1: tablas base ───────────────────────────────────────────────
        Migration {
            version: 1,
            description: "create_users_table",
            sql: "
                CREATE TABLE IF NOT EXISTS users (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    username     TEXT    NOT NULL UNIQUE,
                    email        TEXT    NOT NULL UNIQUE,
                    profession   TEXT,
                    age          INTEGER,
                    avatar_path  TEXT,
                    posture_goal INTEGER NOT NULL DEFAULT 80,
                    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_user_sessions_table",
            sql: "
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id            INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    session_start TEXT    NOT NULL,
                    session_end   TEXT,
                    duration      INTEGER,
                    posture_score INTEGER,
                    warnings      INTEGER NOT NULL DEFAULT 0,
                    fatigue_score INTEGER,
                    eye_distance  REAL,
                    blink_rate    INTEGER,
                    sensor_data   TEXT
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_warnings_table",
            sql: "
                CREATE TABLE IF NOT EXISTS warnings (
                    id             INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id     INTEGER NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
                    warning_type   TEXT,
                    label          TEXT,
                    start          TEXT,
                    duration       INTEGER,
                    severity       INTEGER,
                    resolved       INTEGER NOT NULL DEFAULT 0,
                    resolved_after INTEGER
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_exercises_log_table",
            sql: "
                CREATE TABLE IF NOT EXISTS exercises_log (
                    id           INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    exercise     TEXT    NOT NULL,
                    duration     INTEGER,
                    completed_at TEXT    NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
        // ─── v5: índices para queries frecuentes ───────────────────────────
        Migration {
            version: 5,
            description: "create_indexes",
            sql: "
                CREATE INDEX IF NOT EXISTS idx_sessions_user_id
                    ON user_sessions(user_id);
                CREATE INDEX IF NOT EXISTS idx_sessions_start
                    ON user_sessions(session_start);
                CREATE INDEX IF NOT EXISTS idx_warnings_session_id
                    ON warnings(session_id);
                CREATE INDEX IF NOT EXISTS idx_exercises_user_id
                    ON exercises_log(user_id);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v6: views ─────────────────────────────────────────────────────
        Migration {
            version: 6,
            description: "create_session_summary_view",
            sql: "
                CREATE VIEW IF NOT EXISTS session_summary AS
                SELECT
                    s.id,
                    s.user_id,
                    s.session_start,
                    s.session_end,
                    s.duration,
                    s.posture_score,
                    s.warnings,
                    s.fatigue_score,
                    s.eye_distance,
                    CASE
                        WHEN s.posture_score >= 95 THEN 'EXCELLENT'
                        WHEN s.posture_score >= 80 THEN 'GOOD'
                        WHEN s.posture_score >= 60 THEN 'FAIR'
                        ELSE 'POOR'
                    END AS posture_label,
                    COUNT(w.id) AS total_warnings,
                    SUM(CASE WHEN w.resolved = 1 THEN 1 ELSE 0 END) AS resolved_warnings
                FROM user_sessions s
                LEFT JOIN warnings w ON w.session_id = s.id
                GROUP BY s.id;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "create_weekly_stats_view",
            sql: "
                CREATE VIEW IF NOT EXISTS weekly_stats AS
                SELECT
                    user_id,
                    DATE(session_start)       AS day,
                    ROUND(AVG(posture_score)) AS avg_score,
                    SUM(duration)             AS total_duration,
                    COUNT(*)                  AS session_count,
                    SUM(warnings)             AS total_warnings
                FROM user_sessions
                WHERE session_start >= DATE('now', '-7 days')
                GROUP BY user_id, DATE(session_start);
            ",
            kind: MigrationKind::Up,
        },
        // ─── v8: triggers ──────────────────────────────────────────────────
        Migration {
            version: 8,
            description: "create_close_open_sessions_trigger",
            sql: "
                CREATE TRIGGER IF NOT EXISTS close_open_sessions
                AFTER INSERT ON user_sessions
                BEGIN
                    UPDATE user_sessions
                    SET
                        session_end = datetime('now'),
                        duration    = 0
                    WHERE user_id    = NEW.user_id
                      AND session_end IS NULL
                      AND id         != NEW.id;
                END;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "create_warning_count_triggers",
            sql: "
                CREATE TRIGGER IF NOT EXISTS increment_warning_count
                AFTER INSERT ON warnings
                BEGIN
                    UPDATE user_sessions
                    SET warnings = warnings + 1
                    WHERE id = NEW.session_id;
                END;

                CREATE TRIGGER IF NOT EXISTS decrement_warning_count
                AFTER DELETE ON warnings
                BEGIN
                    UPDATE user_sessions
                    SET warnings = MAX(0, warnings - 1)
                    WHERE id = OLD.session_id;
                END;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "add_password_hash_to_users",
            sql: "ALTER TABLE users ADD COLUMN password_hash TEXT;",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:posefix.db", migrations)
                .build(),
        )
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
