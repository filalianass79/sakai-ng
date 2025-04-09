import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Gamme } from '../models/gamme.model';


@Injectable({
  providedIn: 'root'
})
export class GammeService {
  private apiUrl = `${environment.apiUrl}/api/gammes`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des gammes
   * @returns Observable avec la liste des gammes
   */
  getGammes(): Observable<Gamme[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Gamme[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des gammes actives
   * @returns Observable avec la liste des gammes actives
   */
  getActivesGammes(): Observable<Gamme[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Gamme[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des gammes archivées
   * @returns Observable avec la liste des gammes archivées
   */
  getArchivesGammes(): Observable<Gamme[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Gamme[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une gamme par son ID
   * @param id L'ID de la gamme
   * @returns Observable avec les informations de la gamme
   */
  getGammeById(id: number): Observable<Gamme> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Gamme>(`${this.apiUrl}/byId/${id}`, options);
  }

  getGammeByNom(nom: string): Observable<Gamme> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Gamme>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle gamme
   * @param gamme Les données de la gamme
   * @returns Observable avec les informations de la gamme créée
   */
  createGamme(gamme: Partial<Gamme>): Observable<Gamme> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Gamme>(`${this.apiUrl}/add`, gamme, options);
  }

  /**
   * Met à jour une gamme existante
   * @param id L'ID de la gamme
   * @param gamme Les données mises à jour de la gamme
   * @returns Observable avec les informations de la gamme mise à jour
   */
  updateGamme(id: number, gamme: Partial<Gamme>): Observable<Gamme> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Gamme>(`${this.apiUrl}/update/${id}`, gamme, options);
  }

  /**
   * Supprime une gamme
   * @param id L'ID de la gamme
   * @returns Observable avec le résultat de la suppression
   */
  deleteGamme(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une gamme
   * @param id L'ID de la gamme
   * @returns Observable avec le résultat de l'archivage
   */
  archiveGamme(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une gamme
   * @param id L'ID de la gamme
   * @returns Observable avec le résultat de l'activation
   */
  activeGamme(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  importGammes(formData: FormData): Observable<Gamme[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Gamme[]>(`${this.apiUrl}/import`, formData, options);
  }
} 