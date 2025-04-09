import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { UserService } from '../../../pages/auth/core/services/user.service';
import { User } from '../../../pages/auth/core/models/user.model';
import { MessageService, ConfirmationService} from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Table } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { get } from 'lodash';
import { OuiNonPipe } from '../../../pipe/oui-non.pipe';
import { ExportFileService } from '../../service/exportFile.service';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToggleSwitchModule,
    TooltipModule,
    ToastModule,
    ToolbarModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    ConfirmDialogModule,
    InputTextModule,
    InputSwitchModule,
    FileUploadModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    OuiNonPipe
  ],

providers: [MessageService, ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <p-toast position="top-center"></p-toast>
    <p-confirmDialog></p-confirmDialog>
    

<div class="card">
    <p-toast />
              <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Gestion des Utilisateurs</h1>

    <p-toolbar styleClass="mb-12">
        <ng-template #start>
            <p-button label="New" icon="pi pi-plus" class="mr-2" (onClick)="onAddUser()" />
            <p-button severity="danger" label="Delete" icon="pi pi-trash" outlined (onClick)="deleteSelectedusers()" [disabled]="!selectedusers || !selectedusers.length" />
        </ng-template>

        <ng-template #end>
            <p-fileUpload mode="basic" accept="image/*" [maxFileSize]="1000000" label="Import" chooseLabel="Import" auto customUpload class="mr-2 inline-block" [chooseButtonProps]="{ severity: 'secondary' }" />
            <p-button  class="mr-2" tooltipPosition="bottom" pTooltip="CSV" icon="pi pi-file-o" severity="help" (onClick)="exportCSV()" />
            <p-button  class="mr-2" tooltipPosition="bottom" pTooltip="XLS" icon="pi pi-file-excel" severity="success" (onClick)="exportExcel()" />
            <p-button  class="mr-2" tooltipPosition="bottom" pTooltip="Pdf" icon="pi pi-file-pdf" severity="danger" (onClick)="exportPdf()" />
        </ng-template>
    </p-toolbar>

    <p-table
        #dt
        [value]="filteredUsers"
        [rows]="10"
        [columns]="cols"
        [paginator]="true"
        responsiveLayout="scroll"
        [globalFilterFields]="['username', 'email', 'firstName', 'lastName']"
        [tableStyle]="{ 'min-width': '75rem' }"
        [(selection)]="selectedusers"
        [rowHover]="true"
        dataKey="id"
        currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} utilisateurs"
        [showCurrentPageReport]="true"
        [showGlobalFilter]="true"
        [sortMode]="'multiple'"
        [loading]="loading"
        [globalFilterMatchMode]="'contains'"
        [filterDelay]="0"
        styleClass="datatable-gridlines p-datatable-striped p-datatable-sm"
        [reorderableColumns]="true"
        [resizableColumns]="true"
        stateStorage="local"
        stateKey="stated-local"
    >
        <ng-template #caption>
            <div class="flex items-center justify-between">
                <p-button [outlined]="true" icon="pi pi-filter-slash" label="Clear" (click)="clear(dt)" />
                <p-multiSelect
                        [options]="cols"
                        [(ngModel)]="selectedColumns"
                        optionLabel="header"
                        selectedItemsLabel="{0} columns selected"
                        [style]="{ minWidth: '200px' }"
                        placeholder="Choose Columns"
                    ></p-multiSelect>

                <div class="flex items-center justify-between">
                    <div class="mr-2" *ngIf="checked">
                        Masquer filtre
                    </div>
                    <div class="mr-2" *ngIf="!checked">
                        Afficher filter
                    </div>
                <p-toggleswitch [(ngModel)]="checked" />
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
            <tr class="bg-black text-white">
            <th style="width: 2.5rem">
                <span class="pi pi-slack"></span>
            </th>
            <th style="width: 4rem">
                <p-tableHeaderCheckbox />
            </th>
              <th
                        *ngFor="let col of selectedColumns"
                        [pSortableColumn]="col.field"
                        pResizableColumn
                    >
                        {{ col.header }}
                        <p-sortIcon [field]="col.field"></p-sortIcon>
                        <div *ngIf="col.type === 'text'">
                            <p-columnFilter
                                *ngIf="checked"
                                type="text"
                                [field]="col.field"
                                display="menu"
                                class="ml-auto"
                            ></p-columnFilter>
                        </div>
                        <div *ngIf="col.type === 'date'">
                            <p-columnFilter
                                *ngIf="checked"
                                type="date"
                                [field]="col.field"
                                display="menu"
                            ></p-columnFilter>
                        </div>

                       
                        <div *ngIf="col.type === 'number'">
                            <p-columnFilter
                                *ngIf="checked"
                                type="numeric"
                                [field]="col.field"
                                display="menu"
                            ></p-columnFilter>
                        </div>
                       
                        <div *ngIf="col.type === 'boolean'">
                            <p-columnFilter
                                *ngIf="checked"
                                type="boolean"
                                [field]="col.field"
                                display="menu"
                            ></p-columnFilter>
                        </div>

                        <div *ngIf="col.type === 'tag'">
                            <p-columnFilter
                                *ngIf="checked"
                                type="text"
                                [field]="col.field"
                                display="menu"
                            >
                                <ng-template pTemplate="filter" let-value let-filter="filterCallback">
                                    <p-multiselect
                                        [(ngModel)]="selectedRoles"
                                        [options]="roles"
                                        (onChange)="filterRoles($event, col.field)"
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Sélectionner les rôles"
                                        class="w-full"
                                    ></p-multiselect>
                                </ng-template>
                            </p-columnFilter>
                        </div>
                    </th>
              <th>Actions</th>
            </tr>
          </ng-template>
            <ng-template pTemplate="body" let-user 
                        let-index="rowIndex"
                        let-rowData
                        let-columns="columns"
            >
            <tr     [pReorderableRow]="index"
                    [pContextMenuRow]="user"
                    [pSelectableRow]="rowData">
            <td>
                <span class="pi pi-slack" pReorderableRowHandle></span>
            </td>
            <td>
                <p-tableCheckbox style="width: 2rem" [value]="user" />
            </td>
            <td *ngFor="let col of selectedColumns">
                        <div *ngIf="col.type === 'text'" class="text-left">
                            {{ _cell(rowData, col.field) }}
                        </div>
                     
                        <div *ngIf="col.type === 'date'" class="text-left">
                            {{ _cell(rowData, col.field) | date: col.format }}
                        </div>
                        <div *ngIf="col.type === 'number'" class="text-center">
                            {{ _cell(rowData, col.field) | number: "1.0-0" }}
                        </div>

                        <div *ngIf="col.type === 'tag'" class="text-center">
                            <p-tag  *ngFor="let role of _cell(rowData, col.field)"
                                     [value]="formatRole(role)"
                                    [severity]="getRoleSeverity(role)" />
                        </div>

                        <div *ngIf="col.type === 'boolean'" class="text-center">
                            {{ _cell(rowData, col.field) | ouiNon }}
                            <i
                                class="pi"
                                [ngClass]="{
                                    'true-icon pi-check-circle': _cell(
                                        rowData,
                                        col.field
                                    ),
                                    'false-icon pi-times-circle': !_cell(
                                        rowData,
                                        col.field
                                    )
                                }"
                            ></i>
                        </div>
                </td>
                <td>
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-eye"
                    severity="info"
                    text
                    (onClick)="onViewUser(user)"
                    pTooltip="Voir les détails"
                  ></p-button>
                  <p-button
                    icon="pi pi-pencil"
                    severity="warn"
                    text
                    (onClick)="onEditUser(user)"
                    pTooltip="Modifier"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    text
                    (onClick)="onDeleteUser(user)"
                    pTooltip="Supprimer"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        <ng-template #summary>
            <div class="flex items-center justify-between">In total there are {{ users ? users.length : 0 }} users.</div>
        </ng-template>
    </p-table>

   

</div>


  `
})
export class UserList implements OnInit {
  @ViewChild('dt') dt!: Table;
  users: User[] = [];
  user!: User;
  loading: boolean = true;
  filteredUsers: User[] = [];
  selectedusers!: User[] | null;
  userDialog: boolean = false;
  submitted: boolean = false;
  roles!: any[];
  cols!: Column[];
  exportColumns!: ExportColumn[];
  globalFilter: string = '';
  checked: boolean = true;
  _selectedColumns: any[] = [];
  selectedRoles: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  constructor(
    private userService: UserService,
    private exportFileService: ExportFileService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  _cell = get;
  ngOnInit() {
    this.loadUsers();
    this.cols = [
      { field: 'id', header: 'ID', type:'number',format:'number' },
      { field: 'username', header: 'Nom d\'utilisateur', type: 'text', format:'text' },
      { field: 'email', header: 'Email', type: 'text', format:'text' },
      { field: 'firstName', header: 'Prénom', type: 'text', format:'text' },
      { field: 'lastName', header: 'Nom', type: 'text', format:'text' },
      { field: 'roles', header: 'Rôles', type: 'tag', format:'text' }
    ];
    this._selectedColumns = this.cols;
    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.roles = [
        { label: 'Utilisateur', value: 'ROLE_USER' },
        { label: 'Administrateur', value: 'ROLE_ADMIN' },
        { label: 'Modérateur', value: 'ROLE_MODERATOR' },
    ];
  }

  filterRoles(event: any, field: string) {
    this.selectedRoles = event.value;
    if (!this.selectedRoles || this.selectedRoles.length === 0) {
      this.dt.clear();
      return;
    }

    this.dt.filteredValue = this.dt.value.filter((item: any) => {
      const roles = item[field];
      if (!roles || roles.length === 0) return false;
      
      return this.selectedRoles.some((selectedRole: string) => 
        roles.some((role: any) => 
          (typeof role === 'string' ? role : role.name) === selectedRole
        )
      );
    });
  }

  clear(table: Table) {
    table.clear();
    this.globalFilter = '';
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger la liste des utilisateurs',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  formatRole(role: any): string {
    if (typeof role === 'object' && role !== null) {
      return role.name || 'Rôle inconnu';
    }
    const roleMap: { [key: string]: string } = {
      'ROLE_USER': 'Utilisateur',
      'ROLE_ADMIN': 'Administrateur',
      'ROLE_MODERATOR': 'Modérateur'
    };
    return roleMap[role] || role;
  }

  getRoleSeverity(role: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    let roleKey = typeof role === 'object' && role !== null ? role.name : role;
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'ROLE_USER': 'info',
      'ROLE_ADMIN': 'danger',
      'ROLE_MODERATOR': 'warn'
    };
    return severityMap[roleKey] || 'info';
  }

  onAddUser() {
    this.router.navigate(['/dashboard/users/new-users']);
  }
  onViewUser(user: User) {
    this.router.navigate(['/dashboard/users/detail-users', user.id]);  }

  onEditUser(user: User) {
    this.router.navigate(['/dashboard/users/edit-users', user.id]);
  }

  onDeleteUser(user: User) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur supprimé avec succès',
            life: 3000
          });
          this.loadUsers();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de supprimer l\'utilisateur',
            life: 3000
          });
        }
      });
    }
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  openNew() {
    // Implementation needed
  }

 

  deleteSelectedusers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users = this.users.filter((val) => !this.selectedusers?.includes(val));
        this.selectedusers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'users Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }
  resetSort() {
    this.dt.sortOrder = 0;
    this.dt.sortField = '';
    this.dt.reset();
    this.ngOnInit();
}
 /* ************** Export to PDF or XLXS **************** */
 exportPdf() {

    this.exportFileService.exportToPdf(
        this.dt,
        this._selectedColumns,
    );
}
exportExcel() {
    this.exportFileService.exportToExcel(
        this.dt,
        this._selectedColumns
    );
}
}

interface Column {
  field: string;
  header: string;
  type?: string;
  format?: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}