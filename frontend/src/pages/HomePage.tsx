import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import GrammarSymbol from "../components/GrammarSymbol";
import { WORD_TYPES, getProgress, ProgressStatus } from "../data/grammar";
import { useChild } from "../contexts/ChildContext";

function ProgressDots({ phases, progress }: { phases: string[]; progress: Record<string, ProgressStatus> }) {
  return (
    <div className="flex gap-1.5 items-center">
      {phases.map(id => {
        const s = progress[id] ?? "not_started";
        return (
          <span key={id}
            className={s === "done" ? "dot-done" : s === "in_progress" ? "dot-progress" : "dot-empty"}
          />
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { activeChild } = useChild();
  const nav = useNavigate();
  const progress = activeChild ? getProgress(activeChild.id) : {};

  return (
    <Layout>
      <div className="content">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-ink mb-1">
            Bonjour {activeChild?.name} !
          </h1>
          <p className="text-muted font-medium">Que veux-tu explorer aujourd'hui ?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {WORD_TYPES.map(wt => {
            const wp = progress[wt.id] ?? {};
            const doneCount = wt.phases.filter(p => wp[p.id] === "done").length;

            return (
              <button
                key={wt.id}
                onClick={() => nav(`/nature/${wt.id}`)}
                className="card-hover flex flex-col items-center text-center gap-4 py-7 px-4"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: wt.colorBg }}
                >
                  <GrammarSymbol symbol={wt.symbol} color={wt.color} size={36} />
                </div>

                <div>
                  <p className="font-black text-ink text-sm leading-tight">{wt.labelShort}</p>
                  <p className="text-xs text-muted font-medium mt-0.5">{doneCount}/{wt.phases.length} phases</p>
                </div>

                <ProgressDots
                  phases={wt.phases.map(p => p.id)}
                  progress={wp}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-12 p-5 bg-white rounded-2xl border border-border">
          <p className="text-sm font-bold text-muted uppercase tracking-wide mb-1">Comment ça marche</p>
          <p className="text-ink font-medium leading-relaxed">
            Chaque nature de mot propose <strong>4 activités</strong> : découverte, entraînement, autonomie, et réinvestissement dans des phrases réelles. Avance à ton rythme, sans pression.
          </p>
        </div>
      </div>
    </Layout>
  );
}
