import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule, Table } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SocieteService } from '../services/societe.service';
import { Societe } from '../models/societe.model';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ExportFileService } from '../../service/exportFile.service';

@Component({
  selector: 'app-list-societes',
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
  template: `
    <p-toast position="top-center"></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="bg-surface-50 dark:bg-surface-900 p-12 min-h-screen">
      <div class="max-w-8xl mx-auto">
        <p-card styleClass="shadow">
          <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Liste des Sociétés</h1>

          <p-toolbar styleClass="mb-12">
            <ng-template pTemplate="left">
              <p-button 
                label="Nouvelle Société" 
                icon="pi pi-plus" 
                class="mr-2" 
                (onClick)="navigateToAdd()"
              ></p-button>
              <p-button 
                severity="danger" 
                label="Supprimer" 
                icon="pi pi-trash" 
                [outlined]="true"
                (onClick)="archiveSelectedSocietes()" 
                [disabled]="!selectedSocietes || !selectedSocietes.length"
              ></p-button>
            </ng-template>

            <ng-template pTemplate="right">
              <p-fileUpload 
                mode="basic" 
                accept="image/*" 
                [maxFileSize]="1000000" 
                label="Import" 
                chooseLabel="Import" 
                class="mr-2 inline-block"
                [chooseButtonProps]="{ severity: 'secondary' }"
                auto customUpload
              ></p-fileUpload>
              <p-button 
                class="mr-2" 
                tooltipPosition="bottom" 
                pTooltip="CSV" 
                icon="pi pi-file-o" 
                severity="help" 
                (onClick)="exportCSV()"
              ></p-button>
              <p-button 
                class="mr-2" 
                tooltipPosition="bottom" 
                pTooltip="XLS" 
                icon="pi pi-file-excel" 
                severity="success" 
                (onClick)="exportExcel()"
              ></p-button>
              <p-button 
                class="mr-2" 
                tooltipPosition="bottom" 
                pTooltip="PDF" 
                icon="pi pi-file-pdf" 
                severity="danger" 
                (onClick)="exportPdf()"
              ></p-button>
            </ng-template>
          </p-toolbar>

          <p-table 
            #dt
            [value]="societes" 
            [paginator]="true" 
            [rows]="10"
            [showCurrentPageReport]="true"
            [tableStyle]="{ 'min-width': '35rem' }"
            [(selection)]="selectedSocietes"
            [rowHover]="true"
            dataKey="id"
            [loading]="loading"
            [globalFilterFields]="['raisonSocial', 'email', 'ville', 'fixe']"
            [sortMode]="'multiple'"
            currentPageReportTemplate="Affichage {first} à {last} sur {totalRecords} sociétés"
            [rowsPerPageOptions]="[10, 25, 50]"
            styleClass="p-datatable-striped p-datatable-sm"
            [reorderableColumns]="true"
            [resizableColumns]="true"
            stateStorage="local"
            stateKey="societes-table-state"
          >
            <ng-template pTemplate="caption">
              <div class="flex items-center justify-between">
                <p-button 
                  [outlined]="true" 
                  icon="pi pi-filter-slash" 
                  label="Clear" 
                  (click)="clear(dt)"
                ></p-button>
                
                <p-multiSelect
                  [options]="cols"
                  [(ngModel)]="selectedColumns"
                  optionLabel="header"
                  selectedItemsLabel="{0} colonnes sélectionnées"
                  [style]="{ minWidth: '200px' }"
                  placeholder="Choisir les colonnes"
                ></p-multiSelect>

                <div class="flex items-center justify-between">
                  <div class="mr-2" *ngIf="checked">
                    Masquer filtre
                  </div>
                  <div class="mr-2" *ngIf="!checked">
                    Afficher filtre
                  </div>
                  <p-toggleSwitch [(ngModel)]="checked"></p-toggleSwitch>
                </div>

                <button
                  pButton
                  pRipple
                  icon="pi pi-sync"
                  class="p-button-help mr-2"
                  (click)="resetSort()"
                ></button>

                <p-iconfield>
                <p-inputicon styleClass="pi pi-search" />
                <input type="text" pInputText [(ngModel)]="globalFilter" (ngModelChange)="dt.filterGlobal($event, 'contains')" placeholder="Rechercher..." />
                </p-iconfield>
              </div>
            </ng-template>

            <ng-template pTemplate="header">
              <tr>
                <th style="width: 4rem">
                  <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                </th>
                <th *ngFor="let col of selectedColumns" 
                    [pSortableColumn]="col.field"
                    pResizableColumn>
                  {{ col.header }}
                  <p-sortIcon [field]="col.field"></p-sortIcon>
                  <p-columnFilter
                    *ngIf="checked"
                    [type]="col.type"
                    [field]="col.field"
                    display="menu"
                  ></p-columnFilter>
                </th>
                <th>Actions</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-societe>
              <tr>
                <td>
                  <p-tableCheckbox [value]="societe"></p-tableCheckbox>
                </td>
                <td *ngFor="let col of selectedColumns">
                  <ng-container *ngIf="col.type === 'image'; else textContent">
                    <img *ngIf="societe[col.field]" [src]="societe[col.field]" alt="Logo" style="width: 50px; height: 50px; object-fit: contain;" />
                    <img *ngIf="!societe[col.field]" src="assets/images/logo.png" alt="Logo par défaut" style="width: 50px; height: 50px; object-fit: contain;" />
                  </ng-container>
                  <ng-template #textContent>
                    {{ societe[col.field] }}
                  </ng-template>
                </td>
                <td>
                  <div class="flex gap-2">
                    <p-button 
                      icon="pi pi-pencil" 
                      severity="info" 
                      (onClick)="editSociete(societe)"
                      pTooltip="Modifier"
                      [rounded]="true"
                      [text]="true"
                      [raised]="true"
                    ></p-button>
                    <p-button 
                      icon="pi pi-trash" 
                      severity="danger" 
                      (onClick)="confirmDelete(societe)"
                      pTooltip="Supprimer"
                      [rounded]="true"
                      [text]="true"
                      [raised]="true"
                    ></p-button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="7" class="text-center p-12">Aucune société trouvée.</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="summary">
              <div class="flex items-center justify-between">
                Total: {{ societes ? societes.length : 0 }} sociétés
              </div>
            </ng-template>
          </p-table>
        </p-card>
      </div>
    </div>
  `
})
export class ListSocietes implements OnInit {
  @ViewChild('dt') dt!: Table;
  societes: Societe[] = [];
  selectedSocietes: Societe[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];

  constructor(
    private societeService: SocieteService,
    private exportFileService: ExportFileService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadSocietes();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'logo', header: 'Logo', type: 'image' },
      { field: 'raisonSocial', header: 'Raison Sociale', type: 'text' },
      { field: 'activite', header: 'Activité', type: 'text' },
      { field: 'formeJuridique', header: 'Forme Juridique', type: 'text' },
      { field: 'ville', header: 'Ville', type: 'text' },
      { field: 'email', header: 'Email', type: 'text' },
      { field: 'fixe', header: 'Téléphone', type: 'text' }
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

  loadSocietes() {
    this.loading = true;
    this.societeService.getActivesSocietes().subscribe({
      next: (data) => {
        this.societes = data;
        if (this.societes.length === 0) {
          this.createTestSociete();
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les sociétés',
          life: 3000
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
    this.router.navigate(['/dashboard/societes/new-societe']);
  }

  editSociete(societe: Societe) {
    this.router.navigate(['/dashboard/societes/edit-societe', societe.id]);
  }

  confirmDelete(societe: Societe) {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer la société ${societe.raisonSocial} ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => this.archiveSociete(societe)
    });
  }

  archiveSociete(societe: Societe) {
    if (societe.id) {
      this.loading = true;
      this.societeService.archiveSociete(societe.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Société supprimée avec succès',
            life: 3000
          });
          this.loadSocietes();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer la société',
            life: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  
archiveSelectedSocietes() {
  if (!this.selectedSocietes.length) return;
  this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les sociétés sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         for (var e of this.selectedSocietes) {
            if (e.id) {
                  this.societeService.archiveSociete(e.id).subscribe(
                      (data) => {
                          console.log(data);
                          this.messageService.add({
                              severity: 'success',
                              summary: 'Successful',
                              detail: 'societes supprimés',
                              life: 3000,
                          });
                      },
                      (error) => {
                          console.log(error);
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Error',
                              detail: 'societes non supprimés',
                              life: 3000,
                          });
                      }
                  );
            }
              this.loadSocietes();
              this.messageService.add({
                  severity: 'success',
                  summary: 'Succès',
                  detail: 'Sociétés supprimées',
                  life: 3000
                });
                this.selectedSocietes = [];
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

  createTestSociete() {
    const testSociete: Societe = {
      raisonSocial: 'Société Test',
      activite: 'Développement logiciel',
      formeJuridique: 'SARL',
      dateDeCreation: new Date(),
      idFiscal: 'TEST123456',
      taxeProfessionnelle: 'TP123456',
      registreDeCommerce: 'RC123456',
      villeRegistreDeCommerce: 'Casablanca',
      ice: 'ICE123456789',
      adresse: '123 Avenue Test',
      ville: 'Casablanca',
      email: 'contact@societe-test.com',
      fixe: '0522123456',
      fax: '0522123457',
      gsm: '0661123456',
      cnss: 'CNSS123456',
      logo: '',
      papierEnTete: '',
      enTete: '',
      piedPage: '',
      isVisible: true
    };

    this.societeService.createSociete(testSociete).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Information',
          detail: 'Une société de test a été créée automatiquement',
          life: 3000
        });
        this.loadSocietes();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de créer la société de test',
          life: 3000
        });
      }
    });
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