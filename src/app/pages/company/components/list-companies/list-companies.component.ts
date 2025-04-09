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
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { ExportFileService } from '../../../service/exportFile.service';

@Component({
  selector: 'app-list-companies',
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
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.scss']
})
export class ListCompaniesComponent implements OnInit {
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    this.companyService.getActivesCompanies().subscribe({
      next: (data) => {
        this.companies = data;

        if (this.companies.length === 0) {
          this.createTestCompanies();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sociétés', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les sociétés'
        });
        this.loading = false;
      }
    });
  }

 /* getImageUrl(company:Company): string {
    
    if(company.logo){
    this.imageService.getImageByNameAndEntity(company.logo?.entityType, company.logo?.entityId, company.logo?.name)
      .subscribe({
        next: (image) => {
          return image.url;
        },
        error: (error) => {
          // Pas d'image existante, ce n'est pas une erreur
          return 'assets/images/logo.png ';
        }
      });
  }
  return 'assets/images/logo.png ';
}*/

  createTestCompanies(): void {
    const testCompanies = [
      {
        raisonSociale: 'Société Test 1',
        activite: 'Consulting IT',
        formeJuridique: 'SARL',
        email: 'contact@test1.com',
        adresse: '123 Rue du Test',
        ville: 'Casablanca',
        fixe: '0522111111',
        gsm: '0611111111',
        isVisible: true
      },
      {
        raisonSociale: 'Société Test 2',
        activite: 'Commerce',
        formeJuridique: 'SA',
        email: 'contact@test2.com',
        adresse: '456 Avenue du Commerce',
        ville: 'Rabat',
        fixe: '0522222222',
        gsm: '0622222222',
        isVisible: true
      },
      {
        raisonSociale: 'Société Test 3',
        activite: 'Services',
        formeJuridique: 'SAS',
        email: 'contact@test3.com',
        adresse: '789 Boulevard des Services',
        ville: 'Tanger',
        fixe: '0522333333',
        gsm: '0633333333',
        isVisible: false
      }
    ];

    testCompanies.forEach((company, index) => {
      this.companyService.createCompany(company).subscribe({
        next: (createdCompany) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Société test ${index + 1} créée avec succès`
          });
          this.companies.push(createdCompany);
        },
        error: (error) => {
          console.error(`Erreur lors de la création de la société test ${index + 1}`, error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de créer la société test ${index + 1}`
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
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/companies/new-company']);
  }

 

  editCompany(company: Company): void {
    this.router.navigate(['/dashboard/companies/edit-company', company.id]);
  }

  viewCompany(company: Company): void {
    this.router.navigate(['/dashboard/companies/view-company', company.id]);
  }

  archiveCompany(company: Company): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir archiver la société "${company.raisonSociale}" ?`,
      header: 'Confirmation d\'archivage',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (company.id) {
          this.companyService.archiveCompany(company.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Société archivée avec succès'
              });
              this.loadCompanies();
            },
            error: (error) => {
              console.error('Erreur lors de l\'archivage de la société', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible d\'archiver la société'
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

  archiveSelectedCompanies() {
    if (!this.selectedCompanies.length) return;
    this.confirmationService.confirm({
        message: 'Êtes-vous sûr de vouloir supprimer les sociétés sélectionnées ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
           for (var e of this.selectedCompanies) {
              if (e.id) {
                    this.companyService.archiveCompany(e.id).subscribe(
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
                this.loadCompanies();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Sociétés supprimées',
                    life: 3000
                  });
                  this.selectedCompanies = [];
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
    
    importCompanies(event: any): void {
      if (event.files && event.files.length > 0) {
        const file = event.files[0];
        const formData = new FormData();
        formData.append('file', file);
    
        this.loading = true;
        this.companyService.importCompanies(formData).subscribe({
          next: (companies) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `${companies.length} sociétés importées avec succès`
            });
            this.loadCompanies(); // Recharger la liste
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors de l\'importation', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de l\'importation des sociétés. Vérifiez le format du fichier Excel.'
            });
            this.loading = false;
          }
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