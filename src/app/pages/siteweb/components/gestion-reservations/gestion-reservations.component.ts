import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Reservation } from '../../../reservation/models/reservation.model';
import { ReservationService } from '../../../reservation/services/reservation.service';

@Component({
  selector: 'app-gestion-reservations',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './gestion-reservations.component.html',
  styleUrls: ['./gestion-reservations.component.scss']
})
export class GestionReservationsComponent implements OnInit {
  rechercheForm: FormGroup;
  reservations: Reservation[] = [];
  loading = false;
  emailRecherche = '';

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private reservationService: ReservationService
  ) {
    this.rechercheForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      numeroReservation: ['']
    });
  }

  ngOnInit(): void {
    // Vérifier si un email est déjà stocké dans le localStorage
    const emailStored = localStorage.getItem('clientEmail');
    if (emailStored) {
      this.rechercheForm.patchValue({ email: emailStored });
      this.rechercherReservations();
    }
  }

  rechercherReservations(): void {
    if (this.rechercheForm.valid) {
      this.loading = true;
      const email = this.rechercheForm.get('email')?.value;
      const numeroReservation = this.rechercheForm.get('numeroReservation')?.value;

      // Stocker l'email pour une utilisation ultérieure
      localStorage.setItem('clientEmail', email);
      this.emailRecherche = email;

      this.reservationService.getReservationsByEmail(email).subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.loading = false;
          if (reservations.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Aucune réservation trouvée',
              detail: 'Aucune réservation n\'a été trouvée pour cet email.'
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue lors de la recherche des réservations.'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur de validation',
        detail: 'Veuillez entrer une adresse email valide.'
      });
    }
  }

  voirDetails(reservation: Reservation): void {
    this.router.navigate(['/parcauto'], { 
      queryParams: { 
        reservationId: reservation.id,
        email: this.emailRecherche
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmée':
        return 'status-confirmed';
      case 'en attente':
        return 'status-pending';
      case 'annulée':
        return 'status-cancelled';
      case 'terminée':
        return 'status-completed';
      default:
        return '';
    }
  }
} 