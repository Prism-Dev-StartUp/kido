import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChild } from "../contexts/ChildContext";

export default function Navbar() {
  const { logout } = useAuth();
  const { activeChild, setActiveChild } = useChild();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#1c1d1f] sticky top-0 z-50 h-14 flex items-center px-6 gap-6 border-b border-white/10">
      <button
        onClick={() => navigate("/dashboard")}
        className="font-fredoka text-2xl text-[#01B273] tracking-wide shrink-0 hover:opacity-80 transition"
      >
        kido
      </button>

      <div className="hidden md:flex items-center h-14 border-b-2 border-transparent">
        <span className="text-white/50 text-sm font-semibold">Apprendre en jouant</span>
      </div>

      <div className="flex-1" />

      {activeChild && (
        <button
          onClick={() => { setActiveChild(null); navigate("/dashboard"); }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded px-3 py-1.5 transition"
        >
          <span className="text-lg">{activeChild.avatar}</span>
          <span className="text-white text-sm font-semibold">{activeChild.name}</span>
          <span className="text-white/40 text-xs ml-1">✕</span>
        </button>
      )}

      <button
        onClick={logout}
        className="text-white/60 hover:text-white text-sm font-semibold transition border border-white/20 hover:border-white/40 rounded px-3 py-1.5"
      >
        Déconnexion
      </button>
    </nav>
  );
}
