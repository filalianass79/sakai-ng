import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { StripeService } from '../../services/stripe.service';
import { PAYMENT_PROVIDERS } from '../../services/payment-providers';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputMaskModule,
    ToastModule
  ],
  providers: PAYMENT_PROVIDERS
})
export class CardFormComponent implements OnInit, OnDestroy {
  @Output() cardAdded = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  cardForm: FormGroup;
  loading = false;
  cardElement: any;
  cardErrors: string = '';
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private messageService: MessageService
  ) {
    this.cardForm = this.fb.group({
      cardholderName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      saveCard: [true]
    });
  }

  ngOnInit(): void {
    this.loadStripeScript();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Charge le script Stripe et initialise l'élément de carte
   */
  async loadStripeScript(): Promise<void> {
    try {
      await this.stripeService.loadStripeScript();
      setTimeout(() => this.setupStripeElement(), 100);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger le script Stripe'
      });
      console.error('Erreur lors du chargement du script Stripe', error);
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
   * Soumet le formulaire pour ajouter une carte
   */
  async submitCard(): Promise<void> {
    if (this.cardForm.invalid || !this.cardElement) {
      this.markFormGroupTouched(this.cardForm);
      return;
    }

    this.loading = true;
    try {
      const { paymentMethod, error } = await this.stripeService.createPaymentMethod(
        this.cardElement,
        {
          name: this.cardForm.get('cardholderName')?.value
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // Émettre l'événement avec les informations de la carte
      this.cardAdded.emit({
        id: paymentMethod.id,
        last4: paymentMethod.card?.last4,
        brand: paymentMethod.card?.brand,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        holderName: this.cardForm.get('cardholderName')?.value
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Carte ajoutée avec succès'
      });

      this.loading = false;
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec de l\'ajout de la carte: ' + (error.message || 'Erreur inconnue')
      });
      console.error('Erreur lors de l\'ajout de la carte', error);
      this.loading = false;
    }
  }

  /**
   * Annule l'ajout de carte
   */
  cancel(): void {
    this.cancelled.emit();
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