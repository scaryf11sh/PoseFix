export type TipState = {
    postureScore: number | null
    metrics: Array<{ id: string; status_code: number }>
    fatigueScore: number | null
    irritationLevel: 'LOW' | 'MEDIUM' | 'HIGH' | null
    blinks: number | null
    sessionMinutes: number
}

type TipDef = {
    id: string
    weight: (s: TipState) => number
}

const TIPS: TipDef[] = [
    {
        id: 'fatigue_high',
        weight: s => (s.fatigueScore != null && s.fatigueScore > 20) || s.irritationLevel === 'HIGH' ? 95 : 0,
    },
    {
        id: 'posture_poor',
        weight: s => s.postureScore != null && s.postureScore < 60 ? 90 : 0,
    },
    {
        id: 'forward_head',
        weight: s => s.metrics.find(m => m.id === 'forward_head_posture')?.status_code === 2 ? 85 : 0,
    },
    {
        id: 'session_long',
        weight: s => s.sessionMinutes > 90 ? 85 : 0,
    },
    {
        id: 'break_needed',
        weight: s => s.sessionMinutes > 60 && s.sessionMinutes <= 90 ? 80 : 0,
    },
    {
        id: 'head_tilt',
        weight: s => s.metrics.find(m => m.id === 'head_tilt_roll')?.status_code === 2 ? 80 : 0,
    },
    {
        id: 'shoulder_asym',
        weight: s => (s.metrics.find(m => m.id === 'shoulder_asymmetry')?.status_code ?? 0) >= 1 ? 75 : 0,
    },
    {
        id: 'blink_low',
        weight: s => s.blinks != null && s.blinks < 12 ? 70 : 0,
    },
    {
        id: 'posture_fair',
        weight: s => s.postureScore != null && s.postureScore >= 60 && s.postureScore < 80 ? 50 : 0,
    },
    {
        id: 'posture_great',
        weight: s => s.postureScore != null && s.postureScore >= 85 ? 30 : 0,
    },
]

const COOLDOWN_KEY = 'posefix_tip_cooldowns'
const COOLDOWN_MS = 5 * 60 * 1000

function loadCooldowns(): Record<string, number> {
    try {
        return JSON.parse(localStorage.getItem(COOLDOWN_KEY) ?? '{}')
    } catch {
        return {}
    }
}

function saveCooldown(id: string) {
    const cd = loadCooldowns()
    cd[id] = Date.now()
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cd))
}

export function selectTip(state: TipState): string | null {
    const now = Date.now()
    const cooldowns = loadCooldowns()

    const best = TIPS
        .map(t => ({ id: t.id, w: t.weight(state) }))
        .filter(t => t.w > 0 && (now - (cooldowns[t.id] ?? 0)) > COOLDOWN_MS)
        .sort((a, b) => b.w - a.w)[0]

    if (!best) return null
    saveCooldown(best.id)
    return best.id
}
