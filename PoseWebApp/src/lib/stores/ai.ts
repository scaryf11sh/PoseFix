import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type AiProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export type AiSettings = {
    enabled: boolean;
    provider: AiProvider;
    apiKey: string;
    model: string;
    baseUrl: string; // for ollama
    features: {
        smartTips: boolean;
        postureAnalysis: boolean;
        exerciseRecommendations: boolean;
    };
};

const DEFAULT_MODELS: Record<AiProvider, string> = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-haiku-4-5-20251001',
    gemini: 'gemini-2.0-flash',
    ollama: 'llama3.2',
};

const DEFAULTS: AiSettings = {
    enabled: false,
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o-mini',
    baseUrl: 'http://localhost:11434',
    features: {
        smartTips: true,
        postureAnalysis: true,
        exerciseRecommendations: true,
    },
};

const AI_KEY = 'posefix_ai';

function load(): AiSettings {
    if (!browser) return DEFAULTS;
    try {
        const raw = localStorage.getItem(AI_KEY);
        return raw ? { ...DEFAULTS, ...JSON.parse(raw), features: { ...DEFAULTS.features, ...JSON.parse(raw).features } } : DEFAULTS;
    } catch { return DEFAULTS; }
}

function createAiStore() {
    const { subscribe, set, update } = writable<AiSettings>(load());
    return {
        subscribe,
        save(s: AiSettings) {
            if (browser) localStorage.setItem(AI_KEY, JSON.stringify(s));
            set(s);
        },
        setProvider(p: AiProvider) {
            update(s => {
                const next = { ...s, provider: p, model: DEFAULT_MODELS[p] };
                if (browser) localStorage.setItem(AI_KEY, JSON.stringify(next));
                return next;
            });
        },
    };
}

export const aiStore = createAiStore();
export { DEFAULT_MODELS };
