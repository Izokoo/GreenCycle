"use client";

import { useState } from 'react';

interface AuthPageProps {
  // 🔥 on ajoute id dans le user retourné
  onLogin: (user: { id: number; name: string; role: 'Citoyen' | 'Collecteur'; email: string }) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<'Citoyen' | 'Collecteur'>('Citoyen');

  // 🔐 LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          motDePasse: loginPassword
        })
      });

      if (!res.ok) {
        alert("Email ou mot de passe incorrect");
        return;
      }

      const user = await res.json();

      if (!user || !user.email) {
        alert("Erreur de connexion");
        return;
      }

      // 🔥 FIX CRITIQUE → on passe l'id
      onLogin({
        id: user.id, // ✅ AJOUT
        name: user.nom,
        role: user.role === "COLLECTOR" ? "Collecteur" : "Citoyen",
        email: user.email
      });

    } catch (err) {
      alert("Serveur inaccessible");
    }
  };

  // 📝 SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nom: signupName.trim(),
          prenom: signupName.trim(),
          email: signupEmail.trim(),
          motDePasse: signupPassword,
          role: signupRole === "Collecteur" ? "COLLECTOR" : "USER"
        })
      });

      if (!res.ok) {
        alert("Email déjà utilisé ou invalide");
        return;
      }

      // auto-fill login
      setLoginEmail(signupEmail);
      setLoginPassword(signupPassword);

      alert("Compte créé ! Tu peux maintenant te connecter.");

    } catch (err) {
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">

        {/* LOGIN */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl mb-2 text-gray-900">Connexion</h2>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full p-3 border rounded"
              required
            />

            <button className="w-full bg-green-500 text-white p-3 rounded">
              Se connecter
            </button>
          </form>
        </div>

        {/* SIGNUP */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl mb-2 text-gray-900">Inscription</h2>

          <form onSubmit={handleSignup} className="space-y-4">

            <input
              type="text"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              placeholder="Nom"
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border rounded"
              required
            />

            <input
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full p-3 border rounded"
              required
            />

            <select
              value={signupRole}
              onChange={(e) => setSignupRole(e.target.value as any)}
              className="w-full p-3 border rounded"
            >
              <option value="Citoyen">Citoyen</option>
              <option value="Collecteur">Collecteur</option>
            </select>

            <button className="w-full bg-green-500 text-white p-3 rounded">
              S'inscrire
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}