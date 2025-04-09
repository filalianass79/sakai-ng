import { Routes } from '@angular/router';
import { ModeleFormComponent } from './components/modele-form/modele-form.component';
import { ListmodelesComponent } from './components/list-modeles/list-modeles.component';

export default [
    { path: 'list-modeles', component: ListmodelesComponent },
    { path: 'view-modele/:id', component: ModeleFormComponent },
    { path: 'new-modele', component: ModeleFormComponent },
    { path: 'edit-modele/:id', component: ModeleFormComponent }
] as Routes; 