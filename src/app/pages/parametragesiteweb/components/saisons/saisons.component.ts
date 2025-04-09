import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { SaisonService } from '../../services/saison.service';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { Saison } from '../../models/saison';

@Component({
  selector: 'app-saisons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    InputSwitchModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <div class="flex justify-between align-items-center mb-4">
        <h2>Gestion des Saisons</h2>
        <p-button label="Nouvelle Saison" icon="pi pi-plus" (click)="showDialog()"></p-button>
      </div>

      <p-table [value]="saisons" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
        responsiveLayout="scroll" currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} saisons"
        [rowsPerPageOptions]="[10,25,50]">
        <ng-template pTemplate="header">
          <tr>
            <th>Nom</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Coefficient</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-saison>
          <tr>
            <td>{{saison.nom}}</td>
            <td>{{saison.dateDebut | date:'dd/MM/yyyy'}}</td>
            <td>{{saison.dateFin | date:'dd/MM/yyyy'}}</td>
            <td>{{saison.coefficient}}</td>
           
            <td>
              <p-button icon="pi pi-pencil" class="p-button-rounded p-button-text mr-2"
                (click)="editSaison(saison)"></p-button>
              <p-button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger"
                (click)="deleteSaison(saison.id)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Modifier la Saison' : 'Nouvelle Saison'"
      [modal]="true" [style]="{width: '450px'}" [draggable]="false" [resizable]="false">
      <form [formGroup]="saisonForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="nom">Nom</label>
          <input id="nom" type="text" pInputText formControlName="nom">
        </div>

       

        <div class="field">
                      <label for="dateDebut" class="text-primary-800 dark:text-primary-400 font-medium mb-2 block">Date de début *</label>
                      <p-datepicker id="dateDebut" 
                                formControlName="dateDebut" 
                                dateFormat="dd/mm/yy"
                                [style]="{'width':'100%'}"
                                showIcon
                                iconDisplay="input"
                                class="w-full">
                      </p-datepicker>
                          <small *ngIf="saisonForm.get('dateDebut')?.hasError('required') && saisonForm.get('dateDebut')?.touched" 
                             class="p-error block mt-1">La date de création est requise</small>
                    </div>


                    <div class="field">
                      <label for="dateFin" class="text-primary-800 dark:text-primary-400 font-medium mb-2 block">Date de fin *</label>
                      <p-datepicker id="dateFin" 
                                formControlName="dateFin" 
                                dateFormat="dd/mm/yy"
                                [style]="{'width':'100%'}"
                                showIcon
                                iconDisplay="input"
                                class="w-full">
                      </p-datepicker>
                      <small *ngIf="saisonForm.get('dateFin')?.hasError('required') && saisonForm.get('dateFin')?.touched" 
                             class="p-error block mt-1">La date de fin est requise</small>
                    </div>


        

        <div class="field">
          <label for="coefficient">Coefficient</label>
          <p-inputNumber id="coefficient" formControlName="coefficient" [minFractionDigits]="2"
            [maxFractionDigits]="2"></p-inputNumber>
        </div>

        <div *ngIf="errorMessage" class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          {{errorMessage}}
        </div>
        
        <div class="flex justify-end mt-4">
          <p-button type="submit" label="Enregistrer" [disabled]="!saisonForm.valid"></p-button>
        </div>
      </form>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
    .card {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .field {
      margin-bottom: 1rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .field-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-inputnumber,
    :host ::ng-deep .p-datePicker {
      width: 100%;
    }

    :host ::ng-deep .p-dialog-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-button-text {
      padding: 0.5rem;
    }

    .error-message {
      background-color: #fff3f3;
      border: 1px solid #ffcdd2;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .error-message i {
      font-size: 1.2rem;
    }
  `]
})
export class SaisonsComponent implements OnInit {
  saisons: Saison[] = [];
  dialogVisible = false;
  isEdit = false;
  currentSaisonId: number | null = null;
  saisonForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private saisonService: SaisonService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.saisonForm = this.fb.group({
      nom: ['', Validators.required],
      dateDebut: [null, Validators.required],
      dateFin: [null, Validators.required],
      coefficient: [1, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadSaisons();
  }

  loadSaisons() {
    this.saisonService.getActivesSaisons().subscribe({
      next: (data) => {
        this.saisons = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des saisons'
        });
      }
    });
  }

  showDialog() {
    this.isEdit = false;
    this.currentSaisonId = null;
    this.errorMessage = '';
    this.saisonForm.reset({
      coefficient: 1
    });
    this.dialogVisible = true;
  }

  editSaison(saison: Saison) {
    this.isEdit = true;
    this.currentSaisonId = saison.id;
    this.errorMessage = '';
    this.saisonForm.patchValue({
      nom: saison.nom,
      dateDebut: new Date(saison.dateDebut),
      dateFin: new Date(saison.dateFin),
      coefficient: saison.coefficient,
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    if (this.saisonForm.valid) {
      this.errorMessage = '';
      const formData = this.saisonForm.value;
    
      // Préparer les données de la saison
      const saisonData: Saison = {
        ...formData,
        currentUser: (JSON.parse(localStorage.getItem('currentUser') || '{}')).username
      };

      if (this.isEdit && this.currentSaisonId) {
        this.saisonService.updateSaison(this.currentSaisonId, saisonData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Saison mise à jour avec succès'
            });
            this.dialogVisible = false;
            this.loadSaisons();
          },
          error: (error) => {
            if (error.error?.message === "Une saison existe déjà pour cette période") {
              this.errorMessage = error.error.details || "Une saison existe déjà pour cette période. Veuillez ajuster les dates.";
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur de chevauchement',
                detail: this.errorMessage,
                sticky: true
              });
            } else {
              this.errorMessage = error.error?.details || 'Erreur lors de la mise à jour de la saison';
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: this.errorMessage
              });
            }
          }
        });
      } else {
        this.saisonService.createSaison(saisonData).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Saison créée avec succès'
            });
            this.dialogVisible = false;
            this.loadSaisons();
          },
          error: (error) => {
            if (error.error?.message === "Une saison existe déjà pour cette période") {
              this.errorMessage = error.error.details || "Une saison existe déjà pour cette période. Veuillez ajuster les dates.";
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur de chevauchement',
                detail: this.errorMessage,
                sticky: true
              });
            } else {
              this.errorMessage = error.error?.details || 'Erreur lors de la création de la saison';
              this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: this.errorMessage
              });
            }
          }
        });
      }
    }
  }

  deleteSaison(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) {
      this.saisonService.deleteSaison(id, (JSON.parse(localStorage.getItem('currentUser') || '{}')).username).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Saison supprimée avec succès'
          });
          this.loadSaisons();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression de la saison'
          });
        }
      });
    }
  }
} 