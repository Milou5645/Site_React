import { ParcoursupEntry } from '../data/parcoursupData';

export function calculateStatistics(
  data: ParcoursupEntry[],
  specialty1: string,
  specialty2: string,
  formation: string
) {
  // Filtrer les données par spécialités et formation
  const filteredData = data.filter(entry => {
    // Pour le mode "chances d'admission"
    if (specialty1 && specialty2) {
      // Vérifier les deux combinaisons possibles de spécialités
      const specialtiesMatch = 
        (entry.specialties === `${specialty1},${specialty2}` || 
         entry.specialties === `${specialty2},${specialty1}`);
      
      return specialtiesMatch && entry.formation.toLowerCase() === formation.toLowerCase();
    } 
    // Pour le mode "meilleurs choix" (seulement la formation est spécifiée)
    else {
      return entry.formation.toLowerCase() === formation.toLowerCase();
    }
  });

  // Traiter les statistiques par année
  const yearlyStats: Record<string, number> = {};
  let totalCandidates = 0;
  let totalAccepted = 0;

  filteredData.forEach(entry => {
    totalCandidates += entry.candidates;
    totalAccepted += entry.accepted;

    // Calculer le taux d'admission pour chaque année
    const rate = entry.candidates > 0 
      ? Math.round((entry.accepted / entry.candidates) * 100) 
      : 0;
    
    yearlyStats[entry.year] = rate;
  });

  // Calculer le taux global d'admission
  const overallRate = totalCandidates > 0 
    ? Math.round((totalAccepted / totalCandidates) * 100) 
    : 0;

  return {
    yearlyStats,
    overallRate,
    totalCandidates,
    totalAccepted
  };
}

export function findBestSpecialties(data: ParcoursupEntry[], formation: string) {
  // Filtrer les données par formation
  const filteredData = data.filter(entry => 
    entry.formation.toLowerCase() === formation.toLowerCase()
  );

  // Analyser chaque combinaison de spécialités
  const specialtyCombinations: Record<string, {
    candidates: number;
    accepted: number;
    rate: number;
  }> = {};

  filteredData.forEach(entry => {
    if (!specialtyCombinations[entry.specialties]) {
      specialtyCombinations[entry.specialties] = {
        candidates: 0,
        accepted: 0,
        rate: 0
      };
    }

    specialtyCombinations[entry.specialties].candidates += entry.candidates;
    specialtyCombinations[entry.specialties].accepted += entry.accepted;
  });

  // Calculer les taux d'admission pour chaque combinaison
  Object.keys(specialtyCombinations).forEach(combo => {
    const { candidates, accepted } = specialtyCombinations[combo];
    const rate = candidates > 0 ? (accepted / candidates) * 100 : 0;
    specialtyCombinations[combo].rate = Math.round(rate);
  });

  // Trier les combinaisons par taux d'admission (décroissant)
  const sortedCombinations = Object.entries(specialtyCombinations)
    .sort((a, b) => b[1].rate - a[1].rate)
    .filter(([_, stats]) => stats.candidates >= 10); // Filtrer pour avoir des données significatives

  return sortedCombinations.map(([combo, stats]) => ({
    specialties: combo,
    candidates: stats.candidates,
    accepted: stats.accepted,
    rate: stats.rate
  }));
}