import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { WORD_TYPES, setPhaseProgress } from "../data/grammar";
import { useChild } from "../contexts/ChildContext";
import NomDiscovery from "../activities/NomDiscovery";

const PHASER_MAP: Record<string, () => Promise<{ default: typeof Phaser.Scene }>> = {
  NomSortScene:   () => import("../games/nom/NomSortScene"),
  NomMemoryScene: () => import("../games/nom/NomMemoryScene"),
  NomHuntScene:   () => import("../games/nom/NomHuntScene"),
  VerbAnimScene:  () => import("../games/verbe/VerbAnimScene"),
  PrepSpaceScene: () => import("../games/preposition/PrepSpaceScene"),
};

const REACT_MAP: Record<string, React.ComponentType<{ onComplete: (score: number) => void }>> = {
  NomDiscovery,
};

type State = "intro" | "playing" | "finished";

export default function ActivityPage() {
  const { mot, phase } = useParams<{ mot: string; phase: string }>();
  const { activeChild } = useChild();
  const nav = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [uiState, setUiState] = useState<State>("intro");
  const [finalScore, setFinalScore] = useState(0);
  const startTime = useRef(Date.now());

  const wt = WORD_TYPES.find(w => w.id === mot);
  const phaseConfig = wt?.phases.find(p => p.id === phase);

  useEffect(() => {
    return () => { gameRef.current?.destroy(true); };
  }, []);

  if (!wt || !phaseConfig) return null;

  const activityKey = phaseConfig.activityKey;
  const isReact = activityKey in REACT_MAP;
  const isPhaser = activityKey in PHASER_MAP;
  const isComingSoon = !isReact && !isPhaser;

  const markDone = (score: number) => {
    if (activeChild) setPhaseProgress(activeChild.id, wt.id, phaseConfig.id, "done");
    setFinalScore(score);
    setUiState("finished");
  };

  const startGame = async () => {
    if (isReact) { setUiState("playing"); return; }
    if (!isPhaser || !containerRef.current) return;

    setUiState("playing");
    startTime.current = Date.now();

    const mod = await PHASER_MAP[activityKey]();
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 500,
      backgroundColor: "#0f172a",
      scene: mod.default,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });

    (gameRef.current as unknown as Record<string, unknown>).onComplete = (score: number) => {
      gameRef.current?.destroy(true);
      markDone(score);
    };
  };

  const handleReplay = () => {
    gameRef.current?.destroy(true);
    gameRef.current = null;
    setUiState("intro");
  };

  const phaseIndex = wt.phases.findIndex(p => p.id === phase);
  const nextPhase = wt.phases[phaseIndex + 1];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Top bar */}
      <header
        className="flex items-center gap-4 px-5 h-14 border-b border-border bg-white"
      >
        <button
          onClick={() => { gameRef.current?.destroy(true); nav(`/nature/${wt.id}`); }}
          className="text-sm font-bold text-muted hover:text-ink transition"
        >
          ← {wt.label}
        </button>
        <div
          className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ backgroundColor: wt.colorBg, color: wt.color }}
        >
          {phaseConfig.label}
        </div>
        <div className="flex-1" />
        {activeChild && (
          <span className="text-sm font-bold text-muted">{activeChild.avatar} {activeChild.name}</span>
        )}
      </header>

      {/* Intro */}
      {uiState === "intro" && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: wt.colorBg }}
            >
              <span className="text-5xl">
                {phaseConfig.id === "decouverte" ? "🔍"
                  : phaseConfig.id === "guidee" ? "✏️"
                  : phaseConfig.id === "autonomie" ? "🎯"
                  : "📖"}
              </span>
            </div>

            <h2 className="text-2xl font-black text-ink mb-2">{phaseConfig.label}</h2>
            <p className="text-muted font-medium mb-10 leading-relaxed">{phaseConfig.description}</p>

            {isComingSoon ? (
              <div className="text-center">
                <p className="text-4xl mb-4">🚧</p>
                <p className="text-muted font-medium">Cette activité arrive bientôt.</p>
                <button onClick={() => nav(`/nature/${wt.id}`)} className="btn-outline mt-6">
                  Retour aux activités
                </button>
              </div>
            ) : (
              <button
                onClick={startGame}
                className="btn-primary px-10 py-4 text-lg"
                style={{ backgroundColor: wt.color }}
              >
                C'est parti !
              </button>
            )}
          </div>
        </div>
      )}

      {/* React activity */}
      {uiState === "playing" && isReact && (() => {
        const Component = REACT_MAP[activityKey];
        return (
          <div className="flex-1">
            <Component onComplete={markDone} />
          </div>
        );
      })()}

      {/* Phaser container — always mounted */}
      <div className="flex-1 flex items-center justify-center">
        <div
          ref={containerRef}
          className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-lg ${
            uiState === "playing" && isPhaser ? "" : "hidden"
          }`}
        />
      </div>

      {/* Results */}
      {uiState === "finished" && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-2xl font-black text-ink mb-1">
              Bravo {activeChild?.name} !
            </h2>
            <p className="text-muted font-medium mb-2">Tu as terminé cette activité.</p>
            {finalScore > 0 && (
              <p className="text-4xl font-black mb-8" style={{ color: wt.color }}>
                {finalScore} pts
              </p>
            )}

            <div className="flex flex-col gap-3">
              {nextPhase && (
                <button
                  onClick={() => nav(`/nature/${wt.id}/${nextPhase.id}`)}
                  className="btn-primary py-4"
                  style={{ backgroundColor: wt.color }}
                >
                  Activité suivante →
                </button>
              )}
              <button onClick={handleReplay} className="btn-outline py-3">
                Recommencer
              </button>
              <button onClick={() => nav(`/nature/${wt.id}`)} className="btn-ghost py-3">
                Retour à {wt.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
