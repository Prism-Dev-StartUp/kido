import { useState } from "react";

interface Props { onComplete: (score: number) => void; }

const CATEGORIES = [
  {
    id: "objet", label: "Les objets", color: "#64748b", bg: "#f1f5f9",
    items: [
      { word: "table", emoji: "🪑" }, { word: "livre", emoji: "📚" },
      { word: "vélo", emoji: "🚲" }, { word: "stylo", emoji: "✏️" },
      { word: "ballon", emoji: "⚽" }, { word: "lampe", emoji: "💡" },
    ],
  },
  {
    id: "personne", label: "Les personnes", color: "#1d4ed8", bg: "#eff6ff",
    items: [
      { word: "enfant", emoji: "🧒" }, { word: "médecin", emoji: "👨‍⚕️" },
      { word: "élève", emoji: "🎒" }, { word: "roi", emoji: "👑" },
      { word: "acteur", emoji: "🎭" }, { word: "voisin", emoji: "🏘️" },
    ],
  },
  {
    id: "animal", label: "Les animaux", color: "#15803d", bg: "#f0fdf4",
    items: [
      { word: "chat", emoji: "🐱" }, { word: "oiseau", emoji: "🐦" },
      { word: "dauphin", emoji: "🐬" }, { word: "fourmi", emoji: "🐜" },
      { word: "lion", emoji: "🦁" }, { word: "lapin", emoji: "🐰" },
    ],
  },
  {
    id: "lieu", label: "Les lieux", color: "#c2410c", bg: "#fff7ed",
    items: [
      { word: "école", emoji: "🏫" }, { word: "forêt", emoji: "🌲" },
      { word: "ville", emoji: "🏙️" }, { word: "plage", emoji: "🏖️" },
      { word: "jardin", emoji: "🌿" }, { word: "montagne", emoji: "⛰️" },
    ],
  },
];

export default function NomDiscovery({ onComplete }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const cat = CATEGORIES[activeTab];

  const tap = (word: string) => setExplored(prev => new Set([...prev, word]));

  return (
    <div className="min-h-[calc(100vh-56px)] bg-paper flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-5 py-8 flex flex-col flex-1">

        {/* Intro */}
        <div className="mb-6 p-5 bg-white rounded-2xl border border-border">
          <p className="font-black text-ink text-lg mb-1">Qu'est-ce qu'un nom ?</p>
          <p className="text-muted font-medium leading-relaxed">
            Un nom désigne une <strong>chose</strong>, une <strong>personne</strong>,
            un <strong>animal</strong> ou un <strong>lieu</strong>.
            Clique sur chaque carte pour l'explorer.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                i === activeTab
                  ? "text-white shadow-sm"
                  : "bg-white border border-border text-muted hover:text-ink"
              }`}
              style={i === activeTab ? { backgroundColor: c.color } : {}}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          {cat.items.map(item => {
            const seen = explored.has(item.word);
            return (
              <button
                key={item.word}
                onClick={() => tap(item.word)}
                className={`flex flex-col items-center gap-3 py-6 rounded-2xl border-2 transition-all ${
                  seen
                    ? "border-[var(--c)] shadow-md scale-[1.02]"
                    : "bg-white border-border hover:border-muted hover:shadow"
                }`}
                style={{
                  ["--c" as string]: cat.color,
                  backgroundColor: seen ? cat.bg : "white",
                }}
              >
                <span className="text-4xl">{item.emoji}</span>
                <span
                  className="text-sm font-black"
                  style={{ color: seen ? cat.color : "#2d2a26" }}
                >
                  {item.word}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted font-medium">
            {explored.size} / {CATEGORIES.reduce((a, c) => a + c.items.length, 0)} mots explorés
          </p>
          <button
            onClick={() => onComplete(100)}
            className="btn-primary px-8 py-3"
          >
            J'ai tout exploré !
          </button>
        </div>
      </div>
    </div>
  );
}
