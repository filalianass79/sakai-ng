import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileS3Service {
  private apiUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) { }

  downloadFileFromS3(fileName: string | undefined): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${fileName}`, {
      responseType: 'blob'
    });
  } 
  deleteFileFromS3(file: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${file}`, {
      responseType: 'text'
    });
  }
  uploadFileToS3(fileFormData : FormData): Observable<any>{

    return this.http.post(`${this.apiUrl}/uploadFile`, fileFormData, { observe: 'response', responseType: 'text' })

  }

  

  editFileFromS3(fileFormData : FormData, file: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/edit/${file}`, fileFormData, { observe: 'response', responseType: 'text' })
  }




  getFileFromS3(file: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/file/${file}`, { observe: 'response', responseType: 'text' })
  }

  
}
