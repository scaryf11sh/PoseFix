import { writable } from "svelte/store";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
    id: string;
    type: ToastType;
    message: string;
    duration?: number; // ms, default 4000
};

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    function add(type: ToastType, message: string, duration = 4000) {
        const id = crypto.randomUUID();
        update(toasts => [...toasts, { id, type, message, duration }]);
        if (duration > 0) {
            setTimeout(() => remove(id), duration);
        }
        return id;
    }

    function remove(id: string) {
        update(toasts => toasts.filter(t => t.id !== id));
    }

    return {
        subscribe,
        success: (msg: string, duration?: number) => add("success", msg, duration),
        error:   (msg: string, duration?: number) => add("error",   msg, duration),
        warning: (msg: string, duration?: number) => add("warning", msg, duration),
        info:    (msg: string, duration?: number) => add("info",    msg, duration),
        remove,
    };
}

export const toast = createToastStore();
