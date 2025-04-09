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
import { CompanyService } from '../../../service/company.service';
import { Company } from '../../../service/company.service';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { ExportFileService } from '../../../service/exportFile.service';

@Component({
  selector: 'app-list-company-archives',
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
    templateUrl: './list-company-archives.component.html',
  styleUrls: ['./list-company-archives.component.scss']
})
export class ListCompanyArchivesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  companies: Company[] = [];
  selectedCompanies: Company[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];

  constructor(
    private companyService: CompanyService,
    private exportFileService: ExportFileService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadCompanies();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'raisonSociale', header: 'Raison Sociale', type: 'text' },
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


  loadCompanies(): void {
    this.loading = true;
    this.companyService.getArchivesCompanies().subscribe({
      next: (data: Company[]) => {
        this.companies = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des sociétés archivées', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les sociétés archivées'
        });
        this.loading = false;
      }
    });
  }

  viewCompany(company: Company): void {
    this.router.navigate(['/dashboard/companies/view-company', company.id]);
  }

  activeCompany(company: Company): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir restaurer la société "${company.raisonSociale}" ?`,
      header: 'Confirmation de restauration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (company.id) {
          this.companyService.activeCompany(company.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Société restaurée avec succès'
              });
              this.loadCompanies();
            },
            error: (error) => {
              console.error('Erreur lors de la restauration de la société', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de restaurer la société'
              });
            }
          });
        }
      }
    });
  }

  deleteCompany(company: Company): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer définitivement la société "${company.raisonSociale}" ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (company.id) {
          this.companyService.deleteCompany(company.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Société supprimée avec succès'
              });
              this.loadCompanies();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la société', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la société'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedCompanies() {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer définitivement les sociétés sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete logic here
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Sociétés supprimées',
          life: 3000
        });
        this.selectedCompanies = [];
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