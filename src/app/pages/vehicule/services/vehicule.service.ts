import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule, Modele, Marque, Categorie } from '../models/vehicule.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiUrl}/api/vehicules`;
  private modeleApiUrl = `${environment.apiUrl}/api/modeles`;
  private marqueApiUrl = `${environment.apiUrl}/api/marques`;
  private categorieApiUrl = `${environment.apiUrl}/api/categories`;

  constructor(private http: HttpClient) { }

  // Méthodes pour les véhicules
  getAllVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(this.apiUrl);
  }

  getActiveVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/visible`);
  }

  getVehiculeById(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
  }

  createVehicule(vehicule: FormData): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.apiUrl, vehicule);
  }

  updateVehicule(id: number, vehicule: FormData): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, vehicule);
  }

  deleteVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  archiveVehicule(id: number, archiverPar: string): Observable<void> {
    const params = new HttpParams().set('archiverPar', archiverPar);
    return this.http.patch<void>(`${this.apiUrl}/${id}/archive`, null, { params });
  }

  // Méthodes de recherche spécifiques
  searchVehiculesByImmatriculation(query: string): Observable<Vehicule[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Vehicule[]>(`${this.apiUrl}/search/immatriculation`, { params });
  }

  getVehiculesByModele(modeleId: number): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/modele/${modeleId}`);
  }

  getVehiculesByMarque(marqueId: number, modeleId: number): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/marque/${marqueId}/modele/${modeleId}`);
  }

  getVehiculesByMarqueOnly(marqueId: number): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/marque/${marqueId}`);
  }

  getVehiculesByCategorie(categorieId: number): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  getVehiculesByCouleur(couleur: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/couleur/${couleur}`);
  }

  getVehiculesByCarburant(carburant: string): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/carburant/${carburant}`);
  }

  getVehiculesExpiringCartGrise(start: Date, end: Date): Observable<Vehicule[]> {
    const params = new HttpParams()
      .set('start', start.toISOString())
      .set('end', end.toISOString());
    return this.http.get<Vehicule[]>(`${this.apiUrl}/expiration-carte-grise`, { params });
  }

  getVehiculesVendus(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/vendus`);
  }

  getVehiculesNonVendus(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}/non-vendus`);
  }

  // Méthodes pour les modèles
  getAllModeles(): Observable<Modele[]> {
    return this.http.get<Modele[]>(this.modeleApiUrl);
  }

  getModeleById(id: number): Observable<Modele> {
    return this.http.get<Modele>(`${this.modeleApiUrl}/${id}`);
  }

  getVisibleModeles(): Observable<Modele[]> {
    return this.http.get<Modele[]>(`${this.modeleApiUrl}/visible`);
  }

  getModelesByMarque(marqueId: number): Observable<Modele[]> {
    return this.http.get<Modele[]>(`${this.modeleApiUrl}/marque/${marqueId}`);
  }

  getModelesByCategorie(categorieId: number): Observable<Modele[]> {
    return this.http.get<Modele[]>(`${this.modeleApiUrl}/categorie/${categorieId}`);
  }

  getModelesByMarqueAndCategorie(marqueId: number, categorieId: number): Observable<Modele[]> {
    return this.http.get<Modele[]>(`${this.modeleApiUrl}/marque/${marqueId}/categorie/${categorieId}`);
  }

  createModele(modele: FormData): Observable<Modele> {
    return this.http.post<Modele>(this.modeleApiUrl, modele);
  }

  updateModele(id: number, modele: FormData): Observable<Modele> {
    return this.http.put<Modele>(`${this.modeleApiUrl}/${id}`, modele);
  }

  deleteModele(id: number): Observable<void> {
    return this.http.delete<void>(`${this.modeleApiUrl}/${id}`);
  }

  // Méthodes pour les marques
  getAllMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.marqueApiUrl}/all`);
  }

  getMarqueById(id: number): Observable<Marque> {
    return this.http.get<Marque>(`${this.marqueApiUrl}/${id}`);
  }

  getActivesMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.marqueApiUrl}/actives`);
  }

  getArchivesMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.marqueApiUrl}/archives`);
  }

  createMarque(marque: FormData): Observable<Marque> {
    return this.http.post<Marque>(this.marqueApiUrl, marque);
  }

  updateMarque(id: number, marque: FormData): Observable<Marque> {
    return this.http.put<Marque>(`${this.marqueApiUrl}/${id}`, marque);
  }

  deleteMarque(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.delete<void>(`${this.marqueApiUrl}/${id}`, { params });
  }

  archiveMarque(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.patch<void>(`${this.marqueApiUrl}/${id}/archive`, null, { params });
  }
  activeMarque(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.patch<void>(`${this.marqueApiUrl}/${id}/active`, null, { params });
  }
  importMarques(formData: FormData): Observable<Marque[]> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Marque[]>(`${this.marqueApiUrl}/import`, formData, options);
  }

  // Méthodes pour les catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.categorieApiUrl);
  }

  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.categorieApiUrl}/${id}`);
  }

  getActivesCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.categorieApiUrl}/actives`);
  }
   
  getArchivesCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.categorieApiUrl}/archives`);
  }

  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.categorieApiUrl, categorie);
  }

  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.categorieApiUrl}/${id}`, categorie);
  }

  deleteCategorie(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.delete<void>(`${this.categorieApiUrl}/${id}`, { params });
  }

  archiveCategorie(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.patch<void>(`${this.categorieApiUrl}/${id}/archive`, null, { params });
  }
  activeCategorie(id: number, currentUser: string): Observable<void> {
    const params = new HttpParams().set('currentUser', currentUser);
    return this.http.patch<void>(`${this.categorieApiUrl}/${id}/active`, null, { params });
  }
} 