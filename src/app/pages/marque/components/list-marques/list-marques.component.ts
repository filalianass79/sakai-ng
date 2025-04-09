import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { ExportFileService } from '../../../service/exportFile.service';
import { Marque } from '../../models/marque.model';
import { MarqueService } from '../../services/marque.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-list-marques',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    TooltipModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    InputTextModule,
    FormsModule,
    ToggleSwitchModule,
    FileUploadModule,
    AvatarModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-marques.component.html',
  styleUrls: ['./list-marques.component.scss']
})
export class ListmarquesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  marques: Marque[] = [];
  selectedmarques: Marque[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser:string='';
  constructor(
    private marqueService: MarqueService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
    this.loadmarques();
   }

  ngOnInit(): void {
    this.loadmarques();
    this.initColumns();

  }
  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Marque', type: 'text' },
      { field: 'pays', header: 'Pays', type: 'text' },
      { field: 'description', header: 'Description', type: 'text' }

    ];
    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  loadmarques(): void {
    this.loading = true;
    this.marqueService.getActivesMarques().subscribe({
      next: (data: Marque[]) => {
        this.marques = data;

        if (this.marques.length === 0) {
          //this.createTestmarques();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des marques', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les marques'
        });
        this.loading = false;
      }
    });
  }



 /* createTestmarques(): void {
    const testmarques = [
      {
        nom: 'Marque Test 1',
        
        isVisible: true
      },
      {
        nom: 'Marque Test 2',
        
        isVisible: true
      },
      {
        nom: 'Marque Test 3',
        
        isVisible: false
      }
    ];

    testmarques.forEach((marque, index) => {
      this.marqueService.createMarque(marque).subscribe({
        next: (createdMarque: Marque) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Marque test ${index + 1} créée avec succès`
          });
          this.marques.push(createdMarque);
        },
        error: (error: any ) => {
          console.error(`Erreur lors de la création de la marque test ${index + 1}`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de créer la marque test ${index + 1}`
          });
        }
      });
    });
  }
*/
  
  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
  }

  resetSort() {
    this.dt.sortOrder = 0;
    this.dt.sortField = '';
    this.dt.reset();
    this.loadmarques();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/marques/new-marque']);
  }

 

  editMarque(marque: Marque): void {
    this.router.navigate(['/dashboard/marques/edit-marque', marque.id]);
  }

  viewMarque(marque: Marque): void {
    this.router.navigate(['/dashboard/marques/view-marque', marque.id]);
  }

  deleteMarque(marque: Marque): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la marque "${marque.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (marque.id) {
          this.marqueService.archiveMarque(marque.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Marque archivée avec succès'
              });
              this.loadmarques();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la marque', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la marque'
              });
            }
          });
        }
      }
    });
  }



  archiveSelectedmarques() {
    if (!this.selectedmarques.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les marques sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedmarques) {
              if (e.id) {
                    this.marqueService.archiveMarque(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadmarques();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Marques supprimées',
                    life: 3000
                  });
                  this.selectedmarques = [];
                }
      }})
    }
  
    exportCSV() {
      this.dt.exportCSV();
    }
  
    exportExcel() {
      this.exportFileService.exportToExcel(
        this.dt,
        this._selectedColumns
      );
    }
  
    exportPdf() {
      this.exportFileService.exportToPdf(
        this.dt,
        this._selectedColumns
      );
    }
    
    importMarques(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.marqueService.importMarques(formData).subscribe({
          next: (marques) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${marques.length} marques importées avec succès`
            });
            this.loadmarques(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des marques. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }


    getImageUrl(marque: Marque): string {
      
      if (marque.logo?.path) {
        return `${environment.apiUrl}${marque.logo.path}`;
      }
      return 'assets/images/logo.png';
    }
} 

interface Column {
    field: string;
    header: string;
    type: string;
  }
  
  interface ExportColumn {
    title: string;
    dataKey: string;
  } 