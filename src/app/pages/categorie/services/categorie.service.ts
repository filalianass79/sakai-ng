import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Categorie } from '../models/categorie.model';


@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des categories
   * @returns Observable avec la liste des categories
   */
  getCategories(): Observable<Categorie[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Categorie[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des categories actives
   * @returns Observable avec la liste des categories actives
   */
  getActivesCategories(): Observable<Categorie[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Categorie[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des categories archivées
   * @returns Observable avec la liste des categories archivées
   */
  getArchivesCategories(): Observable<Categorie[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Categorie[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une categorie par son ID
   * @param id L'ID de la categorie
   * @returns Observable avec les informations de la categorie
   */
  getCategorieById(id: number): Observable<Categorie> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Categorie>(`${this.apiUrl}/byId/${id}`, options);
  }

  getCategorieByNom(nom: string): Observable<Categorie> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Categorie>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle categorie
   * @param categorie Les données de la categorie
   * @returns Observable avec les informations de la categorie créée
   */
  createCategorie(categorie: Partial<Categorie>): Observable<Categorie> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Categorie>(`${this.apiUrl}/add`, categorie, options);
  }

  /**
   * Met à jour une categorie existante
   * @param id L'ID de la categorie
   * @param categorie Les données mises à jour de la categorie
   * @returns Observable avec les informations de la categorie mise à jour
   */
  updateCategorie(id: number, categorie: Partial<Categorie>): Observable<Categorie> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Categorie>(`${this.apiUrl}/update/${id}`, categorie, options);
  }

  /**
   * Supprime une categorie
   * @param id L'ID de la categorie
   * @returns Observable avec le résultat de la suppression
   */
  deleteCategorie(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une categorie
   * @param id L'ID de la categorie
   * @returns Observable avec le résultat de l'archivage
   */
  archiveCategorie(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une categorie
   * @param id L'ID de la categorie
   * @returns Observable avec le résultat de l'activation
   */
  activeCategorie(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  importCategories(formData: FormData): Observable<Categorie[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Categorie[]>(`${this.apiUrl}/import`, formData, options);
  }
} 