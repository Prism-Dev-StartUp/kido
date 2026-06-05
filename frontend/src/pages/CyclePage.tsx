import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game, Cycle } from "../types";

const CYCLE_LABELS: Record<Cycle, string> = {
  eveil: "Éveil",
  maternelle: "Maternelle",
  primaire: "Primaire",
};

const DIFFICULTY_STARS = (d: number) => "★".repeat(d) + "☆".repeat(3 - d);

export default function CyclePage() {
  const { cycle } = useParams<{ cycle: Cycle }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (cycle) gamesAPI.list(cycle).then((r) => setGames(r.data));
  }, [cycle]);

  if (!activeChild) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/dashboard")} className="text-amber-500 hover:text-amber-700 text-2xl">←</button>
          <h1 className="text-3xl font-bold text-amber-700">
            {CYCLE_LABELS[cycle!]} — {activeChild.name}
          </h1>
        </div>

        {games.length === 0 && (
          <p className="text-gray-400 text-center mt-16">Aucun jeu disponible pour ce cycle.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => navigate(`/play/${game.id}`)}
              className="bg-white rounded-3xl shadow hover:shadow-md p-5 text-left hover:scale-105 transition"
            >
              <div className="text-5xl mb-3">{game.thumbnail || "🎮"}</div>
              <div className="font-bold text-gray-700">{game.title}</div>
              <div className="text-xs text-gray-400 mt-1">{game.description}</div>
              <div className="text-amber-400 mt-2 text-sm">{DIFFICULTY_STARS(game.difficulty)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
