import { MapPin, User, Package, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';
import RouteOptimizer from './RouteOptimizer';
import { apiUrl } from '@/lib/api';

interface Collection {
  id: number;
  type: string;
  quantity: number;
  location: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';
  citizen: string;
  collector?: string;
}

interface CollectionsListProps {
  userRole: 'Citoyen' | 'Collecteur';
  onTakeCollection: (id: number) => void;
  onCompleteCollection: (id: number) => void;
}

export default function CollectionsList({ userRole, onTakeCollection, onCompleteCollection }: CollectionsListProps) {

  const [showRouteOptimizer, setShowRouteOptimizer] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  // 🔥 LOAD FROM BACKEND
  const loadCollectes = () => {
    fetch(apiUrl("/collectes"))
      .then(res => res.json())
      .then(data => {

        // 🔥 MAP BACKEND → FRONT (SANS CHANGER UI)
        const mapped = data.map((c: any) => ({
          id: c.id,
          type: c.typeDechet,
          quantity: c.quantite,
          location: c.localisation,
          status: c.statut,
          citizen: c.citoyen?.nom || "Inconnu",
          collector: c.collecteur?.nom
        }));

        setCollections(mapped);
      });
  };

  useEffect(() => {
    loadCollectes();
  }, []);

  // 🔥 PRENDRE
  const handleTake = (id: number) => {
    fetch(`${apiUrl(`/collectes/${id}/prendre`)}?collecteurId=1`, {
      method: "PUT"
    }).then(() => {
      loadCollectes();
      onTakeCollection(id);
    });
  };

  // 🔥 TERMINER
  const handleComplete = (id: number) => {
    fetch(apiUrl(`/collectes/${id}/terminer`), {
      method: "PUT"
    }).then(() => {
      loadCollectes();
      onCompleteCollection(id);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TERMINE':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'TERMINE': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-gray-900 mb-2">Liste des collectes</h2>
            <p className="text-gray-600">
              {userRole === 'Collecteur'
                ? 'Prenez en charge des collectes et gagnez des points'
                : 'Suivez vos collectes en cours'}
            </p>
          </div>

          {userRole === 'Collecteur' && collections.filter(c => c.status === 'EN_ATTENTE').length > 0 && (
            <button
              onClick={() => setShowRouteOptimizer(true)}
              className="flex items-center gap-2 bg-[#2ecc71] text-white px-6 py-3 rounded-lg"
            >
              <Navigation className="w-5 h-5" />
              Optimiser le trajet
            </button>
          )}
        </div>
      </div>

      {showRouteOptimizer && (
        <RouteOptimizer
          collections={collections}
          onClose={() => setShowRouteOptimizer(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2ecc71] bg-opacity-10 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#2ecc71]" />
                </div>
                <div>
                  <h3 className="text-gray-900">{collection.type}</h3>
                  <p className="text-sm text-gray-600">{collection.quantity} kg</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(collection.status)}`}>
                {getStatusLabel(collection.status)}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-sm text-gray-700">{collection.location}</p>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-700">Citoyen: {collection.citizen}</p>
            </div>

            {collection.collector && (
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-700">Collecteur: {collection.collector}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              {userRole === 'Collecteur' && collection.status === 'EN_ATTENTE' && (
                <button onClick={() => handleTake(collection.id)} className="w-full bg-[#2ecc71] text-white py-2 rounded-lg">
                  Prendre en charge
                </button>
              )}

              {userRole === 'Collecteur' && collection.status === 'EN_COURS' && (
                <button onClick={() => handleComplete(collection.id)} className="w-full bg-blue-500 text-white py-2 rounded-lg">
                  Terminer
                </button>
              )}

              {collection.status === 'TERMINE' && (
                <div className="text-center text-sm text-gray-500">
                  Collecte terminée
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}