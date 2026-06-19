export const EXAM_DATE = new Date("2026-08-28")
export const TARGET = 95

export const PHASES = {
  PSY0: {
    label: "PSY0", sublabel: "Présélection en ligne", color: "#3b82f6",
    tests: [
      // Attention
      { id: "p0_unmotdeux",   name: "Un mot sur deux",              desc: "Attention · Verbale · Spatiale" },
      { id: "p0_pairou",      name: "Pair ou impair",               desc: "Attention · Numérique · Spatiale" },
      { id: "p0_m2back",      name: "M2 Back numérique",            desc: "Attention · Mémorisation" },
      { id: "p0_psychomot",   name: "Psychomoteur psy0 AF cadet",   desc: "Attention · Psychomoteur" },
      { id: "p0_formes",      name: "Formes et couleurs",           desc: "Attention" },
      { id: "p0_airways",     name: "Airways",                      desc: "Attention · Intellectuelle" },
      // Spatiale
      { id: "p0_empilements", name: "Empilements",                  desc: "Spatiale" },
      { id: "p0_objets3d",    name: "Objets 3D",                    desc: "Spatiale" },
      { id: "p0_billes",      name: "Billes",                       desc: "Spatiale · Intellectuelle" },
      { id: "p0_formes2",     name: "Formes glissées II",           desc: "Spatiale · Intellectuelle" },
      { id: "p0_cubes",       name: "Cubes 2D/3D psy0 AF",         desc: "Spatiale" },
      // Numérique
      { id: "p0_grilles",     name: "Grilles de calculs",           desc: "Numérique" },
      // Verbale
      { id: "p0_boites",      name: "Boîtes à mots",               desc: "Verbale" },
      { id: "p0_motsetoile",  name: "Mots en étoile",              desc: "Verbale" },
      // Intellectuelle
      { id: "p0_series",      name: "Séries logiques",             desc: "Intellectuelle" },
      // Anglais
      { id: "p0_anglais",     name: "Anglais présélection cadets AF", desc: "Anglais" },
      // Culture aéro (hors Pilotest)
      { id: "p0_aero",        name: "Culture aéronautique",         desc: "Connaissances générales aviation" },
    ],
  },
  PSY1: {
    label: "PSY1", sublabel: "Présentiel ENAC Toulouse", color: "#10b981",
    tests: [
      // Numérique
      { id: "p1_calcul1",     name: "Calcul mental 1",              desc: "Numérique" },
      { id: "p1_calcul2",     name: "Calcul mental 2",              desc: "Numérique" },
      { id: "p1_calcul3",     name: "Calcul mental 3",              desc: "Numérique · Attention" },
      { id: "p1_calcul4",     name: "Calcul mental 4",              desc: "Numérique" },
      { id: "p1_maths",       name: "Mathématiques",                desc: "Numérique · Intellectuelle" },
      { id: "p1_voitseq",     name: "Voitures (séquentiel)",        desc: "Numérique · Spatiale" },
      { id: "p1_voitbas",     name: "Voitures (basique)",           desc: "Numérique · Spatiale" },
      { id: "p1_compteurs",   name: "Test des compteurs",           desc: "Numérique · Attention" },
      { id: "p1_angles",      name: "Angles",                       desc: "Numérique · Spatiale" },
      // Spatiale
      { id: "p1_cubes",       name: "Patrons de cubes psy1 Cadets AF", desc: "Spatiale" },
      { id: "p1_dlr",         name: "DLR/AF Cadets psy1 - VLR",    desc: "Spatiale · Orientation" },
      { id: "p1_tangram",     name: "Tangram",                      desc: "Spatiale · Intellectuelle" },
      // Intellectuelle
      { id: "p1_efg",         name: "EFG",                          desc: "Intellectuelle" },
      { id: "p1_raven",       name: "Matrices de Raven",            desc: "Intellectuelle" },
      { id: "p1_lecture",     name: "Lecture de textes",            desc: "Verbale · Intellectuelle" },
      // Attention & Mémorisation
      { id: "p1_mem3",        name: "Memory 3 Back",                desc: "Attention · Mémorisation" },
      { id: "p1_mem4",        name: "Memory 4 Back",                desc: "Attention · Mémorisation" },
      { id: "p1_mem5",        name: "Memory 5 Back",                desc: "Mémorisation" },
      { id: "p1_att1",        name: "Attention 1",                  desc: "Attention" },
      { id: "p1_att2",        name: "Attention 2",                  desc: "Attention" },
      { id: "p1_att3",        name: "Attention 3",                  desc: "Attention · Numérique" },
      // Psychomoteur
      { id: "p1_psychomot",   name: "Psychomoteur ENAC",            desc: "Psychomoteur" },
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
  { week: 1, theme: "Fondations PSY0 — Attention & Mémorisation",    focus: ["p0_m2back","p0_pairou","p0_unmotdeux","p0_airways"] },
  { week: 2, theme: "Spatial & Logique PSY0",                         focus: ["p0_objets3d","p0_billes","p0_cubes","p0_series"] },
  { week: 3, theme: "Multitâche & Verbal PSY0",                       focus: ["p0_psychomot","p0_boites","p0_motsetoile","p0_formes"] },
  { week: 4, theme: "Révisions PSY0 + Intro Calcul PSY1",             focus: ["p0_grilles","p0_anglais","p1_calcul1","p1_calcul2"] },
  { week: 5, theme: "Calcul & Compteurs PSY1",                        focus: ["p1_calcul3","p1_calcul4","p1_compteurs","p1_maths"] },
  { week: 6, theme: "Spatial & Raisonnement PSY1",                    focus: ["p1_raven","p1_tangram","p1_angles","p1_cubes"] },
  { week: 7, theme: "Psychomoteur & Memory PSY1",                     focus: ["p1_psychomot","p1_mem3","p1_mem4","p1_mem5"] },
  { week: 8, theme: "Intensif PSY2 + Examens blancs",                 focus: ["p2_projet","p2_parcours","p2_anglais","p2_qqf"] },
]

export const PSY0_EXAM_ORDER = [
  "p0_m2back","p0_pairou","p0_unmotdeux","p0_formes","p0_airways",
  "p0_psychomot","p0_series","p0_billes","p0_formes2","p0_objets3d",
  "p0_cubes","p0_empilements","p0_boites","p0_motsetoile",
  "p0_grilles","p0_aero","p0_anglais"
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
