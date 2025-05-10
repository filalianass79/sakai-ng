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
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { Agence } from '../../models/agence.model';
import { AgenceService } from '../../services/agence.service';
import { AvatarModule } from 'primeng/avatar';
import { ExportFileService } from '../../../../service/exportFile.service';
import { ImageService } from '../../../../service/image.service';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { DecimalPipe, DatePipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-list-agences-archives',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    TooltipModule,
    AvatarModule,
    TagModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    InputTextModule,
    FormsModule,
    InputSwitchModule,
    FileUploadModule,
    MenuModule,
    SplitButtonModule,
    DividerModule,
    BadgeModule,
    DecimalPipe,
    DatePipe,
    PercentPipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-agences-archives.component.html',
  styleUrls: ['./list-agences-archives.component.scss']
})
export class ListAgenceArchivesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  agences: Agence[] = [];
  selectedagences: Agence[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser:string='';
  menuItems: MenuItem[] = [];
  exportItems: MenuItem[] = [];

  constructor(
    private agenceService: AgenceService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}').username;
  }

  ngOnInit() {
    this.loadagences();
    this.initColumns();
    this.initMenuItems();
  }

  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Agence', type: 'text' },
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

  

  loadagences(): void {
    this.loading = true;
    this.agenceService.getArchivesAgences().subscribe({
      next: (data: Agence[]) => {
        this.agences = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des agences archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les agences archivées'
        });
        this.loading = false;
      }
    });
  }

  viewAgence(agence: Agence): void {
    this.router.navigate(['/dashboard/agences/view-agence', agence.id]);
  }

  activeAgence(agence: Agence): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la agence "${agence.nom}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (agence.id) {
          this.agenceService.activeAgence(agence.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Agence restaurée avec succès'
              });
              this.loadagences();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la agence', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la agence'
              });
            }
          });
        }
      }
    });
  }

  archiveAgence(agence: Agence): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la agence "${agence.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (agence.id) {
          this.agenceService.archiveAgence(agence.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Agence supprimée avec succès'
              });
              this.loadagences();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la agence', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la agence'
              });
            }
          });
        }
      }
    });
  }

  //suppression d'une agence
  deleteAgence(agence: Agence): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la agence "${agence.nom}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (agence.id) {
          this.agenceService.deleteAgence(agence.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Agence supprimée avec succès'
              });
              this.loadagences();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la agence', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la agence'
              });
            }
          });   
        }
      }
    });
  }

  
  deleteSelectedagences() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les agences sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.selectedagences.forEach(agence => {
          this.agenceService.deleteAgence(agence.id!, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Agence supprimée avec succès'  
              });
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la agence', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la agence'
              });
            }
          });
        });
        

        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Agences supprimées',
          life: 3000
        });
        this.selectedagences = [];
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


  getImageUrl(agence: Agence): string {
    this.imageService.getImageByNameAndEntity("agence", agence.id!, "logo")
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
 

  private initMenuItems() {
    this.menuItems = [
      {
        label: 'Options',
        items: [
          {
            label: 'Actualiser',
            icon: 'pi pi-refresh',
            command: () => this.loadagences()
          },
          {
            label: 'Retour aux agences',
            icon: 'pi pi-arrow-left',
            command: () => this.navigateToAgences()
          }
        ]
      }
    ];

    this.exportItems = [
      {
        label: 'Excel',
        icon: 'pi pi-file-excel',
        command: () => this.exportExcel()
      },
      {
        label: 'CSV',
        icon: 'pi pi-file-o',
        command: () => this.exportCSV()
      },
      {
        label: 'PDF',
        icon: 'pi pi-file-pdf',
        command: () => this.exportPdf()
      }
    ];
  }

  navigateToAgences() {
    this.router.navigate(['/parametrageapplication/agence/list-agences']);
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