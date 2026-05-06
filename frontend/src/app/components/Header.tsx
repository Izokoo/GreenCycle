import { Leaf, LogOut } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    role: 'Citoyen' | 'Collecteur';
    points: number;
  };
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2ecc71] rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl text-gray-900">GreenCycle</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-600">{user.role}</p>
            </div>

            <div className="bg-[#2ecc71] text-white px-4 py-2 rounded-lg">
              <p className="text-sm">GreenPoints</p>
              <p className="text-xl">{user.points}</p>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
