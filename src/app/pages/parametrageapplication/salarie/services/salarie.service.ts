import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salarie } from '../models/salarie.model';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/core/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class SalarieService {
  private apiUrl = `${environment.apiUrl}/api/salaries`;


 /* private getHttpOptions() {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true// Cette option permet d'envoyer les cookies d'authentification avec la requête HTTP,
      // assurant ainsi que l'utilisateur est authentifié lors de l'appel à l'API
};
  }*/

 

private getHttpOptions = {
    withCredentials: true
  };
 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Récupérer tous les salariés
  getAllSalaries(): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/all`, this.getHttpOptions);
  }

  // Récupérer les salariés actifs
  getActivesSalaries(): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/actives`, this.getHttpOptions);
  }

  // Récupérer les salariés archivés
  getArchivesSalaries(): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/archives`, this.getHttpOptions);
  }

  // Récupérer les salariés par agence
  getSalariesByAgence(agenceId: number): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/byAgenceId/${agenceId}`, this.getHttpOptions);
  }

  // Récupérer les salariés par entreprise
  getSalariesByCompany(companyId: number): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/byCompanyId/${companyId}`, this.getHttpOptions);
  }

  // Récupérer les salariés par agence et entreprise
  getSalariesByAgenceAndCompany(agenceId: number, companyId: number): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(`${this.apiUrl}/byAgenceIdAndCompanyId/${agenceId}/${companyId}`, this.getHttpOptions);
  }

  // Récupérer un salarié par son ID
  getSalarieById(id: number): Observable<Salarie> {
    return this.http.get<Salarie>(`${this.apiUrl}/byId/${id}`, this.getHttpOptions);
  }

  // Créer un nouveau salarié
  createSalarie(salarie: Salarie): Observable<Salarie> {
    return this.http.post<Salarie>(`${this.apiUrl}/add`, salarie, this.getHttpOptions);
  }

  // Mettre à jour un salarié
  updateSalarie(id: number, salarie: Salarie): Observable<Salarie> {
      return this.http.put<Salarie>(`${this.apiUrl}/update/${id}`, salarie, this.getHttpOptions);
  }

  // Supprimer un salarié
  deleteSalarie(id: number, currentUser: string): Observable<void> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: currentUser
    };
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, options);
  }

  // Activer un salarié
  activeSalarie(id: number, currentUser: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/active/${id}`, currentUser, this.getHttpOptions);
  }

  // Archiver un salarié
  archiveSalarie(id: number, currentUser: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/archive/${id}`, currentUser, this.getHttpOptions);
  }

  // Importer des salariés depuis un fichier Excel
  importSalaries(formData: FormData): Observable<Salarie[]> {
    
    return this.http.post<Salarie[]>(`${this.apiUrl}/import`, formData, this.getHttpOptions);
  }

  
} 