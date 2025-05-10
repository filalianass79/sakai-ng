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
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { Agence } from '../../models/agence.model';
import { AgenceService } from '../../services/agence.service';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../../../../../../environments/environment';
import { ExportFileService } from '../../../../service/exportFile.service';
import { AuthService } from '../../../../auth/core/services/auth.service';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { OuiNonPipe } from '../../../../../pipe/oui-non.pipe';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-list-agences',
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
    MenuModule,
    BadgeModule,
    FormsModule,
    SplitButtonModule,
    InputSwitchModule,
    FileUploadModule,
    AvatarModule,
    TagModule,
    BadgeModule,
    DividerModule,
    DecimalPipe,
    DatePipe,
    PercentPipe,
    OuiNonPipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-agences.component.html',
  styleUrls: ['./list-agences.component.scss']
})
export class ListagencesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  agences: Agence[] = [];
  selectedagences: Agence[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser: string = '';
  menuItems: MenuItem[] = [];
  exportItems: MenuItem[] = [];

  constructor(
    private agenceService: AgenceService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService
  ) {
    console.log('ListagencesComponent: Initializing component');
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.username;
      console.log('ListagencesComponent: Current user:', this.currentUser);
    } else {
      console.warn('ListagencesComponent: No current user found');
    }
  }

  ngOnInit(): void {
    console.log('ListagencesComponent: ngOnInit called');
    this.loadagences();
    this.initColumns();
    this.initMenuItems();
  }

  initColumns() {
    this.cols = [
      { field: 'nom', header: 'Agence', type: 'text' },
      { field: 'adresse', header: 'Adresse', type: 'text' },
      { field: 'telephone', header: 'Téléphone', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'responsable', header: 'Responsable', type: 'text' },
      { field: 'company', header: 'Entreprise', type: 'text' },
      { field: 'description', header: 'Description', type: 'text' },
    ];

    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
    console.log('ListagencesComponent: Columns initialized:', this.cols);
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  loadagences(): void {
    console.log('ListagencesComponent: Loading models');
    this.loading = true;
    this.agenceService.getActivesAgences().subscribe({
      next: (data: Agence[]) => {
        console.log('ListagencesComponent: Models loaded successfully:', data.length);
        this.agences = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('ListagencesComponent: Error loading models:', error);
        if (error.status === 401) {
          console.error('ListagencesComponent: Authentication error, redirecting to login');
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'authentification',
            detail: 'Veuillez vous reconnecter'
          });
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger les agences'
          });
        }
        this.loading = false;
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
    this.loadagences();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/parametrageapplications/agences/new-agence']);
  }

  editAgence(agence: Agence) {
    this.router.navigate(['/dashboard/parametrageapplications/agences/edit-agence', agence.id]);
  }

  viewAgence(agence: Agence) {
    this.router.navigate(['/dashboard/parametrageapplications/agences/view-agence', agence.id]);
  }

  deleteAgence(agence: Agence): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la agence "${agence.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (agence.id) {
          this.agenceService.archiveAgence(agence.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Agence archivée avec succès'
              });
              this.loadagences();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la agence', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la agence'
              });
            }
          });
        }
      }
    });
  }

  archiveSelectedagences() {
    if (!this.selectedagences.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les agences sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedagences) {
              if (e.id) {
                    this.agenceService.archiveAgence(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadagences();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Agences supprimées',
                    life: 3000
                  });
                  this.selectedagences = [];
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
    
    importAgences(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.agenceService.importAgences(formData).subscribe({
          next: (agences) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${agences.length} agences importées avec succès`
            });
            this.loadagences(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des agences. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }

    getImageUrl(agence: Agence): string {
      
      if (agence.logo?.path) {
        return `${environment.apiUrl}${agence.logo.path}`;
      }
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
              label: 'Voir les archives',
              icon: 'pi pi-folder',
              command: () => this.router.navigate(['/parametrageapplication/agence/list-agences-archives'])
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