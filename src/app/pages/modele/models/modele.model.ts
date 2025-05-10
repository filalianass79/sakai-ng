import { Marque } from "../../marque/models/marque.model";
import { Categorie } from "../../categorie/models/categorie.model";
import { Image } from "../../service/image.service";

export interface Modele {
    id?: number;
    nom: string;
    marque: Marque;
    categorie: Categorie;
    typeCarburant: string;
    typeTransmission: string;
    nbreSacs: number;
    nbreValises: number;
    volumeCoffre: number;
    nbrePortes: number;
    nbrePlaces: number;
    nbreKmVidange: number;
    nbreJoursVidange: number;
    chaineChangeable: boolean;
    nbreKmChaine: number;
    nbreKmPneus: number;
    isVisible?: boolean;
    logo?: Image;
    isNew?: boolean;
    prix?: number;
    prixJours?: number;
    detail?:boolean; //pour savoir si le modele est visible dans la liste des modeles
} 