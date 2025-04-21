import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { Reservation } from '../../../reservation/models/reservation.model';

@Component({
    selector: 'app-infos-reservation',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CalendarModule,
        DatePickerModule,
        ButtonModule,
        InputTextModule,
        OverlayPanelModule,
        SelectModule,
        InputNumberModule
    ],
    templateUrl: './infos-reservation.component.html',
    styleUrls: ['./infos-reservation.component.scss'],
})
export class InfosReservationComponent implements OnInit {
    @ViewChild('op') op!: OverlayPanel;
    @Input() minDate: Date = new Date();
    // Définit la date maximale sélectionnable dans le calendrier (1 an à partir d'aujourd'hui)
    @Input() maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    @Output() chercherVehicule = new EventEmitter<Reservation>();
    @Input() reservation: Reservation | null = null;

    reservationForm!: FormGroup;
    selectedDates: Date[] = [];
    isFirstDateSelected: boolean = false;
    heures: any[] = [];
    agences = [
        { name: 'TANGER AEROPORT', icone: 'avion.png' },
        { name: 'CASABLANCA AEROPORT', icone: 'avion.png' },
        { name: 'RABAT AEROPORT', icone: 'avion.png' },
        { name: 'FES AEROPORT', icone: 'avion.png' },
        { name: 'MEKNES AEROPORT', icone: 'avion.png' },
        { name: 'OUARZAZATE AEROPORT', icone: 'avion.png' },
        { name: 'AGADIR AEROPORT', icone: 'avion.png' },
        { name: 'CASABLANCA ville', icone: 'city.png' },
        { name: 'RABAT ville', icone: 'city.png' },
        { name: 'FES ville', icone: 'city.png' },
        { name: 'MEKNES ville', icone: 'city.png' },
        { name: 'OUARZAZATE ville', icone: 'city.png' },
        { name: 'AGADIR ville', icone: 'city.png' }
    ];

    constructor(private fb: FormBuilder) {
        this.reservationForm = this.fb.group({
            agenceDepart: [null, Validators.required],
            agenceRetour: [null, Validators.required],
            dateDepart: [new Date(), Validators.required],
            dateRetour: [new Date(), Validators.required],
            heureDepart: ['12:00', Validators.required],
            heureRetour: ['12:00', Validators.required],
            age: [null, [Validators.required, Validators.min(18), Validators.max(80)]],
            codePromo: ['']
        });
  // Générer les heures de 0h à 24h par pas de 30 minutes
     for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
        const heure = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        this.heures.push({ label: heure, value: heure });
        }
    }
    }

    ngOnInit() {
        if (this.reservation) {
            this.reservationForm.patchValue({
                agenceDepart: this.agences.find(agence => agence.name === this.reservation?.agenceDepart),
                agenceRetour: this.agences.find(agence => agence.name === this.reservation?.agenceRetour),
                dateDepart: this.reservation.dateDepart,
                dateRetour: this.reservation.dateRetour,
                heureDepart: this.heures.find(heure => heure.value === this.reservation?.heureDepart),
                heureRetour: this.heures.find(heure => heure.value === this.reservation?.heureRetour),
                age: this.reservation.age,
                codePromo: this.reservation.codePromo
            });
            this.selectedDates = [this.reservation.dateDepart!, this.reservation.dateRetour!];
        } else {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            this.reservationForm.patchValue({
                dateDepart: today,
                dateRetour: tomorrow,
                agenceDepart: this.agences[0],
                agenceRetour: this.agences[0],
                heureDepart: this.heures[24],
                heureRetour: this.heures[24],
                age: 41,
                codePromo: ''
            });

            this.selectedDates = [today, tomorrow];
            this.reservation = this.reservationForm.value as Reservation;
            this.reservation.numeroReservation = this.generateNumeroReservation();
        }
    }
    // générer un numero de reservation aléatoire et unique de 6 caractères tenant que des chiffres et des lettres    
    generateNumeroReservation() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let numero = '';
        for (let i = 0; i < 6; i++) {
            numero += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return numero;
    }

    onDateSelect(event: any) {
        if (this.selectedDates && this.selectedDates.length === 2) {
            if (!this.isFirstDateSelected) {
                // Première sélection
                this.isFirstDateSelected = true;
                this.reservationForm.patchValue({
                    dateDepart: this.selectedDates[0]
                });
            } else {
                // Deuxième sélection
                this.reservationForm.patchValue({
                    dateRetour: this.selectedDates[1]
                });
                this.op.hide();
                this.isFirstDateSelected = false;
            }
        }
    }

    emitReservation() {
        if (this.reservationForm.valid) {
           this.reservation!.agenceDepart = this.reservationForm.get('agenceDepart')?.value.name;
            this.reservation!.agenceRetour = this.reservationForm.get('agenceRetour')?.value.name;
            this.reservation!.dateDepart = this.reservationForm.get('dateDepart')?.value;
            this.reservation!.dateRetour = this.reservationForm.get('dateRetour')?.value;
            this.reservation!.heureDepart = this.reservationForm.get('heureDepart')?.value.value;
            this.reservation!.heureRetour = this.reservationForm.get('heureRetour')?.value.value;
            this.reservation!.age = this.reservationForm.get('age')?.value;
            this.reservation!.codePromo = this.reservationForm.get('codePromo')?.value;
            this.reservation!.numeroReservation = this.generateNumeroReservation();
            this.chercherVehicule.emit(this.reservation!);
        }
    }

    formatDate(date: Date | null): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    ChercherVehicule() {
        if (this.reservationForm.valid) {
            this.emitReservation();
            // Ici vous pouvez ajouter la logique de recherche
        }
    }
}                                                                                          