import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Demarrage } from './app/pages/siteweb/demarrage';
import { AuthGuard } from './app/pages/auth/core/guards/auth.guard';
import { AuthGuardLoad } from './app/pages/auth/core/guards/auth.guards.load';
import { ReservationFormComponent } from './app/pages/reservation/components/reservation-form/reservation-form.component';
import { CarteGriseComponent } from './app/pages/siteweb/components/carte-grise/carte-grise.component';
import { NosAgencesComponent } from './app/pages/siteweb/components/nos-agences/nos-agences.component';
import { NosVehiculesComponent } from './app/pages/siteweb/components/nos-vehicules/nos-vehicules.component';
export const appRoutes: Routes = [
    { path: '', redirectTo: '/demarrage', pathMatch: 'full' },
   
    {
        path: 'dashboard',
        component: AppLayout,//,canActivate: [AuthGuard],data: { roles: ['ROLE_ADMIN']}
        children: [
            { path: '', component: Dashboard },
            { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
            { path: 'users', loadChildren: () => import('./app/pages/user/auth.routes') },
            { path: 'societes', loadChildren: () => import('./app/pages/societe/societe.routes') },
            { path: 'companies', loadChildren: () => import('./app/pages/company/company.routes') },
            { path: 'gammes', loadChildren: () => import('./app/pages/gamme/gamme.routes') },
            { path: 'marques', loadChildren: () => import('./app/pages/marque/marque.routes') },
            { path: 'categories', loadChildren: () => import('./app/pages/categorie/categorie.routes') },
            { path: 'vehicules', loadChildren: () => import('./app/pages/vehicule/vehicule.routes') },
            { path: 'modeles', loadChildren: () => import('./app/pages/modele/modele.routes') },
            { path: 'payment', loadChildren: () => import('./app/pages/payment/payment.routes')},
            { path: 'ocr', loadChildren: () => import('./app/pages/ocr/ocr.routes') },
            { path: 'carte-grise', component: CarteGriseComponent },
            { path: 'reservations', loadChildren: () => import('./app/pages/reservation/reservation.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'parametragesiteweb', loadChildren: () => import('./app/pages/parametragesiteweb/parametragesiteweb.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'reservation', component: ReservationFormComponent },
    { path: 'demarrage', component: Demarrage },
    { path: 'parcauto', component: Demarrage, data: { showParcauto: true } },
    { path: 'nos-agences', component: NosAgencesComponent },
    { path: 'nos-vehicules', component: NosVehiculesComponent },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

