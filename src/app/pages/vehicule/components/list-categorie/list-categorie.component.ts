import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Categorie } from '../../models/vehicule.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VehiculeService } from '../../services/vehicule.service';
import { AuthService } from '../../../auth/core/services/auth.service';

@Component({
    selector: 'app-list-categorie',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CardModule,
        DataViewModule,
        SelectButtonModule,
        TagModule,
        TooltipModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-2xl font-bold text-gray-800">Catégories de Véhicules</h2>
                <button 
                    pButton 
                    label="Nouvelle Catégorie" 
                    icon="pi pi-plus" 
                    routerLink="new"
                    class="p-button-raised p-button-primary"
                ></button>
            </div>

            <p-dataview #dv [value]="categories" [layout]="layout">
                <ng-template #header>
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2">
                            <p-selectButton 
                                [(ngModel)]="layout" 
                                [options]="layoutOptions" 
                                optionLabel="label" 
                                optionValue="value"
                            ></p-selectButton>
                        </div>
                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input 
                                pInputText 
                                type="text" 
                                (input)="onSearch($event)" 
                                placeholder="Rechercher une catégorie..."
                            />
                        </span>
                    </div>
                </ng-template>

                <ng-template #list let-categorie>
                    <div class="col-span-12">
                        <div class="flex flex-col sm:flex-row sm:items-center p-12 border border-surface bg-surface-0 dark:bg-surface-900 rounded-lg mb-6">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-tag text-primary text-xl"></i>
                                    <span class="text-xl font-semibold">{{categorie.nom}}</span>
                                </div>
                                <p class="text-gray-600 mt-2">{{categorie.libelle}}</p>
                            </div>
                            <div class="flex gap-2 mt-6 sm:mt-0">
                                <button 
                                    pButton 
                                    icon="pi pi-pencil" 
                                    class="p-button-rounded p-button-text"
                                    [pTooltip]="'Modifier'"
                                    routerLink="edit/{{categorie.id}}"
                                ></button>
                                <button 
                                    pButton 
                                    icon="pi pi-trash" 
                                    class="p-button-rounded p-button-text p-button-danger"
                                    [pTooltip]="'Supprimer'"
                                    (click)="confirmDelete(categorie)"
                                ></button>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-template #grid let-categorie>
                    <div class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 p-2">
                        <div class="p-12 border border-surface bg-surface-0 dark:bg-surface-900 rounded-lg h-full">
                            <div class="flex flex-col h-full">
                                <div class="flex items-center gap-2 mb-6">
                                    <i class="pi pi-tag text-primary text-xl"></i>
                                    <span class="text-xl font-semibold">{{categorie.nom}}</span>
                                </div>
                                <p class="text-gray-600 mb-12">{{categorie.libelle}}</p>
                                <div class="mt-auto flex justify-end gap-2">
                                    <button 
                                        pButton 
                                        icon="pi pi-pencil" 
                                        class="p-button-rounded p-button-text"
                                        [pTooltip]="'Modifier'"
                                        routerLink="edit/{{categorie.id}}"
                                    ></button>
                                    <button 
                                        pButton 
                                        icon="pi pi-trash" 
                                        class="p-button-rounded p-button-text p-button-danger"
                                        [pTooltip]="'Supprimer'"
                                        (click)="confirmDelete(categorie)"
                                    ></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <p-confirmDialog></p-confirmDialog>
    `,
    styles: [`
        :host ::ng-deep .p-dataview {
            .p-dataview-header {
                background: transparent;
                border: none;
                padding: 1rem 0;
            }
        }
    `]
})
export class ListCategorieComponent implements OnInit {
    categories: Categorie[] = [];
    layout: 'list' | 'grid' = 'grid';
    layoutOptions = [
        { label: 'Liste', value: 'list', icon: 'pi pi-list' },
        { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' }
    ];
    currentUser: string;

    constructor(
        private vehiculeService: VehiculeService,
        private confirmationService: ConfirmationService,
        private authService: AuthService
    ) {
        // Récupérer le nom d'utilisateur connecté
        const userInfo = this.authService.currentUserValue;
        this.currentUser = userInfo?.username || 'admin';
    }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.vehiculeService.getActivesCategories().subscribe({
            next: (data: Categorie[]) => {
                this.categories = data;
            },
            error: (error: any) => {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        });
    }

    onSearch(event: Event) {
        const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
        this.categories = this.categories.filter(categorie => 
            categorie.nom.toLowerCase().includes(searchTerm) ||
            categorie.libelle.toLowerCase().includes(searchTerm)
        );
    }

    confirmDelete(categorie: Categorie) {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer la catégorie "${categorie.nom}" ?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteCategorie(categorie.id);
            }
        });
    }

    deleteCategorie(id: number) {
        this.vehiculeService.deleteCategorie(id, this.currentUser).subscribe({
            next: () => {
                this.loadCategories();
            },
            error: (error) => {
                console.error('Erreur lors de la suppression:', error);
            }
        });
    }

    archiveCategorie(id: number) {
        this.vehiculeService.archiveCategorie(id, this.currentUser).subscribe({
            next: () => {
                this.loadCategories();
            }
        });
    }

    activeCategorie(id: number) {
        this.vehiculeService.activeCategorie(id, this.currentUser).subscribe({
            next: () => {
                this.loadCategories();
            }
        });
    }
} 