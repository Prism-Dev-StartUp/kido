import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { childrenAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { useAuth } from "../contexts/AuthContext";
import { Child } from "../types";

const CYCLE_LABELS = { eveil: "Éveil (0-3 ans)", maternelle: "Maternelle (3-6 ans)", primaire: "Primaire (6-12 ans)" };
const CYCLE_COLORS = { eveil: "bg-pink-100 border-pink-300", maternelle: "bg-sky-100 border-sky-300", primaire: "bg-green-100 border-green-300" };

export default function DashboardPage() {
  const { logout } = useAuth();
  const { setActiveChild } = useChild();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 4);

  useEffect(() => {
    childrenAPI.list().then((r) => setChildren(r.data));
  }, []);

  const addChild = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await childrenAPI.create({ name, birth_year: birthYear });
    setChildren((prev) => [...prev, data]);
    setName("");
    setShowAdd(false);
  };

  const selectChild = (child: Child) => {
    setActiveChild(child);
    navigate(`/cycles/${child.cycle}`);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-700">Mes enfants</h1>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-gray-600">Déconnexion</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => selectChild(child)}
              className={`rounded-3xl border-2 p-6 text-left hover:scale-105 transition ${CYCLE_COLORS[child.cycle]}`}
            >
              <div className="text-4xl mb-3">{child.avatar === "default" ? "🧒" : child.avatar}</div>
              <div className="font-bold text-lg text-gray-700">{child.name}</div>
              <div className="text-xs text-gray-500 mt-1">{CYCLE_LABELS[child.cycle]}</div>
            </button>
          ))}

          <button
            onClick={() => setShowAdd(true)}
            className="rounded-3xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center hover:border-amber-400 transition text-gray-400 hover:text-amber-500"
          >
            <span className="text-4xl">+</span>
          </button>
        </div>

        {showAdd && (
          <div className="bg-white rounded-3xl shadow p-6 max-w-sm">
            <h2 className="font-bold text-lg mb-4 text-gray-700">Ajouter un enfant</h2>
            <form onSubmit={addChild} className="space-y-3">
              <input
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-xl px-4 py-2"
                required
              />
              <input
                type="number"
                placeholder="Année de naissance"
                value={birthYear}
                onChange={(e) => setBirthYear(Number(e.target.value))}
                className="w-full border rounded-xl px-4 py-2"
                min={new Date().getFullYear() - 12}
                max={new Date().getFullYear()}
                required
              />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-amber-500 text-white rounded-xl py-2">Ajouter</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border rounded-xl py-2">Annuler</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
