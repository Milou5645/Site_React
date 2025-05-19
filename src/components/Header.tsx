import React from 'react';
import { School } from 'lucide-react';

interface HeaderProps {
  setFormMode: (mode: 'chances' | 'best') => void;
}

const Header: React.FC<HeaderProps> = ({ setFormMode }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <School className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold">ParcoursAnalyzer</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-1 sm:space-x-4">
              <li>
                <button
                  onClick={() => setFormMode('chances')}
                  className="px-3 py-2 rounded-md transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Chances d'admission
                </button>
              </li>
              <li>
                <button
                  onClick={() => setFormMode('best')}
                  className="px-3 py-2 rounded-md transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Meilleurs choix
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <p className="mt-4 text-blue-100 max-w-2xl mx-auto text-center">
          Analysez vos chances d'admission sur Parcoursup selon vos spécialités ou découvrez les meilleures combinaisons pour votre formation idéale
        </p>
      </div>
    </header>
  );
};

export default Header;