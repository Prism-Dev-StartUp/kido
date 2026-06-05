import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game } from "../types";

const CYCLE_BG: Record<string, string> = {
  eveil: "from-pink-500 to-rose-600",
  maternelle: "from-sky-500 to-blue-600",
  primaire: "from-emerald-500 to-green-600",
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro");
  const [finalScore, setFinalScore] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!gameId) return;
    gamesAPI.get(Number(gameId)).then((r) => setGame(r.data));
    return () => { gameRef.current?.destroy(true); };
  }, [gameId]);

  const startGame = async () => {
    if (!game || !containerRef.current || !activeChild) return;
    setGameState("playing");
    startTime.current = Date.now();

    const sceneMap: Record<string, () => Promise<{ default: typeof Phaser.Scene }>> = {
      ColorSortScene: () => import("../games/eveil/ColorSortScene"),
      ShapeMatchScene: () => import("../games/maternelle/ShapeMatchScene"),
      NumberCountScene: () => import("../games/primaire/NumberCountScene"),
    };

    const loader = sceneMap[game.phaser_scene_key];
    if (!loader) return;
    const { default: SceneClass } = await loader();

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 500,
      backgroundColor: "#fef9f0",
      scene: SceneClass,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });

    (gameRef.current as unknown as Record<string, unknown>).onComplete = async (score: number) => {
      gameRef.current?.destroy(true);
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      await gamesAPI.saveProgress(game.id, activeChild.id, {
        score, completed: true, time_spent_seconds: elapsed,
      });
      setFinalScore(score);
      setGameState("finished");
    };
  };

  if (!game) return null;

  const bg = CYCLE_BG[game.cycle] || "from-gray-500 to-gray-700";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className={`bg-gradient-to-r ${bg} px-6 py-4 flex items-center gap-4`}>
        <button
          onClick={() => { gameRef.current?.destroy(true); navigate(-1); }}
          className="text-white/80 hover:text-white transition font-medium text-sm"
        >
          ← Quitter
        </button>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{game.thumbnail}</span>
          <div>
            <p className="text-white font-bold">{game.title}</p>
            <p className="text-white/60 text-xs">{game.description}</p>
          </div>
        </div>
        {activeChild && (
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-lg">{activeChild.avatar}</span>
            <span className="text-white text-sm font-semibold">{activeChild.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">

        {/* Intro screen */}
        {gameState === "intro" && (
          <div className="text-center max-w-sm">
            <div className={`bg-gradient-to-br ${bg} rounded-3xl w-36 h-36 flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <span className="text-7xl">{game.thumbnail}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-2">{game.title}</h2>
            <p className="text-gray-400 mb-2">{game.description}</p>
            <p className="text-gray-500 text-sm mb-8">
              {game.skill.icon} {game.skill.name} · {"★".repeat(game.difficulty)}{"☆".repeat(3 - game.difficulty)}
            </p>
            <button
              onClick={startGame}
              className={`bg-gradient-to-r ${bg} text-white font-extrabold px-12 py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition hover:scale-105`}
            >
              C'est parti ! 🎮
            </button>
          </div>
        )}

        {/* Game canvas */}
        {gameState === "playing" && (
          <div ref={containerRef} className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl" />
        )}

        {/* Finished screen */}
        {gameState === "finished" && (
          <div className="text-center max-w-sm">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-3xl font-extrabold text-white mb-2">Bravo {activeChild?.name} !</h2>
            <p className="text-gray-400 mb-6">Tu as terminé l'activité</p>
            <div className={`bg-gradient-to-br ${bg} rounded-3xl px-10 py-6 mb-8 inline-block shadow-xl`}>
              <p className="text-white/70 text-sm mb-1">Score</p>
              <p className="text-5xl font-extrabold text-white">{finalScore}</p>
              <div className="flex justify-center gap-1 mt-3">
                {[1, 2, 3].map((i) => (
                  <span key={i} className={`text-2xl ${i <= Math.min(3, Math.ceil(finalScore / 34)) ? "text-yellow-300" : "text-white/30"}`}>★</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setGameState("intro"); }}
                className="border-2 border-gray-600 text-gray-300 hover:border-gray-400 font-bold px-6 py-3 rounded-2xl transition"
              >
                Rejouer
              </button>
              <button
                onClick={() => navigate(-1)}
                className={`bg-gradient-to-r ${bg} text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition`}
              >
                Autres jeux
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
