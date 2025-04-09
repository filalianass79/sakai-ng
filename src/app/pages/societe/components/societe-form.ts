import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudimageHComponent } from '../../shared/crud-image/crudimageH.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
      import { Textarea } from 'primeng/inputtextarea';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SocieteService } from '../services/societe.service';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-societe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudimageHComponent,
    ButtonModule,
    CardModule,
    InputTextModule,
    Textarea,
    InputMaskModule,
    CalendarModule,
    DropdownModule,
    PanelModule,
    TooltipModule,
    ToastModule,
    FileUploadModule,
    HttpClientModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="bg-surface-50 dark:bg-surface-900 p-1 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <p-card styleClass="shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div>
              <button pButton 
                icon="pi pi-arrow-left" 
                class="p-button-text p-button-rounded mr-12" 
                (click)="goBack()"
                pTooltip="Retour à la liste"
              ></button>
              <h1 class="text-primary-900 dark:text-primary-200 font-bold text-3xl lg:text-3xl inline-block">
                {{isEditMode ? 'Modifier' : 'Ajouter'}} une société
              </h1>
            </div>
          </div>
          
          <form [formGroup]="societeForm" (ngSubmit)="onSubmit()" class="space-y-1">
            <p-panel  styleClass="mb-1">
              <ng-template pTemplate="header">
                <span class="text-primary-800 dark:text-primary-300 font-medium text-3xl">Informations générales</span>
              </ng-template>
              <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-3">
                    <div class="card p-1">
                        <app-crudimageH
                           
                            (imageNameFromChild)="updateNameImage($event)"
                            [imageNameVideFromParent]="imageNameVideFromParent"
                            [imageNameFromParent]="imageName"
                        ></app-crudimageH>
                    </div>
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-9">
                    <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                    <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-12">
                      <label for="raisonSocial" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Raison Sociale *</label>
                      <input id="raisonSocial" type="text" pInputText formControlName="raisonSocial" class="w-full p-inputtext-lg">
                      <small *ngIf="societeForm.get('raisonSocial')?.hasError('required') && societeForm.get('raisonSocial')?.touched" 
                            class="p-error block mt-2">La raison sociale est requise</small>
                    </div>

                    <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-12">
                      <label for="activite" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Activité *</label>
                      <input id="activite" type="text" pInputText formControlName="activite" class="w-full p-inputtext-lg">
                      <small *ngIf="societeForm.get('activite')?.hasError('required') && societeForm.get('activite')?.touched" 
                            class="p-error block mt-2">L'activité est requise</small>
                    </div>

                    <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-6">
                      <label for="formeJuridique" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Forme Juridique *</label>
                      <p-dropdown id="formeJuridique" 
                                [options]="formesJuridiques" 
                                formControlName="formeJuridique" 
                                placeholder="Sélectionnez une forme juridique"
                                [style]="{'width':'100%'}" 
                                class="w-full">
                      </p-dropdown>
                      <small *ngIf="societeForm.get('formeJuridique')?.hasError('required') && societeForm.get('formeJuridique')?.touched" 
                            class="p-error block mt-2">La forme juridique est requise</small>
                    </div>

                    <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-6">
                      <label for="dateDeCreation" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Date de Création *</label>
                      <p-calendar id="dateDeCreation" 
                                formControlName="dateDeCreation" 
                                [showIcon]="true" 
                                dateFormat="dd/mm/yy"
                                [style]="{'width':'100%'}"
                                class="w-full">
                      </p-calendar>
                      <small *ngIf="societeForm.get('dateDeCreation')?.hasError('required') && societeForm.get('dateDeCreation')?.touched" 
                            class="p-error block mt-2">La date de création est requise</small>
                    </div>
                    </div>
                </div>

              </div>
            </p-panel>

            <p-panel  styleClass="mb-1">
              <ng-template pTemplate="header">
                <span class="text-primary-700 dark:text-primary-400 font-medium text-3xl">Informations fiscales</span>
              </ng-template>
              <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
              <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="idFiscal" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Identifiant Fiscal</label>
                  <input id="idFiscal" type="text" pInputText formControlName="idFiscal" class="w-full p-inputtext-lg">
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="ice" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">ICE</label>
                  <input id="ice" type="text" pInputText formControlName="ice" class="w-full p-inputtext-lg">
                </div>
                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="taxeProfessionnelle" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Taxe Professionnelle</label>
                  <input id="taxeProfessionnelle" type="text" pInputText formControlName="taxeProfessionnelle" class="w-full p-inputtext-lg">
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="registreDeCommerce" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Registre de Commerce</label>
                  <input id="registreDeCommerce" type="text" pInputText formControlName="registreDeCommerce" class="w-full p-inputtext-lg">
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="villeRegistreDeCommerce" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Ville du RC</label>
                  <input id="villeRegistreDeCommerce" type="text" pInputText formControlName="villeRegistreDeCommerce" class="w-full p-inputtext-lg">
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-4">
                  <label for="cnss" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">CNSS</label>
                  <input id="cnss" type="text" pInputText formControlName="cnss" class="w-full p-inputtext-lg">
                </div>
              </div>
            </p-panel>

            <p-panel styleClass="mb-1">
              <ng-template pTemplate="header">
                <span class="text-primary-700 dark:text-primary-400 font-medium text-3xl">Coordonnées</span>
              </ng-template>
              <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                <div class="col-span-12 md:col-span-8 lg:col-span-9">
                  <label for="adresse" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Adresse *</label>
                  <textarea id="adresse" 
                           pInputTextarea 
                           formControlName="adresse" 
                           [rows]="3" 
                           class="w-full"
                           autoResize="true">
                  </textarea>
                  <small *ngIf="societeForm.get('adresse')?.hasError('required') && societeForm.get('adresse')?.touched" 
                         class="p-error block mt-2">L'adresse est requise</small>
                </div>

                <div class="col-span-12 md:col-span-4 lg:col-span-3">
                  <label for="ville" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Ville *</label>
                  <input id="ville" type="text" pInputText formControlName="ville" class="w-full p-inputtext-lg">
                  <small *ngIf="societeForm.get('ville')?.hasError('required') && societeForm.get('ville')?.touched" 
                         class="p-error block mt-2">La ville est requise</small>
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-6 lg:col-span-6">
                  <label for="email" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Email *</label>
                  <input id="email" type="email" pInputText formControlName="email" class="w-full p-inputtext-lg">
                  <small *ngIf="societeForm.get('email')?.hasError('required') && societeForm.get('email')?.touched" 
                         class="p-error block mt-2">L'email est requis</small>
                  <small *ngIf="societeForm.get('email')?.hasError('email') && societeForm.get('email')?.touched" 
                         class="p-error block mt-2">L'email n'est pas valide</small>
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-4 lg:col-span-2">
                  <label for="fixe" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Téléphone Fixe</label>
                  <p-inputMask id="fixe" 
                              formControlName="fixe" 
                              mask="99-99-99-99-99" 
                              placeholder="05-XX-XX-XX-XX"
                              class="w-full">
                  </p-inputMask>
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-4 lg:col-span-2">
                  <label for="fax" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">Fax</label>
                  <p-inputMask id="fax" 
                              formControlName="fax" 
                              mask="99-99-99-99-99" 
                              placeholder="05-XX-XX-XX-XX"
                              class="w-full">
                  </p-inputMask>
                </div>

                <div class="col-span-12 ms:col-12 md:col-span-4 lg:col-span-2">
                  <label for="gsm" class="text-primary-700 dark:text-primary-400 font-medium text-lg mb-1 block">GSM</label>
                  <p-inputMask id="gsm" 
                              formControlName="gsm" 
                              mask="99-99-99-99-99" 
                              placeholder="06-XX-XX-XX-XX"
                              class="w-full">
                  </p-inputMask>
                </div>
              </div>
            </p-panel>

            <div class="flex justify-end gap-12 mt-12">
              <p-button 
                label="Annuler" 
                icon="pi pi-times" 
                severity="secondary" 
                (onClick)="goBack()"
                [outlined]="true"
                size="large"
              ></p-button>
              <p-button 
                label="Enregistrer" 
                icon="pi pi-check" 
                type="submit" 
                [loading]="loading"
                [disabled]="!societeForm.valid"
                severity="success"
                size="large"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class SocieteForm implements OnInit {
  societeForm: FormGroup;
  isEditMode = false;
  loading = false;
  formesJuridiques = [
    { label: 'SARL', value: 'SARL' },
    { label: 'SA', value: 'SA' },
    { label: 'SAS', value: 'SAS' },
    { label: 'SASU', value: 'SASU' },
    { label: 'Auto-entrepreneur', value: 'AUTO_ENTREPRENEUR' },
    { label: 'Autre', value: 'AUTRE' }
  ];
  uploadedFile: any;
  logoUrl: string | null = null;
  imageName: string = '';
  imageNameVideFromParent:string='assets/images/logo.png';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private societeService: SocieteService,
    private messageService: MessageService
  ) {
    this.societeForm = this.fb.group({
      raisonSocial: ['', Validators.required],
      activite: ['', Validators.required],
      formeJuridique: ['', Validators.required],
      dateDeCreation: ['', Validators.required],
      idFiscal: [''],
      taxeProfessionnelle: [''],
      registreDeCommerce: [''],
      villeRegistreDeCommerce: [''],
      ice: [''],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fixe: [''],
      fax: [''],
      gsm: [''],
      cnss: [''],
      logo: [''],
      papierEnTete: [''],
      enTete: [''],
      piedPage: [''],
      isVisible: [true]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.imageNameVideFromParent='assets/images/logo.png';
    if (id) {
      this.isEditMode = true;
      this.loadSociete(id);
    }
  }

  loadSociete(id: number) {
    this.loading = true;
    this.societeService.getSociete(id).subscribe({
      next: (societe) => {
        this.societeForm.patchValue(societe);
        if (societe.dateDeCreation) {
          this.societeForm.patchValue({
            dateDeCreation: new Date(societe.dateDeCreation)
          });
        }
        
        if (societe.logo) {
          this.imageName = societe.logo;
          this.imageNameVideFromParent = societe.logo;
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les données de la société',
          life: 3000
        });
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.societeForm.valid) {
      this.loading = true;
      const societe = this.societeForm.value;

      const request = this.isEditMode
        ? this.societeService.updateSociete(this.route.snapshot.params['id'], societe)
        : this.societeService.createSociete(societe);

      request.subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Société ${this.isEditMode ? 'modifiée' : 'créée'} avec succès`,
            life: 3000
          });
          this.goBack();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: `Impossible de ${this.isEditMode ? 'modifier' : 'créer'} la société`,
            life: 3000
          });
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.societeForm.controls).forEach(key => {
        const control = this.societeForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/societes/list-societes']);
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
        this.societeForm.patchValue({
          logo: e.target.result.split(',')[1] // Store base64 without prefix
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onRemove() {
    this.logoUrl = null;
    this.societeForm.patchValue({
      logo: null
    });
  }

  updateNameImage(imageName: string) {
    this.imageName = imageName;
    this.societeForm.patchValue({
      logo: imageName
    });
  }

  downloadLogo() {
    if (this.logoUrl) {
      const link = document.createElement('a');
      link.href = this.logoUrl;
      link.download = 'logo.png';
      link.click();
    }
  }
}