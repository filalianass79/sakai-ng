import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { TopbarWidget } from '../topbarwidget.component';
import { FooterWidget } from '../footerwidget';
import { RouterModule } from '@angular/router';

interface Vehicle {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  transmission: string;
  fuel: string;
  ac: boolean;
  cityLocation: string; // Ville où se trouve le véhicule
  price: {
    day: number;
    week: number;
    month: number;
  };
  category: 'economy' | 'compact' | 'premium' | 'suv' | 'luxury';
  available: boolean;
  deposit: number;
  mileage: 'unlimited' | number;
  images: string[];
  features: string[];
  description: string;
}

interface FilterCategory {
  name: string;
  code: 'all' | 'economy' | 'compact' | 'premium' | 'suv' | 'luxury';
}

interface City {
  name: string;
  code: string;
}

interface SelectButtonOption {
  label: string;
  value: 'list' | 'grid';
  icon: string;
}

@Component({
  selector: 'app-nos-vehicules',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    CardModule,
    DividerModule,
    InputTextModule,
    SelectButtonModule,
    InputSwitchModule,
    SliderModule,
    TooltipModule,
    DialogModule,
    CheckboxModule,
    BadgeModule,
    TopbarWidget,
    FooterWidget,
    RouterModule
  ],
  templateUrl: './nos-vehicules.component.html',
  styleUrls: ['./nos-vehicules.component.scss']
})
export class NosVehiculesComponent implements OnInit {
  // Données des véhicules
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  
  // État des filtres
  showFilters: boolean = false;
  
  // Options d'affichage
  viewOptions: SelectButtonOption[] = [
    { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' },
    { label: 'Liste', value: 'list', icon: 'pi pi-list' }
  ];
  
  // Filtres par catégorie
  categoryFilters: FilterCategory[] = [
    { name: 'Économique', code: 'economy' },
    { name: 'Compact', code: 'compact' },
    { name: 'Premium', code: 'premium' },
    { name: 'SUV', code: 'suv' },
    { name: 'Luxe', code: 'luxury' }
  ];
  selectedCategoryFilters: FilterCategory[] = [];
  
  // Pour la compatibilité avec le template existant
  categories: FilterCategory[] = [
    { name: 'Tous', code: 'all' },
    { name: 'Économique', code: 'economy' },
    { name: 'Compact', code: 'compact' },
    { name: 'Premium', code: 'premium' },
    { name: 'SUV', code: 'suv' },
    { name: 'Luxe', code: 'luxury' }
  ];
  selectedCategory: FilterCategory = this.categories[0];
  
  // Filtres par ville
  cityFilters: City[] = [
    { name: 'Casablanca', code: 'casablanca' },
    { name: 'Marrakech', code: 'marrakech' },
    { name: 'Rabat', code: 'rabat' },
    { name: 'Tanger', code: 'tanger' },
    { name: 'Fès', code: 'fes' }
  ];
  selectedCityFilters: City[] = [];
  
  // Pour la compatibilité avec le template existant
  cities: City[] = [
    { name: 'Toutes les villes', code: 'all' },
    { name: 'Casablanca', code: 'casablanca' },
    { name: 'Marrakech', code: 'marrakech' },
    { name: 'Rabat', code: 'rabat' },
    { name: 'Tanger', code: 'tanger' },
    { name: 'Fès', code: 'fes' }
  ];
  selectedCity: City = this.cities[0];
  
  // Filtre de prix
  priceRange: number[] = [0, 2000];
  maxPrice: number = 2000;
  
  // Filtres des caractéristiques
  automaticOnly: boolean = false;
  acOnly: boolean = false;
  
  // Recherche textuelle
  searchQuery: string = '';
  
  // Détails du véhicule
  selectedVehicle: Vehicle | null = null;
  showVehicleDetails: boolean = false;
  
  // Mode d'affichage
  displayMode: 'grid' | 'list' = 'grid';

  constructor() { }

  ngOnInit(): void {
    this.loadVehicles();
    this.applyFilters();
  }

  /**
   * Gère les erreurs de chargement d'image
   */
  onImageError(event: Event): void {
    if (event.target instanceof HTMLImageElement) {
      event.target.src = 'assets/images/image2.png';
    }
  }

  /**
   * Bascule l'affichage des filtres avancés
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Retourne le nombre de filtres actifs
   */
  get activeFiltersCount(): number {
    return this.selectedCategoryFilters.length + 
           this.selectedCityFilters.length + 
           (this.automaticOnly ? 1 : 0) + 
           (this.acOnly ? 1 : 0) + 
           (this.priceRange[0] > 0 || this.priceRange[1] < this.maxPrice ? 1 : 0);
  }

  loadVehicles(): void {
    // Simuler le chargement des données depuis une API
    this.vehicles = [
      {
        id: 1,
        name: 'Dacia Logan',
        brand: 'Dacia',
        model: 'Logan',
        year: 2022,
        seats: 5,
        transmission: 'Manuel',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Casablanca',
        price: {
          day: 300,
          week: 1800,
          month: 6000
        },
        category: 'economy',
        available: true,
        deposit: 3000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/dacia_logan_1.jpg', 'assets/images/vehicles/dacia_logan_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Airbags'],
        description: 'La Dacia Logan est une voiture compacte économique, parfaite pour les déplacements urbains et les petits budgets. Sa fiabilité et son faible coût en font une option très populaire pour la location.'
      },
      {
        id: 2,
        name: 'Renault Clio',
        brand: 'Renault',
        model: 'Clio',
        year: 2023,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Essence',
        ac: true,
        cityLocation: 'Casablanca',
        price: {
          day: 350,
          week: 2100,
          month: 7000
        },
        category: 'economy',
        available: true,
        deposit: 3500,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/renault_clio_1.jpg', 'assets/images/vehicles/renault_clio_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags'],
        description: 'La Renault Clio est l\'une des citadines les plus populaires en Europe. Avec son design élégant et ses équipements modernes, elle offre un confort optimal pour les déplacements urbains.'
      },
      {
        id: 3,
        name: 'Volkswagen Golf',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2022,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Marrakech',
        price: {
          day: 450,
          week: 2700,
          month: 9000
        },
        category: 'compact',
        available: true,
        deposit: 4500,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/volkswagen_golf_1.jpg', 'assets/images/vehicles/volkswagen_golf_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra de recul'],
        description: 'La Volkswagen Golf est un modèle compact polyvalent qui allie performance, confort et élégance. Elle est idéale pour les voyages d\'affaires ou les escapades en famille.'
      },
      {
        id: 4,
        name: 'Mercedes Classe C',
        brand: 'Mercedes',
        model: 'Classe C',
        year: 2023,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Rabat',
        price: {
          day: 900,
          week: 5400,
          month: 18000
        },
        category: 'premium',
        available: true,
        deposit: 10000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/mercedes_c_1.jpg', 'assets/images/vehicles/mercedes_c_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra 360°', 'Sièges en cuir', 'Toit ouvrant'],
        description: 'La Mercedes Classe C est la définition même du luxe et du confort. Avec son intérieur raffiné et ses technologies avancées, elle offre une expérience de conduite exceptionnelle.'
      },
      {
        id: 5,
        name: 'Dacia Duster',
        brand: 'Dacia',
        model: 'Duster',
        year: 2022,
        seats: 5,
        transmission: 'Manuel',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Tanger',
        price: {
          day: 400,
          week: 2400,
          month: 8000
        },
        category: 'suv',
        available: true,
        deposit: 5000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/dacia_duster_1.jpg', 'assets/images/vehicles/dacia_duster_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', '4x4 disponible'],
        description: 'Le Dacia Duster est un SUV compact abordable qui ne lésine pas sur les capacités tout-terrain. C\'est le véhicule idéal pour explorer les régions montagneuses et les pistes du Maroc.'
      },
      {
        id: 6,
        name: 'BMW Série 5',
        brand: 'BMW',
        model: 'Série 5',
        year: 2023,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Casablanca',
        price: {
          day: 1200,
          week: 7200,
          month: 24000
        },
        category: 'luxury',
        available: true,
        deposit: 15000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/bmw_5_1.jpg', 'assets/images/vehicles/bmw_5_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra 360°', 'Sièges en cuir', 'Toit ouvrant', 'Son premium', 'Sièges chauffants'],
        description: 'La BMW Série 5 est une berline de luxe qui allie élégance et performances. Son comportement routier exceptionnel et son intérieur raffiné en font le choix parfait pour les clients exigeants.'
      },
      {
        id: 7,
        name: 'Range Rover Evoque',
        brand: 'Land Rover',
        model: 'Range Rover Evoque',
        year: 2022,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Marrakech',
        price: {
          day: 1100,
          week: 6600,
          month: 22000
        },
        category: 'luxury',
        available: false,
        deposit: 15000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/range_rover_evoque_1.jpg', 'assets/images/vehicles/range_rover_evoque_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra 360°', 'Sièges en cuir', 'Toit panoramique', 'Son premium', 'Sièges chauffants', '4x4'],
        description: 'Le Range Rover Evoque est un SUV de luxe qui se distingue par son design élégant et ses capacités tout-terrain. Il offre une expérience de conduite premium sur tous les types de terrain.'
      },
      {
        id: 8,
        name: 'Toyota Corolla',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Hybride',
        ac: true,
        cityLocation: 'Rabat',
        price: {
          day: 500,
          week: 3000,
          month: 10000
        },
        category: 'compact',
        available: true,
        deposit: 5000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/toyota_corolla_1.jpg', 'assets/images/vehicles/toyota_corolla_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra de recul', 'Régulateur de vitesse'],
        description: 'La Toyota Corolla hybride combine économie de carburant et respect de l\'environnement. Sa fiabilité légendaire et son confort en font un choix idéal pour tous vos déplacements au Maroc.'
      },
      {
        id: 9,
        name: 'Audi Q5',
        brand: 'Audi',
        model: 'Q5',
        year: 2023,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Fès',
        price: {
          day: 950,
          week: 5700,
          month: 19000
        },
        category: 'suv',
        available: true,
        deposit: 12000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/audi_q5_1.jpg', 'assets/images/vehicles/audi_q5_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra 360°', 'Sièges en cuir', 'Toit panoramique', 'Son premium', 'Quattro 4x4'],
        description: 'L\'Audi Q5 est un SUV premium qui offre une expérience de conduite raffinée et confortable. Son intérieur spacieux et ses technologies avancées assurent un voyage agréable pour tous les passagers.'
      },
      {
        id: 10,
        name: 'Hyundai Tucson',
        brand: 'Hyundai',
        model: 'Tucson',
        year: 2022,
        seats: 5,
        transmission: 'Automatique',
        fuel: 'Diesel',
        ac: true,
        cityLocation: 'Tanger',
        price: {
          day: 600,
          week: 3600,
          month: 12000
        },
        category: 'suv',
        available: true,
        deposit: 6000,
        mileage: 'unlimited',
        images: ['assets/images/vehicles/hyundai_tucson_1.jpg', 'assets/images/vehicles/hyundai_tucson_2.jpg'],
        features: ['GPS', 'Radio', 'Bluetooth', 'USB', 'Climatisation', 'Airbags', 'Caméra de recul', 'Régulateur de vitesse'],
        description: 'Le Hyundai Tucson est un SUV moderne et élégant qui allie confort, espace et technologie. Son design distinctif et ses équipements complets en font un choix judicieux pour vos aventures au Maroc.'
      }
    ];
  }

  applyFilters(): void {
    let filtered = [...this.vehicles];
    
    // Filtrer par catégorie
    if (this.selectedCategoryFilters.length > 0) {
      const categoryCodes = this.selectedCategoryFilters.map(cat => cat.code);
      filtered = filtered.filter(vehicle => categoryCodes.includes(vehicle.category));
    }
    
    // Filtrer par ville
    if (this.selectedCityFilters.length > 0) {
      const cityCodes = this.selectedCityFilters.map(city => city.code);
      filtered = filtered.filter(vehicle => {
        const vehicleCity = vehicle.cityLocation.toLowerCase();
        return cityCodes.some(code => vehicleCity === code);
      });
    }
    
    // Filtrer par prix
    filtered = filtered.filter(vehicle => 
      vehicle.price.day >= this.priceRange[0] && 
      vehicle.price.day <= this.priceRange[1]
    );
    
    // Filtrer par transmission
    if (this.automaticOnly) {
      filtered = filtered.filter(vehicle => vehicle.transmission.toLowerCase() === 'automatique');
    }
    
    // Filtrer par climatisation
    if (this.acOnly) {
      filtered = filtered.filter(vehicle => vehicle.ac);
    }
    
    // Filtrer par recherche textuelle
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.name.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query)
      );
    }
    
    this.filteredVehicles = filtered;
  }

  resetFilters(): void {
    this.selectedCategoryFilters = [];
    this.selectedCityFilters = [];
    this.priceRange = [0, this.maxPrice];
    this.automaticOnly = false;
    this.acOnly = false;
    this.searchQuery = '';
    this.applyFilters();
  }

  showDetails(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.showVehicleDetails = true;
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 });
  }

  reserveVehicle(vehicle: Vehicle): void {
    // Rediriger vers la page de réservation avec l'ID du véhicule
    // this.router.navigate(['/reservation'], { queryParams: { vehicleId: vehicle.id } });
    console.log('Réservation du véhicule:', vehicle.id);
  }
} 