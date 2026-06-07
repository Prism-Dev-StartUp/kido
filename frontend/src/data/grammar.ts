export interface PhaseConfig {
  id: "decouverte" | "guidee" | "autonomie" | "reinvest";
  label: string;
  description: string;
  activityKey: string;
}

export interface WordTypeConfig {
  id: string;
  label: string;
  labelShort: string;
  color: string;
  colorBg: string;
  symbol: "triangle-lg" | "triangle-md" | "triangle-sm" | "circle-lg" | "circle-sm" | "half-circle" | "dash";
  definition: string;
  example: string;
  phases: PhaseConfig[];
}

export const WORD_TYPES: WordTypeConfig[] = [
  {
    id: "nom",
    label: "Le nom",
    labelShort: "Nom",
    color: "#2d2a26",
    colorBg: "#f0ede8",
    symbol: "triangle-lg",
    definition: "Un mot qui désigne une chose, une personne, un animal ou un lieu.",
    example: "chat · école · médecin · livre",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Rencontre les noms autour de toi", activityKey: "NomDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Trie les noms dans les bons paniers", activityKey: "NomSortScene" },
      { id: "autonomie",  label: "Autonomie", description: "Retrouve les paires image–mot", activityKey: "NomMemoryScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Chasse les noms cachés dans un texte", activityKey: "NomHuntScene" },
    ],
  },
  {
    id: "determinant",
    label: "Le déterminant",
    labelShort: "Déterminant",
    color: "#7c5c2e",
    colorBg: "#fdf5eb",
    symbol: "triangle-sm",
    definition: "Un mot qui accompagne le nom et précise son genre et son nombre.",
    example: "le · la · les · un · une · des",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Rencontre les déterminants", activityKey: "DetDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Associe le bon déterminant au nom", activityKey: "DetAssocScene" },
      { id: "autonomie",  label: "Autonomie", description: "Complète les phrases", activityKey: "DetFillScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Repère les déterminants dans un texte", activityKey: "DetHuntScene" },
    ],
  },
  {
    id: "adjectif",
    label: "L'adjectif",
    labelShort: "Adjectif",
    color: "#1e3a8a",
    colorBg: "#eff3ff",
    symbol: "triangle-md",
    definition: "Un mot qui décrit ou qualifie le nom.",
    example: "grand · rouge · doux · ancien",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Observe comment les adjectifs enrichissent les noms", activityKey: "AdjDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Décris des objets avec les bons adjectifs", activityKey: "AdjDescScene" },
      { id: "autonomie",  label: "Autonomie", description: "Construis ton groupe nominal", activityKey: "AdjBuildScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Colorie les adjectifs dans un texte", activityKey: "AdjHuntScene" },
    ],
  },
  {
    id: "verbe",
    label: "Le verbe",
    labelShort: "Verbe",
    color: "#b91c1c",
    colorBg: "#fff5f5",
    symbol: "circle-lg",
    definition: "Un mot qui exprime une action ou un état.",
    example: "courir · dormir · être · manger",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Vois les verbes prendre vie en action", activityKey: "VerbDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Trouve le verbe dans la phrase", activityKey: "VerbAnimScene" },
      { id: "autonomie",  label: "Autonomie", description: "Trie actions et non-actions", activityKey: "VerbSortScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Identifie tous les verbes du texte", activityKey: "VerbHuntScene" },
    ],
  },
  {
    id: "pronom",
    label: "Le pronom",
    labelShort: "Pronom",
    color: "#6d28d9",
    colorBg: "#f5f3ff",
    symbol: "triangle-lg",
    definition: "Un mot qui remplace un nom ou un groupe nominal.",
    example: "je · tu · il · elle · nous · ils",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Découvre comment les pronoms remplacent les noms", activityKey: "PronDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Remplace le groupe nominal par un pronom", activityKey: "PronSubstScene" },
      { id: "autonomie",  label: "Autonomie", description: "Qui parle ? Qui agit ?", activityKey: "PronRoleScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Complète le dialogue avec les bons pronoms", activityKey: "PronFillScene" },
    ],
  },
  {
    id: "adverbe",
    label: "L'adverbe",
    labelShort: "Adverbe",
    color: "#c2410c",
    colorBg: "#fff7ed",
    symbol: "circle-sm",
    definition: "Un mot qui modifie le sens d'un verbe, d'un adjectif ou d'un autre adverbe.",
    example: "vite · doucement · très · souvent",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Vois comment l'adverbe change l'action", activityKey: "AdvDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Modifie les animations avec des adverbes", activityKey: "AdvModScene" },
      { id: "autonomie",  label: "Autonomie", description: "Classe les adverbes par type", activityKey: "AdvSortScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Compare des phrases avec et sans adverbe", activityKey: "AdvCompScene" },
    ],
  },
  {
    id: "preposition",
    label: "La préposition",
    labelShort: "Préposition",
    color: "#15803d",
    colorBg: "#f0fdf4",
    symbol: "half-circle",
    definition: "Un mot invariable qui indique une relation entre deux éléments.",
    example: "dans · sur · sous · avec · à · de",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Positionne des objets et nomme leur relation", activityKey: "PrepDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Pose l'objet selon la consigne", activityKey: "PrepSpaceScene" },
      { id: "autonomie",  label: "Autonomie", description: "Choisis la bonne préposition", activityKey: "PrepChoiceScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Repère les prépositions dans le texte", activityKey: "PrepHuntScene" },
    ],
  },
  {
    id: "conjonction",
    label: "La conjonction",
    labelShort: "Conjonction",
    color: "#be185d",
    colorBg: "#fdf2f8",
    symbol: "dash",
    definition: "Un mot qui relie deux mots ou deux propositions.",
    example: "et · mais · ou · car · donc · parce que",
    phases: [
      { id: "decouverte", label: "Découverte", description: "Découvre comment les conjonctions relient les idées", activityKey: "ConjDiscovery" },
      { id: "guidee",     label: "Entraînement", description: "Assemble les propositions", activityKey: "ConjBuildScene" },
      { id: "autonomie",  label: "Autonomie", description: "Construis tes propres phrases composées", activityKey: "ConjFreeScene" },
      { id: "reinvest",   label: "Dans les phrases", description: "Complète les phrases avec les bonnes conjonctions", activityKey: "ConjFillScene" },
    ],
  },
];

export type ProgressStatus = "not_started" | "in_progress" | "done";

export interface ChildProgress {
  [wordTypeId: string]: { [phaseId: string]: ProgressStatus };
}

export function getProgress(childId: number): ChildProgress {
  const raw = localStorage.getItem(`kido_progress_${childId}`);
  return raw ? JSON.parse(raw) : {};
}

export function setPhaseProgress(
  childId: number,
  wordTypeId: string,
  phaseId: string,
  status: ProgressStatus,
) {
  const p = getProgress(childId);
  if (!p[wordTypeId]) p[wordTypeId] = {};
  p[wordTypeId][phaseId] = status;
  localStorage.setItem(`kido_progress_${childId}`, JSON.stringify(p));
}
