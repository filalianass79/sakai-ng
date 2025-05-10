import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { DataViewModule } from 'primeng/dataview';
import { Salarie } from '../../models/salarie.model';
import { SalarieService } from '../../services/salarie.service';
import { AvatarModule } from 'primeng/avatar';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { OuiNonPipe } from '../../../../../pipe/oui-non.pipe';
import { AuthService } from '../../../../auth/core/services/auth.service';
import { ExportFileService } from '../../../../service/exportFile.service';
import { ImageService } from '../../../../service/image.service';
import { environment } from '../../../../../../environments/environment';
import { SituationFamiliale } from '../../models/enum/situation-familiale.enum';
import { TypeContrat } from '../../models/enum/type-contrat.enum';
import { FonctionSalarie } from '../../models/enum/fonction-salarie.enum';
import { QualiteSalarie } from '../../models/enum/qualite-salarie.enum';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-list-salaries',
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
    SelectModule,
    FormsModule,
    ToggleSwitchModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    TagModule,
    AvatarModule,
    DataViewModule,
    DecimalPipe,
    DatePipe,
    PercentPipe,
    OuiNonPipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-salaries.component.html',
  styleUrls: ['./list-salaries.component.scss']
})
export class ListsalariesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  salaries: Salarie[] = [];
  selectedsalaries: Salarie[] = [];
  loading = false;
  globalFilter = '';
  checked = false;
  checked1 = false; 
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];
  currentUser: string = '';
  menuItems: MenuItem[] = [];
  exportItems: MenuItem[] = [];
  
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  filterValue: string = '';

  constructor(
    private salarieService: SalarieService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private imageService: ImageService,
    private authService: AuthService
  ) {
    console.log('ListsalariesComponent: Initializing component');
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user.username;
      console.log('ListsalariesComponent: Current user:', this.currentUser);
    } else {
      console.warn('ListsalariesComponent: No current user found');
    }
  }

  ngOnInit(): void {
    console.log('ListsalariesComponent: ngOnInit called');
    this.loadsalaries();
    //if salaries is empty, redirect to new-salarie
    
  
   

    this.initColumns();
    this.initMenuItems();
    this.sortOptions = [
      { label: 'Trier par nom', value: 'nom' },
      { label: 'Trier par prénom', value: 'prenom' },
      { label: 'Trier par immatriculation', value: 'immatriculation' },
      { label: 'Trier par fonction', value: 'fonction' },
      { label: 'Trier par agence', value: 'agence' }

  ];
  }

  initColumns() {
    console.log('ListsalariesComponent: Initializing columns');
    this.cols = [
      { field: 'immatriculation', header: 'Immatriculation', type: 'text' },
      { field: 'nom', header: 'Nom', type: 'text' },
      { field: 'prenom', header: 'Prénom', type: 'text' },
      { field: 'cin', header: 'CIN', type: 'text' },
      { field: 'cnss', header: 'CNSS', type: 'text' },
      { field: 'adresse', header: 'Adresse', type: 'text' },
      { field: 'ville', header: 'Ville', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'fixe', header: 'Téléphone fixe', type: 'text' },
      { field: 'mobile', header: 'Téléphone mobile', type: 'text' },
      { field: 'qualiteSalarie', header: 'Qualité de salarié', type: 'text' },
      { field: 'typeContrat', header: 'Type de contrat', type: 'text' },
      { field: 'fonction', header: 'Fonction', type: 'text' },
      { field: 'dateDeclarationCnss', header: 'Date de déclaration CNSS', type: 'date' },
      { field: 'dateNaissance', header: 'Date de naissance', type: 'date' },
      { field: 'situationFamiliale', header: 'Situation familiale', type: 'text' },
      { field: 'agence', header: 'Agence', type: 'text' },
      { field: 'company', header: 'Société', type: 'text' },
     

    ];
    this._selectedColumns =[
      { field: 'immatriculation', header: 'Immatriculation', type: 'text' },
      { field: 'nom', header: 'Salarie', type: 'text' },
      { field: 'prenom', header: 'Prénom', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'mobile', header: 'Téléphone mobile', type: 'text' }, 
    ];
    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));
    console.log('ListsalariesComponent: Columns initialized:', this.cols);
  }

  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  loadsalaries(): void {
    console.log('ListsalariesComponent: Loading models');
    this.loading = true;
    this.salarieService.getActivesSalaries().subscribe({
      next: (data: Salarie[]) => {
        console.log('ListsalariesComponent: Models loaded successfully:', data.length);
        this.salaries = data;
        this.loading = false;
        if (this.salaries.length === 0) {
          this.navigateToAdd;
        }
      },
      error: (error) => {
        console.error('ListsalariesComponent: Error loading models:', error);
        if (error.status === 401) {
          console.error('ListsalariesComponent: Authentication error, redirecting to login');
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
            detail: 'Impossible de charger les salaries'
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
    this.loadsalaries();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/parametrageapplications/salaries/new-salarie']);
  }

  editSalarie(salarie: Salarie): void {
    this.router.navigate(['/dashboard/parametrageapplications/salaries/edit-salarie', salarie.id]);
  }

  viewSalarie(salarie: Salarie): void {
    this.router.navigate(['/dashboard/parametrageapplications/salaries/view-salarie', salarie.id]);
  }

  deleteSalarie(salarie: Salarie): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la salarie "${salarie.nom}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (salarie.id) {
          this.salarieService.archiveSalarie(salarie.id, this.currentUser).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Salarie archivée avec succès'
              });
              this.loadsalaries();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la salarie', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la salarie'
              });
            }
          });
        }
      }
    });
  }

  archiveSelectedsalaries() {
    if (!this.selectedsalaries.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les salaries sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedsalaries) {
              if (e.id) {
                    this.salarieService.archiveSalarie(e.id, this.currentUser).subscribe(
                        () => {  
                        }
                    );
              }
                this.loadsalaries();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Salaries supprimées',
                    life: 3000
                  });
                  this.selectedsalaries = [];
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
    
    importSalaries(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.salarieService.importSalaries(formData).subscribe({
          next: (salaries) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${salaries.length} salaries importées avec succès`
            });
            this.loadsalaries(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des salaries. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
        });
      }
    }

    getImageUrl(salarie: Salarie): string {
      
      if (salarie.photo?.path) {
        return `${environment.apiUrl}${salarie.photo.path}`;
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
              command: () => this.loadsalaries()
            },
            {
              label: 'Voir les archives',
              icon: 'pi pi-folder',
              command: () => this.router.navigate(['/parametrageapplication/agence/list-agences-archives'])
            },
            {
              separator: true
            },
            {
              label: 'Importer Excel',
              icon: 'pi pi-upload',
              command: () => document.getElementById('hiddenFileInput')?.click()
            },
            {
              separator: true
            },
          
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
    onSortChange(event: any) {
      let value = event.value;
      if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
      } else {
        this.sortOrder = 1;
        this.sortField = value;
      }
      // Tri effectif du tableau salaries
      this.salaries = [...this.salaries].sort((a, b) => {
        const fieldA = ((a as any)[this.sortField] || '').toString().toLowerCase();
        const fieldB = ((b as any)[this.sortField] || '').toString().toLowerCase();
        if (fieldA < fieldB) return -1 * this.sortOrder;
        if (fieldA > fieldB) return 1 * this.sortOrder;
        return 0;
      });
    }
  getSeverity(salarie: Salarie) {
    switch (salarie.fonction) {
        case FonctionSalarie.DIRECTEUR:
            return 'success';

        case FonctionSalarie.COMMERCIAL:
            return 'warn';

        case FonctionSalarie.TECHNICIEN:
            return 'danger';

        default:
            return 'info';
    }
};

get filteredSalaries(): Salarie[] {
  if (!this.filterValue) return this.salaries;
  const filter = this.filterValue.toLowerCase();
  return this.salaries.filter(salarie =>
    (salarie.nom || '').toLowerCase().includes(filter) ||
    (salarie.prenom || '').toLowerCase().includes(filter) ||
    (salarie.immatriculation || '').toLowerCase().includes(filter) ||
    (salarie.email || '').toLowerCase().includes(filter) ||
    (salarie.cin || '').toLowerCase().includes(filter) ||
    (salarie.cnss || '').toLowerCase().includes(filter) ||
    (salarie.gsm || '').toLowerCase().includes(filter) ||
    (salarie.gsmp || '').toLowerCase().includes(filter) ||
    (salarie.fonction || '').toLowerCase().includes(filter)
  );
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