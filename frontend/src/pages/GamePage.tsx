import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game } from "../types";

const CYCLE_GRADIENT: Record<string, string> = {
  eveil:      "from-pink-400 via-rose-400 to-fuchsia-500",
  maternelle: "from-violet-400 via-purple-500 to-indigo-500",
  primaire:   "from-cyan-400 via-sky-500 to-blue-500",
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [state, setState] = useState<"intro" | "playing" | "finished">("intro");
  const [finalScore, setFinalScore] = useState(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!gameId) return;
    gamesAPI.get(Number(gameId)).then((r) => setGame(r.data));
    return () => { gameRef.current?.destroy(true); };
  }, [gameId]);

  const startGame = async () => {
    if (!game || !containerRef.current || !activeChild) return;
    setState("playing");
    startTime.current = Date.now();

    const sceneMap: Record<string, () => Promise<{ default: typeof Phaser.Scene }>> = {
      ColorSortScene:  () => import("../games/eveil/ColorSortScene"),
      ShapeMatchScene: () => import("../games/maternelle/ShapeMatchScene"),
      NumberCountScene:() => import("../games/primaire/NumberCountScene"),
    };
    const loader = sceneMap[game.phaser_scene_key];
    if (!loader) return;
    const { default: SceneClass } = await loader();

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 500,
      backgroundColor: "#faf5ff",
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
      setState("finished");
    };
  };

  if (!game) return null;

  const grad = CYCLE_GRADIENT[game.cycle] || "from-violet-400 to-purple-600";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className={`bg-gradient-to-r ${grad} px-6 py-3 flex items-center gap-4`}>
        <button
          onClick={() => { gameRef.current?.destroy(true); navigate(-1); }}
          className="text-white/70 hover:text-white font-bold text-sm transition"
        >
          ← Quitter
        </button>
        <span className="text-2xl">{game.thumbnail}</span>
        <span className="font-fredoka text-white text-xl flex-1">{game.title}</span>
        {activeChild && (
          <div className="flex items-center gap-2 bg-white/20 rounded-2xl px-3 py-1.5">
            <span className="text-xl">{activeChild.avatar}</span>
            <span className="text-white text-sm font-bold">{activeChild.name}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        {/* Intro */}
        {state === "intro" && (
          <div className="text-center max-w-sm">
            <div className={`bg-gradient-to-br ${grad} rounded-[32px] w-40 h-40 flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
              <span className="text-8xl drop-shadow-lg">{game.thumbnail}</span>
            </div>
            <h2 className="font-fredoka text-4xl text-white mb-2">{game.title}</h2>
            <p className="text-gray-400 font-semibold mb-1">{game.description}</p>
            <p className="text-gray-500 text-sm mb-10">
              {game.skill.icon} {game.skill.name} &nbsp;·&nbsp;
              {"⭐".repeat(game.difficulty)}{"☆".repeat(3 - game.difficulty)}
            </p>
            <button
              onClick={startGame}
              className={`bg-gradient-to-r ${grad} text-white font-extrabold px-14 py-5 rounded-2xl text-xl shadow-2xl hover:opacity-90 hover:scale-105 transition-all`}
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              C'est parti ! 🎮
            </button>
          </div>
        )}

        {/* Game */}
        {state === "playing" && (
          <div
            ref={containerRef}
            className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10"
          />
        )}

        {/* Results */}
        {state === "finished" && (
          <div className="text-center max-w-sm">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="font-fredoka text-4xl text-white mb-1">
              Bravo {activeChild?.name} !
            </h2>
            <p className="text-gray-400 font-semibold mb-8">Tu as terminé l'activité !</p>

            <div className={`bg-gradient-to-br ${grad} rounded-3xl px-10 py-7 mb-8 inline-block shadow-2xl`}>
              <p className="text-white/70 font-bold text-sm mb-1">SCORE FINAL</p>
              <p className="font-fredoka text-6xl text-white">{finalScore}</p>
              <div className="flex justify-center gap-2 mt-3">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`text-3xl transition-all ${i <= Math.min(3, Math.ceil(finalScore / 34)) ? "text-yellow-300" : "text-white/20"}`}
                  >★</span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setState("intro")}
                className="border-2 border-gray-700 text-gray-300 hover:border-gray-500 font-bold px-6 py-3 rounded-2xl transition"
              >
                🔄 Rejouer
              </button>
              <button
                onClick={() => navigate(-1)}
                className={`bg-gradient-to-r ${grad} text-white font-extrabold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg`}
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Autres jeux →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
