import { Component, signal, ViewChild, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { Stepper } from 'primeng/stepper';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product.service';
import { agence, Reservation } from '../../../reservation/models/reservation.model';
import { InfosReservationComponent } from '../infos-reservation/infos-reservation.component';
import { CoordonneesReservationComponent } from '../coordonnees-reservation/coordonnees-reservation.component';
import { ModeleService } from '../../../modele/services/modele.service';
import { OptionsLocationComponent } from '../options-location/options-location.component';
import { Modele } from '../../../modele/models/modele.model';
import { CategorieService } from '../../../categorie/services/categorie.service';
import { TarifLocationService } from '../../../parametragesiteweb/services/tarif-location.service';
import { environment } from '../../../../../environments/environment';
import { ChoixVehiculeComponent } from '../choix-vehicule/choix-vehicule.component';
import { PaiementCarteComponent } from '../paiement-carte/paiement-carte.component';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'parcauto-widget',
    templateUrl: './parcauto.component.html',
    styleUrls: ['./parcauto.component.scss'],
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
        InfosReservationComponent,
        CoordonneesReservationComponent,
        OptionsLocationComponent,
        ChoixVehiculeComponent,
        PaiementCarteComponent,
        TooltipModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ModeleService, ProductService, MessageService]
})
export class ParcautoWidget implements OnInit {
    @ViewChild('stepper') stepper!: Stepper;
    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];
    modeles = signal<Modele[]>([]);
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
    typeTransmissions: string[] = ['AUTOMATIQUE', 'MANUELLE'];
    expandedStep: number | null = null;

    constructor(
        private fb: FormBuilder,
        private modeleService: ModeleService,
        private categorieService: CategorieService,
        private tarifService: TarifLocationService,
        private router: Router,
        private messageService: MessageService
    ) {
        const navigation = this.router.getCurrentNavigation();
        this.reservation = navigation?.extras.state as Reservation | null;
        this.reservation = JSON.parse(localStorage.getItem('reservation')!);
       // this.loadCategories();
    }



    ngOnInit() {
       this.updateProgressBar();
    }

    private updateProgressBar() {
        const root = document.documentElement;
        const progressPercentage = (this.stepValue / 5) * 100;
        root.style.setProperty('--step-value', this.stepValue.toString());
        
        // Set the progress bar width based on current step
        setTimeout(() => {
            const progressBar = document.querySelector('.progress-bar') as HTMLElement;
            if (progressBar) {
                progressBar.style.width = `${progressPercentage}%`;
            }
        }, 0);
    }

    getCurrentStepName(): string {
        switch(this.stepValue) {
            case 1: return 'AGENCES ET DATES';
            case 2: return 'VEHICULE';
            case 3: return 'OPTIONS';
            case 4: return 'COORDONNÉES';
            case 5: return 'PAIEMENT';
            default: return 'RÉCAPITULATIF';
        }
    }

    isCurrentStep(stepNumber: number): boolean {
        return this.stepValue === stepNumber;
    }

  /*  loadCategories(): void {
        this.categorieService.getActivesCategories().subscribe({
            next: (data: any) => {
                this.categories = data.map((categorie: any) => ({
                    id: categorie.id,
                    nom: categorie.nom
                }));
            }
        });
        }



    loadModeles(): void {
        this.modeleService.getActivesModeles().subscribe({
            next: (data: any) => {
                this.modeles.set(data);
                this.modeles().forEach(modele => {
                    modele.prix = this.getPrix(modele);
                    modele.prixJours = modele.prix / this.nbreJours;
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
        const dateDebut = this.reservation?.dateDepart;
        const dateFin = this.reservation?.dateRetour;
        if (!dateDebut || !dateFin) {
            return modele.prix || 0;
        }

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);

        if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
            return modele.prix || 0;
        }

        this.tarifService.calculatePrixLocation(modele.id, debut, fin).subscribe({
            next: (prix: number) => {
                modele.prix = prix;
                modele.prixJours = prix / this.nbreJours;
            },
            error: (error) => {
                console.error('Erreur lors du calcul du prix:', error);
                modele.prix = modele.prix || 0;
            }
        });

        return modele.prix || 0;
    }
*/
    getImageUrl(modele: Modele | undefined | null): string {
        if (modele?.logo?.path) {
            return `${environment.apiUrl}${modele.logo.path}`;
        }
        return 'assets/images/logo.png';
    }

  

    OnChercheVehicule(event: Reservation) {
        this.goStep2();
       // this.loadModeles();
        this.nbreJours = this.getNbreJours(event.dateDepart!, event.dateRetour!);
    }
    onReserverVehicule(reservation: Reservation) {
        if (reservation && reservation.modele) {
            this.vehiculeSelectionne = reservation.modele;
            this.reservation = reservation;
            this.goStep3();
        }
    }

    onSelectOptions(reservation: Reservation) {
        this.reservation = reservation;
        this.goStep4();
    }

    onValideCoordonnees(reservation: Reservation) {
        this.reservation = reservation;
        this.goStep5();
    }

    getNbreJours(dateDepart: Date, dateRetour: Date): number {
        const diffTime = Math.abs(dateRetour.getTime() - dateDepart.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    getNumeroReservation(): string {
        return this.reservation?.numeroReservation!;
    }

    onModifierVehicule() {
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
        this.stepValue = 1;
        this.updateProgressBar();
        //this.stepper.activeStep = 0;
    }

    goStep2() {
        if (this.reservation) {
            this.stepValue = 2;
            this.updateProgressBar();
            //this.stepper.activeStep = 1;
        }
    }

    goStep3() {
        if (this.reservation?.modele) {
            this.stepValue = 3;
            this.updateProgressBar();
           // this.stepper.activeStep = 2;
        }
    }

    goStep4() {
        if (this.reservation?.options) {
            this.stepValue = 4;
            this.updateProgressBar();
           // this.stepper.activeStep = 3;
        }
    }

    goStep5() {
        if (this.reservation?.nom) {
            this.stepValue = 5;
            this.updateProgressBar();
           // this.stepper.activeStep = 4;
            
            // Update local storage with the latest reservation data
            localStorage.setItem('reservation', JSON.stringify(this.reservation));
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Information manquante',
                detail: 'Veuillez compléter vos coordonnées avant de continuer.',
                life: 3000
            });
        }
    }

   

   

    onCoordonneesSubmit(event: any) {
        // Implement the logic to handle the submission of the coordonnees-reservation component
    }

    toggleFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }

    getTotalOptions(): number {
        if (!this.reservation || !this.reservation.options) {
            return 0;
        }
        return this.reservation.options.reduce((total, option) => 
            total + (option.price || 0), 0);
    }

    getTotalPrixTTC(): number {
        if (!this.reservation) {
            return 0;
        }
        else{   
            return (this.reservation.totalPrixTTC || 0) + (this.getTotalOptions() || 0);
        }
    }

    getGroupedOptions(): { title: string; price: number; count: number }[] {
        if (!this.reservation || !this.reservation.options) {
            return [];
        }

        const groupedOptions = new Map<string, { price: number; count: number }>();
        
        this.reservation.options.forEach(option => {
            const existing = groupedOptions.get(option.title);
            if (existing) {
                existing.count += 1;
                existing.price += option.price || 0;
            } else {
                groupedOptions.set(option.title, {
                    price: option.price || 0,
                    count: 1
                });
            }
        });

        return Array.from(groupedOptions.entries()).map(([title, data]) => ({
            title,
            price: data.price,
            count: data.count
        }));
    }

    onPaiementEffectue(event: any) {
        // Traiter les informations du paiement
        console.log('Paiement effectué:', event);
        
        // Afficher un message de succès
        this.messageService.add({
            severity: 'success',
            summary: 'Paiement accepté',
            detail: 'Votre réservation a été confirmée avec succès'
        });
        
        // Mettre à jour la réservation avec les informations de paiement
        if (this.reservation) {
            this.reservation.paiement = event;
            this.reservation.statut = 'CONFIRMEE';
            
            // Sauvegarder la réservation dans le localStorage
            localStorage.setItem('reservation', JSON.stringify(this.reservation));
        }
        
        // Afficher un message de confirmation et rediriger
        setTimeout(() => {
            this.messageService.add({
                severity: 'info',
                summary: 'Redirection',
                detail: 'Vous allez être redirigé vers la page de confirmation',
                life: 3000
            });
            
            // Rediriger vers la page de confirmation après 3 secondes
            setTimeout(() => {
                // Remplacer par la vraie route de confirmation
                // this.router.navigate(['/confirmation-reservation']);
                alert('Réservation confirmée ! Votre numéro de réservation est : ' + this.getNumeroReservation());
            }, 3000);
        }, 1000);
    }

    /**
     * Calcule le prix total des options choisies
     */
    getTotalOptionsPrice(): number {
        if (!this.reservation || !this.reservation.options) {
            return 0;
        }
        
        // Vérifier si la propriété options existe et n'est pas vide
        const options = this.reservation.options || [];
        if (options.length === 0) {
            return 0;
        }
        
        return options.reduce((total: number, option: any) => {
            const quantite = option.nbre || 1;
            return total + (option.price * quantite);
        }, 0);
    }

    toggleStep(stepIndex: number): void {
        // Si tous les steps sont déjà affichés, on les cache tous
        if (this.expandedStep === -1) {
            this.expandedStep = null;
        } else {
            // Sinon on affiche tous les steps
            this.expandedStep = -1;
        }
    }
} 