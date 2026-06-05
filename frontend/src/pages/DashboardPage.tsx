import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { childrenAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { useAuth } from "../contexts/AuthContext";
import { Child } from "../types";
import ChildFormModal from "../components/ChildFormModal";

const CYCLE_STYLES: Record<string, { gradient: string; badge: string; label: string }> = {
  eveil:      { gradient: "from-pink-400 via-rose-400 to-fuchsia-500",    badge: "bg-pink-100 text-pink-600",       label: "Éveil" },
  maternelle: { gradient: "from-violet-400 via-purple-500 to-indigo-500", badge: "bg-violet-100 text-violet-600",   label: "Maternelle" },
  primaire:   { gradient: "from-cyan-400 via-sky-500 to-blue-500",        badge: "bg-cyan-100 text-cyan-700",       label: "Primaire" },
};

export default function DashboardPage() {
  const { logout } = useAuth();
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
    <div className="min-h-screen bg-[#F5F3FF]">
      {/* Header */}
      <header className="kido-gradient px-8 py-4 flex justify-between items-center shadow-lg shadow-purple-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌟</span>
          <span className="font-fredoka text-white text-3xl tracking-wide">Kido</span>
        </div>
        <button
          onClick={logout}
          className="text-white/70 hover:text-white text-sm font-bold transition"
        >
          Déconnexion
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-10">
          <h1 className="font-fredoka text-4xl text-gray-800 mb-1">Qui joue aujourd'hui ?</h1>
          <p className="text-gray-400 font-semibold">Choisis un profil pour commencer les activités</p>
        </div>

        {/* Children grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {children.map((child) => {
            const style = CYCLE_STYLES[child.cycle];
            const age = new Date().getFullYear() - child.birth_year;
            return (
              <button
                key={child.id}
                onClick={() => selectChild(child)}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-2 text-left"
              >
                {/* Avatar zone */}
                <div className={`bg-gradient-to-br ${style.gradient} h-36 flex items-center justify-center relative overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                  <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {child.avatar}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="font-fredoka text-2xl text-gray-800 leading-none">{child.name}</p>
                  <p className="text-gray-400 text-sm font-semibold mt-1 mb-3">
                    {age} an{age > 1 ? "s" : ""}
                    {child.gender === "boy" ? " · 👦" : child.gender === "girl" ? " · 👧" : ""}
                  </p>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Add child */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-3xl border-3 border-dashed border-purple-200 bg-white/60 hover:bg-white hover:border-purple-400 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[220px] group"
          >
            <div className="w-16 h-16 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
              <span className="text-3xl text-purple-400 font-light">+</span>
            </div>
            <span className="text-sm font-bold text-purple-400 group-hover:text-purple-600 transition-colors">
              Ajouter un enfant
            </span>
          </button>
        </div>
      </main>

      {showModal && (
        <ChildFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
}
