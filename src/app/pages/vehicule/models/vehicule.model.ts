export interface Vehicule {
  id?: number;
  ww: string;
  immatriculation: string;
  chassis: string;
  puissanceFiscal: number;
  puissance: number;
  couleur: string;
  nombrePlace: number;
  kilometrageInitial: number;
  tansmission: string;
  carburant: string;
  provisoire: boolean;
  dateExpirationCarteGrise?: Date;
  dateAcquisition?: Date;
  financement?: string;
  dateMiseEnCirculation?: Date;
  
  // Relations
  modeleId: number;
  modeleNom?: string;
  marqueNom?: string;
  categorieNom?: string;
  
  // Autres informations
  observations?: string;
  vendu: boolean;
  etatActuel?: string;
  kilometrageVidange?: number;
  dateVidange?: Date;
  kilometragePneu1?: number;
  kilometrageChaine?: number;
  dateProchaineassurance?: Date;
  dateProchainevisite?: Date;
  dateProchainevignette?: Date;
  
  // Métadonnées
  creerPar?: string;
  isVisible?: boolean;
  dateCreation?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  
  // URLs des fichiers
  photo1Url?: string;
  photo2Url?: string;
  photo3Url?: string;
  photo4Url?: string;
  carteGriseRUrl?: string;
  carteGriseVUrl?: string;
  factureUrl?: string;
  autorisationUrl?: string;
}

export interface Modele {
  id: number;
  nom: string;
  vidangeApresChaque: number;
  vidangeApresNbreJours: number;
  chaineChangeable: boolean;
  chaineDistributionApresChaque: number;
  pneusApresChaque: number;
  marqueId: number;
  marqueNom?: string;
  categorieId: number;
  categorieNom?: string;
  isVisible: boolean;
  photoUrl?: string;
}

export interface Marque {
  id: number;
  nom: string;
  pays: string;
  isVisible: boolean;
  logoUrl?: string;
  currentUser: string;
}

export interface Categorie {
  id: number;
  nom: string;
  libelle: string;
  exemple: string;
  isVisible: boolean;
} 