import { Cycle } from "../types";

const CYCLES: { value: Cycle; label: string; ages: string; icon: string; color: string; desc: string }[] = [
  {
    value: "eveil",
    label: "Éveil",
    ages: "0 – 3 ans",
    icon: "🌱",
    color: "border-pink-300 bg-pink-50 text-pink-700",
    desc: "Couleurs, sons, textures, sensorialité",
  },
  {
    value: "maternelle",
    label: "Maternelle",
    ages: "3 – 6 ans",
    icon: "🎈",
    color: "border-sky-300 bg-sky-50 text-sky-700",
    desc: "Lettres, formes, chiffres, langage",
  },
  {
    value: "primaire",
    label: "Primaire",
    ages: "6 – 12 ans",
    icon: "🚀",
    color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    desc: "Calcul, lecture, sciences, géographie",
  },
];

interface Props {
  value: string | null;
  onChange: (cycle: Cycle | null) => void;
  birthYear: number;
}

function autoLabel(birthYear: number): Cycle {
  const age = new Date().getFullYear() - birthYear;
  if (age <= 3) return "eveil";
  if (age <= 6) return "maternelle";
  return "primaire";
}

export default function CycleSelector({ value, onChange, birthYear }: Props) {
  const auto = autoLabel(birthYear);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 mb-1">Niveau d'activités</p>
      <p className="text-xs text-gray-400 mb-3">
        Auto-détecté : <span className="font-medium capitalize">{auto}</span> — tu peux changer ci-dessous
      </p>
      <div className="grid grid-cols-3 gap-3">
        {CYCLES.map((c) => {
          const selected = value === c.value || (!value && auto === c.value);
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(value === c.value ? null : c.value)}
              className={`rounded-2xl border-2 p-3 text-left transition-all hover:scale-105 ${
                selected ? c.color + " shadow-md scale-105" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="font-bold text-sm">{c.label}</div>
              <div className="text-xs opacity-75">{c.ages}</div>
              <div className="text-xs mt-1 opacity-60 leading-tight">{c.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
