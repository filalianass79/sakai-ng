import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

declare var Stripe: any;

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripe: any;
  private elements: any;

  constructor() {
    // Initialisation de Stripe avec la clé publique
    if (typeof Stripe !== 'undefined') {
      this.stripe = Stripe(environment.stripePublicKey);
    }
  }

  /**
   * Charge le script Stripe.js si nécessaire
   * @returns Promise qui se résout lorsque le script est chargé
   */
  loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof Stripe !== 'undefined') {
        this.stripe = Stripe(environment.stripePublicKey);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        this.stripe = Stripe(environment.stripePublicKey);
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Crée un élément de carte Stripe
   * @param elementId L'ID de l'élément DOM où monter l'élément de carte
   * @returns L'élément de carte créé
   */
  createCardElement(elementId: string): any {
    if (!this.stripe) {
      throw new Error('Stripe n\'est pas initialisé');
    }

    this.elements = this.stripe.elements();
    const cardElement = this.elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });

    cardElement.mount(`#${elementId}`);
    return cardElement;
  }

  /**
   * Crée un token à partir d'un élément de carte
   * @param cardElement L'élément de carte
   * @returns Promise avec le résultat de la création du token
   */
  createToken(cardElement: any): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe n\'est pas initialisé');
    }

    return this.stripe.createToken(cardElement);
  }

  /**
   * Crée une méthode de paiement à partir d'un élément de carte
   * @param cardElement L'élément de carte
   * @param billingDetails Les détails de facturation
   * @returns Promise avec le résultat de la création de la méthode de paiement
   */
  createPaymentMethod(cardElement: any, billingDetails: any = {}): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe n\'est pas initialisé');
    }

    return this.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails
    });
  }

  /**
   * Confirme un paiement avec l'API Stripe
   * @param clientSecret Le secret client de l'intention de paiement
   * @param cardElement L'élément de carte
   * @param billingDetails Les détails de facturation
   * @returns Promise avec le résultat de la confirmation du paiement
   */
  confirmCardPayment(clientSecret: string, cardElement: any, billingDetails: any = {}): Promise<any> {
    if (!this.stripe) {
      throw new Error('Stripe n\'est pas initialisé');
    }

    return this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails
      }
    });
  }
} 