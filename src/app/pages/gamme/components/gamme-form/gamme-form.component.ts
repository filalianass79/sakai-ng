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
import { GammeService } from '../../services/gamme.service';
import { Image, ImageService  } from '../../../service/image.service';
import { Gamme } from '../../models/gamme.model';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { User } from '../../../auth/core/models/user.model';
@Component({
  selector: 'app-gamme-form',
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
  templateUrl: './gamme-form.component.html',
  styleUrls: ['./gamme-form.component.scss']
})
export class GammeFormComponent implements OnInit {
  gammeForm!: FormGroup;
  gamme: Gamme = {} as Gamme;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  currentUser: User | null = null;
  

  constructor(
    private fb: FormBuilder,
    private gammeService: GammeService,
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
      this.loadGamme(+id);
    }
    
  }

  initForm(): void {
    this.gammeForm = this.fb.group({
      nom: ['', [Validators.required]],
     
    });
  }

  loadGamme(id: number): void {
    this.loading = true;
    this.gammeService.getGammeById(id).subscribe({
      next: (data: Gamme) => {
        this.gamme = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la gamme', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la gamme'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.gammeForm.patchValue({
      nom: this.gamme.nom,
      
    });
  }

  onSubmit(): void {
    if (this.gammeForm.invalid) {
      this.markFormGroupTouched(this.gammeForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.gammeForm.value;
    
    // Préparer les données de la gamme
    const gammeData: Partial<Gamme> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.gamme && this.gamme.id) {
      // Mise à jour d'une gamme existante
      this.gammeService.updateGamme(this.gamme.id, gammeData).subscribe({
        next: (updatedGamme: Gamme) => {
          this.gamme=updatedGamme
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Gamme mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/gammes/list-gammes']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la gamme', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la gamme'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle gamme
      this.gammeService.createGamme(gammeData).subscribe({
        next: (newGamme: Gamme) => {
          this.gamme=newGamme
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Gamme créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/gammes/list-gammes']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la gamme', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la gamme'
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
    this.router.navigate(['/dashboard/gammes/list-gammes']);
  }
  goBack() {
    this.router.navigate(['/dashboard/gammes/list-gammes']);
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
    this.imageService.uploadImage(this.logo,"gamme" , this.gamme.id!, "logo")
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