import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextarea } from 'primeng/inputtextarea';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OcrService } from '../../../service/ocr.service';
import * as Tesseract from 'tesseract.js';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../auth/core/services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-coordonnees-reservation',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        SelectButtonModule,
        DropdownModule,
        InputMaskModule,
        InputTextarea,
        TextareaModule,
        FileUploadModule,
        ProgressBarModule,
        CardModule,
        ToastModule,
        DividerModule,
        ScrollPanelModule
    ],
    providers: [MessageService],
    template: `
        <div class="date-range-container">
            <p-toast></p-toast>
            <div class="form-sections-wrapper">
                <!-- Section gauche -->
                <div class="form-section left-section">
                    <h3>Vos données de réservation</h3>
                    
                    <form [formGroup]="coordonneesForm">
                        <!-- Civilité -->
                        <div class="civilite-group">
                            <p-selectButton [options]="civiliteOptions" formControlName="civilite" optionLabel="label"
                             [style]="{'display': 'flex', 'gap': '0.5rem'}"
                                ></p-selectButton>
                        </div>

                        <!-- Prénom et Nom -->
                        <div class="form-row">
                            <div class="promo-wrapper" (click)="focusInput('prenom')">
                                <div class="promo-field">
                                    <div class="promo-label">Prénom *</div>
                                    <div class="promo-value"
                                    >
                                        <input pInputText id="prenom" formControlName="prenom" placeholder="Votre prénom"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="input-wrapper" (click)="focusInput('nom')">
                                <div class="input-field">
                                    <div class="input-label">Nom *</div>
                                    <div class="input-value"
                                    >
                                        <input pInputText id="nom" formControlName="nom" placeholder="Votre nom"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="input-wrapper email-wrapper" (click)="focusInput('email')">
                            <div class="input-field">
                                <div class="input-label">Email *</div>
                                <div class="input-value"
                                >
                                    <input pInputText id="email" formControlName="email" type="email" placeholder="Votre email"
                                    [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Pays -->
                        <div class="input-wrapper pays-wrapper" (click)="focusInput('pays')">
                            <div class="input-field">
                                <div class="input-label">Pays *</div>
                                <div class="input-value"
                                >
                                    <p-dropdown id="pays" formControlName="pays" 
                                        [options]="paysOptions" 
                                        placeholder="Sélectionnez un pays"
                                        optionLabel="label"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        ></p-dropdown>
                                </div>
                            </div>
                        </div>

                        <!-- Adresse -->
                        <div class="input-wrapper address-wrapper" (click)="focusInput('adresse')">
                            <div class="input-field">
                                <div class="input-label">Adresse *</div>
                                <div class="input-value"
                                [style]="{'width': '100%', '': 'none', 'background': 'transparent'}"
                                >
                                    <input pInputText id="adresse" formControlName="adresse" placeholder="Votre adresse"
                                    [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Code postal et Ville -->
                        <div class="form-row">
                            <div class="input-wrapper" (click)="focusInput('codePostal')">
                                <div class="input-field">
                                    <div class="input-label">Code postal *</div>
                                    <div class="input-value"
                                    >
                                        <input pInputText id="codePostal" formControlName="codePostal" 
                                        placeholder="Code postal"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="input-wrapper" (click)="focusInput('ville')">
                                <div class="input-field">
                                    <div class="input-label">Ville *</div>
                                    <div class="input-value"
                                    >
                                        <input pInputText id="ville" formControlName="ville" placeholder="Ville" 
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Section droite -->
                <div class="form-section right-section">
                    <h3>Informations complémentaires</h3>
                    
                    <form [formGroup]="coordonneesForm">
                        <!-- Téléphone -->
                        <div class="input-wrapper" (click)="focusInput('telephone')">
                            <div class="input-field">
                                <div class="input-label">Téléphone *</div>
                                <div class="input-value"
                                >
                                    <p-inputMask id="telephone" formControlName="telephone" 
                                        mask="999999999999999" placeholder="Votre numéro"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        ></p-inputMask>
                                </div>
                            </div>
                        </div>

                        <!-- Date de naissance -->
                        <div class="input-wrapper" (click)="focusInput('dateNaissance')">
                            <div class="input-field">
                                <div class="input-label">Date de naissance *</div>
                                <div class="input-value"
                                >
                                    <p-calendar id="dateNaissance" formControlName="dateNaissance" 
                                        [showIcon]="true" placeholder="JJ/MM/AAAA"
                                        [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                        ></p-calendar>
                                </div>
                            </div>
                        </div>

                        <div class="arrival-section">
                            <h3>VOTRE ARRIVÉE (SI APPLICABLE)</h3>
                            
                            <!-- Compagnie -->
                            <div class="input-wrapper" (click)="focusInput('compagnie')">
                                <div class="input-field">
                                    <div class="input-label">Quelle compagnie ?</div>
                                    <div class="input-value"
                                    >
                                        <p-dropdown id="compagnie" formControlName="compagnie" 
                                            [options]="compagniesOptions" 
                                            placeholder="Sélectionnez une compagnie"
                                            [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                            optionLabel="label"></p-dropdown>
                                    </div>
                                </div>
                            </div>

                            <!-- N° de vol -->
                            <div class="input-wrapper" (click)="focusInput('numeroVol')">
                                <div class="input-field">
                                    <div class="input-label">N° de vol</div>
                                    <div class="input-value"
                                    >
                                        <input pInputText id="numeroVol"
                                         formControlName="numeroVol" placeholder="Numéro de vol"
                                         [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}" />
                                    </div>
                                </div>
                            </div>

                            <!-- Observations -->
                            <div class="input-wrapper" (click)="focusInput('observations')">
                                <div class="input-field">
                                    <div class="input-label">Observations</div>
                                    <div class="input-value"
                                    >
                                        <textarea pInputTextarea id="observations" formControlName="observations" 
                                            rows="3" placeholder="Vos observations"
                                            [style]="{'width': '100%', 'border': 'none', 'background': 'transparent'}"
                                            ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Section OCR -->
            <div class="ocr-section">
                <p-divider></p-divider>
                <h3>Extraction de données par OCR</h3>
                <div class="grid grid-cols-12 gap-4">
                    <!-- Upload Section -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <p-card header="1. Télécharger un document" styleClass="h-full">
                            <p-fileUpload #fileUpload 
                                [showUploadButton]="false"
                                [showCancelButton]="false"
                                (onSelect)="onUpload($event)"
                                accept="image/*,application/pdf"
                                [maxFileSize]="5000000"
                                chooseLabel="Sélectionner un fichier"
                                invalidFileSizeMessageSummary="Fichier trop volumineux"
                                invalidFileSizeMessageDetail="La taille maximale est de 5MB"
                                invalidFileTypeMessageSummary="Type de fichier non valide"
                                invalidFileTypeMessageDetail="Seuls les fichiers PDF et images sont acceptés">
                            </p-fileUpload>
                            
                            <div class="flex justify-between mt-12">
                                <p-button label="Effacer" icon="pi pi-trash" severity="secondary" (onClick)="clear()"></p-button>
                            </div>
                        </p-card>
                    </div>
                    
                    <!-- Preview Section -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <p-card header="2. Aperçu du document" styleClass="h-full">
                            <div *ngIf="imagePreviewUrl" class="flex items-center justify-center">
                                <!-- Afficher une image si c'est une image -->
                                <img *ngIf="uploadedFile && uploadedFile.type.startsWith('image/')" 
                                    #previewImage 
                                    [src]="imagePreviewUrl" 
                                    class="w-full max-h-80" 
                                    alt="Document preview" />
                                
                                <!-- Afficher un PDF si c'est un PDF -->
                                <object *ngIf="uploadedFile && uploadedFile.type === 'application/pdf' && safePdfUrl"
                                    [data]="safePdfUrl"
                                    type="application/pdf"
                                    class="w-full"
                                    style="height: 300px;">
                                    <div class="text-center text-surface-500 dark:text-surface-300 p-12">
                                        <i class="pi pi-file-pdf text-4xl mb-2"></i>
                                        <p>Impossible d'afficher le PDF directement. <a [href]="safePdfUrl" target="_blank">Ouvrir dans un nouvel onglet</a></p>
                                    </div>
                                </object>
                            </div>
                            <div *ngIf="!imagePreviewUrl" class="flex items-center justify-center h-80">
                                <div class="text-center text-surface-500 dark:text-surface-300">
                                    <i class="pi pi-image text-6xl mb-12"></i>
                                    <div>Aucun document sélectionné</div>
                                </div>
                            </div>
                        </p-card>
                    </div>
                    
                    <!-- Process Section -->
                    <div class="col-span-12 md:col-span-6 lg:col-span-4">
                        <p-card header="3. Traiter le document" styleClass="h-full">
                            <div class="mb-12">
                                <p-button label="Traiter avec Tesseract.js" 
                                    icon="pi pi-search" 
                                    styleClass="w-full mb-2"
                                    [disabled]="!uploadedFile || isProcessing || (uploadedFile && uploadedFile.type === 'application/pdf')"
                                    (onClick)="processWithTesseract()">
                                </p-button>
                                
                                <p-button label="Traiter avec le backend" 
                                    icon="pi pi-server" 
                                    styleClass="w-full"
                                    [disabled]="!uploadedFile || isProcessing"
                                    (onClick)="processWithBackend()">
                                </p-button>
                            </div>
                            
                            <div *ngIf="isProcessing" class="mt-12">
                                <p>Traitement en cours...</p>
                                <p-progressBar [value]="progress"></p-progressBar>
                            </div>
                        </p-card>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .coordonnees-container {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .form-sections-wrapper {
            display: flex;
            gap: 2rem;
        }

        .form-section {
            flex: 1;
        }

        .form-section h3 {
            color: rgb(189, 103, 5);
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 1.5rem;
        }

        .form-row {
            display: flex;
            gap: 0.15rem;
            margin-bottom: 0.15rem;
        }

        .civilite-group {
            margin-bottom: 1rem;
            
           
        }

        :host ::ng-deep .civilite-select {
            .p-button {
                background: orange;
                border: 8px solid rgb(54, 54, 50);
                color: #333;
                transition: all 0.2s;
                padding: 0.5rem 2rem;

                &:first-child {
                    background-color: #ffd700;
                }

                &:hover {
                    background-color: rgb(252, 225, 189);
                    border-color: #ec700a;
                }

                &.p-highlight {
                    background-color: #ffd700;
                    border-color: #ffd700;
                    color: #000;
                }
            }
        }

        .input-wrapper {
            flex: 1;
            background: white;
            border: 2px solid rgb(54, 54, 50);
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            cursor: pointer;
            margin-bottom: 0.15rem;
        }

        .input-wrapper:hover {
            border-color: #ec700a;
            background-color: rgb(252, 225, 189);
        }

        .email-wrapper, .pays-wrapper, .address-wrapper {
            width: 100%;
        }

        .input-field {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
        }

        .input-label {
            font-size: 0.875rem;
            color: rgb(189, 103, 5);
            font-weight: 500;
        }

        .input-value {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1rem;
            color: #212529;
        }

        @media (max-width: 768px) {
            .form-sections-wrapper {
                flex-direction: column;
            }

            .form-row {
                flex-direction: column;
            }

            .input-wrapper {
                width: 100%;
            }
        }




//date range picker



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
            border: 2px solid rgb(54, 54, 50);
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
            border: 2px solid rgb(54, 54, 50);
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
            border: 2px solid rgb(54, 54, 50);
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
                    width: 20px;
                    height: 20px;
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

                .calendar-container {
                    padding: 1.5rem;
                }

                .calendar-header {
                    margin-bottom: 1.5rem;
                    
                    h3 {
                        margin: 0;
                        color: #212529;
                        font-size: 1.25rem;
                        font-weight: 600;
                    }
                }

                .custom-calendar {
                    .p-datepicker {
                        border: none;
                        padding: 0;
                        width: 100%;

                        .p-datepicker-header {
                            background: none;
                            border: none;
                            padding: 0.75rem 0;
                            font-weight: 600;
                            color: #212529;

                            .p-datepicker-title {
                                .p-datepicker-month,
                                .p-datepicker-year {
                                    font-size: 1.1rem;
                                    font-weight: 600;
                                    color: #212529;
                                    margin: 0 0.5rem;
                                    text-transform: capitalize;
                                }
                            }

                            .p-datepicker-prev,
                            .p-datepicker-next {
                                width: 2rem;
                                height: 2rem;
                                color: #212529;
                                border: 2px solid #ec700a;
                                border-radius: 50%;
                                transition: all 0.2s;

                                &:hover {
                                    background-color: #ec700a;
                                    color: #fff;
                                }

                                span {
                                    font-size: 0.8rem;
                                }
                            }
                        }

                        table {
                            font-family: inherit;
                            border-collapse: separate;
                            border-spacing: 4px;

                            th {
                                padding: 0.75rem;
                                font-weight: 600;
                                color: #495057;
                                text-transform: uppercase;
                                font-size: 0.75rem;
                            }

                            td {
                                padding: 0.25rem;
                                width: 2.5rem;
                                height: 2.5rem;

                                span {
                                    width: 100%;
                                    height: 100%;
                                    border-radius: 50%;
                                    transition: all 0.2s;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                &.p-datepicker-today > span {
                                    background-color: #ffd700;
                                    color: #000;
                                    font-weight: bold;
                                }

                                &.p-highlight {
                                    > span {
                                        background-color: #ffd700;
                                        color: #000;
                                    }

                                    &:hover > span {
                                        background-color: #ffed4a;
                                    }
                                }

                                &:not(.p-disabled):not(.p-highlight) {
                                    &:hover > span {
                                        background-color: rgba(255, 215, 0, 0.2);
                                    }
                                }

                                &.p-datepicker-other-month {
                                    opacity: 0.5;
                                }
                            }
                        }

                        .p-datepicker-multiple-month {
                            display: flex;
                            gap: 1rem;

                            .p-datepicker-group {
                                flex: 1;
                                border-right: 1px solid #dee2e6;
                                padding: 0 1rem;

                                &:last-child {
                                    border-right: none;
                                }
                            }
                        }
                    }
                }
            }

            .p-inputnumber {
                width: 100%;
                height: 100%;

                .p-inputnumber-input {
                    width: 100%;
                    height: 20px;
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
                height: 20px;
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

        @media (max-width: 768px) {
            .form-row {
                flex-direction: column;
            }

            .date-time-group {
                flex-direction: column;
            }

            :host ::ng-deep .date-range-overlay {
                width: 100% !important;
                max-width: 100vw;

                .p-calendar {
                    .p-datepicker {
                        .p-datepicker-multiple-month {
                            flex-direction: column;
                        }
                    }
                }
            }
        }

        .age-wrapper, .promo-wrapper {
            flex: 1;
            background: #fff;
            border: 2px solid rgb(54, 54, 50);
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

        .ocr-section {
            margin-top: 2rem;
            padding: 1rem;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);

            h3 {
                color: #333;
                margin-bottom: 1.5rem;
                font-size: 1.25rem;
                font-weight: 600;
            }

            .grid {
                display: grid;
                gap: 1rem;
            }

            .col-span-12 {
                grid-column: span 12;
            }

            @media (min-width: 768px) {
                .md\:col-span-6 {
                    grid-column: span 6;
                }
            }

            @media (min-width: 1024px) {
                .lg\:col-span-4 {
                    grid-column: span 4;
                }
            }
        }
    `]
})
export class CoordonneesReservationComponent implements OnInit {
    @Input() initialData?: any;
    @Output() formSubmit = new EventEmitter<any>();
    @ViewChild('fileUpload') fileUpload: any;
    @ViewChild('previewImage') previewImage!: ElementRef;

    coordonneesForm: FormGroup;
    civiliteOptions = [
        { label: 'M', value: 'M' },
        { label: 'MME', value: 'MME' }
    ];

    paysOptions = [
        { label: 'Afghanistan', value: 'AF' },
        { label: 'France', value: 'FR' },
        { label: 'Maroc', value: 'MA' },
        // Ajoutez d'autres pays selon vos besoins
    ];

    compagniesOptions = [
        { label: 'Air France', value: 'AIR_FRANCE' },
        { label: 'Royal Air Maroc', value: 'RAM' },
        { label: 'Air Arabia', value: 'AIR_ARABIA' },
        { label: 'Ryanair', value: 'RYANAIR' },
        { label: 'Ryan Air', value: 'RYAN_AIR' },
        { label: 'Autre', value: 'AUTRE' }
    ];

    uploadedFile: File | null = null;
    imagePreviewUrl: string | ArrayBuffer | null = null;
    safePdfUrl: SafeResourceUrl | null = null;
    isProcessing = false;
    progress = 0;
    extractedText = '';
    extractedFields: any = {
        prenom: '',
        nom: '',
        email: '',
        adresse: '',
        codePostal: '',
        ville: '',
        telephone: ''
    };

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private ocrService: OcrService,
        private sanitizer: DomSanitizer
    ) {
        this.coordonneesForm = this.fb.group({
            civilite: ['M', Validators.required],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            pays: ['', Validators.required],
            adresse: ['', Validators.required],
            codePostal: ['', Validators.required],
            ville: ['', Validators.required],
            telephone: ['', Validators.required],
            dateNaissance: [null, Validators.required],
            compagnie: [null],
            numeroVol: [''],
            observations: ['']
        });
    }

    ngOnInit() {
        if (this.initialData) {
            this.coordonneesForm.patchValue(this.initialData);
        }
    }

    focusInput(inputId: string): void {
        const element = document.getElementById(inputId);
        if (element) {
            element.focus();
        }
    }

    onSubmit() {
        if (this.coordonneesForm.valid) {
            this.formSubmit.emit(this.coordonneesForm.value);
        }
    }

    onUpload(event: any) {
        this.uploadedFile = event.files[0];
        this.showPreview();
    }

    showPreview() {
        if (!this.uploadedFile) return;
        
        if (this.uploadedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreviewUrl = e.target?.result || null;
                this.safePdfUrl = null;
            };
            reader.readAsDataURL(this.uploadedFile);
        } 
        else if (this.uploadedFile.type === 'application/pdf') {
            const pdfUrl = URL.createObjectURL(this.uploadedFile);
            this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
            this.imagePreviewUrl = pdfUrl;
            
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
            }, 100);
        } 
        else {
            this.imagePreviewUrl = null;
            this.safePdfUrl = null;
            this.messageService.add({
                severity: 'info',
                summary: 'Aperçu non disponible',
                detail: 'L\'aperçu n\'est disponible que pour les images et les PDF.'
            });
        }
    }

    async processWithTesseract() {
        if (!this.uploadedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez d\'abord télécharger un fichier'
            });
            return;
        }

        if (!this.uploadedFile.type.startsWith('image/')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Format non supporté',
                detail: 'Tesseract.js ne peut traiter que des images. Utilisez le traitement côté serveur pour les PDF.'
            });
            return;
        }

        this.isProcessing = true;
        this.progress = 0;

        try {
            const imageUrl = URL.createObjectURL(this.uploadedFile);
            
            const worker = await Tesseract.createWorker({
                logger: progress => {
                    if (progress.status === 'recognizing text') {
                        this.progress = Math.round(progress.progress * 100);
                    }
                },
                langPath: 'https://raw.githubusercontent.com/tesseract-ocr/tessdata/main',
                gzip: false
            });
            
            await worker.loadLanguage('fra');
            await worker.initialize('fra');
            
            const result = await worker.recognize(imageUrl);
            
            await worker.terminate();
            URL.revokeObjectURL(imageUrl);
            
            this.extractedText = result.data.text;
            
            this.extractFields(this.extractedText);
            
            this.isProcessing = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Succès',
                detail: 'Texte extrait avec succès'
            });
        } catch (error) {
            console.error('OCR Error:', error);
            this.isProcessing = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Erreur lors de l\'extraction du texte'
            });
        }
    }

    processWithBackend() {
        if (!this.uploadedFile) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez d\'abord télécharger un fichier'
            });
            return;
        }

        const supportedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
        if (!supportedTypes.includes(this.uploadedFile.type)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Format non supporté',
                detail: 'Seuls les formats JPEG, PNG, TIFF et PDF sont supportés.'
            });
            return;
        }

        this.isProcessing = true;
        this.progress = 0;

        const formData = new FormData();
        formData.append('file', this.uploadedFile);

        this.ocrService.processDocument(formData).subscribe({
            next: (response: any) => {
                this.extractedText = response.text;
                this.extractFields(this.extractedText);
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: 'Document traité avec succès'
                });
            },
            error: (error) => {
                console.error('Backend OCR Error:', error);
                this.isProcessing = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Erreur lors du traitement du document'
                });
            }
        });
    }

    extractFields(text: string) {
        // Extraction des champs pertinents pour le formulaire de réservation
        const prenomMatch = text.match(/Prénom[:\s]+([^\n]+)/i);
        const nomMatch = text.match(/Nom[:\s]+([^\n]+)/i);
        const emailMatch = text.match(/Email[:\s]+([^\n]+)/i);
        const adresseMatch = text.match(/Adresse[:\s]+([^\n]+)/i);
        const codePostalMatch = text.match(/Code postal[:\s]+([^\n]+)/i);
        const villeMatch = text.match(/Ville[:\s]+([^\n]+)/i);
        const telephoneMatch = text.match(/Téléphone[:\s]+([^\n]+)/i);

        this.extractedFields = {
            prenom: prenomMatch ? prenomMatch[1].trim() : '',
            nom: nomMatch ? nomMatch[1].trim() : '',
            email: emailMatch ? emailMatch[1].trim() : '',
            adresse: adresseMatch ? adresseMatch[1].trim() : '',
            codePostal: codePostalMatch ? codePostalMatch[1].trim() : '',
            ville: villeMatch ? villeMatch[1].trim() : '',
            telephone: telephoneMatch ? telephoneMatch[1].trim() : ''
        };

        // Remplir automatiquement le formulaire
        this.fillForm();
    }

    fillForm() {
        if (this.extractedFields) {
            Object.keys(this.extractedFields).forEach(key => {
                if (this.coordonneesForm.contains(key)) {
                    this.coordonneesForm.get(key)?.setValue(this.extractedFields[key]);
                }
            });
        }
    }

    clear() {
        this.uploadedFile = null;
        this.imagePreviewUrl = null;
        this.safePdfUrl = null;
        this.extractedText = '';
        this.extractedFields = {
            prenom: '',
            nom: '',
            email: '',
            adresse: '',
            codePostal: '',
            ville: '',
            telephone: ''
        };
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }
} 