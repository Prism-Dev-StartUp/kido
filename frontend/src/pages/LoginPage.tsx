import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
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
      nav("/accueil");
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (!e.response) setError("Impossible de contacter le serveur.");
      else setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-5xl mb-4">📖</p>
          <h1 className="text-3xl font-black text-ink">Kido</h1>
          <p className="text-muted mt-1 font-medium">Grammaire Montessori</p>
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <h2 className="text-lg font-bold text-ink">Connexion</h2>

          {error && (
            <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-ink">Email</label>
            <input type="email" className="input" placeholder="votre@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-ink">Mot de passe</label>
            <input type="password" className="input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <p className="text-center text-sm text-muted">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-ink font-bold hover:underline">Créer un compte</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
