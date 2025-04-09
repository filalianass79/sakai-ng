import { Routes } from '@angular/router';
import { CompanyFormComponent } from './components/company-form/company-form.component';
import { ListCompaniesComponent } from './components/list-companies/list-companies.component';
import { ListCompanyArchivesComponent } from './components/list-company-archives/list-company-archives.component';
export default [
    { path: 'list-companies', component: ListCompaniesComponent },
    { path: 'list-companies-archives', component: ListCompanyArchivesComponent },
    { path: 'view-company/:id', component: CompanyFormComponent },
    { path: 'new-company', component: CompanyFormComponent },
    { path: 'edit-company/:id', component: CompanyFormComponent }
] as Routes; 