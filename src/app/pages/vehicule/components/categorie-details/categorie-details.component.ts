import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VehiculeService } from '../../services/vehicule.service';
import { Categorie, Modele, Vehicule } from '../../models/vehicule.model';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-categorie-details',
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
  templateUrl: './categorie-details.component.html',
  styleUrls: ['./categorie-details.component.scss']
})
export class CategorieDetailsComponent implements OnInit {
  categorie!: Categorie;
  modeles: Modele[] = [];
  vehicules: Vehicule[] = [];
  loading = true;
  loadingModeles = false;
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
      this.loadCategorie(+id);
    } else {
      this.router.navigate(['/dashboard/vehicules/categories']);
    }
  }

  loadCategorie(id: number): void {
    this.loading = true;
    this.vehiculeService.getCategorieById(id).subscribe({
      next: (data) => {
        this.categorie = data;
        this.loading = false;
        this.loadModelesByCategorie(id);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la catégorie', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de la catégorie'
        });
        this.loading = false;
        this.router.navigate(['/dashboard/vehicules/categories']);
      }
    });
  }

  loadModelesByCategorie(categorieId: number): void {
    this.loadingModeles = true;
    this.vehiculeService.getModelesByCategorie(categorieId).subscribe({
      next: (data) => {
        this.modeles = data;
        this.loadingModeles = false;
        this.loadVehiculesByCategorie(categorieId);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modèles', error);
        this.loadingModeles = false;
      }
    });
  }

  loadVehiculesByCategorie(categorieId: number): void {
    this.loadingVehicules = true;
    this.vehiculeService.getVehiculesByCategorie(categorieId).subscribe({
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

  editCategorie(): void {
    this.router.navigate(['/dashboard/vehicules/edit-categorie', this.categorie.id]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/vehicules/categories']);
  }

  viewModele(modele: Modele): void {
    this.router.navigate(['/dashboard/vehicules/view-modele', modele.id]);
  }

  viewVehicule(vehicule: Vehicule): void {
    this.router.navigate(['/dashboard/vehicules/view-vehicule', vehicule.id]);
  }
} 