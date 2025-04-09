import { Routes } from '@angular/router';
import { ListCategorieComponent } from './components/list-categorie/list-categorie.component';
import { CategorieFormComponent } from './components/categorie-form/categorie-form.component';
import { ListModeleComponent } from './components/list-modele/list-modele.component';
import { ModeleFormComponent } from './components/modele-form/modele-form.component';
import { ListVehiculesComponent } from './components/list-vehicules/list-vehicules.component';
import { VehiculeFormComponent } from './components/vehicule-form/vehicule-form.component';
import { ListVehiculesArchivesComponent } from './components/list-vehicules-archives/list-vehicules-archives.component';
import { ModeleDetailsComponent } from './components/modele-details/modele-details.component';
import { CategorieDetailsComponent } from './components/categorie-details/categorie-details.component';


export default [
  { path: 'list-vehicules', component: ListVehiculesComponent },
  { path: 'list-vehicules-archives', component: ListVehiculesArchivesComponent },
  { path: 'view-vehicule/:id', component: VehiculeFormComponent },
  { path: 'new-vehicule', component: VehiculeFormComponent },
  { path: 'edit-vehicule/:id', component: VehiculeFormComponent },

  { path: 'list-modeles', component: ListModeleComponent },
  { path: 'view-modele/:id', component: ModeleDetailsComponent },
  { path: 'new-modele', component: ModeleFormComponent },
  { path: 'edit-modele/:id', component: ModeleFormComponent }, 
  { path: 'list-categories', component: ListCategorieComponent },
  { path: 'view-categorie/:id', component: CategorieDetailsComponent },
  { path: 'new-categorie', component: CategorieFormComponent },
  { path: 'edit-categorie/:id', component: CategorieFormComponent },
  


] as Routes; 


