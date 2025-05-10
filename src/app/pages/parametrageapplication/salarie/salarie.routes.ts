import { Routes } from '@angular/router';
import { ListsalariesComponent } from './components/list-salaries/list-salaries.component';
import { SalarieFormComponent } from './components/salarie-form/salarie-form.component';
export default [
    { path: 'list-salaries', component: ListsalariesComponent },
   // { path: 'list-salaries-archives', component: ListSalarieArchivesComponent },
    { path: 'view-salarie/:id', component: SalarieFormComponent },
    { path: 'new-salarie', component: SalarieFormComponent },
    { path: 'edit-salarie/:id', component: SalarieFormComponent }
] as Routes; 