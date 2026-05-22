import { callAi } from './ai';

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
};

let chatHistory: ChatMessage[] = [];

/**
 * Sends a message to the AI Ergonomics Coach.
 * Maintains a local session history (last 10 messages).
 */
export async function sendCoachMessage(text: string): Promise<string> {
    const sanitized = text.replace(/[<>]/g, '').trim();
    if (!sanitized) return '';

    chatHistory.push({ role: 'user', content: sanitized, timestamp: Date.now() });

    // Keep history manageable for context window
    if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(-10);
    }

    const system = "You are the PoseFix Ergonomics Coach. Help with posture, workstation setup, and breaks. Be professional and concise.";
    const history = chatHistory.map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n');
    
    try {
        const response = await callAi(`${system}\n\n${history}\nCoach:`);
        const reply = response.trim();
        if (reply) {
            chatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
        }
        return reply;
    } catch (e) {
        console.error('[AI-Chat] Coach failed:', e);
        return "I'm having trouble connecting right now. Please try again in a moment.";
    }
}

export function getChatHistory() {
    return [...chatHistory];
}

export function clearChat() {
    chatHistory = [];
}
