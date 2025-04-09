import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { StripeService } from '../../services/stripe.service';
import { PaypalService } from '../../services/paypal.service';
import { PaymentMethod, Transaction, PaymentInitRequest } from '../../models/transaction.model';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PAYMENT_PROVIDERS } from '../../services/payment-providers';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectButtonModule
  ],
  providers: PAYMENT_PROVIDERS
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  @Input() amount: number = 0;
  @Input() currency: string = 'EUR';
  @Input() entityType: string = '';
  @Input() entityId: string = '';
  @Output() paymentComplete = new EventEmitter<Transaction>();
  @Output() paymentCancelled = new EventEmitter<void>();

  paymentForm: FormGroup;
  paymentMethods = PaymentMethod;
  selectedPaymentMethod: PaymentMethod = PaymentMethod.STRIPE;
  loading = false;
  transaction: Transaction | null = null;
  
  // Stripe specific
  cardElement: any;
  cardErrors: string = '';
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private stripeService: StripeService,
    private paypalService: PaypalService,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: [PaymentMethod.STRIPE, Validators.required],
      cardholderName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Charger les scripts de paiement
    this.loadPaymentScripts();
    
    // S'abonner aux changements de méthode de paiement
    const subscription = this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method) {
        this.selectedPaymentMethod = method;
        if (method === PaymentMethod.STRIPE) {
          setTimeout(() => this.setupStripeElement(), 100);
        }
      }
    });
    
    if (subscription) {
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    // Désabonner de toutes les souscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Charge les scripts nécessaires pour les différentes méthodes de paiement
   */
  async loadPaymentScripts(): Promise<void> {
    try {
      await this.stripeService.loadStripeScript();
      await this.paypalService.loadPaypalScript();
      
      // Initialiser l'élément de carte Stripe par défaut
      setTimeout(() => this.setupStripeElement(), 100);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les scripts de paiement'
      });
      console.error('Erreur lors du chargement des scripts de paiement', error);
    }
  }

  /**
   * Configure l'élément de carte Stripe
   */
  setupStripeElement(): void {
    try {
      const cardContainer = document.getElementById('card-element');
      if (cardContainer) {
        this.cardElement = this.stripeService.createCardElement('card-element');
        this.cardElement.on('change', (event: any) => {
          this.cardErrors = event.error ? event.error.message : '';
        });
      }
    } catch (error) {
      console.error('Erreur lors de la configuration de l\'élément de carte Stripe', error);
    }
  }

  /**
   * Configure les boutons PayPal
   */
  setupPaypalButtons(): void {
    try {
      const paypalContainer = document.getElementById('paypal-button-container');
      if (paypalContainer && this.amount > 0) {
        this.paypalService.initializePaypalButtons(
          'paypal-button-container',
          this.amount,
          (data) => this.handlePaypalApproval(data),
          () => this.handlePaypalCancel(),
          (error) => this.handlePaypalError(error)
        );
      }
    } catch (error) {
      console.error('Erreur lors de la configuration des boutons PayPal', error);
    }
  }

  /**
   * Initialise une transaction de paiement
   */
  initializePayment(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    this.loading = true;
    const paymentRequest: PaymentInitRequest = {
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.selectedPaymentMethod,
      entityType: this.entityType,
      entityId: this.entityId
    };

    this.paymentService.initializePayment(paymentRequest).subscribe({
      next: (transaction) => {
        this.transaction = transaction;
        
        if (this.selectedPaymentMethod === PaymentMethod.PAYPAL) {
          setTimeout(() => this.setupPaypalButtons(), 100);
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d\'initialiser le paiement'
        });
        console.error('Erreur lors de l\'initialisation du paiement', error);
        this.loading = false;
      }
    });
  }

  /**
   * Traite le paiement par carte avec Stripe
   */
  async processStripePayment(): Promise<void> {
    if (!this.transaction || !this.cardElement) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Informations de paiement incomplètes'
      });
      return;
    }

    this.loading = true;
    try {
      const { paymentMethod, error } = await this.stripeService.createPaymentMethod(
        this.cardElement,
        {
          name: this.paymentForm.get('cardholderName')?.value,
          email: this.paymentForm.get('email')?.value
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      this.paymentService.processPayment(paymentMethod.id, this.transaction.id).subscribe({
        next: (transaction) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Paiement effectué avec succès'
          });
          this.paymentComplete.emit(transaction);
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Échec du paiement: ' + (error.message || 'Erreur inconnue')
          });
          console.error('Erreur lors du traitement du paiement Stripe', error);
          this.loading = false;
        }
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec du paiement: ' + (error.message || 'Erreur inconnue')
      });
      console.error('Erreur lors du traitement du paiement Stripe', error);
      this.loading = false;
    }
  }

  /**
   * Gère l'approbation d'un paiement PayPal
   */
  handlePaypalApproval(data: any): void {
    if (!this.transaction) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Transaction non initialisée'
      });
      return;
    }

    this.loading = true;
    this.paymentService.processPayment(data.orderId, this.transaction.id).subscribe({
      next: (transaction) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Paiement PayPal effectué avec succès'
        });
        this.paymentComplete.emit(transaction);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du paiement PayPal: ' + (error.message || 'Erreur inconnue')
        });
        console.error('Erreur lors du traitement du paiement PayPal', error);
        this.loading = false;
      }
    });
  }

  /**
   * Gère l'annulation d'un paiement PayPal
   */
  handlePaypalCancel(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Paiement PayPal annulé'
    });
    this.paymentCancelled.emit();
  }

  /**
   * Gère les erreurs de paiement PayPal
   */
  handlePaypalError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur PayPal: ' + (error.message || 'Erreur inconnue')
    });
    console.error('Erreur PayPal', error);
  }

  /**
   * Annule la transaction en cours
   */
  cancelPayment(): void {
    if (this.transaction) {
      this.loading = true;
      this.paymentService.cancelTransaction(this.transaction.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Paiement annulé'
          });
          this.transaction = null;
          this.paymentCancelled.emit();
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible d\'annuler le paiement'
          });
          console.error('Erreur lors de l\'annulation du paiement', error);
          this.loading = false;
        }
      });
    } else {
      this.paymentCancelled.emit();
    }
  }

  /**
   * Marque tous les champs d'un formulaire comme touchés
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 