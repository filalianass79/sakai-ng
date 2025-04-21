import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { ModeleService } from '../../services/modele.service';
import { Image, ImageService  } from '../../../service/image.service';
import { Modele } from '../../models/modele.model';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../../auth/core/models/user.model';
import { CategorieService } from '../../../categorie/services/categorie.service';
import { MarqueService } from '../../../marque/services/marque.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { Categorie } from '../../../categorie/models/categorie.model';
import { Marque } from '../../../marque/models/marque.model';
@Component({
  selector: 'app-modele-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    ToastModule,
    PanelModule,
    CardModule,
    DividerModule,
    DatePickerModule,
    ImageUploadComponent,
    InputMaskModule,
    TooltipModule,
    InputNumberModule,
    CheckboxModule,
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './modele-form.component.html',
  styleUrls: ['./modele-form.component.scss']
})
export class ModeleFormComponent implements OnInit {
  modeleForm!: FormGroup;
  modele: Modele = {} as Modele;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  currentUser: User | null = null;
  

  marques: Marque[] = [];
  categories: Categorie[] = [];
  typeCarburants: any[] = [
      { label: 'Essence', value: 'ESSENCE' },
      { label: 'Diesel', value: 'DIESEL' },
      { label: 'Électrique', value: 'ELECTRIQUE' },
      { label: 'Hybride', value: 'HYBRIDE' }
  ];
  typeTransmissions: any[] = [
      { label: 'MANUELLE', value: 'MANUELLE' },
      { label: 'AUTOMATIQUE', value: 'AUTOMATIQUE' }
  ];

  imageEntityType: string = 'modele';
  imageEntityName: string = 'image';
  currentImage: any;


  constructor(
    private fb: FormBuilder,
    private modeleService: ModeleService,
    private imageService:ImageService,
    private route: ActivatedRoute,
    private router: Router,
    private marqueService: MarqueService,
    private categorieService: CategorieService,
    private messageService: MessageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
   }

  ngOnInit(): void {
    this.initForm();
    this.loadMarques();
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadModele(+id);
    }
    
  }

  initForm(): void {
    this.modeleForm = this.fb.group({
      nom: ['', Validators.required],
      nbreKmVidange: [5000, [Validators.required, Validators.min(0)]],
      nbreJoursVidange: [180, [Validators.required, Validators.min(0)]],
      chaineChangeable: [true],
      nbreKmChaine: [100000, [Validators.required, Validators.min(0)]],
      nbreKmPneus: [50000, [Validators.required, Validators.min(0)]],
      nbrePortes: [4, [Validators.required, Validators.min(2)]],
      nbrePlaces: [5, [Validators.required, Validators.min(2)]],
      nbreSacs: [4, [Validators.required, Validators.min(0)]],
      nbreValises: [2, [Validators.required, Validators.min(0)]],
      volumeCoffre: [500, [Validators.required, Validators.min(0)]],
      typeCarburant: ['DIESEL', Validators.required],
      typeTransmission: ['MANUELLE', Validators.required],
      marque: [null, Validators.required],
      categorie: [null, Validators.required],
     
    });
  }
  loadMarques(): void {
    this.marqueService.getActivesMarques().subscribe({
        next: (data) => {
            this.marques = data;
        },
        error: (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des marques'
            });
        }
    });
}

loadCategories(): void {
    this.categorieService.getActivesCategories().subscribe({
        next: (data) => {
            this.categories = data
        },
        error: (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des catégories'
            });
        }
    });
}

  loadModele(id: number): void {
    this.loading = true;
    this.modeleService.getModeleById(id).subscribe({
      next: (data: Modele) => {
        this.modele = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la modele', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la modele'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.modeleForm.patchValue({
      nom: this.modele.nom,
      marque: this.modele.marque,
      categorie: this.modele.categorie,
      nbreKmVidange: this.modele.nbreKmVidange,
      nbreJoursVidange: this.modele.nbreJoursVidange,
      chaineChangeable: this.modele.chaineChangeable,
      nbreKmChaine: this.modele.nbreKmChaine,
      nbreKmPneus: this.modele.nbreKmPneus,
      nbrePortes: this.modele.nbrePortes,
      nbrePlaces: this.modele.nbrePlaces,
      nbreValises: this.modele.nbreValises,
      nbreSacs: this.modele.nbreSacs,
      typeCarburant: this.modele.typeCarburant,
      typeTransmission: this.modele.typeTransmission,
      volumeCoffre: this.modele.volumeCoffre,
    });
  }

  onSubmit(): void {
    if (this.modeleForm.invalid) {
      this.markFormGroupTouched(this.modeleForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.modeleForm.value;
    
    // Préparer les données de la modele
    const modeleData: Partial<Modele> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.modele && this.modele.id) {
      // Mise à jour d'une modele existante
      this.modeleService.updateModele(this.modele.id, modeleData).subscribe({
        next: (updatedModele: Modele) => {
          this.modele=updatedModele
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Modele mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/modeles/list-modeles']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la modele', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la modele'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle modele
      this.modeleService.createModele(modeleData).subscribe({
        next: (newModele: Modele) => {
          this.modele=newModele
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Modele créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/modeles/list-modeles']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la modele', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la modele'
          });
          this.submitting = false;
        }
      });
    }
  }


    onLogoSelected(file: File | null): void {
      this.logo=file;
    }
    onLogoUploaded(image: Image): void {
      this.uploadedImage = image as any;
    }
    onLogoDeleted(): void {
      this.logo = null;
    }
    

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/modeles/list-modeles']);
  }
  goBack() {
    this.router.navigate(['/dashboard/modeles/list-modeles']);
  }


  uploadImage(): void {
    if (!this.logo) {
        return;
    }
    this.loading = true;
    // Si une image existe déjà, la mettre à jour
    if (this.uploadedImage) {
      this.imageService.updateImage(this.uploadedImage.id, this.logo)
        .subscribe({
          next: (image) => {
            this.uploadedImage = image;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Image mise à jour avec succès'
            });
            
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'image'
            });
            
          }
        });
    } else {
      // Sinon, télécharger une nouvelle image
    this.imageService.uploadImage(this.logo,"modele" , this.modele.id!, "logo")
        .subscribe({
          next: (image) => {
            this.uploadedImage = image;
            this.imageUrl = image.path;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Image téléchargée avec succès'
            });      
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du téléchargement de l\'image'
            });            
          }
        });
    }
  }

} 