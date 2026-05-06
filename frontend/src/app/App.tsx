import { useState } from 'react';
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CreateCollection from './components/CreateCollection';
import CollectionsList from './components/CollectionsList';
import Leaderboard from './components/Leaderboard';
import Chatbot from './components/Chatbot';

interface User {
  id: number;
  name: string;
  role: 'Citoyen' | 'Collecteur';
  email: string;
  points: number;
}

export default function App() {

  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // 🔥 LOGIN → prend les vrais points du backend
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
  };

  // 🔥 REFRESH USER FROM BACKEND
  const refreshUser = async () => {
    if (!user) return;

    const res = await fetch("http://localhost:8080/users");
    const users = await res.json();

    const updated = users.find((u: any) => u.id === user.id);

    if (updated) {
      setUser({
        id: updated.id,
        name: updated.nom,
        role: updated.role === "COLLECTOR" ? "Collecteur" : "Citoyen",
        email: updated.email,
        points: updated.pointsEcologiques || 0
      });
    }
  };

  const handleCreateCollection = () => {
    alert("Collecte créée !");
    setCurrentPage('collections');
  };

  const handleTakeCollection = async (id: number) => {
    alert(`Collecte #${id} prise en charge`);
    await refreshUser();
  };

  const handleCompleteCollection = async (id: number) => {
    alert(`Collecte #${id} terminée`);
    await refreshUser(); // 🔥 refresh points réel
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <Header user={user} onLogout={handleLogout} />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main>
        {currentPage === 'dashboard' && <Dashboard user={user} />}

        {currentPage === 'create' && (
          <CreateCollection
            userId={user.id}
            onCreateCollection={handleCreateCollection} // ✅ FIX
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsList
            userRole={user.role}
            onTakeCollection={handleTakeCollection}
            onCompleteCollection={handleCompleteCollection}
          />
        )}

        {currentPage === 'leaderboard' && <Leaderboard />}
        {currentPage === 'chatbot' && <Chatbot />}
      </main>
    </div>
  );
}