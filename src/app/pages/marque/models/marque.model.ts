import { Image } from '../../service/image.service';
    
export interface Marque {
    id?: number;
    nom: string;
    description: string;
    pays: string;
    logo?: Image;
    isVisible?: boolean;    
} 