import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { User, UserProfile } from '../core/models/user.model';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <p-toast position="top-center"></p-toast>
    <div class="bg-surface-50 dark:bg-surface-900 p-20 min-h-screen">
      <div class="max-w-3xl mx-auto">
        <p-card >
            <div class="gap-12 flex flex-col items-center">
                <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 5rem; height: 5rem">
                    <i class="text-orange-500 pi pi-fw pi-user !text-3xl"></i>
                </div>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-3xl mb-2">Modifier le profil</h1>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-2xl mb-2">Nom d'utilisateur: {{ username }}</h1>
            </div>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
              <div class="col-span-12 md:col-span-6">
                <div class="p-fluid mb-12">
                  <label for="firstName" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Prénom</label>
                  <input 
                    pInputText 
                    id="firstName"
                    styleClass="mb-12" [fluid]="true" 
                    formControlName="firstName"
                    [ngClass]="{'ng-invalid ng-dirty': profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched}"
                  />
                  <small class="text-red-500" *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                    Le prénom est requis
                  </small>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6">
                <div class="p-fluid mb-12">
                  <label for="lastName" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Nom</label>
                  <input 
                    pInputText 
                    id="lastName" 
                    styleClass="mb-12" [fluid]="true"
                    formControlName="lastName"
                    [ngClass]="{'ng-invalid ng-dirty': profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched}"
                  />
                  <small class="text-red-500" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                    Le nom est requis
                  </small>
                </div>
              </div>
              <div class="col-span-12">
                <div class="p-fluid mb-12">
                  <label for="email" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Email</label>
                  <input 
                    pInputText 
                    id="email" 
                    styleClass="mb-12" [fluid]="true"
                    type="email" 
                    formControlName="email"
                    [ngClass]="{'ng-invalid ng-dirty': profileForm.get('email')?.invalid && profileForm.get('email')?.touched}"
                  />
                  <small class="text-red-500" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                    Email invalide
                  </small>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <p-button
                label="Annuler"
                severity="info"
                type="button"
                (onClick)="onCancel()"
              ></p-button>
              <p-button
                label="Enregistrer"
                type="submit"
                [disabled]="profileForm.invalid || profileForm.pristine"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class EditProfile implements OnInit {
  profileForm: FormGroup;
  username: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
    });
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
        next: (user: User) => {
         this.username = user.username;
         this.profileForm.patchValue({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        },
        error: (error: Error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de charger le profil utilisateur',
            life: 3000
          });
        }
      });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        return;
      }
      const updatedUser: Partial<User> = {
        ...this.profileForm.value,
        id: currentUser.id,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        email: this.profileForm.value.email,

      };

      this.authService.updateUser(updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Profil mis à jour avec succès',
            life: 3000
          });
          this.router.navigate(['/dashboard/auth/profile']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de mettre à jour le profil',
            life: 3000
          });
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/auth/profile']);
  }
} 