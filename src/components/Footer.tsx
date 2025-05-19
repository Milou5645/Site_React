import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} ParcoursAnalyzer - Tous droits réservés
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-center text-gray-400">
          <p>Les données utilisées proviennent de Parcoursup et sont traitées à des fins informatives uniquement.</p>
          <p>Cet outil n'est pas affilié au Ministère de l'Éducation Nationale.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;