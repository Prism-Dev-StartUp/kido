import { useNavigate } from "react-router-dom";
import { Game, Progress } from "../types";

interface Props {
  game: Game;
  progress?: Progress;
}

const CYCLE_GRADIENT: Record<string, string> = {
  eveil:      "from-pink-400 via-rose-400 to-fuchsia-500",
  maternelle: "from-violet-400 via-purple-500 to-indigo-500",
  primaire:   "from-cyan-400 via-sky-500 to-blue-500",
};

const DIFFICULTY: Record<number, { label: string; color: string }> = {
  1: { label: "Facile",    color: "bg-emerald-100 text-emerald-600" },
  2: { label: "Moyen",     color: "bg-amber-100 text-amber-600" },
  3: { label: "Difficile", color: "bg-red-100 text-red-500" },
};

export default function GameCard({ game, progress }: Props) {
  const navigate = useNavigate();
  const stars = progress?.score ? Math.min(3, Math.ceil(progress.score / 34)) : 0;
  const diff = DIFFICULTY[game.difficulty];
  const grad = CYCLE_GRADIENT[game.cycle];

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-2 flex flex-col">
      {/* Thumbnail */}
      <div className={`bg-gradient-to-br ${grad} h-28 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        <span className="text-6xl drop-shadow-md relative z-10">{game.thumbnail}</span>
        {progress?.completed && (
          <div className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-base z-10">
            ✅
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-fredoka text-lg text-gray-800 leading-tight">{game.title}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${diff.color}`}>
            {diff.label}
          </span>
        </div>

        <p className="text-xs text-gray-400 font-semibold mb-3 leading-relaxed flex-1">{game.description}</p>

        {/* Skill */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-base">{game.skill.icon}</span>
          <span className="text-xs font-bold text-gray-500">{game.skill.name}</span>
        </div>

        {/* Stars */}
        {progress && (
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`text-xl ${i <= stars ? "text-yellow-400" : "text-gray-200"}`}>★</span>
            ))}
            <span className="text-xs font-bold text-gray-400 ml-1">{progress.score} pts</span>
          </div>
        )}

        <button
          onClick={() => navigate(`/play/${game.id}`)}
          className={`w-full bg-gradient-to-r ${grad} text-white font-extrabold py-3 rounded-2xl text-sm hover:opacity-90 transition shadow-md`}
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {progress?.completed ? "🔄 Rejouer" : "▶ Jouer"}
        </button>
      </div>
    </div>
  );
}
