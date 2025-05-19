import React, { useState } from 'react';
import FormSection from './components/FormSection';
import ResultsSection from './components/ResultsSection';
import BestSpecialtiesSection from './components/BestSpecialtiesSection';
import Header from './components/Header';
import Footer from './components/Footer';
import { calculateStatistics, findBestSpecialties } from './utils/dataProcessor';
import mockData from './data/parcoursupData';
import './index.css';

function App() {
  const [results, setResults] = useState<null | {
    yearlyStats: Record<string, number>;
    overallRate: number;
    totalCandidates: number;
    totalAccepted: number;
  }>(null);
  
  const [bestSpecialties, setBestSpecialties] = useState<Array<{
    specialties: string;
    candidates: number;
    accepted: number;
    rate: number;
  }> | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState<'chances' | 'best'>('chances');
  const [formData, setFormData] = useState({
    specialty1: '',
    specialty2: '',
    formation: ''
  });

  const handleSubmit = (data: typeof formData) => {
    setLoading(true);
    setFormData(data);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      if (formMode === 'chances') {
        const stats = calculateStatistics(mockData, data.specialty1, data.specialty2, data.formation);
        setResults(stats);
        setBestSpecialties(null);
      } else {
        const bestCombos = findBestSpecialties(mockData, data.formation);
        setBestSpecialties(bestCombos);
        setResults(null);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <Header setFormMode={setFormMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:shadow-xl">
            <div className="p-6 sm:p-10">
              <FormSection 
                mode={formMode} 
                onSubmit={handleSubmit} 
                loading={loading}
              />
              
              {results && !loading && formMode === 'chances' && (
                <ResultsSection 
                  results={results}
                  formData={formData}
                />
              )}
              
              {bestSpecialties && !loading && formMode === 'best' && (
                <BestSpecialtiesSection
                  bestSpecialties={bestSpecialties}
                  formation={formData.formation}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;