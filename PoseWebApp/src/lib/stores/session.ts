import { writable } from "svelte/store";

/** Globally-shared active session ID. Null means no active session. */
export const sessionStore = writable<number | null>(null);

/**
 * Live posture score from the camera page during an active session.
 * Written by camera/+page.svelte, read by dashboard +page.svelte on session stop.
 * Null = no live data yet.
 */
export const livePostureScore = writable<number | null>(null);
