import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VehiculeService } from '../../services/vehicule.service';
import { Vehicule } from '../../models/vehicule.model';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-vehicule-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    ToastModule,
    DividerModule,
    TagModule
  ],
  providers: [MessageService],
  templateUrl: './vehicule-details.component.html',
  styleUrls: ['./vehicule-details.component.scss']
})
export class VehiculeDetailsComponent implements OnInit {
  vehicule!: Vehicule;
  loading = true;

  constructor(
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicule(+id);
    } else {
      this.router.navigate(['/dashboard/vehicules/list-vehicules']);
    }
  }

  loadVehicule(id: number): void {
    this.loading = true;
    this.vehiculeService.getVehiculeById(id).subscribe({
      next: (data) => {
        this.vehicule = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du véhicule', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails du véhicule'
        });
        this.loading = false;
        this.router.navigate(['/dashboard/vehicules/list-vehicules']);
      }
    });
  }

  editVehicule(): void {
    this.router.navigate(['/dashboard/vehicules/edit-vehicule', this.vehicule.id]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/vehicules/list-vehicules']);
  }

  getSeverityForVendu(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    return this.vehicule.vendu ? 'warn' : 'success';
  }

  getSeverityForProvisoire(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    return this.vehicule.provisoire ? 'warn' : 'success';
  }
} 