import { useNavigate } from "react-router-dom";
import { Game, Progress } from "../types";

interface Props {
  game: Game;
  progress?: Progress;
}

const CYCLE_BG: Record<string, string> = {
  eveil: "from-pink-400 to-rose-400",
  maternelle: "from-sky-400 to-blue-500",
  primaire: "from-emerald-400 to-green-500",
};

const DIFFICULTY_LABEL = ["", "Facile", "Moyen", "Difficile"];
const DIFFICULTY_COLOR = ["", "text-emerald-600 bg-emerald-100", "text-amber-600 bg-amber-100", "text-red-500 bg-red-100"];

export default function GameCard({ game, progress }: Props) {
  const navigate = useNavigate();
  const stars = progress?.score ? Math.min(3, Math.ceil(progress.score / 34)) : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className={`bg-gradient-to-br ${CYCLE_BG[game.cycle]} h-32 flex items-center justify-center relative`}>
        <span className="text-6xl drop-shadow-md">{game.thumbnail}</span>
        {progress?.completed && (
          <div className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-lg">
            ⭐
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-800 text-sm leading-tight">{game.title}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${DIFFICULTY_COLOR[game.difficulty]}`}>
            {DIFFICULTY_LABEL[game.difficulty]}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3 leading-relaxed flex-1">{game.description}</p>

        {/* Skill badge */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-sm">{game.skill.icon}</span>
          <span className="text-xs text-gray-500">{game.skill.name}</span>
        </div>

        {/* Stars progress */}
        {progress && (
          <div className="flex gap-1 mb-3">
            {[1, 2, 3].map((i) => (
              <span key={i} className={`text-lg ${i <= stars ? "text-amber-400" : "text-gray-200"}`}>★</span>
            ))}
            <span className="text-xs text-gray-400 ml-1 self-center">{progress.score} pts</span>
          </div>
        )}

        <button
          onClick={() => navigate(`/play/${game.id}`)}
          className={`w-full bg-gradient-to-r ${CYCLE_BG[game.cycle]} text-white font-bold py-2.5 rounded-2xl text-sm hover:opacity-90 transition shadow-sm`}
        >
          {progress?.completed ? "Rejouer" : "Jouer"}
        </button>
      </div>
    </div>
  );
}
