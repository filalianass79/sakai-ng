import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { Reservation, agence } from '../../../reservation/models/reservation.model';
@Component({
    selector: 'app-date-range-picker',
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
        DropdownModule,
        SelectModule,
        InputNumberModule
    ],
    template: `
        <div class="date-range-container">
            <form [formGroup]="reservationForm" class="date-range-form">
                <!-- Ligne des agences -->
                <div class="form-row">
                    <!-- Agence de départ -->
                    <div class="agency-wrapper" (click)="agenceSelect1.show($event)">
                        <div class="agency-field">
                            <div class="agency-label">Agence de départ</div>
                            <div class="agency-value">
                                <i class="pi pi-map-marker"></i>
                                <p-select #agenceSelect1
                                    [options]="agences"
                                    formControlName="agenceDepart"
                                    [style]="{'width': '100%'}"
                                    placeholder="Sélectionner"
                                    optionLabel="name"
                                    styleClass="w-full"
                                    [showClear]="false">
                                    <ng-template #selectedItem let-selectedOption>
                                        <div class="flex items-center gap-2">
                                            <img [src]="'assets/images/icones/' + selectedOption.icone" style="width: 18px" />
                                            <div>{{ selectedOption.name }}</div>
                                        </div>
                                    </ng-template>
                                    <ng-template let-agence #item>
                                        <div class="flex items-center gap-2">
                                            <img [src]="'assets/images/icones/' + agence.icone" style="width: 18px" />
                                            <div>{{ agence.name }}</div>
                                        </div>
                                    </ng-template>
                                </p-select>
                            </div>
                        </div>
                    </div>

                    <!-- Agence de retour -->
                    <div class="agency-wrapper" (click)="agenceSelect2.show($event)">
                        <div class="agency-field">
                            <div class="agency-label">Agence de retour</div>
                            <div class="agency-value">
                                <i class="pi pi-map-marker"></i>
                                <p-select #agenceSelect2
                                    [options]="agences"
                                    formControlName="agenceRetour"
                                    [style]="{'width': '100%'}"
                                    placeholder="Sélectionner"
                                    optionLabel="name"
                                    styleClass="w-full"
                                    [showClear]="false">
                                    <ng-template #selectedItem let-selectedOption>
                                        <div class="flex items-center gap-2">
                                            <img [src]="'assets/images/icones/' + selectedOption.icone" style="width: 18px" />
                                            <div>{{ selectedOption.name }}</div>
                                        </div>
                                    </ng-template>
                                    <ng-template let-agence #item>
                                        <div class="flex items-center gap-2">
                                            <img [src]="'assets/images/icones/' + agence.icone" style="width: 18px" />
                                            <div>{{ agence.name }}</div>
                                        </div>
                                    </ng-template>
                                </p-select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ligne des dates et heures -->
                <div class="form-row">
                    <!-- Groupe date/heure départ -->
                    <div class="date-time-group">
                        <!-- Date de départ -->
                        <div class="date-picker-wrapper" (click)="op.toggle($event)">
                            <div class="date-field">
                                <div class="date-label">Date de départ</div>
                                <div class="date-value">
                                    <i class="pi pi-calendar"></i>
                                    <span>{{ formatDate(reservationForm.get('dateDepart')?.value) }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Heure de départ -->
                        <div class="time-picker-wrapper" (click)="heureSelect1.show($event)">
                            <div class="time-field">
                                <div class="time-label">Heure</div>
                                <div class="time-value">
                                    <i class="pi pi-clock"></i>
                                    <p-select #heureSelect1
                                        [options]="heures"
                                        optionLabel="label"
                                        formControlName="heureDepart"
                                        [style]="{'width': '100%'}"
                                        [showClear]="false"
                                    ></p-select>
                                </div>
                            </div>
                        </div>
                    </div>

                   
                    <div class="date-time-group">
                        <!-- Date de retour -->
                        <div class="date-picker-wrapper" (click)="op.toggle($event)">
                            <div class="date-field">
                                <div class="date-label">Date de retour</div>
                                <div class="date-value">
                                    <i class="pi pi-calendar"></i>
                                    <span>{{ formatDate(reservationForm.get('dateRetour')?.value) }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Heure de retour -->
                        <div class="time-picker-wrapper" (click)="heureSelect2.show($event)">
                            <div class="time-field">
                                <div class="time-label">Heure</div>
                                <div class="time-value">
                                    <i class="pi pi-clock"></i>
                                    <p-select #heureSelect2
                                        [options]="heures"
                                        optionLabel="label"
                                        formControlName="heureRetour"
                                        [style]="{'width': '100%'}"
                                        [showClear]="false"
                                    ></p-select>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>

                <!-- Ligne des ages et code promo et bouton chercher -->
                <div class="form-row">
                    <!-- Age du conducteur -->
                    <div class="age-wrapper">
                        <div class="age-field">
                            <div class="age-label">Mon âge</div>
                            <div class="age-value">
                                <i class="pi pi-user"></i>
                                <p-inputNumber 
                                    formControlName="age"
                                    [min]="18"
                                    [max]="80"
                                    [showButtons]="false"
                                    placeholder="23 "
                                    [style]="{'width': '100%'}"
                                    [inputStyle]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                ></p-inputNumber>
                            </div>
                        </div>
                    </div>

                    <!-- Code promo -->
                    <div class="promo-wrapper">
                        <div class="promo-field">
                            <div class="promo-label">J'ai un code promo</div>
                            <div class="promo-value">
                                <i class="pi pi-ticket"></i>
                                <input pInputText
                                    formControlName="codePromo"
                                    type="text"
                                    placeholder="Code promo"
                                    [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Bouton rechercher -->
                    <div class="search-wrapper">
                        <button pButton                                   
                            label="RECHERCHER" 
                            (click)="ChercherVehicule()"
                            class="search-button"
                            [disabled]="!reservationForm.valid">
                        </button>
                    </div>
                </div>
            </form>

            <!-- Overlay Panel avec le calendrier -->
            <p-overlayPanel #op [showCloseIcon]="true" [style]="{width: '580px'}" styleClass="date-range-overlay">
                <div class="calendar-container">
                    <div class="calendar-header">
                        <h3>Sélectionnez vos dates</h3>
                    </div>
                    <p-datePicker
                        [(ngModel)]="selectedDates"
                        selectionMode="range"
                        [inline]="true"
                        [numberOfMonths]="2"
                        [minDate]="minDate"
                        [maxDate]="maxDate"
                        (onSelect)="onDateSelect($event)"
                        [showWeek]="false"
                        dateFormat="dd/mm/yy"
                        [readonlyInput]="true"
                        styleClass="custom-datepicker"
                    ></p-datePicker>
                </div>
            </p-overlayPanel>
        </div>
    `,
    styles: [`
        .date-range-container {
            display: flex;
            position: relative;
            background: #fff;
            padding: 1.5rem;
        }

        .date-range-form {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 0.15rem;
        }

        .form-row {
            display: flex;
            gap: 0.15rem;
            margin-bottom: 0.15rem;
        }

        .agency-wrapper {
            flex: 1;
            background: #fff;
            border: 2px solid rgb(201, 201, 193);
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .agency-wrapper:hover {
            border-color: #ec700a;
            background-color:rgb(240, 243, 215);
        }

        .agency-field {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .agency-label {
            font-size: 0.875rem;
            color: rgb(189, 103, 5);
            font-weight: 500;
        }

        .agency-value {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            color: #212529;
            font-weight: 500;
        }

        .agency-value i {
            color: #ec700a;
            font-size: 1.125rem;
        }

        .date-time-group {
            flex: 1;
            display: flex;
            gap: 0.15rem;
        }

        .date-picker-wrapper {
            flex: 2;
            cursor: pointer;
            background: #fff;
            border: 2px solid rgb(201, 201, 193);
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
        }

        .date-picker-wrapper:hover {
            border-color: #ec700a;
            background-color:rgb(240, 243, 215);
        }

        .time-picker-wrapper {
            flex: 1;
            background: #fff;
            border: 2px solid rgb(201, 201, 193);
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .time-picker-wrapper:hover {
            border-color: #ec700a;
            background-color:rgb(240, 243, 215);
        }

        .date-field, .time-field {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .date-label, .time-label {
            font-size: 0.875rem;
            color: rgb(189, 103, 5);
            font-weight: 500;
        }

        .date-value, .time-value {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            color: #212529;
            font-weight: 500;
        }

        .date-value i, .time-value i {
            color: #ec700a;
            font-size: 1.125rem;
        }

        :host ::ng-deep {
            .p-select {
                width: 100%;
                background: transparent;
                border: none;
                border-radius: 0;
                transition: all 0.2s ease;
                box-shadow: none !important;

                &:not(.p-disabled):hover {
                    border: none;
                    background: transparent;
                }

                &.p-focus {
                    box-shadow: none;
                    border: none;
                    outline: none;
                }

                .p-select-label {
                    padding: 0;
                    font-size: 1rem;
                    color: #212529;
                    font-weight: 500;
                }

                .p-select-trigger {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #fff;
                    border: 2px solid #ec700a;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ec700a;
                    transition: all 0.2s ease;

                    &:hover {
                        background: #ec700a;
                        color: #fff;
                    }

                    .p-select-trigger-icon {
                        font-size: 0.8rem;
                        margin: 0;
                        transform: translateY(-1px);
                    }
                }

                .p-select-panel {
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    background: #fff;

                    .p-select-items {
                        padding: 0.5rem 0;

                        .p-select-item {
                            padding: 0.75rem 1rem;
                            color: #212529;
                            transition: all 0.2s ease;

                            &:hover {
                                background: rgba(236, 112, 10, 0.1);
                                color: #ec700a;
                            }

                            &.p-highlight {
                                background: #ec700a;
                                color: #fff;
                            }
                        }
                    }
                }

                &.p-select-clearable {
                    .p-select-clear-icon {
                        color: #ec700a;
                    }
                }
            }

            .p-select-items-wrapper {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .p-select-header {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #e9ecef;
            }

            .p-select-footer {
                padding: 0.75rem 1rem;
                border-top: 1px solid #e9ecef;
            }

            .search-button {
                width: 100%;
                height: 100%;
                background-color: #ffd700;
                border: none;
                color: #000;
                font-weight: 600;
                font-size: 0.875rem;
                
                &:hover {
                    background-color: rgb(182, 77, 17);
                }

                &:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }
            }

            .date-range-overlay {
                .p-overlaypanel-content {
                    padding: 0;
                }
            }

            .p-inputnumber {
                width: 100%;
                height: 100%;

                .p-inputnumber-input {
                    width: 100%;
                    height: 24px;
                    border: none !important;
                    background: transparent;
                    padding: 0;
                    font-size: 1rem;
                    color: #212529;
                    font-weight: 500;
                    box-shadow: none !important;
                    outline: none !important;

                    &:focus {
                        box-shadow: none !important;
                        outline: none !important;
                        border: none !important;
                    }

                    &::placeholder {
                        color: #6c757d;
                    }
                }

                &:focus-within {
                    box-shadow: none !important;
                    outline: none !important;
                    border: none !important;
                }
            }

            .p-inputtext {
                width: 100%;
                height: 24px;
                border: none !important;
                background: transparent;
                padding: 0;
                font-size: 1rem;
                color: #212529;
                font-weight: 500;
                box-shadow: none !important;
                outline: none !important;

                &:focus {
                    box-shadow: none !important;
                    outline: none !important;
                    border: none !important;
                }

                &:enabled:focus {
                    box-shadow: none !important;
                    outline: none !important;
                    border: none !important;
                }

                &::placeholder {
                    color: #6c757d;
                }
            }
        }

        @media (max-width: 767px) {
            .date-range-container {
                padding: 1rem;
            }

            .form-row {
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .agency-wrapper,
            .date-picker-wrapper,
            .time-picker-wrapper,
            .age-wrapper,
            .promo-wrapper,
            .search-wrapper {
                width: 100%;
                margin-bottom: 0.5rem;
                height: auto;
                min-height: 80px;
            }

            .date-time-group {
                flex-direction: column;
                width: 100%;
            }

            .search-wrapper {
                width: 100%;
                display: flex;
                align-items: stretch;
            }

            .search-button {
                height: 80px !important;
                width: 100%;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
            .date-range-container {
                padding: 1.25rem;
            }

            .form-row {
                flex-wrap: wrap;
                gap: 0.75rem;
                margin-bottom: 0.75rem;
            }

            .agency-wrapper {
                flex: 0 0 calc(50% - 0.375rem);
                min-height: 80px;
            }

            .date-time-group {
                flex: 0 0 100%;
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 0.75rem;
                min-height: 80px;
            }

            .age-wrapper,
            .promo-wrapper {
                flex: 1;
                min-width: calc(50% - 0.375rem);
                min-height: 80px;
            }

            .search-wrapper {
                flex: 100%;
                min-height: 80px;
            }

            .search-button {
                height: 80px !important;
                width: 100%;
                font-size: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .age-wrapper, .promo-wrapper {
            flex: 1;
            background: #fff;
            border: 2px solid rgb(201, 201, 193);
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .age-wrapper:hover, .promo-wrapper:hover {
            border-color: #ec700a;
            background-color: rgb(240, 243, 215);
        }

        .age-field, .promo-field {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .age-label, .promo-label {
            font-size: 0.875rem;
            color: rgb(189, 103, 5);
            font-weight: 500;
        }

        .age-value, .promo-value {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            color: #212529;
            font-weight: 500;
        }

        .age-value i, .promo-value i {
            color: #ec700a;
            font-size: 1.125rem;
        }

        .search-wrapper {
            flex: 1;
            display: flex;
            align-items: stretch;
        }

        .search-button {
            width: 100%;
            height: 100%;
            background-color: #ffd700;
            border: none;
            color: #000;
            font-weight: 600;
            font-size: 0.875rem;
            
            &:hover {
                background-color: #ffed4a;
            }

            &:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
        }

        .date-range-picker {
            font-family: var(--font-family);
        }

        .calendar-container {
            padding: 1rem;
            background: #ffffff;
            border-radius: 8px;
        }

        .calendar-header {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgb(245, 133, 4);
        }

        .calendar-header h3 {
            margin: 0;
            color:rgb(71, 4, 4);
            font-size: 1.25rem;
            font-weight: 600;
        }

        :host ::ng-deep {
            .date-range-overlay {
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                
                .p-overlaypanel-content {
                    padding: 0;
                }
                
                .p-datepicker {
                    border: none;
                    padding: 0;
                    
                    .p-datepicker-header {
                        padding: 0.5rem;
                        border: none;
                        background: transparent;
                        
                        .p-datepicker-title {
                            .p-datepicker-month,
                            .p-datepicker-year {
                                color: #2c3e50;
                                font-weight: 600;
                                padding: 0 0.5rem;
                            }
                        }
                        
                        .p-datepicker-prev,
                        .p-datepicker-next {
                            width: 2rem;
                            height: 2rem;
                            color: #64748b;
                            border: 1px solidrgb(226, 117, 14);
                            border-radius: 50%;
                            
                            &:hover {
                                background: #f1f5f9;
                                color: #2c3e50;
                            }
                            
                            span {
                                font-size: 0.875rem;
                            }
                        }
                    }
                    
                    table {
                        margin: 0.5rem 0;
                        
                        th {
                            padding: 0.5rem;
                            color: #64748b;
                            font-weight: 600;
                            font-size: 0.875rem;
                        }
                        
                        td {
                            padding: 0.25rem;
                            
                            span {
                                width: 2rem;
                                height: 2rem;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                                
                                &:not(.p-disabled):hover {
                                    background: #f1f5f9;
                                }
                            }
                            
                            &.p-datepicker-today span {
                                background: #f1f5f9;
                                color: #2c3e50;
                            }
                            
                            &.p-highlight span {
                                background: #ffd700;
                                color: #000000;
                            }
                            
                            &.p-highlight-range span {
                                background: rgba(255, 215, 0, 0.2);
                                border-radius: 0;
                            }
                            
                            &:first-child.p-highlight-range span {
                                border-top-left-radius: 50%;
                                border-bottom-left-radius: 50%;
                            }
                            
                            &:last-child.p-highlight-range span {
                                border-top-right-radius: 50%;
                                border-bottom-right-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    `]
})
export class DateRangePickerComponent implements OnInit {
    @ViewChild('op') op!: OverlayPanel;
    @Input() minDate: Date = new Date();
    // Définit la date maximale sélectionnable dans le calendrier (1 an à partir d'aujourd'hui)
    @Input() maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    @Output() reserverVehicule = new EventEmitter<Reservation>();
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
        { name: 'TANGER AEROPORT', icone: 'avion.png' },
        { name: 'CASABLANCA ville', icone: 'city.png' },
        { name: 'RABAT ville', icone: 'city.png' },
        { name: 'FES ville', icone: 'city.png' },
        { name: 'MEKNES ville', icone: 'city.png' },
        { name: 'OUARZAZATE ville', icone: 'city.png' },
        { name: 'AGADIR ville', icone: 'city.png' },]

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
  // Générer les heures de 7h à 20h par pas de 30 minutes
     for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
        const heure = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        this.heures.push({ label: heure, value: heure });
        }
    }
    }

    ngOnInit() {
     
        if(this.reservation){
            this.reservationForm.patchValue({
                agenceDepart: this.reservation.agenceDepart,
                agenceRetour: this.reservation.agenceRetour,
                dateDepart: this.reservation.dateDepart,
                dateRetour: this.reservation.dateRetour,
                heureDepart: this.reservation.heureDepart,
                heureRetour: this.reservation.heureRetour,
                age: this.reservation.age,
                codePromo: this.reservation.codePromo
            });
        }
        else{
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
            this.reservation=this.reservationForm.value as Reservation;
    }
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
            const reservation: Reservation = this.reservationForm.value as Reservation;
            this.reserverVehicule.emit(reservation);
            this.reservation=reservation;
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