import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TopbarWidget } from '../topbarwidget.component';

@Component({
  selector: 'app-location-longue-duree',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    InputTextarea,
    SelectModule,
    DatePickerModule,
    CheckboxModule,
    RadioButtonModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    TopbarWidget
  ],
  providers: [MessageService],
  templateUrl: './location-longue-duree.component.html',
  styleUrls: ['./location-longue-duree.component.scss']
})
export class LocationLongueDureeComponent implements OnInit {
  // Formulaire de demande
  demandeForm: FormGroup;
  
  // Options pour les menus déroulants
  typesEntreprise = [
    { label: 'SARL', value: 'SARL' },
    { label: 'SA', value: 'SA' },
    { label: 'SAS', value: 'SAS' },
    { label: 'EI', value: 'EI' },
    { label: 'EURL', value: 'EURL' },
    { label: 'Autre', value: 'Autre' }
  ];
  
  dureesLocation = [
    { label: '12 mois', value: '12' },
    { label: '24 mois', value: '24' },
    { label: '36 mois', value: '36' },
    { label: '48 mois', value: '48' },
    { label: '60 mois', value: '60' }
  ];
  
  categoriesVehicules = [
    { label: 'Citadine', value: 'citadine' },
    { label: 'Berline', value: 'berline' },
    { label: 'SUV', value: 'suv' },
    { label: 'Break', value: 'break' },
    { label: 'Utilitaire', value: 'utilitaire' }
  ];
  
  nombreVehicules = [
    { label: '1 véhicule', value: '1' },
    { label: '2 véhicules', value: '2' },
    { label: '3 véhicules', value: '3' },
    { label: '4 véhicules', value: '4' },
    { label: '5 véhicules ou plus', value: '5' }
  ];
  
  // Avantages de la location longue durée
  avantages = [
    {
      icon: 'pi pi-wallet',
      titre: 'Coûts maîtrisés',
      description: 'Un budget prévisible avec des mensualités fixes incluant l\'assurance, l\'entretien et l\'assistance.'
    },
    {
      icon: 'pi pi-sync',
      titre: 'Flexibilité',
      description: 'Changez de véhicule facilement selon vos besoins et profitez des dernières innovations technologiques.'
    },
    {
      icon: 'pi pi-chart-line',
      titre: 'Rentabilité',
      description: 'Optimisez votre trésorerie en évitant les investissements importants et les coûts de revente.'
    },
    {
      icon: 'pi pi-shield',
      titre: 'Sérénité',
      description: 'Bénéficiez d\'une prise en charge complète incluant l\'assurance tous risques et l\'assistance 24/7.'
    },
    {
      icon: 'pi pi-cog',
      titre: 'Gestion simplifiée',
      description: 'Plus besoin de gérer l\'entretien, les réparations ou les démarches administratives.'
    },
    {
      icon: 'pi pi-percentage',
      titre: 'Avantages fiscaux',
      description: 'Profitez des avantages fiscaux liés à la location longue durée pour votre entreprise.'
    }
  ];
  
  // Témoignages clients
  temoignages = [
    {
      nom: 'Jean Dupont',
      role: 'Directeur Général',
      entreprise: 'Tech Solutions SARL',
      commentaire: 'La location longue durée nous a permis d\'optimiser notre flotte automobile tout en maîtrisant nos coûts. Le service est impeccable.',
      image: 'assets/images/testimonials/client1.jpg'
    },
    {
      nom: 'Marie Martin',
      role: 'Responsable Administrative',
      entreprise: 'Green Energy SA',
      commentaire: 'Nous avons pu moderniser notre parc de véhicules sans impact sur notre trésorerie. Une solution idéale pour notre croissance.',
      image: 'assets/images/testimonials/client2.jpg'
    },
    {
      nom: 'Pierre Durand',
      role: 'Gérant',
      entreprise: 'Construction Plus EI',
      commentaire: 'La flexibilité et le service client sont exceptionnels. Nous renouvelons notre confiance depuis 3 ans.',
      image: 'assets/images/testimonials/client3.jpg'
    }
  ];
  
  // FAQ
  faqs = [
    {
      question: 'Quelle est la durée minimale de location ?',
      reponse: 'La durée minimale de location est de 12 mois. Nous proposons des contrats de 12, 24, 36, 48 ou 60 mois selon vos besoins.'
    },
    {
      question: 'Quels sont les services inclus dans la location ?',
      reponse: 'La location comprend l\'assurance tous risques, l\'entretien régulier, l\'assistance 24/7, le remplacement en cas de panne et la gestion administrative.'
    },
    {
      question: 'Puis-je changer de véhicule pendant la durée du contrat ?',
      reponse: 'Oui, il est possible de changer de véhicule à la fin de chaque période de location, généralement tous les 12 ou 24 mois selon votre contrat.'
    },
    {
      question: 'Comment se passe la prise en charge en cas de panne ?',
      reponse: 'En cas de panne, notre service d\'assistance 24/7 prend en charge votre véhicule. Un véhicule de remplacement vous est fourni si nécessaire.'
    },
    {
      question: 'Quels sont les avantages fiscaux de la location longue durée ?',
      reponse: 'La location longue durée permet de déduire les loyers de votre résultat fiscal et de récupérer la TVA sur les mensualités.'
    }
  ];
  
  // État du formulaire
  isSubmitting = false;
  formSubmitted = false;
  
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.demandeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+33|0)[1-9](\d{2}){4}$/)]],
      entreprise: ['', [Validators.required, Validators.minLength(2)]],
      typeEntreprise: ['', Validators.required],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],
      nombreVehicules: ['', Validators.required],
      dureeLocation: ['', Validators.required],
      categoriesVehicules: ['', Validators.required],
      dateDebut: ['', Validators.required],
      commentaire: [''],
      accepteContact: [false],
      accepteCGV: [false, Validators.requiredTrue]
    });
  }
  
  ngOnInit(): void {
    // Initialiser la date de début à aujourd'hui
    this.demandeForm.patchValue({
      dateDebut: new Date()
    });

    // Ajouter des écouteurs pour les changements de formulaire
    this.demandeForm.valueChanges.subscribe(() => {
      if (this.formSubmitted) {
        this.formSubmitted = false;
      }
    });
  }
  
  // Soumission du formulaire
  onSubmit(): void {
    if (this.demandeForm.valid) {
      this.isSubmitting = true;
      this.formSubmitted = true;
      
      // Simuler l'envoi du formulaire
      setTimeout(() => {
        console.log('Formulaire soumis:', this.demandeForm.value);
        this.messageService.add({
          severity: 'success',
          summary: 'Demande envoyée',
          detail: 'Votre demande de location longue durée a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.'
        });
        
        // Rediriger vers la page de confirmation
        this.router.navigate(['/confirmation-demande']);
      }, 1500);
    } else {
      this.formSubmitted = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Veuillez corriger les erreurs dans le formulaire avant de le soumettre.'
      });
    }
  }
  
  // Vérification si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.demandeForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.formSubmitted)) : false;
  }
  
  // Obtenir le message d'erreur pour un champ
  getErrorMessage(fieldName: string): string {
    const field = this.demandeForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    
    if (field.hasError('email')) {
      return 'Veuillez entrer une adresse email valide';
    }
    
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Ce champ doit contenir au moins ${minLength} caractères`;
    }
    
    if (field.hasError('pattern')) {
      if (fieldName === 'telephone') {
        return 'Veuillez entrer un numéro de téléphone valide';
      }
      if (fieldName === 'codePostal') {
        return 'Le code postal doit contenir 5 chiffres';
      }
    }
    
    return '';
  }
  
  // Réinitialiser le formulaire
  resetForm(): void {
    this.demandeForm.reset({
      dateDebut: new Date(),
      accepteContact: false,
      accepteCGV: false
    });
    this.formSubmitted = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Formulaire réinitialisé',
      detail: 'Tous les champs ont été réinitialisés.'
    });
  }
  
  // Faire défiler jusqu'au formulaire
  scrollToForm(): void {
    const element = document.getElementById('formulaire');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Faire défiler jusqu'aux avantages
  scrollToAvantages(): void {
    const element = document.getElementById('avantages');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
} 