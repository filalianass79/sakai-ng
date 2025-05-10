import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';  
@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [
        RouterModule, 
        StyleClassModule, 
        ButtonModule, 
        RippleModule, 
        SelectButtonModule, 
        CommonModule, 
        FormsModule,
        MenubarModule,
        MenuModule,
        SelectModule
    ],
    template: `
    <div class="topbar-container">
        <!-- Logo Area -->
        <div class="logo-area">
            <a href="#" class="logo-link">
                <img src="assets/images/logoWhite.png" alt="Perfect Car" class="logo-image" />
            </a>
        </div>
        
        <!-- Menu for Desktop -->
        <div class="menu-area" [ngClass]="{'active': menuActive}">
            <ul class="menu-list">
                <li class="menu-item">
                    <a href="#" class="menu-link">Accueil</a>
                </li>
                <li class="menu-item">
                    <a href="#services" class="menu-link">Services</a>
                </li>
                <li class="menu-item">
                    <a href="/nos-vehicules" class="menu-link">Nos véhicules</a>
                </li>
                <li class="menu-item">
                    <a href="/nos-agences" class="menu-link">Nos agences</a>
                </li>
            </ul>

            <!-- Auth buttons for mobile/tablet -->
            <div class="mobile-auth-buttons">
                <button pButton pRipple 
                    label="Connexion" 
                    icon="pi pi-user" 
                    class="p-button-outlined mb-2" 
                    routerLink="/auth/login">
                </button>
                <button pButton pRipple 
                    label="Inscription" 
                    icon="pi pi-user-plus" 
                    routerLink="/auth/register">
                </button>
            </div>
        </div>
        
        <!-- Right Side Actions -->
        <div class="actions-area">
            <div class="topbar-right">
            <button pButton icon="pi pi-calendar" label="Mes réservations" 
                    class="p-button-text" (click)="navigateToReservations()"></button>
            </div> 
            <!-- Language Selector -->
            <p-select [options]="languageOptions" [(ngModel)]="selectedLanguage" optionLabel="name" placeholder="Select a language" class="w-full md:w-56" (onChange)="onLanguageChange($event)">
                <ng-template #selectedItem let-selectedOption>
                    <div class="flex items-center gap-2" *ngIf="selectedOption">
                        <img
                            src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                            [class]="'flag flag-' + selectedOption.code.toLowerCase()"
                            style="width: 18px"
                        />
                        <div>{{ selectedOption.name }}</div>
                    </div>
                </ng-template>
                <ng-template let-country #item>
                    <div class="flex items-center gap-2">
                        <img
                            src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png"
                            [class]="'flag flag-' + country.code.toLowerCase()"
                            style="width: 18px"
                        />
                        <div>{{ country.name }}</div>
                    </div>
                </ng-template>
                <ng-template #dropdownicon>
                    <i class="pi pi-globe text-orange-500"></i>
                </ng-template>
            </p-select>
            
            <!-- Authentication Buttons for desktop -->
            <div class="auth-buttons desktop-only">
                <button pButton pRipple label="Connexion" icon="pi pi-user" class="p-button-outlined mr-2" routerLink="/auth/login"></button>
                <button pButton pRipple label="Inscription" icon="pi pi-user-plus" routerLink="/auth/register"></button>
            </div>
            
            <!-- Mobile Menu Toggle -->
            <button pButton 
                class="menu-toggle-button" 
                icon="pi pi-bars" 
                (click)="toggleMenu()"
                [ngClass]="{'active': menuActive}">
            </button>
        </div>
    </div>
    `,
    styles: [`
        .topbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 70px;
            padding: 0 2rem;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(236, 112, 10, 0.1);
            position: relative;
            z-index: 1000;
        }
        
        .logo-area {
            display: flex;
            align-items: center;
        }
        
        .logo-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #ec700a;
        }
        
        .logo-image {
            height: 40px;
            margin-right: 0.5rem;
        }
        
        .logo-text {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ec700a;
        }
        
        .menu-area {
            display: flex;
            align-items: center;
        }
        
        .menu-list {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .menu-item {
            margin: 0 1rem;
        }
        
        .menu-link {
            color: #555555;
            text-decoration: none;
            font-size: 1rem;
            font-weight: 500;
            padding: 0.5rem 0;
            position: relative;
            transition: color 0.3s ease;
        }
        
        .menu-link:hover {
            color: #ec700a;
        }
        
        .menu-link:after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background-color: #ec700a;
            transition: width 0.3s ease;
        }
        
        .menu-link:hover:after {
            width: 100%;
        }
        
        .actions-area {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        :host ::ng-deep .p-button {
            background: #ec700a;
            border-color: #ec700a;
            color: #ffffff;
        }

        :host ::ng-deep .p-button:hover {
            background: #d66409;
            border-color: #d66409;
        }

        :host ::ng-deep .p-button.p-button-outlined {
            background: transparent;
            color: #ec700a;
            border-color: #ec700a;
        }

        :host ::ng-deep .p-button.p-button-outlined:hover {
            background: #fff9f5;
        }
        
        .language-selector-container {
            margin-right: 1rem;
        }
        
        .language-option {
            display: flex;
            align-items: center;
            padding: 0.25rem;
        }
        
        .language-flag {
            width: 20px;
            height: 14px;
            margin-right: 0.5rem;
            object-fit: cover;
            border-radius: 2px;
        }
        
        .language-name {
            font-size: 0.875rem;
        }
        
        .auth-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        .menu-toggle-button {
            display: none;
            background: none;
            border: none;
            color: #555555;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 1001;
        }
        
        .menu-toggle-button:hover {
            color: #ec700a;
        }
        
        .menu-toggle-button.active {
            color: #ec700a;
        }

        /* Styles pour mobile et tablette */
        @media (max-width: 992px) {
            .topbar-container {
                padding: 0 1rem;
                height: 60px;
            }

            .logo-image {
                height: 35px;
            }

            .menu-area {
                position: fixed;
                top: 60px;
                left: 0;
                right: 0;
                background-color: white;
                box-shadow: 0 5px 10px rgba(236, 112, 10, 0.1);
                flex-direction: column;
                padding: 1rem 0;
                transform: translateY(-150%);
                transition: transform 0.3s ease;
                z-index: 1000;
                max-height: calc(100vh - 60px);
                overflow-y: auto;
            }
            
            .menu-area.active {
                transform: translateY(0);
            }
            
            .menu-list {
                flex-direction: column;
                width: 100%;
            }
            
            .menu-item {
                margin: 0;
                width: 100%;
                text-align: center;
            }
            
            .menu-link {
                display: block;
                padding: 1rem 0;
                font-size: 1.1rem;
            }

            .menu-link:after {
                display: none;
            }
            
            .auth-buttons {
                display: none;
                flex-direction: column;
                width: 100%;
                padding: 1rem;
                gap: 0.5rem;
            }

            .auth-buttons.active {
                display: flex;
            }
            
            .menu-toggle-button {
                display: block;
            }
            
            .language-name {
                display: none;
            }

            :host ::ng-deep .p-button {
                width: 100%;
                margin: 0;
            }

            :host ::ng-deep .language-selector {
                width: 60px;
            }

            :host ::ng-deep .language-selector .p-button {
                padding: 0.5rem;
            }
        }

        /* Styles spécifiques pour tablette */
        @media (min-width: 769px) and (max-width: 992px) {
            .menu-area {
                padding: 2rem 0;
            }

            .menu-link {
                font-size: 1.2rem;
            }

            .auth-buttons {
                padding: 2rem;
            }
        }

        /* Styles pour mobile */
        @media (max-width: 480px) {
            .topbar-container {
                height: 50px;
            }

            .logo-image {
                height: 30px;
            }

            .menu-area {
                top: 50px;
                max-height: calc(100vh - 50px);
            }

            .menu-link {
                font-size: 1rem;
                padding: 0.75rem 0;
            }

            :host ::ng-deep .p-button {
                font-size: 0.875rem;
                padding: 0.5rem 1rem;
            }
        }

        /* Support du mode sombre */
        @media (prefers-color-scheme: dark) {
            .topbar-container {
                background-color: #1a1a1a;
            }

            .menu-area {
                background-color: #1a1a1a;
            }

            .menu-link {
                color: #ffffff;
            }

            .menu-toggle-button {
                color: #ffffff;
            }

            .menu-toggle-button:hover,
            .menu-toggle-button.active {
                color: #ec700a;
            }
        }

        /* Améliorations de l'accessibilité tactile */
        @media (hover: none) {
            .menu-link {
                padding: 1rem 0;
            }

            :host ::ng-deep .p-button {
                min-height: 44px;
                min-width: 44px;
            }
        }

        .desktop-only {
            display: flex;
        }

        .mobile-auth-buttons {
            display: none;
            padding: 1rem;
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
        }

        @media (max-width: 992px) {
            .desktop-only {
                display: none;
            }

            .mobile-auth-buttons {
                display: flex;
            }

            .menu-area {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 1rem;
            }

            .menu-area.active {
                transform: translateY(0);
                
                .mobile-auth-buttons {
                    margin-top: 1rem;
                    opacity: 1;
                    transform: translateY(0);
                    transition: all 0.3s ease 0.2s;
                }
            }

            .mobile-auth-buttons {
                opacity: 0;
                transform: translateY(-20px);
            }

            :host ::ng-deep .mobile-auth-buttons {
                .p-button {
                    width: 100%;
                    justify-content: center;
                    
                    &.p-button-outlined {
                        background: transparent;
                        color: #ec700a;
                        border-color: #ec700a;
                        
                        &:hover {
                            background: rgba(236, 112, 10, 0.1);
                        }
                    }
                    
                    &:not(.p-button-outlined) {
                        background: #ec700a;
                        border-color: #ec700a;
                        color: #ffffff;
                        
                        &:hover {
                            background: #d66409;
                            border-color: #d66409;
                        }
                    }
                }
            }
        }
    `]
})
export class TopbarWidget {
    menuActive = false;
    
    languageOptions = [
        { 
            name: 'FR', 
            code: 'fr', 
            value: 'fr', 
            flagSrc: 'assets/images/flags/fr.svg'
        },
        { 
            name: 'EN', 
            code: 'gb', 
            value: 'en', 
            flagSrc: 'assets/images/flags/gb.svg'
        },
        { 
            name: 'AR', 
            code: 'ma', 
            value: 'ar', 
            flagSrc: 'assets/images/flags/ma.svg'
        }
    ];

    selectedLanguage: any;
    
    constructor(public router: Router) {
        // Récupérer la langue sauvegardée ou utiliser le français par défaut
        const savedLanguage = localStorage.getItem('selectedLanguage');
        this.selectedLanguage = savedLanguage 
            ? this.languageOptions.find(lang => lang.value === savedLanguage) 
            : this.languageOptions[0];
    }
    
    toggleMenu(): void {
        this.menuActive = !this.menuActive;
    }

    onLanguageChange(event: any): void {
        // Sauvegarder la sélection de langue
        localStorage.setItem('selectedLanguage', event.value.value);
        
        // Appliquer la direction RTL pour l'arabe
        if (event.value.value === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }

        // Recharger la page pour appliquer la nouvelle langue
        window.location.reload();
    }
    navigateToReservations(): void {
        this.router.navigate(['/gestion-reservations']);
      }
}
