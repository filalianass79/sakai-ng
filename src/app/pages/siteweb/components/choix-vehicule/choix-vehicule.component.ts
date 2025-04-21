import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { Modele } from '../../../modele/models/modele.model';
import { CategorieService } from '../../../categorie/services/categorie.service';
import { ModeleService } from '../../../modele/services/modele.service';
import { TarifLocationService } from '../../../parametragesiteweb/services/tarif-location.service';
import { environment } from '../../../../../environments/environment';
import { Reservation } from '../../../reservation/models/reservation.model';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';


interface SelectButtonOption {
    label: string;
    value: 'list' | 'grid';
    icon: string;
}

@Component({
  selector: 'app-choix-vehicule',
  templateUrl: './choix-vehicule.component.html',
    styleUrls: ['./choix-vehicule.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DataViewModule,
        ButtonModule,
        SelectButtonModule,
        CheckboxModule,
        InputTextModule,
        BadgeModule,
        TooltipModule,
        PanelModule,
        DialogModule
    ]
})
export class ChoixVehiculeComponent implements OnInit {
  @Output() reserverVehicule = new EventEmitter<Reservation>();
  @Input() reservation: Reservation | null = null;
    layout: 'list' | 'grid' = 'grid';
    showFilters = false;
    searchText = '';
    nbreJours: number = 2;
    dateDebut: Date = new Date();
    dateFin: Date = new Date();
    modeles = signal<Modele[]>([]);

    // Layout options for select button
    options: SelectButtonOption[] = [
        { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' },
        { label: 'Liste', value: 'list', icon: 'pi pi-list' }
    ];

    // Filter options
    categories: { id: number, nom: string }[] = [];

    typesCarburants = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
    typeTransmissions = ['MANUELLE', 'AUTOMATIQUE'];

    // Selected filters
   
    selectedCategories: { id: number, nom: string }[] = [];
    selectedTypeTransmission: string = '';
    selectedTypeCarburant: string = '';
    selectedTypeTransmissions: string[] = [];
    selectedTypeCarburants: string[] = [];
    // For backward compatibility with template

    displayDetailPanel: boolean = false;
    selectedVehicle: any = null;
    panelStyle: any = {};

    constructor(
        private modeleService: ModeleService,
        private categorieService: CategorieService,
        private tarifService: TarifLocationService
    ) {
      this.loadCategories();
      this.loadModeles();
    }

    ngOnInit() {
      
     
   
       
    }

    loadModeles(): void {
      this.modeleService.getActivesModeles().subscribe({
          next: (data: any) => {
              console.log('Modèles chargés:', data); // Pour le debug
              this.modeles.set(data);
              this.modeles().forEach(modele => {
                  modele.prix = this.getPrix(modele);
                  modele.prixJours = modele.prix/this.nbreJours;
                  modele.detail=false;
              });
          },
          error: (error: any) => {
              console.error('Erreur lors du chargement des modèles:', error);
          }
      });
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

  getPrix(modele: Modele): number {
    if (!modele.id) {
        return modele.prix || 0;
    } 
    if (!this.dateDebut || !this.dateFin) {
        return modele.prix || 0;
    }
    // Vérifier que les dates sont valides
    const debut = new Date(this.dateDebut);
    const fin = new Date(this.dateFin);
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
            // Vérifier si le chemin est déjà une URL complète
            if (modele.logo.path.startsWith('http')) {
                return modele.logo.path;
            }
            // Sinon, construire l'URL complète
            return `${environment.apiUrl}${modele.logo.path}`;
        }
        // Image par défaut si aucune image n'est disponible
        return 'assets/images/logo.png';
    } 


    getNbreJours(dateDepart: Date, dateRetour: Date): number {
      const diffTime = Math.abs(dateRetour.getTime() - dateDepart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
  }

    toggleFilters() {
     // Initialize selected filters arrays
        this.showFilters = !this.showFilters;
    }



   
    filterByCategoriesAndTypeCarburantsAndTypeTransmissions() {
        // Si aucun filtre n'est sélectionné, charger tous les modèles
        if (this.selectedCategories.length === 0 && 
            this.selectedTypeCarburants.length === 0 && 
            this.selectedTypeTransmissions.length === 0) {
            this.loadModeles();
            return;
        }

        // Récupérer les modèles actifs
        this.modeleService.getActivesModeles().subscribe({
            next: (data: Modele[]) => {
                // Filtrer les modèles selon les critères sélectionnés
                const filteredModeles = data.filter((modele: Modele) => {
                    // Filtre par catégorie
                    const matchCategorie = this.selectedCategories.length === 0 || 
                      this.selectedCategories.some(cat => cat.id === modele.categorie?.id);
                    
                    // Filtre par type de carburant
                    const matchCarburant = this.selectedTypeCarburants.length === 0 || 
                        this.selectedTypeCarburants.includes(modele.typeCarburant);
                    
                    // Filtre par type de transmission
                    const matchTransmission = this.selectedTypeTransmissions.length === 0 || 
                        this.selectedTypeTransmissions.includes(modele.typeTransmission);
                       
    
                    // Appliquer tous les filtres
                    return matchCategorie && matchCarburant && matchTransmission;
                });

                // Mettre à jour les prix pour les modèles filtrés
                filteredModeles.forEach((modele: Modele) => {
                    modele.prix = this.getPrix(modele);
                    modele.prixJours = modele.prix / this.nbreJours;
                });

                // Mettre à jour le signal des modèles
                this.modeles.set(filteredModeles);

                // Log pour le debug

                console.log('Modèles filtrés:', filteredModeles);
                console.log('Filtres appliqués:', {
                    categories: this.selectedCategories,
                    carburants: this.selectedTypeCarburants,
                    transmissions: this.selectedTypeTransmissions
                });
            },
            error: (error) => {
                console.error('Erreur lors du filtrage des modèles:', error);
                // En cas d'erreur, recharger tous les modèles
                this.loadModeles();
            }
        });
    }

    resetFilters() {
        this.selectedCategories = [];
        this.selectedTypeCarburants = [];
        this.selectedTypeTransmissions = [];
        this.searchText = '';
        this.loadModeles();
       // this.filteredVehicles = [...this.vehicles];
    }

    onReserverVehicule(modele: Modele) {
      if (this.reservation) {
          this.reservation.modele = modele;
          this.reservation.prixMoyenParJourTTC = modele.prixJours;
          this.reservation.totalPrixTTC = modele.prix;
          this.reservation.nbreJours = this.nbreJours;
          this.reserverVehicule.emit(this.reservation);
      }
  }
 
  



   

    get activeFiltersCount(): number {
        return (
            this.selectedCategories.length +
            this.selectedTypeCarburants.length +
            this.selectedTypeTransmissions.length
        );
    }

    getSelectedCategoriesText(): string {
        if (!this.selectedCategories || this.selectedCategories.length === 0) {
            return 'Aucune';
        }
        return this.selectedCategories.map(c => c.nom).join(', ');
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'assets/images/logo.png';
    }

  

    closeDetail(modele: Modele){
        modele.detail=false;     
    }
    showDetail(modele: Modele){
        modele.detail=true;     
    }
}
