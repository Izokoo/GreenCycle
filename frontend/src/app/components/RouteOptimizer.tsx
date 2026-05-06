import { MapPin, Navigation, Clock } from 'lucide-react';

interface Collection {
  id: number;
  type: string;
  quantity: number;
  location: string;
  status: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';
  citizen: string;
  distance?: string;
  duration?: string;
}

interface RouteOptimizerProps {
  collections: Collection[];
  onClose: () => void;
}

export default function RouteOptimizer({ collections, onClose }: RouteOptimizerProps) {
  const availableCollections = collections.filter(c => c.status === 'EN_ATTENTE');

  const optimizedRoute = availableCollections.map((collection, index) => ({
    ...collection,
    order: index + 1,
    distance: `${(Math.random() * 5 + 1).toFixed(1)} km`,
    duration: `${Math.floor(Math.random() * 15 + 5)} min`
  }));

  const totalDistance = optimizedRoute.reduce((acc, c) => {
    return acc + parseFloat(c.distance || '0');
  }, 0);

  const totalDuration = optimizedRoute.reduce((acc, c) => {
    return acc + parseInt(c.duration || '0');
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2ecc71] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="w-8 h-8" />
              <div>
                <h2 className="text-2xl">Itinéraire optimisé</h2>
                <p className="text-sm text-green-100">Chemin le plus rapide pour vos collectes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex gap-6 justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Collectes</p>
              <p className="text-2xl text-gray-900">{optimizedRoute.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Distance totale</p>
              <p className="text-2xl text-[#2ecc71]">{totalDistance.toFixed(1)} km</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Temps estimé</p>
              <p className="text-2xl text-blue-500">{totalDuration} min</p>
            </div>
          </div>
        </div>

        {/* Route Steps */}
        <div className="overflow-y-auto max-h-[500px] p-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-300"></div>

            <div className="space-y-6">
              {optimizedRoute.map((collection, index) => (
                <div key={collection.id} className="relative pl-16">
                  {/* Step number */}
                  <div className="absolute left-0 w-12 h-12 bg-[#2ecc71] rounded-full flex items-center justify-center text-white z-10">
                    {collection.order}
                  </div>

                  {/* Collection card */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-[#2ecc71] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900 mb-1">{collection.type}</h4>
                        <p className="text-sm text-gray-600">{collection.quantity} kg</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                          <Navigation className="w-4 h-4" />
                          {collection.distance}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {collection.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-[#2ecc71] mt-0.5 flex-shrink-0" />
                      <span>{collection.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Citoyen: {collection.citizen}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-[#2ecc71] text-white py-3 rounded-lg hover:bg-[#27ae60] transition-colors"
          >
            Commencer l'itinéraire
          </button>
        </div>
      </div>
    </div>
  );
}
