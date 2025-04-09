import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  Transaction, 
  PaymentInitRequest, 
  PaymentProcessRequest 
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) { }

  /**
   * Initialise une transaction de paiement
   * @param data Les données de la transaction
   * @returns Observable avec les informations de la transaction initialisée
   */
  initializePayment(data: PaymentInitRequest): Observable<Transaction> {
    const options = {
      withCredentials: true
    };
    return this.http.post<Transaction>(`${this.apiUrl}/initialize`, data, options);
  }

  /**
   * Traite une transaction de paiement
   * @param token Le token de paiement (Stripe, PayPal, etc.)
   * @param transactionId L'ID de la transaction
   * @returns Observable avec les informations de la transaction traitée
   */
  processPayment(token: string, transactionId: string): Observable<Transaction> {
    const options = {
      withCredentials: true
    };
    const data: PaymentProcessRequest = {
      paymentToken: token,
      transactionId
    };
    return this.http.post<Transaction>(`${this.apiUrl}/process`, data, options);
  }

  /**
   * Récupère le statut d'une transaction
   * @param id L'ID de la transaction
   * @returns Observable avec les informations de la transaction
   */
  getTransactionStatus(id: string): Observable<Transaction> {
    const options = {
      withCredentials: true
    };
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Annule une transaction
   * @param id L'ID de la transaction
   * @returns Observable avec le résultat de l'annulation
   */
  cancelTransaction(id: string): Observable<void> {
    const options = {
      withCredentials: true
    };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }
} 