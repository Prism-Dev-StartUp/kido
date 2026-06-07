import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import GrammarSymbol from "../components/GrammarSymbol";
import { WORD_TYPES, getProgress, ProgressStatus } from "../data/grammar";
import { useChild } from "../contexts/ChildContext";

const PHASE_NUMS: Record<string, number> = {
  decouverte: 1, guidee: 2, autonomie: 3, reinvest: 4,
};

const STATUS_LABEL: Record<ProgressStatus, string> = {
  done:        "Maîtrisé",
  in_progress: "En cours",
  not_started: "À découvrir",
};

const STATUS_STYLE: Record<ProgressStatus, string> = {
  done:        "bg-green-50 text-green-800 border-green-200",
  in_progress: "bg-amber-50 text-amber-800 border-amber-200",
  not_started: "bg-paper text-muted border-border",
};

export default function NaturePage() {
  const { mot } = useParams<{ mot: string }>();
  const nav = useNavigate();
  const { activeChild } = useChild();

  const wt = WORD_TYPES.find(w => w.id === mot);
  if (!wt) return null;

  const progress = activeChild ? getProgress(activeChild.id) : {};
  const wp = progress[wt.id] ?? {};

  return (
    <Layout back="/jouer" backLabel="Toutes les notions">
      <div className="content max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: wt.colorBg }}
          >
            <GrammarSymbol symbol={wt.symbol} color={wt.color} size={38} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-ink">{wt.label}</h1>
            <p className="text-muted font-medium mt-0.5">{wt.definition}</p>
          </div>
        </div>

        {/* Example */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-8"
          style={{ backgroundColor: wt.colorBg, color: wt.color }}
        >
          Exemples : {wt.example}
        </div>

        {/* Phases */}
        <h2 className="text-sm font-bold text-muted uppercase tracking-wide mb-4">
          Activités — dans l'ordre
        </h2>

        <div className="flex flex-col gap-3">
          {wt.phases.map((phase, i) => {
            const status: ProgressStatus = wp[phase.id] ?? "not_started";
            const prevDone = i === 0 || wp[wt.phases[i - 1].id] === "done";
            const locked = !prevDone && status === "not_started";

            return (
              <button
                key={phase.id}
                onClick={() => !locked && nav(`/nature/${wt.id}/${phase.id}`)}
                disabled={locked}
                className={`w-full text-left flex items-center gap-5 p-5 rounded-2xl border-2 transition-all ${
                  locked
                    ? "bg-white border-border opacity-50 cursor-not-allowed"
                    : status === "done"
                    ? "bg-white border-green-200 hover:shadow-md cursor-pointer"
                    : "bg-white border-border hover:border-ink hover:shadow-md cursor-pointer"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    backgroundColor: status === "done" ? wt.color : wt.colorBg,
                    color: status === "done" ? "white" : wt.color,
                  }}
                >
                  {status === "done" ? "✓" : PHASE_NUMS[phase.id]}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-black text-ink">{phase.label}</p>
                  <p className="text-sm text-muted font-medium truncate">{phase.description}</p>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[status]}`}>
                  {STATUS_LABEL[status]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Montessori note */}
        <p className="text-xs text-muted font-medium text-center mt-8 leading-relaxed">
          Les activités sont conçues pour être faites dans l'ordre, du concret vers l'abstrait.
          <br />Tu peux revenir sur une activité autant de fois que tu le souhaites.
        </p>
      </div>
    </Layout>
  );
}
