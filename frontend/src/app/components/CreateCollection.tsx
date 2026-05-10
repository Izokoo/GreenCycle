import { useState } from 'react';
import { MapPin, Package, Weight } from 'lucide-react';
import { apiUrl } from '@/lib/api';

interface CreateCollectionProps {
  userId: number; // 🔥 AJOUT
  onCreateCollection: () => void; // 🔥 AJOUT
}

export default function CreateCollection({ userId, onCreateCollection }: CreateCollectionProps) {

  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');

  const wasteTypes = ['Plastique', 'Verre', 'Papier', 'Métal', 'Organique', 'Électronique'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wasteType || !quantity || !location) return;

    try {
      const res = await fetch(`${apiUrl('/collectes')}?citoyenId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          typeDechet: wasteType,
          quantite: parseFloat(quantity),
          localisation: location
        })
      });

      if (!res.ok) {
        alert("Erreur création collecte");
        return;
      }

      alert("Collecte créée");

      // RESET
      setWasteType('');
      setQuantity('');
      setLocation('');

      // 🔥 RELOAD LISTE
      onCreateCollection();

    } catch {
      alert("Erreur serveur");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Créer une collecte</h2>
          <p className="text-gray-600">
            Signalez des déchets à recycler et gagnez des GreenPoints
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="flex items-center gap-2 text-gray-900 mb-3">
                <Package className="w-5 h-5 text-[#2ecc71]" />
                Type de déchet
              </label>
              <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" required>
                <option value="">Sélectionnez un type</option>
                {wasteTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-900 mb-3">
                <Weight className="w-5 h-5 text-[#2ecc71]" />
                Quantité (kg)
              </label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-900 mb-3">
                <MapPin className="w-5 h-5 text-[#2ecc71]" />
                Localisation
              </label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>

            <button type="submit" className="w-full bg-[#2ecc71] text-white py-4 rounded-lg">
              Créer la collecte
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}