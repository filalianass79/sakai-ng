import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { AgenceService } from '../../services/agence.service';
import { Agence, AgenceManager } from '../../models/agence.model';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageUploadComponent } from '../../../../shared/image-upload/image-upload.component';
import { Image } from '../../../../service/image.service';
import { ImageService } from '../../../../service/image.service';
import { User } from '../../../../auth/core/models/user.model';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-agence-form',
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
    FileUploadModule,
    TagModule,
    InputSwitchModule,
    InputGroupModule,
    InputGroupAddonModule,
    TextareaModule,
  ],
  providers: [MessageService],
  templateUrl: './agence-form.component.html',
  styleUrls: ['./agence-form.component.scss']
})
export class AgenceFormComponent implements OnInit {
  agenceForm!: FormGroup;
  agence: Agence = {} as Agence;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  currentUser: User | null = null;
  
  imageEntityType: string = 'agence';
  imageEntityName: string = 'image';
  currentImage: any;
  companies: any[] = [];
  managers: AgenceManager[] = [];

  constructor(
    private fb: FormBuilder,
    private agenceService: AgenceService,
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
      this.loadAgence(+id);
      this.loadManagers();
    }
    
  }

  loadManagers(): void {
   /* this.agenceService.getManagers().subscribe({
      next: (data: AgenceManager[]) => {
        this.managers = data;
      }
    });*/
    this.managers = [
      { name: 'John Doe', phone: '1234567890', email: 'john.doe@example.com', photoUrl: 'https://via.placeholder.com/150' },
      { name: 'Jane Smith', phone: '9876543210', email: 'jane.smith@example.com', photoUrl: 'https://via.placeholder.com/150' },
      { name: 'Alice Johnson', phone: '5551234567', email: 'alice.johnson@example.com', photoUrl: 'https://via.placeholder.com/150' }
    ];
  }
  initForm(): void {
    this.agenceForm = this.fb.group({
      nom: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', Validators.required],
      responsable: [''],
      companyId: [''],
      description: [''],
      lettrePrFacturation: [''],
      fixe: ['', Validators.required],
      fax: ['', Validators.required],
      mapUrl: ['', Validators.required],
      iswebagence: [false],
      isappagence: [true],
      isVisible: [true],
      manager: [''],
      hours: [''],
     
    });
  }

  loadAgence(id: number): void {
    this.loading = true;
    this.agenceService.getAgenceById(id).subscribe({
      next: (data: Agence) => {
        this.agence = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la agence', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la agence'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.agenceForm.patchValue({
      nom: this.agence.nom,
      description: this.agence.description,
      adresse: this.agence.adresse,
      email: this.agence.email,
      telephone: this.agence.telephone,
      responsable: this.agence.responsable,
      ville: this.agence.ville,
      companyId: this.agence.companyId, 
      lettrePrFacturation: this.agence.lettrePrFacturation,
      fixe: this.agence.fixe,
      fax: this.agence.fax,
      mapUrl: this.agence.mapUrl,
      iswebagence: this.agence.iswebagence,
      isappagence: this.agence.isappagence,
      isVisible: this.agence.isVisible,
      manager: this.agence.manager,
      hours: this.agence.hours,     
    });
  }

  onSubmit(): void {
    if (this.agenceForm.invalid) {
      this.markFormGroupTouched(this.agenceForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.agenceForm.value;
    
    // Préparer les données de la agence
    const agenceData: Partial<Agence> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.agence && this.agence.id) {
      // Mise à jour d'une agence existante
      this.agenceService.updateAgence(this.agence.id, agenceData).subscribe({
        next: (updatedAgence: Agence) => {
          this.agence=updatedAgence
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Agence mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/parametrageapplication/agences/list-agences']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la agence', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la agence'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle agence
      this.agenceService.createAgence(agenceData).subscribe({
        next: (newAgence: Agence) => {
          this.agence=newAgence
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Agence créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/parametrageapplications/agences/list-agences']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la agence', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la agence'
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
    this.router.navigate(['/dashboard/parametrageapplications/agences/list-agences']);
  }
  goBack() {
    this.router.navigate(['/dashboard/parametrageapplications/agences/list-agences']);
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
    this.imageService.uploadImage(this.logo,"agence" , this.agence.id!, "logo")
        .subscribe({
          next: (image: Image) => {
            this.uploadedImage = image;
            this.imageUrl = image.path;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Image téléchargée avec succès'
            });      
          },
          error: (error: any) => {
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