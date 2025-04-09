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
import { Modele } from '../../models/modele.model';
import { ModeleService } from '../../services/modele.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';

@Component({
  selector: 'app-list-modeles-archives',
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
  templateUrl: './list-modeles-archives.component.html',
  styleUrls: ['./list-modeles-archives.component.scss']
})
export class ListModeleArchivesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  modeles: Modele[] = [];
  selectedmodeles: Modele[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser:string='';

  constructor(
    private modeleService: ModeleService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  }

  ngOnInit() {
    this.loadmodeles();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Modele', type: 'text' },
      { field: 'marqueNom', header: 'Marque', type: 'text' },
      { field: 'categorieNom', header: 'Categorie', type: 'text' },
      { field: 'typeCarburant', header: 'Type de carburant', type: 'text' },
      { field: 'typeTransmission', header: 'Type de transmission', type: 'text' },
     
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

  

  loadmodeles(): void {
    this.loading = true;
    this.modeleService.getArchivesModeles().subscribe({
      next: (data: Modele[]) => {
        this.modeles = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des modeles archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les modeles archivées'
        });
        this.loading = false;
      }
    });
  }

  viewModele(modele: Modele): void {
    this.router.navigate(['/dashboard/modeles/view-modele', modele.id]);
  }

  activeModele(modele: Modele): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la modele "${modele.nom}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (modele.id) {
          this.modeleService.activeModele(modele.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Modele restaurée avec succès'
              });
              this.loadmodeles();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la modele', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la modele'
              });
            }
          });
        }
      }
    });
  }

  archiveModele(modele: Modele): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la modele "${modele.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (modele.id) {
          this.modeleService.archiveModele(modele.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Modele supprimée avec succès'
              });
              this.loadmodeles();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la modele', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la modele'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedmodeles() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les modeles sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Modeles supprimées',
          life: 3000
        });
        this.selectedmodeles = [];
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


  getImageUrl(modele: Modele): string {
    this.imageService.getImageByNameAndEntity("modele", modele.id!, "logo")
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