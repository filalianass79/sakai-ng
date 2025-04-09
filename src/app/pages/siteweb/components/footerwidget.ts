import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'footer-widget',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        FormsModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast position="top-center"></p-toast>
        <footer class="footer">
            <div class="footer-top">
                <div class="container">
                    <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6">
                        <!-- Nos Services -->
                        <div class="col-span-12 md:col-span-4 footer-links">
                            <div class="footer-logo mb-12">
                                <img src="assets/images/logoWhite.png" alt="Perfect Car Logo" class="logo-img">
                            </div>
                            <h4>Nos Services</h4>
                            <p class="company-description mb-12">
                                Votre partenaire de confiance pour la location de voitures 
                                et services de navette aéroport depuis plus de 10 ans.
                            </p>
                            <ul>
                                <li><a routerLink="/location">Location de voitures</a></li>
                                <li><a routerLink="/navette">Service de navette aéroport</a></li>
                                <li><a href="#">Transferts privés</a></li>
                                <li><a href="#">Location longue durée</a></li>
                            </ul>
                            <div class="social-icons mt-12">
                                <a href="#" class="social-icon"><i class="pi pi-facebook"></i></a>
                                <a href="#" class="social-icon"><i class="pi pi-twitter"></i></a>
                                <a href="#" class="social-icon"><i class="pi pi-instagram"></i></a>
                                <a href="#" class="social-icon"><i class="pi pi-linkedin"></i></a>
                            </div>
                        </div>

                        <!-- Aide & Support -->
                        <div class="col-span-12 md:col-span-4 footer-links">
                            <h4>Aide & Support</h4>
                            <ul>
                                <li><a href="#">Centre d'aide</a></li>
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">Conditions générales</a></li>
                                <li><a href="#">Politique de confidentialité</a></li>
                                <li><a href="#">Nous contacter</a></li>
                            </ul>
                            <div class="contact-info mt-12">
                                <p><i class="pi pi-phone"></i> +212 5XX-XXXXXX</p>
                                <p><i class="pi pi-envelope"></i> contact&#64;perfectcar.ma</p>
                                <p><i class="pi pi-map-marker"></i> 123 Avenue Mohammed V, Casablanca</p>
                            </div>
                        </div>

                        <!-- Newsletter -->
                        <div class="col-span-12 md:col-span-4 newsletter-section">
                            <h4>Newsletter</h4>
                            <p>Recevez nos meilleures offres et actualités</p>
                            <div class="newsletter-form">
                                <div class="p-inputgroup">
                                    <input type="email" pInputText placeholder="Votre email" [(ngModel)]="email">
                                    <button type="button" pButton pRipple icon="pi pi-send" 
                                        (click)="subscribeNewsletter()"></button>
                                </div>
                            </div>
                            <div class="newsletter-benefits mt-12">
                                <h5>Pourquoi s'abonner ?</h5>
                                <ul>
                                    <li><i class="pi pi-check"></i> Offres exclusives</li>
                                    <li><i class="pi pi-check"></i> Nouveaux véhicules</li>
                                    <li><i class="pi pi-check"></i> Promotions spéciales</li>
                                    <li><i class="pi pi-check"></i> Conseils et actualités</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="container">
                    <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6">
                        <div class="col-span-12 md:col-span-6">
                            <p class="copyright">© 2024 Perfect Car. Tous droits réservés.</p>
                        </div>
                        <div class="col-span-12 md:col-span-6 footer-bottom-links">
                            <a href="#">Politique de confidentialité</a>
                            <a href="#">Conditions d'utilisation</a>
                            <a href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `,
    styles: [`
        .footer {
            background-color: #1f2937;
            color: #f3f4f6;
            font-family: var(--font-family);
        }
        
        .footer-top {
            padding: 4rem 1rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-logo {
            display: flex;
            align-items: center;
        }
        
        .logo-img {
            height: 40px;
            margin-right: 0.5rem;
        }
        
        .company-description {
            line-height: 1.6;
            color: #9ca3af;
        }
        
        .social-icons {
            display: flex;
            gap: 1rem;
        }
        
        .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #374151;
            color: #f3f4f6;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background-color: #ec700a;
            transform: translateY(-3px);
        }
        
        .footer-links h4,
        .newsletter-section h4 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 0.5rem;
            color: #f3f4f6;
        }
        
        .footer-links h4:after,
        .newsletter-section h4:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 2px;
            width: 50px;
            background-color: #ec700a;
        }
        
        .footer-links ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links li {
            margin-bottom: 0.75rem;
        }
        
        .footer-links a {
            color: #9ca3af;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
            position: relative;
        }
        
        .footer-links a:hover {
            color: #ec700a;
            padding-left: 5px;
        }
        
        .footer-links a:before {
            content: '›';
            position: absolute;
            left: -10px;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .footer-links a:hover:before {
            opacity: 1;
            left: -5px;
        }
        
        .newsletter-section p {
            margin-bottom: 1rem;
            color: #9ca3af;
        }
        
        .newsletter-form {
            margin-bottom: 1.5rem;
        }
        
        .newsletter-form .p-inputgroup {
            background-color: #374151;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        
        .newsletter-form input {
            background-color: transparent;
            border: none;
            color: #f3f4f6;
            padding: 0.75rem;
        }
        
        .newsletter-form button {
            background-color: #ec700a;
            border: none;
            color: #f3f4f6;
        }
        
        .newsletter-form button:hover {
            background-color: #d65f00;
        }
        
        .newsletter-benefits h5 {
            color: #f3f4f6;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        
        .newsletter-benefits ul {
            list-style: none;
            padding: 0;
        }
        
        .newsletter-benefits li {
            color: #9ca3af;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .newsletter-benefits i {
            color: #ec700a;
        }
        
        .contact-info p {
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            color: #9ca3af;
        }
        
        .contact-info i {
            margin-right: 0.75rem;
            color: #ec700a;
        }
        
        .footer-bottom {
            background-color: #111827;
            padding: 1.5rem 1rem;
            border-top: 1px solid #374151;
        }
        
        .copyright {
            margin: 0;
            color: #9ca3af;
        }
        
        .footer-bottom-links {
            display: flex;
            gap: 1.5rem;
            justify-content: flex-end;
        }
        
        .footer-bottom-links a {
            color: #9ca3af;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }
        
        .footer-bottom-links a:hover {
            color: #ec700a;
        }
        
        @media (max-width: 768px) {
            .footer-top {
                padding: 2rem 1rem;
            }
            
            .footer-bottom-links {
                justify-content: flex-start;
                margin-top: 1rem;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .social-icons {
                justify-content: flex-start;
            }
            
            .footer-links h4, 
            .newsletter-section h4 {
                margin-top: 2rem;
            }
        }
    `]
})
export class FooterWidget {
    email: string = '';
    
    constructor(
        public router: Router,
        private messageService: MessageService
    ) {}
    
    subscribeNewsletter() {
        if (!this.email || !this.validateEmail(this.email)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez entrer une adresse email valide',
                life: 3000
            });
            return;
        }
        
        // Simulation de l'abonnement à la newsletter
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Vous êtes maintenant abonné à notre newsletter !',
            life: 3000
        });
        
        this.email = '';
    }
    
    validateEmail(email: string): boolean {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }
}
