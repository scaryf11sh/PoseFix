export type Exercise = {
    id: string;
    slug: string;
    title: string;
    titleEs?: string;
    titleSanskrit?: string;
    duration: string;
    durationVal: number;
    tags: string[];            // English tags (keys for filtering)
    tagsEs?: string[];         // Spanish tags (display only)
    area: string[];            // normalized filter areas: Neck, Back, Shoulders, Core, Hips, Legs, Chest, Full Body
    riskZone?: string[];       // English contraindications
    riskZoneEs?: string[];     // Spanish contraindications
    benefits?: string[];       // English
    benefitsEs?: string[];     // Spanish
    image?: string;
    hasVideo: boolean;
    videoUrl?: string;
    recommended?: boolean;
    recommendedLabel?: string;
    description: string;       // English
    descriptionEs?: string;    // Spanish
    steps: string[];           // English
    stepsEs?: string[];        // Spanish
    muscles: string;           // English
    musclesEs?: string;        // Spanish
    category: string;          // 'posture', 'yoga', 'Core Strength', 'Hip-Opening', etc.
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    source: 'local' | 'exercisedb' | 'lunatic' | 'yoga-nzy4';
};

export const localExercises: Exercise[] = [
    {
        id: 'local-1',
        slug: 'neck-tilt',
        title: 'Neck Tilt',
        titleEs: 'Inclinación de Cuello',
        duration: '1 min',
        durationVal: 1,
        tags: ['Neck', 'Desk-Friendly'],
        tagsEs: ['Cuello', 'Para el Escritorio'],
        area: ['Neck'],
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
        description: 'A gentle neck stretch that relieves tension and improves cervical mobility after long periods at your desk.',
        descriptionEs: 'Un suave estiramiento de cuello que alivia la tensión y mejora la movilidad cervical después de largas horas frente al escritorio.',
        steps: [
            'Sit upright in your chair with feet flat on the floor',
            'Slowly tilt your head to the right, bringing your ear toward your shoulder',
            'Hold for 15–20 seconds, feeling the stretch on the left side of your neck',
            'Return to center and repeat on the left side',
            'Complete 3 repetitions on each side',
        ],
        stepsEs: [
            'Siéntate erguido en tu silla con los pies apoyados en el suelo',
            'Inclina lentamente la cabeza hacia la derecha, acercando la oreja al hombro',
            'Mantén 15–20 segundos sintiendo el estiramiento en el lado izquierdo del cuello',
            'Regresa al centro y repite hacia el lado izquierdo',
            'Completa 3 repeticiones de cada lado',
        ],
        muscles: 'Cervical flexors, upper trapezius, sternocleidomastoid',
        musclesEs: 'Flexores cervicales, trapecio superior, esternocleidomastoideo',
        hasVideo: false,
        category: 'posture',
        difficulty: 'beginner',
        source: 'local',
    },
    {
        id: 'local-2',
        slug: 'shoulder-roll',
        title: 'Shoulder Roll',
        titleEs: 'Rotación de Hombros',
        duration: '1 min',
        durationVal: 1,
        tags: ['Shoulders', 'Relief'],
        tagsEs: ['Hombros', 'Alivio'],
        area: ['Shoulders'],
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
        description: 'Releases shoulder tension caused by prolonged typing and mouse use. Perfect for quick desk breaks.',
        descriptionEs: 'Libera la tensión en los hombros causada por escribir y usar el ratón durante períodos prolongados. Perfecta para pausas rápidas en el escritorio.',
        steps: [
            'Sit or stand tall with arms relaxed at your sides',
            'Slowly roll both shoulders forward in a large circular motion',
            'Complete 5 forward rotations',
            'Reverse direction and complete 5 backward rotations',
            'Focus on making large, smooth circles with each rotation',
        ],
        stepsEs: [
            'Siéntate o párate erguido con los brazos relajados a los lados',
            'Rueda lentamente ambos hombros hacia adelante en un gran movimiento circular',
            'Completa 5 rotaciones hacia adelante',
            'Invierte la dirección y completa 5 rotaciones hacia atrás',
            'Concéntrate en hacer círculos amplios y suaves en cada rotación',
        ],
        muscles: 'Deltoids, trapezius, rhomboids',
        musclesEs: 'Deltoides, trapecio, romboides',
        hasVideo: false,
        category: 'posture',
        difficulty: 'beginner',
        source: 'local',
    },
    {
        id: 'local-3',
        slug: 'cat-cow-flow',
        title: 'Cat-Cow Flow',
        titleEs: 'Flujo Gato-Vaca',
        duration: '3 min',
        durationVal: 3,
        tags: ['Back', 'Mobility'],
        tagsEs: ['Espalda', 'Movilidad'],
        area: ['Back'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
        description: 'A flowing yoga movement that improves spinal flexibility and relieves chronic back pain from prolonged sitting.',
        descriptionEs: 'Un movimiento de yoga fluido que mejora la flexibilidad de la columna y alivia el dolor crónico de espalda causado por largas horas sentado.',
        steps: [
            'Come to a table-top position on hands and knees (or sit on the edge of your chair)',
            'Inhale and arch your back, lifting your chest and tailbone (Cow pose)',
            'Hold for 2–3 seconds at the top of the arch',
            'Exhale and round your spine toward the ceiling, tucking chin to chest (Cat pose)',
            'Hold for 2–3 seconds in the rounded position',
            'Flow between both positions 8–10 times, syncing movement with your breath',
        ],
        stepsEs: [
            'Colócate en cuatro puntos de apoyo con las manos y rodillas en el suelo (o siéntate al borde de la silla)',
            'Inhala y arquea la espalda elevando el pecho y el cóccix (postura Vaca)',
            'Mantén 2–3 segundos en el punto más alto del arco',
            'Exhala y redondea la columna hacia el techo, metiendo el mentón al pecho (postura Gato)',
            'Mantén 2–3 segundos en la posición redondeada',
            'Fluye entre ambas posiciones 8–10 veces sincronizando el movimiento con la respiración',
        ],
        muscles: 'Erector spinae, multifidus, rectus abdominis',
        musclesEs: 'Erectores de la columna, multífido, recto abdominal',
        hasVideo: false,
        category: 'posture',
        difficulty: 'beginner',
        source: 'local',
    },
    {
        id: 'local-4',
        slug: 'doorway-opener',
        title: 'Doorway Opener',
        titleEs: 'Apertura en el Marco de la Puerta',
        duration: '3 min',
        durationVal: 3,
        tags: ['Chest', 'Posture Fix'],
        tagsEs: ['Pecho', 'Corrección Postural'],
        area: ['Chest', 'Shoulders'],
        image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&h=300&fit=crop',
        description: 'Opens the chest and counteracts the forward-rounded posture that develops from extended desk work and computer use.',
        descriptionEs: 'Abre el pecho y contrarresta la postura encorvada hacia adelante que se desarrolla tras largas horas de trabajo en escritorio y uso del computador.',
        steps: [
            'Stand in a doorway and place both forearms on the door frame',
            'Position elbows at roughly 90-degree angles at shoulder height',
            'Step one foot forward and gently lean into the doorway',
            'Feel the stretch across your chest and the front of your shoulders',
            'Hold for 20–30 seconds, breathing deeply',
            'Repeat 3 times, alternating which foot is forward',
        ],
        stepsEs: [
            'Párate en el marco de una puerta y apoya ambos antebrazos en el marco',
            'Posiciona los codos a unos 90 grados a la altura de los hombros',
            'Da un paso adelante con un pie e inclínate suavemente hacia adelante',
            'Siente el estiramiento en el pecho y en la parte delantera de los hombros',
            'Mantén 20–30 segundos respirando profundamente',
            'Repite 3 veces alternando qué pie va adelante',
        ],
        muscles: 'Pectoralis major, anterior deltoids, biceps',
        musclesEs: 'Pectoral mayor, deltoides anterior, bíceps',
        hasVideo: false,
        category: 'posture',
        difficulty: 'beginner',
        source: 'local',
    },
    {
        id: 'local-5',
        slug: 'thoracic-bridge',
        title: 'Thoracic Bridge',
        titleEs: 'Puente Torácico',
        duration: '5 min',
        durationVal: 5,
        tags: ['Full Body', 'Advanced'],
        tagsEs: ['Cuerpo Completo', 'Avanzado'],
        area: ['Full Body', 'Back'],
        image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop',
        description: 'An advanced movement for thoracic extension and hip mobility that addresses the most common postural deficiencies.',
        descriptionEs: 'Un movimiento avanzado para la extensión torácica y la movilidad de cadera que aborda las deficiencias posturales más comunes causadas por el sedentarismo.',
        steps: [
            'Start seated on the floor with knees bent, feet flat, hands behind you pointing away',
            'Lift your hips toward the ceiling, creating a reverse tabletop position',
            'Rotate your torso to one side, reaching the opposite arm overhead',
            'Look up toward your raised hand and hold for 3 seconds',
            'Return to center and repeat on the other side',
            'Complete 5 repetitions per side with controlled movement',
        ],
        stepsEs: [
            'Comienza sentado en el suelo con las rodillas dobladas, pies apoyados y manos detrás de ti apuntando hacia afuera',
            'Eleva las caderas hacia el techo creando una posición de mesa invertida',
            'Rota el torso hacia un lado extendiendo el brazo opuesto por encima de la cabeza',
            'Mira hacia la mano elevada y mantén 3 segundos',
            'Regresa al centro y repite hacia el lado opuesto',
            'Completa 5 repeticiones por lado con movimiento controlado',
        ],
        muscles: 'Thoracic extensors, hip flexors, glutes, shoulder girdle',
        musclesEs: 'Extensores torácicos, flexores de cadera, glúteos, cintura escapular',
        hasVideo: false,
        category: 'posture',
        difficulty: 'advanced',
        source: 'local',
    },
    {
        id: 'local-6',
        slug: 'childs-pose',
        title: "Child's Pose",
        titleEs: 'Postura del Niño',
        duration: '2 min',
        durationVal: 2,
        tags: ['Back', 'Relief'],
        tagsEs: ['Espalda', 'Alivio'],
        area: ['Back', 'Full Body'],
        image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',
        recommended: true,
        recommendedLabel: 'Realineación de Columna (3m)',
        description: "A restorative yoga pose that gently decompresses the spine and calms the nervous system. Ideal for end-of-day recovery.",
        descriptionEs: 'Una postura restaurativa de yoga que descomprime suavemente la columna y calma el sistema nervioso. Ideal para recuperarse al final del día.',
        steps: [
            'Kneel on the floor and sit back onto your heels',
            'Extend your arms forward on the floor, palms down',
            'Lower your chest toward your knees and your forehead to the mat',
            'Breathe deeply, feeling your back expand with each inhale',
            'Stay for 60–90 seconds, relaxing more deeply with each exhale',
            'Slowly roll back up one vertebra at a time',
        ],
        stepsEs: [
            'Arrodíllate en el suelo y siéntate sobre los talones',
            'Extiende los brazos hacia adelante en el suelo con las palmas hacia abajo',
            'Baja el pecho hacia las rodillas y la frente hacia la esterilla',
            'Respira profundamente sintiendo cómo la espalda se expande en cada inhalación',
            'Permanece 60–90 segundos, relajándote más profundamente con cada exhalación',
            'Sube lentamente vértebra por vértebra',
        ],
        muscles: 'Erector spinae, gluteus maximus, hip rotators, latissimus dorsi',
        musclesEs: 'Erectores de la columna, glúteo mayor, rotadores de cadera, dorsal ancho',
        hasVideo: false,
        category: 'posture',
        difficulty: 'beginner',
        source: 'local',
    },
];

// kept for backward compat – pages now use the store
export const exercises = localExercises;

export function getExerciseById(id: string): Exercise | undefined {
    return localExercises.find((e) => e.id === id);
}
