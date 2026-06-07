import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChild } from "../contexts/ChildContext";

interface Props {
  children: React.ReactNode;
  back?: string;
  backLabel?: string;
}

export default function Layout({ children, back, backLabel = "Retour" }: Props) {
  const { logout } = useAuth();
  const { activeChild, setActiveChild } = useChild();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav("/login"); };
  const handleChangeChild = () => { setActiveChild(null); nav("/accueil"); };

  return (
    <div className="page">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center gap-4">
          {back ? (
            <button onClick={() => nav(back)} className="btn-ghost px-2 py-1 text-sm">
              ← {backLabel}
            </button>
          ) : (
            <button onClick={() => nav("/jouer")} className="font-black text-xl text-ink tracking-tight">
              Kido
            </button>
          )}

          <div className="flex-1" />

          {activeChild && (
            <button
              onClick={handleChangeChild}
              className="flex items-center gap-2 text-sm font-bold text-muted hover:text-ink transition px-2"
            >
              <span className="text-xl">{activeChild.avatar}</span>
              <span>{activeChild.name}</span>
            </button>
          )}

          <button onClick={() => nav("/progression")} className="btn-ghost px-3 py-1 text-sm">
            Ma progression
          </button>

          <button onClick={handleLogout} className="btn-ghost px-3 py-1 text-sm">
            Quitter
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
