import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VehiculeService } from '../../services/vehicule.service';
import { Modele, Vehicule } from '../../models/vehicule.model';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-modele-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    ToastModule,
    DividerModule,
    TagModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './modele-details.component.html',
  styleUrls: ['./modele-details.component.scss']
})
export class ModeleDetailsComponent implements OnInit {
  modele!: Modele;
  vehicules: Vehicule[] = [];
  loading = true;
  loadingVehicules = false;

  constructor(
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadModele(+id);
    } else {
      this.router.navigate(['/dashboard/vehicules/modeles']);
    }
  }

  loadModele(id: number): void {
    this.loading = true;
    this.vehiculeService.getModeleById(id).subscribe({
      next: (data) => {
        this.modele = data;
        this.loading = false;
        this.loadVehiculesByModele(id);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du modèle', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails du modèle'
        });
        this.loading = false;
        this.router.navigate(['/dashboard/vehicules/modeles']);
      }
    });
  }

  loadVehiculesByModele(modeleId: number): void {
    this.loadingVehicules = true;
    this.vehiculeService.getVehiculesByModele(modeleId).subscribe({
      next: (data) => {
        this.vehicules = data;
        this.loadingVehicules = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des véhicules', error);
        this.loadingVehicules = false;
      }
    });
  }

  editModele(): void {
    this.router.navigate(['/dashboard/vehicules/edit-modele', this.modele.id]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/vehicules/modeles']);
  }

  viewMarque(): void {
    this.router.navigate(['/dashboard/vehicules/view-marque', this.modele.marqueId]);
  }

  viewCategorie(): void {
    this.router.navigate(['/dashboard/vehicules/view-categorie', this.modele.categorieId]);
  }

  viewVehicule(vehicule: Vehicule): void {
    this.router.navigate(['/dashboard/vehicules/view-vehicule', vehicule.id]);
  }
} 