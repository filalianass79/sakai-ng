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
import { Gamme } from '../../models/gamme.model';
import { GammeService } from '../../services/gamme.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-list-gammes',
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
  templateUrl: './list-gammes.component.html',
  styleUrls: ['./list-gammes.component.scss']
})
export class ListgammesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  gammes: Gamme[] = [];
  selectedgammes: Gamme[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser:string='';
  constructor(
    private gammeService: GammeService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
    this.loadgammes();
   }

  ngOnInit(): void {
    this.loadgammes();
    this.initColumns();

  }
  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Gamme', type: 'text' },

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

  loadgammes(): void {
    this.loading = true;
    this.gammeService.getActivesGammes().subscribe({
      next: (data: Gamme[]) => {
        this.gammes = data;

        if (this.gammes.length === 0) {
          this.createTestgammes();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des gammes', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les gammes'
        });
        this.loading = false;
      }
    });
  }



  createTestgammes(): void {
    const testgammes = [
      {
        nom: 'Gamme Test 1',
        
        isVisible: true
      },
      {
        nom: 'Gamme Test 2',
        
        isVisible: true
      },
      {
        nom: 'Gamme Test 3',
        
        isVisible: false
      }
    ];

    testgammes.forEach((gamme, index) => {
      this.gammeService.createGamme(gamme).subscribe({
        next: (createdGamme: Gamme) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Gamme test ${index + 1} créée avec succès`
          });
          this.gammes.push(createdGamme);
        },
        error: (error: any ) => {
          console.error(`Erreur lors de la création de la gamme test ${index + 1}`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de créer la gamme test ${index + 1}`
          });
        }
      });
    });
  }

  
  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
  }

  resetSort() {
    this.dt.sortOrder = 0;
    this.dt.sortField = '';
    this.dt.reset();
    this.loadgammes();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/gammes/new-gamme']);
  }

 

  editGamme(gamme: Gamme): void {
    this.router.navigate(['/dashboard/gammes/edit-gamme', gamme.id]);
  }

  viewGamme(gamme: Gamme): void {
    this.router.navigate(['/dashboard/gammes/view-gamme', gamme.id]);
  }

  deleteGamme(gamme: Gamme): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la gamme "${gamme.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (gamme.id) {
          this.gammeService.archiveGamme(gamme.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Gamme archivée avec succès'
              });
              this.loadgammes();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la gamme', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la gamme'
              });
            }
          });
        }
      }
    });
  }



  archiveSelectedgammes() {
    if (!this.selectedgammes.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les gammes sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedgammes) {
              if (e.id) {
                    this.gammeService.archiveGamme(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadgammes();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Gammes supprimées',
                    life: 3000
                  });
                  this.selectedgammes = [];
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
    
    importGammes(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.gammeService.importGammes(formData).subscribe({
          next: (gammes) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${gammes.length} gammes importées avec succès`
            });
            this.loadgammes(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des gammes. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }


    getImageUrl(gamme: Gamme): string {
      
      if (gamme.logo?.path) {
        return `${environment.apiUrl}${gamme.logo.path}`;
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