export const EXAM_DATE = new Date("2026-08-28")
export const TARGET = 95

export const PHASES = {
  PSY0: {
    label: "PSY0", sublabel: "Présélection en ligne", color: "#3b82f6",
    tests: [
      { id: "p0_memory",     name: "M2 Back numérique",           desc: "Mémorisation · Pilotest: Mémorisation" },
      { id: "p0_hanoi",      name: "Éprouvettes de Hanoï",        desc: "Logique séquentielle" },
      { id: "p0_parite",     name: "Pair ou impair",              desc: "Numérique · Pilotest: Numérique" },
      { id: "p0_modulo",     name: "Grilles de calculs",          desc: "Numérique · Pilotest: Numérique" },
      { id: "p0_dominos",    name: "Dominos",                     desc: "Logique" },
      { id: "p0_patron",     name: "Billes / Cubes 2D/3D",        desc: "Spatiale · Pilotest: Spatiale" },
      { id: "p0_regles",     name: "Formes et couleurs",          desc: "Spatiale · Pilotest: Attention" },
      { id: "p0_flux",       name: "Airways",                     desc: "Attention · Pilotest: Attention" },
      { id: "p0_multitache", name: "Psychomoteur psy0 AF cadet",  desc: "Psychomoteur · Pilotest: Psychomoteur" },
      { id: "p0_mots",       name: "Boîtes à mots / Un mot sur deux", desc: "Verbale · Pilotest: Verbale" },
      { id: "p0_erreurs",    name: "Formes glissées II",          desc: "Spatiale · Pilotest: Spatiale" },
      { id: "p0_pdv",        name: "Objets 3D / Empilements",     desc: "Spatiale · Pilotest: Spatiale" },
      { id: "p0_aero",       name: "Culture aéronautique",        desc: "Connaissances générales aviation" },
      { id: "p0_anglais",    name: "Anglais présélection cadets AF", desc: "Anglais · Pilotest: Anglais" },
    ],
  },
  PSY1: {
    label: "PSY1", sublabel: "Présentiel ENAC Toulouse", color: "#10b981",
    tests: [
      { id: "p1_attsout",    name: "Attention 1 / 2 / 3",         desc: "Attention · Pilotest: Attention" },
      { id: "p1_compteurs",  name: "Test des compteurs",          desc: "Numérique & Attention · Pilotest: Numérique" },
      { id: "p1_mem1",       name: "Memory 3 Back / 4 Back",      desc: "Mémorisation · Pilotest: Attention & Mémorisation" },
      { id: "p1_mem2",       name: "Memory 5 Back",               desc: "Mémorisation avancée · Pilotest: Mémorisation" },
      { id: "p1_calcul1",    name: "Calcul mental 1",             desc: "Numérique · Pilotest: Numérique" },
      { id: "p1_calcul2",    name: "Calcul mental 2",             desc: "Numérique · Pilotest: Numérique" },
      { id: "p1_calcul3",    name: "Calcul mental 3",             desc: "Numérique · Pilotest: Numérique" },
      { id: "p1_calcul4",    name: "Calcul mental 4",             desc: "Numérique · Pilotest: Numérique" },
      { id: "p1_maths",      name: "Mathématiques",               desc: "Intellectuelle · Pilotest: Numérique & Intellectuelle" },
      { id: "p1_efficience", name: "EFG / Voitures",              desc: "Intellectuelle · Pilotest: Intellectuelle & Numérique" },
      { id: "p1_raven",      name: "Matrices de Raven",           desc: "Intellectuelle · Pilotest: Intellectuelle" },
      { id: "p1_lecture",    name: "Lecture de textes",           desc: "Verbale · Pilotest: Verbale & Intellectuelle" },
      { id: "p1_tangram",    name: "Tangram",                     desc: "Spatiale · Pilotest: Spatiale & Intellectuelle" },
      { id: "p1_angles",     name: "Angles / DLR orientation",    desc: "Spatiale · Pilotest: Spatiale & Numérique" },
      { id: "p1_cube1",      name: "Patrons de cubes psy1 Niv.1", desc: "Spatiale · Pilotest: Spatiale" },
      { id: "p1_cube2",      name: "Patrons de cubes psy1 Niv.2", desc: "Spatiale avancée · Pilotest: Spatiale" },
      { id: "p1_psychomot",  name: "Psychomoteur ENAC",           desc: "Psychomoteur · Pilotest: Psychomoteur" },
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
