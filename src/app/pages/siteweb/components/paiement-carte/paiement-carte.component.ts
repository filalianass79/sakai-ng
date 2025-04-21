import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-paiement-carte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    ToastModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './paiement-carte.component.html',
  styleUrls: ['./paiement-carte.component.scss']
})
export class PaiementCarteComponent implements OnInit {
  @Input() montant: number = 0;
  @Output() paiementEffectue = new EventEmitter<any>();
  
  paiementForm!: FormGroup;
  isSubmitting = false;
  activeField: string | null = null;
  
  typesCartes = [
    { label: 'Visa', value: 'VISA', icon: 'pi pi-credit-card' },
    { label: 'Mastercard', value: 'MASTERCARD', icon: 'pi pi-credit-card' },
    { label: 'American Express', value: 'AMEX', icon: 'pi pi-credit-card' }
  ];

  moisExpiration = Array.from({ length: 12 }, (_, i) => {
    const value = (i + 1).toString().padStart(2, '0');
    return { label: value, value: value };
  });

  anneesExpiration = Array.from({ length: 10 }, (_, i) => {
    const annee = new Date().getFullYear() + i;
    return { label: annee.toString(), value: annee.toString() };
  });

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.paiementForm = this.fb.group({
      typeCarte: ['', [Validators.required]],
      numeroCarte: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nomTitulaire: ['', [Validators.required]],
      moisExpiration: ['', [Validators.required]],
      anneeExpiration: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  getCardIcon(cardType: string): string {
    switch(cardType) {
      case 'VISA':
        return 'pi pi-credit-card';
      case 'MASTERCARD':
        return 'pi pi-credit-card';
      case 'AMEX':
        return 'pi pi-credit-card';
      default:
        return 'pi pi-credit-card';
    }
  }

  // Amélioration: sélectionner le type de carte et mettre à jour le formulaire
  selectCardType(type: string): void {
    this.paiementForm.get('typeCarte')?.setValue(type);
    this.paiementForm.get('typeCarte')?.markAsTouched();
    
    // Ajuster le pattern du CVV selon le type de carte
    if (type === 'AMEX') {
      this.paiementForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{4}$/)]);
    } else {
      this.paiementForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
    }
    this.paiementForm.get('cvv')?.updateValueAndValidity();
  }

  // Amélioration: détecter automatiquement le type de carte
  detectCardType(cardNumber: string): string | null {
    // Visa commence par 4
    if (/^4/.test(cardNumber)) {
      return 'VISA';
    }
    // Mastercard commence par 51-55 ou séries 2221-2720
    else if (/^5[1-5]/.test(cardNumber) || /^2[2-7][0-9]{2}/.test(cardNumber)) {
      return 'MASTERCARD';
    }
    // American Express commence par 34 ou 37
    else if (/^3[47]/.test(cardNumber)) {
      return 'AMEX';
    }
    return null;
  }

  // Amélioration: formater le numéro de carte pour l'aperçu
  formatPreviewCardNumber(cardNumber: string): string {
    if (!cardNumber) return 'XXXX XXXX XXXX XXXX';
    
    // Nettoyer le numéro (supprimer les espaces)
    let cleanNumber = cardNumber.replace(/\s/g, '');
    
    // Formater selon le type de carte
    if (this.paiementForm.get('typeCarte')?.value === 'AMEX') {
      // Format AMEX: XXXX XXXXXX XXXXX
      const parts = [
        cleanNumber.substring(0, 4),
        cleanNumber.substring(4, 10),
        cleanNumber.substring(10, 15)
      ];
      return parts.map(part => part.padEnd(part.length === 4 ? 4 : part.length === 6 ? 6 : 5, 'X')).join(' ');
    } else {
      // Format standard: XXXX XXXX XXXX XXXX
      const parts = [];
      for (let i = 0; i < 16; i += 4) {
        parts.push(cleanNumber.substring(i, i + 4).padEnd(4, 'X'));
      }
      return parts.join(' ');
    }
  }

  // Amélioration: suivi du champ actif pour améliorer UX
  focusField(field: string): void {
    this.activeField = field;
  }

  // Amélioration: effacer le contenu d'un champ
  clearField(field: string): void {
    this.paiementForm.get(field)?.setValue('');
    this.paiementForm.get(field)?.markAsUntouched();
    // Remettre le focus sur le champ après l'avoir effacé
    setTimeout(() => {
      this.focusInput(field);
    }, 0);
  }

  onSubmit(): void {
    if (this.paiementForm.valid) {
      this.isSubmitting = true;
      
      // Simulation d'un paiement (à remplacer par un vrai appel API)
      setTimeout(() => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Paiement accepté',
          detail: `Votre paiement de ${this.montant.toFixed(2)}€ a été effectué avec succès`
        });
        
        this.paiementEffectue.emit({
          montant: this.montant,
          methode: 'carte',
          details: {
            typeCarte: this.paiementForm.value.typeCarte,
            numeroCarte: this.maskCardNumber(this.paiementForm.value.numeroCarte),
            date: `${this.paiementForm.value.moisExpiration}/${this.paiementForm.value.anneeExpiration}`
          },
          dateTransaction: new Date()
        });
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez vérifier les informations de votre carte bancaire'
      });
      this.markFormGroupTouched(this.paiementForm);
    }
  }

  focusInput(inputId: string): void {
    const element = document.getElementById(inputId);
    if (element) {
      element.focus();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private maskCardNumber(cardNumber: string): string {
    // Masquer les chiffres de la carte sauf les 4 derniers
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  }

  // Format d'affichage du numéro de carte avec espaces tous les 4 chiffres
  formatCardNumber(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    
    if (value.length > 16) {
      value = value.substr(0, 16);
    }
    
    // Ajouter des espaces tous les 4 chiffres
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.substring(i, i + 4));
    }
    
    // Mise à jour du champ et détection automatique du type de carte
    input.value = parts.join(' ');
    
    // Détection automatique du type de carte basé sur les 4-6 premiers chiffres
    const detectedType = this.detectCardType(value);
    if (detectedType && !this.paiementForm.get('typeCarte')?.value) {
      this.selectCardType(detectedType);
    }
  }

  // Extraction des chiffres uniquement pour la validation
  get cleanCardNumber(): string {
    return this.paiementForm.get('numeroCarte')?.value?.replace(/\s/g, '') || '';
  }
  
  // Retour à la page précédente
  goBack(): void {
    window.history.back();
  }
}
