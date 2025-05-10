import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
        //gestion RH
            {
                label: 'Gestion RH',
                items: [
                        { label: 'Salariés', icon: 'pi pi-fw pi-user', routerLink: ['/dashboard/parametrageapplications/salaries/list-salaries'] }
                ]
            },   




            {
                label: 'UI Components',
                items: [
                    { label: 'Ocr', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/ocr/ocr'] },
                    { label: 'Payment', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/payment/payment-demo'] },
                    { label: 'Payment Form', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/payment/payment-form'] },
                    { label: 'Card Form', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/payment/card-form'] },
                    { label: 'Card Management', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/payment/card-management'] },
                    { label: 'Register', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/auth/register'] },
                    { label: 'Profil', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/auth/profile'] },
                    { label: 'Edit Profile', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/auth/profile/edit'] },
                    { label: 'Change Password', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/auth/profile/change-password'] },
                    { label: 'Reservation', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/reservations/list-reservation'] }
                    ]
            },                     
            {
                        label: 'Paramétrage',
                        items: [
                               { label: 'Paramétrage',
                                icon: 'pi pi-fw pi-user',
                                items: [
                                    {
                                        label: 'Société',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/societes/list-societes']
                                    },
                                    {
                                        label: 'Utilisateur',
                                        icon: 'pi pi-fw pi-times-circle',
                                        routerLink: ['/dashboard/users/list-users']
                                    },
                                    {
                                        label: 'Companies',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/companies/list-companies']
                                    },
                                    {
                                        label: 'Gammes',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/gammes/list-gammes']
                                    },
                                    {
                                        label: 'Marques',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/marques/list-marques']
                                    },
                                    {
                                        label: 'Categories',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/categories/list-categories']
                                    },
                                    {
                                        label: 'Modeles',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/dashboard/modeles/list-modeles']
                                    }

                                ]
                                },
                                { label: 'Sociétés supprimées', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/societes/list-societes-archives'] },
                                { label: 'Entreprises supprimées', icon: 'pi pi-fw pi-id-card', routerLink: ['/dashboard/companies/list-companies-archives'] }
                                ]
            },


            
            {
                label: 'Véhicules',
                items: [
                       { label: 'Marques',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Marques',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/dashboard/vehicules/list-marques']
                            },
                            {
                                label: 'Modeles',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/dashboard/vehicules/list-modeles']
                            },
                            {
                                label: 'Categories',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/dashboard/vehicules/list-categories']
                            }

                        ]
                        },
                    ]
    },
              
             
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Paramétrage Site Web',
                items: [
                    {
                        label: 'Définir les saisons',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametragesiteweb/saisons']
                    },
                    {
                        label: 'définir les tarifs',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametragesiteweb/tarifs']
                    },
                    {
                        label: 'les choisir les modèles',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametragesiteweb/modeles']
                    },
                    {
                        label: 'carte grise',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/carte-grise']
                    }
                ]
            },
            {
                label: 'Paramétrage Applications',
                items: [
                    {
                        label: 'Gestion des agences',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametrageapplications/agences']
                    },
                    {
                        label: 'définir les tarifs',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametragesiteweb/tarifs']
                    },
                    {
                        label: 'les choisir les modèles',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/parametragesiteweb/modeles']
                    },
                    {
                        label: 'carte grise',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/dashboard/carte-grise']
                    }
                ]
            },
        ]
    }
}

