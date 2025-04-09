import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TarifLocation } from '../models/tarif.location';

@Injectable({
  providedIn: 'root'
})
export class TarifLocationService {
  private apiUrl = `${environment.apiUrl}/api/tarifLocations`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des tarifLocations
   * @returns Observable avec la liste des tarifLocations
   */
  getTarifLocations(): Observable<TarifLocation[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<TarifLocation[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des tarifLocations actives
   * @returns Observable avec la liste des tarifLocations actives
   */
  getActivesTarifLocations(): Observable<TarifLocation[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<TarifLocation[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des tarifLocations archivées
   * @returns Observable avec la liste des tarifLocations archivées
   */
  getArchivesTarifLocations(): Observable<TarifLocation[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<TarifLocation[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une tarifLocation par son ID
   * @param id L'ID de la tarifLocation
   * @returns Observable avec les informations de la tarifLocation
   */
  getTarifLocationById(id: number): Observable<TarifLocation> {
    const options = {
      withCredentials: true
    };

    return this.http.get<TarifLocation>(`${this.apiUrl}/byId/${id}`, options);
  }

  getTarifLocationByNom(nom: string): Observable<TarifLocation> {
    const options = {
      withCredentials: true
    };

    return this.http.get<TarifLocation>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle tarifLocation
   * @param tarifLocation Les données de la tarifLocation
   * @returns Observable avec les informations de la tarifLocation créée
   */
  createTarifLocation(tarifLocation: Partial<TarifLocation>): Observable<TarifLocation> {
    const options = {
      withCredentials: true
    };

    return this.http.post<TarifLocation>(`${this.apiUrl}/add`, tarifLocation, options);
  }

  /**
   * Met à jour une tarifLocation existante
   * @param id L'ID de la tarifLocation
   * @param tarifLocation Les données mises à jour de la tarifLocation
   * @returns Observable avec les informations de la tarifLocation mise à jour
   */
  updateTarifLocation(id: number, tarifLocation: Partial<TarifLocation>): Observable<TarifLocation> {
    const options = {
      withCredentials: true
    };

    return this.http.put<TarifLocation>(`${this.apiUrl}/update/${id}`, tarifLocation, options);
  }

  /**
   * Supprime une tarifLocation
   * @param id L'ID de la tarifLocation
   * @returns Observable avec le résultat de la suppression
   */
  deleteTarifLocation(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une tarifLocation
   * @param id L'ID de la tarifLocation
   * @returns Observable avec le résultat de l'archivage
   */
  archiveTarifLocation(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une tarifLocation
   * @param id L'ID de la tarifLocation
   * @returns Observable avec le résultat de l'activation
   */
  activeTarifLocation(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }

  calculatePrixLocation(modeleId: number, dateDebut: Date | null, dateFin: Date | null): Observable<number> {
    if (!dateDebut || !dateFin) {
      return throwError(() => new Error('Les dates de début et de fin sont requises'));
    }

    // S'assurer que les dates sont des objets Date valides
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
      return throwError(() => new Error('Dates invalides'));
    }

    return this.http.get<number>(`${this.apiUrl}/calculate`, {
      params: {
        modeleId: modeleId.toString(),
        dateDebut: debut.toISOString().split('T')[0], // Format YYYY-MM-DD
        dateFin: fin.toISOString().split('T')[0]      // Format YYYY-MM-DD
      }
    });
  }

  importTarifLocations(formData: FormData): Observable<TarifLocation[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<TarifLocation[]>(`${this.apiUrl}/import`, formData, options);
  }
} 

