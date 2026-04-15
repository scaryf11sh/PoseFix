import type { Exercise } from '$lib/exercises';
import { localExercises } from '$lib/exercises';
import { YOGA_ES, TAGS_ES, translateTag } from '$lib/i18n/yoga-es';

// ── ExerciseDB (RapidAPI) ────────────────────────────────────────────────────

const EDBKEY  = '41971f9f1emshc411ec3d031b22dp175bbfjsn803eeed97cc5';
const EDBHOST = 'exercisedb.p.rapidapi.com';
const EDB_BASE = 'https://exercisedb.p.rapidapi.com';
const EDB_HEADERS = {
    'x-rapidapi-key':  EDBKEY,
    'x-rapidapi-host': EDBHOST,
};

// Body parts available in ExerciseDB
const EDB_BODY_PARTS = [
    'back', 'cardio', 'chest', 'lower arms', 'lower legs',
    'neck', 'shoulders', 'upper arms', 'upper legs', 'waist',
];

// ExerciseDB bodyPart → our filter area
const EDB_PART_AREA: Record<string, string[]> = {
    'back':        ['Back'],
    'cardio':      ['Full Body'],
    'chest':       ['Chest'],
    'lower arms':  ['Shoulders'],
    'lower legs':  ['Legs'],
    'neck':        ['Neck'],
    'shoulders':   ['Shoulders'],
    'upper arms':  ['Shoulders'],
    'upper legs':  ['Legs'],
    'waist':       ['Core'],
};

// ExerciseDB target muscle → secondary area tag
const TARGET_AREA: Record<string, string> = {
    abs:                   'Core',
    quads:                 'Legs',
    glutes:                'Legs',
    hamstrings:            'Legs',
    calves:                'Legs',
    adductors:             'Legs',
    abductors:             'Legs',
    lats:                  'Back',
    traps:                 'Back',
    'upper back':          'Back',
    spine:                 'Back',
    pectorals:             'Chest',
    'serratus anterior':   'Chest',
    delts:                 'Shoulders',
    biceps:                'Shoulders',
    triceps:               'Shoulders',
    forearms:              'Shoulders',
    'levator scapulae':    'Neck',
    'cardiovascular system': 'Full Body',
};

// ExerciseDB category → our category display key
const EDB_CATEGORY_MAP: Record<string, string> = {
    strength:               'strength',
    cardio:                 'cardio',
    stretching:             'stretching',
    plyometrics:            'plyometrics',
    powerlifting:           'powerlifting',
    'olympic weightlifting': 'olympic',
};

// Duration estimates by category
function edbDuration(category: string): { str: string; val: number } {
    const map: Record<string, { str: string; val: number }> = {
        strength:    { str: '3 min', val: 3 },
        cardio:      { str: '10 min', val: 10 },
        stretching:  { str: '2 min', val: 2 },
        plyometrics: { str: '5 min', val: 5 },
    };
    return map[category] ?? { str: '3 min', val: 3 };
}

// ── Unsplash images by target muscle ────────────────────────────────────────
// More specific than plain body-part fallbacks
const BASE_UNS = 'https://images.unsplash.com/';
const UNS_Q    = '?w=400&h=300&fit=crop&auto=format';

const TARGET_IMG: Record<string, string> = {
    abs:                    `${BASE_UNS}photo-1571019614242-c5c5dee9f50b${UNS_Q}`,
    quads:                  `${BASE_UNS}photo-1595078475328-1ab05d0a6a0e${UNS_Q}`,
    glutes:                 `${BASE_UNS}photo-1434682881908-b43d0467b798${UNS_Q}`,
    hamstrings:             `${BASE_UNS}photo-1544367567-0f2fcb009e0b${UNS_Q}`,
    calves:                 `${BASE_UNS}photo-1527933053326-89d1746b76b9${UNS_Q}`,
    lats:                   `${BASE_UNS}photo-1571019613576-2b22c76fd955${UNS_Q}`,
    traps:                  `${BASE_UNS}photo-1571019614242-c5c5dee9f50b${UNS_Q}`,
    'upper back':           `${BASE_UNS}photo-1517838277536-f5f99be501cd${UNS_Q}`,
    pectorals:              `${BASE_UNS}photo-1571019613576-2b22c76fd955${UNS_Q}`,
    'serratus anterior':    `${BASE_UNS}photo-1571019613576-2b22c76fd955${UNS_Q}`,
    delts:                  `${BASE_UNS}photo-1581009137042-c552e485697a${UNS_Q}`,
    biceps:                 `${BASE_UNS}photo-1583454110551-21f2fa2afe61${UNS_Q}`,
    triceps:                `${BASE_UNS}photo-1583454110551-21f2fa2afe61${UNS_Q}`,
    forearms:               `${BASE_UNS}photo-1583454110551-21f2fa2afe61${UNS_Q}`,
    adductors:              `${BASE_UNS}photo-1545389336-cf090694435e${UNS_Q}`,
    abductors:              `${BASE_UNS}photo-1595078475328-1ab05d0a6a0e${UNS_Q}`,
    spine:                  `${BASE_UNS}photo-1506126613408-eca07ce68773${UNS_Q}`,
    'cardiovascular system':`${BASE_UNS}photo-1476480862126-209bfaa8edc8${UNS_Q}`,
    'levator scapulae':     `${BASE_UNS}photo-1518611012118-696072aa579a${UNS_Q}`,
};

const PART_IMG: Record<string, string> = {
    Neck:        `${BASE_UNS}photo-1518611012118-696072aa579a${UNS_Q}`,
    Shoulders:   `${BASE_UNS}photo-1581009137042-c552e485697a${UNS_Q}`,
    Back:        `${BASE_UNS}photo-1506126613408-eca07ce68773${UNS_Q}`,
    Core:        `${BASE_UNS}photo-1534367507873-d2d7e24c797f${UNS_Q}`,
    Hips:        `${BASE_UNS}photo-1588286840104-8957b019727f${UNS_Q}`,
    Legs:        `${BASE_UNS}photo-1545389336-cf090694435e${UNS_Q}`,
    Chest:       `${BASE_UNS}photo-1571019613576-2b22c76fd955${UNS_Q}`,
    'Full Body': `${BASE_UNS}photo-1544367567-0f2fcb009e0b${UNS_Q}`,
};

/** Authenticated image URL — must be fetched with RapidAPI headers, not used directly in <img src>. */
export function edbImageUrl(id: string, resolution: 180 | 360 | 720 = 360): string {
    return `${EDB_BASE}/image?exerciseId=${id}&resolution=${resolution}`;
}

function edbFallbackImage(target: string, areas: string[]): string {
    return TARGET_IMG[target] ?? PART_IMG[areas[0]] ?? `${BASE_UNS}photo-1544367567-0f2fcb009e0b${UNS_Q}`;
}

// ── ExerciseDB raw type ──────────────────────────────────────────────────────
interface EdbExercise {
    id: string;
    name: string;
    bodyPart: string;
    target: string;
    secondaryMuscles: string[];
    equipment: string;
    instructions: string[];
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    gifUrl?: string;
}

function normalizeEdb(raw: EdbExercise): Exercise {
    const areas = EDB_PART_AREA[raw.bodyPart] ?? ['Full Body'];
    // Add secondary area from target muscle if different
    const targetArea = TARGET_AREA[raw.target];
    if (targetArea && !areas.includes(targetArea)) areas.push(targetArea);

    const dur = edbDuration(raw.category);
    const tags = [
        raw.bodyPart,
        raw.target,
        ...(raw.equipment !== 'body weight' ? [raw.equipment] : ['Body Weight']),
    ].filter(Boolean);

    // Store authenticated API image URL — ExerciseCard will fetch it with headers
    const image = raw.gifUrl || edbImageUrl(raw.id);

    return {
        id:          `edb-${raw.id}`,
        slug:        raw.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title:       titleCase(raw.name),
        duration:    dur.str,
        durationVal: dur.val,
        tags,
        area:        areas,
        image,
        hasVideo:    false,
        description: raw.description,
        steps:       raw.instructions,
        muscles:     [raw.target, ...raw.secondaryMuscles].join(', '),
        category:    EDB_CATEGORY_MAP[raw.category] ?? raw.category,
        difficulty:  raw.difficulty,
        source:      'exercisedb',
    };
}

function titleCase(s: string): string {
    return s.replace(/\b\w/g, c => c.toUpperCase());
}

async function fetchExerciseDB(): Promise<Exercise[]> {
    // Fetch all body parts in parallel (free tier: 10 per request)
    const results = await Promise.allSettled(
        EDB_BODY_PARTS.map(part =>
            fetch(`${EDB_BASE}/exercises/bodyPart/${encodeURIComponent(part)}?limit=10&offset=0`, {
                headers: EDB_HEADERS,
                signal: AbortSignal.timeout(10000),
            })
            .then(r => r.ok ? r.json() as Promise<EdbExercise[]> : Promise.reject(r.status))
        )
    );

    const exercises: Exercise[] = [];
    const seen = new Set<string>();

    for (const r of results) {
        if (r.status === 'rejected') continue;
        for (const raw of r.value) {
            if (seen.has(raw.id)) continue;
            seen.add(raw.id);
            try {
                exercises.push(normalizeEdb(raw));
            } catch { /* skip malformed entries */ }
        }
    }

    return exercises;
}

// ── Body-part normalization (yoga APIs) ─────────────────────────────────────

const YOGA_PART_AREA: Record<string, string> = {
    Core: 'Core',
    'Abdominal Muscle': 'Core',
    'Digestive Organs': 'Core',
    'Reproductive Organs': 'Core',
    'Pelvic Muscle': 'Hips',
    Back: 'Back',
    Spine: 'Back',
    'Lower Back': 'Back',
    Shoulders: 'Shoulders',
    Arms: 'Shoulders',
    'Upper Body': 'Shoulders',
    Elbow: 'Shoulders',
    Wrists: 'Shoulders',
    Hip: 'Hips',
    Hips: 'Hips',
    Groins: 'Hips',
    Legs: 'Legs',
    'Lower Body': 'Legs',
    Hamstrings: 'Legs',
    Quadriceps: 'Legs',
    Thighs: 'Legs',
    Calves: 'Legs',
    Glutes: 'Legs',
    Knees: 'Legs',
    Ankle: 'Legs',
    Chest: 'Chest',
    'Respiratory Muscles': 'Chest',
    Neck: 'Neck',
    'Entire Body': 'Full Body',
    'Each part of body at cellular level': 'Full Body',
};

function mapToAreas(parts: string[]): string[] {
    const areas = new Set<string>();
    for (const p of parts) {
        const a = YOGA_PART_AREA[p];
        if (a) areas.add(a);
    }
    return areas.size > 0 ? [...areas] : ['Full Body'];
}

const CAT_AREAS: Record<string, string[]> = {
    'Core Strength': ['Core', 'Back'],
    'Hip-Opening':   ['Hips', 'Legs'],
    Backbend:        ['Back', 'Chest'],
    'Forward Bend':  ['Back', 'Legs'],
    Inversions:      ['Full Body', 'Shoulders'],
    Seated:          ['Hips', 'Back'],
    Restorative:     ['Full Body'],
    Standing:        ['Legs', 'Core'],
    Balancing:       ['Core', 'Legs'],
    Twists:          ['Back', 'Core'],
};

const CAT_DIFFICULTY: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    'Core Strength': 'intermediate',
    'Hip-Opening':   'beginner',
    Backbend:        'intermediate',
    'Forward Bend':  'beginner',
    Inversions:      'advanced',
    Seated:          'beginner',
    Restorative:     'beginner',
    Standing:        'beginner',
    Balancing:       'intermediate',
    Twists:          'intermediate',
};

function fallbackImage(areas: string[]): string {
    for (const a of areas) {
        if (PART_IMG[a]) return PART_IMG[a];
    }
    return `${BASE_UNS}photo-1544367567-0f2fcb009e0b${UNS_Q}`;
}

// ── LunaticPrakash (yoga, fallback) ─────────────────────────────────────────

interface LunaticPose {
    id: number;
    sanskrit_name: string;
    english_name: string;
    procedure: string[];
    target_body_parts: string[];
    benefits: string[];
    contraindications: string[];
    image_url: string;
    yt_videos: string[];
}

const LUNATIC_URL =
    'https://raw.githubusercontent.com/LunaticPrakash/yoga-api/master/yoga-api.json';

async function fetchLunatic(): Promise<Exercise[]> {
    const res = await fetch(LUNATIC_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Lunatic API ${res.status}`);
    const data: LunaticPose[] = await res.json();

    return data
        .filter((p) => p.english_name)
        .map((p, i): Exercise => {
            const areas    = mapToAreas(p.target_body_parts);
            const videoUrl = p.yt_videos[0]
                ? `https://www.youtube.com/watch?v=${p.yt_videos[0]}`
                : undefined;
            const esData   = YOGA_ES[p.english_name];
            const rawTags  = p.target_body_parts.slice(0, 3);

            return {
                id:          `l-${p.id ?? i}`,
                slug:        p.english_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                title:       p.english_name,
                titleEs:     esData?.titleEs,
                titleSanskrit: p.sanskrit_name || undefined,
                duration:    '3 min',
                durationVal: 3,
                tags:        rawTags,
                tagsEs:      rawTags.map(translateTag),
                area:        areas,
                riskZone:    p.contraindications.length > 0 ? p.contraindications : undefined,
                riskZoneEs:  p.contraindications.length > 0 ? p.contraindications.map(translateTag) : undefined,
                benefits:    p.benefits.length > 0 ? p.benefits : undefined,
                image:       p.image_url || fallbackImage(areas),
                hasVideo:    p.yt_videos.length > 0,
                videoUrl,
                description: `${p.english_name}${p.sanskrit_name ? ` (${p.sanskrit_name})` : ''} is a yoga posture targeting ${p.target_body_parts.slice(0, 3).join(', ')}.`,
                descriptionEs: esData?.descriptionEs,
                steps:       p.procedure.length > 0 ? p.procedure : [`Practice ${p.english_name} with proper form.`],
                stepsEs:     esData?.stepsEs,
                muscles:     p.target_body_parts.join(', '),
                musclesEs:   rawTags.map((t) => TAGS_ES[t] ?? t).join(', '),
                category:    'yoga',
                difficulty:  'beginner',
                source:      'lunatic',
            };
        });
}

// ── Yoga API nzy4 (fallback) ─────────────────────────────────────────────────

interface Nzy4Pose {
    id: number;
    english_name: string;
    sanskrit_name_adapted?: string;
    sanskrit_name?: string;
    pose_description: string;
    pose_benefits: string;
    url_svg?: string;
    url_png?: string;
    url_svg_alt?: string;
}

interface Nzy4Category {
    id: number;
    category_name: string;
    category_description: string;
    poses: Nzy4Pose[];
}

const NYZ4_CATEGORIES = 'https://yoga-api-nzy4.onrender.com/v1/categories';

async function fetchYogaNzy4(): Promise<Exercise[]> {
    const res = await fetch(NYZ4_CATEGORIES, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`yoga-nzy4 API ${res.status}`);
    const categories: Nzy4Category[] = await res.json();

    const seen = new Set<number>();
    const exercises: Exercise[] = [];

    for (const cat of categories) {
        const areas      = CAT_AREAS[cat.category_name] ?? ['Full Body'];
        const difficulty = CAT_DIFFICULTY[cat.category_name] ?? 'beginner';

        for (const p of cat.poses) {
            if (seen.has(p.id)) continue;
            seen.add(p.id);

            const image  = p.url_png || p.url_svg || p.url_svg_alt || fallbackImage(areas);
            const esData = YOGA_ES[p.english_name];
            const rawTags = [cat.category_name, 'Yoga'];

            exercises.push({
                id:           `y-${p.id}`,
                slug:         p.english_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                title:        p.english_name,
                titleEs:      esData?.titleEs,
                titleSanskrit: p.sanskrit_name || p.sanskrit_name_adapted || undefined,
                duration:     '5 min',
                durationVal:  5,
                tags:         rawTags,
                tagsEs:       rawTags.map(translateTag),
                area:         areas,
                benefits:     p.pose_benefits ? [p.pose_benefits] : undefined,
                image,
                hasVideo:     false,
                description:  p.pose_description,
                descriptionEs: esData?.descriptionEs,
                steps:        p.pose_description
                                  ? p.pose_description.split('. ').filter(Boolean).map(s => s.trim())
                                  : [`Practice ${p.english_name} with proper form.`],
                stepsEs:      esData?.stepsEs,
                muscles:      areas.join(', '),
                musclesEs:    areas.map((a) => TAGS_ES[a] ?? a).join(', '),
                category:     cat.category_name,
                difficulty,
                source:       'yoga-nzy4',
            });
        }
    }

    return exercises;
}

// ── Combined cache & deduplication ──────────────────────────────────────────

function slugOf(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

let cache: Exercise[] | null = null;

export async function getAllExercises(): Promise<Exercise[]> {
    if (cache) return cache;

    // Run all sources in parallel
    const [edbResult, lunaticResult, nzy4Result] = await Promise.allSettled([
        fetchExerciseDB(),
        fetchLunatic(),
        fetchYogaNzy4(),
    ]);

    const fromEdb     = edbResult.status     === 'fulfilled' ? edbResult.value     : [];
    const fromLunatic = lunaticResult.status === 'fulfilled' ? lunaticResult.value : [];
    const fromNzy4    = nzy4Result.status    === 'fulfilled' ? nzy4Result.value    : [];

    if (edbResult.status     === 'rejected') console.warn('ExerciseDB failed:', edbResult.reason);
    if (lunaticResult.status === 'rejected') console.warn('Lunatic API failed:', lunaticResult.reason);
    if (nzy4Result.status    === 'rejected') console.warn('yoga-nzy4 failed:', nzy4Result.reason);

    // ExerciseDB is primary — no dedup needed with it
    // For yoga fallbacks, only add poses not already covered by name
    const edbSlugs = new Set(fromEdb.map(e => slugOf(e.title)));

    const uniqueLunatic = fromLunatic.filter(e => !edbSlugs.has(slugOf(e.title)));
    const nzy4Slugs     = new Set([...edbSlugs, ...uniqueLunatic.map(e => slugOf(e.title))]);
    const uniqueNzy4    = fromNzy4.filter(e => !nzy4Slugs.has(slugOf(e.title)));

    cache = [...localExercises, ...fromEdb, ...uniqueLunatic, ...uniqueNzy4];
    return cache;
}

export function getCachedExerciseById(id: string): Exercise | undefined {
    return cache?.find((e) => e.id === id);
}

export function clearCache() {
    cache = null;
}
