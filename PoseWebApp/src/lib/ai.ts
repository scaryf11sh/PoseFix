import { invoke } from '@tauri-apps/api/core';
import { get } from 'svelte/store';
import { aiStore } from './stores/ai';

export async function callAi(prompt: string): Promise<string> {
    const cfg = get(aiStore);
    if (!cfg.enabled || !cfg.apiKey) return '';
    try {
        return await invoke<string>('call_ai', {
            req: {
                provider: cfg.provider,
                api_key: cfg.apiKey,
                model: cfg.model,
                prompt,
                base_url: cfg.provider === 'ollama' ? cfg.baseUrl : null,
            }
        });
    } catch (e) {
        console.warn('[AI] call failed:', e);
        return '';
    }
}
