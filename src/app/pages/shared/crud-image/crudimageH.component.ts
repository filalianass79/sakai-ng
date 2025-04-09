import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,} from '@angular/core';
import { saveAs } from 'file-saver';

import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { FileS3Service } from '../../service/fileS3.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { ImageService } from '../../service/image.service';


@Component({
    selector: 'app-crudimageH',
    templateUrl: './crudimageH.component.html',
    styleUrls: ['./crudimageH.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ButtonModule,
      ImageModule,
      FileUploadModule,
      ToastModule,
      ProgressSpinnerModule,
      ConfirmDialogModule
    ],
    providers: [MessageService, ConfirmationService],

  })
export class CrudimageHComponent {
    @Output() imageNameFromChild = new EventEmitter<string>();

    @Input() imageUrlFromParent: string = '';
    @Input() imageNameFromParent: string = '';
    @Input() showButtonImage: boolean = true; //Utilisé pour afficher ou non les buttons apres une image
    @Input() imageNameVideFromParent: string = '';

    url: any;
    imageName: string = '';
    uploadedFiles: any[] = [];
    debug: string = '';
    fileBuffer: string = '';
    image: any;
    
    constructor(
        private fileS3Service: FileS3Service,
        private imageService: ImageService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {      
            this.url = this.imageUrlFromParent;     
            this.imageName = this.imageNameFromParent;
    }

    ngAfterContentChecked() {
        this.ref.detectChanges(); // pour gerer une erreur L'expression a changé après avoir été vérifiée
    }

    /* ************** download Upload edit delete image S3 **************** */
    downloadFileFromS3(imageName: string): void {
        if (imageName) {
            this.fileS3Service
                .downloadFileFromS3(imageName)
                .subscribe((blob: any) => saveAs(blob, imageName));
        }
    }

    deleteFileFromS3(imageName: string) {
        this.confirmationService.confirm({
            message:
                'Vous êtes sûr de vouloir supprimer le document :' +
                imageName +
                '?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.fileS3Service.deleteFileFromS3(imageName).subscribe(
                    (data: any) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'image supprimée',
                            life: 3000,
                        });
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'image non supprimée',
                            life: 3000,
                        });
                    }
                );

                this.imageName = '';

                this.imageName = '';
                this.url = '';
                this.imageNameFromChild.emit('');
            },
        });
    }


   /* ************** download Upload edit delete image  **************** */
   downloadFileFrom(imageName: string): void {
    if (imageName) {
        this.fileS3Service
            .downloadFileFromS3(imageName)
            .subscribe((blob: any) => saveAs(blob, imageName));
    }
}

deleteFileFrom(imageName: string) {
    this.confirmationService.confirm({
        message:
            'Vous êtes sûr de vouloir supprimer le document :' +
            imageName +
            '?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.fileS3Service.deleteFileFromS3(imageName).subscribe(
                (data: any) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'image supprimée',
                        life: 3000,
                    });
                },
                (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'image non supprimée',
                        life: 3000,
                    });
                }
            );

            this.imageName = '';

            this.imageName = '';
            this.url = '';
            this.imageNameFromChild.emit('');
        },
    });
}

    /* ************** upload image **************** */

    onUpload(event: { files: any }, fileUpload: any) {
        this.uploadedFiles = [];
        for (let image of event.files) {
            this.uploadedFiles.push(image);
        }
        fileUpload.clear();
        if (this.uploadedFiles[0]) {
            this.image = this.uploadedFiles[0];
        }

        this.readFile(this.uploadedFiles[0]);
        this.debug = this.uploadedFiles[0].name + '----' + this.fileBuffer;
        this.messageService.add({
            severity: 'info',
            summary: 'File Uploaded',
            detail: '',
        });

        const formData = new FormData();

        formData.append('file', this.image);
        if (this.imageName) {
            this.fileS3Service
                .editFileFromS3(formData, this.imageName)
                .subscribe(
                    (data: any) => {
                        console.log(data);
                        this.imageName = data.body;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'modification réussie',
                            life: 3000,
                        });
                    },
                    (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Modification non enregistrer',
                            life: 3000,
                        });
                    },
                    () => {
                        this.imageNameFromChild.emit(this.imageName);
                    }
                );
        } else {
            this.fileS3Service.uploadFileToS3(formData).subscribe(
                (data: any) => {
                    this.imageName = data.body;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'modification réussie',
                        life: 3000,
                    });
                },
                (error: any) => {
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message,
                        life: 3000,
                    });
                },
                () => {
                    this.imageNameFromChild.emit(this.imageName);
                }
            );
        }
    }
    readFile(image: File) {
        var reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            this.url = reader.result;
        };
    }
}
