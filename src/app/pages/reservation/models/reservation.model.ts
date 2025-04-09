export interface Reservation {
    id?: number;
    agenceDepart: string;
    agenceRetour: string;
    dateDepart: Date;
    dateRetour: Date;
    heureDepart: string;
    heureRetour: string;
    codePromo?: string;
    age: number;


    nbreJours?: number;
    prixMoyenParJourTTC?: number;
    prixMoyenParJourHT?: number;
    totalPrixHT?: number;
    totalPrixTTC?: number;
    
} 

export interface agence {
    name: string;
    code: string;
} 