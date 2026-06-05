import { Cycle } from "../types";

const CYCLES: {
  value: Cycle; label: string; ages: string; icon: string;
  gradient: string; ring: string; desc: string;
}[] = [
  {
    value: "eveil",
    label: "Éveil",
    ages: "0 – 3 ans",
    icon: "🌱",
    gradient: "from-pink-400 to-fuchsia-500",
    ring: "ring-pink-400",
    desc: "Couleurs, sons, sensorialité",
  },
  {
    value: "maternelle",
    label: "Maternelle",
    ages: "3 – 6 ans",
    icon: "🎈",
    gradient: "from-violet-400 to-indigo-500",
    ring: "ring-violet-400",
    desc: "Lettres, formes, chiffres",
  },
  {
    value: "primaire",
    label: "Primaire",
    ages: "6 – 12 ans",
    icon: "🚀",
    gradient: "from-cyan-400 to-blue-500",
    ring: "ring-cyan-400",
    desc: "Calcul, lecture, sciences",
  },
];

function autoLevel(birthYear: number): Cycle {
  const age = new Date().getFullYear() - birthYear;
  if (age <= 3) return "eveil";
  if (age <= 6) return "maternelle";
  return "primaire";
}

interface Props {
  value: string | null;
  onChange: (cycle: Cycle | null) => void;
  birthYear: number;
}

export default function CycleSelector({ value, onChange, birthYear }: Props) {
  const auto = autoLevel(birthYear);

  return (
    <div>
      <p className="text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-1">
        Niveau d'activités
      </p>
      <p className="text-xs text-gray-400 font-semibold mb-3">
        Auto : <span className="text-purple-500 font-bold capitalize">{auto}</span> — tu peux personnaliser
      </p>
      <div className="grid grid-cols-3 gap-3">
        {CYCLES.map((c) => {
          const selected = value === c.value || (!value && auto === c.value);
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(value === c.value ? null : c.value)}
              className={`rounded-2xl p-3 text-left transition-all duration-200 hover:scale-105 ${
                selected
                  ? `bg-gradient-to-br ${c.gradient} text-white shadow-lg ring-3 ${c.ring} scale-105`
                  : "bg-gray-50 border-2 border-gray-100 text-gray-600 hover:border-gray-200"
              }`}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className={`font-fredoka text-base ${selected ? "text-white" : "text-gray-700"}`}>
                {c.label}
              </div>
              <div className={`text-xs font-bold ${selected ? "text-white/80" : "text-gray-400"}`}>
                {c.ages}
              </div>
              <div className={`text-xs mt-1 leading-tight ${selected ? "text-white/70" : "text-gray-400"}`}>
                {c.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
