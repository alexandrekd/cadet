export const EXAM_DATE = new Date("2026-08-28")
export const TARGET = 95

export const PHASES = {
  PSY0: {
    label: "PSY0", sublabel: "Présélection en ligne", color: "#3b82f6",
    tests: [
      { id: "p0_memory",     name: "Memory chromatique",      desc: "Mémorisation de séquences colorées" },
      { id: "p0_hanoi",      name: "Éprouvettes de Hanoï",    desc: "Logique séquentielle" },
      { id: "p0_parite",     name: "Parité alternée",         desc: "Séries numériques" },
      { id: "p0_modulo",     name: "Modulo",                  desc: "Calcul rapide modulo" },
      { id: "p0_dominos",    name: "Dominos",                 desc: "Raisonnement logique" },
      { id: "p0_patron",     name: "Patron de dé",            desc: "Rotation 3D mentale" },
      { id: "p0_regles",     name: "Règles géométriques",     desc: "Géométrie & angles" },
      { id: "p0_flux",       name: "Gestion de flux",         desc: "Traitement simultané" },
      { id: "p0_multitache", name: "Multitâche",              desc: "Double attention" },
      { id: "p0_mots",       name: "Classement de mots",      desc: "Vocabulaire & champs lexicaux" },
      { id: "p0_erreurs",    name: "Erreurs mathématiques",   desc: "Détection d'erreurs" },
      { id: "p0_pdv",        name: "Point de vue",            desc: "Vision spatiale" },
      { id: "p0_aero",       name: "Culture aéronautique",    desc: "Principes de vol, navigation" },
      { id: "p0_anglais",    name: "Anglais aéronautique",    desc: "Vocabulaire & compréhension" },
    ],
  },
  PSY1: {
    label: "PSY1", sublabel: "Présentiel ENAC Toulouse", color: "#10b981",
    tests: [
      { id: "p1_attsout",    name: "Attention soutenue",      desc: "Concentration longue durée" },
      { id: "p1_compteurs",  name: "Lecture de compteurs",    desc: "Instruments de bord" },
      { id: "p1_mem1",       name: "Mémoire de travail I",    desc: "Rappel séquentiel" },
      { id: "p1_mem2",       name: "Mémoire de travail II",   desc: "Rappel complexe" },
      { id: "p1_calcul1",    name: "Calcul mental Niv.1",     desc: "Réponse libre" },
      { id: "p1_calcul2",    name: "Calcul mental Niv.2",     desc: "Plus petit intervalle" },
      { id: "p1_calcul3",    name: "Calcul mental Niv.3",     desc: "Équations" },
      { id: "p1_calcul4",    name: "Calcul mental Niv.4",     desc: "Tous les intervalles" },
      { id: "p1_maths",      name: "Problèmes mathématiques", desc: "Résolution logique" },
      { id: "p1_efficience", name: "Efficience générale",     desc: "Vitesse & précision" },
      { id: "p1_raven",      name: "Matrices de Raven",       desc: "Raisonnement non-verbal" },
      { id: "p1_lecture",    name: "Compréhension lecture",   desc: "Analyse rapide de textes" },
      { id: "p1_tangram",    name: "Tangram",                 desc: "Assemblage spatial" },
      { id: "p1_angles",     name: "Quadrilogie des angles",  desc: "Rotation & estimation" },
      { id: "p1_cube1",      name: "Dépliage cube Niv.1",     desc: "Alphabet latin, 3 cubes" },
      { id: "p1_cube2",      name: "Dépliage cube Niv.2",     desc: "Alphabet runique, 2 cubes" },
      { id: "p1_psychomot",  name: "Psychomoteur (joysticks)",desc: "Coordination bi-manuelle" },
    ],
  },
  PSY2: {
    label: "PSY2", sublabel: "Commission Air France", color: "#f59e0b",
    tests: [
      { id: "p2_projet",   name: "Projet professionnel",     desc: "Cohérence & motivation" },
      { id: "p2_parcours", name: "Présentation du parcours", desc: "Storytelling personnel" },
      { id: "p2_stress",   name: "Gestion du stress",        desc: "Réaction sous pression" },
      { id: "p2_groupe",   name: "Dynamique de groupe",      desc: "Leadership & écoute" },
      { id: "p2_anglais",  name: "Anglais oral",             desc: "Expression & compréhension" },
      { id: "p2_qqf",      name: "Questions fréquentes",     desc: "Pourquoi pilote ? Pourquoi AF ?" },
      { id: "p2_checkj",   name: "Checklist jour J",         desc: "Documents, tenue, mental" },
    ],
  },
}

export const ALL_TESTS = Object.values(PHASES).flatMap(p => p.tests)

export const WEEKLY_PLAN = [
  { week: 1, theme: "Fondations PSY0",               focus: ["p0_memory","p0_parite","p0_modulo","p0_aero"] },
  { week: 2, theme: "Logique & Spatial PSY0",         focus: ["p0_hanoi","p0_dominos","p0_patron","p0_pdv"] },
  { week: 3, theme: "Multitâche & Verbal PSY0",       focus: ["p0_flux","p0_multitache","p0_mots","p0_anglais"] },
  { week: 4, theme: "Révisions PSY0 + Intro PSY1",    focus: ["p0_erreurs","p0_regles","p1_calcul1","p1_calcul2"] },
  { week: 5, theme: "Calcul & Attention PSY1",        focus: ["p1_calcul3","p1_calcul4","p1_attsout","p1_compteurs"] },
  { week: 6, theme: "Spatial & Raisonnement PSY1",    focus: ["p1_raven","p1_tangram","p1_angles","p1_cube1"] },
  { week: 7, theme: "Psychomoteur & Mémoire PSY1",    focus: ["p1_psychomot","p1_mem1","p1_mem2","p1_cube2"] },
  { week: 8, theme: "Intensif PSY2 + Examens blancs", focus: ["p2_projet","p2_parcours","p2_anglais","p2_qqf"] },
]

export const PSY0_EXAM_ORDER = [
  "p0_memory","p0_parite","p0_modulo","p0_dominos","p0_patron",
  "p0_regles","p0_flux","p0_multitache","p0_mots","p0_erreurs",
  "p0_pdv","p0_aero","p0_anglais","p0_hanoi"
]

export const PSY2_QUESTIONS = [
  "Pourquoi vouloir devenir pilote de ligne ?",
  "Pourquoi Air France plutôt qu'une autre compagnie ?",
  "Décrivez une situation où vous avez géré le stress.",
  "Parlez d'un échec et ce que vous en avez tiré.",
  "Pourquoi pensez-vous être fait pour ce métier ?",
  "Qu'est-ce que le CRM (Crew Resource Management) ?",
  "Comment réagiriez-vous en cas de désaccord avec votre commandant de bord ?",
  "Où vous voyez-vous dans 10 ans ?",
]

export const CHECKLIST_ITEMS = [
  "Convocation imprimée",
  "Pièce d'identité",
  "CV à jour (2 exemplaires)",
  "Tenue professionnelle",
  "Projet pro mémorisé",
  "Nuit de sommeil suffisante",
  "Arrivée 30min en avance",
  "Anglais oral révisé",
]
