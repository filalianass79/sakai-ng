import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { UserService } from '../../auth/core/services/user.service';

interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MultiSelectModule,
    ToastModule,
    PasswordModule
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
            
            <div class="flex justify-center mb-12">
              <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-3xl px-10">Nouvel Utilisateur</h1>
            </div>
          </div>

          <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="bg-surface-0 dark:bg-surface-900 p-12 rounded-border shadow mb-2">
              <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Nom d'utilisateur</label>
                    </div>
                    <input pInputText formControlName="username" class="w-full" />
                    <small class="p-error" *ngIf="userForm.get('username')?.invalid && userForm.get('username')?.touched">
                      Le nom d'utilisateur est requis (min. 3 caractères)
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-envelope mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Email</label>
                    </div>
                    <input pInputText type="email" formControlName="email" class="w-full" />
                    <small class="p-error" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                      Un email valide est requis
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Nom</label>
                    </div>
                    <input pInputText formControlName="lastName" class="w-full" />
                    <small class="p-error" *ngIf="userForm.get('lastName')?.invalid && userForm.get('lastName')?.touched">
                      Le nom est requis
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Prénom</label>
                    </div>
                    <input pInputText formControlName="firstName" class="w-full" />
                    <small class="p-error" *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched">
                      Le prénom est requis
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-lock mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Mot de passe</label>
                    </div>
                    <p-password formControlName="password" [toggleMask]="true" [feedback]="true" class="w-full"></p-password>
                    <small class="p-error" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                      Le mot de passe est requis (min. 6 caractères)
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-lock mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Confirmation du mot de passe</label>
                    </div>
                    <p-password formControlName="confirmPassword" [toggleMask]="true" [feedback]="false" class="w-full"></p-password>
                    <small class="p-error" *ngIf="userForm.get('confirmPassword')?.errors?.['required'] && userForm.get('confirmPassword')?.touched">
                      La confirmation du mot de passe est requise
                    </small>
                    <small class="p-error" *ngIf="userForm.get('confirmPassword')?.errors?.['passwordMismatch'] && userForm.get('confirmPassword')?.touched">
                      Les mots de passe ne correspondent pas
                    </small>
                  </div>
                </div>

                <div class="col-span-12 py-2">
                  <div class="flex flex-col gap-12">
                    <div class="flex items-center">
                      <i class="pi pi-tag mr-2 text-surface-500 dark:text-surface-300"></i>
                      <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Rôles</label>
                    </div>
                    <p-multiSelect
                      [options]="roles"
                      formControlName="roles"
                      optionLabel="name"
                      optionValue="id"
                      [showClear]="true"
                      placeholder="Sélectionner les rôles"
                      class="w-full"
                    ></p-multiSelect>
                    <small class="p-error" *ngIf="userForm.get('roles')?.invalid && userForm.get('roles')?.touched">
                      Au moins un rôle doit être sélectionné
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-20 gap-2">
              <p-button 
                icon="pi pi-times" 
                label="Annuler" 
                severity="secondary" 
                (onClick)="goBack()"
              ></p-button>
              <p-button 
                icon="pi pi-check" 
                label="Créer" 
                severity="success" 
                type="submit"
                [loading]="loading"
                [disabled]="!userForm.valid"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class UserNew {
  userForm: FormGroup;
  loading = false;
  roles: Role[] = [
    { id: 1, name: 'ROLE_USER' },
    { id: 2, name: 'ROLE_ADMIN' },
    { id: 3, name: 'ROLE_MODERATOR' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      roles: [[], Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const userData = { ...this.userForm.value };
      delete userData.confirmPassword; // Supprimer la confirmation avant l'envoi
      
      // Convertir les IDs des rôles en noms de rôles
      userData.roles = userData.roles.map((roleId: number) => {
        const role = this.roles.find(r => r.id === roleId);
        return role ? role.name : null;
      }).filter(Boolean);

      this.userService.addUser(userData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur créé avec succès',
            life: 3000
          });
          this.router.navigate(['/dashboard/users/list-users']);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Erreur lors de la création de l\'utilisateur',
            life: 3000
          });
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users/list-users']);
  }
} 