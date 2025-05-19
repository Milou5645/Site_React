import React from 'react';
import { PieChart, CheckCircle2, AlertCircle, TrendingUp, Users } from 'lucide-react';

interface ResultsSectionProps {
  results: {
    yearlyStats: Record<string, number>;
    overallRate: number;
    totalCandidates: number;
    totalAccepted: number;
  };
  formData: {
    specialty1: string;
    specialty2: string;
    formation: string;
  };
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, formData }) => {
  const { yearlyStats, overallRate, totalCandidates, totalAccepted } = results;
  const { specialty1, specialty2, formation } = formData;

  // Function to get appropriate color class based on rate value
  const getRateColorClass = (rate: number) => {
    if (rate >= 70) return 'bg-green-100 text-green-800';
    if (rate >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Function to get recommendation text based on overall rate
  const getRecommendation = () => {
    if (overallRate >= 70) {
      return {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: "Très bonnes chances d'admission ! Cette combinaison est favorable pour votre formation visée."
      };
    } else if (overallRate >= 40) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-yellow-500" />,
        text: "Chances moyennes d'admission. Cette combinaison peut vous permettre d'être accepté avec un bon dossier."
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        text: "Chances faibles d'admission. Cette combinaison est peu favorable statistiquement. Envisagez d'autres spécialités ou renforcez votre dossier."
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="mt-12 animate-fadeIn">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <PieChart className="h-6 w-6 mr-2 text-blue-500" />
        Résultats d'analyse
      </h3>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            {specialty1 && specialty2 
              ? `Analyse pour ${specialty1} + ${specialty2} → ${formation}`
              : `Analyse pour ${formation}`
            }
          </h4>
          
          <div className="flex items-center mb-4">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <span className="text-gray-600">
              Basé sur <span className="font-semibold">{totalCandidates}</span> candidats, 
              dont <span className="font-semibold">{totalAccepted}</span> acceptés
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="relative w-32 h-32 mb-4 md:mb-0 md:mr-6">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#4F46E5 ${overallRate}%, transparent 0)`,
                    clipPath: 'circle(50% at center)'
                  }}
                ></div>
                <div className="z-10 bg-white w-24 h-24 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{overallRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className={`px-4 py-3 rounded-md ${getRateColorClass(overallRate)} mb-3`}>
                <div className="flex items-start">
                  {recommendation.icon}
                  <p className="ml-2 text-sm">{recommendation.text}</p>
                </div>
              </div>
              
              {Object.keys(yearlyStats).length > 1 && (
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Détail par année:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(yearlyStats).map(([year, rate]) => (
                      <div key={year} className="flex items-center">
                        <span className="text-gray-600 text-sm">{year}:</span>
                        <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">
            <em>Note: Ces statistiques sont basées sur les données historiques de Parcoursup et représentent uniquement des tendances. Votre dossier personnel, vos notes et votre lettre de motivation jouent également un rôle crucial dans la décision d'admission.</em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;