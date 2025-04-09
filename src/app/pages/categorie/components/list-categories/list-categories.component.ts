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
import { Categorie } from '../../models/categorie.model';
import { CategorieService } from '../../services/categorie.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-list-categories',
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
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListcategoriesComponent implements OnInit {
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
    this.loadcategories();
   }

  ngOnInit(): void {
    this.loadcategories();
    this.initColumns();

  }
  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Categorie', type: 'text' },
      { field: 'libelle', header: 'Libelle', type: 'text' },
      { field: 'exemple', header: 'Exemple', type: 'text' }

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
    this.categorieService.getActivesCategories().subscribe({
      next: (data: Categorie[]) => {
        this.categories = data;

        if (this.categories.length === 0) {
          this.createTestcategories();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des categories', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les categories'
        });
        this.loading = false;
      }
    });
  }



  createTestcategories(): void {
    const testcategories = [
      {
        nom: 'Categorie Test 1',
        
        isVisible: true
      },
      {
        nom: 'Categorie Test 2',
        
        isVisible: true
      },
      {
        nom: 'Categorie Test 3',
        
        isVisible: false
      }
    ];

    testcategories.forEach((categorie, index) => {
      this.categorieService.createCategorie(categorie).subscribe({
        next: (createdCategorie: Categorie) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Categorie test ${index + 1} créée avec succès`
          });
          this.categories.push(createdCategorie);
        },
        error: (error: any ) => {
          console.error(`Erreur lors de la création de la categorie test ${index + 1}`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de créer la categorie test ${index + 1}`
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
    this.loadcategories();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/categories/new-categorie']);
  }

 

  editCategorie(categorie: Categorie): void {
    this.router.navigate(['/dashboard/categories/edit-categorie', categorie.id]);
  }

  viewCategorie(categorie: Categorie): void {
    this.router.navigate(['/dashboard/categories/view-categorie', categorie.id]);
  }

  deleteCategorie(categorie: Categorie): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la categorie "${categorie.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (categorie.id) {
          this.categorieService.archiveCategorie(categorie.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Categorie archivée avec succès'
              });
              this.loadcategories();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la categorie', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la categorie'
              });
            }
          });
        }
      }
    });
  }



  archiveSelectedcategories() {
    if (!this.selectedcategories.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les categories sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedcategories) {
              if (e.id) {
                    this.categorieService.archiveCategorie(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadcategories();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Categories supprimées',
                    life: 3000
                  });
                  this.selectedcategories = [];
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
    
    importCategories(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.categorieService.importCategories(formData).subscribe({
          next: (categories) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${categories.length} categories importées avec succès`
            });
            this.loadcategories(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des categories. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }


    getImageUrl(categorie: Categorie): string {
      
      if (categorie.logo?.path) {
        return `${environment.apiUrl}${categorie.logo.path}`;
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