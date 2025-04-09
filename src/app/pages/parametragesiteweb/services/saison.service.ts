import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Saison } from '../models/saison';


@Injectable({
  providedIn: 'root'
})
export class SaisonService {
  private apiUrl = `${environment.apiUrl}/api/saisons`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des saisons
   * @returns Observable avec la liste des saisons
   */
  getSaisons(): Observable<Saison[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Saison[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des saisons actives
   * @returns Observable avec la liste des saisons actives
   */
  getActivesSaisons(): Observable<Saison[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Saison[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des saisons archivées
   * @returns Observable avec la liste des saisons archivées
   */
  getArchivesSaisons(): Observable<Saison[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Saison[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une saison par son ID
   * @param id L'ID de la saison
   * @returns Observable avec les informations de la saison
   */
  getSaisonById(id: number): Observable<Saison> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Saison>(`${this.apiUrl}/byId/${id}`, options);
  }

  getSaisonByNom(nom: string): Observable<Saison> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Saison>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle saison
   * @param saison Les données de la saison
   * @returns Observable avec les informations de la saison créée
   */
  createSaison(saison: Partial<Saison>): Observable<Saison> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Saison>(`${this.apiUrl}/add`, saison, options);
  }




  /**
   * Met à jour une saison existante
   * @param id L'ID de la saison
   * @param saison Les données mises à jour de la saison
   * @returns Observable avec les informations de la saison mise à jour
   */
  updateSaison(id: number, saison: Partial<Saison>): Observable<Saison> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Saison>(`${this.apiUrl}/update/${id}`, saison, options);
  }

  /**
   * Supprime une saison
   * @param id L'ID de la saison
   * @returns Observable avec le résultat de la suppression
   */
  deleteSaison(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une saison
   * @param id L'ID de la saison
   * @returns Observable avec le résultat de l'archivage
   */
  archiveSaison(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une saison
   * @param id L'ID de la saison
   * @returns Observable avec le résultat de l'activation
   */
  activeSaison(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  importSaisons(formData: FormData): Observable<Saison[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Saison[]>(`${this.apiUrl}/import`, formData, options);
  }

  getSaisonByDate(date: Date): Observable<Saison> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Saison>(`${this.apiUrl}/byDate/${date}`, options);
  }

  getSaisonByDateDebut(date: Date): Observable<Saison> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Saison>(`${this.apiUrl}/byDateDebut/${date}`, options);
  }

  getSaisonByDateDebutLessThanEqualAndDateFinGreaterThanEqual(date: Date, date2: Date): Observable<Saison> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Saison>(`${this.apiUrl}/byDateDebutLessThanEqualAndDateFinGreaterThanEqual/${date}/${date2}`, options);
  }
  
} 