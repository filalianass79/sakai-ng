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
import { CompanyService } from '../../services/company.service';
import { Image, ImageService  } from '../../../service/image.service';
import { Company } from '../../models/company.model';
import { ImageUploadComponent } from '../../../shared/image-upload/image-upload.component';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
@Component({
  selector: 'app-company-form',
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
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  companyForm!: FormGroup;
  company: Company = {} as Company;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  logo:File | null = null;
  
  formesJuridiques = [
    { label: 'SARL', value: 'SARL' },
    { label: 'SA', value: 'SA' },
    { label: 'SAS', value: 'SAS' },
    { label: 'SASU', value: 'SASU' },
    { label: 'Auto-entrepreneur', value: 'AUTO_ENTREPRENEUR' },
    { label: 'Autre', value: 'AUTRE' }
  ];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private imageService:ImageService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCompany(+id);
    }
    
  }

  initForm(): void {
    this.companyForm = this.fb.group({
      raisonSociale: ['', [Validators.required]],
      formeJuridique: ['', [Validators.required]],
      activite: ['', [Validators.required]],
      dateDeCreation: [null],
      idFiscal: [''],
      taxeProfessionnelle: [''],
      registreDeCommerce: [''],
      villeRegistreDeCommerce: [''],
      ice: [''],
      cnss: [''],
      adresse: [''],
      ville: [''],
      fixe: [''],
      fax: [''],
      gsm: [''],
      email: ['', [Validators.email]],
      website: ['']
    });
  }

  loadCompany(id: number): void {
    this.loading = true;
    this.companyService.getCompany(id).subscribe({
      next: (data: Company) => {
        this.company = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la société', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la société'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.companyForm.patchValue({
      raisonSociale: this.company.raisonSociale,
      formeJuridique: this.company.formeJuridique,
      activite: this.company.activite,
      dateDeCreation: this.company.dateDeCreation ? new Date(this.company.dateDeCreation) : null,
      idFiscal: this.company.idFiscal,
      taxeProfessionnelle: this.company.taxeProfessionnelle,
      registreDeCommerce: this.company.registreDeCommerce,
      villeRegistreDeCommerce: this.company.villeRegistreDeCommerce,
      ice: this.company.ice,
      cnss: this.company.cnss,
      adresse: this.company.adresse,
      ville: this.company.ville,
      fixe: this.company.fixe,
      gsm: this.company.gsm,
      email: this.company.email,
      website: this.company.website
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) {
      this.markFormGroupTouched(this.companyForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.companyForm.value;
    
    // Préparer les données de la société
   /* const companyData: Partial<Company> = {
      ...formData,
      logo: this.company.logo,
      entete: this.company.entete,
      pied: this.company.pied
    };*/

    if (this.isEditMode && this.company && this.company.id) {
      // Mise à jour d'une société existante
      this.companyService.updateCompany(this.company.id, formData).subscribe({
        next: (updatedCompany) => {
          this.company=updatedCompany
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Société mise à jour avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/companies/list-companies']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la société', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour la société'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'une nouvelle société
      this.companyService.createCompany(formData).subscribe({
        next: (newCompany) => {
          this.company=newCompany
          this.uploadImage()
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Société créée avec succès'
          });
          this.submitting = false;
          this.router.navigate(['/dashboard/companies/list-companies']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de la société', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer la société'
          });
          this.submitting = false;
        }
      });
    }
  }
/*


  onEnTeteUploaded(image: Image): void {
    this.company.entete = image as any;
  }

  onPiedUploaded(image: Image): void {
    this.company.pied = image as any;
  }

  onLogoUploadError(error: any): void {
    console.error('Erreur lors du téléchargement de l\'image', error);
  }
  onLogoDeleted(): void {
    this.company.logo = undefined;
  }

  onEnTeteUploadError(error: any): void {
    console.error('Erreur lors du téléchargement de l\'image', error);
  }
  onEnTeteDeleted(): void {
    this.company.entete = undefined;
  }   

  onPiedUploadError(error: any): void {
    console.error('Erreur lors du téléchargement de l\'image', error);
  }

 
onEnTeteSelected(file: File | null): void {
      console.log('Image sélectionnée', file);
    } 
    onPiedSelected(file: File | null): void {
      console.log('Image sélectionnée', file);
    }
  onPiedDeleted(): void {
    this.company.pied = undefined;
  }*/

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
    this.router.navigate(['/dashboard/companies/list-companies']);
  }
  goBack() {
    this.router.navigate(['/dashboard/companies/list-companies']);
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
      this.imageService.uploadImage(this.logo,"company" , this.company.id!, "logo")
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