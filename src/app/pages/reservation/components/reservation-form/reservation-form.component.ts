import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { agence, Reservation } from '../../models/reservation.model';
@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    SelectModule,
    FloatLabelModule,
    InputIconModule,
    DatePickerModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule
  ]
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  agences: any[] = [
    { name: 'TANGER AEROPORT', code: 'TNG' },
    { name: 'CASABLANCA AEROPORT', code: 'CAS' },
    { name: 'RABAT AEROPORT', code: 'RBA' },
    { name: 'FES AEROPORT', code: 'FES' },
    { name: 'MEKNES AEROPORT', code: 'MEK' },
    { name: 'OUARZAZATE AEROPORT', code: 'OUA' },
    { name: 'AGADIR AEROPORT', code: 'AGD' },
  ];
  heures: any[] = [];
  minDate: Date = new Date();
  value1: agence | undefined;
  value2: agence | undefined;

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      agenceDepart: ['', Validators.required],
      agenceRetour: ['', Validators.required],
      dateDepart: ['', Validators.required],
      dateRetour: ['', Validators.required],
      heureDepart: ['', Validators.required],
      heureRetour: ['', Validators.required],
      codePromo: [''],
      age: [21, [Validators.required, Validators.min(18)]]
    });

    // Générer les heures de 00:00 à 23:59 par pas de 30 minutes
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        this.heures.push({
          name: `${hour}:${minute}`,
          code: `${hour}:${minute}`
        });
      }
    }
  }

  ngOnInit(): void {
    // Initialiser les dates par défaut
    const dateDepart = new Date();
    const dateRetour = new Date();
    const heureDepart = this.heures[24];
    const heureRetour = this.heures[24];
    dateRetour.setDate(dateRetour.getDate() + 1);

    this.reservationForm.patchValue({
      dateDepart: dateDepart,
      dateRetour: dateRetour,
      heureDepart: heureDepart,
      heureRetour: heureRetour,
      agenceDepart: {},
      agenceRetour: {}
    });

    // Écouter les changements de date de départ pour mettre à jour la date de retour minimale
    this.reservationForm.get('dateDepart')?.valueChanges.subscribe(date => {
      const dateRetourControl = this.reservationForm.get('dateRetour');
      if (date && dateRetourControl?.value && date > dateRetourControl.value) {
        dateRetourControl.setValue(date);
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservation: Reservation = this.reservationForm.value;
      console.log('Réservation soumise:', reservation);
    }
  }
} 