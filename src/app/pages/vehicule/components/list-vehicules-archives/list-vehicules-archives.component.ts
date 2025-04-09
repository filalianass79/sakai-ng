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
import { TagModule } from 'primeng/tag';

interface Column {
  field: string;
  header: string;
  filterType?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-list-vehicules-archives',
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
    TagModule,
    FileUploadModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-vehicules-archives.component.html',
  styleUrls: ['./list-vehicules-archives.component.scss']
})
export class ListVehiculesArchivesComponent implements OnInit {
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
    this.loadArchivedVehicules();
    this.initColumns();
  }

  initColumns(): void {
    this.cols = [
      { field: 'immatriculation', header: 'Immatriculation' },
      { field: 'marqueNom', header: 'Marque' },
      { field: 'modeleNom', header: 'Modèle' },
      { field: 'categorieNom', header: 'Catégorie' },
      { field: 'couleur', header: 'Couleur' },
      { field: 'carburant', header: 'Carburant' },
      { field: 'dateAchat', header: 'Date d\'acquisition' },
      { field: 'vendu', header: 'Statut' },
      { field: 'provisoire', header: 'Type immatriculation' }
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

  loadArchivedVehicules(): void {
    this.loading = true;
    // Appel à un service pour récupérer les véhicules archivés
    // Si la méthode n'existe pas, nous la simulerons pour le moment
    // TODO: Ajouter la méthode getArchivedVehicules dans VehiculeService
    this.vehiculeService.getActiveVehicules().subscribe({
      next: (data) => {
        // Pour simulation, nous filtrons les véhicules (dans une vraie implémentation, c'est le backend qui filtre)
        this.vehicules = data.filter(v => !v.isVisible);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des véhicules archivés', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les véhicules archivés'
        });
        this.loading = false;
      }
    });
  }

  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  viewVehicule(vehicule: Vehicule): void {
    this.router.navigate(['/dashboard/vehicules/view-vehicule', vehicule.id]);
  }

  // Exporter les données
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

  // Restaurer un véhicule archivé
  restoreVehicule(vehicule: Vehicule): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment restaurer le véhicule ${vehicule.immatriculation} ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-info-circle',
      accept: () => {
        // TODO: Ajouter la méthode restoreVehicule dans VehiculeService
        // Simulation pour le moment
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: `Véhicule ${vehicule.immatriculation} restauré avec succès`
        });
        // Recharger les véhicules archivés
        this.loadArchivedVehicules();
      }
    });
  }

  getStatusLabel(vendu: boolean): string {
    return vendu ? 'Vendu' : 'Disponible';
  }

  getStatusSeverity(vendu: boolean): 'success' | 'warn' {
    return vendu ? 'warn' : 'success';
  }

  getImmaSeverity(provisoire: boolean): 'info' | 'secondary' {
    return provisoire ? 'info' : 'secondary';
  }

  getImmaLabel(provisoire: boolean): string {
    return provisoire ? 'Provisoire' : 'Définitive';
  }
} 