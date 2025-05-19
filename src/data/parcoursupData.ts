export interface ParcoursupEntry {
  year: string;
  specialties: string;
  formation: string;
  candidates: number;
  accepted: number;
  enrolled: number;
}

// Ceci est un extrait des données, à adapter selon les besoins
const mockData: ParcoursupEntry[] = [
  {
    year: "2021",
    specialties: "Art,Art",
    formation: "Licence AES",
    candidates: 1,
    accepted: 1,
    enrolled: 0
  },
  {
    year: "2021",
    specialties: "Art,Art",
    formation: "Licence Arts",
    candidates: 1,
    accepted: 1,
    enrolled: 1
  },
  {
    year: "2021",
    specialties: "Art,HGGSP",
    formation: "Licence Histoire",
    candidates: 1315,
    accepted: 1093,
    enrolled: 428
  },
  {
    year: "2021",
    specialties: "Art,HLP",
    formation: "Licence Arts",
    candidates: 1928,
    accepted: 1516,
    enrolled: 720
  },
  {
    year: "2021",
    specialties: "Art,LLCER",
    formation: "BUT Service",
    candidates: 547,
    accepted: 111,
    enrolled: 51
  },
  {
    year: "2021",
    specialties: "Art,Maths",
    formation: "Licence Informatique",
    candidates: 78,
    accepted: 42,
    enrolled: 16
  },
  {
    year: "2021",
    specialties: "Maths,NSI",
    formation: "Licence Informatique",
    candidates: 1243,
    accepted: 987,
    enrolled: 534
  },
  {
    year: "2021",
    specialties: "Maths,Physique-Chimie",
    formation: "Licence Informatique",
    candidates: 876,
    accepted: 654,
    enrolled: 321
  },
  {
    year: "2021",
    specialties: "SES,HGGSP",
    formation: "Licence AES",
    candidates: 897,
    accepted: 743,
    enrolled: 412
  },
  {
    year: "2021",
    specialties: "SVT,Physique-Chimie",
    formation: "PASS",
    candidates: 1678,
    accepted: 978,
    enrolled: 823
  }
];

// Charger un plus grand ensemble de données depuis le CSV
// Normalement, cela serait fait via une API, mais pour cette démo
// nous utilisons les données mockées ci-dessus

export default mockData;