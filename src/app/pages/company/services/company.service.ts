import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../auth/core/services/auth.service';
import { Company } from '../models/company.model';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = `${environment.apiUrl}/api/companies`;

  constructor(private http: HttpClient,
              private authService: AuthService) { }

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

  /**
   * Récupère la liste des sociétés
   * @returns Observable avec la liste des sociétés
   */
  getAllCompanies(): Observable<Company[]> {
    const options = this.getHttpOptions();
    return this.http.get<Company[]>(`${this.apiUrl}/all`, options);
  }

   /**
   * Récupère la liste des sociétés actives
   * @returns Observable avec la liste des sociétés
   */
   getActivesCompanies(): Observable<Company[]> {
    const options = this.getHttpOptions();
    return this.http.get<Company[]>(`${this.apiUrl}/actives`, options);
  }

     /**
   * Récupère la liste des sociétés archivées
   * @returns Observable avec la liste des sociétés
   */
   getArchivesCompanies(): Observable<Company[]> {
    const options = this.getHttpOptions();
    return this.http.get<Company[]>(`${this.apiUrl}/archives`, options);
  }

  /**
   * Récupère une société par son ID
   * @param id L'ID de la société
   * @returns Observable avec les informations de la société
   */
  getCompany(id: number): Observable<Company> {
    const options = this.getHttpOptions();
    return this.http.get<Company>(`${this.apiUrl}/byId/${id}`, options);
  }

  /**
   * Récupère une société par son ID
   * @param id L'ID de la société
   * @returns Observable avec les informations de la société
   */
  getCompanyByRaisonSociale(raisonSociale: string): Observable<Company> {
    const options = this.getHttpOptions();
    return this.http.get<Company>(`${this.apiUrl}/byRaisonSociale/${raisonSociale}`, options);
  }

  /**
   * Crée une nouvelle société
   * @param company Les données de la société
   * @returns Observable avec les informations de la société créée
   */
  createCompany(company: Partial<Company>): Observable<Company> {
    const options = this.getHttpOptions();
    return this.http.post<Company>(`${this.apiUrl}/add`, company, options);
  }



  /**
   * Met à jour une société existante
   * @param id L'ID de la société
   * @param company Les données mises à jour de la société
   * @returns Observable avec les informations de la société mise à jour
   */
  updateCompany(id: number, company: Partial<Company>): Observable<Company> {
    const options = this.getHttpOptions();
    return this.http.put<Company>(`${this.apiUrl}/update/${id}`, company, options);
  }

  /**
   * Supprime une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de la suppression
   */
  deleteCompany(id: number): Observable<void> {
    const options = this.getHttpOptions();
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, options);
  }

  /**
   * Active une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de l'activation
   */ 
  activeCompany(id: number): Observable<void> {
    const options = this.getHttpOptions();
    return this.http.put<void>(`${this.apiUrl}/active/${id}`, options);
  }
  /**
   * Archive une société
   * @param id L'ID de la société
   * @returns Observable avec le résultat de l'archivage
   */
  archiveCompany(id: number): Observable<void> {
    const options = this.getHttpOptions();
    return this.http.put<void>(`${this.apiUrl}/archive/${id}`, options);  
  }
} 