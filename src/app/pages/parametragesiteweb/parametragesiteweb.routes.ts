import { Routes } from '@angular/router';
import { SaisonsComponent } from './components/saisons/saisons.component';
import { TarifsComponent } from './components/tarifs/tarifs.component';
export default [

               { path: 'saisons', component: SaisonsComponent },
               { path: 'tarifs', component: TarifsComponent },
] as Routes; 