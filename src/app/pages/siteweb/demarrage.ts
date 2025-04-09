import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FooterWidget } from './components/footerwidget';
import { CommonModule } from '@angular/common';
import { ParcautoWidget } from './components/parcauto';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterModule, 
        TopbarWidget, 
        HeroWidget,
        ParcautoWidget,
        FooterWidget, 
        RippleModule, 
        StyleClassModule, 
        ButtonModule, 
        DividerModule,
        CommonModule
    ],
    template: `
        <div class="landing-wrapper overflow-hidden">
            <topbar-widget class="topbar-wrapper" />
            <ng-container *ngIf="showParcauto; else heroContent">
                <parcauto-widget />
            </ng-container>
            <ng-template #heroContent>
                <hero-widget />
            </ng-template>
            <footer-widget />
        </div>
    `,
    styles: [`
        .landing-wrapper {
            font-family: var(--font-family);
            overflow-x: hidden;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .topbar-wrapper {
            position: sticky;
            top: 0;
            z-index: 1000;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0;
            background: linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 15px rgba(236, 112, 10, 0.08);
            border-bottom: 1px solid rgba(236, 112, 10, 0.05);
            transition: all 0.3s ease;
        }

        .topbar-wrapper:hover {
            box-shadow: 0 4px 20px rgba(236, 112, 10, 0.12);
        }

        :host ::ng-deep {
            .p-button {
                background:rgb(245, 201, 4);
                border-color:rgb(179, 166, 126);
                color: #000;
                transition: all 0.3s ease;

                &:hover {
                    background: #d66409;
                    border-color: #d66409;
                    color: #000;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(236, 112, 10, 0.2);
                }
            }

            .p-button.p-button-outlined {
                background: rgb(245, 229, 4);;
                color: #000;
                border-color: #ec700a;

                &:hover {
                    background: #fff9f5;
                }
            }

            .p-inputtext:focus {
                border-color: #ec700a;
                box-shadow: 0 0 0 2px rgba(236, 112, 10, 0.1);
            }

            .p-dropdown:focus {
                border-color: #ec700a;
                box-shadow: 0 0 0 2px rgba(236, 112, 10, 0.1);
            }
        }
        
        @media (max-width: 992px) {
            .topbar-wrapper {
                padding: 0.75rem 1rem;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .topbar-wrapper,
            :host ::ng-deep .p-button {
                transition: none;
            }
        }
    `]
})
export class Demarrage implements OnInit {
    showParcauto: boolean = false;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.showParcauto = data['showParcauto'] || false;
        });
    }
}
