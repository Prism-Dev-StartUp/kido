import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gamesAPI } from "../services/api";
import { useChild } from "../contexts/ChildContext";
import { Game, Progress, Cycle } from "../types";
import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";

const CYCLE_META: Record<Cycle, { label: string; icon: string; color: string; bg: string; ages: string }> = {
  eveil:      { label: "Éveil",      icon: "🌱", color: "#f97316", bg: "#fff7ed", ages: "0 – 3 ans" },
  maternelle: { label: "Maternelle", icon: "🎈", color: "#01B273", bg: "#f0fdf9", ages: "3 – 6 ans" },
  primaire:   { label: "Primaire",   icon: "🚀", color: "#3b82f6", bg: "#eff6ff", ages: "6 – 12 ans" },
};

const DIFFICULTY_LABEL: Record<number, string> = { 1: "Facile", 2: "Moyen", 3: "Difficile" };

export default function CyclePage() {
  const { cycle } = useParams<{ cycle: Cycle }>();
  const { activeChild } = useChild();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, Progress>>({});
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [diffFilter, setDiffFilter] = useState<number[]>([]);

  useEffect(() => {
    if (!activeChild) { navigate("/dashboard"); return; }
    if (cycle) {
      gamesAPI.list(cycle).then((r) => setGames(r.data));
      gamesAPI.getProgress(activeChild.id).then((r) => {
        const map: Record<number, Progress> = {};
        r.data.forEach((p: Progress) => { map[p.game_id] = p; });
        setProgressMap(map);
      });
    }
  }, [cycle, activeChild]);

  if (!activeChild) return null;

  const meta = CYCLE_META[cycle!];
  const skills = Array.from(new Set(games.map((g) => g.skill.name)));
  const difficulties = Array.from(new Set(games.map((g) => g.difficulty))).sort();

  const filtered = games.filter((g) => {
    const skillOk = skillFilter.length === 0 || skillFilter.includes(g.skill.name);
    const diffOk  = diffFilter.length === 0  || diffFilter.includes(g.difficulty);
    return skillOk && diffOk;
  });

  const completed = games.filter((g) => progressMap[g.id]?.completed).length;

  const toggleSkill = (s: string) =>
    setSkillFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleDiff = (d: number) =>
    setDiffFilter((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  return (
    <div className="min-h-screen bg-[#f7f9fa]">
      <Navbar />

      {/* Page header */}
      <div className="bg-white border-b border-[#d1d7dc]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#6a6f73] mb-4">
            <button onClick={() => navigate("/dashboard")} className="hover:text-[#01B273] transition font-medium">
              Mes apprenants
            </button>
            <span>/</span>
            <span className="text-[#1c1d1f] font-semibold">{meta.label}</span>
          </nav>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl border-2"
                style={{ backgroundColor: meta.bg, borderColor: meta.color + "30" }}
              >
                {meta.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1c1d1f]">Cycle {meta.label}</h1>
                <p className="text-[#6a6f73] text-sm mt-0.5">{meta.ages} · {games.length} activité{games.length > 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Child + progress */}
            <div className="flex items-center gap-4 bg-[#f7f9fa] border border-[#d1d7dc] rounded-lg px-5 py-3">
              <span className="text-3xl">{activeChild.avatar}</span>
              <div>
                <p className="font-bold text-[#1c1d1f] text-sm">{activeChild.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-[#d1d7dc] rounded-full h-2 w-28 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: games.length ? `${(completed / games.length) * 100}%` : "0%",
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#6a6f73] font-semibold">{completed}/{games.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="bg-white border border-[#d1d7dc] rounded-lg overflow-hidden">
            {/* Skills filter */}
            {skills.length > 0 && (
              <div className="p-4 border-b border-[#d1d7dc]">
                <h3 className="font-bold text-[#1c1d1f] text-sm mb-3 uppercase tracking-wider">Compétences</h3>
                <div className="space-y-2">
                  {skills.map((s) => (
                    <label key={s} className="flex items-start gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={skillFilter.includes(s)}
                        onChange={() => toggleSkill(s)}
                        className="mt-0.5 accent-[#01B273]"
                      />
                      <span className="text-sm text-[#1c1d1f] group-hover:text-[#01B273] transition leading-tight">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty filter */}
            {difficulties.length > 0 && (
              <div className="p-4">
                <h3 className="font-bold text-[#1c1d1f] text-sm mb-3 uppercase tracking-wider">Difficulté</h3>
                <div className="space-y-2">
                  {difficulties.map((d) => (
                    <label key={d} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={diffFilter.includes(d)}
                        onChange={() => toggleDiff(d)}
                        className="accent-[#01B273]"
                      />
                      <span className="text-sm text-[#1c1d1f] group-hover:text-[#01B273] transition">
                        {DIFFICULTY_LABEL[d]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(skillFilter.length > 0 || diffFilter.length > 0) && (
            <button
              onClick={() => { setSkillFilter([]); setDiffFilter([]); }}
              className="mt-3 w-full text-xs font-bold text-[#6a6f73] hover:text-[#01B273] transition py-2"
            >
              Effacer les filtres
            </button>
          )}
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter pills */}
          {skills.length > 1 && (
            <div className="lg:hidden flex gap-2 mb-6 flex-wrap">
              {skills.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                    skillFilter.includes(s)
                      ? "bg-[#1c1d1f] text-white border-[#1c1d1f]"
                      : "bg-white text-[#6a6f73] border-[#d1d7dc] hover:border-[#1c1d1f]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Result count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#6a6f73] font-medium">
              <span className="font-bold text-[#1c1d1f]">{filtered.length}</span> activité{filtered.length > 1 ? "s" : ""}
              {(skillFilter.length > 0 || diffFilter.length > 0) && " (filtrées)"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-[#d1d7dc] rounded-lg py-20 text-center">
              <p className="text-5xl mb-4">🎮</p>
              <p className="font-bold text-[#1c1d1f] text-lg">Bientôt disponible !</p>
              <p className="text-[#6a6f73] text-sm mt-2">De nouvelles activités arrivent très vite.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} progress={progressMap[game.id]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
