import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import GrammarSymbol from "../components/GrammarSymbol";
import { WORD_TYPES, getProgress, ProgressStatus } from "../data/grammar";
import { useChild } from "../contexts/ChildContext";

const DOT: Record<ProgressStatus, string> = {
  done:        "●",
  in_progress: "◐",
  not_started: "○",
};

const DOT_STYLE: Record<ProgressStatus, string> = {
  done:        "text-ink",
  in_progress: "text-ink/40",
  not_started: "text-muted/30",
};

const PHASE_LABELS: Record<string, string> = {
  decouverte: "Découverte",
  guidee:     "Entraîn.",
  autonomie:  "Autonomie",
  reinvest:   "Phrases",
};

export default function ProgressPage() {
  const { activeChild } = useChild();
  const nav = useNavigate();
  const progress = activeChild ? getProgress(activeChild.id) : {};

  const totalPhases = WORD_TYPES.length * 4;
  const donePhases = WORD_TYPES.reduce((acc, wt) => {
    const wp = progress[wt.id] ?? {};
    return acc + wt.phases.filter(p => wp[p.id] === "done").length;
  }, 0);

  return (
    <Layout>
      <div className="content max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-ink mb-1">Ma progression</h1>
          {activeChild && (
            <p className="text-muted font-medium">{activeChild.avatar} {activeChild.name}</p>
          )}
        </div>

        {/* Global progress bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-ink">Avancement global</p>
            <p className="text-sm font-bold text-muted">{donePhases} / {totalPhases} phases</p>
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-ink rounded-full transition-all duration-700"
              style={{ width: `${(donePhases / totalPhases) * 100}%` }}
            />
          </div>
        </div>

        {/* Detail table */}
        <div className="card overflow-hidden p-0">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_repeat(4,_auto)] gap-0 border-b border-border px-5 py-3 bg-paper">
            <p className="text-xs font-bold text-muted uppercase tracking-wide">Nature du mot</p>
            {["decouverte","guidee","autonomie","reinvest"].map(id => (
              <p key={id} className="text-xs font-bold text-muted uppercase tracking-wide text-center w-20">
                {PHASE_LABELS[id]}
              </p>
            ))}
          </div>

          {/* Rows */}
          {WORD_TYPES.map((wt, i) => {
            const wp = progress[wt.id] ?? {};
            return (
              <button
                key={wt.id}
                onClick={() => nav(`/nature/${wt.id}`)}
                className={`w-full grid grid-cols-[1fr_repeat(4,_auto)] gap-0 px-5 py-4 text-left hover:bg-paper transition ${
                  i < WORD_TYPES.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <GrammarSymbol symbol={wt.symbol} color={wt.color} size={22} />
                  <span className="font-bold text-sm text-ink">{wt.label}</span>
                </div>

                {wt.phases.map(ph => {
                  const status: ProgressStatus = wp[ph.id] ?? "not_started";
                  return (
                    <div key={ph.id} className="flex items-center justify-center w-20">
                      <span className={`text-lg font-black ${DOT_STYLE[status]}`}>
                        {DOT[status]}
                      </span>
                    </div>
                  );
                })}
              </button>
            );
          })}
        </div>

        <div className="flex gap-6 mt-6 text-sm text-muted font-medium justify-center">
          <span className="flex items-center gap-2"><span className="text-ink font-black">●</span> Maîtrisé</span>
          <span className="flex items-center gap-2"><span className="text-ink/40 font-black">◐</span> En cours</span>
          <span className="flex items-center gap-2"><span className="text-muted/30 font-black">○</span> À découvrir</span>
        </div>
      </div>
    </Layout>
  );
}
