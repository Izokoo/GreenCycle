"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Award } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface LeaderboardUser {
  rank: number;
  name: string;
  role: 'Citoyen' | 'Collecteur';
  points: number;
}

export default function Leaderboard() {

  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetch(apiUrl("/users/leaderboard"))
      .then(res => res.json())
      .then(data => {

        const formatted = data.map((u: any, index: number) => ({
          rank: index + 1,
          name: u.nom,
          role: u.role === "COLLECTOR" ? "Collecteur" : "Citoyen",
          points: u.pointsEcologiques || 0
        }));

        setUsers(formatted);
      })
      .catch(() => console.log("Erreur leaderboard"));

  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        2: 'bg-gray-100 text-gray-800 border-gray-300',
        3: 'bg-orange-100 text-orange-800 border-orange-300'
      };
      return colors[rank as keyof typeof colors];
    }
    return 'bg-white text-gray-700 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 mb-2">Classement</h2>
        <p className="text-gray-600">
          Les meilleurs contributeurs de GreenCycle
        </p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {users.slice(0, 3).map((user) => (
          <div
            key={user.rank}
            className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
              user.rank === 1 ? 'border-yellow-300 ring-4 ring-yellow-100' : 'border-gray-200'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2ecc71] to-[#27ae60] rounded-full flex items-center justify-center mb-4">
                {getRankIcon(user.rank)}
              </div>
              <div className={`px-4 py-1 rounded-full text-sm border mb-3 ${getRankBadge(user.rank)}`}>
                #{user.rank}
              </div>
              <h3 className="text-xl text-gray-900 mb-1">{user.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{user.role}</p>
              <div className="bg-[#2ecc71] text-white px-6 py-2 rounded-lg">
                <p className="text-2xl">{user.points}</p>
                <p className="text-xs">GreenPoints</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-700">Position</th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">Nom</th>
                <th className="px-6 py-4 text-left text-sm text-gray-700">Rôle</th>
                <th className="px-6 py-4 text-right text-sm text-gray-700">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.slice(3).map((user) => (
                <tr key={user.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700">
                      #{user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.role === 'Collecteur'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-gray-900">
                    {user.points} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




