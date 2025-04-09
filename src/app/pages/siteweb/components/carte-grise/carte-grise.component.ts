import { Component, EventEmitter, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import * as Tesseract from 'tesseract.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-carte-grise',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FileUploadModule,
    ProgressBarModule,
    CardModule,
    ToastModule,
    DividerModule,
    InputNumberModule,
    TabViewModule,
    InputMaskModule,
    CalendarModule,
    TooltipModule
  ],
  providers: [MessageService],
  template: `
    <div class="carte-grise-container">
      <h2 class="titre-principal">Informations Carte Grise</h2>
      
      <p-tabView>
        <!-- Panel 1: Carte Grise Recto -->
        <p-tabPanel header="Recto">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-5">
              <div class="ocr-section p-4">
                <h3>Télécharger le recto de la carte grise</h3>
                
                <p-fileUpload
                  #fileUploadRecto
                  [showUploadButton]="false"
                  [showCancelButton]="false"
                  (onSelect)="onFileSelectRecto($event)"
                  [maxFileSize]="5000000"
                  accept="image/*"
                  [style]="{'width': '100%'}"
                  chooseLabel="Choisir une image">
                  <ng-template pTemplate="content">
                    <div *ngIf="imagePreviewUrlRecto" class="preview-container mt-4">
                      <div class="orientation-controls mb-2 flex justify-center gap-2">
                        <p-button 
                          [outlined]="!isPortraitRecto" 
                          (onClick)="setOrientationRecto('portrait')" 
                          icon="pi pi-mobile" 
                          pTooltip="Mode Portrait"
                          [class.active-orientation]="isPortraitRecto">
                        </p-button>
                        <p-button 
                          [outlined]="isPortraitRecto" 
                          (onClick)="setOrientationRecto('landscape')" 
                          icon="pi pi-desktop" 
                          pTooltip="Mode Paysage"
                          [class.active-orientation]="!isPortraitRecto">
                        </p-button>
                      </div>
                      <canvas #imageCanvasRecto class="w-full" 
                        [style.transform]="'rotate(' + currentRotationRecto + 'deg)'"
                        [class.portrait]="isPortraitRecto"
                        [class.landscape]="!isPortraitRecto">
                      </canvas>
                      <div class="flex justify-center gap-2 mt-2">
                        <p-button icon="pi pi-refresh" (onClick)="rotateImageRecto(90)" pTooltip="Rotation 90°"></p-button>
                        <p-button icon="pi pi-undo" (onClick)="rotateImageRecto(270)" pTooltip="Rotation -90°"></p-button>
                      </div>
                    </div>
                    <p-progressBar *ngIf="processingRecto" [value]="progressValueRecto" [showValue]="true"></p-progressBar>
                  </ng-template>
                </p-fileUpload>

                <div class="flex gap-2 mt-4" *ngIf="uploadedFileRecto">
                  <p-button label="Extraire le texte" icon="pi pi-search" (onClick)="processRecto()"></p-button>
                  <p-button label="Réinitialiser" icon="pi pi-trash" (onClick)="clearRecto()"></p-button>
                </div>
              </div>
            </div>
            
            <div class="col-span-12 md:col-span-7">
              <form [formGroup]="rectoForm" class="p-4 form-carte-grise">
                <h3>Informations Recto</h3>
                
                <div class="formgrid grid grid-cols-12 gap-4">
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="marque">Marque</label>
                    <input id="marque" type="text" pInputText formControlName="marque" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="type">Type</label>
                    <input id="type" type="text" pInputText formControlName="type" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="genre">Genre</label>
                    <input id="genre" type="text" pInputText formControlName="genre" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="modele">Modèle</label>
                    <input id="modele" type="text" pInputText formControlName="modele" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="typeCarburant">Type carburant</label>
                    <input id="typeCarburant" type="text" pInputText formControlName="typeCarburant" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="numeroChassis">N° du chassis</label>
                    <input id="numeroChassis" type="text" pInputText formControlName="numeroChassis" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="nombreCylindres">Nombre de cylindres</label>
                    <p-inputNumber id="nombreCylindres" formControlName="nombreCylindres" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="puissanceFiscale">Puissance fiscale</label>
                    <p-inputNumber id="puissanceFiscale" formControlName="puissanceFiscale" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="nombrePlaces">Nombre de places</label>
                    <p-inputNumber id="nombrePlaces" formControlName="nombrePlaces" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="ptac">P.T.A.C.</label>
                    <p-inputNumber id="ptac" formControlName="ptac" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="poidsVide">Poids à vide</label>
                    <p-inputNumber id="poidsVide" formControlName="poidsVide" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="ptmct">P.T.M.C.T.</label>
                    <p-inputNumber id="ptmct" formControlName="ptmct" [showButtons]="false" class="w-full"></p-inputNumber>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </p-tabPanel>
        
        <!-- Panel 2: Carte Grise Verso -->
        <p-tabPanel header="Verso">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-5">
              <div class="ocr-section p-4">
                <h3>Télécharger le verso de la carte grise</h3>
                
                <p-fileUpload
                  #fileUploadVerso
                  [showUploadButton]="false"
                  [showCancelButton]="false"
                  (onSelect)="onFileSelectVerso($event)"
                  [maxFileSize]="5000000"
                  accept="image/*"
                  [style]="{'width': '100%'}"
                  chooseLabel="Choisir une image">
                  <ng-template pTemplate="content">
                    <div *ngIf="imagePreviewUrlVerso" class="preview-container mt-4">
                      <div class="orientation-controls mb-2 flex justify-center gap-2">
                        <p-button 
                          [outlined]="!isPortraitVerso" 
                          (onClick)="setOrientationVerso('portrait')" 
                          icon="pi pi-mobile" 
                          pTooltip="Mode Portrait"
                          [class.active-orientation]="isPortraitVerso">
                        </p-button>
                        <p-button 
                          [outlined]="isPortraitVerso" 
                          (onClick)="setOrientationVerso('landscape')" 
                          icon="pi pi-desktop" 
                          pTooltip="Mode Paysage"
                          [class.active-orientation]="!isPortraitVerso">
                        </p-button>
                      </div>
                      <canvas #imageCanvasVerso class="w-full" 
                        [style.transform]="'rotate(' + currentRotationVerso + 'deg)'"
                        [class.portrait]="isPortraitVerso"
                        [class.landscape]="!isPortraitVerso">
                      </canvas>
                      <div class="flex justify-center gap-2 mt-2">
                        <p-button icon="pi pi-refresh" (onClick)="rotateImageVerso(90)" pTooltip="Rotation 90°"></p-button>
                        <p-button icon="pi pi-undo" (onClick)="rotateImageVerso(270)" pTooltip="Rotation -90°"></p-button>
                      </div>
                    </div>
                    <p-progressBar *ngIf="processingVerso" [value]="progressValueVerso" [showValue]="true"></p-progressBar>
                  </ng-template>
                </p-fileUpload>

                <div class="flex gap-2 mt-4" *ngIf="uploadedFileVerso">
                  <p-button label="Extraire le texte" icon="pi pi-search" (onClick)="processVerso()"></p-button>
                  <p-button label="Réinitialiser" icon="pi pi-trash" (onClick)="clearVerso()"></p-button>
                </div>
              </div>
            </div>
            
            <div class="col-span-12 md:col-span-7">
              <form [formGroup]="versoForm" class="p-4 form-carte-grise">
                <h3>Informations Verso</h3>
                
                <div class="formgrid grid grid-cols-12 gap-4">
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="numeroImmatriculation">Numéro d'immatriculation</label>
                    <input id="numeroImmatriculation" type="text" pInputText formControlName="numeroImmatriculation" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="immatriculationAnterieure">Immatriculation antérieure</label>
                    <input id="immatriculationAnterieure" type="text" pInputText formControlName="immatriculationAnterieure" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="premiereMiseEnCirculation">Première mise en circulation</label>
                    <p-calendar id="premiereMiseEnCirculation" formControlName="premiereMiseEnCirculation" dateFormat="dd/mm/yy" [showIcon]="true" class="w-full"></p-calendar>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="mcAuMaroc">M.C. au Maroc</label>
                    <p-calendar id="mcAuMaroc" formControlName="mcAuMaroc" dateFormat="dd/mm/yy" [showIcon]="true" class="w-full"></p-calendar>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="mutationLe">Mutation le</label>
                    <p-calendar id="mutationLe" formControlName="mutationLe" dateFormat="dd/mm/yy" [showIcon]="true" class="w-full"></p-calendar>
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="usage">Usage</label>
                    <input id="usage" type="text" pInputText formControlName="usage" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-12 lg:col-span-8">
                    <label for="proprietaire">Propriétaire</label>
                    <input id="proprietaire" type="text" pInputText formControlName="proprietaire" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-12 lg:col-span-8">
                    <label for="adresse">Adresse</label>
                    <input id="adresse" type="text" pInputText formControlName="adresse" class="w-full">
                  </div>
                  
                  <div class="field col-span-12 sm:col-span-6 lg:col-span-4">
                    <label for="finValidite">Fin de validité</label>
                    <p-calendar id="finValidite" formControlName="finValidite" dateFormat="dd/mm/yy" [showIcon]="true" class="w-full"></p-calendar>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
      
      <div class="flex justify-end mt-6">
        <p-button label="Valider et Soumettre" icon="pi pi-check" (onClick)="submitForms()" [disabled]="!isFormValid()"></p-button>
      </div>
    </div>

    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
    .carte-grise-container {
      font-family: var(--font-family);
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .titre-principal {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 1.5rem;
      position: relative;
    }
    
    .titre-principal::after {
      content: '';
      display: block;
      width: 80px;
      height: 3px;
      background-color: #ffd700;
      margin: 0.5rem auto;
    }
    
    .ocr-section {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      height: 100%;
    }
    
    .form-carte-grise {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      height: 100%;
    }
    
    h3 {
      color: #2c3e50;
      font-weight: 600;
      font-size: 1.2rem;
      margin-bottom: 1.2rem;
      position: relative;
      display: inline-block;
    }
    
    h3::after {
      content: '';
      display: block;
      width: 40px;
      height: 2px;
      background-color: #ffd700;
      margin-top: 0.3rem;
    }
    
    .preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .preview-container canvas {
      max-width: 100%;
      height: auto;
      transition: transform 0.3s ease;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .preview-container canvas.portrait {
      max-height: 60vh;
      width: auto !important;
    }
    
    .preview-container canvas.landscape {
      max-width: 100%;
      height: auto;
    }
    
    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #4b5563;
    }
    
    .orientation-controls {
      margin-bottom: 1rem;
    }
    
    .active-orientation {
      background-color: #ffd700 !important;
      border-color: #ffd700 !important;
      color: #000 !important;
    }
    
    :host ::ng-deep {
      .p-tabview .p-tabview-nav {
        background: #fff;
        border-bottom: 2px solid #ffd700;
        
        li .p-tabview-nav-link {
          color: #4b5563;
          font-weight: 500;
          &:hover {
            color: #000;
          }
        }
        
        li.p-highlight .p-tabview-nav-link {
          color: #000;
          border-bottom-color: #ffd700;
        }
      }
      
      .p-button {
        &.p-button-outlined {
          &:not(.active-orientation) {
            background-color: transparent;
            color: #000;
            &:hover {
              background-color: rgba(255, 215, 0, 0.1);
            }
          }
        }
      }
      
      .p-inputtext:focus, .p-inputtext.p-filled {
        border-color: #ffd700;
        box-shadow: 0 0 0 1px #ffd700;
      }
      
      .p-calendar:focus-within .p-inputtext {
        border-color: #ffd700;
        box-shadow: 0 0 0 1px #ffd700;
      }
      
      .p-fileupload {
        .p-fileupload-buttonbar {
          background: #fff;
          border-color: #e0e0e0;
        }
        
        .p-fileupload-content {
          background: #fff;
          padding: 1rem;
          border-color: #e0e0e0;
        }
      }
      
      .p-inputnumber:focus-within .p-inputtext {
        border-color: #ffd700;
        box-shadow: 0 0 0 1px #ffd700;
      }
    }
  `]
})
export class CarteGriseComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  
  // Recto
  @ViewChild('fileUploadRecto') fileUploadRecto: any;
  @ViewChild('imageCanvasRecto') imageCanvasRecto!: ElementRef<HTMLCanvasElement>;
  rectoForm: FormGroup;
  uploadedFileRecto: any = null;
  imagePreviewUrlRecto: string | null = null;
  processingRecto = false;
  progressValueRecto = 0;
  extractedTextRecto = '';
  currentRotationRecto = 0;
  isPortraitRecto = true;
  private ctxRecto: CanvasRenderingContext2D | null = null;
  private originalImageRecto: HTMLImageElement | null = null;
  
  // Verso
  @ViewChild('fileUploadVerso') fileUploadVerso: any;
  @ViewChild('imageCanvasVerso') imageCanvasVerso!: ElementRef<HTMLCanvasElement>;
  versoForm: FormGroup;
  uploadedFileVerso: any = null;
  imagePreviewUrlVerso: string | null = null;
  processingVerso = false;
  progressValueVerso = 0;
  extractedTextVerso = '';
  currentRotationVerso = 0;
  isPortraitVerso = true;
  private ctxVerso: CanvasRenderingContext2D | null = null;
  private originalImageVerso: HTMLImageElement | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.rectoForm = this.fb.group({
      marque: [''],
      type: [''],
      genre: [''],
      modele: [''],
      typeCarburant: [''],
      numeroChassis: [''],
      nombreCylindres: [null],
      puissanceFiscale: [null],
      nombrePlaces: [null],
      ptac: [null],
      poidsVide: [null],
      ptmct: [null]
    });
    
    this.versoForm = this.fb.group({
      numeroImmatriculation: [''],
      immatriculationAnterieure: [''],
      premiereMiseEnCirculation: [null],
      mcAuMaroc: [null],
      mutationLe: [null],
      usage: [''],
      proprietaire: [''],
      adresse: [''],
      finValidite: [null]
    });
  }

  ngOnInit() {}

  // MÉTHODES POUR LE RECTO
  onFileSelectRecto(event: any) {
    this.uploadedFileRecto = event.files[0];
    this.previewFileRecto();
  }

  previewFileRecto() {
    if (!this.uploadedFileRecto) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrlRecto = e.target.result;
      this.loadImageToCanvasRecto(e.target.result);
    };
    reader.readAsDataURL(this.uploadedFileRecto);
  }

  loadImageToCanvasRecto(dataUrl: string) {
    this.originalImageRecto = new Image();
    this.originalImageRecto.onload = () => {
      if (!this.imageCanvasRecto) return;
      
      const canvas = this.imageCanvasRecto.nativeElement;
      this.ctxRecto = canvas.getContext('2d');
      
      if (!this.ctxRecto || !this.originalImageRecto) return;
      
      // Détecter automatiquement l'orientation initiale
      this.isPortraitRecto = this.originalImageRecto.height > this.originalImageRecto.width;
      this.adjustCanvasForOrientationRecto();
    };
    this.originalImageRecto.src = dataUrl;
  }

  setOrientationRecto(orientation: 'portrait' | 'landscape') {
    this.isPortraitRecto = orientation === 'portrait';
    if (this.originalImageRecto) {
      this.adjustCanvasForOrientationRecto();
    }
  }

  adjustCanvasForOrientationRecto() {
    if (!this.originalImageRecto || !this.imageCanvasRecto || !this.ctxRecto) return;

    const canvas = this.imageCanvasRecto.nativeElement;
    const ctx = this.ctxRecto;

    // Calculate the aspect ratio of the image
    const aspectRatio = this.originalImageRecto.width / this.originalImageRecto.height;

    // Set canvas dimensions to match the image dimensions
    if (this.isPortraitRecto) {
      canvas.height = Math.min(800, this.originalImageRecto.height);
      canvas.width = canvas.height * aspectRatio;
    } else {
      canvas.width = Math.min(800, this.originalImageRecto.width);
      canvas.height = canvas.width / aspectRatio;
    }

    // Clear and draw the image on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.currentRotationRecto * Math.PI) / 180);
    ctx.drawImage(
      this.originalImageRecto,
      -this.originalImageRecto.width / 2,
      -this.originalImageRecto.height / 2,
      this.originalImageRecto.width,
      this.originalImageRecto.height
    );
    ctx.restore();
  }

  rotateImageRecto(degrees: number) {
    if (!this.originalImageRecto || !this.imageCanvasRecto || !this.ctxRecto) return;

    this.currentRotationRecto = (this.currentRotationRecto + degrees) % 360;
    this.adjustCanvasForOrientationRecto();
  }

  async processRecto() {
    if (!this.uploadedFileRecto) return;

    this.processingRecto = true;
    this.progressValueRecto = 0;

    try {
      // Si l'image a été pivotée, utiliser le canvas
      let imageData: string | Blob = this.uploadedFileRecto;
      if (this.imageCanvasRecto && this.currentRotationRecto !== 0) {
        const blob = await new Promise<Blob | null>((resolve) => {
          this.imageCanvasRecto.nativeElement.toBlob((b) => resolve(b), this.uploadedFileRecto.type);
        });
        if (blob) {
          imageData = blob;
        }
      }

      const result = await Tesseract.recognize(
        imageData,
        'fra',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              this.progressValueRecto = Math.round(m.progress * 100);
            }
          }
        }
      );

      this.extractedTextRecto = this.cleanExtractedText(result.data.text);
      this.extractRectoInformation(this.extractedTextRecto);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Texte extrait avec succès du recto'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de l\'extraction du texte'
      });
    } finally {
      this.processingRecto = false;
    }
  }

  clearRecto() {
    this.uploadedFileRecto = null;
    this.imagePreviewUrlRecto = null;
    this.extractedTextRecto = '';
    this.progressValueRecto = 0;
    this.currentRotationRecto = 0;
    this.isPortraitRecto = true;
    if (this.ctxRecto && this.imageCanvasRecto) {
      this.ctxRecto.clearRect(0, 0, this.imageCanvasRecto.nativeElement.width, this.imageCanvasRecto.nativeElement.height);
    }
    if (this.fileUploadRecto) {
      this.fileUploadRecto.clear();
    }
    // On ne réinitialise pas complètement le formulaire pour permettre la correction manuelle
  }

  cleanExtractedText(text: string): string {
    // Suppression des caractères arabes
    const cleanedText = text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
    
    // Élimination des lignes vides et normalisation des espaces
    return cleanedText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/\s+/g, ' ').trim())
      .join('\n');
  }

  extractRectoInformation(text: string) {
    // Fonction pour nettoyer les valeurs extraites
    const cleanValue = (value: string): string => {
      return value
        .replace(/^[:\-\s]+/, '')
        .replace(/[:\-\s]+$/, '')
        .replace(/[^\w\s\-\.\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    // Extraction du type
    const typeValue = this.extractType(text);
    if (typeValue) {
      this.rectoForm.patchValue({ type: typeValue });
    }

    // Extraction du genre
    const genreValue = this.extractGenre(text);
    if (genreValue) {
      this.rectoForm.patchValue({ genre: genreValue });
    }

    // Extraction du modèle
    const modeleValue = this.extractModele(text);
    if (modeleValue) {
      this.rectoForm.patchValue({ modele: modeleValue });
    }

    // Extraction de la puissance fiscale
    const puissanceFiscaleValue = this.extractPuissanceFiscale(text);
    if (puissanceFiscaleValue !== null) {
      this.rectoForm.patchValue({ puissanceFiscale: puissanceFiscaleValue });
    }

    // Extraction du nombre de cylindres
    const cylindresValue = this.extractCylindres(text);
    if (cylindresValue !== null) {
      this.rectoForm.patchValue({ nombreCylindres: cylindresValue });
    }

    // Extraction de la marque (uniquement la valeur)
    const marquePattern = /(?:Marque|MARQUE|Make|MAKE|Manufacturer)[\s:\-]+([A-Za-z0-9]+)/i;
    const marqueMatch = text.match(marquePattern);
    if (marqueMatch && marqueMatch[1]) {
      this.rectoForm.patchValue({ 
        marque: marqueMatch[1].trim() 
      });
    }

    // Extraction du numéro de chassis (uniquement la valeur)
    const chassisPattern = /(?:N°\s*(?:du\s*)?chassis|Numéro\s*(?:du\s*)?chassis|VIN|CHASSIS|Numéro\s*d\'identification)[\s:\-]+([A-Z0-9]{5,})/i;
    const chassisMatch = text.match(chassisPattern);
    if (chassisMatch && chassisMatch[1]) {
      this.rectoForm.patchValue({ 
        numeroChassis: chassisMatch[1].replace(/[^A-Z0-9]/gi, '').toUpperCase()
      });
    }

    // Patterns pour les autres champs
    const patterns = {
      typeCarburant: '(?:Type\\s+(?:de\\s+)?carburant|TYPE\\s+(?:DE\\s+)?CARBURANT|Carburant|CARBURANT|ENERGIE|Energy)\\s*[:\\-]?\\s*(Diesel|DIESEL|GO|GASOIL|Essence|ESSENCE|SP)',
      nombrePlaces: '(?:Nombre\\s*(?:de\\s*)?places|NB\\s*PLACES|PLACES|Places\\s*assises)\\s*[:\\-]?\\s*(\\d+)',
      ptac: '(?:P\\.?T\\.?A\\.?C|Poids\\s*Total\\s*Autorisé\\s*en\\s*Charge|Masse\\s*en\\s*charge)\\s*[:\\-]?\\s*([\\d\\.]+)(?:\\s*kg)?',
      poidsVide: '(?:Poids\\s*(?:à\\s*)?vide|MASSE\\s*À\\s*VIDE|Masse\\s*à\\s*vide|Tare)\\s*[:\\-]?\\s*([\\d\\.]+)(?:\\s*kg)?',
      ptmct: '(?:P\\.?T\\.?M\\.?C\\.?T|Poids\\s*Total\\s*Maximal\\s*Circulant|Masse\\s*totale)\\s*[:\\-]?\\s*([\\d\\.]+)(?:\\s*kg)?'
    };

    // Extraction avec contexte
    const extractWithContext = (text: string, pattern: string): { match: string, value: string } | null => {
      const regex = new RegExp(pattern, 'i');
      const match = text.match(regex);
      if (!match || !match[1]) return null;
      return { 
        match: match[0],
        value: match[1].trim()
      };
    };

    // Traitement des autres champs
    Object.entries(patterns).forEach(([field, pattern]) => {
      const result = extractWithContext(text, pattern);
      if (result && result.value) {
        const value = result.value;
        
        if (field === 'nombrePlaces') {
          const numericValue = parseInt(value.replace(/\D/g, ''));
          if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 9) {
            this.rectoForm.patchValue({ [field]: numericValue });
          }
        } else if (field === 'ptac' || field === 'poidsVide' || field === 'ptmct') {
          const numericValue = parseFloat(value.replace(/[^\d\.]/g, ''));
          if (!isNaN(numericValue)) {
            this.rectoForm.patchValue({ [field]: numericValue });
          }
        } else if (field === 'typeCarburant') {
          const normalizedValue = value.toLowerCase();
          if (normalizedValue.includes('diesel') || normalizedValue.includes('gasoil') || normalizedValue.includes('go')) {
            this.rectoForm.patchValue({ typeCarburant: 'Diesel' });
          } else if (normalizedValue.includes('essence') || normalizedValue.includes('sp')) {
            this.rectoForm.patchValue({ typeCarburant: 'Essence' });
          } else {
            this.rectoForm.patchValue({ [field]: value });
          }
        } else {
          this.rectoForm.patchValue({ [field]: value });
        }
      }
    });
  }

  // Fonction pour extraire le type avec distinction du type de carburant
  extractType(text: string): string {
    const typePatterns = [
      // Type sans mention de carburant à proximité
      /(?:Type|TYPE)(?![^{]*(?:carburant|CARBURANT|GASOIL|DIESEL|ESSENCE))[\s:\-]+([A-Z0-9][A-Z0-9\-\.]*)/i,
      // Type MINE spécifique
      /TYPE\s*MINE[\s:\-]+([A-Z0-9][A-Z0-9\-\.]*)/i,
      // Type entre parenthèses
      /TYPE[\s:\-]+\(([^\)]+)\)/i,
      // Type suivi d'un code alphanumérique
      /TYPE[\s:\-]+([A-Z0-9]{3,}(?:[\-\.][A-Z0-9]+)*)/i
    ];

    for (const pattern of typePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const fullContext = text.substring(Math.max(0, match.index! - 30), Math.min(text.length, match.index! + match[0].length + 30));
        if (!fullContext.match(/(?:carburant|CARBURANT|GASOIL|DIESEL|ESSENCE)/i)) {
          return match[1]
            .replace(/[^\w\-\.]/g, '')
            .replace(/^[\-\.]+|[\-\.]+$/g, '')
            .toUpperCase();
        }
      }
    }
    return '';
  }

  // Fonction pour extraire le genre avec plus de précision
  extractGenre(text: string): string {
    const genrePatterns = [
      // Format standard avec phrase complète
      /(?:Genre|GENRE|Catégorie|CATEGORIE)[\s:\-]+([A-Z][A-Z0-9\s\-\.]*?)(?=\s*(?:Type|Marque|Modele|$))/i,
      // Format avec description complète incluant les espaces
      /(?:Genre|GENRE)[\s:\-]+((?:[A-Z]+\s?){1,4})/i,
      // Formats spécifiques fréquents
      /(?:Genre|GENRE)[\s:\-]+(CONDUITE\s+INTERIEURE|VOITURE\s+PARTICULIERE|CAMIONNETTE|UTILITAIRE|VEHICULE\s+UTILITAIRE)/i,
      // Format avec code spécifique suivi d'une description
      /GENRE[\s:\-]+([A-Z]{2,}(?:[\-\.][A-Z0-9]+)*(?:\s+[A-Z]+)*)/i
    ];

    for (const pattern of genrePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const genre = match[1].trim().toUpperCase();
        // Normalisation des genres courants - en gardant la phrase complète
        const genreMap: { [key: string]: string } = {
          'VP': 'VOITURE PARTICULIERE',
          'CTTE': 'CAMIONNETTE',
          'VU': 'VEHICULE UTILITAIRE',
          'CI': 'CONDUITE INTERIEURE',
          'CONDUITE': 'CONDUITE INTERIEURE'
        };

        // Vérifier si c'est un code connu à étendre, sinon garder la phrase complète
        return genreMap[genre] || genre;
      }
    }

    // Recherche spécifique pour "CONDUITE INTERIEURE" qui peut être dispersée
    const conduitePattern = /CONDUITE[\s\-]*(?:INTERIEURE|INTERIEUR|INT)/i;
    const conduiteMatch = text.match(conduitePattern);
    if (conduiteMatch) {
      return "CONDUITE INTERIEURE";
    }

    return '';
  }

  // Fonction pour extraire le modèle avec plus de précision
  extractModele(text: string): string {
    const modelePatterns = [
      // Format standard
      /(?:Modele|Modèle|MODELE|MODEL|Version)[\s:\-]+([A-Z0-9][A-Z0-9\s\-\.]*?)(?=\s*(?:Type|Genre|Marque|$))/i,
      // Format avec parenthèses
      /(?:Modele|Modèle|MODELE)[\s:\-]+\(([^\)]+)\)/i,
      // Format spécifique constructeur
      /MODELE[\s:\-]+([A-Z0-9][A-Z0-9\s\-\.]*)/i,
      // Format avec tiret
      /(?:Modele|Modèle|MODELE)[\s:\-]+((?:[A-Z0-9]+[\s\-\.]?)+)/i
    ];

    for (const pattern of modelePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1]
          .replace(/[^\w\s\-\.]/g, '')
          .trim()
          .toUpperCase();
      }
    }
    return '';
  }

  // Fonction pour extraire la puissance fiscale avec plus de précision
  extractPuissanceFiscale(text: string): number | null {
    const puissancePatterns = [
      // Format standard CV fiscaux
      /(?:Puissance\s*fiscale|PUISSANCE\s*FISCALE|Puiss\.?\s*Fisc\.?|P\.F\.|PF)[\s:\-]*(\d+)(?:\s*CV)?/i,
      // Format numérique avec unité
      /(\d+)\s*(?:CV|ch)\s*(?:fiscaux?|FISCAUX?)/i,
      // Format simple avec CV
      /(\d+)\s*CV(?!\s*DIN)/i,
      // Format administratif
      /Puissance\s*administrative[\s:\-]*(\d+)/i
    ];

    for (const pattern of puissancePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const puissance = parseInt(match[1], 10);
        // Validation de la plage de puissance fiscale
        if (puissance >= 1 && puissance <= 100) {
          return puissance;
        }
      }
    }
    return null;
  }

  // Fonction pour extraire le nombre de cylindres avec plus de précision
  extractCylindres(text: string): number | null {
    const cylindrePatterns = [
      // Format standard "Nombre de cylindres: X"
      /(?:Nombre\s*(?:de\s*)?cylindres|NB\s*CYLINDRES|CYL|Cylindrée|CYLINDREE|Cylindres)[\s:\-]*(\d+)(?:\s*(?:cm3|cylindres|CYL))?/i,
      // Format avec unité "X cylindres"
      /(\d+)\s*(?:cylindres?|CYL)/i,
      // Format numérique simple près du mot cylindre
      /cylindr[ée]e?s?\D+(\d+)/i,
      // Format spécifique constructeur
      /CYL\.?\s*[\-:]?\s*(\d+)/i
    ];

    for (const pattern of cylindrePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        // Validation du nombre de cylindres
        if (num >= 2 && num <= 16) {
          return num;
        }
      }
    }
    return null;
  }

  // MÉTHODES POUR LE VERSO
  onFileSelectVerso(event: any) {
    this.uploadedFileVerso = event.files[0];
    this.previewFileVerso();
  }

  previewFileVerso() {
    if (!this.uploadedFileVerso) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrlVerso = e.target.result;
      this.loadImageToCanvasVerso(e.target.result);
    };
    reader.readAsDataURL(this.uploadedFileVerso);
  }

  loadImageToCanvasVerso(dataUrl: string) {
    this.originalImageVerso = new Image();
    this.originalImageVerso.onload = () => {
      if (!this.imageCanvasVerso) return;
      
      const canvas = this.imageCanvasVerso.nativeElement;
      this.ctxVerso = canvas.getContext('2d');
      
      if (!this.ctxVerso || !this.originalImageVerso) return;
      
      // Détecter automatiquement l'orientation initiale
      this.isPortraitVerso = this.originalImageVerso.height > this.originalImageVerso.width;
      this.adjustCanvasForOrientationVerso();
    };
    this.originalImageVerso.src = dataUrl;
  }

  setOrientationVerso(orientation: 'portrait' | 'landscape') {
    this.isPortraitVerso = orientation === 'portrait';
    if (this.originalImageVerso) {
      this.adjustCanvasForOrientationVerso();
    }
  }

  adjustCanvasForOrientationVerso() {
    if (!this.originalImageVerso || !this.imageCanvasVerso || !this.ctxVerso) return;

    const canvas = this.imageCanvasVerso.nativeElement;
    const ctx = this.ctxVerso;

    // Calculate the aspect ratio of the image
    const aspectRatio = this.originalImageVerso.width / this.originalImageVerso.height;

    // Set canvas dimensions to match the image dimensions
    if (this.isPortraitVerso) {
      canvas.height = Math.min(800, this.originalImageVerso.height);
      canvas.width = canvas.height * aspectRatio;
    } else {
      canvas.width = Math.min(800, this.originalImageVerso.width);
      canvas.height = canvas.width / aspectRatio;
    }

    // Clear and draw the image on the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.currentRotationVerso * Math.PI) / 180);
    ctx.drawImage(
      this.originalImageVerso,
      -this.originalImageVerso.width / 2,
      -this.originalImageVerso.height / 2,
      this.originalImageVerso.width,
      this.originalImageVerso.height
    );
    ctx.restore();
  }

  rotateImageVerso(degrees: number) {
    if (!this.originalImageVerso || !this.imageCanvasVerso || !this.ctxVerso) return;

    this.currentRotationVerso = (this.currentRotationVerso + degrees) % 360;
    this.adjustCanvasForOrientationVerso();
  }

  async processVerso() {
    if (!this.uploadedFileVerso) return;

    this.processingVerso = true;
    this.progressValueVerso = 0;

    try {
      // Si l'image a été pivotée, utiliser le canvas
      let imageData: string | Blob = this.uploadedFileVerso;
      if (this.imageCanvasVerso && this.currentRotationVerso !== 0) {
        const blob = await new Promise<Blob | null>((resolve) => {
          this.imageCanvasVerso.nativeElement.toBlob((b) => resolve(b), this.uploadedFileVerso.type);
        });
        if (blob) {
          imageData = blob;
        }
      }

      const result = await Tesseract.recognize(
        imageData,
        'fra',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              this.progressValueVerso = Math.round(m.progress * 100);
            }
          }
        }
      );

      this.extractedTextVerso = this.cleanExtractedText(result.data.text);
      this.extractVersoInformation(this.extractedTextVerso);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Texte extrait avec succès du verso'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Erreur lors de l\'extraction du texte'
      });
    } finally {
      this.processingVerso = false;
    }
  }

  clearVerso() {
    this.uploadedFileVerso = null;
    this.imagePreviewUrlVerso = null;
    this.extractedTextVerso = '';
    this.progressValueVerso = 0;
    this.currentRotationVerso = 0;
    this.isPortraitVerso = true;
    if (this.ctxVerso && this.imageCanvasVerso) {
      this.ctxVerso.clearRect(0, 0, this.imageCanvasVerso.nativeElement.width, this.imageCanvasVerso.nativeElement.height);
    }
    if (this.fileUploadVerso) {
      this.fileUploadVerso.clear();
    }
    // On ne réinitialise pas complètement le formulaire pour permettre la correction manuelle
  }

  extractVersoInformation(text: string) {
    // Extraction des informations du verso
    this.extractImmatriculation(text);
    this.extractDates(text);
    this.extractProprietaire(text);
    this.extractUsage(text);
    this.extractAdresse(text);
  }

  extractImmatriculation(text: string) {
    // Fonction pour formater les immatriculations au format marocain
    const formatImmatMoroc = (immat: string): string => {
      // Nettoyer d'abord (enlever espaces, etc.)
      let clean = immat.replace(/\s+/g, '').toUpperCase();
      
      // Cas 1: Format avec tirets déjà présents (comme 12345-B-15)
      const formatWithDashes = /^(\d{1,6})[-.\s]+([\u0600-\u06FF\u0750-\u077FA-Z])[-.\s]+(\d{1,2})$/i;
      const matchWithDashes = clean.match(formatWithDashes);
      
      if (matchWithDashes) {
        const prefix = matchWithDashes[1].padStart(5, '0').slice(-5);
        let letter = matchWithDashes[2];
        const suffix = matchWithDashes[3].padStart(2, '0');
        
        // Conversion lettres arabes si nécessaire
        letter = this.convertArabicLetter(letter);
        
        return `${prefix}-${letter}-${suffix}`;
      }
      
      // Cas 2: Format sans séparateurs (comme 12345B15)
      const formatWithoutSeparators = /^(\d{1,6})([\u0600-\u06FF\u0750-\u077FA-Z])(\d{1,2})$/i;
      const matchWithoutSeparators = clean.match(formatWithoutSeparators);
      
      if (matchWithoutSeparators) {
        const prefix = matchWithoutSeparators[1].padStart(5, '0').slice(-5);
        let letter = matchWithoutSeparators[2];
        const suffix = matchWithoutSeparators[3].padStart(2, '0');
        
        // Conversion lettres arabes si nécessaire
        letter = this.convertArabicLetter(letter);
        
        return `${prefix}-${letter}-${suffix}`;
      }
      
      // Cas 3: Extraction manuelle (pour les cas où OCR a mal détecté le format)
      // Chercher d'abord 5 chiffres
      const digitMatch = clean.match(/(\d{4,6})/);
      if (digitMatch) {
        const prefix = digitMatch[1].padStart(5, '0').slice(-5);
        
        // Chercher une lettre après les chiffres
        const letterMatch = clean.substring(digitMatch.index! + digitMatch[1].length).match(/[\u0600-\u06FF\u0750-\u077FA-Z]/i);
        if (letterMatch) {
          let letter = letterMatch[0];
          letter = this.convertArabicLetter(letter);
          
          // Chercher 1-2 chiffres après la lettre
          const remainingText = clean.substring(digitMatch.index! + digitMatch[1].length + 1);
          const suffixMatch = remainingText.match(/(\d{1,2})/);
          
          if (suffixMatch) {
            const suffix = suffixMatch[1].padStart(2, '0');
            return `${prefix}-${letter}-${suffix}`;
          }
          
          // Si on ne trouve pas de suffixe, utiliser "01" par défaut
          return `${prefix}-${letter}-01`;
        }
      }
      
      // Si le numéro ressemble à une immatriculation mais sans structure claire
      if (/\d{4,}/.test(clean) && clean.length >= 5) {
        // Essayons de deviner le format le plus probable
        const digits  = clean.match(/\d+/g) || [];
        const letters = clean.match(/[A-Z\u0600-\u06FF\u0750-\u077F]+/gi) || [];
        
        if (digits.length >= 1 && letters.length >= 1) {
          // Prendre les 5 premiers chiffres
          const prefix = digits[0]!.padStart(5, '0').slice(-5);
          
          // Prendre la première lettre
          let letter = letters[0]![0]; // Premier caractère de la première correspondance
          letter = this.convertArabicLetter(letter);
          
          // Prendre les 2 derniers chiffres si disponibles, sinon "01"
          const suffix = digits.length > 1 ? 
            digits[1]!.padStart(2, '0').slice(-2) : 
            (digits[0]!.length > 5 ? digits[0]!.slice(5, 7).padStart(2, '0') : "01");
          
          return `${prefix}-${letter}-${suffix}`;
        }
      }
      
      // Si aucun format ne correspond, retourner tel quel
      return clean;
    };

    // Numéro d'immatriculation - patterns plus larges pour capturer différents formats
    const immatPatterns = [
      // Format standard
      /(?:(?:Numéro|N°)\s*d['']?immatriculation|Immatriculation)[\s:\-]*([A-Z0-9\u0600-\u06FF\u0750-\u077F\-]{5,})/i,
      // Format sans libellé (détection directe du numéro par son format)
      /\b(\d{5}[-.\s]*[\u0600-\u06FF\u0750-\u077FA-Z][-.\s]*\d{2})\b/i,
      // Format sans séparateurs
      /\b(\d{5}[\u0600-\u06FF\u0750-\u077FA-Z]\d{2})\b/i
    ];

    let immatFound = false;
    
    // Essayer tous les patterns jusqu'à trouver une correspondance
    for (const pattern of immatPatterns) {
      const immatMatch = text.match(pattern);
      if (immatMatch && immatMatch[1]) {
        const rawImmat = immatMatch[1].trim();
        const formattedImmat = formatImmatMoroc(rawImmat);
        
        // Vérifier que le format est complet (doit contenir deux tirets)
        if (formattedImmat.split('-').length === 3) {
          this.versoForm.patchValue({ 
            numeroImmatriculation: formattedImmat 
          });
          immatFound = true;
          break;
        }
      }
    }

    // Si aucun format n'est trouvé, chercher les composants séparément
    if (!immatFound) {
      this.extractImmatriculationComponents(text);
    }

    // Immatriculation antérieure - même logique améliorée
    const immatAntPatterns = [
      /(?:Immatriculation\s*antérieure|Ancien\s*numéro)[\s:\-]*([A-Z0-9\u0600-\u06FF\u0750-\u077F\-]{5,})/i,
      /\b(WW\d{6}|[A-Z]{1,2}\d{5,6})\b/i
    ];
    
    for (const pattern of immatAntPatterns) {
      const immatAntMatch = text.match(pattern);
      if (immatAntMatch && immatAntMatch[1]) {
        const rawImmatAnt = immatAntMatch[1].trim();
        let formattedImmatAnt = rawImmatAnt;
        
        // Si c'est un format qui ressemble à 12345-B-15, le formater
        if (/\d{4,6}[-.\s]*[\u0600-\u06FF\u0750-\u077FA-Z][-.\s]*\d{1,2}/.test(rawImmatAnt)) {
          formattedImmatAnt = formatImmatMoroc(rawImmatAnt);
        }
        
        this.versoForm.patchValue({ 
          immatriculationAnterieure: formattedImmatAnt
        });
        break;
      }
    }
  }

  // Méthode utilitaire pour extraire les composants de l'immatriculation séparément
  extractImmatriculationComponents(text: string) {
    // Définir des valeurs par défaut
    let prefix = '12345';
    let letter = 'A';
    let suffix = '01';
    
    // 1. Essayer d'extraire le préfixe (5 chiffres)
    const prefixRegex = /\b(\d{5})\b/;
    const prefixMatch = prefixRegex.exec(text);
    if (prefixMatch && prefixMatch[1]) {
      prefix = prefixMatch[1];
    }
    
    // 2. Essayer d'extraire une lettre
    const letterRegex = /\b([A-Z\u0600-\u06FF\u0750-\u077F])\b/i;
    const letterMatch = letterRegex.exec(text);
    if (letterMatch && letterMatch[1]) {
      letter = this.convertArabicLetter(letterMatch[1]);
    }
    
    // 3. Essayer d'extraire le suffixe (1-2 chiffres)
    const suffixRegex = /\b(\d{1,2})\b/g;
    const allNumbers = [];
    let match;
    
    // Collecter tous les nombres
    while ((match = suffixRegex.exec(text)) !== null) {
      if (match[1] && match[1] !== prefix) {
        allNumbers.push(match[1]);
      }
    }
    
    // Si on a trouvé au moins un nombre différent du préfixe, l'utiliser comme suffixe
    if (allNumbers.length > 0) {
      suffix = allNumbers[0].padStart(2, '0');
    }
    
    // Construire l'immatriculation complète
    const immatriculation = `${prefix}-${letter}-${suffix}`;
    
    // Mettre à jour le formulaire
    this.versoForm.patchValue({ 
      numeroImmatriculation: immatriculation
    });
  }

  // Méthode utilitaire pour convertir des lettres arabes en équivalents latins
  convertArabicLetter(letter: string): string {
    // Mappings communs des lettres arabes vers latines
    const arabicToLatinMap: {[key: string]: string} = {
      'ب': 'B', 'د': 'D', 'ه': 'H', 'ج': 'J', 'و': 'W', 'أ': 'A',
      'ا': 'A', 'ل': 'L', 'م': 'M', 'ن': 'N', 'ط': 'T', 'ر': 'R'
    };
    
    if (arabicToLatinMap[letter]) {
      return arabicToLatinMap[letter];
    } else if (/[\u0600-\u06FF\u0750-\u077F]/.test(letter)) {
      // Si c'est un caractère arabe non mappé, utiliser 'A' par défaut
      return 'A';
    }
    
    // Si c'est déjà une lettre latine, la retourner
    return letter.toUpperCase();
  }

  extractDates(text: string) {
    // Pattern général pour les dates au format JJ/MM/AAAA
    const datePattern = /(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](20\d{2})/g;
    
    // Recherche des dates et des libellés associés
    let match;
    const dates: { [key: string]: Date } = {};
    
    while ((match = datePattern.exec(text)) !== null) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Mois commence à 0 en JS
      const year = parseInt(match[3], 10);
      
      if (day > 0 && day <= 31 && month >= 0 && month < 12) {
        const date = new Date(year, month, day);
        const context = text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 10);
        
        if (context.match(/Première\s*mise\s*en\s*circulation|1(\s*ère)?\s*mise/i)) {
          dates['premiereMiseEnCirculation'] = date;
        } else if (context.match(/MC\s*au\s*Maroc|Maroc/i)) {
          dates['mcAuMaroc'] = date;
        } else if (context.match(/Mutation\s*le|Changement/i)) {
          dates['mutationLe'] = date;
        } else if (context.match(/Fin\s*de\s*validité|Expiration|Validité/i)) {
          dates['finValidite'] = date;
        }
      }
    }
    
    // Mise à jour du formulaire avec les dates extraites
    Object.entries(dates).forEach(([field, value]) => {
      this.versoForm.patchValue({ [field]: value });
    });
  }

  extractProprietaire(text: string) {
    // Pattern pour le propriétaire (souvent en majuscules, peut contenir des sociétés, noms, etc.)
    const proprioPattern = /(?:Propriétaire|PROPRIETAIRE|Titulaire)[\s:\-]*((?:[A-Z\s]+|[A-Z][A-Za-z\s\.]+)(?=\s*(?:Adresse|$)))/i;
    const proprioMatch = text.match(proprioPattern);
    
    if (proprioMatch && proprioMatch[1]) {
      const proprietaire = proprioMatch[1].trim();
      if (proprietaire && proprietaire.length > 2) {
        this.versoForm.patchValue({ proprietaire });
      }
    }
  }

  extractUsage(text: string) {
    // Pattern pour l'usage (vocabulaire spécifique: particulier, professionnel, etc.)
    const usagePattern = /(?:Usage|USAGE|Catégorie)[\s:\-]*((?:Véhicule\s*particulier|VÉHICULE\s*PARTICULIER|particulier|PARTICULIER|professionnel|PROFESSIONNEL))/i;
    const usageMatch = text.match(usagePattern);
    
    if (usageMatch && usageMatch[1]) {
      this.versoForm.patchValue({ 
        usage: usageMatch[1].trim() 
      });
    }
  }

  extractAdresse(text: string) {
    // Pattern pour l'adresse (généralement sur plusieurs lignes après le mot "Adresse")
    const adressePattern = /(?:Adresse|ADRESSE)[\s:\-]*([A-Z0-9\s\.,\-\/]+)(?=\s*(?:Fin|Propriétaire|$))/i;
    const adresseMatch = text.match(adressePattern);
    
    if (adresseMatch && adresseMatch[1]) {
      const adresse = adresseMatch[1]
        .replace(/\s+/g, ' ')
        .trim();
      
      if (adresse && adresse.length > 5) {
        this.versoForm.patchValue({ adresse });
      }
    }
  }

  // MÉTHODES DE VALIDATION ET SOUMISSION
  isFormValid(): boolean {
    // Vérifier si au moins un formulaire a été rempli
    const rectoHasValue = Object.values(this.rectoForm.value).some(val => 
      (val !== null && val !== '' && val !== undefined)
    );
    
    const versoHasValue = Object.values(this.versoForm.value).some(val => 
      (val !== null && val !== '' && val !== undefined)
    );
    
    return rectoHasValue || versoHasValue;
  }

  submitForms() {
    if (!this.isFormValid()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez remplir au moins un champ pour soumettre le formulaire'
      });
      return;
    }

    // Combiner les données des deux formulaires
    const formData = {
      recto: this.rectoForm.value,
      verso: this.versoForm.value
    };

    // Émettre l'événement de soumission
    this.formSubmit.emit(formData);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Formulaire soumis avec succès'
    });
  }
} 