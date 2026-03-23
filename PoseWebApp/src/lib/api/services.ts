// API Services - PoseFix Backend Integration
// Rust API: Database operations (sessions, scores, settings)
// Python API: Video streaming and pose detection

export interface SessionData {
    id: string;
    startTime: string;
    endTime?: string;
    score: number;
    poseAngles: PoseAngle[];
}

export interface PoseAngle {
    timestamp: string;
    neckAngle: number;
    backAngle: number;
    shoulderAngle: number;
    status: 'good' | 'warning' | 'bad';
}

export interface UserSettings {
    breakInterval: number; // minutes
    eyeStrainThreshold: number; // minutes
    notificationsEnabled: boolean;
    language: 'es' | 'en';
}

export interface VideoStreamConfig {
    resolution: { width: number; height: number };
    fps: number;
    format: 'mjpeg' | 'h264';
}

// Rust API endpoints (database)
const RUST_API_BASE = 'http://localhost:8080/api/v1';

export async function saveSession(session: SessionData): Promise<{ id: string }> {
    const response = await fetch(`${RUST_API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
    });
    if (!response.ok) throw new Error('Failed to save session');
    return response.json();
}

export async function getSessions(startDate?: string, endDate?: string): Promise<SessionData[]> {
    const params = new URLSearchParams();
    if (startDate) params.set('start', startDate);
    if (endDate) params.set('end', endDate);

    const response = await fetch(`${RUST_API_BASE}/sessions?${params}`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
}

export async function updateSession(id: string, data: Partial<SessionData>): Promise<void> {
    const response = await fetch(`${RUST_API_BASE}/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update session');
}

export async function deleteSession(id: string): Promise<void> {
    const response = await fetch(`${RUST_API_BASE}/sessions/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete session');
}

export async function getWeeklyScore(): Promise<{ average: number; trend: number }> {
    const response = await fetch(`${RUST_API_BASE}/scores/weekly`);
    if (!response.ok) throw new Error('Failed to fetch weekly score');
    return response.json();
}

export async function getUserSettings(): Promise<UserSettings> {
    const response = await fetch(`${RUST_API_BASE}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
    const response = await fetch(`${RUST_API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to save settings');
}

export async function exportData(format: 'csv' | 'json' | 'pdf', startDate: string, endDate: string): Promise<Blob> {
    const params = new URLSearchParams({ format, start: startDate, end: endDate });
    const response = await fetch(`${RUST_API_BASE}/export?${params}`);
    if (!response.ok) throw new Error('Failed to export data');
    return response.blob();
}

// Python API endpoints (video/pose detection)
const PYTHON_API_BASE = 'http://localhost:5000/api/v1';

export async function startVideoStream(config?: VideoStreamConfig): Promise<{ streamId: string }> {
    const response = await fetch(`${PYTHON_API_BASE}/video/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config || { resolution: { width: 1280, height: 720 }, fps: 30, format: 'mjpeg' })
    });
    if (!response.ok) throw new Error('Failed to start video stream');
    return response.json();
}

export async function stopVideoStream(streamId: string): Promise<void> {
    const response = await fetch(`${PYTHON_API_BASE}/video/stop/${streamId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to stop video stream');
}

export async function getPoseData(streamId: string): Promise<PoseAngle> {
    const response = await fetch(`${PYTHON_API_BASE}/pose/${streamId}/current`);
    if (!response.ok) throw new Error('Failed to fetch pose data');
    return response.json();
}

export async function getVideoStream(streamId: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${PYTHON_API_BASE}/video/stream/${streamId}`);
    if (!response.ok || !response.body) throw new Error('Failed to get video stream');
    return response.body;
}

export async function calibrateCamera(): Promise<{ matrix: number[]; distortion: number[] }> {
    const response = await fetch(`${PYTHON_API_BASE}/camera/calibrate`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to calibrate camera');
    return response.json();
}

// WebSocket for real-time pose updates
export function createPoseWebSocket(streamId: string, onPoseUpdate: (pose: PoseAngle) => void): WebSocket {
    const ws = new WebSocket(`ws://localhost:5000/ws/pose/${streamId}`);

    ws.onmessage = (event) => {
        const pose = JSON.parse(event.data) as PoseAngle;
        onPoseUpdate(pose);
    };

    return ws;
}

// Health check endpoints
export async function checkRustApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${RUST_API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}

export async function checkPythonApiHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${PYTHON_API_BASE}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
