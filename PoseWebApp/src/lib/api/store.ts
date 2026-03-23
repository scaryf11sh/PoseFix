// API Store - Reactive state management for API data
import { writable, derived } from 'svelte/store';

import type { SessionData, PoseAngle, UserSettings, VideoStreamConfig } from './services';
import * as api from './services';

// Session state
export const sessions = writable<SessionData[]>([]);
export const activeSession = writable<SessionData | null>(null);
export const sessionLoading = writable(false);
export const sessionError = writable<string | null>(null);

// Pose data state
export const currentPose = writable<PoseAngle | null>(null);
export const poseHistory = writable<PoseAngle[]>([]);
export const streamId = writable<string | null>(null);
export const isStreaming = writable(false);

// Settings state
export const userSettings = writable<UserSettings>({
    breakInterval: 30,
    eyeStrainThreshold: 60,
    notificationsEnabled: true,
    language: 'es'
});

// Weekly score state
export const weeklyScore = writable<{ average: number; trend: number }>({ average: 0, trend: 0 });

// Derived stores
export const poseStatus = derived(currentPose, $currentPose => {
    if (!$currentPose) return 'inactive';
    return $currentPose.status;
});

export const averagePoseAngle = derived(poseHistory, $poseHistory => {
    if ($poseHistory.length === 0) return { neck: 0, back: 0, shoulder: 0 };
    const sum = $poseHistory.reduce((acc, pose) => ({
        neck: acc.neck + pose.neckAngle,
        back: acc.back + pose.backAngle,
        shoulder: acc.shoulder + pose.shoulderAngle
    }), { neck: 0, back: 0, shoulder: 0 });
    return {
        neck: sum.neck / $poseHistory.length,
        back: sum.back / $poseHistory.length,
        shoulder: sum.shoulder / $poseHistory.length
    };
});

// Actions
export async function loadSessions(startDate?: string, endDate?: string) {
    sessionLoading.set(true);
    sessionError.set(null);
    try {
        const data = await api.getSessions(startDate, endDate);
        sessions.set(data);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to load sessions');
    } finally {
        sessionLoading.set(false);
    }
}

export async function startSession() {
    sessionLoading.set(true);
    try {
        const newSession: SessionData = {
            id: crypto.randomUUID(),
            startTime: new Date().toISOString(),
            score: 0,
            poseAngles: []
        };
        const result = await api.saveSession(newSession);
        activeSession.set({ ...newSession, id: result.id });
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to start session');
    } finally {
        sessionLoading.set(false);
    }
}

export async function endSession() {
    const session = activeSession.get();
    if (!session) return;

    try {
        const updatedSession = {
            ...session,
            endTime: new Date().toISOString()
        };
        await api.updateSession(session.id, updatedSession);
        activeSession.set(null);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to end session');
    }
}

export async function startVideoStream(config?: VideoStreamConfig) {
    try {
        const result = await api.startVideoStream(config);
        streamId.set(result.streamId);
        isStreaming.set(true);

        // Start WebSocket for real-time updates
        const ws = api.createPoseWebSocket(result.streamId, (pose) => {
            currentPose.set(pose);
            poseHistory.update(history => [...history.slice(-99), pose]);
        });

        return result.streamId;
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to start video stream');
        return null;
    }
}

export async function stopVideoStream() {
    const id = streamId.get();
    if (!id) return;

    try {
        await api.stopVideoStream(id);
        streamId.set(null);
        isStreaming.set(false);
        currentPose.set(null);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to stop video stream');
    }
}

export async function loadSettings() {
    try {
        const settings = await api.getUserSettings();
        userSettings.set(settings);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to load settings');
    }
}

export async function saveSettings(settings: UserSettings) {
    try {
        await api.saveUserSettings(settings);
        userSettings.set(settings);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to save settings');
    }
}

export async function loadWeeklyScore() {
    try {
        const score = await api.getWeeklyScore();
        weeklyScore.set(score);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to load weekly score');
    }
}

export async function exportData(format: 'csv' | 'json' | 'pdf', startDate: string, endDate: string) {
    try {
        return await api.exportData(format, startDate, endDate);
    } catch (e) {
        sessionError.set(e instanceof Error ? e.message : 'Failed to export data');
        return null;
    }
}

export async function checkApiHealth() {
    const rustHealthy = await api.checkRustApiHealth();
    const pythonHealthy = await api.checkPythonApiHealth();
    return { rust: rustHealthy, python: pythonHealthy };
}
