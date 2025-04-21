import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule, Modele, Marque, Categorie } from '../../models/vehicule.model';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { InputTextarea } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-vehicule-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    PanelModule,
    CardModule,
    DividerModule,
    CalendarModule,
    InputMaskModule,
    InputNumberModule,
    TabViewModule,
    InputTextarea,
    CheckboxModule,
    SelectButtonModule,
    TooltipModule,
    FileUploadModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './vehicule-form.component.html',
  styleUrls: ['./vehicule-form.component.scss']
})
export class VehiculeFormComponent implements OnInit {
  vehiculeForm!: FormGroup;
  vehicule: Vehicule = {} as Vehicule;
  isEditMode = false;
  loading = false;
  submitting = false;
  
  modeles: Modele[] = [];
  marques: Marque[] = [];
  categories: Categorie[] = [];
  
  carburants = [
    { label: 'Essence', value: 'ESSENCE' },
    { label: 'Diesel', value: 'DIESEL' },
    { label: 'Hybride', value: 'HYBRIDE' },
    { label: 'Électrique', value: 'ELECTRIQUE' },
    { label: 'GPL', value: 'GPL' }
  ];
  
  transmissions = [
    { label: 'MANUELLE', value: 'MANUELLE' },
    { label: 'AUTOMATIQUE', value: 'AUTOMATIQUE' },
    { label: 'Semi-AUTOMATIQUE', value: 'SEMI_AUTOMATIQUE' }
  ];
  
  venduOptions = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ];
  
  provisoireOptions = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ];
  
  // Variables pour les fichiers
  photo1File: File | null = null;
  photo2File: File | null = null;
  photo3File: File | null = null;
  photo4File: File | null = null;
  carteGriseRFile: File | null = null;
  carteGriseVFile: File | null = null;
  factureFile: File | null = null;
  autorisationFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadReferenceData();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadVehicule(+id);
    }
  }

  initForm(): void {
    this.vehiculeForm = this.fb.group({
      // Informations de base
      ww: ['', [Validators.required]],
      immatriculation: ['', [Validators.required]],
      chassis: ['', [Validators.required]],
      puissanceFiscal: [0, [Validators.required, Validators.min(0)]],
      puissance: [0, [Validators.required, Validators.min(0)]],
      couleur: ['', [Validators.required]],
      nombrePlace: [0, [Validators.required, Validators.min(1)]],
      kilometrageInitial: [0, [Validators.required, Validators.min(0)]],
      tansmission: ['', [Validators.required]],
      carburant: ['', [Validators.required]],
      provisoire: [false],
      dateExpirationCarteGrise: [null],
      dateAcquisition: [null],
      financement: [''],
      dateMiseEnCirculation: [null],
      
      // Relations
      modeleId: [null, [Validators.required]],
      
      // Autres informations
      observations: [''],
      vendu: [false],
      etatActuel: [''],
      kilometrageVidange: [0],
      dateVidange: [null],
      kilometragePneu1: [0],
      kilometrageChaine: [0],
      dateProchaineassurance: [null],
      dateProchainevisite: [null],
      dateProchainevignette: [null],
      
      // Métadonnées
      creerPar: ['admin'] // À remplacer par l'ID de l'utilisateur connecté
    });
  }

  loadReferenceData(): void {
    // Charger les marques
    this.vehiculeService.getActivesMarques().subscribe({
      next: (data) => {
        this.marques = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des marques', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les marques'
        });
      }
    });

    // Charger les catégories
    this.vehiculeService.getActivesCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les catégories'
        });
      }
    });

    // Charger les modèles
    this.vehiculeService.getVisibleModeles().subscribe({
      next: (data) => {
        this.modeles = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modèles', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les modèles'
        });
      }
    });
  }

  loadModelesByMarque(marqueId: number): void {
    this.vehiculeService.getModelesByMarque(marqueId).subscribe({
      next: (data) => {
        this.modeles = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modèles par marque', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les modèles pour cette marque'
        });
      }
    });
  }

  loadVehicule(id: number): void {
    this.loading = true;
    this.vehiculeService.getVehiculeById(id).subscribe({
      next: (data: Vehicule) => {
        this.vehicule = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du véhicule', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails du véhicule'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.vehiculeForm.patchValue({
      ww: this.vehicule.ww,
      immatriculation: this.vehicule.immatriculation,
      chassis: this.vehicule.chassis,
      puissanceFiscal: this.vehicule.puissanceFiscal,
      puissance: this.vehicule.puissance,
      couleur: this.vehicule.couleur,
      nombrePlace: this.vehicule.nombrePlace,
      kilometrageInitial: this.vehicule.kilometrageInitial,
      tansmission: this.vehicule.tansmission,
      carburant: this.vehicule.carburant,
      provisoire: this.vehicule.provisoire,
      dateExpirationCarteGrise: this.vehicule.dateExpirationCarteGrise ? new Date(this.vehicule.dateExpirationCarteGrise) : null,
      dateAcquisition: this.vehicule.dateAcquisition ? new Date(this.vehicule.dateAcquisition) : null,
      financement: this.vehicule.financement,
      dateMiseEnCirculation: this.vehicule.dateMiseEnCirculation ? new Date(this.vehicule.dateMiseEnCirculation) : null,
      modeleId: this.vehicule.modeleId,
      observations: this.vehicule.observations,
      vendu: this.vehicule.vendu,
      etatActuel: this.vehicule.etatActuel,
      kilometrageVidange: this.vehicule.kilometrageVidange,
      dateVidange: this.vehicule.dateVidange ? new Date(this.vehicule.dateVidange) : null,
      kilometragePneu1: this.vehicule.kilometragePneu1,
      kilometrageChaine: this.vehicule.kilometrageChaine,
      dateProchaineassurance: this.vehicule.dateProchaineassurance ? new Date(this.vehicule.dateProchaineassurance) : null,
      dateProchainevisite: this.vehicule.dateProchainevisite ? new Date(this.vehicule.dateProchainevisite) : null,
      dateProchainevignette: this.vehicule.dateProchainevignette ? new Date(this.vehicule.dateProchainevignette) : null,
      creerPar: this.vehicule.creerPar || 'admin'
    });
  }

  onSubmit(): void {
    if (this.vehiculeForm.invalid) {
      this.markFormGroupTouched(this.vehiculeForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    
    // Préparation des données pour l'API (FormData pour les fichiers)
    const formData = new FormData();
    const formValue = this.vehiculeForm.value;
    
    // Ajout des champs du formulaire
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (formValue[key] instanceof Date) {
          formData.append(key, formValue[key].toISOString());
        } else {
          formData.append(key, formValue[key]);
        }
      }
    });
    
    // Ajout des fichiers
    if (this.photo1File) formData.append('photo1', this.photo1File);
    if (this.photo2File) formData.append('photo2', this.photo2File);
    if (this.photo3File) formData.append('photo3', this.photo3File);
    if (this.photo4File) formData.append('photo4', this.photo4File);
    if (this.carteGriseRFile) formData.append('carteGriseR', this.carteGriseRFile);
    if (this.carteGriseVFile) formData.append('carteGriseV', this.carteGriseVFile);
    if (this.factureFile) formData.append('facture', this.factureFile);
    if (this.autorisationFile) formData.append('autorisation', this.autorisationFile);

    if (this.isEditMode && this.vehicule && this.vehicule.id) {
      // Mise à jour d'un véhicule existant
      this.vehiculeService.updateVehicule(this.vehicule.id, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Véhicule mis à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/vehicules/list-vehicules']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du véhicule', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le véhicule'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'un nouveau véhicule
      this.vehiculeService.createVehicule(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Véhicule créé avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/vehicules/list-vehicules']);
        },
        error: (error) => {
          console.error('Erreur lors de la création du véhicule', error);
          
          // Message d'erreur spécifique en cas de conflit
          if (error.status === 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Un véhicule avec la même immatriculation ou le même numéro de châssis existe déjà'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Impossible de créer le véhicule'
            });
          }
          
          this.submitting = false;
        }
      });
    }
  }

  // Méthodes pour gérer les fichiers
  onPhoto1Selected(event: any): void {
    this.photo1File = event.files[0];
  }

  onPhoto2Selected(event: any): void {
    this.photo2File = event.files[0];
  }

  onPhoto3Selected(event: any): void {
    this.photo3File = event.files[0];
  }

  onPhoto4Selected(event: any): void {
    this.photo4File = event.files[0];
  }

  onCarteGriseRSelected(event: any): void {
    this.carteGriseRFile = event.files[0];
  }

  onCarteGriseVSelected(event: any): void {
    this.carteGriseVFile = event.files[0];
  }

  onFactureSelected(event: any): void {
    this.factureFile = event.files[0];
  }

  onAutorisationSelected(event: any): void {
    this.autorisationFile = event.files[0];
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/vehicules/list-vehicules']);
  }

  goBack() {
    this.router.navigate(['/dashboard/vehicules/list-vehicules']);
  }
} 