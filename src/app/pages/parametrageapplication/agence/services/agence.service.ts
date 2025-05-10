import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agence } from '../models/agence.model';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  private apiUrl = `${environment.apiUrl}/api/agences`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des agences
   * @returns Observable avec la liste des agences
   */
  getAgences(): Observable<Agence[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Agence[]>(`${this.apiUrl}/all`, options);
  }

  /**
   * Récupère la liste des agences actives
   * @returns Observable avec la liste des agences actives
   */
  getActivesAgences(): Observable<Agence[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Agence[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des agences archivées
   * @returns Observable avec la liste des agences archivées
   */
  getArchivesAgences(): Observable<Agence[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Agence[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une agence par son ID
   * @param id L'ID de la agence
   * @returns Observable avec les informations de la agence
   */
  getAgenceById(id: number): Observable<Agence> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Agence>(`${this.apiUrl}/byId/${id}`, options);
  }

  getAgenceByNom(nom: string): Observable<Agence> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Agence>(`${this.apiUrl}/byNom/${nom}`, options);
  }

  /**
   * Crée une nouvelle agence
   * @param agence Les données de la agence
   * @returns Observable avec les informations de la agence créée
   */
  createAgence(agence: Partial<Agence>): Observable<Agence> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Agence>(`${this.apiUrl}/add`, agence, options);
  }




  /**
   * Met à jour une agence existante
   * @param id L'ID de la agence
   * @param agence Les données mises à jour de la agence
   * @returns Observable avec les informations de la agence mise à jour
   */
  updateAgence(id: number, agence: Partial<Agence>): Observable<Agence> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Agence>(`${this.apiUrl}/update/${id}`, agence, options);
  }

  /**
   * Supprime une agence
   * @param id L'ID de la agence
   * @returns Observable avec le résultat de la suppression
   */
  deleteAgence(id: number, currentUser: string): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une agence
   * @param id L'ID de la agence
   * @returns Observable avec le résultat de l'archivage
   */
  archiveAgence(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };
    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {currentUser}, options);
  }

  /**
   * Active une agence
   * @param id L'ID de la agence
   * @returns Observable avec le résultat de l'activation
   */
  activeAgence(id: number, currentUser: string): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {currentUser}, options);
  }
  /**
   * Importe les agences depuis un fichier CSV
   * @param formData Les données du fichier CSV
   * @returns Observable avec la liste des agences importées
   */
  importAgences(formData: FormData): Observable<Agence[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Agence[]>(`${this.apiUrl}/import`, formData, options);
  }
} 