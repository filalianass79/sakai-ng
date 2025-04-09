import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Marque } from '../models/marque.model';


@Injectable({
  providedIn: 'root'
})
export class MarqueService {
  private apiUrl = `${environment.apiUrl}/api/marques`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des marques
   * @returns Observable avec la liste des marques
   */
  getMarques(): Observable<Marque[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Marque[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des marques actives
   * @returns Observable avec la liste des marques actives
   */
  getActivesMarques(): Observable<Marque[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Marque[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des marques archivées
   * @returns Observable avec la liste des marques archivées
   */
  getArchivesMarques(): Observable<Marque[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Marque[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une marque par son ID
   * @param id L'ID de la marque
   * @returns Observable avec les informations de la marque
   */
  getMarqueById(id: number): Observable<Marque> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Marque>(`${this.apiUrl}/byId/${id}`, options);
  }

  getMarqueByNom(nom: string): Observable<Marque> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Marque>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle marque
   * @param marque Les données de la marque
   * @returns Observable avec les informations de la marque créée
   */
  createMarque(marque: Partial<Marque>): Observable<Marque> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Marque>(`${this.apiUrl}/add`, marque, options);
  }




  /**
   * Met à jour une marque existante
   * @param id L'ID de la marque
   * @param marque Les données mises à jour de la marque
   * @returns Observable avec les informations de la marque mise à jour
   */
  updateMarque(id: number, marque: Partial<Marque>): Observable<Marque> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Marque>(`${this.apiUrl}/update/${id}`, marque, options);
  }

  /**
   * Supprime une marque
   * @param id L'ID de la marque
   * @returns Observable avec le résultat de la suppression
   */
  deleteMarque(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une marque
   * @param id L'ID de la marque
   * @returns Observable avec le résultat de l'archivage
   */
  archiveMarque(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une marque
   * @param id L'ID de la marque
   * @returns Observable avec le résultat de l'activation
   */
  activeMarque(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  importMarques(formData: FormData): Observable<Marque[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Marque[]>(`${this.apiUrl}/import`, formData, options);
  }
} 