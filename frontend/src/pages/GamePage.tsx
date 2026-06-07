import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game } from "../types";

const CYCLE_GRADIENT: Record<string, string> = {
  eveil:      "from-amber-400 via-orange-400 to-orange-500",
  maternelle: "from-[#01B273] via-teal-500 to-teal-700",
  primaire:   "from-blue-500 via-blue-700 to-[#021526]",
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

    let SceneClass: typeof Phaser.Scene;

    if (game.phaser_scene_key.startsWith("Grammar")) {
      const mod = await import("../games/primaire/GrammarClassifierScene");
      mod.setGrammarKey(game.phaser_scene_key);
      SceneClass = mod.default;
    } else {
      const sceneMap: Record<string, () => Promise<{ default: typeof Phaser.Scene }>> = {
        ColorSortScene:   () => import("../games/eveil/ColorSortScene"),
        ShapeMatchScene:  () => import("../games/maternelle/ShapeMatchScene"),
        LetterHuntScene:  () => import("../games/maternelle/LetterHuntScene"),
        NumberCountScene: () => import("../games/primaire/NumberCountScene"),
        AdditionScene:    () => import("../games/primaire/AdditionScene"),
        WorldFlagsScene:  () => import("../games/primaire/WorldFlagsScene"),
      };
      const loader = sceneMap[game.phaser_scene_key];
      if (!loader) return;
      const mod = await loader();
      SceneClass = mod.default;
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 500,
      backgroundColor: "#EFF9F5",
      scene: SceneClass,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });

    (gameRef.current as unknown as Record<string, unknown>).onComplete = async (score: number) => {
      gameRef.current?.destroy(true);
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      try {
        await gamesAPI.saveProgress(game.id, activeChild.id, {
          score, completed: true, time_spent_seconds: elapsed,
        });
      } catch { /* progression non bloquante */ }
      setFinalScore(score);
      setState("finished");
    };
  };

  if (!game) return null;

  const grad = CYCLE_GRADIENT[game.cycle] || "from-[#021526] to-[#01B273]";

  return (
    <div className="min-h-screen bg-[#021526] flex flex-col">
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
              {game.skill.name}
            </p>
            <button
              onClick={startGame}
              className={`bg-gradient-to-r ${grad} text-white font-extrabold px-14 py-5 rounded-2xl text-xl shadow-2xl hover:opacity-90 hover:scale-105 transition-all`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              C'est parti !
            </button>
          </div>
        )}

        {/* Game container — always mounted so containerRef is never null */}
        <div
          ref={containerRef}
          className={`w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 ${state === "playing" ? "" : "hidden"}`}
        />

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
                className="border-2 border-white/20 text-gray-300 hover:border-white/40 font-bold px-6 py-3 rounded-2xl transition"
              >
                Rejouer
              </button>
              <button
                onClick={() => navigate(-1)}
                className={`bg-gradient-to-r ${grad} text-white font-extrabold px-6 py-3 rounded-2xl hover:opacity-90 transition shadow-lg`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
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
