import { Image } from '../../service/image.service';
    
export interface Company {
    id?: number;
    raisonSociale: string;
    activite?: string;
    formeJuridique?: string;
    dateDeCreation?: Date;   
    idFiscal?: string;
    taxeProfessionnelle?: string;
    registreDeCommerce?: string;
    villeRegistreDeCommerce?: string;
    ice?: string;
    adresse?: string;
    ville?: string;
    email?: string;
    website?: string;
    fixe?: string;
    fax?: string;
    gsm?: string;
    cnss?: string;
    logo?: Image;
    entete?: Image;
    pied?: Image;
    creerPar?: string;
    isVisible?: boolean;
    modifierPar?: string;
    archiverPar?: string;
    createdAt?: string;
    updatedAt?: string;

} 