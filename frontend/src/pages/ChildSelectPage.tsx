import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { childrenAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { useAuth } from "../contexts/AuthContext";
import { Child } from "../types";

const AVATARS = ["🦊","🐻","🐼","🐨","🦁","🐯","🐸","🐙","🦋","🦄","🐬","🦅"];

export default function ChildSelectPage() {
  const { setActiveChild } = useChild();
  const { logout } = useAuth();
  const nav = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 8);
  const [avatar, setAvatar] = useState("🦊");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    childrenAPI.list().then(r => setChildren(r.data));
  }, []);

  const selectChild = (child: Child) => {
    setActiveChild(child);
    nav("/jouer");
  };

  const createChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await childrenAPI.create({ name, birth_year: birthYear, avatar });
      setChildren(prev => [...prev, data]);
      setShowForm(false);
      setName("");
      selectChild(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="font-black text-xl text-ink">Kido</span>
          <button onClick={() => { logout(); nav("/login"); }} className="btn-ghost text-sm px-3 py-1">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-12">
        <h1 className="text-3xl font-black text-ink mb-2">Qui joue aujourd'hui ?</h1>
        <p className="text-muted font-medium mb-8">Sélectionne ton profil pour commencer.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {children.map(child => (
            <button
              key={child.id}
              onClick={() => selectChild(child)}
              className="card-hover flex flex-col items-center gap-3 py-8"
            >
              <span className="text-5xl">{child.avatar}</span>
              <span className="font-bold text-ink text-lg">{child.name}</span>
              <span className="text-xs text-muted font-medium">{child.birth_year}</span>
            </button>
          ))}

          <button
            onClick={() => setShowForm(true)}
            className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 border-dashed border-border hover:border-muted transition cursor-pointer text-muted hover:text-ink"
          >
            <span className="text-3xl">＋</span>
            <span className="text-sm font-bold">Ajouter un enfant</span>
          </button>
        </div>

        {showForm && (
          <div className="card mt-6">
            <h2 className="text-lg font-bold mb-5">Nouveau profil</h2>
            <form onSubmit={createChild} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">Prénom</label>
                <input className="input" placeholder="Léa" value={name}
                  onChange={e => setName(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">Année de naissance</label>
                <input className="input" type="number" min={2010} max={2020}
                  value={birthYear} onChange={e => setBirthYear(Number(e.target.value))} required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(a => (
                    <button type="button" key={a}
                      onClick={() => setAvatar(a)}
                      className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition ${
                        avatar === a ? "bg-ink/10 ring-2 ring-ink" : "hover:bg-border"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? "Création…" : "Créer le profil"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
