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
import { MarqueService } from '../../services/marque.service';
import { Image, ImageService  } from '../../../service/image.service';
import { Marque } from '../../models/marque.model';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../../auth/core/models/user.model';
@Component({
  selector: 'app-marque-form',
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
  templateUrl: './marque-form.component.html',
  styleUrls: ['./marque-form.component.scss']
})
export class MarqueFormComponent implements OnInit {
  marqueForm!: FormGroup;
  marque: Marque = {} as Marque;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  currentUser: User | null = null;
  

  constructor(
    private fb: FormBuilder,
    private marqueService: MarqueService,
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
      this.loadMarque(+id);
    }
    
  }

  initForm(): void {
    this.marqueForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: [''],
      pays: [''],
     
    });
  }

  loadMarque(id: number): void {
    this.loading = true;
    this.marqueService.getMarqueById(id).subscribe({
      next: (data: Marque) => {
        this.marque = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la marque', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la marque'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.marqueForm.patchValue({
      nom: this.marque.nom,
      description: this.marque.description,
      pays: this.marque.pays
      
    });
  }

  onSubmit(): void {
    if (this.marqueForm.invalid) {
      this.markFormGroupTouched(this.marqueForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.marqueForm.value;
    
    // Préparer les données de la marque
    const marqueData: Partial<Marque> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.marque && this.marque.id) {
      // Mise à jour d'une marque existante
      this.marqueService.updateMarque(this.marque.id, marqueData).subscribe({
        next: (updatedMarque: Marque) => {
          this.marque=updatedMarque
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Marque mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/marques/list-marques']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la marque', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la marque'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle marque
      this.marqueService.createMarque(marqueData).subscribe({
        next: (newMarque: Marque) => {
          this.marque=newMarque
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Marque créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/marques/list-marques']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la marque', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la marque'
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
    this.router.navigate(['/dashboard/marques/list-marques']);
  }
  goBack() {
    this.router.navigate(['/dashboard/marques/list-marques']);
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
    this.imageService.uploadImage(this.logo,"marque" , this.marque.id!, "logo")
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