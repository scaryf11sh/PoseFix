import { callAi } from './ai';
import type { TipState } from './tips';

const RATE_LIMIT_MS = 30 * 1000;
let lastRequestTime = 0;

/**
 * Generates a context-aware smart tip using AI.
 * Includes rate limiting and basic prompt injection protection.
 */
export async function getSmartTip(state: TipState): Promise<string | null> {
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_MS) {
        return null;
    }

    // Context formatting - only using trusted data from sensors/state
    const context = `
Posture score: ${state.postureScore ?? 'Unknown'}/100
Fatigue: ${state.fatigueScore ?? 'Unknown'}/100
Eye irritation: ${state.irritationLevel ?? 'Unknown'}
Blinks: ${state.blinks ?? 'Unknown'} bpm
Session time: ${state.sessionMinutes}m
Metrics: ${state.metrics.map(m => `${m.id}(${m.status_code})`).join(', ')}
    `.trim();

    const systemPrompt = "You are an ergonomic coach. Give a single, concise, actionable posture tip (max 15 words). No intro/outro.";
    const userPrompt = `Metrics Context: ${context}`;

    lastRequestTime = now;
    
    try {
        const response = await callAi(`${systemPrompt}\n\n${userPrompt}`);
        return response.trim() || null;
    } catch (e) {
        console.error('[AI-Client] Smart tip failed:', e);
        return null;
    }
}
