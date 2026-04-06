import { writable } from "svelte/store";
import { convertFileSrc } from "@tauri-apps/api/core";
import type { User } from "$lib/db";

type UserStore = {
    user:      User | null;
    avatarUrl: string | null; // puede ser dataUrl o convertFileSrc url
};

function createUserStore() {
    const { subscribe, set, update } = writable<UserStore>({
        user:      null,
        avatarUrl: null,
    });

    return {
        subscribe,

        // Carga el usuario y resuelve el avatar desde la ruta guardada en DB
        setUser(user: User | null) {
            const avatarUrl = user?.avatar_path
                ? convertFileSrc(user.avatar_path)
                : null;
            set({ user, avatarUrl });
        },

        // Usa un dataUrl (base64) para mostrar el avatar inmediatamente
        // sin depender de convertFileSrc que puede tener caché en Tauri
        setAvatarDataUrl(dataUrl: string, path: string) {
            update(s => ({
                avatarUrl: dataUrl,
                user: s.user ? { ...s.user, avatar_path: path } : null,
            }));
        },

        clear() {
            set({ user: null, avatarUrl: null });
        },
    };
}

export const userStore = createUserStore();
