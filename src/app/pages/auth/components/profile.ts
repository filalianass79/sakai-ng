import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';
import { UserProfile } from '../core/models/user.model';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    AvatarModule,
    TagModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    <div class="bg-surface-50 dark:bg-surface-900 p-20 min-h-screen">
      <div class="max-w-3xl mx-auto">
        <p-card>
            <div class="gap-12 flex flex-col items-center">
                <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 5rem; height: 5rem">
                    <i class="text-orange-500 pi pi-fw pi-user !text-3xl"></i>
                </div>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-3xl mb-2">Nom d'utilisateur: {{ userProfile?.username }}</h1>
            </div>
          <div class="flex flex-col md:flex-row items-center gap-12">
            <p-avatar
              [label]="getInitials(userProfile?.firstName || '', userProfile?.lastName || '')"
              size="xlarge"
              [style]="{ 'background-color': 'var(--primary-color)', color: '#ffffff' }"
              shape="circle"
            ></p-avatar>
            <div class="flex-1">
              <h2 class="text-2xl font-bold m-0 mb-2">{{ userProfile?.firstName }} {{ userProfile?.lastName }}</h2>
            </div>
          </div>


          <div class="mt-12">
            <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
              <div class="col-span-12 md:col-span-6">
                <div class="flex-1 p-12">
                  <label class="block text-xl font-medium mb-2">Email: {{ userProfile?.email }}</label>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6">
                <div class="p-12">
                  <div class="flex flex-col gap-2">
                    <label class="block text-xl font-medium mb-2">Rôles:</label>
                    <div class="flex gap-2 flex-wrap">
                      <p-tag
                        *ngFor="let role of userProfile?.roles"
                        [value]="formatRole(role)"
                        [severity]="getRoleSeverity(role)"
                        [style]="{ 'font-size': '1rem', padding: '0.5rem 1rem' }"
                      ></p-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-12">
            <p-button
              label="Modifier le profil"
              icon="pi pi-user-edit"
              severity="success"
              (onClick)="onEditProfile()"
            ></p-button>
            <p-button
              label="Changer le mot de passe"
              icon="pi pi-lock"
              severity="help"
              (onClick)="onChangePassword()"
            ></p-button>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class Profile implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        console.log('User data:', user);
        this.userProfile = {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          roles: Array.isArray(user.roles) ? user.roles : [user.roles]
        };
        console.log('UserProfile roles:', this.userProfile.roles);
      },
      error: (error: Error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible de charger le profil utilisateur',
          life: 3000
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
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

  onEditProfile() {
    this.router.navigate(['/dashboard/auth/profile/edit']);
  }

  onChangePassword() {
    this.router.navigate(['/dashboard/auth/profile/change-password']);
  }
} 