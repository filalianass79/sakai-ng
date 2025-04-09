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
import { Modele } from '../../models/modele.model';
import { ModeleService } from '../../services/modele.service';
import { AvatarModule } from 'primeng/avatar';
import { ImageService } from '../../../service/image.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/core/services/auth.service';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { OuiNonPipe } from '../../../../pipe/oui-non.pipe';
@Component({
  selector: 'app-list-modeles',
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
    AvatarModule,
    DecimalPipe,
    DatePipe,
    PercentPipe,
    OuiNonPipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-modeles.component.html',
  styleUrls: ['./list-modeles.component.scss']
})
export class ListmodelesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  modeles: Modele[] = [];
  selectedmodeles: Modele[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser: string = '';

  constructor(
    private modeleService: ModeleService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService
  ) {
    console.log('ListmodelesComponent: Initializing component');
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.username;
      console.log('ListmodelesComponent: Current user:', this.currentUser);
    } else {
      console.warn('ListmodelesComponent: No current user found');
    }
  }

  ngOnInit(): void {
    console.log('ListmodelesComponent: ngOnInit called');
    this.loadmodeles();
    this.initColumns();
  }

  initColumns() {
    console.log('ListmodelesComponent: Initializing columns');
    this.cols = [
      { field: 'nom', header: 'Modele', type: 'text' },
      { field: 'marque', header: 'Marque', type: 'text' },
      { field: 'categorie', header: 'Categorie', type: 'text' },
      { field: 'typeCarburant', header: 'Type de carburant', type: 'text' },
      { field: 'typeTransmission', header: 'Type de transmission', type: 'text' },
      { field: 'nbreSacs', header: 'Nombre de sacs', type: 'integer' },
      { field: 'nbreValises', header: 'Nombre de valises', type: 'integer' },
      { field: 'volumeCoffre', header: 'Volume du coffre', type: 'integer' },
      { field: 'nbrePortes', header: 'Nombre de portes', type: 'integer' },
      { field: 'nbrePlaces', header: 'Nombre de places', type: 'integer' },
      { field: 'nbreKmVidange', header: 'Nombre de km de vidange', type: 'integer' },
      { field: 'nbreJoursVidange', header: 'Nombre de jours de vidange', type: 'integer' },
      { field: 'chaineChangeable', header: 'Chaine changeable', type: 'boolean' },
    ];
    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
    console.log('ListmodelesComponent: Columns initialized:', this.cols);
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  loadmodeles(): void {
    console.log('ListmodelesComponent: Loading models');
    this.loading = true;
    this.modeleService.getActivesModeles().subscribe({
      next: (data: Modele[]) => {
        console.log('ListmodelesComponent: Models loaded successfully:', data.length);
        this.modeles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('ListmodelesComponent: Error loading models:', error);
        if (error.status === 401) {
          console.error('ListmodelesComponent: Authentication error, redirecting to login');
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
            detail: 'Impossible de charger les modeles'
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
    this.loadmodeles();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/modeles/new-modele']);
  }

  editModele(modele: Modele): void {
    this.router.navigate(['/dashboard/modeles/edit-modele', modele.id]);
  }

  viewModele(modele: Modele): void {
    this.router.navigate(['/dashboard/modeles/view-modele', modele.id]);
  }

  deleteModele(modele: Modele): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la modele "${modele.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (modele.id) {
          this.modeleService.archiveModele(modele.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Modele archivée avec succès'
              });
              this.loadmodeles();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la modele', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la modele'
              });
            }
          });
        }
      }
    });
  }

  archiveSelectedmodeles() {
    if (!this.selectedmodeles.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les modeles sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedmodeles) {
              if (e.id) {
                    this.modeleService.archiveModele(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadmodeles();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Modeles supprimées',
                    life: 3000
                  });
                  this.selectedmodeles = [];
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
    
    importModeles(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.modeleService.importModeles(formData).subscribe({
          next: (modeles) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${modeles.length} modeles importées avec succès`
            });
            this.loadmodeles(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des modeles. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }

    getImageUrl(modele: Modele): string {
      
      if (modele.logo?.path) {
        return `${environment.apiUrl}${modele.logo.path}`;
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