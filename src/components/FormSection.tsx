import React, { useState, useEffect } from 'react';
import { specialties, formations } from '../data/options';
import { SearchIcon, TrendingUp } from 'lucide-react';

interface FormSectionProps {
  mode: 'chances' | 'best';
  onSubmit: (data: {
    specialty1: string;
    specialty2: string;
    formation: string;
  }) => void;
  loading: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({ mode, onSubmit, loading }) => {
  const [specialty1, setSpecialty1] = useState('');
  const [specialty2, setSpecialty2] = useState('');
  const [formation, setFormation] = useState('');
  const [formError, setFormError] = useState('');

  // Reset form when mode changes
  useEffect(() => {
    setSpecialty1('');
    setSpecialty2('');
    setFormation('');
    setFormError('');
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (mode === 'chances') {
      if (!specialty1 || !specialty2 || !formation) {
        setFormError('Veuillez remplir tous les champs');
        return;
      }
      
      if (specialty1 === specialty2) {
        setFormError('Veuillez choisir deux spécialités différentes');
        return;
      }
    } else {
      if (!formation) {
        setFormError('Veuillez sélectionner une formation');
        return;
      }
    }
    
    setFormError('');
    onSubmit({ specialty1, specialty2, formation });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        {mode === 'chances' ? (
          <>
            <SearchIcon className="h-6 w-6 mr-2 text-blue-500" />
            Calculer vos chances d'admission
          </>
        ) : (
          <>
            <TrendingUp className="h-6 w-6 mr-2 text-blue-500" />
            Découvrir les meilleures spécialités
          </>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'chances' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="specialty1" className="block text-sm font-medium text-gray-700 mb-1">
                  Spécialité 1
                </label>
                <select
                  id="specialty1"
                  value={specialty1}
                  onChange={(e) => setSpecialty1(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="specialty2" className="block text-sm font-medium text-gray-700 mb-1">
                  Spécialité 2
                </label>
                <select
                  id="specialty2"
                  value={specialty2}
                  onChange={(e) => setSpecialty2(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-1">
            Formation visée
          </label>
          <select
            id="formation"
            value={formation}
            onChange={(e) => setFormation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            {Object.entries(formations).map(([group, options]) => (
              <optgroup key={group} label={group}>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {formError && (
          <div className="text-red-500 text-sm mt-2">{formError}</div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyse en cours...
              </>
            ) : (
              mode === 'chances' ? 'Calculer mes chances' : 'Découvrir les meilleurs choix'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormSection;