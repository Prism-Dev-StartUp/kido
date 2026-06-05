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
  { value: "boy", label: "Garçon", icon: "👦" },
  { value: "girl", label: "Fille", icon: "👧" },
  { value: "other", label: "Autre", icon: "🧒" },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ajouter un enfant</h2>
            <p className="text-xs text-gray-400 mt-0.5">Étape {step} sur 2</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {step === 1 && (
            <>
              {/* Prénom */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Prénom *</label>
                <input
                  type="text"
                  placeholder="Ex: Lucas, Emma..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-amber-400 rounded-2xl px-4 py-3 outline-none text-gray-800 transition"
                  required
                />
              </div>

              {/* Année de naissance */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Année de naissance *</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={currentYear - 12}
                    max={currentYear}
                    value={form.birth_year}
                    onChange={(e) => setForm({ ...form, birth_year: Number(e.target.value) })}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-xl min-w-[80px] text-center">
                    {form.birth_year}
                    <span className="block text-xs font-normal">
                      {currentYear - form.birth_year === 0 ? "< 1 an" : `${currentYear - form.birth_year} an${currentYear - form.birth_year > 1 ? "s" : ""}`}
                    </span>
                  </span>
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Genre</label>
                <div className="flex gap-3">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setForm({ ...form, gender: form.gender === g.value ? null : g.value })}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all hover:scale-105 ${
                        form.gender === g.value
                          ? "border-amber-400 bg-amber-50 text-amber-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-xs font-medium">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!form.name}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-2xl transition"
              >
                Continuer →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {/* Preview */}
              <div className="flex items-center gap-4 bg-amber-50 rounded-2xl p-4">
                <span className="text-4xl">{form.avatar}</span>
                <div>
                  <p className="font-bold text-gray-800">{form.name}</p>
                  <p className="text-sm text-gray-500">{currentYear - form.birth_year} ans</p>
                </div>
              </div>

              {/* Avatar */}
              <AvatarPicker value={form.avatar} onChange={(emoji) => setForm({ ...form, avatar: emoji })} />

              {/* Cycle */}
              <CycleSelector
                value={form.preferred_cycle}
                onChange={(cycle) => setForm({ ...form, preferred_cycle: cycle })}
                birthYear={form.birth_year}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition"
                >
                  {loading ? "..." : "Créer le profil"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
