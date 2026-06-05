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
    } catch {
      setError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 kido-gradient relative overflow-hidden">
        <div className="blob w-96 h-96 bg-yellow-300 -top-20 -left-20" />
        <div className="blob w-80 h-80 bg-pink-300 bottom-0 right-0" />
        <div className="relative z-10 text-center px-12">
          <div className="text-9xl mb-6 animate-bounce">🌟</div>
          <h1 className="font-fredoka text-white text-5xl mb-4">Kido</h1>
          <p className="text-white/80 text-xl font-nunito font-700 leading-relaxed">
            La plateforme Montessori<br />qui fait apprendre en jouant
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F3FF] p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-6xl">🌟</span>
            <h1 className="font-fredoka text-4xl kido-text mt-2">Kido</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-50">
            <h2 className="font-fredoka text-3xl text-gray-800 mb-1">Bonjour !</h2>
            <p className="text-gray-400 font-nunito text-sm mb-8">Connecte-toi à l'espace parent</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="kido-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="kido-input"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full kido-gradient text-white font-extrabold py-4 rounded-2xl text-base hover:opacity-90 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6 font-semibold">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-purple-600 hover:text-purple-700 font-bold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
