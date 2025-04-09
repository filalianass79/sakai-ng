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
import { Gamme } from '../../models/gamme.model';
import { GammeService } from '../../services/gamme.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';

@Component({
  selector: 'app-list-gamme-archives',
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
  templateUrl: './list-gamme-archives.component.html',
  styleUrls: ['./list-gamme-archives.component.scss']
})
export class ListGammeArchivesComponent implements OnInit {
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
  }

  ngOnInit() {
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
    this.gammeService.getArchivesGammes().subscribe({
      next: (data: Gamme[]) => {
        this.gammes = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des gammes archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les gammes archivées'
        });
        this.loading = false;
      }
    });
  }

  viewGamme(gamme: Gamme): void {
    this.router.navigate(['/dashboard/gammes/view-gamme', gamme.id]);
  }

  activeGamme(gamme: Gamme): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la gamme "${gamme.nom}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (gamme.id) {
          this.gammeService.activeGamme(gamme.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Gamme restaurée avec succès'
              });
              this.loadgammes();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la gamme', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la gamme'
              });
            }
          });
        }
      }
    });
  }

  archiveGamme(gamme: Gamme): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la gamme "${gamme.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (gamme.id) {
          this.gammeService.archiveGamme(gamme.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Gamme supprimée avec succès'
              });
              this.loadgammes();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la gamme', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la gamme'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedgammes() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les gammes sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Gammes supprimées',
          life: 3000
        });
        this.selectedgammes = [];
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


  getImageUrl(gamme: Gamme): string {
    this.imageService.getImageByNameAndEntity("gamme", gamme.id!, "logo")
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