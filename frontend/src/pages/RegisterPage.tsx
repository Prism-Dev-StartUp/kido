import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.register(form);
      navigate("/login");
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status;
      if (!status) {
        setError("Impossible de contacter le serveur. Vérifiez que le backend est lancé (port 8001).");
      } else if (status === 400 || status === 409) {
        setError("Cet email est déjà utilisé. Essaie avec un autre.");
      } else {
        setError(`Erreur serveur (${status}). Réessaie plus tard.`);
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
            Rejoins des milliers<br />de familles Kido.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Crée un espace pour chaque enfant, adapté à son cycle, et suis sa progression activité par activité.
          </p>

          <div className="space-y-4">
            {[
              { icon: "👨‍👩‍👧‍👦", text: "Plusieurs profils enfants par compte" },
              { icon: "🎓", text: "Contenu Montessori validé pédagogiquement" },
              { icon: "🔒", text: "Données privées et sécurisées" },
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

          <h1 className="text-[#1c1d1f] text-3xl font-bold mb-1">Créer un compte</h1>
          <p className="text-[#6a6f73] text-sm mb-8">Quelques secondes suffisent pour commencer</p>

          <div className="bg-white rounded-lg border border-[#d1d7dc] p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#1c1d1f] mb-1.5">Nom complet</label>
                <input
                  placeholder="Prénom et nom"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full border border-[#d1d7dc] rounded px-3.5 py-3 text-sm font-medium text-[#1c1d1f] placeholder-[#9b9b9b] focus:outline-none focus:border-[#01B273] focus:ring-1 focus:ring-[#01B273] bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1c1d1f] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[#d1d7dc] rounded px-3.5 py-3 text-sm font-medium text-[#1c1d1f] placeholder-[#9b9b9b] focus:outline-none focus:border-[#01B273] focus:ring-1 focus:ring-[#01B273] bg-white transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1c1d1f] mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                {loading ? "Création du compte…" : "Créer mon compte gratuitement"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#6a6f73] mt-6">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-[#01B273] font-bold hover:underline">
              Se connecter
            </Link>
          </p>

          <p className="text-center text-xs text-[#9b9b9b] mt-4 leading-relaxed">
            En créant un compte, vous acceptez les{" "}
            <span className="underline cursor-pointer">conditions d'utilisation</span>{" "}
            et la{" "}
            <span className="underline cursor-pointer">politique de confidentialité</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
