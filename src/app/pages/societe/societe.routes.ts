import { Routes } from '@angular/router';
import { ListSocietes } from './components/list-societes';
import { SocieteForm } from './components/societe-form';
import { ListSocietesArchives } from './components/list-societes-archives';

export default [
    { path: 'list-societes', component: ListSocietes },
    { path: 'list-societes-archives', component: ListSocietesArchives },

    { path: 'new-societe', component: SocieteForm },
    { path: 'edit-societe/:id', component: SocieteForm }
] as Routes; 