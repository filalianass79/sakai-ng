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
import { SalarieService } from '../../services/salarie.service';
import { Agence, Company, Salarie } from '../../models/salarie.model';
import { PanelModule } from 'primeng/panel';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageUploadComponent } from '../../../../shared/image-upload/image-upload.component';
import { User } from '../../../../auth/core/models/user.model';
import { Image, ImageService } from '../../../../service/image.service';
import { SituationFamiliale } from '../../models/enum/situation-familiale.enum';
import { FonctionSalarie } from '../../models/enum/fonction-salarie.enum';
import { QualiteSalarie } from '../../models/enum/qualite-salarie.enum';
import { TypeContrat } from '../../models/enum/type-contrat.enum';
import { AgenceService } from '../../../agence/services/agence.service';
import { CompanyService } from '../../../../company/services/company.service';
import { SelectItem } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';  
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { Pdf, PdfService } from '../../../../service/pdf.service';
import { PdfUploadComponent } from '../../../../shared/pdf-upload/pdf-upload.component';
import { TabsModule } from 'primeng/tabs';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-salarie-form',
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
    TextareaModule,
    DatePickerModule,
    ImageUploadComponent,
    PdfUploadComponent,
    InputMaskModule,
    FloatLabelModule,
    AvatarModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    InputNumberModule,
    DatePickerModule,
    TabsModule,
    CheckboxModule,
    FileUploadModule,
    TableModule,
    DialogModule,
    DropdownModule,
    PdfViewerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './salarie-form.component.html',
  styleUrls: ['./salarie-form.component.scss']
})
export class SalarieFormComponent implements OnInit {
  salarieForm!: FormGroup;
  salarie: Salarie = {} as Salarie;
  isEditMode = false;
  loading = false;
  submitting = false;
  uploadedImage: Image | null = null;
  imageUrl: string | null = null;
  
  photo:File | null = null;
  cv:File | null = null;
  contrat:File | null = null;
  diplome:File | null = null;
  permisR:File | null = null;
  permisV:File | null = null;
  carteNationaleR:File | null = null;
  carteNationaleV:File | null = null;

  uploadedPdf: Pdf | null = null;



  
  pdfUrl: string | null = null;

  uploadedPdfCv: Pdf | null = null;
  pdfUrlCv: string | null = null;

  uploadedPdfContrat: Pdf | null = null;
  pdfUrlContrat: string | null = null;

  uploadedPdfDiplome: Pdf | null = null;
  pdfUrlDiplome: string | null = null;

  uploadedPdfPermisR: Pdf | null = null;
  pdfUrlPermisR: string | null = null;

  uploadedPdfPermisV: Pdf | null = null;
  pdfUrlPermisV: string | null = null;

  uploadedPdfCarteNationaleR: Pdf | null = null;
  pdfUrlCarteNationale: string | null = null;

  uploadedPdfCarteNationaleV: Pdf | null = null;
  pdfUrlCarteNationaleV: string | null = null;


  currentUser: User | null = null;
  

  agences: Agence[] = [];
  companys: Company[] = [];
  situationFamiliales: SelectItem[] = [];
  fonctions : SelectItem[] = [];
  qualites : SelectItem[] = [];
  typeContrats: SelectItem[] = [];

  // Propriétés pour les documents de paie
  documents: any[] = [];
  documentDialog: boolean = false;
  previewDialog: boolean = false;
  isEditDocument: boolean = false;
  selectedDocument: any = {};
  previewUrl: string | null = null;
  selectedDocumentFile: File | null = null;



  constructor(
    private fb: FormBuilder,
    private salarieService: SalarieService,
    private imageService:ImageService,
    private route: ActivatedRoute,
    private router: Router,
    private agenceService: AgenceService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private pdfService: PdfService,
    private confirmationService: ConfirmationService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
   }

  ngOnInit(): void {
    this.initForm();
    this.loadAgences();
    this.loadCompanys();
    this.situationFamiliales = Object.values(SituationFamiliale).map(val => ({ label: val, value: val }));
    this.typeContrats = Object.values(TypeContrat).map(val => ({ label: val, value: val }));
    this.fonctions = Object.values(FonctionSalarie).map(val => ({ label: val, value: val }));
    this.qualites = Object.values(QualiteSalarie).map(val => ({ label: val, value: val }));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadSalarie(+id);
    }
   //documents pdf 
   // if (this.isEditMode && this.salarie.id) {
    //  this.loadDocuments();
    //}
  }

  initForm(): void {
    this.salarieForm = this.fb.group({
      immatriculation: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      agence: [null, Validators.required],
      company: [null, Validators.required],
      dateNaissance: [null],
      cin: [''],
      cnss: [''],
      gsm: [''],
      gsmp: [''],
      fixe: [''],
      dateDeclarationCnss: [null],
      situationFamiliale: [null],
      typeContrat: [null],
      fonction: [null],
      qualite: [null],
      adresse: [''],
      ville: [''],
      email: ['',  Validators.email],
     
    });
  }
  loadAgences(): void {
    this.agenceService.getActivesAgences().subscribe({
        next: (data) => {
            this.agences = data;
        },
        error: (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des agences'
            });
        }
    });
}

  loadCompanys(): void {
    this.companyService.getActivesCompanies().subscribe({
        next: (data) => {
            this.companys = data
        },
        error: (error) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors du chargement des Sociétés'
            });
        }
    });
  }

  loadSalarie(id: number): void {
    this.loading = true;
    this.salarieService.getSalarieById(id).subscribe({
      next: (data: Salarie) => {
        this.salarie = data;
        this.patchFormValues();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de le salarie', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de le salarie'
        });
        this.loading = false;
      }
    });
  }

  patchFormValues(): void {
    this.salarieForm.patchValue({
      nom: this.salarie.nom,
      prenom: this.salarie.prenom,
      immatriculation: this.salarie.immatriculation,
      dateNaissance: this.salarie.dateNaissance ? new Date(this.salarie.dateNaissance) : null,
      dateDeclarationCnss: this.salarie.dateDeclarationCnss ? new Date(this.salarie.dateDeclarationCnss) : null,
      cin: this.salarie.cin,
      cnss: this.salarie.cnss,
      adresse: this.salarie.adresse,
      ville: this.salarie.ville,
      email: this.salarie.email,
      fixe: this.salarie.fixe,
      gsmp: this.salarie.gsmp,
      gsm: this.salarie.gsm,
      situationFamiliale: this.salarie.situationFamiliale,
      fonction: this.salarie.fonction,
      qualite: this.salarie.qualiteSalarie,
      typeContrat: this.salarie.typeContrat,
      agence: this.salarie.agence,
      company: this.salarie.company 
    });
  }

  onSubmit(): void {
    if (this.salarieForm.invalid) {
      this.markFormGroupTouched(this.salarieForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    this.submitting = true;
    const formData = this.salarieForm.value;
    
    // Préparer les données de le salarie
    const salarieData: Partial<Salarie> = {
      ...formData,
      currentUser: this.currentUser?.username
    };

    if (this.isEditMode && this.salarie && this.salarie.id) {
      // Mise à jour d'une salarie existante
      this.salarieService.updateSalarie(this.salarie.id, salarieData).subscribe({
        next: (updatedSalarie: Salarie) => {
          this.salarie=updatedSalarie
          this.uploadImage();
          this.uploadPdf(this.cv!, "cv");
          this.uploadPdf(this.contrat!, "contrat");
          this.uploadPdf(this.diplome!, "diplome");
          this.uploadPdf(this.permisR!, "permisR");
          this.uploadPdf(this.permisV!, "permisV");
          this.uploadPdf(this.carteNationaleR!, "carteNationaleR");
          this.uploadPdf(this.carteNationaleV!, "carteNationaleV");
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Salarie mise à jour avec succès'
          });
          this.submitting = false;
          this.goBack();
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de le salarie', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le salarie'
          });
          this.submitting = false;
        }
      });
    } else {
      // Création d'un nouveau salarie
      this.salarieService.createSalarie(salarieData).subscribe({
        next: (newSalarie: Salarie) => {
          this.salarie=newSalarie
          this.uploadImage();
          this.uploadPdf(this.cv!, "cv");
          this.uploadPdf(this.contrat!, "contrat");
          this.uploadPdf(this.diplome!, "diplome");
          this.uploadPdf(this.permisR!, "permisR");
          this.uploadPdf(this.permisV!, "permisV");
          this.uploadPdf(this.carteNationaleR!, "carteNationaleR");
          this.uploadPdf(this.carteNationaleV!, "carteNationaleV");

          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Salarie créée avec succès'
          });
          this.submitting = false;
          this.goBack();
        },
        error: (error) => {
          console.error('Erreur lors de la création de le salarie', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de créer le salarie'
          });
          this.submitting = false;
        }
      });
    }
  }


    onPhotoSelected(file: File | null): void {
      this.photo=file;
    }
    onPhotoUploaded(image: Image): void {
      this.uploadedImage = image as any;
    }
    onPhotoDeleted(): void {
      this.photo = null;
    }

    
    onPdfCvSelected(file: File | null): void {
      this.cv=file;
    }
    onPdfContratSelected(file: File | null): void {
      this.contrat=file;
    }
    onPdfDiplomeSelected(file: File | null): void {
      this.diplome=file;
    }
    onPdfPermisRSelected(file: File | null): void {
      this.permisR=file;
    }
    onPdfPermisVSelected(file: File | null): void {
      this.permisV=file;
    }
    onPdfCarteNationaleRSelected(file: File | null): void {
      this.carteNationaleR=file;
    }
    onPdfCarteNationaleVSelected(file: File | null): void {
      this.carteNationaleV=file;
    }




    onPdfUploadedCv(pdf: Pdf): void {
      this.uploadedPdfCv = pdf as any;
    }
    onPdfUploadedContrat(pdf: Pdf): void {
      this.uploadedPdfContrat = pdf as any;
    }
    onPdfUploadedDiplome(pdf: Pdf): void {
      this.uploadedPdfDiplome = pdf as any;
    }
    onPdfUploadedPermisR(pdf: Pdf): void {
      this.uploadedPdfPermisR = pdf as any;
    }
    onPdfUploadedPermisV(pdf: Pdf): void {
      this.uploadedPdfPermisV = pdf as any;
    }
    onPdfUploadedCarteNationaleR(pdf: Pdf): void {
      this.uploadedPdfCarteNationaleR = pdf as any;
    }
    onPdfUploadedCarteNationaleV(pdf: Pdf): void {
      this.uploadedPdfCarteNationaleV = pdf as any;
    }
    onPdfDeletedCv(): void {
      this.cv = null;
    }
    onPdfDeletedContrat(): void {
      this.contrat = null;
    }
    onPdfDeletedDiplome(): void {
      this.diplome = null;
    }
    onPdfDeletedPermisR(): void {
      this.permisR = null;
    }
    onPdfDeletedPermisV(): void {
      this.permisV = null;
    }
    onPdfDeletedCarteNationaleR(): void {
      this.carteNationaleR = null;
    }
    onPdfDeletedCarteNationaleV(): void {
      this.carteNationaleV = null;
    }


    onPdfSelected(file: File | null): void {
      this.selectedDocumentFile=file;
    }

    onDocumentFileSelect(event: any): void {
      this.selectedDocumentFile = event.files[0];
    }

    onPdfDeleted(): void {
      this.selectedDocumentFile = null;
    }

    onPdfUploaded(pdf: Pdf): void {
      this.uploadedPdf = pdf as any;
    }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/parametrageapplications/salaries/list-salaries']);
  }

     /**
     * Efface le contenu d'un champ spécifique du formulaire
     * @param fieldName - Nom du champ à vider
     */
     clearField(fieldName: string): void {    
      // Pour tous les autres champs
          this.salarieForm.get(fieldName)?.setValue('');
          this.salarieForm.get(fieldName)?.markAsPristine();
      
  }


  uploadImage(): void {
    if (!this.photo) {
        return;
    }
    this.loading = true;
    // Si une image existe déjà, la mettre à jour
    if (this.uploadedImage) {
      this.imageService.updateImage(this.uploadedImage.id, this.photo)
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
    this.imageService.uploadImage(this.photo,"salarie" , this.salarie.id!, "photo")
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

  uploadPdf(file:File , name:string): void {
    if (!file) {
        return;
    }
    this.loading = true;
    // Si un document existe déjà, le mettre à jour
    if (this.uploadedPdf) {
      this.pdfService.updatePdf(this.uploadedPdf.id, file)
        .subscribe({
          next: (pdf) => {
            this.uploadedPdf = pdf;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'CV mise à jour avec succès'
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
    this.pdfService.uploadPdf(file,"salarie" , this.salarie.id!, name)
        .subscribe({
          next: (pdf) => {
            this.uploadedPdf = pdf;
            this.pdfUrl = pdf.path;
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

  loadDocuments1(): void { //filtre en frontend
    this.pdfService.getPdfsByEntity('salarie', this.salarie.id!)
      .subscribe({
        next: (documents: Pdf[]) => {
          this.documents = documents.filter(pdf => pdf.name.startsWith('document_'));
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des documents'
          });
        }
      });
  }

  loadDocuments(): void {  //filtre en backend 
    this.pdfService.getPdfsByNameStartWithAndEntity('document','salarie', this.salarie.id!)
      .subscribe({
        next: (documents: Pdf[]) => {
         
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors du chargement des documents'
          });
        }
      });
  }

  showAddDocumentDialog(): void {
    this.isEditDocument = false;
    this.selectedDocument = {

      dateAjout: new Date()
    };
    this.documentDialog = true;
  }

  editDocument(document: any): void {
    this.isEditDocument = true;
    this.selectedDocument = { ...document };
    this.documentDialog = true;
  }

  hideDocumentDialog(): void {
    this.documentDialog = false;
    this.selectedDocument = {};
    this.selectedDocumentFile = null;
  }

  

  saveDocument(): void {
    if (!this.selectedDocumentFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner un fichier PDF'
      });
      return;
    }

    if (this.isEditDocument) {
      this.pdfService.updatePdf(this.selectedDocument.id, this.selectedDocumentFile)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Document mis à jour avec succès'
            });
            this.hideDocumentDialog();
            this.loadDocuments();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du document'
            });
          }
        });
    } else {
      this.pdfService.uploadPdf(
        this.selectedDocumentFile,
        'salarie',
        this.salarie.id!,
        "document_" + Math.random().toString(36).substring(2, 10)
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Document ajouté avec succès'
          });
          this.hideDocumentDialog();
          this.loadDocuments();
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de l\'ajout du document'
          });
        }
      });
    }
  }

  deleteDocument(document: any): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce document ?',
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pdfService.deletePdf(document.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Document supprimé avec succès'
            });
            this.loadDocuments();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la suppression du document'
            });
          }
        });
      }
    });
  }

  previewDocument(document: any): void {
    this.previewUrl = document.path;
    this.previewDialog = true;
  }

  downloadDocument(document: any): void {
    window.open(document.path, '_blank');
  }

} 