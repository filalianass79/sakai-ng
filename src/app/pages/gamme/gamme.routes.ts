import { Routes } from '@angular/router';
import { GammeFormComponent } from './components/gamme-form/gamme-form.component';
import { ListgammesComponent } from './components/list-gammes/list-gammes.component';
import { ListGammeArchivesComponent } from './components/list-gamme-archives/list-gamme-archives.component';
export default [
    { path: 'list-gammes', component: ListgammesComponent },
    { path: 'list-gammes-archives', component: ListGammeArchivesComponent },
    { path: 'view-gamme/:id', component: GammeFormComponent },
    { path: 'new-gamme', component: GammeFormComponent },
    { path: 'edit-gamme/:id', component: GammeFormComponent }
] as Routes; 