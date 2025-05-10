import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Image {
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
export class ImageService {
  private apiUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) { }

  /**
   * Télécharge une image
   * @param file Le fichier à télécharger
   * @param entityType Le type d'entité associée à l'image
   * @param entityId L'ID de l'entité associée à l'image
   * @param name Le nom de l'image (optionnel)
   * @returns Observable avec les informations de l'image téléchargée
   */
  uploadImage(file: File, entityType: string, entityId: number, name?: string): Observable<Image> {
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

    return this.http.post<Image>(`${this.apiUrl}/upload`, formData, options);
  }

  /**
   * Récupère une image par son ID
   * @param id L'ID de l'image
   * @returns Observable avec les informations de l'image
   */
  getImage(id: number): Observable<Image> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Image>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Récupère toutes les images pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @returns Observable avec la liste des images
   */
  getImagesByEntity(entityType: string, entityId: number): Observable<Image[]> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Image[]>(`${this.apiUrl}/entity/${entityType}/${entityId}`, options);
  }

  /**
   * Récupère une image spécifique pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @param name Le nom de l'image
   * @returns Observable avec les informations de l'image
   */
  getImageByNameAndEntity(entityType: string, entityId: number, name: string): Observable<Image> {
    const options = {
      withCredentials: true
    };

    return this.http.get<Image>(`${this.apiUrl}/entity/${entityType}/${entityId}/${name}`, options);
  }

  /**
   * Met à jour une image
   * @param id L'ID de l'image
   * @param file Le nouveau fichier
   * @returns Observable avec les informations de l'image mise à jour
   */
  updateImage(id: number, file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);

    const options = {
      withCredentials: true
    };

    return this.http.put<Image>(`${this.apiUrl}/${id}`, formData, options);
  }

  /**
   * Supprime une image
   * @param id L'ID de l'image
   * @returns Observable avec le résultat de la suppression
   */
  deleteImage(id: number): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Supprime toutes les images pour une entité
   * @param entityType Le type d'entité
   * @param entityId L'ID de l'entité
   * @returns Observable avec le résultat de la suppression
   */
  deleteImagesByEntity(entityType: string, entityId: number): Observable<void> {
    const options = {
      withCredentials: true
    };

    return this.http.delete<void>(`${this.apiUrl}/entity/${entityType}/${entityId}`, options);
  }

  /**
   * Construit l'URL pour afficher une image
   * @param filename Le nom du fichier
   * @returns L'URL complète pour afficher l'image
   */
  getImageViewUrl(filename: string): string {
    return `${this.apiUrl}/view/${filename}`;
  }

  /**
   * Construit l'URL pour télécharger une image
   * @param filename Le nom du fichier
   * @returns L'URL complète pour télécharger l'image
   */
  getImageDownloadUrl(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${filename}`, { responseType: 'blob' });
  }
}
