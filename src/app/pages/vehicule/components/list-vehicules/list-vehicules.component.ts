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
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule.model';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { ExportFileService } from '../../../service/exportFile.service';

@Component({
  selector: 'app-list-vehicules',
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
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-vehicules.component.html',
  styleUrls: ['./list-vehicules.component.scss']
})
export class ListVehiculesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  vehicules: Vehicule[] = [];
  selectedVehicules: Vehicule[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];

  constructor(
    private vehiculeService: VehiculeService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadVehicules();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'immatriculation', header: 'Immatriculation', type: 'text' },
      { field: 'marqueNom', header: 'Marque', type: 'text' },
      { field: 'modeleNom', header: 'Modèle', type: 'text' },
      { field: 'categorieNom', header: 'Catégorie', type: 'text' },
      { field: 'couleur', header: 'Couleur', type: 'text' },
      { field: 'carburant', header: 'Carburant', type: 'text' },
      { field: 'vendu', header: 'Vendu', type: 'boolean' }
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

  loadVehicules(): void {
    this.loading = true;
    this.vehiculeService.getActiveVehicules().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des véhicules', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les véhicules'
        });
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
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/vehicules/new-vehicule']);
  }

  editVehicule(vehicule: Vehicule): void {
    this.router.navigate(['/dashboard/vehicules/edit-vehicule', vehicule.id]);
  }

  viewVehicule(vehicule: Vehicule): void {
    this.router.navigate(['/dashboard/vehicules/view-vehicule', vehicule.id]);
  }

  archiveVehicule(vehicule: Vehicule): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver le véhicule "${vehicule.immatriculation}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (vehicule.id) {
          // Utilisez l'identifiant de l'utilisateur connecté
          const archiverPar = 'admin'; // À remplacer par l'ID de l'utilisateur connecté
          
          this.vehiculeService.archiveVehicule(vehicule.id, archiverPar).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Véhicule archivé avec succès'
              });
              this.loadVehicules();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage du véhicule', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver le véhicule'
              });
            }
          });
        }
      }
    });
  }

  deleteVehicule(vehicule: Vehicule): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer le véhicule "${vehicule.immatriculation}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (vehicule.id) {
          this.vehiculeService.deleteVehicule(vehicule.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Véhicule supprimé avec succès'
              });
              this.vehicules = this.vehicules.filter(v => v.id !== vehicule.id);
            },
            error: (error) => {
              console.error('Erreur lors de la suppression du véhicule', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer le véhicule'
              });
            }
          });
        }
      }
    });
  }

  archiveSelectedVehicules() {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver les ${this.selectedVehicules.length} véhicules sélectionnés ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const archiverPar = 'admin'; // À remplacer par l'ID de l'utilisateur connecté
        
        // Créer un tableau de promesses pour chaque appel d'archivage
        const archivePromises = this.selectedVehicules.map(vehicule => {
          if (vehicule.id) {
            return this.vehiculeService.archiveVehicule(vehicule.id, archiverPar).toPromise();
          }
          return Promise.resolve();
        });

        // Exécuter toutes les promesses
        Promise.all(archivePromises)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${this.selectedVehicules.length} véhicules archivés avec succès`
            });
            this.selectedVehicules = [];
            this.loadVehicules();
          })
          .catch(error => {
            console.error('Erreur lors de l\'archivage des véhicules', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Une erreur est survenue lors de l\'archivage des véhicules'
            });
          });
      }
    });
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

  importVehicules(event: any): void {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      // Ici, vous devrez implémenter un service d'importation
      // this.vehiculeService.importVehicules(formData).subscribe({...});
      
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Fonctionnalité d\'importation non implémentée'
      });
    }
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