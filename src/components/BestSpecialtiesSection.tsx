import React from 'react';
import { Award, TrendingUp, ChevronRight } from 'lucide-react';

interface BestSpecialty {
  specialties: string;
  candidates: number;
  accepted: number;
  rate: number;
}

interface BestSpecialtiesSectionProps {
  bestSpecialties: BestSpecialty[];
  formation: string;
}

const BestSpecialtiesSection: React.FC<BestSpecialtiesSectionProps> = ({ 
  bestSpecialties,
  formation
}) => {
  if (!bestSpecialties.length) {
    return (
      <div className="mt-8 p-6 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-center text-orange-700 mb-2">
          <Award className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-medium">Pas assez de données</h3>
        </div>
        <p className="text-orange-600">
          Nous n'avons pas suffisamment de données pour cette formation. Essayez une autre formation plus courante.
        </p>
      </div>
    );
  }

  // Get top 3 combinations
  const topCombinations = bestSpecialties.slice(0, 5);

  return (
    <div className="mt-8 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Award className="h-6 w-6 mr-2 text-blue-500" />
        Meilleures spécialités pour {formation}
      </h3>

      <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-5 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-medium text-blue-800">Spécialités recommandées</h4>
              <p className="text-sm text-blue-600">
                Voici les combinaisons de spécialités avec les meilleurs taux d'admission historiques.
              </p>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-gray-200">
          {topCombinations.map((combo, index) => {
            // Separate the specialties for display
            const [spec1, spec2] = combo.specialties.split(',');
            
            // Determine background color based on position
            let bgClass = '';
            if (index === 0) bgClass = 'bg-yellow-50';
            else if (index === 1) bgClass = 'bg-blue-50';
            else if (index === 2) bgClass = 'bg-green-50';
            
            return (
              <li key={combo.specialties} className={`p-4 ${bgClass} hover:bg-gray-100 transition-colors`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    {index < 3 && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-yellow-200 text-yellow-800' :
                        index === 1 ? 'bg-blue-200 text-blue-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {index + 1}
                      </div>
                    )}
                    
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        {spec1} <ChevronRight className="h-4 w-4 mx-1 text-gray-400" /> {spec2}
                      </div>
                      <div className="text-sm text-gray-500">
                        {combo.accepted} admis sur {combo.candidates} candidats
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">{combo.rate}%</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <p className="text-sm text-gray-600 italic">
            Ces statistiques sont basées sur les données des années précédentes. Les taux d'admission peuvent varier selon les années et les établissements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BestSpecialtiesSection;