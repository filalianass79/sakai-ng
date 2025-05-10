import { Routes } from '@angular/router';
import { SaisonsComponent } from '../parametragesiteweb/components/saisons/saisons.component';
import { ListagencesComponent } from './agence/components/list-agences/list-agences.component';
import { ListsalariesComponent } from './salarie/components/list-salaries/list-salaries.component';
export default [
              { path:'agences', component: ListagencesComponent},
               { path: 'salaries', loadChildren: () => import('./salarie/salarie.routes') }

              
] as Routes; 