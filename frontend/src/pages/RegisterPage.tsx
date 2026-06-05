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
    } catch {
      setError("Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f472b6, #ec4899, #a855f7)" }}>
        <div className="blob w-96 h-96 bg-orange-300 -top-20 -right-20" />
        <div className="blob w-80 h-80 bg-yellow-300 bottom-10 left-0" />
        <div className="relative z-10 text-center px-12">
          <div className="text-9xl mb-6">👨‍👩‍👧‍👦</div>
          <h2 className="font-fredoka text-white text-4xl mb-4">Rejoins Kido !</h2>
          <p className="text-white/80 text-lg font-semibold leading-relaxed">
            Crée ton espace parent et<br />accompagne tes enfants dans<br />leur aventure d'apprentissage.
          </p>
          <div className="flex justify-center gap-3 mt-8 text-4xl">
            <span>🦁</span><span>🦊</span><span>🐼</span><span>🦄</span><span>🐬</span>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F3FF] p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <span className="text-6xl">🌟</span>
            <h1 className="font-fredoka text-4xl kido-text mt-2">Kido</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-50">
            <h2 className="font-fredoka text-3xl text-gray-800 mb-1">Créer un compte</h2>
            <p className="text-gray-400 text-sm font-semibold mb-8">Quelques secondes suffisent ✨</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Nom complet</label>
                <input
                  placeholder="Ton prénom et nom"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="kido-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="kido-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="kido-input"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold px-4 py-3 rounded-2xl">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-extrabold py-4 rounded-2xl text-base hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-50 shadow-lg shadow-pink-200"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}
              >
                {loading ? "Création..." : "Créer mon compte 🎉"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6 font-semibold">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
