import Database from "@tauri-apps/plugin-sql";
import { getUser, type User } from "$lib/db";

let db: Database | null = null;

async function getDb(): Promise<Database> {
    if (!db) {
        db = await Database.load("sqlite:posefix.db");
        await db.execute("PRAGMA foreign_keys = ON");
        await db.execute("PRAGMA journal_mode = WAL");
    }
    return db;
}

// ─────────────────────────────────────────────
// HASH
// ─────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────

export async function registerUser(data: {
    username: string;
    email: string;
    password: string;
    profession?: string;
    age?: number;
}): Promise<{ success: true; userId: number } | { success: false; error: "email_taken" }> {
    const database = await getDb();

    const existing = await database.select<{ id: number }[]>(
        "SELECT id FROM users WHERE email = $1",
        [data.email]
    );
    if (existing.length > 0) return { success: false, error: "email_taken" };

    const hash = await hashPassword(data.password);
    const result = await database.execute(
        `INSERT INTO users (username, email, password_hash, profession, age, posture_goal)
         VALUES ($1, $2, $3, $4, $5, 80)`,
        [data.username, data.email, hash, data.profession ?? null, data.age ?? null]
    );

    return { success: true, userId: result.lastInsertId ?? 0 };
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────

export async function loginUser(data: {
    email: string;
    password: string;
}): Promise<{ success: true; user: User } | { success: false; error: "invalid_credentials" }> {
    const database = await getDb();
    const hash = await hashPassword(data.password);

    const rows = await database.select<User[]>(
        "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
        [data.email, hash]
    );

    if (rows.length === 0) return { success: false, error: "invalid_credentials" };
    return { success: true, user: rows[0] };
}

// ─────────────────────────────────────────────
// SESSION HELPERS (localStorage)
// ─────────────────────────────────────────────

export function setCurrentUser(userId: number): void {
    localStorage.setItem("userId", userId.toString());
}

export function clearCurrentUser(): void {
    localStorage.removeItem("userId");
}

export async function getCurrentUser(): Promise<User | null> {
    if (typeof localStorage === "undefined") return null;
    const id = localStorage.getItem("userId");
    if (!id) return null;
    return getUser(parseInt(id));
}
