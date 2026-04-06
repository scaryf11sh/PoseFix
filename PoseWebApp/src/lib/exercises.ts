export type Exercise = {
    id: number;
    slug: string;
    title: string;
    duration: string;
    durationVal: number; // minutes
    tags: string[];
    area: string[];
    image: string;
    recommended?: boolean;
    recommendedLabel?: string;
    description: string;
    steps: string[];
    muscles: string;
};

export const exercises: Exercise[] = [
    {
        id: 1,
        slug: "neck-tilt",
        title: "Neck Tilt",
        duration: "1 min",
        durationVal: 1,
        tags: ["Neck", "Desk-Friendly"],
        area: ["Neck"],
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
        description: "A gentle neck stretch that relieves tension and improves cervical mobility after long periods at your desk.",
        steps: [
            "Sit upright in your chair with feet flat on the floor",
            "Slowly tilt your head to the right, bringing your ear toward your shoulder",
            "Hold for 15–20 seconds, feeling the stretch on the left side of your neck",
            "Return to center and repeat on the left side",
            "Complete 3 repetitions on each side",
        ],
        muscles: "Cervical flexors, upper trapezius, sternocleidomastoid",
    },
    {
        id: 2,
        slug: "shoulder-roll",
        title: "Shoulder Roll",
        duration: "1 min",
        durationVal: 1,
        tags: ["Shoulders", "Relief"],
        area: ["Shoulders"],
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
        description: "Releases shoulder tension caused by prolonged typing and mouse use. Perfect for quick desk breaks.",
        steps: [
            "Sit or stand tall with arms relaxed at your sides",
            "Slowly roll both shoulders forward in a large circular motion",
            "Complete 5 forward rotations",
            "Reverse direction and complete 5 backward rotations",
            "Focus on making large, smooth circles with each rotation",
        ],
        muscles: "Deltoids, trapezius, rhomboids",
    },
    {
        id: 3,
        slug: "cat-cow-flow",
        title: "Cat-Cow Flow",
        duration: "3 min",
        durationVal: 3,
        tags: ["Back", "Mobility"],
        area: ["Back"],
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop",
        description: "A flowing yoga movement that improves spinal flexibility and relieves chronic back pain from prolonged sitting.",
        steps: [
            "Come to a table-top position on hands and knees (or sit on the edge of your chair)",
            "Inhale and arch your back, lifting your chest and tailbone (Cow pose)",
            "Hold for 2–3 seconds at the top of the arch",
            "Exhale and round your spine toward the ceiling, tucking chin to chest (Cat pose)",
            "Hold for 2–3 seconds in the rounded position",
            "Flow between both positions 8–10 times, syncing movement with your breath",
        ],
        muscles: "Erector spinae, multifidus, rectus abdominis",
    },
    {
        id: 4,
        slug: "doorway-opener",
        title: "Doorway Opener",
        duration: "3 min",
        durationVal: 3,
        tags: ["Chest", "Posture Fix"],
        area: ["Full Body"],
        image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=400&h=300&fit=crop",
        description: "Opens the chest and counteracts the forward-rounded posture that develops from extended desk work and computer use.",
        steps: [
            "Stand in a doorway and place both forearms on the door frame",
            "Position elbows at roughly 90-degree angles at shoulder height",
            "Step one foot forward and gently lean into the doorway",
            "Feel the stretch across your chest and the front of your shoulders",
            "Hold for 20–30 seconds, breathing deeply",
            "Repeat 3 times, alternating which foot is forward",
        ],
        muscles: "Pectoralis major, anterior deltoids, biceps",
    },
    {
        id: 5,
        slug: "thoracic-bridge",
        title: "Thoracic Bridge",
        duration: "5 min",
        durationVal: 5,
        tags: ["Full Body", "Advanced"],
        area: ["Full Body", "Back"],
        image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=300&fit=crop",
        description: "An advanced movement for thoracic extension and hip mobility that addresses the most common postural deficiencies.",
        steps: [
            "Start seated on the floor with knees bent, feet flat, hands behind you pointing away",
            "Lift your hips toward the ceiling, creating a reverse tabletop position",
            "Rotate your torso to one side, reaching the opposite arm overhead",
            "Look up toward your raised hand and hold for 3 seconds",
            "Return to center and repeat on the other side",
            "Complete 5 repetitions per side with controlled movement",
        ],
        muscles: "Thoracic extensors, hip flexors, glutes, shoulder girdle",
    },
    {
        id: 6,
        slug: "childs-pose",
        title: "Child's Pose",
        duration: "2 min",
        durationVal: 2,
        tags: ["Back", "Relief"],
        area: ["Back", "Full Body"],
        image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop",
        recommended: true,
        recommendedLabel: "Spine Realignment (3m)",
        description: "A restorative yoga pose that gently decompresses the spine and calms the nervous system. Ideal for end-of-day recovery.",
        steps: [
            "Kneel on the floor and sit back onto your heels",
            "Extend your arms forward on the floor, palms down",
            "Lower your chest toward your knees and your forehead to the mat",
            "Breathe deeply, feeling your back expand with each inhale",
            "Stay for 60–90 seconds, relaxing more deeply with each exhale",
            "Slowly roll back up one vertebra at a time",
        ],
        muscles: "Erector spinae, gluteus maximus, hip rotators, latissimus dorsi",
    },
];

export function getExerciseById(id: number): Exercise | undefined {
    return exercises.find((e) => e.id === id);
}
