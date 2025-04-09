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
import { IconFieldModule } from 'primeng/iconfield';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputIconModule } from 'primeng/inputicon';
import { ExportFileService } from '../../../service/exportFile.service';
import { Reservation } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-reservation',
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
    DatePipe
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.scss']
})
export class ListReservationComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  reservations: Reservation[] = [];
  selectedReservations: Reservation[] = [];
  loading = false;
  globalFilter = '';
  checked = true;
  cols!: Column[];
  _selectedColumns: Column[] = [];
  exportColumns!: ExportColumn[];

  constructor(
    private reservationService: ReservationService,
    private exportFileService: ExportFileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.initColumns();
  }

  initColumns() {
    this.cols = [
      { field: 'agenceDepart', header: 'Agence Départ', type: 'text' },
      { field: 'agenceRetour', header: 'Agence Retour', type: 'text' },
      { field: 'dateDepart', header: 'Date Départ', type: 'date' },
      { field: 'dateRetour', header: 'Date Retour', type: 'date' },
      { field: 'heureDepart', header: 'Heure Départ', type: 'time' },
      { field: 'heureRetour', header: 'Heure Retour', type: 'time' },
      { field: 'codePromo', header: 'Code Promo', type: 'text' },
      { field: 'age', header: 'Âge', type: 'integer' }
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

  loadReservations(): void {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les réservations'
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
    this.loadReservations();
  }

  navigateToAdd() {
    this.router.navigate(['/dashboard/reservations/new-reservation']);
  }

  editReservation(reservation: Reservation): void {
    this.router.navigate(['/dashboard/reservations/edit-reservation', reservation.id]);
  }

  deleteReservation(reservation: Reservation): void {
    this.confirmationService.confirm({
      message: `Êtes-vous sûr de vouloir supprimer cette réservation ?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (reservation.id) {
          this.reservationService.deleteReservation(reservation.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Réservation supprimée avec succès'
              });
              this.loadReservations();
            },
            error: (error) => {
              console.error('Erreur lors de la suppression de la réservation:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer la réservation'
              });
            }
          });
        }
      }
    });
  }

  deleteSelectedReservations() {
    if (!this.selectedReservations.length) return;
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer les réservations sélectionnées ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        for (const reservation of this.selectedReservations) {
          if (reservation.id) {
            this.reservationService.deleteReservation(reservation.id).subscribe();
          }
        }
        this.loadReservations();
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Réservations supprimées',
          life: 3000
        });
        this.selectedReservations = [];
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