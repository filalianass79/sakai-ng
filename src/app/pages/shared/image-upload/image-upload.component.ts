import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ImageService, Image } from '../../service/image.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Input() entityType: string = '';
  @Input() entityId: number = 0;
  @Input() imageType: string = '';
  @Input() currentImage: any = null;
  @Input() imageName: string = 'image';
  @Input() label: string = '';
  @Input() showPreview: boolean = true;
  @Input() previewWidth: string = '100%';
  @Input() previewHeight: string = 'auto';
  @Input() maxFileSize: number = 1000000; // 1MB par défaut
  @Input() accept: string = 'image/*';
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() autoUpload: boolean = false;
  @Input() showUploadButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() styleClass: string = '';
  
  @Output() onUploadComplete = new EventEmitter<Image>();
  @Output() onUploadError = new EventEmitter<any>();
  @Output() onImageSelected = new EventEmitter<File | null>();
  @Output() onImageDeleted = new EventEmitter<void>();
  
  selectedFile: File | null = null;
  uploadedImage: Image | null = null;
  loading: boolean = false;
  imageUrl: any | null = null;

  
  constructor(
    private imageService: ImageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }
  
  ngOnInit(): void {
    // Charger l'image existante si entityType et entityId sont définis
    if (this.entityType && this.entityId) {
      this.loadExistingImage();
    }
  }
  
  /**
   * Charge l'image existante pour l'entité
   */
  loadExistingImage(): void {
    this.loading = true;
    this.imageService.getImageByNameAndEntity(this.entityType, this.entityId, this.imageName)
      .subscribe({
        next: (image) => {
          this.uploadedImage = image;
          this.imageUrl = image.path;
          this.onUploadComplete.emit(image);
          this.loading = false;
        },
        error: (error) => {
          // Pas d'image existante, ce n'est pas une erreur
          this.loading = false;
        }
      });
  }
  
  /**
   * Gère la sélection d'un fichier
   */
  onSelect(event: any): void {
    this.selectedFile = event.files[0];
    this.onImageSelected.emit(this.selectedFile);
    if (this.autoUpload && this.selectedFile ) {
      this.uploadImage();
     //this.onUpload(this.selectedFile, this.fileUpload)
    }
  }
  
  /**
   * Télécharge l'image sélectionnée
   */
  uploadImage(): void {
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
    
    // Si une image existe déjà, la mettre à jour
    if (this.uploadedImage) {
      this.imageService.updateImage(this.uploadedImage.id, this.selectedFile)
        .subscribe({
          next: (image) => {
            this.uploadedImage = image;
              this.imageUrl = image.path;
            this.loading = false;
            
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Image mise à jour avec succès'
            });
            
            this.onUploadComplete.emit(image);
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour de l\'image'
            });
            
            this.onUploadError.emit(error);
          }
        });
    } else {
      // Sinon, télécharger une nouvelle image
      this.imageService.uploadImage(this.selectedFile, this.entityType, this.entityId, this.imageName)
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
            
            this.onUploadComplete.emit(image);
          },
          error: (error) => {
            this.loading = false;
            
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors du téléchargement de l\'image'
            });
            
            this.onUploadError.emit(error);
          }
        });
    }
  }
  
  /**
   * Supprime l'image
   */
  deleteImage(): void {
      this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer cette image ?',
        header: 'Confirmation de suppression',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.loading = true;
          
          if (!this.uploadedImage) {
            this.imageUrl = null;
            this.selectedFile = null;
            this.loading = false;
        }
        else{
          this.imageService.deleteImage(this.uploadedImage!.id)
            .subscribe({
              next: () => {
                this.uploadedImage = null;
                this.imageUrl = null;
                this.selectedFile = null;
                this.loading = false;
                
                this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Image supprimée avec succès'
                });
                
                this.onImageDeleted.emit();
              },
              error: (error) => {
                this.loading = false;
                
                this.messageService.add({
                  severity: 'error',
                  summary: 'Erreur',
                  detail: 'Erreur lors de la suppression de l\'image'
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
    this.deleteImage();
    this.selectedFile = null;
  }

  /**
   * Télécharge l'image
   */

    uploadedFiles: any[] = [];
   // debug: string = '';
   // fileBuffer: string = '';
    //image: any;

onUpload(event: { files: any }, fileUpload: any) {
  this.uploadedFiles = [];
  for (let image of event.files) {
      this.uploadedFiles.push(image);
      
  }
  fileUpload.clear();
  if (this.uploadedFiles[0]) {
    //  this.image = this.uploadedFiles[0];
      this.onImageSelected.emit(this.uploadedFiles[0]);
  }

  this.readFile(this.uploadedFiles[0]);
  //this.debug = this.uploadedFiles[0].name + '----' + this.fileBuffer;
  //this.messageService.add({
   //   severity: 'info',
   //   summary: 'File Uploaded',
    //  detail: '',
  //});
}
readFile(image: File) {
  var reader = new FileReader();
  reader.readAsDataURL(image);
  reader.onload = () => {
      this.imageUrl = reader.result;
  };
}

download() {
  const fileName = this.selectedFile?.name || 'image.jpg';
  if (this.imageUrl) {
    this.downloadImages(this.imageUrl, fileName);
  }
}

downloadImages(imageUrl: any, fileName: string): void {
  fetch(imageUrl)
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
}