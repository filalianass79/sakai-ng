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
import { Categorie } from '../../models/categorie.model';
import { CategorieService } from '../../services/categorie.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';

@Component({
  selector: 'app-list-categories-archives',
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
  templateUrl: './list-categories-archives.component.html',
  styleUrls: ['./list-categories-archives.component.scss']
})
export class ListCategorieArchivesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  categories: Categorie[] = [];
  selectedcategories: Categorie[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser:string='';

  constructor(
    private categorieService: CategorieService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  }

  ngOnInit() {
    this.loadcategories();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Categorie', type: 'text' },
      { field: 'exemple', header: 'Exemple', type: 'text' },
      { field: 'libelle', header: 'Libelle', type: 'text' },
     




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

  

  loadcategories(): void {
    this.loading = true;
    this.categorieService.getArchivesCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des categories archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les categories archivées'
        });
        this.loading = false;
      }
    });
  }

  viewCategorie(categorie: Categorie): void {
    this.router.navigate(['/dashboard/categories/view-categorie', categorie.id]);
  }

  activeCategorie(categorie: Categorie): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la categorie "${categorie.nom}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (categorie.id) {
          this.categorieService.activeCategorie(categorie.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Categorie restaurée avec succès'
              });
              this.loadcategories();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la categorie', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la categorie'
              });
            }
          });
        }
      }
    });
  }

  archiveCategorie(categorie: Categorie): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la categorie "${categorie.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (categorie.id) {
          this.categorieService.archiveCategorie(categorie.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Categorie supprimée avec succès'
              });
              this.loadcategories();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la categorie', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la categorie'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedcategories() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les categories sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Categories supprimées',
          life: 3000
        });
        this.selectedcategories = [];
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


  getImageUrl(categorie: Categorie): string {
    this.imageService.getImageByNameAndEntity("categorie", categorie.id!, "logo")
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