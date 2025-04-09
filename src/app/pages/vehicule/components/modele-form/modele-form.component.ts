import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Modele, Categorie, Marque } from '../../models/vehicule.model';
import { TextareaModule } from 'primeng/textarea';
import { VehiculeService } from '../../services/vehicule.service';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-modele-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DropdownModule,
        CardModule,
        ToastModule,
        CheckboxModule
    ],
    providers: [MessageService],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-12">
                <h2 class="text-2xl font-bold text-gray-800">
                    {{ isEditMode ? 'Modifier le Modèle' : 'Nouveau Modèle' }}
                </h2>
                <button 
                    pButton 
                    label="Retour" 
                    icon="pi pi-arrow-left" 
                    routerLink="/vehicule/modeles"
                    class="p-button-text"
                ></button>
            </div>

            <form [formGroup]="modeleForm" (ngSubmit)="onSubmit()" class="p-fluid">
                <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6">
                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="nom" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Nom du modèle
                                <span class="text-red-500">*</span>
                            </label>
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-car"></i>
                                <input 
                                    id="nom"
                                    type="text" 
                                    pInputText 
                                    formControlName="nom"
                                    class="w-full"
                                    [class.p-invalid]="modeleForm.get('nom')?.invalid && modeleForm.get('nom')?.touched"
                                />
                            </span>
                            <small class="text-red-500" *ngIf="modeleForm.get('nom')?.invalid && modeleForm.get('nom')?.touched">
                                Le nom est requis
                            </small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="marqueId" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Marque
                                <span class="text-red-500">*</span>
                            </label>
                            <p-dropdown
                                id="marqueId"
                                formControlName="marqueId"
                                [options]="marques"
                                optionLabel="nom"
                                optionValue="id"
                                placeholder="Sélectionnez une marque"
                                [class.p-invalid]="modeleForm.get('marqueId')?.invalid && modeleForm.get('marqueId')?.touched"
                                class="w-full"
                            ></p-dropdown>
                            <small class="text-red-500" *ngIf="modeleForm.get('marqueId')?.invalid && modeleForm.get('marqueId')?.touched">
                                La marque est requise
                            </small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="categorieId" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Catégorie
                                <span class="text-red-500">*</span>
                            </label>
                            <p-dropdown
                                id="categorieId"
                                formControlName="categorieId"
                                [options]="categories"
                                optionLabel="nom"
                                optionValue="id"
                                placeholder="Sélectionnez une catégorie"
                                [class.p-invalid]="modeleForm.get('categorieId')?.invalid && modeleForm.get('categorieId')?.touched"
                                class="w-full"
                            ></p-dropdown>
                            <small class="text-red-500" *ngIf="modeleForm.get('categorieId')?.invalid && modeleForm.get('categorieId')?.touched">
                                La catégorie est requise
                            </small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="vidangeApresChaque" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Vidange après (km)
                                <span class="text-red-500">*</span>
                            </label>
                            <p-inputNumber
                                id="vidangeApresChaque"
                                formControlName="vidangeApresChaque"
                                [min]="1000"
                                [showButtons]="true"
                                [class.p-invalid]="modeleForm.get('vidangeApresChaque')?.invalid && modeleForm.get('vidangeApresChaque')?.touched"
                                class="w-full"
                            ></p-inputNumber>
                            <small class="text-red-500" *ngIf="modeleForm.get('vidangeApresChaque')?.invalid && modeleForm.get('vidangeApresChaque')?.touched">
                                Ce champ est requis
                            </small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="vidangeApresNbreJours" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Vidange après (jours)
                                <span class="text-red-500">*</span>
                            </label>
                            <p-inputNumber
                                id="vidangeApresNbreJours"
                                formControlName="vidangeApresNbreJours"
                                [min]="30"
                                [showButtons]="true"
                                [class.p-invalid]="modeleForm.get('vidangeApresNbreJours')?.invalid && modeleForm.get('vidangeApresNbreJours')?.touched"
                                class="w-full"
                            ></p-inputNumber>
                            <small class="text-red-500" *ngIf="modeleForm.get('vidangeApresNbreJours')?.invalid && modeleForm.get('vidangeApresNbreJours')?.touched">
                                Ce champ est requis
                            </small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="chaineChangeable" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Chaîne changeable
                            </label>
                            <p-checkbox
                                id="chaineChangeable"
                                formControlName="chaineChangeable"
                                [binary]="true"
                            ></p-checkbox>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="chaineDistributionApresChaque" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Chaîne de distribution après (km)
                            </label>
                            <p-inputNumber
                                id="chaineDistributionApresChaque"
                                formControlName="chaineDistributionApresChaque"
                                [min]="0"
                                [showButtons]="true"
                                class="w-full"
                            ></p-inputNumber>
                            <small class="text-gray-600">Laisser à 0 si non applicable</small>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-6">
                        <div class="field">
                            <label for="pneusApresChaque" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">
                                Pneus à changer après (km)
                            </label>
                            <p-inputNumber
                                id="pneusApresChaque"
                                formControlName="pneusApresChaque"
                                [min]="0"
                                [showButtons]="true"
                                class="w-full"
                            ></p-inputNumber>
                            <small class="text-gray-600">Laisser à 0 si non applicable</small>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 mt-12">
                    <button 
                        pButton 
                        type="button" 
                        label="Annuler" 
                        icon="pi pi-times" 
                        routerLink="/vehicule/modeles"
                        class="p-button-text"
                    ></button>
                    <button 
                        pButton 
                        type="submit" 
                        label="Enregistrer" 
                        icon="pi pi-check"
                        [disabled]="modeleForm.invalid"
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
export class ModeleFormComponent implements OnInit {
    modeleForm: FormGroup;
    isEditMode = false;
    modeleId: number | null = null;
    categories: Categorie[] = [];
    marques: Marque[] = [];

    constructor(
        private fb: FormBuilder,
        private vehiculeService: VehiculeService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
        this.modeleForm = this.fb.group({
            nom: ['', Validators.required],
            marqueId: [null, Validators.required],
            categorieId: [null, Validators.required],
            vidangeApresChaque: [10000, Validators.required],
            vidangeApresNbreJours: [180, Validators.required],
            chaineChangeable: [false],
            chaineDistributionApresChaque: [0],
            pneusApresChaque: [0],
            isVisible: [true]
        });
    }

    ngOnInit() {
        this.loadCategories();
        this.loadMarques();
        
        this.modeleId = Number(this.route.snapshot.paramMap.get('id'));
        if (this.modeleId) {
            this.isEditMode = true;
            this.loadModele();
        }
    }

    loadCategories() {
        this.vehiculeService.getActivesCategories().subscribe({
            next: (data: Categorie[]) => {
                this.categories = data;
            },
            error: (error: any) => {
                console.error('Erreur lors du chargement des catégories:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les catégories'
                });
            }
        });
    }

    loadMarques() {
        this.vehiculeService.getActivesMarques().subscribe({
            next: (data: Marque[]) => {
                this.marques = data;
            },
            error: (error: any) => {
                console.error('Erreur lors du chargement des marques:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les marques'
                });
            }
        });
    }

    loadModele() {
        if (this.modeleId) {
            this.vehiculeService.getModeleById(this.modeleId).subscribe({
                next: (modele: Modele) => {
                    this.modeleForm.patchValue({
                        nom: modele.nom,
                        marqueId: modele.marqueId,
                        categorieId: modele.categorieId,
                        vidangeApresChaque: modele.vidangeApresChaque,
                        vidangeApresNbreJours: modele.vidangeApresNbreJours,
                        chaineChangeable: modele.chaineChangeable,
                        chaineDistributionApresChaque: modele.chaineDistributionApresChaque,
                        pneusApresChaque: modele.pneusApresChaque,
                        isVisible: modele.isVisible
                    });
                },
                error: (error: any) => {
                    console.error('Erreur lors du chargement du modèle:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger le modèle'
                    });
                }
            });
        }
    }

    onSubmit() {
        if (this.modeleForm.valid) {
            const formData = new FormData();
            const formValues = this.modeleForm.value;
            
            // Ajouter les données du formulaire à FormData
            Object.keys(formValues).forEach(key => {
                // Conversion des valeurs booléennes en string pour FormData
                if (typeof formValues[key] === 'boolean') {
                    formData.append(key, formValues[key] ? 'true' : 'false');
                } else if (formValues[key] !== null && formValues[key] !== undefined) {
                    formData.append(key, formValues[key]);
                }
            });

            if (this.isEditMode && this.modeleId) {
                this.vehiculeService.updateModele(this.modeleId, formData).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Modèle mis à jour avec succès'
                        });
                        this.router.navigate(['/vehicule/modeles']);
                    },
                    error: (error: any) => {
                        console.error('Erreur lors de la mise à jour:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de mettre à jour le modèle'
                        });
                    }
                });
            } else {
                this.vehiculeService.createModele(formData).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Modèle créé avec succès'
                        });
                        this.router.navigate(['/vehicule/modeles']);
                    },
                    error: (error: any) => {
                        console.error('Erreur lors de la création:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de créer le modèle'
                        });
                    }
                });
            }
        }
    }
} 