import { Recycle, Users, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardProps {
  user: {
    name: string;
    role: 'Citoyen' | 'Collecteur';
    email: string; // 🔥 important pour trouver user réel
  };
}

export default function Dashboard({ user }: DashboardProps) {

  // 🔥 STATE (remplace les fake values)
  const [collectesCount, setCollectesCount] = useState('0');
  const [usersCount, setUsersCount] = useState('0');
  const [kgTotal, setKgTotal] = useState('0');
  const [rank, setRank] = useState('#-');

  // 🔥 LOAD BACKEND
  useEffect(() => {

    // USERS + RANK
    fetch("http://localhost:8080/users")
      .then(res => res.json())
      .then(users => {

        setUsersCount(users.length.toString());

        // trouver user actuel
        const current = users.find((u: any) => u.email === user.email);

        // classement
        const sorted = [...users].sort(
          (a, b) => (b.pointsEcologiques || 0) - (a.pointsEcologiques || 0)
        );

        const index = sorted.findIndex((u: any) => u.email === user.email);

        if (index !== -1) {
          setRank(`#${index + 1}`);
        }
      });

    // COLLECTES
    fetch("http://localhost:8080/collectes")
      .then(res => res.json())
      .then(data => {

        setCollectesCount(data.length.toString());

        let kg = 0;

        data.forEach((c: any) => {
          if (c.statut === "TERMINE") {
            kg += c.quantite;
          }
        });

        setKgTotal(kg.toString());
      });

  }, []);

  // 🔥 SAME UI, JUST VALUES CHANGED
  const stats = [
    {
      icon: Recycle,
      label: 'Collectes effectuées',
      value: collectesCount, // 🔥 dynamique
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      label: 'Communauté active',
      value: usersCount, // 🔥 dynamique
      color: 'bg-purple-500'
    },
    {
      icon: TrendingUp,
      label: 'Kg recyclés ce mois',
      value: kgTotal, // 🔥 dynamique
      color: 'bg-orange-500'
    },
    {
      icon: Award,
      label: 'Votre classement',
      value: rank, // 🔥 dynamique
      color: 'bg-[#2ecc71]'
    }
  ];

  const recentActivity = [
    { user: 'Marie Laurent', action: 'a créé une collecte', type: 'Plastique', location: 'Plateau Mont-Royal', time: 'Il y a 5 min' },
    { user: 'Thomas Petit', action: 'a terminé une collecte', type: 'Verre', location: 'Mile-End', time: 'Il y a 12 min' },
    { user: 'Sophie Martin', action: 'a pris en charge', type: 'Papier', location: 'Rosemont', time: 'Il y a 23 min' },
    { user: 'Lucas Bernard', action: 'a créé une collecte', type: 'Métal', location: 'Villeray', time: 'Il y a 1h' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 mb-2">
          Bienvenue, {user.name} !
        </h2>
        <p className="text-gray-600">
          Voici un aperçu de votre activité sur GreenCycle
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity (unchanged) */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-gray-600">
                  Type: {activity.type} • {activity.location}
                </p>
              </div>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}