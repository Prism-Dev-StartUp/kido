import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (!status) {
        setError("Impossible de contacter le serveur. Vérifiez que le backend est lancé (port 8001).");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#1c1d1f] px-14 py-16">
        <span className="font-fredoka text-3xl text-[#01B273]">kido</span>

        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-5">
            La plateforme qui fait<br />apprendre en jouant.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Des centaines d'activités Montessori adaptées à chaque cycle d'apprentissage, du bébé à l'élève de primaire.
          </p>

          <div className="space-y-4">
            {[
              { icon: "🎯", text: "3 cycles : Éveil, Maternelle, Primaire" },
              { icon: "📊", text: "Suivi de progression en temps réel" },
              { icon: "🎮", text: "Jeux interactifs et engageants" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-white/70 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">© 2026 Kido — Tous droits réservés</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 bg-[#f7f9fa]">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-10">
            <span className="font-fredoka text-3xl text-[#01B273]">kido</span>
          </div>

          <h1 className="text-[#1c1d1f] text-3xl font-bold mb-1">Connexion</h1>
          <p className="text-[#6a6f73] text-sm mb-8">Accède à l'espace parent Kido</p>

          <div className="bg-white rounded-lg border border-[#d1d7dc] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1c1d1f] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#d1d7dc] rounded px-3.5 py-3 text-sm font-medium text-[#1c1d1f] placeholder-[#9b9b9b] focus:outline-none focus:border-[#01B273] focus:ring-1 focus:ring-[#01B273] bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1c1d1f] mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#d1d7dc] rounded px-3.5 py-3 text-sm font-medium text-[#1c1d1f] placeholder-[#9b9b9b] focus:outline-none focus:border-[#01B273] focus:ring-1 focus:ring-[#01B273] bg-white transition"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#01B273] hover:bg-[#009060] text-white font-bold py-3 rounded text-sm transition disabled:opacity-60"
              >
                {loading ? "Connexion en cours…" : "Se connecter"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#6a6f73] mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-[#01B273] font-bold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
