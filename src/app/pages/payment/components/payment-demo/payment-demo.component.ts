import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { Transaction } from '../../models/transaction.model';
import { PAYMENT_PROVIDERS } from '../../services/payment-providers';

@Component({
  selector: 'app-payment-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputNumberModule,
    InputTextModule,
    ToastModule,
    PaymentFormComponent
  ],
  templateUrl: './payment-demo.component.html',
  styleUrls: ['./payment-demo.component.scss'],
  providers: PAYMENT_PROVIDERS
})
export class PaymentDemoComponent {
  amount: number = 100;
  currency: string = 'EUR';
  entityType: string = 'SUBSCRIPTION';
  entityId: string = '1';
  showPaymentForm: boolean = false;
  lastTransaction: Transaction | null = null;

  constructor(private messageService: MessageService) {}

  startPayment(): void {
    if (this.amount <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Le montant doit être supérieur à 0'
      });
      return;
    }

    this.showPaymentForm = true;
  }

  onPaymentComplete(transaction: Transaction): void {
    this.lastTransaction = transaction;
    this.showPaymentForm = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Paiement réussi',
      detail: `Transaction ${transaction.id} complétée avec succès`
    });
  }

  onPaymentCancelled(): void {
    this.showPaymentForm = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Paiement annulé',
      detail: 'Le processus de paiement a été annulé'
    });
  }

  resetDemo(): void {
    this.amount = 100;
    this.currency = 'EUR';
    this.entityType = 'SUBSCRIPTION';
    this.entityId = '1';
    this.showPaymentForm = false;
    this.lastTransaction = null;
  }
} 