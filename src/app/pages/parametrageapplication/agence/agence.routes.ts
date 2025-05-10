import { Routes } from '@angular/router';
import { AgenceFormComponent } from './components/agences-form/agence-form.component';
import { ListagencesComponent } from './components/list-agences/list-agences.component';
import { ListAgenceArchivesComponent } from './components/list-agences-archives/list-agences-archives.component';
export default [
    { path: 'list-agences', component: ListagencesComponent },
    { path: 'list-agences-archives', component: ListAgenceArchivesComponent },
    { path: 'view-agence/:id', component: AgenceFormComponent },
    { path: 'new-agence', component: AgenceFormComponent },
    { path: 'edit-agence/:id', component: AgenceFormComponent }
] as Routes; 