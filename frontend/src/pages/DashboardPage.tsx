import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { childrenAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { useAuth } from "../contexts/AuthContext";
import { Child } from "../types";
import ChildFormModal from "../components/ChildFormModal";

const CYCLE_STYLES: Record<string, { bg: string; badge: string; label: string }> = {
  eveil:      { bg: "from-pink-200 to-rose-200",     badge: "bg-pink-100 text-pink-600",     label: "Éveil" },
  maternelle: { bg: "from-sky-200 to-blue-200",      badge: "bg-sky-100 text-sky-600",       label: "Maternelle" },
  primaire:   { bg: "from-emerald-200 to-green-200", badge: "bg-emerald-100 text-emerald-600", label: "Primaire" },
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 bg-white/70 backdrop-blur-sm border-b border-amber-100">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌟</span>
          <span className="text-2xl font-extrabold text-amber-600 tracking-tight">Kido</span>
        </div>
        <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600 transition">
          Déconnexion
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Qui joue aujourd'hui ?</h1>
          <p className="text-gray-400 mt-1">Choisis un profil pour commencer les activités</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {children.map((child) => {
            const style = CYCLE_STYLES[child.cycle];
            const age = new Date().getFullYear() - child.birth_year;
            return (
              <button
                key={child.id}
                onClick={() => selectChild(child)}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden text-left"
              >
                {/* Avatar banner */}
                <div className={`bg-gradient-to-br ${style.bg} h-28 flex items-center justify-center`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-200">
                    {child.avatar}
                  </span>
                </div>
                {/* Info */}
                <div className="p-4">
                  <p className="font-extrabold text-gray-800 text-lg">{child.name}</p>
                  <p className="text-sm text-gray-400">{age} an{age > 1 ? "s" : ""}</p>
                  <div className="mt-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {/* Add child card */}
          <button
            onClick={() => setShowModal(true)}
            className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 hover:border-amber-400 transition-all flex flex-col items-center justify-center gap-2 min-h-[180px] text-amber-400 hover:text-amber-500"
          >
            <span className="text-4xl font-light">+</span>
            <span className="text-sm font-semibold">Ajouter un enfant</span>
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
