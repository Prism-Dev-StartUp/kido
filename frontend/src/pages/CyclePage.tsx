import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game, Progress, Cycle } from "../types";
import GameCard from "../components/GameCard";

const CYCLE_META: Record<Cycle, { label: string; icon: string; gradient: string; ages: string }> = {
  eveil:      { label: "Éveil",      icon: "🌱", gradient: "from-pink-400 via-rose-400 to-fuchsia-500",    ages: "0 – 3 ans" },
  maternelle: { label: "Maternelle", icon: "🎈", gradient: "from-violet-400 via-purple-500 to-indigo-500", ages: "3 – 6 ans" },
  primaire:   { label: "Primaire",   icon: "🚀", gradient: "from-cyan-400 via-sky-500 to-blue-500",        ages: "6 – 12 ans" },
};

export default function CyclePage() {
  const { cycle } = useParams<{ cycle: Cycle }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, Progress>>({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!activeChild) { navigate("/dashboard"); return; }
    if (cycle) {
      gamesAPI.list(cycle).then((r) => setGames(r.data));
      gamesAPI.getProgress(activeChild.id).then((r) => {
        const map: Record<number, Progress> = {};
        r.data.forEach((p: Progress) => { map[p.game_id] = p; });
        setProgressMap(map);
      });
    }
  }, [cycle, activeChild]);

  if (!activeChild) return null;

  const meta = CYCLE_META[cycle!];
  const completed = games.filter((g) => progressMap[g.id]?.completed).length;
  const skills = Array.from(new Set(games.map((g) => g.skill.name)));
  const filtered = filter === "all" ? games : games.filter((g) => g.skill.name === filter);

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${meta.gradient} relative overflow-hidden`}>
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/10 rounded-full" />
        <div className="absolute top-8 right-32 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 left-1/3 w-40 h-40 bg-white/10 rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white/70 hover:text-white text-sm font-bold mb-6 flex items-center gap-1 transition"
          >
            ← Retour
          </button>

          <div className="flex items-center gap-5 flex-wrap">
            {/* Avatar */}
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-4 text-6xl shadow-lg">
              {activeChild.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-white/70 font-bold text-sm uppercase tracking-wider mb-1">
                {meta.label} · {meta.ages}
              </p>
              <h1 className="font-fredoka text-4xl text-white">{activeChild.name}</h1>
            </div>

            {/* Progress bubble */}
            {games.length > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-4 text-center">
                <p className="font-fredoka text-5xl text-white">{completed}<span className="text-2xl text-white/60">/{games.length}</span></p>
                <p className="text-white/70 text-xs font-bold mt-1">activités</p>
                <div className="mt-2 bg-white/20 rounded-full h-2.5 w-32 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: games.length ? `${(completed / games.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Skill filters */}
        {skills.length > 1 && (
          <div className="flex gap-2 mb-8 flex-wrap">
            {["all", ...skills].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === s
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-500 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {s === "all" ? "Tout voir" : s}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎮</p>
            <p className="font-fredoka text-2xl text-gray-500">Bientôt disponible !</p>
            <p className="text-gray-400 text-sm font-semibold mt-2">De nouveaux jeux arrivent très vite.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} progress={progressMap[game.id]} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
