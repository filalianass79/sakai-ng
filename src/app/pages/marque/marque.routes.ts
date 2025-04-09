import { Routes } from '@angular/router';
import { MarqueFormComponent } from './components/marque-form/marque-form.component';
import { ListMarqueArchivesComponent } from './components/list-marques-archives/list-marques-archives.component';
import { ListmarquesComponent } from './components/list-marques/list-marques.component';
export default [
    { path: 'list-marques', component: ListmarquesComponent },
    { path: 'list-marques-archives', component: ListMarqueArchivesComponent },
    { path: 'view-marque/:id', component: MarqueFormComponent },
    { path: 'new-marque', component: MarqueFormComponent },
    { path: 'edit-marque/:id', component: MarqueFormComponent }
] as Routes; 