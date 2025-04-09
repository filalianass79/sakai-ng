import { Routes } from '@angular/router';
import { CategorieFormComponent } from './components/categorie-form/categorie-form.component';
import { ListCategorieArchivesComponent } from './components/list-categories-archives/list-categories-archives.component';
import { ListcategoriesComponent } from './components/list-categories/list-categories.component';
export default [
    { path: 'list-categories', component: ListcategoriesComponent },
    { path: 'list-categories-archives', component: ListCategorieArchivesComponent },
    { path: 'view-categorie/:id', component: CategorieFormComponent },
    { path: 'new-categorie', component: CategorieFormComponent },
    { path: 'edit-categorie/:id', component: CategorieFormComponent }
] as Routes; 