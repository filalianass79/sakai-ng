import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { UserService } from '../../../pages/auth/core/services/user.service';
import { User } from '../../../pages/auth/core/models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    <div class="bg-surface-50 dark:bg-surface-900 p-20 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <p-card styleClass="shadow">
            <div class="flex items-center justify-between mb-2">
                    <p-button 
                        icon="pi pi-arrow-left" 
                        rounded 
                        severity="info" 
                        (onClick)="goBack()"
                        pTooltip="Retour"
                    ></p-button>
            </div>

            <div class="flex justify-center mb-12">
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-3xl px-10">Détail Utilisateur</h1>
            </div>

            <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                <div class="col-span-12">
                    <div class="bg-surface-0 dark:bg-surface-900 p-12 rounded-border shadow mb-12">
                        <h3 class="text-xl font-bold mb-12 flex items-center">
                            <i class="pi pi-user mr-2 text-orange-500"></i>
                            Informations personnelles
                        </h3>
                        <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Nom d'utilisateur</label>
                                    </div>
                                    <span>{{ user?.username }}</span>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-envelope mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Email</label>
                                    </div>
                                    <span>{{ user?.email }}</span>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Nom</label>
                                    </div>
                                    <span>{{ user?.lastName }}</span>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Prénom</label>
                                    </div>
                                    <span>{{ user?.firstName }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12">
                    <div class="bg-surface-0 dark:bg-surface-900 p-12 rounded-border shadow">
                        <h3 class="text-xl font-bold mb-12 flex items-center">
                            <i class="pi pi-shield mr-2 text-orange-500"></i>
                            Informations système
                        </h3>
                        <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-tag mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Rôles</label>
                                    </div>
                                    <div class="flex gap-2">
                                        <p-tag *ngFor="let role of user?.roles"
                                               [value]="formatRole(role)"
                                               [severity]="getRoleSeverity(role)">
                                        </p-tag>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-calendar mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Date de création</label>
                                    </div>
                                    <span>{{ user?.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                </div>
                            </div>
                            <div class="col-span-12 md:col-span-4 py-2">
                                <div class="flex flex-col gap-12">
                                    <div class="flex items-center">
                                        <i class="pi pi-clock mr-2 text-surface-500 dark:text-surface-300"></i>
                                        <label class="font-bold text-surface-500 dark:text-surface-300">Dernière modification</label>
                                    </div>
                                    <span>{{ user?.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-20">
                <p-button 
                    icon="pi pi-pencil" 
                    label="Modifier" 
                    severity="warn" 
                    (onClick)="onEditUser()"
                ></p-button>
            </div>
        </p-card>
      </div>
    </div>
  `
})
export class UserDetail implements OnInit {
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(parseInt(id));
    }
  }

  loadUser(id: number) {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger les détails de l\'utilisateur',
          life: 3000
        });
        this.router.navigate(['/dashboard/users']);
      }
    });
  }


  formatRole(role: any): string {
    if (typeof role === 'object' && role !== null) {
      return role.name || 'Rôle inconnu';
    }
    const roleMap: { [key: string]: string } = {
      'ROLE_USER': 'Utilisateur',
      'ROLE_ADMIN': 'Administrateur',
      'ROLE_MODERATOR': 'Modérateur'
    };
    return roleMap[role] || role;
  }

  getRoleSeverity(role: any): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    let roleKey = typeof role === 'object' && role !== null ? role.name : role;
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'ROLE_USER': 'info',
      'ROLE_ADMIN': 'danger',
      'ROLE_MODERATOR': 'warn'
    };
    return severityMap[roleKey] || 'info';
  }

  onEditUser() {
    if (this.user) {
      this.router.navigate(['/dashboard/users/edit-users', this.user.id]);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users/list-users']);
  }
} 