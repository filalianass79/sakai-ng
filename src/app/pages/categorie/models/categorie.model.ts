import { Image } from '../../service/image.service';
    
export interface Categorie {
    id?: number;
    nom: string;
    exemple: string;
    libelle: string;
    logo?: Image;
    isVisible?: boolean;    
} 