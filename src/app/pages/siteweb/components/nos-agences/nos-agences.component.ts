import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { TopbarWidget } from '../topbarwidget.component';
import { FooterWidget } from '../footerwidget';
import { RouterModule } from '@angular/router';

interface Agency {
  id: number;
  name: string;
  city: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  description: string;
  hours: string[];
  mapUrl: string;
  imageUrl: string;
  manager: {
    name: string;
    phone: string;
    email: string;
    photoUrl: string;
  };
}

@Component({
  selector: 'app-nos-agences',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    CardModule,
    DividerModule,
    TooltipModule,
    TopbarWidget,
    FooterWidget,
    RouterModule
  ],
  templateUrl: './nos-agences.component.html',
  styleUrls: ['./nos-agences.component.scss']
})
export class NosAgencesComponent implements OnInit {
  agencies: Agency[] = [];
  selectedAgency: Agency | null = null;
  safeMapUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadAgencies();
    if (this.agencies.length > 0) {
      this.selectAgency(this.agencies[0]);
    }
  }

  loadAgencies(): void {
    // Simuler le chargement des données depuis une API
    this.agencies = [
      {
        id: 1,
        name: 'Agence Casablanca Centre',
        city: 'Casablanca',
        address: '123 Boulevard Mohammed V',
        postalCode: '20000',
        phone: '+212 522 123 456',
        email: 'casablanca@perfectcar.ma',
        description: 'Notre agence principale au cœur de Casablanca vous accueille dans un espace luxueux avec une large gamme de véhicules disponibles.',
        hours: ['Lundi - Vendredi: 9h - 19h', 'Samedi: 10h - 18h', 'Dimanche: Fermé'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.9651325392897!2d-7.635591685088027!3d33.58815915075453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d282e00000001%3A0x3c1d70365ef9ba12!2sBoulevard%20Mohamed%20V%2C%20Casablanca%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1650297534508!5m2!1sfr!2sfr',
        imageUrl: 'assets/images/agences/casablanca.jpg',
        manager: {
          name: 'Hassan Alaoui',
          phone: '+212 661 234 567',
          email: 'h.alaoui@perfectcar.ma',
          photoUrl: 'assets/images/managers/user.jpg'
        }
      },
      {
        id: 2,
        name: 'Agence Marrakech Médina',
        city: 'Marrakech',
        address: '45 Avenue Mohammed VI',
        postalCode: '40000',
        phone: '+212 524 345 678',
        email: 'marrakech@perfectcar.ma',
        description: 'Notre agence de Marrakech vous propose un service haut de gamme et personnalisé pour explorer la ville ocre et ses environs.',
        hours: ['Lundi - Vendredi: 9h - 18h30', 'Samedi: 9h30 - 17h', 'Dimanche: 10h - 14h'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3398.0116310373365!2d-8.012077685142726!3d31.612304550398405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee9465ae0bf7%3A0x27332ef8ceceac14!2sAv.%20Mohammed%20VI%2C%20Marrakech%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1650297634312!5m2!1sfr!2sfr',
        imageUrl: 'assets/images/agences/marrakech.jpg',
        manager: {
          name: 'Fatima Benali',
          phone: '+212 662 345 678',
          email: 'f.benali@perfectcar.ma',
          photoUrl: 'assets/images/managers/user.jpg'
        }
      },
      {
        id: 3,
        name: 'Agence Rabat Hassan',
        city: 'Rabat',
        address: '12 Avenue Hassan II',
        postalCode: '10000',
        phone: '+212 537 456 789',
        email: 'rabat@perfectcar.ma',
        description: 'Notre agence située dans la capitale vous offre un service prestigieux au cœur du quartier administratif.',
        hours: ['Lundi - Vendredi: 8h30 - 18h', 'Samedi: 9h - 16h', 'Dimanche: Fermé'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.3603000878315!2d-6.836982185076128!3d34.015378228537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c840596eb71%3A0xe56ef6a93b866f96!2sAv.%20Hassan%20II%2C%20Rabat%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1650297687539!5m2!1sfr!2sfr',
        imageUrl: 'assets/images/agences/rabat.jpg',
        manager: {
          name: 'Mohammed Chraibi',
          phone: '+212 663 456 789',
          email: 'm.chraibi@perfectcar.ma',
          photoUrl: 'assets/images/managers/user.jpg'
        }
      },
      {
        id: 4,
        name: 'Agence Tanger Malabata',
        city: 'Tanger',
        address: '78 Boulevard Mohammed VI',
        postalCode: '90000',
        phone: '+212 539 567 890',
        email: 'tanger@perfectcar.ma',
        description: 'Notre équipe tangéroise vous attend pour vous proposer des véhicules adaptés à vos besoins dans cette belle région côtière.',
        hours: ['Lundi - Vendredi: 9h - 18h', 'Samedi: 9h30 - 17h30', 'Dimanche: Fermé'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.3878775674357!2d-5.803769284797799!3d35.724224886851275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c78ae14c8a409%3A0x1fca26d3e67f304e!2sBd%20Mohamed%20VI%2C%20Tanger%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1650297736425!5m2!1sfr!2sfr',
        imageUrl: 'assets/images/agences/tanger.jpg',
        manager: {
          name: 'Samir Tazi',
          phone: '+212 664 567 890',
          email: 's.tazi@perfectcar.ma',
          photoUrl: 'assets/images/managers/user.jpg'
        }
      },
      {
        id: 5,
        name: 'Agence Fès',
        city: 'Fès',
        address: '56 Boulevard du 20 Août',
        postalCode: '80000',
        phone: '+212 528 678 901',
        email: 'fes@perfectcar.ma',
        description: 'En plein centre, notre agence de Fès vous propose les véhicules parfaits pour explorer le sud marocain en toute élégance.',
        hours: ['Lundi - Vendredi: 9h - 19h', 'Samedi: 10h - 18h', 'Dimanche: 10h - 14h (été uniquement)'],
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3441.2761012233224!2d-9.606039685174634!3d30.423524175733723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b69af2c4aaa7%3A0x7d46d4edf915c2a!2sBoulevard%2020%20Ao%C3%BBt%2C%20Agadir%2080000%2C%20Maroc!5e0!3m2!1sfr!2sfr!4v1650297789348!5m2!1sfr!2sfr',
        imageUrl: 'assets/images/agences/fes.jpg',
        manager: {
          name: 'Leila Benjelloun',
          phone: '+212 665 678 901',
          email: 'l.benjelloun@perfectcar.ma',
          photoUrl: 'assets/images/managers/user.jpg'
        }
      }
    ];
  }

  selectAgency(agency: Agency): void {
    this.selectedAgency = agency;
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(agency.mapUrl);
    
    // Wait for the DOM to update with the selected agency details
    setTimeout(() => {
      // Check if we're in mobile view (less than 992px)
      if (window.innerWidth < 992) {
        const detailsElement = document.querySelector('.agency-details-container');
        if (detailsElement) {
          // Scroll to the details section with smooth behavior
          detailsElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }
    }, 100);
  }

  openGoogleMaps(): void {
    if (this.selectedAgency) {
      const address = `${this.selectedAgency.address}, ${this.selectedAgency.postalCode} ${this.selectedAgency.city}, Maroc`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  }

  openWaze(): void {
    if (this.selectedAgency) {
      const address = `${this.selectedAgency.address}, ${this.selectedAgency.postalCode} ${this.selectedAgency.city}, Maroc`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://waze.com/ul?q=${encodedAddress}&navigate=yes`, '_blank');
    }
  }

  openAppleMaps(): void {
    if (this.selectedAgency) {
      const address = `${this.selectedAgency.address}, ${this.selectedAgency.postalCode} ${this.selectedAgency.city}, Maroc`;
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://maps.apple.com/?q=${encodedAddress}`, '_blank');
    }
  }

  callAgency(phone: string): void {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  }

  emailAgency(email: string): void {
    window.location.href = `mailto:${email}`;
  }
} 