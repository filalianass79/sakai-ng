import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Image } from './image.service';

export interface Company {
  id: number;
  name: string;
  raisonSociale: string;
  activite?: string;
  formeJuridique?: string;
  dateDeCreation?: Date;
  idFiscal?: string;
  taxeProfessionnelle?: string;
  registreDeCommerce?: string;
  villeRegistreDeCommerce?: string;
  ice?: string;
  description?: string;
  address?: string;
  adresse?: string;
  ville?: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  logo?: Image;
  papierEnTete?: Image;
  enTete?: Image;
  piedPage?: Image;
  isVisible?: boolean;
  cnss?: string;
  gsm?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/api/companies`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des sociétés
   * @returns Observable avec la liste des sociétés
   */
  getCompanies(): Observable<Company[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Company[]>(this.apiUrl, options);
  }

  /**
   * Récupère la liste des sociétés actives
   * @returns Observable avec la liste des sociétés actives
   */
  getActivesCompanies(): Observable<Company[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Company[]>(`${this.apiUrl}/actives`, options);
  }

  /**
   * Récupère la liste des sociétés archivées
   * @returns Observable avec la liste des sociétés archivées
   */
  getArchivesCompanies(): Observable<Company[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Company[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une société par son ID
   * @param id L'ID de la société
   * @returns Observable avec les informations de la société
   */
  getCompany(id: number): Observable<Company> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Company>(`${this.apiUrl}/byId/${id}`, options);
  }

  /**
   * Crée une nouvelle société
   * @param company Les données de la société
   * @returns Observable avec les informations de la société créée
   */
  createCompany(company: Partial<Company>): Observable<Company> {
    const options = {
      withCredentials: true
    };

    return this.http.post<Company>(`${this.apiUrl}/add`, company, options);
  }

  /**
   * Met à jour une société existante
   * @param id L'ID de la société
   * @param company Les données mises à jour de la société
   * @returns Observable avec les informations de la société mise à jour
   */
  updateCompany(id: number, company: Partial<Company>): Observable<Company> {
    const options = {
      withCredentials: true
    };

    return this.http.put<Company>(`${this.apiUrl}/update/${id}`, company, options);
  }

  /**
   * Supprime une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de la suppression
   */
  deleteCompany(id: number): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Archive une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de l'archivage
   */
  archiveCompany(id: number): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/archive/${id}`, {}, options);
  }

  /**
   * Active une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de l'activation
   */
  activeCompany(id: number): Observable<any> {
    const options = {
      withCredentials: true
    };

    return this.http.put<any>(`${this.apiUrl}/active/${id}`, {}, options);
  }

  importCompanies(formData: FormData): Observable<Company[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Company[]>(`${this.apiUrl}/import`, formData, options);
  }
} 