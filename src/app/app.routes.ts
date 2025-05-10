import { Routes } from '@angular/router';
import { CarteGriseComponent } from './pages/siteweb/components/carte-grise/carte-grise.component';

export const routes: Routes = [
  {
    path: 'carte-grise',
    component: CarteGriseComponent
  },
  {
    path: 'gestion-reservations',
    loadComponent: () => import('./pages/siteweb/components/gestion-reservations/gestion-reservations.component')
      .then(m => m.GestionReservationsComponent)
  },
]; 