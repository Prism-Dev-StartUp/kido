import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await authAPI.register(form);
      navigate("/login");
    } catch {
      setError("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-700 mb-2 text-center">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            placeholder="Nom complet"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition">
            S'inscrire
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ? <a href="/login" className="text-amber-600 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
