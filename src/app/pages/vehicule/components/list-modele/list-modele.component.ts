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
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Modele } from '../../models/vehicule.model';
import { VehiculeService } from '../../services/vehicule.service';

@Component({
    selector: 'app-list-modele',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CardModule,
        DataViewModule,
        TagModule,
        TooltipModule,
        SelectButtonModule,
        ConfirmDialogModule,
        InputTextModule
    ],
    providers: [ConfirmationService],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-2xl font-bold text-gray-800">Modèles de Véhicules</h2>
                <button 
                    pButton 
                    label="Nouveau Modèle" 
                    icon="pi pi-plus" 
                    routerLink="new"
                    class="p-button-raised p-button-primary"
                ></button>
            </div>

            <p-dataview #dv [value]="modeles" [layout]="layout">
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
                                placeholder="Rechercher un modèle..."
                            />
                        </span>
                    </div>
                </ng-template>

                <ng-template #list let-modele>
                    <div class="col-span-12">
                        <div class="flex flex-col sm:flex-row sm:items-center p-12 border border-surface bg-surface-0 dark:bg-surface-900 rounded-lg mb-6">
                            <div class="flex-1">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-car text-primary text-xl"></i>
                                    <span class="text-xl font-semibold">{{modele.nom}}</span>
                                    <p-tag [value]="modele.categorieNom || ''" severity="info"></p-tag>
                                </div>
                                <div class="flex gap-2 mt-2">
                                    <p-tag [value]="'Marque: ' + (modele.marqueNom || '')" severity="success"></p-tag>
                                </div>
                            </div>
                            <div class="flex gap-2 mt-6 sm:mt-0">
                                <button 
                                    pButton 
                                    icon="pi pi-pencil" 
                                    class="p-button-rounded p-button-text"
                                    [pTooltip]="'Modifier'"
                                    routerLink="edit/{{modele.id}}"
                                ></button>
                                <button 
                                    pButton 
                                    icon="pi pi-trash" 
                                    class="p-button-rounded p-button-text p-button-danger"
                                    [pTooltip]="'Supprimer'"
                                    (click)="confirmDelete(modele)"
                                ></button>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-template #grid let-modele>
                    <div class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3 p-2">
                        <div class="p-12 border border-surface bg-surface-0 dark:bg-surface-900 rounded-lg h-full">
                            <div class="flex flex-col h-full">
                                <div class="flex items-center gap-2 mb-6">
                                    <i class="pi pi-car text-primary text-xl"></i>
                                    <span class="text-xl font-semibold">{{modele.nom}}</span>
                                    <p-tag [value]="modele.categorieNom || ''" severity="info"></p-tag>
                                </div>
                                <div class="flex flex-wrap gap-2 mb-12">
                                    <p-tag [value]="'Marque: ' + (modele.marqueNom || '')" severity="success"></p-tag>
                                </div>
                                <div class="mt-auto flex justify-end gap-2">
                                    <button 
                                        pButton 
                                        icon="pi pi-pencil" 
                                        class="p-button-rounded p-button-text"
                                        [pTooltip]="'Modifier'"
                                        routerLink="edit/{{modele.id}}"
                                    ></button>
                                    <button 
                                        pButton 
                                        icon="pi pi-trash" 
                                        class="p-button-rounded p-button-text p-button-danger"
                                        [pTooltip]="'Supprimer'"
                                        (click)="confirmDelete(modele)"
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
export class ListModeleComponent implements OnInit {
    modeles: Modele[] = [];
    layout: 'list' | 'grid' = 'grid';
    layoutOptions = [
        { label: 'Liste', value: 'list', icon: 'pi pi-list' },
        { label: 'Grille', value: 'grid', icon: 'pi pi-th-large' }
    ];

    constructor(
        private vehiculeService: VehiculeService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadModeles();
    }

    loadModeles() {
        this.vehiculeService.getAllModeles().subscribe({
            next: (data: Modele[]) => {
                this.modeles = data;
            },
            error: (error: unknown) => {
                console.error('Erreur lors du chargement des modèles:', error);
            }
        });
    }

    onSearch(event: Event) {
        const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
        this.vehiculeService.getAllModeles().subscribe({
            next: (allModeles: Modele[]) => {
                this.modeles = allModeles.filter(modele => 
                    modele.nom.toLowerCase().includes(searchTerm) ||
                    (modele.marqueNom?.toLowerCase().includes(searchTerm) || false) ||
                    (modele.categorieNom?.toLowerCase().includes(searchTerm) || false)
                );
            }
        });
    }

    confirmDelete(modele: Modele) {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer le modèle "${modele.nom}" ?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteModele(modele.id);
            }
        });
    }

    deleteModele(id: number) {
        this.vehiculeService.deleteModele(id).subscribe({
            next: () => {
                this.loadModeles();
            },
            error: (error: unknown) => {
                console.error('Erreur lors de la suppression:', error);
            }
        });
    }
} 