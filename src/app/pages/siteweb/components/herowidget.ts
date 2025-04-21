import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Reservation } from '../../reservation/models/reservation.model';
import { InfosReservationComponent } from './infos-reservation/infos-reservation.component';
@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, CommonModule, CardModule, InfosReservationComponent],
    template: `
        <div id="hero" class="landing-hero">
            <div class="hero-background"></div>
            <!-- Hero Header -->
            <div class="hero-header text-center">
                <h1 class="text-5xl text-orange-500 font-bold mb-6">AVEC PERFECTCAR LA LOCATION DE VOITURE EST SIMPLE.</h1>
                
                <div class="flex flex-wrap justify-center gap-6 text-xl text-white">
                    <div class="flex items-center">
                        <i class="pi pi-check-circle mr-2 text-yellow-500"></i>
                        <span>Sans surprise</span>
                    </div>
                    <div class="flex items-center">
                        <i class="pi pi-check mr-2 text-yellow-500"></i>
                        <span>Sans astérix</span>
                    </div>
                    <div class="flex items-center">
                        <i class="pi pi-tag mr-2 text-yellow-500"></i>
                        <span>À partir de 179 Dirhams TTC</span>
                    </div>
                    <div class="flex items-center">
                        <i class="pi pi-map-marker mr-2 text-yellow-500"></i>
                        <span>Présence dans toutes les villes et aéroports du Maroc</span>
                    </div>
                </div>
                        
                            <app-infos-reservation
                                [minDate]="minDate"
                                [reservation]="reservation"
                                (chercherVehicule)="onChercherVehicule($event)">
                            </app-infos-reservation>
            </div>
                        
            
            <!-- Service Selection Cards -->
            <div class="services-section">
                <div class="services-container">
                    <!-- Location Card -->
                    <div class="service-card location-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="pi pi-car"></i>
                            </div>
                            <h2 class="text-yellow-500">Location de Voiture</h2>
                        </div>
                        
                        <div class="card-body">
                            <p class="card-description">
                                Découvrez notre flotte de 1200 véhicules de toutes catégories.
                            </p>
                            <div class="card-image">
                                <img src="/assets/images/image2.png" alt="Notre flotte de véhicules" class="car-image" />
                            </div>
                           
                            <div class="features-grid">
                                <div class="feature-item">
                                    <i class="pi pi-check"></i>
                                    <span>Kilométrage illimité</span>
                                </div>
                                <div class="feature-item">
                                    <i class="pi pi-check"></i>
                                    <span>2ème conducteur offert</span>
                                </div>
                                <div class="feature-item">
                                    <i class="pi pi-check"></i>
                                    <span>Sans caution</span>
                                </div>
                                <div class="feature-item">
                                    <i class="pi pi-check"></i>
                                    <span>Option retour ville différente</span>
                                </div>
                            </div>

                            <button pButton pRipple 
                                label="Explorer nos véhicules" 
                                class="p-button explore-button" 
                                (click)="navigateTo('/parcauto')">
                            </button>
                        </div>
                    </div>

                    <!-- Reservation Card -->
                    <div class="service-card reservation-card">
                        <div class="card-header">
                            <div class="card-icon">
                                <i class="pi pi-calendar"></i>
                            </div>
                            <h2 class="text-yellow-500">Réserver un Véhicule</h2>
                        </div>
                        
                        <div class="card-body">
                            <div class="card-image">
                                <img src="/assets/images/image2.png" alt="Notre flotte de véhicules" class="car-image" />
                            </div>
                            <app-infos-reservation
                                [minDate]="minDate"
                                [reservation]="reservation"
                                (chercherVehicule)="onChercherVehicule($event)">
                            </app-infos-reservation>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Car Showcase Section -->
            <div class="car-showcase">
                <div class="car-showcase-content">
                    <div class="car-image-container">
                        <img src="/assets/images/image2.png" alt="Notre flotte de véhicules" class="car-image" />
                    </div>
                    <div class="car-showcase-text">
                        <h2 class="text-3xl font-bold mb-4">Notre Flotte Premium</h2>
                        <p class="text-lg mb-6">Des véhicules récents et bien entretenus pour votre confort et votre sécurité.</p>
                        <button pButton pRipple 
                            label="Découvrir notre flotte" 
                            class="p-button-outlined p-button-warning"
                            (click)="navigateTo('/parcauto')">
                        </button>
                    </div>
                </div>
            </div>

            <!-- Our Advantages Section -->
            <div class="advantages-section">
                <h2 class="text-3xl font-bold text-center ">Pourquoi Nous Choisir</h2>
                
                <div class="advantages-grid">
                    <div class="advantage-card">
                        <div class="advantage-icon">
                            <i class="pi pi-shield text-3xl"></i>
                        </div>
                        <h3>Sécurité</h3>
                        <p>Tous nos véhicules sont régulièrement entretenus et contrôlés pour assurer votre sécurité.</p>
                    </div>

                    <div class="advantage-card">
                        <div class="advantage-icon">
                            <i class="pi pi-wallet text-3xl"></i>
                                </div>
                        <h3>Transparence des prix</h3>
                        <p>Pas de frais cachés. Nos tarifs sont clairs et compétitifs.</p>
                                            </div>
                    
                    <div class="advantage-card">
                        <div class="advantage-icon">
                            <i class="pi pi-clock text-3xl"></i>
                                </div>
                        <h3>Service rapide</h3>
                        <p>Réservation en ligne simple et rapide, assistance client disponible 24/7.</p>
                            </div>
                    
                    <div class="advantage-card">
                        <div class="advantage-icon">
                            <i class="pi pi-star text-3xl"></i>
                        </div>
                        <h3>Qualité premium</h3>
                        <p>Des véhicules de qualité et un service client impeccable pour une expérience parfaite.</p>
                        </div>
                    </div>
            </div>
        </div>
    `,
    styles: [`
        .landing-hero {
            position: relative;
            overflow: visible;
            background-color: #000;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40vh;
            
            background-image: url('/assets/images/header-background.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.9;
            z-index: 1;
        }

        .hero-header {
            position: relative;
            z-index: 2;
            padding: 2rem 1rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        .hero-header h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            line-height: 1.2;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            background: linear-gradient(45deg,rgb(247, 241, 241), #ec700a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientFlow 8s ease infinite;
            padding: 0 1rem;
        }

        .hero-header .flex {
            gap: clamp(1rem, 3vw, 1.5rem);
            padding: 0 1rem;
        }

        .hero-header .flex > div {
            font-size: clamp(0.875rem, 2vw, 1.25rem);
            white-space: nowrap;
        }

        @media (max-width: 768px) {
            .hero-header {
                padding: 1.5rem 0.5rem;
            }

            .hero-header .flex {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .hero-header .flex > div {
                width: 100%;
                text-align: center;
                justify-content: center;
            }
        }

        @media (max-width: 480px) {
            .hero-header {
                padding: 1rem 0.5rem;
            }

            .hero-header h1 {
                font-size: 1.75rem;
                margin-bottom: 1rem;
            }

            .hero-header .flex > div {
                font-size: 0.875rem;
            }
        }
        
        .services-section {
            position: relative;
            width: 100%;
            padding: 4rem 2rem;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
            backdrop-filter: blur(8px);
            z-index: 3;
            margin-top: 2rem;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
        }

        .services-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            position: relative;
        }

       

        .service-card {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }

        .service-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
            border-color: #ffd700;
        }

        .card-header {
            padding: 1.75rem;
            background: rgb(77, 75, 67);
            color: white;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            border-bottom: 3px solid #ffd700;
        }

        .card-icon {
            width: 52px;
            height: 52px;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            position: relative;
            overflow: hidden;
        }

        .card-icon::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(-100%);
            animation: shine 3s infinite;
        }

        @keyframes shine {
            100% {
                transform: translateX(100%);
            }
        }

        .card-icon i {
            font-size: 1.75rem;
            color: #ffd700;
        }

        .card-header h2 {
            font-size: 1.4rem;
            margin: 0;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .card-body {
            padding: 2rem;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
        }

        .card-description {
            color: #333;
            margin-bottom: 2rem;
            line-height: 1.7;
            font-size: 1rem;
            font-weight: 500;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
            margin-bottom: 2rem;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            color: #444;
            font-size: 0.95rem;
            padding: 0.75rem;
            border: 1px solid rgba(255, 215, 0, 0.2);
            background: rgba(255, 215, 0, 0.05);
            transition: all 0.3s ease;
        }

        .feature-item:hover {
            background: rgba(255, 215, 0, 0.1);
            border-color: rgba(255, 215, 0, 0.3);
            transform: translateX(5px);
        }

        .feature-item i {
            color: #ffd700;
            font-size: 1.1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .explore-button {
            width: 100%;
            height: 54px;
            background-color: #ffd700;
            border: none;
            color: #000;
            font-weight: 700;
            font-size: 1rem;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            
            &:hover {
                background-color: rgb(182, 77, 17);
                color: white;
                transform: translateY(-1px);
            }

            &:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
        }
        
        /* Tablet Styles */
        @media (max-width: 1024px) {
            .services-section {
                padding: 3rem 1.5rem;
            }

            .services-container {
                grid-template-columns: 1fr;
                max-width: 768px;
            }

            .services-container::before {
                opacity: 0.3;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background-position: center;
            }

            .card-header {
                padding: 1.5rem;
            }

            .feature-item {
                font-size: 0.9rem;
            }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .services-section {
                padding: 2rem 1rem;
                margin-top: 1rem;
            }

            .services-container::before {
                display: none;
            }

            .features-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }

            .card-header {
                padding: 1.25rem;
            }

            .card-header h2 {
                font-size: 1.2rem;
            }

            .card-body {
                padding: 1.5rem;
            }

            .explore-button {
                height: 48px;
                font-size: 0.9rem;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .services-section {
                background: rgba(26, 26, 26, 0.98);
            }

            .service-card {
                background: #2d2d2d;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .card-description {
                color: #bbb;
            }

            .feature-item {
                color: #ddd;
                background: rgba(236, 112, 10, 0.05);
                border-color: rgba(236, 112, 10, 0.2);
            }
        }
        
        .advantages-section {
            position: relative;
            padding: 4rem 2rem;
            background: #fff;
            margin: 0 0 0 0;
            z-index: 2;
        }
        
        .advantages-section h2 {
            text-align: center;
            color: #333;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            font-weight: 700;
            position: relative;
        }
        
        .advantages-section h2::after {
            content: '';
            position: absolute;
            bottom: -1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: #ec700a;
        }
        
        .advantages-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }
        
        .advantage-card {
            background-color: #fff;
            padding: 2rem;
            border: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            text-align: center;
            transition: all 0.2s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .advantage-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-color: #ec700a;
        }
        
        .advantage-icon {
            background-color: rgba(236, 112, 10, 0.1);
            color: #ec700a;
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
        }
        
        .advantage-icon i {
            font-size: 2rem;
        }
        
        .advantage-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #333;
        }
        
        .advantage-card p {
            color: #666;
            line-height: 1.6;
            font-size: 0.95rem;
            margin: 0;
            flex-grow: 1;
        }
        
        /* Tablet Styles */
        @media (max-width: 1024px) {
            .advantages-section {
                padding: 3rem 1.5rem;
            }
            
            .advantages-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 1.5rem;
            }
            
            .advantages-section h2 {
                font-size: 2rem;
                margin-bottom: 2.5rem;
            }
            
            .advantage-icon {
                width: 56px;
                height: 56px;
            }
            
            .advantage-icon i {
                font-size: 1.75rem;
            }
        }
        
        /* Mobile Styles */
        @media (max-width: 768px) {
            .advantages-section {
                padding: 2rem 1rem;
            }
            
            .advantages-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .advantages-section h2 {
                font-size: 1.75rem;
                margin-bottom: 2rem;
            }
            
            .advantage-card {
                padding: 1.5rem;
            }
            
            .advantage-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 1rem;
            }
            
            .advantage-icon i {
                font-size: 1.5rem;
            }
            
            .advantage-card h3 {
                font-size: 1.1rem;
                margin-bottom: 0.75rem;
            }
            
            .advantage-card p {
                font-size: 0.9rem;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .advantages-section {
                background: #1a1a1a;
            }
            
            .advantages-section h2 {
                color: #fff;
            }
            
            .advantage-card {
                background: #2d2d2d;
                border-color: rgba(255, 255, 255, 0.1);
            }
            
            .advantage-card h3 {
                color: #fff;
            }
            
            .advantage-card p {
                color: #bbb;
            }
            
            .advantage-icon {
                background-color: rgba(236, 112, 10, 0.2);
            }
        }

        .car-showcase {
            position: relative;
            width: 100%;
            padding: 4rem 2rem;
            background: linear-gradient(to right, #f8f9fa, #ffffff);
            overflow: hidden;
            z-index: 2;
        }

        .car-showcase-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4rem;
        }

        .car-image-container {
            flex: 1;
            max-width: 800px;
            position: relative;
        }

        .car-image {
            width: 100%;
            height: auto;
            object-fit: contain;
            filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
            transition: transform 0.3s ease;
        }

        .car-image:hover {
            transform: scale(1.02);
        }

        .car-showcase-text {
            flex: 1;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .car-showcase-text h2 {
            color: #333;
            margin-bottom: 1.5rem;
            position: relative;
        }

        .car-showcase-text h2::after {
            content: '';
            position: absolute;
            bottom: -0.5rem;
            left: 0;
            width: 60px;
            height: 3px;
            background: #ffd700;
        }

        .car-showcase-text p {
            color: #666;
            line-height: 1.8;
            margin-bottom: 2rem;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
            .car-showcase {
                padding: 3rem 1.5rem;
            }

            .car-showcase-content {
                flex-direction: column;
                gap: 2rem;
            }

            .car-image-container {
                order: -1;
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
            }

            .car-showcase-text {
                text-align: center;
                padding: 1rem;
            }

            .car-showcase-text h2::after {
                left: 50%;
                transform: translateX(-50%);
            }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .car-showcase {
                padding: 2rem 1rem;
            }

            .car-showcase-text h2 {
                font-size: 1.75rem;
            }

            .car-showcase-text p {
                font-size: 1rem;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .car-showcase {
                background: linear-gradient(to right, #1a1a1a, #2d2d2d);
            }

            .car-showcase-text h2 {
                color: #fff;
            }

            .car-showcase-text p {
                color: #bbb;
            }
        }
    `]
})
export class HeroWidget {
    hoveredCard: string | null = null;
    minDate: Date = new Date();
    reservation: Reservation | null = null;
    
    constructor(private router: Router) {

      
    }
    
    hoverCard(card: string): void {
        this.hoveredCard = card;
    }
    
    leaveCard(): void {
        this.hoveredCard = null;
    }
    
    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    
onChercherVehicule(event: Reservation) {
    // Stocker les données de réservation dans la variable reservation
    this.reservation = {
        dateDepart: event.dateDepart,
        dateRetour: event.dateRetour,
        heureDepart: event.heureDepart,
        heureRetour: event.heureRetour,
        agenceDepart: event.agenceDepart,
        agenceRetour: event.agenceRetour,
        age: event.age,
        codePromo: event.codePromo,
    };
    localStorage.setItem('reservation', JSON.stringify(this.reservation));
    this.router.navigate(['/parcauto'],{state:{reservation:this.reservation}});
}
}
