import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TextareaModule } from 'primeng/textarea';
import { VehiculeService } from '../../services/vehicule.service';
import { Categorie } from '../../models/vehicule.model';

@Component({
    selector: 'app-categorie-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        CardModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-2xl font-bold text-gray-800">
                    {{ isEditMode ? 'Modifier la Catégorie' : 'Nouvelle Catégorie' }}
                </h2>
                <button 
                    pButton 
                    label="Retour" 
                    icon="pi pi-arrow-left" 
                    routerLink="/vehicule/categories"
                    class="p-button-text"
                ></button>
            </div>

            <form [formGroup]="categorieForm" (ngSubmit)="onSubmit()" class="p-fluid">
                <div class="field">
                    <label for="nom" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Nom de la catégorie
                        <span class="text-red-500">*</span>
                    </label>
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-tag"></i>
                        <input 
                            id="nom"
                            type="text" 
                            pInputText 
                            formControlName="nom"
                            class="w-full"
                            [class.p-invalid]="categorieForm.get('nom')?.invalid && categorieForm.get('nom')?.touched"
                        />
                    </span>
                    <small class="text-red-500" *ngIf="categorieForm.get('nom')?.invalid && categorieForm.get('nom')?.touched">
                        Le nom est requis
                    </small>
                </div>

                <div class="field">
                    <label for="libelle" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Libellé
                        <span class="text-red-500">*</span>
                    </label>
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-bookmark"></i>
                        <input 
                            id="libelle"
                            type="text" 
                            pInputText 
                            formControlName="libelle"
                            class="w-full"
                            [class.p-invalid]="categorieForm.get('libelle')?.invalid && categorieForm.get('libelle')?.touched"
                        />
                    </span>
                    <small class="text-red-500" *ngIf="categorieForm.get('libelle')?.invalid && categorieForm.get('libelle')?.touched">
                        Le libellé est requis
                    </small>
                </div>

                <div class="field">
                    <label for="exemple" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                        Exemple
                    </label>
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-info-circle"></i>
                        <input 
                            id="exemple"
                            type="text" 
                            pInputText 
                            formControlName="exemple"
                            class="w-full"
                        />
                    </span>
                </div>

               

                <div class="flex justify-end gap-2 mt-12">
                    <button 
                        pButton 
                        type="button" 
                        label="Annuler" 
                        icon="pi pi-times" 
                        routerLink="/vehicule/categories"
                        class="p-button-text"
                    ></button>
                    <button 
                        pButton 
                        type="submit" 
                        label="Enregistrer" 
                        icon="pi pi-check"
                        [disabled]="categorieForm.invalid"
                    ></button>
                </div>
            </form>
        </div>

        <p-toast></p-toast>
    `,
    styles: [`
        :host ::ng-deep {
            .p-inputtext {
                width: 100%;
            }
        }
    `]
})
export class CategorieFormComponent implements OnInit {
    categorieForm: FormGroup;
    isEditMode = false;
    categorieId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private vehiculeService: VehiculeService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
        this.categorieForm = this.fb.group({
            nom: ['', Validators.required],
            libelle: ['', Validators.required],
            exemple: [''],
        });
    }

    ngOnInit() {
        this.categorieId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.categorieId) {
            this.isEditMode = true;
            this.loadCategorie();
        }
    }

    loadCategorie() {
        if (this.categorieId) {
            this.vehiculeService.getCategorieById(this.categorieId).subscribe({
                next: (categorie) => {
                    this.categorieForm.patchValue({
                        nom: categorie.nom,
                        libelle: categorie.libelle,
                        exemple: categorie.exemple  
                    });
                },
                error: (error) => {
                    console.error('Erreur lors du chargement de la catégorie:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la catégorie'
                    });
                }
            });
        }
    }

    onSubmit() {
        if (this.categorieForm.valid) {
            const categorie: Categorie = {
                ...this.categorieForm.value,
                isVisible: true
            };
            
            if (this.isEditMode && this.categorieId) {
                this.vehiculeService.updateCategorie(this.categorieId, categorie).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Catégorie mise à jour avec succès'
                        });
                        this.router.navigate(['/vehicule/categories']);
                    },
                    error: (error: any) => {
                        console.error('Erreur lors de la mise à jour:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de mettre à jour la catégorie'
                        });
                    }
                });
            } else {
                this.vehiculeService.createCategorie(categorie).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Catégorie créée avec succès'
                        });
                        this.router.navigate(['/vehicule/categories']);
                    },
                    error: (error: any) => {
                        console.error('Erreur lors de la création:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de créer la catégorie'
                        });
                    }
                });
            }
        }
    }
} 