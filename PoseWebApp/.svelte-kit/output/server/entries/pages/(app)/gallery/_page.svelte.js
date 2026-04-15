import { b as attr_class, m as clsx, e as ensure_array_like, c as stringify } from "../../../../chunks/index2.js";
import { D as Dumbbell } from "../../../../chunks/dumbbell.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer) {
  const exercises = [
    {
      id: 1,
      title: "Rotación de cuello",
      titleEn: "Neck Rotation",
      description: "Moviliza suavemente las cervicales",
      descriptionEn: "Gently mobilize the cervical spine",
      duration: "2 min",
      difficulty: "easy",
      category: "neck",
      steps: [
        "Inclina la cabeza hacia adelante",
        "Rota lentamente hacia la derecha",
        "Vuelve al centro y repite hacia la izquierda",
        "Haz 5 repeticiones por lado"
      ],
      stepsEn: [
        "Tilt your head forward",
        "Slowly rotate to the right",
        "Return to center and repeat to the left",
        "Do 5 repetitions on each side"
      ],
      benefits: ["Reduce rigidez cervical", "Mejora movilidad"],
      benefitsEn: ["Reduces neck stiffness", "Improves mobility"]
    },
    {
      id: 2,
      title: "Elevación de hombros",
      titleEn: "Shoulder Shrugs",
      description: "Libera tensión en trapecios",
      descriptionEn: "Release tension in trapezius muscles",
      duration: "3 min",
      difficulty: "easy",
      category: "shoulders",
      steps: [
        "Levanta los hombros hacia las orejas",
        "Mantén 3 segundos",
        "Baja lentamente",
        "Repite 10 veces"
      ],
      stepsEn: [
        "Lift shoulders toward ears",
        "Hold for 3 seconds",
        "Lower slowly",
        "Repeat 10 times"
      ],
      benefits: ["Libera tensión", "Previene contracturas"],
      benefitsEn: ["Releases tension", "Prevents muscle knots"]
    },
    {
      id: 3,
      title: "Estiramiento de espalda",
      titleEn: "Back Stretch",
      description: "Estira la columna torácica",
      descriptionEn: "Stretch the thoracic spine",
      duration: "5 min",
      difficulty: "medium",
      category: "back",
      steps: [
        "Siéntate con la espalda recta",
        "Entrelaza las manos detrás de la cabeza",
        "Arquea suavemente hacia atrás",
        "Mantén 10 segundos y repite"
      ],
      stepsEn: [
        "Sit with straight back",
        "Interlace hands behind head",
        "Gently arch backward",
        "Hold 10 seconds and repeat"
      ],
      benefits: ["Mejora postura", "Reduce dolor lumbar"],
      benefitsEn: ["Improves posture", "Reduces lower back pain"]
    },
    {
      id: 4,
      title: "Descanso visual 20-20-20",
      titleEn: "20-20-20 Eye Rest",
      description: "Reduce fatiga visual",
      descriptionEn: "Reduce eye strain",
      duration: "1 min",
      difficulty: "easy",
      category: "eyes",
      steps: [
        "Cada 20 minutos de trabajo",
        "Mira un objeto a 20 pies (6 metros)",
        "Mantén la vista 20 segundos",
        "Parpadea varias veces"
      ],
      stepsEn: [
        "Every 20 minutes of work",
        "Look at an object 20 feet away",
        "Focus for 20 seconds",
        "Blink several times"
      ],
      benefits: ["Previene fatiga visual", "Reduce sequedad ocular"],
      benefitsEn: ["Prevents eye strain", "Reduces dry eyes"]
    },
    {
      id: 5,
      title: "Rotación de torso",
      titleEn: "Torso Twist",
      description: "Moviliza la columna completa",
      descriptionEn: "Mobilize the entire spine",
      duration: "4 min",
      difficulty: "medium",
      category: "full_body",
      steps: [
        "Siéntate con pies planos en el suelo",
        "Rota el torso hacia la derecha",
        "Mantén 5 segundos",
        "Repite hacia el lado izquierdo"
      ],
      stepsEn: [
        "Sit with feet flat on floor",
        "Rotate torso to the right",
        "Hold for 5 seconds",
        "Repeat to the left side"
      ],
      benefits: ["Mejora rotación espinal", "Libera tensión lumbar"],
      benefitsEn: ["Improves spinal rotation", "Releases lower back tension"]
    },
    {
      id: 6,
      title: "Estiramiento de pecho",
      titleEn: "Chest Stretch",
      description: "Abre el pecho y mejora la respiración",
      descriptionEn: "Open the chest and improve breathing",
      duration: "3 min",
      difficulty: "easy",
      category: "back",
      steps: [
        "Coloca las manos detrás de la cabeza",
        "Abre los codos hacia los lados",
        "Arquea ligeramente la espalda",
        "Respira profundamente 5 veces"
      ],
      stepsEn: [
        "Place hands behind head",
        "Open elbows to the sides",
        "Slightly arch your back",
        "Breathe deeply 5 times"
      ],
      benefits: ["Mejora respiración", "Corrige postura encorvada"],
      benefitsEn: ["Improves breathing", "Corrects hunched posture"]
    }
  ];
  let currentLang = "es";
  let completedExercises = [];
  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case "easy":
        return "bg-electric-green-200 dark:bg-electric-green-900 text-electric-green-800 dark:text-electric-green-300";
      case "medium":
        return "bg-Tuscan-200 dark:bg-Tuscan-900 text-Tuscan-800 dark:text-Tuscan-300";
      case "hard":
        return "bg-red-ribbon-200 dark:bg-red-ribbon-900 text-red-ribbon-800 dark:text-red-ribbon-300";
      default:
        return "bg-carbon-200";
    }
  }
  function getCategoryIcon(category) {
    switch (category) {
      case "neck":
        return "🦒";
      case "shoulders":
        return "💪";
      case "back":
        return "🧘";
      case "eyes":
        return "👁️";
      case "full_body":
        return "🏃";
      default:
        return "⭐";
    }
  }
  function getCategoryLabel(category, lang) {
    const labels = {
      neck: { es: "Cuello", en: "Neck" },
      shoulders: { es: "Hombros", en: "Shoulders" },
      back: { es: "Espalda", en: "Back" },
      eyes: { es: "Ojos", en: "Eyes" },
      full_body: { es: "Cuerpo completo", en: "Full body" }
    };
    return labels[category]?.[lang] || category;
  }
  function getDifficultyLabel(difficulty, lang) {
    const labels = {
      easy: { es: "Fácil", en: "Easy" },
      medium: { es: "Medio", en: "Medium" },
      hard: { es: "Difícil", en: "Hard" }
    };
    return labels[difficulty]?.[lang] || difficulty;
  }
  $$renderer.push(`<div class="h-full w-full p-8 overflow-auto"><div class="max-w-6xl mx-auto"><div class="flex items-center justify-between mb-6"><div><h1 class="text-3xl font-medium text-graphite-900 dark:text-powder-blue-100 mb-2">${escape_html("Galería de Ejercicios")}</h1> <p class="text-electric-green-600 dark:text-frozen-water-400">${escape_html(
    "Rutinas para mejorar tu postura y reducir fatiga"
  )}</p></div> <div class="flex gap-2"><button${attr_class(clsx(cn(
    "px-4 py-2 rounded-lg font-medium transition",
    "bg-electric-green-600 text-twilight-indigo-50"
  )))}>ES</button> <button${attr_class(clsx(cn("px-4 py-2 rounded-lg font-medium transition", "bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400")))}>EN</button></div></div> <div class="grid grid-cols-3 gap-4 mb-8"><div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4"><div class="flex items-center gap-3">`);
  Dumbbell($$renderer, { class: "w-6 h-6 text-electric-green-600" });
  $$renderer.push(`<!----> <div><p class="text-xs text-carbon-600 dark:text-powder-blue-400">${escape_html("Total ejercicios")}</p> <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">${escape_html(exercises.length)}</p></div></div></div> <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4"><div class="flex items-center gap-3">`);
  Clock($$renderer, { class: "w-6 h-6 text-Tuscan-400" });
  $$renderer.push(`<!----> <div><p class="text-xs text-carbon-600 dark:text-pictures-blue-400">${escape_html("Tiempo total")}</p> <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">18 min</p></div></div></div> <div class="rounded-xl bg-alabaster-100 dark:bg-twilight-indigo-900 p-4"><div class="flex items-center gap-3">`);
  Activity($$renderer, { class: "w-6 h-6 text-frozen-water-400" });
  $$renderer.push(`<!----> <div><p class="text-xs text-carbon-600 dark:text-powder-blue-400">${escape_html("Completados")}</p> <p class="text-xl font-medium text-graphite-900 dark:text-powder-blue-100">${escape_html(completedExercises.length)}/${escape_html(exercises.length)}</p></div></div></div></div> `);
  {
    $$renderer.push("<!--[!-->");
    $$renderer.push(`<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
    const each_array_3 = ensure_array_like(exercises);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let exercise = each_array_3[$$index_3];
      $$renderer.push(`<div class="rounded-2xl bg-twilight-indigo-50 dark:bg-rich-cerulean-900 p-6 shadow-2xl shadow-port-gore-200 dark:shadow-port-gore-400 border border-twilight-indigo-950 cursor-pointer hover:border-electric-green-400 transition"><div class="flex items-start justify-between mb-3"><div class="flex items-center gap-3"><span class="text-2xl">${escape_html(getCategoryIcon(exercise.category))}</span> <div><h3 class="text-lg font-medium text-graphite-900 dark:text-powder-blue-100">${escape_html(exercise.title)}</h3> <p class="text-xs text-carbon-500 dark:text-powder-blue-400">${escape_html(getCategoryLabel(exercise.category, currentLang))}</p></div></div></div> <p class="text-sm text-carbon-600 dark:text-powder-blue-400 mb-4">${escape_html(exercise.description)}</p> <div class="flex items-center gap-2 mb-4"><span class="px-2 py-1 rounded-lg text-xs bg-alabaster-200 dark:bg-twilight-indigo-800 text-carbon-600 dark:text-powder-blue-400">${escape_html(exercise.duration)}</span> <span${attr_class(`px-2 py-1 rounded-lg text-xs ${stringify(getDifficultyColor(exercise.difficulty))}`)}>${escape_html(getDifficultyLabel(exercise.difficulty, currentLang))}</span></div> `);
      if (completedExercises.includes(exercise.id)) {
        $$renderer.push("<!--[-->");
        $$renderer.push(`<div class="flex items-center gap-2 text-electric-green-600 dark:text-frozen-water-400 text-sm"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-8 8 8 0 000 8zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg> <span>${escape_html("Completado")}</span></div>`);
      } else {
        $$renderer.push("<!--[!-->");
        $$renderer.push(`<div class="flex items-center gap-2 text-carbon-500 dark:text-powder-blue-400 text-sm">`);
        Chevron_right($$renderer, { class: "w-4 h-4" });
        $$renderer.push(`<!----> <span>${escape_html("Ver ejercicio")}</span></div>`);
      }
      $$renderer.push(`<!--]--></div>`);
    }
    $$renderer.push(`<!--]--></div>`);
  }
  $$renderer.push(`<!--]--></div></div>`);
}
export {
  _page as default
};
