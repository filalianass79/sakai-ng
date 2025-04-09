import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Societe } from '../models/societe.model';
import { AuthService } from '../../auth/core/services/auth.service';
import { map } from 'rxjs/operators';
import { Constants } from '../../shared/constants';
import { environment } from '../../../../environments/environment';

const API_URL = 'http://localhost:8081/api/auth/societes/';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
  private apiUrl = `${environment.apiUrl}/api/auth/societes/`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHttpOptions() {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
  }

  getAllSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrl}all`, this.getHttpOptions())
      .pipe(
        map(societes => this.processSocietesLogos(societes))
      );
  }

  getActivesSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrl}actives`, this.getHttpOptions())
      .pipe(
        map(societes => this.processSocietesLogos(societes))
      );
  }

  getArchivesSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrl}archives`, this.getHttpOptions())
      .pipe(
        map(societes => this.processSocietesLogos(societes))
      );
  }

  getSociete(id: number): Observable<Societe> {
    return this.http.get<Societe>(`${API_URL}byId/${id}`, this.getHttpOptions())
      .pipe(
        map(societe => this.processSocieteLogo(societe))
      );
  }

  createSociete(societe: Societe): Observable<any> {
    return this.http.post(`${API_URL}add`, societe, this.getHttpOptions());
  }

  updateSociete(id: number, societe: Societe): Observable<any> {
    return this.http.put(`${API_URL}update/${id}`, societe, this.getHttpOptions());
  }

  deleteSociete(id: number): Observable<any> {
    return this.http.delete(`${API_URL}delete/${id}`, this.getHttpOptions());
  }

  activeSociete(id: number): Observable<any> {
    return this.http.put(`${API_URL}active/${id}`, this.getHttpOptions());
  }

  archiveSociete(id: number): Observable<any> {
    return this.http.put(`${API_URL}archive/${id}`, this.getHttpOptions());
  }

  // Méthode privée pour traiter les logos des sociétés
  private processSocietesLogos(societes: Societe[]): Societe[] {
    return societes.map(societe => this.processSocieteLogo(societe));
  }

  // Méthode privée pour traiter le logo d'une société
  private processSocieteLogo(societe: Societe): Societe {
    if (societe.logo) {
      // Si le logo commence par http ou data:, c'est déjà une URL complète
      if (societe.logo.startsWith('http') || societe.logo.startsWith('data:')) {
        return societe;
      }
      
      // Si le logo commence par assets/, c'est un chemin relatif
      if (societe.logo.startsWith('assets/')) {
        return societe;
      }
      
      // Sinon, c'est un nom de fichier stocké sur le serveur
      // On construit l'URL complète
      societe.logo = `${Constants.API_BASE_URL}/auth/get/file/${societe.logo}`;
    } else {
      // Si pas de logo, on utilise une image par défaut
      societe.logo = 'assets/images/logo.png';
    }
    return societe;
  }

}