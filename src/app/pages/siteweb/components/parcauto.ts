import { Component, signal, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ProductService } from '../../service/product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { TimelineModule } from 'primeng/timeline';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TooltipModule } from 'primeng/tooltip';
import { ModeleService } from '../../modele/services/modele.service';
import { agence, Reservation } from '../../reservation/models/reservation.model';
import { Modele } from '../../modele/models/modele.model';
import { environment } from '../../../../environments/environment';
import { CategorieService } from '../../categorie/services/categorie.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { TarifLocationService } from '../../parametragesiteweb/services/tarif-location.service';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { Stepper } from 'primeng/stepper';
import { CoordonneesReservationComponent } from './coordonnees-reservation/coordonnees-reservation.component';
import { Router } from '@angular/router';


@Component({
    selector: 'parcauto-widget',
    standalone: true,
    imports: [
        ButtonModule,
        RippleModule,
        CommonModule,
        CardModule,
        FloatLabelModule,
        DataViewModule,
        StepperModule,
        SelectButtonModule,
        TagModule,
        FormsModule,
        ReactiveFormsModule,
        DatePickerModule,
        InputTextModule,
        SelectModule,
        InputNumberModule,
        DividerModule,
        CheckboxModule,
        RadioButtonModule,
        InputMaskModule,
        TimelineModule,
        AvatarModule,
        BadgeModule,
        ChipModule,
        PanelModule,
        InputSwitchModule,
        DatePickerModule,
        InputIconModule,
        IconFieldModule,
        InputGroupModule,
        MultiSelectModule,
        InputGroupAddonModule,
        DateRangePickerComponent,
        CoordonneesReservationComponent,
        TooltipModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ModeleService,ProductService],
    template: `
        <div class="lines"></div>
        <div id="parcauto" class="landing-hero">
            <!-- Hero Header -->
            <div class="hero-header text-center">
                <div class="reservation-summary">
                    <div class="summary-container">
                    <div [class]="stepValue === 1 ? 'summary-step current' : 'summary-step'">
                            <div class="flex justify-between">
                                <div class="step-icon">
                                <span class="step-numberheader">1</span>
                                    AGENCES ET DATES
                                </div>
                                <button pButton label="Modifier" (click)="onModifierReservation()" class="edit-button"></button>
                            </div>
                            <div *ngIf="reservationForm.get('agenceDepart')?.value" class="vehicle-details">
                                <div class=" flex justify-between">
                                    <div class="departure">
                                        <div class="text-center text-yellow-500">Départ</div>
                                        <div class="agency">{{reservationForm.get('agenceDepart')?.value.name}}</div>
                                        <div class="date">{{formatDate(reservationForm.get('dateDepart')?.value)}}</div>
                                            <div class="time">{{reservationForm.get('heureDepart')?.value.label}}</div>
                                    </div>
                                    <div class="lineshorizontal">
                                     
                                    </div>
                                    <div class="return">
                                        <div class="text-center text-yellow-500">Retour</div>
                                        <div class="agency">{{reservationForm.get('agenceRetour')?.value.name}}</div>
                                        <div class="date">{{formatDate(reservationForm.get('dateRetour')?.value)}}</div>
                                        <div class="time">{{reservationForm.get('heureRetour')?.value.label}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div [class]="stepValue === 2 ? 'summary-step current' : 'summary-step'">
                            <div class="flex justify-between">
                            <div class="step-icon">
                                <span class="step-numberheader">2</span>
                                VEHICULE
                            </div>
                                <button pButton label="Modifier" class="edit-button" (click)="onModifierVehicule()"></button>
                        </div>
                            <div class="step-content" *ngIf="vehiculeSelectionne">
                                <div class="vehicle-details flex justify-between ">
                                    <div>
                                        <img [src]="getImageUrl(vehiculeSelectionne)" [alt]="vehiculeSelectionne.marque.nom + ' ' + vehiculeSelectionne.nom" />
                                        <img *ngIf="vehiculeSelectionne.isNew" src="assets/images/new-badge.png" class="new-badge" alt="Nouveau" />
                                    </div>
                                    <div class="vehicle-info">
                                        <div class="vehicle-category">{{ vehiculeSelectionne.categorie.nom }}</div>
                                        <div class="vehicle-name">{{ vehiculeSelectionne.marque.nom }} {{ vehiculeSelectionne.nom }}</div>
                                        <div class="vehicle-specs">
                                            <span><i class="pi pi-cog"></i> {{ vehiculeSelectionne.typeTransmission }}</span>
                                            <span><i class="pi pi-car"></i> {{ vehiculeSelectionne.typeCarburant }}</span>
                                        </div>
                                        <div class="vehicle-specs">
                                            <span><i class="pi pi-users"></i> {{ vehiculeSelectionne.nbrePlaces }} places </span>
                                            <span><i class="pi pi-car"></i> {{ vehiculeSelectionne.nbrePortes }} portes </span>
                                        </div>
                                        <div class="vehicle-specs">
                                            
                                        </div>
                                        <div class="vehicle-specs">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div [class]="stepValue === 3 ? 'summary-step current' : 'summary-step'">
                            <div class="step-icon">
                                <span class="step-numberheader">3</span>
                                OPTIONS
                            </div>
                        </div>
                        <div [class]="stepValue === 4 ? 'summary-step current' : 'summary-step'">
                            <div class="step-icon">
                                <span class="step-numberheader">4</span>
                                RÉSUMÉ
                            </div>
                        </div>
                    </div>
                </div>
            </div>
   

            <div class="card flex justify-center">
                <p-stepper #stepper [value]="stepValue" class="modern-stepper" [linear]="true"> 
                    <p-step-list class="custom-step-list">
                        <div class="step-container">
                            <div class="step-item" [class.active]="stepValue >= 1" (click)="goStep1()">
                                <div class="step-number">1</div>
                                <div class="step-label">CHANGER L'ITINÉRAIRE</div>
                                
                            </div>
                            <div class="step-item" [class.active]="stepValue >= 2" (click)="goStep2()">
                                <div class="step-number">2</div>
                                <div class="step-label">CHOISIR UN VÉHICULE</div>
                              
                            </div>
                            <div class="step-item" [class.active]="stepValue >= 3" (click)="goStep3()">
                                <div class="step-number">3</div>
                                <div class="step-label">SERVICES</div>
                          
                            </div>
                            <div class="step-item" [class.active]="stepValue >= 4" (click)="goStep4()">
                                <div class="step-number">4</div>
                                <div class="step-label">SERVICES</div>
                          
                            </div>
                            <div class="step-item" [class.active]="stepValue >= 5" (click)="goStep5()">
                                <div class="step-number">5</div>
                                <div class="step-label">SERVICES</div> 
                            </div>

                        </div>
                    </p-step-list>
                    <p-step-panels style="background: transparent; padding: 0; margin-top: 1rem;">
                        <p-step-panel [value]="1" style="background: transparent; padding: 0; border-radius: 0.75rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                            <ng-template #content let-activateCallback="activateCallback">
                                
                                <div class="rounded-lg shadow-2xl bg-white dark:bg-gray-800 py-0 px-4">
                                <div class="flex pt-6 justify-end">
                                    <p-button label="Next" styleClass="text-black" icon="pi pi-arrow-right" iconPos="right" (onClick)="goStep2()" />
                                </div>
                                <div >
                                    <h3>Infos réservation</h3>
                                    <form [formGroup]="reservationForm" (ngSubmit)="onSubmit()" class="reservation-form">
                                        <div class="flex flex-col gap-12 w-full sm:w-auto">

                                            <div class="flex flex-col sm:flex-row sm:items-center gap-12">
                                                <div class="flex-1">
                                                    <app-date-range-picker
                                                        [minDate]="minDate"
                                                        [reservation]="reservation"
                                                        (reserverVehicule)="OnChercheVehicule($event)"
                                                    ></app-date-range-picker>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                                                </div>
                                                            </ng-template>                                                            
                        </p-step-panel>
                      
                         <p-step-panel [value]="2" style="background: transparent; padding: 0; border-radius: 0.75rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                        <ng-template #content let-activateCallback="activateCallback">
                                <div class="rounded-lg shadow-2xl bg-white dark:bg-gray-800 px-4 py-0">
                                <div class="flex pt-6 justify-between">
                                    <p-button label="Back" icon="pi pi-arrow-left" (onClick)="goStep1()" />
                                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="goStep3()" />
                                </div>
                               
                                            <h3>Choisissez votre véhicule</h3>
                                         
                                        <div class="filters-section bg-white rounded-lg shadow-sm mb-6">
                                        <div class="flex justify-between p-4 border-b">

                                            <div class="filters-header flex items-center justify-left ">
                                                <div class="flex items-center gap-2">
                                                    <i class="pi pi-tags text-yellow-500"></i>
                                                    <span class="font-semibold pl-3 pr-5">Filtre avancé</span>
                                                </div>
                                                <button pButton 
                                                    class="p-button-text p-button-rounded p-button-warning px-3"
                                                    [icon]="isFiltersVisible ? 'pi pi-filter-slash' : 'pi pi-filter'"
                                                    (click)="toggleFilters()"
                                                    [pTooltip]="isFiltersVisible ? 'Masquer les filtres' : 'Afficher les filtres'"
                                                ></button>
                                            </div>
                                            <div class="filters-header flex items-center justify-right ">
                                            <p-selectButton 
                                                        [(ngModel)]="layout" 
                                                        [options]="options" 
                                                        styleClass="view-toggle-modern"
                                                        [allowEmpty]="false">
                                                        <ng-template let-item pTemplate="item">
                                                            <i class="pi text-lg" [ngClass]="{ 'pi-th-large': item === 'grid', 'pi-list': item === 'list' }"></i>
                                                                </ng-template>
                                                </p-selectButton>

                                            </div>
                                        </div>

                                        <div class="filters-content" [class.hidden]="!isFiltersVisible">
                                            <div class="grid grid-cols-3 gap-6 p-6">
                                                <!-- Catégorie véhicule -->
                                                <div class="filter-column">
                                                    <h3 class="text-gray-600 font-medium mb-4 pb-2 border-b">Catégorie véhicule</h3>
                                                    <div class="flex flex-col gap-3">
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                [value]="'all'"
                                                                [(ngModel)]="categories"
                                                                [label]="'Toutes Catégories'"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> Toutes
                                                        </label>
                                                        <label class="custom-checkbox" *ngFor="let category of categories">
                                                            <p-checkbox 
                                                                [value]="category"
                                                                [(ngModel)]="selectedCategories"
                                                                [label]="category.nom"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox>{{category.nom}}
                                                        </label>
                                                    </div>
                                                </div>

                                                <!-- Type de carburant -->
                                                <div class="filter-column">
                                                    <h3 class="text-gray-600 font-medium mb-4 pb-2 border-b">Type de carburant</h3>
                                                    <div class="flex flex-col gap-3">
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="ELECTRIQUE"
                                                                [(ngModel)]="selectedTypeCarburants"
                                                                label="Électrique"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> Électrique
                                                        </label>
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="ESSENCE"
                                                                [(ngModel)]="selectedTypeCarburants"
                                                                label="Essence"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> Essence
                                                        </label>
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="DIESEL"
                                                                [(ngModel)]="selectedTypeCarburants"
                                                                label="Gasoil"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> Gasoil
                                                        </label>
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="HYBRIDE"
                                                                [(ngModel)]="selectedTypeCarburants"
                                                                label="Hybride"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> Hybride
                                                        </label>
                                                    </div>
                                                </div>

                                                  <!-- Type de transmission -->
                                                  <div class="filter-column">
                                                    <h3 class="text-gray-600 font-medium mb-4 pb-2 border-b">Type de transmission</h3>
                                                    <div class="flex flex-col gap-3">
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="AUTOMATIQUE"
                                                                [(ngModel)]="selectedTypeTransmissions"
                                                                label="BV Automatique"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox>AUTOMATIQUE
                                                        </label>
                                                        <label class="custom-checkbox">
                                                            <p-checkbox 
                                                                value="MANUELLE"
                                                                [(ngModel)]="selectedTypeTransmissions"
                                                                label="BV Manuelle"
                                                                (onChange)="filterByCategoriesAndTypeCarburantsAndTypeTransmissions()"
                                                                styleClass="custom-checkbox-input"
                                                            ></p-checkbox> MANUELLE     
                                                        </label>
                                                    </div>
                                                </div>    
                                            </div>

                                            <div class="flex justify-between p-4 gap-4">
                                                <button pButton 
                                                    label="EFFACER" 
                                                    icon="pi pi-refresh"
                                                    (click)="resetFilters()"
                                                    class="p-button-text p-button-info w-full"
                                                ></button>
                                                <button pButton 
                                                    class="p-button-text p-button-danger w-full"
                                                    label="Fermer" 
                                                    icon="pi pi-times"
                                                    (click)="toggleFilters()"
                                                ></button>
                                            </div>
                                        </div>
                                        </div>
                                
                  
                                     <div class="card">
                                        <p-dataview #dv [value]="modeles()" [layout]="layout" styleClass="modern-dataview">
                                            <!-- LIST VIEW TEMPLATE -->
                                            <ng-template #list let-items>
                                                <div class="grid grid-cols-1 gap-6 px-4 py-6">
                                                    <div *ngFor="let item of items"
                                                         class="vehicle-list-item flex flex-col md:flex-row gap-6 p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden group">
                                                        <!-- Image Section -->
                                                        <div class="flex-shrink-0 w-full md:w-64 h-48 md:h-56 relative overflow-hidden rounded-lg bg-gray-100">
                                                            <img class="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                                 [src]="getImageUrl(item)"
                                                                 [alt]="item.marque.nom + ' ' + item.nom" />
                                                            <img *ngIf="item.isNew" src="assets/images/new-badge.png" class="absolute top-2 right-2 w-12 h-auto z-10 drop-shadow-md" alt="Nouveau" />
                                                        </div>
                                                        <!-- Details Section -->
                                                        <div class="flex-grow flex flex-col justify-between">
                                                            <div>
                                                                <div class="flex flex-col sm:flex-row justify-between items-start mb-2">
                                                                    <div>
                                                                        <span class="text-xs font-semibold text-yellow-600 uppercase tracking-wider">{{ item.categorie.nom }}</span>
                                                                        <h3 class="text-xl lg:text-2xl font-bold text-gray-800 mt-1 leading-tight">{{ item.marque.nom }} {{ item.nom }}</h3>
                                                                    </div>
                                                                    <div class="text-left sm:text-right mt-2 sm:mt-0 flex-shrink-0">
                                                                        <span class="text-xl lg:text-2xl font-bold text-green-700 block">{{ item.prix | number:'1.2-2' }} €</span>
                                                                        <p class="text-xs text-gray-500">{{ item.prixJours | number:'1.2-2' }} €/jour</p>
                                                                    </div>
                                                                </div>
                                                                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 my-4 border-t border-b border-gray-100 py-3">
                                                                    <div class="flex items-center gap-2"><i class="pi pi-users text-gray-500 text-base"></i><span>{{ item.nbrePlaces }} places</span></div>
                                                                    <div class="flex items-center gap-2"><i class="pi pi-cog text-gray-500 text-base"></i><span>{{ item.typeTransmission }}</span></div>
                                                                    <div class="flex items-center gap-2"><i class="pi pi-car text-gray-500 text-base"></i><span>{{ item.typeCarburant }}</span></div>
                                                                    <div class="flex items-center gap-2"><i class="pi pi-box text-gray-500 text-base"></i><span>{{ item.nbrePortes }} portes</span></div>
                                                                    <div class="flex items-center gap-2"><i class="pi pi-briefcase text-gray-500 text-base"></i><span>{{ item.nbreValises }} valises</span></div>
                                                                    <div class="flex items-center gap-2"><i class="pi pi-shopping-bag text-gray-500 text-base"></i><span>{{ item.nbreSacs }} sacs</span></div>
                                                                </div>
                                                            </div>
                                                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
                                                                 <a href="#" class="text-yellow-700 hover:text-yellow-800 font-medium text-xs hover:underline transition-colors duration-200">Voir plus de détails</a>
                                                                 <button pButton
                                                                    label="RÉSERVER CE VÉHICULE"
                                                                    class="p-button-warning p-button-raised w-full sm:w-auto !py-2.5"
                                                                    icon="pi pi-angle-right" iconPos="right"
                                                                    [disabled]="!item.isVisible"
                                                                    (click)="onReserverVehicule(item)">
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ng-template>

                                            <!-- GRID VIEW TEMPLATE -->
                                            <ng-template #grid let-items>
                                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-4 py-6">
                                                    <div *ngFor="let modele of items"
                                                         class="vehicle-grid-item bg-white rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden flex flex-col group">
                                                        <!-- Image Section -->
                                                        <div class="relative h-48 overflow-hidden bg-gray-100">
                                                            <img class="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                                 [src]="getImageUrl(modele)"
                                                                 [alt]="modele.marque.nom + ' ' + modele.nom" />
                                                            <img *ngIf="modele.isNew" src="assets/images/new-badge.png"
                                                                 class="absolute top-2 right-2 w-12 h-auto z-10 drop-shadow-md" alt="Nouveau" />
                                                            <div class="absolute bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent w-full p-3">
                                                                 <span class="text-xs font-semibold text-yellow-300 uppercase tracking-wider">{{ modele.categorie.nom }}</span>
                                                            </div>
                                                        </div>
                                                        <!-- Details Section -->
                                                        <div class="p-4 flex flex-col flex-grow">
                                                            <h3 class="text-base font-bold text-gray-800 mb-1 leading-snug">{{ modele.marque.nom }} {{ modele.nom }}</h3>
                                                            <div class="flex justify-between items-center mb-3">
                                                                 <span class="text-lg font-bold text-green-700">{{ modele.prix | number:'1.2-2' }} €</span>
                                                                 <span class="text-xs text-gray-500">{{ modele.prixJours | number:'1.2-2' }} €/jour</span>
                                                            </div>

                                                            <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700 mb-4 flex-grow">
                                                                 <div class="flex items-center gap-1.5 truncate"><i class="pi pi-users text-gray-500 text-sm"></i><span>{{ modele.nbrePlaces }} places</span></div>
                                                                 <div class="flex items-center gap-1.5 truncate"><i class="pi pi-cog text-gray-500 text-sm"></i><span>{{ modele.typeTransmission }}</span></div>
                                                                 <div class="flex items-center gap-1.5 truncate"><i class="pi pi-car text-gray-500 text-sm"></i><span>{{ modele.typeCarburant }}</span></div>
                                                                 <div class="flex items-center gap-1.5 truncate"><i class="pi pi-box text-gray-500 text-sm"></i><span>{{ modele.nbrePortes }} portes</span></div>
                                                            </div>

                                                            <div class="mt-auto flex flex-col gap-2 pt-3 border-t border-gray-100">
                                                                <button pButton
                                                                    label="RÉSERVER"
                                                                    class="p-button-warning p-button-raised w-full !py-2"
                                                                    icon="pi pi-angle-right" iconPos="right"
                                                                    [disabled]="!modele.isVisible"
                                                                    (click)="onReserverVehicule(modele)">
                                                                </button>
                                                                 <a href="#" class="text-center text-yellow-700 hover:text-yellow-800 font-medium text-xs hover:underline transition-colors duration-200">Plus de détails</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ng-template>
                                        </p-dataview>
                                    </div>
                             </div>   
                                
                         </ng-template>
                        </p-step-panel>

                        <p-step-panel [value]="3" style="background: transparent; padding: 0; border-radius: 0.75rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                            <ng-template #content let-activateCallback="activateCallback">
                                <div class="rounded-lg shadow-2xl bg-white dark:bg-gray-800 px-4 py-0">
                                <div class="flex pt-6 justify-between">
                                    <p-button label="Back" icon="pi pi-arrow-left" (onClick)="goStep2()" />
                                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="goStep4()" />
                                    </div>
                                    <app-coordonnees-reservation
                                        (formSubmit)="onCoordonneesSubmit($event)"
                                    ></app-coordonnees-reservation>
                                </div>
                               
                            </ng-template>
                        </p-step-panel>

                        <p-step-panel [value]="4" style="background: transparent; padding: 0; border-radius: 0.75rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                            <ng-template #content let-activateCallback="activateCallback">
                            <div class="rounded-lg shadow-2xl bg-white dark:bg-gray-800 px-4 py-0">
                            <div class="flex pt-6 justify-between">
                                    <p-button label="Back" icon="pi pi-arrow-left" (onClick)="goStep3()" />
                                    <p-button label="Next" icon="pi pi-arrow-right" iconPos="right" (onClick)="goStep5()" />
                                    </div>
                                    <h3>Confirmation</h3>
                                </div>
                                
                            </ng-template>
                        </p-step-panel>

                        <p-step-panel [value]="5" style="background: transparent; padding: 0; border-radius: 0.75rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); transition: all 0.3s ease;">
                            <ng-template #content let-activateCallback="activateCallback">
                            <div class="rounded-lg shadow-2xl bg-white dark:bg-gray-800 px-4 py-0">
                            <div class="flex pt-6 justify-start">
                                    <p-button label="Back" icon="pi pi-arrow-left" iconPos="right" (onClick)="goStep4()" />
                                    </div>
                            <h3>Confirmation</h3>
                                </div>
                                
                            </ng-template>
                        </p-step-panel>
                    </p-step-panels>
                </p-stepper>
                                                 
            </div>    
        </div>
    `,

    styles: [`

        .landing-hero {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)); 
            border-radius: 0 0 0 0;
            overflow: hidden;
            }
        
        .hero-header {
                    padding: 1rem;
            background: #2c3e50;
            backdrop-filter: blur(10px);
            border-radius: 0;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            margin: 0 0 0 0;
        }
        
        :host ::ng-deep .p-inputtext {
            border-radius: 0.5rem;
            border-color: #e0e0e0;
        }
        
        :host ::ng-deep .p-inputtautoocus {
            border-color: #ec700a;
            box-shadow: 0 0 0 1px #fff9f5;
        }
        
        :host ::ng-deep .p-select {
            border-radius: 0.5rem;
        }
        
        :host ::ng-deep .p-select .p-select-label {
            padding-left: 0.5rem;
        }
        
        :host ::ng-deep .p-datepicker .p-datepicker-input {
            border-radius: 0 0.5rem 0.5rem 0;
        }

        :host ::ng-deep .p-datepicker .p-datepicker-header {
            background-color: #ec700a;
            color: white;
            border-radius: 0.5rem 0.5rem 0 0;
        }
        
        :host ::ng-deep .p-button:hover {
            background: #d66409;
            border-color: #d66409;
        }
        
        :host ::ng-deep .p-button.p-button-raised {
            box-shadow: 0 4px 6px -1px rgba(236, 112, 10, 0.2);
        }
        
        :host ::ng-deep .p-button.p-button-rounded {
            border-radius: 9999px;
        }
        
   

        /* Responsive adjustments - Tablette */
        @media (max-width: 992px) {
            .landing-hero {
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
            }

            .hero-header {
                padding: 0.75rem !important;
                margin: 0 !important;
                width: 100% !important;
            }

            .card {
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
            }

            .summary-container {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            .summary-step {
                padding: 0.5rem !important;
                margin: 0 !important;
            }

            .step-icon {
                padding: 0.5rem !important;
                font-size: 0.85rem !important;
            }

            .vehicle-details {
                padding: 0.5rem !important;
                margin: 0 !important;
            }

            .vehicle-details img {
                width: 80px !important;
                height: 60px !important;
                }

                .vehicle-info {
                gap: 0.25rem !important;
            }

            .vehicle-name {
                font-size: 0.9rem !important;
            }

            .vehicle-specs {
                font-size: 0.75rem !important;
            }

          

            .rounded-lg {
                border-radius: 0 !important;
                padding: 0.75rem !important;
            }

            .filters-section {
                padding: 0.75rem !important;
                margin-bottom: 0.75rem !important;
            }

            .filters-grid {
                gap: 0.5rem !important;
            }
        }

        @media (max-width: 576px) {
            .landing-hero {
                padding: 0 !important;
            }

            .hero-header {
                padding: 0.5rem !important;
            }

            .summary-container {
                grid-template-columns: 1fr !important;
            }

            .summary-step {
                padding: 0.5rem !important;
            }

            .step-icon {
                padding: 0.5rem !important;
                font-size: 0.8rem !important;
            }

            .vehicle-details {
                flex-direction: column !important;
                align-items: center !important;
                text-align: center !important;
            }

            .vehicle-details img {
                width: 100% !important;
                height: 120px !important;
                margin-bottom: 0.5rem !important;
            }

            .vehicle-info {
                width: 100% !important;
                text-align: center !important;
            }

            .vehicle-specs {
                justify-content: center !important;
            }

           
            .rounded-lg {
                padding: 0.5rem !important;
            }

            .filters-section {
                padding: 0.5rem !important;
            }

            .filters-grid {
                grid-template-columns: 1fr !important;
            }

            .filter-item {
                width: 100% !important;
            }
        }

        .yellow-button {
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

        .black-button {
            width: 100%;
            height: 100%;
            background-color:rgb(34, 33, 31);
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

        .edit-button {
            width: 20%;
            height: 60%;
            background-color: rgb(253, 237, 10);
            border: none;
            color: #000;
        }

        .edit-button {
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            color: yellow !important;
            padding: 0.5rem 1rem !important;
            margin-top: 0.5rem;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease !important;
        }

        .edit-button:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            border-color: #ffd700 !important;
        }

      
        
        @media (max-width: 992px) {
            .service-card {
                flex-direction: column;
                height: auto;
            }
            
            .card-content,
            .card-image {
                width: 100%;
            }
            
            .card-image {
                height: 250px;
            }
        }
        
        @media (max-width: 800px) {
            .landing-hero {
                padding: 2rem 1rem;
            }
            
            .hero-header {
                margin-bottom: 2rem;
            }
        }

        .reservation-summary {
            width: 100%;
        }

        .summary-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
            position: relative;
        }

        .summary-step {
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
        }

        .summary-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 20%;
            right: -1px;
            height: 60%;
            width: 1px;
            background: linear-gradient(to bottom, transparent, #ffd700, transparent);
            z-index: 2;
        }

        .summary-step.current {
            border-color: #ffd700;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.15);
        }

        .step-icon {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #2c3e50;
            color: white;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .step-numberheader {
            width: 28px;
            height: 28px;
            background:rgb(238, 177, 10);
            color: #2c3e50;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1rem;
        }

        .step-content {
            padding: 0.1rem;
        }

        .location-details {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .departure, .return {
            padding: 1rem;
            background: rgba(44, 62, 80, 0.02);
            transition: all 0.3s ease;
        }

        .departure:hover, .return:hover {
            background: rgba(44, 62, 80, 0.04);
            transform: translateX(5px);
        }

        .agency {
            font-weight: 600;
            color: #fff;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }

        .date, .time {
            color: #fff;
            font-size: 0.95rem;
        }

        .separator {
            display: flex;
            align-items: center;
            padding: 0.75rem 0;
        }

        .line {
            height: 2px;
            background: linear-gradient(to right, #ffd700, #ec700a);
            width: 100%;
            opacity: 0.7;
        }

        .lines {
            height: 5px;
            background: linear-gradient(to right, #ffd700,rgb(230, 247, 5));
            width: 100%;
            opacity: 0.7;
        }
        .lineshorizontal {
            height: 4px;
            background: linear-gradient(to right, #ffd700,rgb(230, 247, 5));
            width: 25px;
            opacity: 0.7;
            margin-top: 0.5rem;
            align-self: center;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
            .summary-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 0;
            }

            .summary-step:nth-child(2n)::after {
                display: none;
            }

            .step-icon {
                padding: 0.75rem;
            font-size: 0.9rem;
            }
            
            .step-numberheader {
                width: 24px;
                height: 24px;
            }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .summary-container {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }

            .summary-step::after {
                display: none;
            }

            .step-icon {
                font-size: 0.9rem;
            }

            .departure, .return {
                padding: 0.75rem;
                text-align: left;
            }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .summary-step {
                background: #1a1f25;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .step-icon {
                background: #2c3e50;
            }

            .departure, .return {
                background: rgba(255, 255, 255, 0.03);
            }

            .agency {
                color: #e2e8f0;
            }

            .date, .time {
                color: #94a3b8;
            }
        }

        .vehicle-details {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0 0 0 0;
            transition: all 0.3s ease;
        }

        .vehicle-details img {
            width: 100px;
            height: 70px;
            object-fit: cover;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .vehicle-details:hover img {
            transform: scale(1.05);
        }

        .vehicle-details .new-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 40px;
            height: auto;
            z-index: 2;
        }

        .vehicle-info {
            flex: 1;
            display: flex;
                flex-direction: column;
            gap: 0.5rem;
        }

        .vehicle-category {
            font-size: 0.85rem;
            color: #ffd700;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .vehicle-name {
            font-size: 1.1rem;
            font-weight: 600;
            color: white;
            margin-bottom: 0.25rem;
                text-align: center;
            }

        .vehicle-specs {
          
            font-size: 0.85rem;
            color: #fff;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .vehicle-specs span {
            margin-right: 1rem;
            padding-top: 5rem;
            align-items: center;
            gap: 0.35rem; 
        }

        .vehicle-specs i {
            color: #ffd700;
            font-size: 0.9rem;
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .vehicle-details {
                background: rgba(255, 255, 255, 0.03);
            }

            .vehicle-category {
                color: #ffd700;
            }

            .vehicle-name {
                color: #e2e8f0;
            }

            .vehicle-specs {
                color: rgba(255, 255, 255, 0.7);
            }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .vehicle-details {
                
                gap: 0.75rem;
            }

            .vehicle-details img {
                width: 100%;
                height: 120px;
            }

            .vehicle-specs {
                flex-wrap: wrap;
            }
        }

        /* Styles du stepper moderne */
        :host ::ng-deep .modern-stepper {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        :host ::ng-deep .custom-step-list {
            background: #fff;
            padding: 0;
            margin: 0;
            border-bottom: 4px solid #FFD700;
         
            width: 100%;
           
        }

        :host ::ng-deep .step-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            position: relative;
            background: #fff;
            width: 100%;
            gap: 1rem;
        }

        :host ::ng-deep .step-item {
            flex: 1;
            display: flex;
            align-items: center;
            position: relative;
            padding: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            background: rgb(250, 250, 247);
            border-bottom: 4px solid transparent;
            margin-bottom: 0;
            gap: 1rem;
            min-width: 0;
        }

        :host ::ng-deep .step-item.active {
            border-bottom-color: rgb(84, 85, 81);
            border-bottom-width: 5px;
            background: rgb(248, 235, 163);
        }

        :host ::ng-deep .step-number {
            min-width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #f0f0f0;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        :host ::ng-deep .step-item.active .step-number {
            background:rgb(238, 177, 10);
            color: #000;
        }

        :host ::ng-deep .step-label {
            color: #000;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            transition: all 0.3s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
        }

        /* Styles responsives */
        @media (max-width: 992px) {
            :host ::ng-deep .step-container {
                gap: 0;
            }

            :host ::ng-deep .step-item {
                padding: 0.75rem;
                gap: 0.5rem;
            }

            :host ::ng-deep .step-label {
                font-size: 0.75rem;
            }
        }

        @media (max-width: 768px) {
            :host ::ng-deep .step-container {
                flex-wrap: nowrap;
                overflow-x: auto;
                padding-bottom: 5px;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            :host ::ng-deep .step-container::-webkit-scrollbar {
                display: none;
            }

            :host ::ng-deep .step-item {
                flex: 0 0 auto;
                width: auto;
                min-width: 120px;
            }

            :host ::ng-deep .step-number {
                width: 25px;
                height: 25px;
                font-size: 0.9rem;
            }

            :host ::ng-deep .step-label {
                font-size: 0.7rem;
            }
        }

        @media (max-width: 576px) {
            :host ::ng-deep .step-item {
                padding: 0.5rem;
                min-width: 100px;
            }

            :host ::ng-deep .step-number {
                width: 20px;
                height: 20px;
                font-size: 0.8rem;
            }

            :host ::ng-deep .step-label {
                font-size: 0.65rem;
            }
        }

        /* Styles pour les filtres */
        :host ::ng-deep .filters-section {
            background: #fff;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }

        :host ::ng-deep .filters-header {
            background: #fff;
        }

        :host ::ng-deep .filters-content {
            transition: all 0.3s ease;
        }

        :host ::ng-deep .filters-content.hidden {
            display: none;
        }

        :host ::ng-deep .filter-column {
            h3 {
                position: relative;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 50%;
                    height: 2px;
                    background: #ffd700;
                }
            }
        }

        :host ::ng-deep .custom-checkbox {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.375rem;
            transition: all 0.2s ease;

            &:hover {
                background: rgba(255, 215, 0, 0.1);
            }

            .p-checkbox {
                margin-right: 0.75rem;

                .p-checkbox-box {
                    width: 30px !important;
                    height: 30px !important;
                    border: 2px solid #e5e7eb !important;
                    border-radius: 4px !important;
                    transition: all 0.2s ease !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
            }

            .p-checkbox .p-checkbox-box.p-highlight {
                background: #ffd700 !important;
                border-color: #ffd700 !important;
            }

            .p-checkbox .p-checkbox-box .p-checkbox-icon {
                color: #000 !important;
                font-weight: bold !important;
                font-size: 1.2rem !important;
            }

            label {
                font-size: 1rem;
                color: #374151;
                margin-left: 0.75rem;
                user-select: none;
            }
        }

        /* Ajustements responsifs pour les checkboxes */
        @media (max-width: 768px) {
            :host ::ng-deep .custom-checkbox {
                .p-checkbox {
                    .p-checkbox-box {
                        width: 28px;
                        height: 28px;

                        .p-checkbox-icon {
                            font-size: 1.1rem;
                        }
                    }
                }
            }
        }

        @media (max-width: 576px) {
            :host ::ng-deep .custom-checkbox {
                .p-checkbox {
                    .p-checkbox-box {
                        width: 26px;
                        height: 26px;

                        .p-checkbox-icon {
                            font-size: 1rem;
                        }
                    }
                }
            }
        }

        :host ::ng-deep .custom-checkbox .p-checkbox .p-checkbox-box {
            width: 20px !important;
            height: 20px !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        :host ::ng-deep .custom-checkbox .p-checkbox .p-checkbox-box.p-highlight {
            background: #ffd700 !important;
            border-color: #ffd700 !important;
        }

        :host ::ng-deep .custom-checkbox .p-checkbox .p-checkbox-box .p-checkbox-icon {
            color: #000 !important;
            font-weight: bold !important;
            font-size: 1.2rem !important;
        }

        /* Styles for Modern DataView */
        :host ::ng-deep .modern-dataview .p-dataview-content {
            background-color: #fff; /* Light background for the content area */
            padding: 0; /* Remove default padding if any */
        }

        /* List Item Styles */
        :host ::ng-deep .vehicle-list-item {
            /* Using Tailwind classes for border/shadow now */
        }
        :host ::ng-deep .vehicle-list-item:hover img {
             transform: scale(1.03); /* Slightly subtler image scale */
        }
        :host ::ng-deep .vehicle-list-item .specs-divider {
            border-color: #f3f4f6; /* Lighter divider */
        }

        /* Grid Item Styles */
        :host ::ng-deep .vehicle-grid-item {
             /* Using Tailwind classes for border/shadow now */
        }

        :host ::ng-deep .vehicle-grid-item:hover {
            /* transform: translateY(-3px); Subtle lift effect */
            /* Shadow handled by Tailwind hover:shadow-lg */
        }

         :host ::ng-deep .vehicle-grid-item img {
             /* Image hover handled by group-hover:scale-105 in HTML */
         }


        /* Common Styles for Buttons in DataView */
        :host ::ng-deep .modern-dataview .p-button.p-button-warning {
            background-color: #ffd700 !important;
            border-color: #ffd700 !important;
            color: #1f2937 !important; /* Dark gray text */
            font-weight: 600;
            transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Subtle shadow */
        }

        :host ::ng-deep .modern-dataview .p-button.p-button-warning.p-button-raised:enabled:hover {
            background-color: #e6c200 !important;
            border-color: #e6c200 !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Enhanced shadow on hover */
        }

         :host ::ng-deep .modern-dataview .p-button.p-button-warning:disabled {
            background-color: #e5e7eb !important;
            border-color: #e5e7eb !important;
            color: #9ca3af !important;
            box-shadow: none !important;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            :host ::ng-deep .vehicle-list-item {
                padding: 1rem; /* Adjust padding for smaller screens */
            }
             :host ::ng-deep .vehicle-list-item .text-xl,
             :host ::ng-deep .vehicle-list-item .text-2xl {
                 font-size: 1.125rem; /* Adjust heading size */
             }
             :host ::ng-deep .vehicle-grid-item .text-base {
                font-size: 0.95rem; /* Adjust grid heading size */
            }
             :host ::ng-deep .vehicle-grid-item .text-lg {
                 font-size: 1.05rem; /* Adjust grid price size */
            }
            :host ::ng-deep .modern-dataview .p-button {
                 font-size: 0.875rem; /* Slightly smaller button text */
             }
        }
    `]

})
export class ParcautoWidget implements OnInit {
    @ViewChild('stepper') stepper!: Stepper;
    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];
    modeles = signal<Modele[]>([]);
    reservationForm: FormGroup;
    heures: any[] = [];
    minDate: Date = new Date();
    minDateRetour: Date = new Date();
    value1: agence | undefined;
    value2: agence | undefined;
    selectedDateRange: Date[] = [];
    selectedCategories: { id: number, nom: string }[] = [];
    categories: { id: number, nom: string }[] = [];
    selectedTypeTransmission: string = '';
    selectedTypeCarburant: string = '';
    selectedTypeTransmissions: string[] = [];
    selectedTypeCarburants: string[] = [];
    vehiculeSelectionne: Modele | null = null;
    nbreJours: number = 2;
    stepValue = 1;
    reservation: Reservation | null = null;
    isFiltersVisible: boolean = false;
    typeCarburants: string[] = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
    typeTransmissions: string[] = ['Automatique', 'Manuelle'];

    constructor(private fb: FormBuilder,
        private modeleService: ModeleService,
        private categorieService: CategorieService,
        private tarifService: TarifLocationService,
        private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        this.reservation = navigation?.extras.state as Reservation | null;
        this.reservation=JSON.parse(localStorage.getItem('reservation')!);

        this.reservationForm = this.fb.group({
            agenceDepart: ['', Validators.required],
            agenceRetour: ['', Validators.required],
            dateDepart: ['', Validators.required],
            dateRetour: ['', Validators.required],
            heureDepart: ['', Validators.required],
            heureRetour: ['', Validators.required],
            age: ['', [Validators.required, Validators.min(18)]],
        });    
        
        this.reservationForm.get('dateDepart')?.valueChanges.subscribe(date => {
            if (date) {
                const newMinDateRetour = new Date(date);
                newMinDateRetour.setDate(newMinDateRetour.getDate() + 1);
                this.minDateRetour = newMinDateRetour;

                // Si la date de retour est inférieure à la nouvelle date minimale
                const dateRetour = this.reservationForm.get('dateRetour')?.value;
                if (dateRetour && new Date(dateRetour) < newMinDateRetour) {
                    this.reservationForm.patchValue({
                        dateRetour: newMinDateRetour
                });
            }
        }
        });
    
        this.loadCategories();
    }

    ngOnInit() {
        this.updateProgressBar();
    }

    private updateProgressBar() {
        const root = document.documentElement;
        root.style.setProperty('--step-value', this.stepValue.toString());
    }

    loadCategories(): void {
        this.categorieService.getActivesCategories().subscribe({
            next: (data: any) => {
                this.categories = data.map((categorie: any) => ({
                    id: categorie.id,
                    nom: categorie.nom
                }));              
            }
        });
    }
 

    filterByCategoriesAndTypeCarburantAndTypeTransmission() {
        if (this.selectedCategories.length === 0 && this.selectedTypeCarburant === '' && this.selectedTypeTransmission === '') {
        this.loadModeles();
            return;
        }
        this.modeleService.getActivesModeles().subscribe({
            next: (data: any) => {
                const filteredModeles = data.filter((modele: any) => {
                    const matchCategorie = this.selectedCategories.length === 0 || 
                        this.selectedCategories.some(cat => cat.id === modele.categorie?.id);
                    const matchCarburant = this.selectedTypeCarburant === '' || 
                        modele.typeCarburant === this.selectedTypeCarburant;
                    const matchTransmission = this.selectedTypeTransmission === '' || 
                        modele.typeTransmission === this.selectedTypeTransmission;
                    modele.prix = this.getPrix(modele);
                    modele.prixJours = modele.prix/this.nbreJours;
                    return matchCategorie && matchCarburant && matchTransmission;
                });  
                this.modeles.set(filteredModeles);
            }
        });
    }

    filterByCategoriesAndTypeCarburantsAndTypeTransmissions() {
        if (this.selectedCategories.length === 0 && this.selectedTypeCarburants.length === 0 && this.selectedTypeTransmissions.length === 0) {
        this.loadModeles();
            return;
        }
        this.modeleService.getActivesModeles().subscribe({
            next: (data: any) => {
                const filteredModeles = data.filter((modele: any) => {
                    // Filtre par catégorie
                    const matchCategorie = this.selectedCategories.length === 0 || 
                        this.selectedCategories.some(cat => cat.id === modele.categorie?.id);
                    
                    // Filtre par type de carburant
                    const matchCarburant = this.selectedTypeCarburants.length === 0 || 
                        this.selectedTypeCarburants.includes(modele.typeCarburant);
                    
                    // Filtre par type de transmission
                    const matchTransmission = this.selectedTypeTransmissions.length === 0 || 
                        this.selectedTypeTransmissions.includes(modele.typeTransmission);
                    
                    // Calcul du prix pour chaque modèle filtré
                    modele.prix = this.getPrix(modele);
                    modele.prixJours = modele.prix/this.nbreJours;
                    
                    // Retourne true si le modèle correspond à tous les critères de filtrage
                    return matchCategorie && matchCarburant && matchTransmission;
                });
                
                this.modeles.set(filteredModeles);
            }
        });
    }

    loadModeles(): void {
        this.modeleService.getActivesModeles().subscribe({
            next: (data: any) => {
                console.log('Modèles chargés:', data); // Pour le debug
                this.modeles.set(data);
                this.modeles().forEach(modele => {
                    modele.prix = this.getPrix(modele);
                    modele.prixJours = modele.prix/this.nbreJours;
                });
            },
            error: (error: any) => {
                console.error('Erreur lors du chargement des modèles:', error);
            }
        });
    }
   

 
    getPrix(modele: Modele): number {
        if (!modele.id) {
            return modele.prix || 0;
        }

        const dateDebut = this.reservationForm.get('dateDepart')?.value;
        const dateFin = this.reservationForm.get('dateRetour')?.value;

        if (!dateDebut || !dateFin) {
            return modele.prix || 0;
        }

        // Vérifier que les dates sont valides
        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
            return modele.prix || 0;
        }

        this.tarifService.calculatePrixLocation(modele.id, debut, fin).subscribe({
            next: (prix: number) => {
                modele.prix = prix;
                modele.prixJours = prix/this.nbreJours;
            },
            error: (error) => {
                console.error('Erreur lors du calcul du prix:', error);
                modele.prix = modele.prix || 0;
            }
        });

        return modele.prix || 0;
    }
 
   

    getImageUrl(modele: Modele): string {
      
        if (modele.logo?.path) {
          return `${environment.apiUrl}${modele.logo.path}`;
        }
        return 'assets/images/logo.png';
    }
  
    onSubmit() {
        if (this.reservationForm.valid) {
            console.log('Formulaire soumis:', this.reservationForm.value);
          
            // Ajoutez ici la logique pour traiter la soumission du formulaire
        }
    }

    OnChercheVehicule(event: Reservation) {
        this.goStep2();
        this.loadModeles();
            this.reservationForm.patchValue({
            dateDepart: event.dateDepart,
            dateRetour: event.dateRetour,
            heureDepart: event.heureDepart,
            heureRetour: event.heureRetour,
            agenceDepart: event.agenceDepart,
            agenceRetour: event.agenceRetour,
            age: event.age,
            codePromo: event.codePromo,
            nbreJours: this.nbreJours,
        });
        
        // Mettre à jour le nombre de jours et recalculer les prix
        this.nbreJours = this.getNbreJours(event.dateDepart, event.dateRetour);
        
    }

    getNbreJours(dateDepart: Date, dateRetour: Date): number {
        const diffTime = Math.abs(dateRetour.getTime() - dateDepart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    onModifierVehicule() {
        // Revenir à l'affichage de la liste des véhicules
        this.goStep2();
    }
    onModifierReservation() {
        this.goStep1();
    }
    formatDate(date: Date | null): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    goStep1() {
        if (this.stepValue > 1) {
            setTimeout(() => {
                if (this.stepper) {
                    this.stepValue = 1;
                    this.updateProgressBar();
                }
            }, 0);
        }
    }

    goStep2() {
        setTimeout(() => {
            if (this.stepper) {
                this.stepValue = 2;
                this.updateProgressBar();
            }
        }, 0);
    }

    goStep3() {
        setTimeout(() => {
            if (this.stepper) {
                this.stepValue = 3;
                this.updateProgressBar();
            }
        }, 0);
    }

    goStep4() {
        setTimeout(() => {
            if (this.stepper) {
                this.stepValue = 4;
                this.updateProgressBar();
            }
        }, 0);
    }

    goStep5() {
        setTimeout(() => {
            if (this.stepper) {
                this.stepValue = 5;
                this.updateProgressBar();
            }
        }, 0);
    }   
    onReserverVehicule(modele: Modele) {
        this.vehiculeSelectionne = modele;
        this.goStep3();
      
        // Vous pouvez ajouter ici la logique pour passer à l'étape suivante
        // Par exemple, activer le stepper pour passer à l'étape des options
    }

    resetFilters() {
        this.selectedCategories = [];
        this.selectedTypeTransmissions = [];
        this.selectedTypeCarburants = [];
        this.selectedTypeTransmission = '';
        this.selectedTypeCarburant = '';
        this.loadModeles();
    }

    onCoordonneesSubmit(event: any) {
        // Implement the logic to handle the submission of the coordonnees-reservation component
    }

    toggleFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }
}

  

   
 
    


    


