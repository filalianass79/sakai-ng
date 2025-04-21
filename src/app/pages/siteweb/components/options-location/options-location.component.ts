import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Reservation } from '../../../reservation/models/reservation.model';

interface Option {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
  details?: string;
  autre?: string;
  canBeLot?: boolean;
  max: number;
  nbre: number;
}

@Component({
  selector: 'app-options-location',
  templateUrl: './options-location.component.html',
  styleUrls: ['./options-location.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class OptionsLocationComponent implements OnInit {
  @Output() selectOptions = new EventEmitter<Reservation>();
  @Input() reservation: Reservation | null = null;


  options: Option[] = [
    {
      id: 1,
      title: 'Conducteur Additionnel',
      price: 100.00,
      image: 'assets/images/driver.webp',
      description: 'Partez l\'esprit tranquille et partagez le volant avec une autre personne assuré pour conduire.',
      details: 'xxxxxxxx',
      autre: 'yyyyyyyy',
      canBeLot: true,
      max: 3,
      nbre: 0
    },
    {
      id: 2,
      title: 'GPS',
      price: 99.00,
      image: 'assets/images/gps.webp',
      description: 'Restez sur la bonne voie et réservez un GPS, très utile sur les routes inconnues.',
      details: 'xxxxxxxx',
      autre: 'yyyyyyyy',
      canBeLot: false,
      max: 1,
      nbre: 0
    },
    {
      id: 3,
      title: 'Wifi',
      price: 99.00,
      image: 'assets/images/wifi.webp',
      description: 'Connexion Internet Wi-Fi dans le véhicule',
      details: 'xxxxxxxx',
      autre: 'yyyyyyyy',
      canBeLot: false,
      max: 1,
      nbre: 0
    },
    {
      id: 4,
      title: 'Siège bébé',
      price: 99.00,
      image: 'assets/images/siege_bebe.webp',
      description: 'Recommandé pour les enfants de 0 à 12 mois ou de 0 à 13 kg.',
      details: 'xxxxxxxx',
        autre: 'yyyyyyyy',
      canBeLot: true,
      max: 3,
      nbre: 0
    },
    {
      id: 5,
      title: 'Siège enfant',  
      price: 99.00,
      image: 'assets/images/siege-enfant.webp',
      description: 'Recommandé pour les enfants de 1 à 3 ans ou de 9 à 18 kg.',
      details: 'xxxxxxxx',
      autre: 'yyyyyyyy',
      canBeLot: true,
      max: 3,
      nbre: 0
    },
    { 
      id: 6,
      title: 'Rehausseur',
      price: 99.00,
      image: 'assets/images/rehausse_enfant.webp',
      description: 'Recommandé pour les enfants de 4 à 7 ans ou de 15 à 30 kg.',
      details: 'xxxxxxxx',
      autre: 'yyyyyyyy',
      canBeLot: true,
      max: 3,
      nbre: 0
    }
  ];

  selectedOptions: number[] = [];
  selectedOptionsList: Option[] = [];

  constructor() { }

  ngOnInit(): void { }

  toggleOption(optionId: number): void {
    const index = this.selectedOptions.indexOf(optionId);
    if (index === -1) {
      this.selectedOptions.push(optionId);
      const option = this.options.find(opt => opt.id === optionId);
      if (option) {
        this.selectedOptionsList.push(option);
      }
    } else {
      this.selectedOptions.splice(index, 1);
      this.selectedOptionsList = this.selectedOptionsList.filter(opt => opt.id !== optionId);
    }
  }

  isSelected(optionId: number): boolean {
    return this.selectedOptions.includes(optionId);
  }

  getTotalPrice(): number {
    return this.selectedOptions.reduce((total, optionId) => {
      const option = this.options.find(opt => opt.id === optionId);  
        return total + (option ? option.price : 0);
    }, 0);
  }

  getNbreOptions(option: Option): number {
    if(option.nbre){
      return option.nbre;
    }
    return 0;  
  }

  incrementNbreOptions(option: Option): void {
    if (option.nbre < option.max) {
      option.nbre++;
      this.selectedOptionsList.push(option);
      this.selectedOptions.push(option.id);
    }
  }

  decrementNbreOptions(option: Option): void {
    if (option.nbre > 0) {
      option.nbre--;
      this.selectedOptionsList = this.selectedOptionsList.filter(opt => opt.id !== option.id);
      this.selectedOptions.splice(this.selectedOptions.indexOf(option.id), 1);
    }
  }

  onSelectOptions() {
    if (this.reservation) {
        this.reservation.options = this.selectedOptionsList;
        this.selectOptions.emit(this.reservation);
    }
}

  afficherOptions(){
    console.log(this.selectedOptionsList);
  }


}