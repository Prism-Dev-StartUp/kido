import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { childrenAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Child } from "../types";
import ChildFormModal from "../components/ChildFormModal";
import Navbar from "../components/Navbar";

const CYCLE_META: Record<string, { label: string; color: string; bg: string; ages: string }> = {
  eveil:      { label: "Éveil",      color: "#f97316", bg: "#fff7ed", ages: "0 – 3 ans" },
  maternelle: { label: "Maternelle", color: "#01B273", bg: "#f0fdf9", ages: "3 – 6 ans" },
  primaire:   { label: "Primaire",   color: "#3b82f6", bg: "#eff6ff", ages: "6 – 12 ans" },
};

const CYCLE_CARDS = [
  { key: "eveil",      icon: "🌱", title: "Éveil",      desc: "Discrimination sensorielle, premiers mots, motricité",     ages: "0 – 3 ans",  color: "border-orange-200 hover:border-orange-400" },
  { key: "maternelle", icon: "🎈", title: "Maternelle", desc: "Formes, lettres, langage oral, comptage",                  ages: "3 – 6 ans",  color: "border-emerald-200 hover:border-emerald-400" },
  { key: "primaire",   icon: "🚀", title: "Primaire",   desc: "Grammaire, numération, géographie, sciences",              ages: "6 – 12 ans", color: "border-blue-200 hover:border-blue-400" },
];

export default function DashboardPage() {
  const { setActiveChild } = useChild();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    childrenAPI.list().then((r) => setChildren(r.data));
  }, []);

  const handleAdd = async (data: Parameters<typeof childrenAPI.create>[0]) => {
    const { data: child } = await childrenAPI.create(data);
    setChildren((prev) => [...prev, child]);
    setShowModal(false);
  };

  const selectChild = (child: Child) => {
    setActiveChild(child);
    navigate(`/cycles/${child.cycle}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 flex items-center justify-between gap-8">
          <div>
            <p className="text-[#01B273] font-semibold text-sm uppercase tracking-widest mb-3">Espace parent</p>
            <h1 className="text-4xl font-bold mb-3 leading-tight">Qui apprend aujourd'hui ?</h1>
            <p className="text-white/50 text-base max-w-lg">
              Sélectionne un profil enfant pour accéder aux activités de son cycle, ou crée un nouveau profil.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
            <div className="text-5xl font-bold text-white">{children.length}</div>
            <div className="text-white/40 text-sm font-medium">apprenant{children.length > 1 ? "s" : ""} inscrit{children.length > 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-14">
        {/* Children section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#1c1d1f] text-xl font-bold">Mes apprenants</h2>
              <p className="text-[#6a6f73] text-sm mt-0.5">Sélectionne un profil pour commencer</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#01B273] hover:bg-[#009060] text-white font-bold px-4 py-2.5 rounded text-sm transition"
            >
              <span className="text-lg leading-none">+</span>
              Ajouter un enfant
            </button>
          </div>

          {children.length === 0 ? (
            <div className="bg-white border border-[#d1d7dc] rounded-lg p-16 text-center">
              <p className="text-5xl mb-4">👶</p>
              <h3 className="text-[#1c1d1f] font-bold text-lg mb-2">Aucun profil enfant</h3>
              <p className="text-[#6a6f73] text-sm mb-6">Commence par ajouter le premier profil pour accéder aux activités.</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-[#01B273] hover:bg-[#009060] text-white font-bold px-6 py-3 rounded text-sm transition"
              >
                Créer un profil
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {children.map((child) => {
                const meta = CYCLE_META[child.cycle];
                const age = new Date().getFullYear() - child.birth_year;
                return (
                  <button
                    key={child.id}
                    onClick={() => selectChild(child)}
                    className="group bg-white border border-[#d1d7dc] hover:border-[#01B273] hover:shadow-lg rounded-lg overflow-hidden text-left transition-all duration-200"
                  >
                    {/* Avatar */}
                    <div className="h-32 flex items-center justify-center" style={{ backgroundColor: meta.bg }}>
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-200">
                        {child.avatar}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-[#d1d7dc]">
                      <p className="font-bold text-[#1c1d1f] text-base leading-tight">{child.name}</p>
                      <p className="text-[#6a6f73] text-xs mt-0.5 mb-3">
                        {age} an{age > 1 ? "s" : ""}
                        {child.gender === "boy" ? " · Garçon" : child.gender === "girl" ? " · Fille" : ""}
                      </p>
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        {meta.label} · {meta.ages}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Add child card */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-white border-2 border-dashed border-[#d1d7dc] hover:border-[#01B273] hover:bg-[#f0fdf9] rounded-lg flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#f0fdf9] group-hover:bg-[#d1fae5] flex items-center justify-center transition-colors border border-[#d1d7dc] group-hover:border-[#01B273]">
                  <span className="text-2xl text-[#01B273] leading-none">+</span>
                </div>
                <span className="text-sm font-bold text-[#6a6f73] group-hover:text-[#01B273] transition-colors">
                  Ajouter un enfant
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Cycles section */}
        <section>
          <div className="mb-6">
            <h2 className="text-[#1c1d1f] text-xl font-bold">Les cycles d'apprentissage</h2>
            <p className="text-[#6a6f73] text-sm mt-0.5">Chaque cycle propose des activités adaptées à l'âge et au développement de l'enfant</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CYCLE_CARDS.map((c) => (
              <div
                key={c.key}
                className={`bg-white border-2 ${c.color} rounded-lg p-6 transition-all duration-200 cursor-default`}
              >
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="font-bold text-[#1c1d1f] text-lg mb-1">{c.title}</h3>
                <p className="text-[#6a6f73] text-sm leading-relaxed mb-3">{c.desc}</p>
                <span className="text-xs font-bold text-[#9b9b9b] uppercase tracking-wider">{c.ages}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showModal && (
        <ChildFormModal onClose={() => setShowModal(false)} onSubmit={handleAdd} />
      )}
    </div>
  );
}
