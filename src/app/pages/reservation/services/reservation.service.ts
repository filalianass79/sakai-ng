import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les réservations
   */
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère une réservation par son ID
   */
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée une nouvelle réservation
   */
  createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/add`, reservation);
  }

  /**
   * Met à jour une réservation existante
   */
  updateReservation(id: number, reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/update/${id}`, reservation);
  }

  /**
   * Supprime une réservation
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * Récupère les réservations par agence de départ
   */
  getReservationsByAgenceDepart(agenceDepart: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-agence-depart/${agenceDepart}`);
  }

  /**
   * Récupère les réservations par agence de retour
   */
  getReservationsByAgenceRetour(agenceRetour: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-agence-retour/${agenceRetour}`);
  }
} 