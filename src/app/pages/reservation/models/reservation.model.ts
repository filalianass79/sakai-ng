import { Modele } from "../../modele/models/modele.model";
export interface Reservation {
    id?: number;
    numeroReservation?: string;
    agenceDepart?: string;
    agenceRetour?: string;
    dateDepart?: Date;
    dateRetour?: Date;
    heureDepart?: string;
    heureRetour?: string;
    codePromo?: string;
    age: number;

    modele?: Modele;
    
    nbreJours?: number;
    prixMoyenParJourTTC?: number;
    prixMoyenParJourHT?: number;
    totalPrixHT?: number;
    totalPrixTTC?: number;

    //coordonnées
    nom?: string;
    prenom?: string;
    email?: string;
    tel?: string;
    indicatif?: string;
    telephone?: string;
    dateNaissance?: Date;
    civilite?: string;
    compagnie?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    pays?: string;

    //options
    options?: Option[];

    //paiement
    paiement?: paiement;

    //statut
    statut?: string;
    //date de création
    dateCreation?: Date;
    //date de modification
    dateModification?: Date;
    //date de suppression
    dateSuppression?: Date;
    //date de réservation
    dateReservation?: Date;
    //date de paiement
    datePaiement?: Date;
    //date de confirmation
    dateConfirmation?: Date;
    
    
} 

export interface agence {
    name: string;
    code: string;
} 

export interface Option {
    id: number;
    title: string;
    price: number;
    image: string;
    description?: string;
    details?: string;
    autre?: string;
    canBeLot?: boolean;
    max: number;
    nbre: number;
  }

  export interface paiement {
    id?: number;
    datePaiement?: Date;
    montant?: number;
    modePaiement?: string;
    statut?: string;
  }
