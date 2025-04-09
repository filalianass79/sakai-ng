import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OcrResult {
  extractedText: string;
  extractedFields: {
    raisonSocial: string;
    identifiantFiscal: string;
    ice: string;
    registreCommerce: string;
    adresse: string;
    ville: string;
    email: string;
    telephone: string;
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OcrService {
  private apiUrl = `${environment.apiUrl}/api/public/ocr`;

  constructor(private http: HttpClient) {}

  /**
   * Process a document using OCR on the backend
   * @param formData FormData containing the file to process
   * @returns Observable with the OCR results
   */
  processDocument(formData: FormData): Observable<OcrResult> {
    const headers = new HttpHeaders({
      // Ne pas définir Content-Type pour les requêtes multipart/form-data
      // Le navigateur le fera automatiquement avec la boundary correcte
    });

    const options = {
      headers: headers,
      withCredentials: true // Utiliser les credentials pour l'authentification
    };

    return this.http.post<OcrResult>(`${this.apiUrl}/process`, formData, options)
      .pipe(
        catchError(error => {
          console.error('Error processing document:', error);
          return throwError(() => new Error(`Erreur lors du traitement du document: ${error.message}`));
        })
      );
  }

  /**
   * Get the status of an OCR processing job
   * @param jobId The ID of the OCR job
   * @returns Observable with the job status
   */
  getJobStatus(jobId: string): Observable<any> {
    const options = {
      withCredentials: true // Utiliser les credentials pour l'authentification
    };

    return this.http.get(`${this.apiUrl}/status/${jobId}`, options)
      .pipe(
        catchError(error => {
          console.error('Error getting job status:', error);
          return throwError(() => new Error(`Erreur lors de la récupération du statut: ${error.message}`));
        })
      );
  }
} 