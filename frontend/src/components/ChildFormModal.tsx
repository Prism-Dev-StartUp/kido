import { useState } from "react";
import AvatarPicker from "./AvatarPicker";
import CycleSelector from "./CycleSelector";
import { Cycle } from "../types";

interface FormData {
  name: string;
  birth_year: number;
  avatar: string;
  gender: string | null;
  preferred_cycle: Cycle | null;
}

interface Props {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

const GENDERS = [
  { value: "boy",   label: "Garçon", icon: "👦", color: "from-blue-400 to-sky-500" },
  { value: "girl",  label: "Fille",  icon: "👧", color: "from-pink-400 to-rose-500" },
  { value: "other", label: "Autre",  icon: "🧒", color: "from-violet-400 to-purple-500" },
];

const currentYear = new Date().getFullYear();

export default function ChildFormModal({ onClose, onSubmit }: Props) {
  const [form, setForm] = useState<FormData>({
    name: "",
    birth_year: currentYear - 4,
    avatar: "🧒",
    gender: null,
    preferred_cycle: null,
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const age = currentYear - form.birth_year;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSubmit(form); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="kido-gradient p-5 flex items-center justify-between">
          <div>
            <h2 className="font-fredoka text-white text-2xl">Nouveau profil</h2>
            <div className="flex gap-2 mt-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    step >= s ? "bg-white w-8" : "bg-white/30 w-4"
                  }`}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-3xl leading-none font-light">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {step === 1 && (
              <>
                {/* Prénom */}
                <div>
                  <label className="block text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lucas, Emma..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="kido-input"
                    required
                    autoFocus
                  />
                </div>

                {/* Année de naissance */}
                <div>
                  <label className="block text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-3">
                    Année de naissance *
                  </label>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-fredoka text-4xl text-purple-600">{form.birth_year}</span>
                      <span className="bg-purple-600 text-white font-extrabold px-4 py-2 rounded-xl text-sm">
                        {age === 0 ? "< 1 an" : `${age} an${age > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={currentYear - 12}
                      max={currentYear}
                      value={form.birth_year}
                      onChange={(e) => setForm({ ...form, birth_year: Number(e.target.value), preferred_cycle: null })}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 font-semibold mt-1">
                      <span>{currentYear - 12}</span>
                      <span>{currentYear}</span>
                    </div>
                  </div>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-3">
                    Genre
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {GENDERS.map((g) => {
                      const selected = form.gender === g.value;
                      return (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setForm({ ...form, gender: selected ? null : g.value })}
                          className={`flex flex-col items-center gap-2 py-4 rounded-2xl transition-all hover:scale-105 ${
                            selected
                              ? `bg-gradient-to-br ${g.color} text-white shadow-lg scale-105`
                              : "bg-gray-50 border-2 border-gray-100 text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          <span className="text-3xl">{g.icon}</span>
                          <span className="text-xs font-extrabold">{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.name}
                  className="w-full kido-gradient text-white font-extrabold py-4 rounded-2xl text-base hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                >
                  Continuer →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Preview */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <span className="text-5xl">{form.avatar}</span>
                  <div>
                    <p className="font-fredoka text-2xl text-gray-800">{form.name}</p>
                    <p className="text-sm text-gray-400 font-semibold">
                      {age} an{age > 1 ? "s" : ""} · {form.birth_year}
                    </p>
                  </div>
                </div>

                <AvatarPicker value={form.avatar} onChange={(emoji) => setForm({ ...form, avatar: emoji })} />

                <CycleSelector
                  value={form.preferred_cycle}
                  onChange={(cycle) => setForm({ ...form, preferred_cycle: cycle })}
                  birthYear={form.birth_year}
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-200 text-gray-500 font-extrabold py-4 rounded-2xl hover:border-gray-300 transition"
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 kido-gradient text-white font-extrabold py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-40 shadow-lg shadow-purple-200"
                  >
                    {loading ? "..." : "Créer le profil"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
