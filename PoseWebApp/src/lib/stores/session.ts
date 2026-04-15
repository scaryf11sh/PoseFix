import { writable } from "svelte/store";

/** Globally-shared active session ID. Null means no active session. */
export const sessionStore = writable<number | null>(null);
