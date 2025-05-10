import { QualiteSalarie } from './enum/qualite-salarie.enum';
import { TypeContrat } from './enum/type-contrat.enum';
import { FonctionSalarie } from './enum/fonction-salarie.enum';
import { SituationFamiliale } from './enum/situation-familiale.enum';
import { Image } from '../../../service/image.service';



export interface Agence {
  id?: number;
  nom?: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

export interface Company {
  id?: number;
  nom?: string;
  // Ajoutez d'autres propriétés selon vos besoins
}

export interface Salarie {
  id?: number;
  immatriculation?: string;
  nom?: string;
  prenom?: string;
  cin?: string;
  cnss?: string;
  adresse?: string;
  ville?: string;
  email?: string;
  fixe?: string;
  gsmp?: string;
  gsm?: string;
  qualiteSalarie?: QualiteSalarie;
  typeContrat?: TypeContrat;
  fonction?: FonctionSalarie;
  dateDeclarationCnss?: Date;
  dateNaissance?: Date;
  situationFamiliale?: SituationFamiliale;
  agence?: Agence;
  company?: Company;
  isVisible?: boolean;
  cv?: Image;
  photo?: Image;
  contrat?: Image;
  cartenationaleR?: Image;
  cartenationaleV?: Image;
  diplome?: Image;
  permisR?: Image;
  permisV?: Image;
  currentUser?: string;
} 