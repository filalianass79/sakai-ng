import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Pdf {
  id: number;
  name: string;
  type: string;
  path: string;
  originalFilename: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  entityType: string;
  entityId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = `${environment.apiUrl}/api/pdfs`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  /**
   * Télécharge une pdf
   * @param file Le fichier à télécharger
   * @param entityType Le type d'entité associée à l'pdf
   * @param entityId L'ID de l'entité associée à l'pdf
   * @param name Le nom de l'pdf (optionnel)
   * @returns Observable avec les informations de l'pdf téléchargée
   */
  uploadPdf(file: File, entityType: string, entityId: number, name?: string): Observable<Pdf> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId.toString());
    
    if (name) {
      formData.append('name', name);
    }
    const options = {
      withCredentials: true
    };

    return this.http.post<Pdf>(`${this.apiUrl}/upload`, formData, options);
  }

  /**
   * Récupère une pdf par son ID
   * @param id L'ID de l'pdf
   * @returns Observable avec les informations de l'pdf
   */
  getPdf(id: number): Observable<Pdf> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Pdf>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Récupère toutes les pdfs pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @returns Observable avec la liste des pdfs
   */
  getPdfsByEntity(entityType: string, entityId: number): Observable<Pdf[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Pdf[]>(`${this.apiUrl}/entity/${entityType}/${entityId}`, options);
  }


  /**
   * Récupère toutes les pdfs pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @param namePrefix Le commence du nom de l'pdf (document dans notre cas)
   * @returns Observable avec la liste des pdfs
   */
  getPdfsByNameStartWithAndEntity(namePrefix: string, entityType: string, entityId: number): Observable<Pdf[]> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Pdf[]>(`${this.apiUrl}/entitysw/${namePrefix}/${entityType}/${entityId}`, options);
  }

  /**
   * Récupère une pdf spécifique pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @param name Le nom de l'pdf
   * @returns Observable avec les informations de l'pdf
   */
  getPdfByNameAndEntity(entityType: string, entityId: number, name: string): Observable<Pdf> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Pdf>(`${this.apiUrl}/entity/${entityType}/${entityId}/${name}`, options);
  }

  /**
   * Met à jour une pdf
   * @param id L'ID de l'pdf
   * @param file Le nouveau fichier
   * @returns Observable avec les informations de l'pdf mise à jour
   */
  updatePdf(id: number, file: File): Observable<Pdf> {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      withCredentials: true
    };
    return this.http.put<Pdf>(`${this.apiUrl}/${id}`, formData,options);
  }

  /**
   * Supprime une pdf
   * @param id L'ID de l'pdf
   * @returns Observable avec le résultat de la suppression
   */
  deletePdf(id: number): Observable<void> {
    const options = {
      withCredentials: true
    };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Supprime toutes les pdfs pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @returns Observable avec le résultat de la suppression
   */
  deletePdfsByEntity(entityType: string, entityId: number): Observable<void> {
    const options = {
      withCredentials: true
    };
    return this.http.delete<void>(`${this.apiUrl}/entity/${entityType}/${entityId}`, options);
  }

  /**
   * Construit l'URL pour afficher une pdf
   * @param filename Le nom du fichier
   * @returns L'URL complète pour afficher l'pdf
   */
  getPdfViewUrl(filename: string): string {
    return `${this.apiUrl}/view/${filename}`;
  }

  /**
   * Construit l'URL pour télécharger une pdf
   * @param filename Le nom du fichier
   * @returns L'URL complète pour télécharger l'pdf 
   */
  getPdfDownloadUrl(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }
}
