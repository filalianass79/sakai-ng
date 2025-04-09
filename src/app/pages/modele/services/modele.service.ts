import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Modele } from '../models/modele.model';


@Injectable({
  providedIn: 'root'
})
export class ModeleService {
  private apiUrl = `${environment.apiUrl}/api/modeles`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des modeles
   * @returns Observable avec la liste des modeles
   */
  getModeles(): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Modele[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des modeles actives
   * @returns Observable avec la liste des modeles actives
   */
  getActivesModeles(): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Modele[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des modeles archivées
   * @returns Observable avec la liste des modeles archivées
   */
  getArchivesModeles(): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Modele[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une modele par son ID
   * @param id L'ID de la modele
   * @returns Observable avec les informations de la modele
   */
  getModeleById(id: number): Observable<Modele> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Modele>(`${this.apiUrl}/byId/${id}`, options);
  }

  getModeleByNom(nom: string): Observable<Modele> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Modele>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle modele
   * @param modele Les données de la modele
   * @returns Observable avec les informations de la modele créée
   */
  createModele(modele: Partial<Modele>): Observable<Modele> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Modele>(`${this.apiUrl}/add`, modele, options);
  }




  /**
   * Met à jour une modele existante
   * @param id L'ID de la modele
   * @param modele Les données mises à jour de la modele
   * @returns Observable avec les informations de la modele mise à jour
   */
  updateModele(id: number, modele: Partial<Modele>): Observable<Modele> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Modele>(`${this.apiUrl}/update/${id}`, modele, options);
  }

  /**
   * Supprime une modele
   * @param id L'ID de la modele
   * @returns Observable avec le résultat de la suppression
   */
  deleteModele(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une modele
   * @param id L'ID de la modele
   * @returns Observable avec le résultat de l'archivage
   */
  archiveModele(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une modele
   * @param id L'ID de la modele
   * @returns Observable avec le résultat de l'activation
   */
  activeModele(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  getModelesByCategories(categories: number[]): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Modele[]>(`${this.apiUrl}/byCategories/${categories}`, options);
  }

  getModelesByTypeCarburant(typeCarburant: string): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Modele[]>(`${this.apiUrl}/byTypeCarburant`, {params: {typeCarburant},  withCredentials: true});
  }

  getModelesByTypeTransmission(typeTransmission: string): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Modele[]>(`${this.apiUrl}/byTypeTransmission`, {params: {typeTransmission},  withCredentials: true});
  }

  getModelesByCategoriesAndTypeCarburantAndTypeTransmission(categories: number[], typeCarburant: string, typeTransmission: string): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Modele[]>(`${this.apiUrl}/byCategoriesAndTypeCarburantAndTypeTransmission`, {params: {categories, typeCarburant, typeTransmission},  withCredentials: true});
  } 

  getModelesByCategoriesAndTypeCarburantsAndTypeTransmissions(categories: number[], typeCarburants: string[], typeTransmissions: string[]): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Modele[]>(`${this.apiUrl}/byCategoriesAndTypeCarburantsAndTypeTransmissions`, {params: {categories, typeCarburants, typeTransmissions},  withCredentials: true});
  } 


  importModeles(formData: FormData): Observable<Modele[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Modele[]>(`${this.apiUrl}/import`, formData, options);
  }
} 