import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare let paypal: any;

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private paypalInstance: any;

  constructor() { }

  /**
   * Charge le script PayPal SDK
   * @returns Promise qui se résout lorsque le script est chargé
   */
  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof paypal !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=EUR`;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Initialise les boutons PayPal dans un conteneur spécifié
   * @param containerId L'ID du conteneur où afficher les boutons PayPal
   * @param amount Le montant à payer
   * @param onApprove Fonction appelée lorsque le paiement est approuvé
   * @param onCancel Fonction appelée lorsque le paiement est annulé
   * @param onError Fonction appelée en cas d'erreur
   * @returns L'instance des boutons PayPal
   */
  initializePaypalButtons(
    containerId: string,
    amount: number,
    onApprove: (data: any) => void,
    onCancel?: () => void,
    onError?: (err: any) => void
  ): any {
    if (typeof paypal === 'undefined') {
      throw new Error('PayPal SDK n\'est pas chargé');
    }

    return paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: 'EUR'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          onApprove({
            orderId: data.orderID,
            payerId: data.payerID,
            details: details
          });
        });
      },
      onCancel: () => {
        if (onCancel) {
          onCancel();
        }
      },
      onError: (err: any) => {
        if (onError) {
          onError(err);
        }
      }
    }).render(`#${containerId}`);
  }

  /**
   * Vérifie si un paiement PayPal est valide
   * @param orderId L'ID de la commande PayPal
   * @param amount Le montant attendu
   * @returns Promise qui se résout avec un booléen indiquant si le paiement est valide
   */
  validatePayment(orderId: string, amount: number): Promise<boolean> {
    // Cette méthode serait normalement implémentée côté serveur
    // pour des raisons de sécurité
    console.warn('La validation du paiement PayPal devrait être effectuée côté serveur');
    return Promise.resolve(true);
  }
} 