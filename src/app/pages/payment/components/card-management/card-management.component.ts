import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CardFormComponent } from '../card-form/card-form.component';
import { PAYMENT_PROVIDERS } from '../../services/payment-providers';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  holderName: string;
}

@Component({
  selector: 'app-card-management',
  templateUrl: './card-management.component.html',
  styleUrls: ['./card-management.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ToastModule,
    TableModule,
    CardFormComponent
  ],
  providers: PAYMENT_PROVIDERS
})
export class CardManagementComponent implements OnInit {
  savedCards: SavedCard[] = [];
  showCardForm: boolean = false;
  
  constructor(private messageService: MessageService) {}
  
  ngOnInit(): void {
    // Simuler des cartes déjà enregistrées
    this.savedCards = [
      {
        id: 'pm_123456789',
        last4: '4242',
        brand: 'visa',
        expMonth: 12,
        expYear: 25,
        holderName: 'John Doe'
      },
      {
        id: 'pm_987654321',
        last4: '1234',
        brand: 'mastercard',
        expMonth: 10,
        expYear: 24,
        holderName: 'Jane Smith'
      }
    ];
  }
  
  addNewCard(): void {
    this.showCardForm = true;
  }
  
  onCardAdded(card: SavedCard): void {
    this.savedCards.push(card);
    this.showCardForm = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Carte ajoutée',
      detail: `Carte ${card.brand} se terminant par ${card.last4} ajoutée avec succès`
    });
  }
  
  onCardFormCancelled(): void {
    this.showCardForm = false;
  }
  
  deleteCard(card: SavedCard): void {
    this.savedCards = this.savedCards.filter(c => c.id !== card.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Carte supprimée',
      detail: `Carte ${card.brand} se terminant par ${card.last4} supprimée`
    });
  }
  
  setDefaultCard(card: SavedCard): void {
    // Simuler la définition d'une carte par défaut
    this.messageService.add({
      severity: 'success',
      summary: 'Carte par défaut',
      detail: `Carte ${card.brand} se terminant par ${card.last4} définie comme carte par défaut`
    });
  }
  
  getCardIcon(brand: string): string {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'pi pi-credit-card';
      case 'mastercard':
        return 'pi pi-credit-card';
      case 'amex':
        return 'pi pi-credit-card';
      default:
        return 'pi pi-credit-card';
    }
  }
  
  formatExpiry(month: number, year: number): string {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  }
} 