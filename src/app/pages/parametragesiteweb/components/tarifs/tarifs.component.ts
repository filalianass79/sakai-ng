import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TarifLocationService } from '../../services/tarif-location.service';
import { SaisonService } from '../../services/saison.service';
import { MessageService } from 'primeng/api';
import { Saison } from '../../models/saison';
import { Modele } from '../../../modele/models/modele.model';
import { ModeleService } from '../../../modele/services/modele.service';
import { TarifLocation } from '../../models/tarif.location';
import { User } from '../../../auth/core/models/user.model';



@Component({
  selector: 'app-tarifs',
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
    SelectModule,
    InputSwitchModule,
    ToastModule,
    TagModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <div class="flex justify-between align-items-center mb-4">
        <h2>Gestion des Tarifs de Location</h2>
        <p-button label="Nouveau Tarif" icon="pi pi-plus" (click)="showDialog()"></p-button>
      </div>

      <p-table [value]="tarifs" [paginator]="true" [rows]="10" [showCurrentPageReport]="true"
        responsiveLayout="scroll" currentPageReportTemplate="Affichage de {first} à {last} sur {totalRecords} tarifs"
        [rowsPerPageOptions]="[10,25,50]">
        <ng-template pTemplate="header">
          <tr>
            <th>Modèle</th>
            <th>Saison</th>
            <th>Type de Tarif</th>
            <th>Prix</th>
            <th>Durée Min</th>
            <th>Durée Max</th>
           
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-tarif>
          <tr>
            <td>{{tarif.modele.nom}}</td>
            <td>{{getSaisonName(tarif.saison)}}</td>
            <td>
              <p-tag [severity]="getTypeTarifSeverity(tarif.typeTarif)"
                [value]="tarif.typeTarif">
              </p-tag>
            </td>
            <td>{{tarif.prix | currency:'EUR'}}</td>
            <td>{{tarif.dureeMinimale}} jours</td>
            <td>{{tarif.dureeMaximale}} jours</td>
           
            <td>
              <p-button icon="pi pi-pencil" class="p-button-rounded p-button-text mr-2"
                (click)="editTarif(tarif)"></p-button>
              <p-button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger"
                (click)="deleteTarif(tarif.id)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <p-dialog [(visible)]="dialogVisible" [header]="isEdit ? 'Modifier le Tarif' : 'Nouveau Tarif'"
      [modal]="true" [style]="{width: '450px'}" [draggable]="false" [resizable]="false">
      <form [formGroup]="tarifForm" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="modeleId">Modèle</label>
          <p-select id="modeleId" formControlName="modele" [options]="modeles" optionLabel="nom"
            placeholder="Sélectionner un modèle"></p-select>
        </div>

        <div class="field">
          <label for="saisonId">Saison</label>
          <p-select id="saisonId" formControlName="saison" [options]="saisons" optionLabel="nom"
            placeholder="Sélectionner une saison"></p-select>
        </div>

        <div class="field">
          <label for="typeTarif">Type de Tarif</label>
          <p-select id="typeTarif" formControlName="typeTarif" [options]="typeTarifs"
            placeholder="Sélectionner un type"></p-select>
        </div>

        <div class="field">
          <label for="prix">Prix</label>
          <p-inputNumber id="prix" formControlName="prix" [minFractionDigits]="2"
            [maxFractionDigits]="2" mode="currency" currency="EUR"></p-inputNumber>
        </div>

        <div class="field">
          <label for="dureeMinimale">Durée Minimale (jours)</label>
          <p-inputNumber id="dureeMinimale" formControlName="dureeMinimale" [min]="1"></p-inputNumber>
        </div>

        <div class="field">
          <label for="dureeMaximale">Durée Maximale (jours)</label>
          <p-inputNumber id="dureeMaximale" formControlName="dureeMaximale" [min]="1"></p-inputNumber>
        </div>

        <div class="field">
          <label for="conditionsSpeciales">Conditions Spéciales</label>
          <textarea id="conditionsSpeciales" pInputTextarea formControlName="conditionsSpeciales"
            rows="3"></textarea>
        </div>

       
        <div class="flex justify-end mt-4">
          <p-button type="submit" label="Enregistrer" [disabled]="!tarifForm.valid"></p-button>
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
    :host ::ng-deep .p-select,
    :host ::ng-deep .p-inputtextarea {
      width: 100%;
    }

    :host ::ng-deep .p-dialog-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-button-text {
      padding: 0.5rem;
    }
  `]
})
export class TarifsComponent implements OnInit {
  tarifs: TarifLocation[] = [];
  saisons: Saison[] = [];
  modeles: Modele[] = [];
  dialogVisible = false;
  isEdit = false;
  currentTarifId: number | null = null;
  tarifForm: FormGroup;
  currentUser: User | null = null;
  saison: Saison[] = [];
  modele: Modele[] = [];


  typeTarifs = [
    { label: 'Journalier', value: 'JOURNALIER' },
    { label: 'Hebdomadaire', value: 'HEBDOMADAIRE' },
    { label: 'Mensuel', value: 'MENSUEL' }
  ];

  constructor(
    private tarifService: TarifLocationService,
    private saisonService: SaisonService,
    private modeleService: ModeleService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.tarifForm = this.fb.group({
      modele: [null, Validators.required],
      saison: [null, Validators.required],
      typeTarif: [null, Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      dureeMinimale: [1, [Validators.required, Validators.min(1)]],
      dureeMaximale: [1, [Validators.required, Validators.min(1)]],
      conditionsSpeciales: [''],
    });
  }

  ngOnInit() {
    this.loadTarifs();
    this.loadSaisons();
    this.loadModeles();
  }

  loadTarifs() {
    this.tarifService.getActivesTarifLocations().subscribe({
      next: (data) => {
        this.tarifs = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des tarifs'+error.error.message
        });
      }
    });
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

  loadModeles() {
    this.modeleService.getActivesModeles().subscribe({
      next: (data) => {
        this.modeles = data;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des modèles'
        });
      }
    });
  }

  showDialog() {
    this.isEdit = false;
    this.currentTarifId = null;
    this.tarifForm.reset({
      dureeMinimale: 1,
      dureeMaximale: 1,
      prix: 0
    });
    this.dialogVisible = true;
  }

  editTarif(tarif: TarifLocation) {
    this.isEdit = true;
    this.currentTarifId = tarif.id;
    this.tarifForm.patchValue({
      modele: tarif.modele,
      saison: tarif.saison,
      typeTarif: tarif.typeTarif,
      prix: tarif.prix,
      dureeMinimale: tarif.dureeMinimale,
      dureeMaximale: tarif.dureeMaximale,
      conditionsSpeciales: tarif.conditionsSpeciales,
    });
    this.dialogVisible = true;
  }

  onSubmit() {
    if (this.tarifForm.valid) {
      const tarifData = this.tarifForm.value;
      if (this.isEdit && this.currentTarifId) {
        this.tarifService.updateTarifLocation(this.currentTarifId, tarifData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Tarif mis à jour avec succès'
            });
            this.dialogVisible = false;
            this.loadTarifs();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du tarif'
            });
          }
        });
      } else {
        this.tarifService.createTarifLocation(tarifData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Tarif créé avec succès'
            });
            this.dialogVisible = false;
            this.loadTarifs();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création du tarif'
            });
          }
        });
      }
    }
  }

  deleteTarif(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      this.tarifService.archiveTarifLocation(id, this.currentUser?.username || '').subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Tarif supprimé avec succès'
          });
          this.loadTarifs();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression du tarif'
          });
        }
      });
    }
  }

  getSaisonName(saison: Saison): string {
   
    return saison ? saison.nom : 'N/A';
  }

  getTypeTarifSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    switch (type) {
      case 'JOURNALIER':
        return 'info';
      case 'HEBDOMADAIRE':
        return 'warn';
      case 'MENSUEL':
        return 'success';
      default:
        return 'secondary';
    }
  }
} 