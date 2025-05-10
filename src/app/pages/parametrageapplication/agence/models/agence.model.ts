import { Company } from "../../../company/models/company.model";
import { Image } from "../../../service/image.service";

export interface Agence {
    id?: number;
    nom: string;
    adresse?: string;
    ville?: string;
    postalCode?: string;
    telephone?: string;
    email?: string;
    responsable?: string;
    lettrePrFacturation?:string; //lettre de préfacturation
    fixe?:string;
    fax?:string; 
    company?: Company;
    companyId?: number;
    logo?: Image;
    description?: string;
    hours: string[];
    mapUrl: string;
    imageUrl: string;
    manager: AgenceManager;
    iswebagence?: boolean; //agence web
    isappagence?: boolean; //agence app
    isVisible?: boolean; //agence visible
     
    
   
  
} 

export interface AgenceManager {
    name: string;
    phone: string;
    email: string;
    photoUrl: string;
}