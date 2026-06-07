import { useNavigate } from "react-router-dom";
import { Game, Progress } from "../types";

interface Props {
  game: Game;
  progress?: Progress;
}

const CYCLE_BG: Record<string, string> = {
  eveil:      "linear-gradient(135deg, #fbbf24, #f97316)",
  maternelle: "linear-gradient(135deg, #34d399, #01B273)",
  primaire:   "linear-gradient(135deg, #60a5fa, #3b82f6, #1e40af)",
};

const DIFFICULTY: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Facile",    color: "#16a34a", bg: "#f0fdf4" },
  2: { label: "Moyen",     color: "#d97706", bg: "#fffbeb" },
  3: { label: "Difficile", color: "#dc2626", bg: "#fef2f2" },
};

export default function GameCard({ game, progress }: Props) {
  const navigate = useNavigate();
  const diff = DIFFICULTY[game.difficulty];
  const stars = progress?.score ? Math.min(3, Math.ceil(progress.score / 34)) : 0;
  const pct = progress?.score ? Math.min(100, Math.round((progress.score / 96) * 100)) : 0;

  return (
    <div className="bg-white border border-[#d1d7dc] rounded-lg overflow-hidden hover:shadow-xl hover:border-[#01B273]/40 transition-all duration-200 flex flex-col group">
      {/* Thumbnail — 16:9 */}
      <div
        className="relative w-full"
        style={{ paddingTop: "56.25%", background: CYCLE_BG[game.cycle] }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl drop-shadow group-hover:scale-110 transition-transform duration-200">
            {game.thumbnail}
          </span>
        </div>
        {progress?.completed && (
          <div className="absolute top-3 right-3 bg-[#01B273] text-white text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1">
            <span>✓</span> Terminé
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-[#1c1d1f] text-base leading-snug line-clamp-2 mb-1">
          {game.title}
        </h3>

        {/* Skill */}
        <p className="text-[#6a6f73] text-xs mb-3 flex items-center gap-1.5">
          <span>{game.skill.icon}</span>
          <span className="truncate">{game.skill.name}</span>
        </p>

        {/* Stars + difficulty */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="text-base"
                style={{ color: i <= stars ? "#f4c150" : "#d1d7dc" }}
              >
                ★
              </span>
            ))}
            {progress?.score != null && (
              <span className="text-xs text-[#6a6f73] font-semibold ml-1.5">{progress.score} pts</span>
            )}
          </div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ color: diff.color, backgroundColor: diff.bg }}
          >
            {diff.label}
          </span>
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6a6f73] font-medium">Progression</span>
              <span className="text-xs font-bold text-[#1c1d1f]">{pct}%</span>
            </div>
            <div className="bg-[#d1d7dc] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#01B273] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-[#9b9b9b] leading-relaxed flex-1 mb-4 line-clamp-2">
          {game.description}
        </p>

        {/* Action */}
        <button
          onClick={() => navigate(`/play/${game.id}`)}
          className="w-full py-2.5 rounded font-bold text-sm transition-all border-2"
          style={
            progress?.completed
              ? { background: "white", color: "#01B273", borderColor: "#01B273" }
              : { background: "#01B273", color: "white", borderColor: "#01B273" }
          }
          onMouseEnter={(e) => {
            if (progress?.completed) {
              (e.currentTarget as HTMLButtonElement).style.background = "#01B273";
              (e.currentTarget as HTMLButtonElement).style.color = "white";
            } else {
              (e.currentTarget as HTMLButtonElement).style.background = "#009060";
            }
          }}
          onMouseLeave={(e) => {
            if (progress?.completed) {
              (e.currentTarget as HTMLButtonElement).style.background = "white";
              (e.currentTarget as HTMLButtonElement).style.color = "#01B273";
            } else {
              (e.currentTarget as HTMLButtonElement).style.background = "#01B273";
            }
          }}
        >
          {progress?.completed ? "Rejouer" : progress ? "Continuer" : "Commencer"}
        </button>
      </div>
    </div>
  );
}
