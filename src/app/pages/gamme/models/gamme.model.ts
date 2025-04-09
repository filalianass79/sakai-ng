import { Image } from '../../service/image.service';
    
export interface Gamme {
    id?: number;
    nom: string;
    logo?: Image;
    isVisible?: boolean;    
} 