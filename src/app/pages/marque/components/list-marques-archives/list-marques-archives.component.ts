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
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ExportFileService } from '../../../service/exportFile.service';
import { Marque } from '../../models/marque.model';
import { MarqueService } from '../../services/marque.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';

@Component({
  selector: 'app-list-marques-archives',
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
  templateUrl: './list-marques-archives.component.html',
  styleUrls: ['./list-marques-archives.component.scss']
})
export class ListMarqueArchivesComponent implements OnInit {
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
  }

  ngOnInit() {
    this.loadmarques();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Marque', type: 'text' },
      { field: 'description', header: 'Description', type: 'text' },
      { field: 'pays', header: 'Pays', type: 'text' },
     




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
    this.marqueService.getArchivesMarques().subscribe({
      next: (data: Marque[]) => {
        this.marques = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des marques archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les marques archivées'
        });
        this.loading = false;
      }
    });
  }

  viewMarque(marque: Marque): void {
    this.router.navigate(['/dashboard/marques/view-marque', marque.id]);
  }

  activeMarque(marque: Marque): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la marque "${marque.nom}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (marque.id) {
          this.marqueService.activeMarque(marque.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Marque restaurée avec succès'
              });
              this.loadmarques();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la marque', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la marque'
              });
            }
          });
        }
      }
    });
  }

  archiveMarque(marque: Marque): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la marque "${marque.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (marque.id) {
          this.marqueService.archiveMarque(marque.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Marque supprimée avec succès'
              });
              this.loadmarques();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la marque', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la marque'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedmarques() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les marques sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Marques supprimées',
          life: 3000
        });
        this.selectedmarques = [];
      }
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


  getImageUrl(marque: Marque): string {
    this.imageService.getImageByNameAndEntity("marque", marque.id!, "logo")
      .subscribe({
        next: (image) => {  
          return image.path
        },
        error: (error) => {
          // Pas d'image existante, ce n'est pas une erreur
          return 'assets/images/logo.png';
        }
      });
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