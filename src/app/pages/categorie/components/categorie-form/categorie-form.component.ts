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
import { CategorieService } from '../../services/categorie.service';
import { Image, ImageService  } from '../../../service/image.service';
import { Categorie } from '../../models/categorie.model';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../../auth/core/models/user.model';
@Component({
  selector: 'app-categorie-form',
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
    FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.scss']
})
export class CategorieFormComponent implements OnInit {
  categorieForm!: FormGroup;
  categorie: Categorie = {} as Categorie;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  currentUser: User | null = null;
  

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private imageService:ImageService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
   }

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCategorie(+id);
    }
    
  }

  initForm(): void {
    this.categorieForm = this.fb.group({
      nom: ['', [Validators.required]],
      exemple: [''],
      libelle: [''],
     
    });
  }

  loadCategorie(id: number): void {
    this.loading = true;
    this.categorieService.getCategorieById(id).subscribe({
      next: (data: Categorie) => {
        this.categorie = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la categorie', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la categorie'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.categorieForm.patchValue({
      nom: this.categorie.nom,
      exemple: this.categorie.exemple,
      libelle: this.categorie.libelle
      
    });
  }

  onSubmit(): void {
    if (this.categorieForm.invalid) {
      this.markFormGroupTouched(this.categorieForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.categorieForm.value;
    
    // Préparer les données de la categorie
    const categorieData: Partial<Categorie> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.categorie && this.categorie.id) {
      // Mise à jour d'une categorie existante
      this.categorieService.updateCategorie(this.categorie.id, categorieData).subscribe({
        next: (updatedCategorie: Categorie) => {
          this.categorie=updatedCategorie
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Categorie mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/categories/list-categories']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la categorie', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la categorie'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle categorie
      this.categorieService.createCategorie(categorieData).subscribe({
        next: (newCategorie: Categorie) => {
          this.categorie=newCategorie
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Categorie créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/categories/list-categories']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la categorie', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la categorie'
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
    this.router.navigate(['/dashboard/categories/list-categories']);
  }
  goBack() {
    this.router.navigate(['/dashboard/categories/list-categories']);
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
    this.imageService.uploadImage(this.logo,"categorie" , this.categorie.id!, "logo")
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