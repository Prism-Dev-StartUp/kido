import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game } from "../types";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (!gameId) return;
    gamesAPI.get(Number(gameId)).then((r) => setGame(r.data));
  }, [gameId]);

  useEffect(() => {
    if (!game || !containerRef.current || !activeChild) return;

    const loadScene = async () => {
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
        parent: containerRef.current!,
        width: 800,
        height: 600,
        backgroundColor: "#fef9f0",
        scene: SceneClass,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      });

      (gameRef.current as unknown as Record<string, unknown>).onComplete = async (score: number) => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        await gamesAPI.saveProgress(game.id, activeChild.id, {
          score,
          completed: true,
          time_spent_seconds: elapsed,
        });
        navigate(`/cycles/${activeChild.cycle}`);
      };
    };

    loadScene();

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [game, activeChild]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="mb-4 flex items-center gap-4 w-full max-w-3xl px-4">
        <button onClick={() => navigate(-1)} className="text-white hover:text-amber-300 text-xl">← Quitter</button>
        {game && <h2 className="text-white font-bold text-xl">{game.title}</h2>}
      </div>
      <div ref={containerRef} className="w-full max-w-3xl aspect-[4/3]" />
    </div>
  );
}
