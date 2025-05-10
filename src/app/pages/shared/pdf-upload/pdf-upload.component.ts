import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PdfService, Pdf } from '../../service/pdf.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SafePipe } from '../pipes/safe.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    SafePipe,
    PdfViewerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss']
})
export class PdfUploadComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Input() entityType: string='';
  @Input() entityId: number=0;
  @Input() pdfType: string = '';
  @Input() currentPdf: any = null;
  @Input() pdfName!: string;
  @Input() label: string = '';
  @Input() showPreview: boolean = true;
  @Input() previewWidth: string = '100%';
  @Input() previewHeight: string = '400px';
  @Input() maxFileSize: number = 1000000; // 1MB par défaut
  @Input() accept: string = 'application/pdf';
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() autoUpload: boolean = false;
  @Input() showUploadButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() styleClass: string = '';
  
  @Output() onUploadComplete = new EventEmitter<Pdf>();
  @Output() onUploadError = new EventEmitter<any>();
  @Output() onPdfSelected = new EventEmitter<File | null>();
  @Output() onPdfDeleted = new EventEmitter<void>();
  
  selectedFile: File | null = null;
  uploadedPdf: Pdf | null = null;
  loading: boolean = false;
  pdfUrl: any | null = null;

  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  isDragging: boolean = false;

  constructor(
    private pdfService: PdfService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    if (this.entityType && this.entityId) {
      this.loadExistingPdf();
    }
  }



  loadExistingPdf(): void {
    this.loading = true;
    this.pdfService.getPdfByNameAndEntity(this.entityType, this.entityId, this.pdfName)
      .subscribe({
        next: (pdf) => {
          this.uploadedPdf = pdf;
          this.pdfUrl=pdf.path      
          this.onUploadComplete.emit(pdf);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        }
      });
  }

 

  onLoadComplete(pdf: any) {
    this.totalPages = pdf.numPages;
    this.isLoaded = true;
  }

  /**
   * Gère la sélection d'un fichier
   */
  
  
  /**
   * Télécharge l'pdf sélectionnée
   */
  uploadPdf(): void {
      if (!this.selectedFile) {
        this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Veuillez sélectionner un fichier'
      });
      return;
      }
    
    if (!this.entityType || !this.entityId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Type d\'entité ou ID manquant'
      });
      return;
    }
    
    this.loading = true;
    if (this.uploadedPdf) {
      this.pdfService.updatePdf(this.uploadedPdf.id, this.selectedFile)
        .subscribe({
          next: (pdf) => {
            this.uploadedPdf = pdf;
            this.pdfUrl=pdf.path;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'PDF mis à jour avec succès'
            });
            
            this.onUploadComplete.emit(pdf);
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du PDF'
            });
            
            this.onUploadError.emit(error);
          }
        });
    } else {
      this.pdfService.uploadPdf(this.selectedFile, this.entityType, this.entityId, this.pdfName)
        .subscribe({
          next: (pdf) => {
            this.uploadedPdf = pdf;
          
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'PDF téléchargé avec succès'
            });
            
            this.onUploadComplete.emit(pdf);
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du téléchargement du PDF'
            });
            
            this.onUploadError.emit(error);
          }
        });
    }
  }
  
  /**
   * Supprime l'pdf
   */
  deletePdf(): void {
      this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer cette pdf ?',
        header: 'Confirmation de suppression',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loading = true;
          
          if (!this.uploadedPdf) {
            this.pdfUrl=null;
            this.selectedFile = null;
            this.loading = false;
        }
        else{
          this.pdfService.deletePdf(this.uploadedPdf!.id)
            .subscribe({
              next: () => {
                this.uploadedPdf = null;
                this.pdfUrl=null;
                this.selectedFile = null;
                this.loading = false;
                
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Pdf supprimée avec succès'
                });
                
                this.onPdfDeleted.emit();
              },
              error: (error) => {
                this.loading = false;
                
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'Erreur lors de la suppression de l\'pdf'
                });
              }
            });
        }

        }
      });
   

  }
  
  /**
   * Annule la sélection du fichier
   */
  clearSelection(): void {
    this.deletePdf();
    this.selectedFile = null;
  }

  /**
   * Télécharge l'pdf
   */

    uploadedFiles: any[] = [];
  


onUpload(event: { files: any }, fileUpload: any) {
  this.uploadedFiles = [];
  for (let pdf of event.files) {
      this.uploadedFiles.push(pdf);
      
  }
  fileUpload.clear();
  if (this.uploadedFiles[0]) {
      this.onPdfSelected.emit(this.uploadedFiles[0]);
  }
  this.readFile(this.uploadedFiles[0]);
}


readFile(pdf: File) {
  var reader = new FileReader();
  reader.readAsDataURL(pdf);
  reader.onload = () => {
      this.pdfUrl = reader.result;
  };
}



download() {
  const fileName = this.uploadedPdf?.originalFilename  || 'fichier.pdf';
  if (this.pdfUrl) {
    this.downloadPdfs(this.pdfUrl, fileName);
  }
}

downloadPdfs(pdfUrl: any, fileName: string): void {
  fetch(pdfUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Erreur lors du téléchargement de l\'image :', error));
}

onDragOver(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = true;
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  this.isDragging = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type === 'application/pdf') {
      if (file.size <= this.maxFileSize) {
        this.selectedFile = file;
        this.readFile(file);
        if (this.entityId>0) {
          this.uploadPdf();
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: `Le fichier est trop volumineux. Taille maximale: ${this.maxFileSize / 1000000}MB`
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Seuls les fichiers PDF sont acceptés'
      });
    }
  }
}

}