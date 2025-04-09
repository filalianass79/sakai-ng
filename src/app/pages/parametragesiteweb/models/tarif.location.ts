import { Modele } from "../../modele/models/modele.model";
import { Saison } from "./saison";


export interface TarifLocation {
    id: number;
    modele: Modele;
    saison: Saison;
    typeTarif: 'JOURNALIER' | 'HEBDOMADAIRE' | 'MENSUEL';
    prix: number;
    dureeMinimale: number;
    dureeMaximale: number;
    conditionsSpeciales?: string;
  }