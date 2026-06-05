import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game, Progress, Cycle } from "../types";
import GameCard from "../components/GameCard";

const CYCLE_META: Record<Cycle, { label: string; icon: string; bg: string; text: string }> = {
  eveil:      { label: "Éveil",      icon: "🌱", bg: "from-pink-400 to-rose-500",     text: "text-pink-600" },
  maternelle: { label: "Maternelle", icon: "🎈", bg: "from-sky-400 to-blue-500",      text: "text-sky-600" },
  primaire:   { label: "Primaire",   icon: "🚀", bg: "from-emerald-400 to-green-500", text: "text-emerald-600" },
};

const AGE_RANGE: Record<Cycle, string> = {
  eveil: "0 – 3 ans",
  maternelle: "3 – 6 ans",
  primaire: "6 – 12 ans",
};

export default function CyclePage() {
  const { cycle } = useParams<{ cycle: Cycle }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, Progress>>({});
  const [filter, setFilter] = useState<string>("all");

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
  const completedCount = games.filter((g) => progressMap[g.id]?.completed).length;

  const skills = Array.from(new Set(games.map((g) => g.skill.name)));
  const filtered = filter === "all" ? games : games.filter((g) => g.skill.name === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero banner */}
      <div className={`bg-gradient-to-r ${meta.bg} px-8 py-8`}>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:text-white text-sm font-medium mb-4 flex items-center gap-1 transition"
        >
          ← Retour
        </button>

        <div className="flex items-center gap-5">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-5xl">{activeChild.avatar}</div>
          <div className="text-white">
            <h1 className="text-2xl font-extrabold">{activeChild.name}</h1>
            <p className="text-white/80 text-sm">
              {meta.icon} {meta.label} · {AGE_RANGE[cycle!]}
            </p>
          </div>

          {games.length > 0 && (
            <div className="ml-auto text-right text-white">
              <p className="text-3xl font-extrabold">{completedCount}/{games.length}</p>
              <p className="text-white/80 text-xs">activités terminées</p>
              <div className="mt-2 bg-white/20 rounded-full h-2 w-28 overflow-hidden ml-auto">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${(completedCount / games.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Skill filters */}
        {skills.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tout
            </button>
            {skills.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  filter === s ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-gray-400 font-medium">Aucun jeu disponible pour ce cycle pour l'instant.</p>
            <p className="text-gray-300 text-sm mt-1">Reviens bientôt !</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} progress={progressMap[game.id]} />
          ))}
        </div>
      </main>
    </div>
  );
}
