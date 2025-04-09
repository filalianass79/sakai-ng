import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { PwRequest } from '../core/models/user.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    PasswordModule,
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
                    <i class="text-orange-500 pi pi-fw pi-lock !text-3xl"></i>
                </div>
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-3xl mb-2">Changer le mot de passe</h1>
            </div>
            
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
              <div class="col-span-12">
                <div class="p-fluid mb-12">
                  <label for="currentPassword" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Mot de passe actuel</label>
                  <p-password
                    id="currentPassword"
                    formControlName="currentPassword"
                    [feedback]="false"
                    [toggleMask]="true"
                    styleClass="mb-12" [fluid]="true"
                    [ngClass]="{'ng-invalid ng-dirty': passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched}"
                  ></p-password>
                  <small class="text-red-500" *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched">
                    Le mot de passe actuel est requis
                  </small>
                </div>
              </div>
              <div class="col-span-12">
                <div class="p-fluid mb-12">
                  <label for="newPassword" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Nouveau mot de passe</label>
                  <p-password
                    id="newPassword"
                    formControlName="newPassword"
                    styleClass="mb-12" [fluid]="true"
                    [toggleMask]="true"
                    [ngClass]="{'ng-invalid ng-dirty': passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched}"
                  ></p-password>
                  <small class="text-red-500" *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
                    Le mot de passe doit contenir au moins 8 caractères
                  </small>
                </div>
              </div>
              <div class="col-span-12">
                <div class="p-fluid mb-12">
                  <label for="confirmPassword" class="block text-sm font-medium text-surface-500 dark:text-surface-300 mb-2">Confirmer le nouveau mot de passe</label>
                  <p-password
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [feedback]="false"
                    [toggleMask]="true"
                    styleClass="mb-12" [fluid]="true"
                    [ngClass]="{'ng-invalid ng-dirty': passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched}"
                  ></p-password>
                  <small class="text-red-500" *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched">
                    Les mots de passe ne correspondent pas
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
                label="Changer le mot de passe"
                type="submit"
                [disabled]="passwordForm.invalid || passwordForm.pristine"
              ></p-button>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `
})
export class ChangePassword {
  passwordForm: FormGroup;
  pwRequest!: PwRequest;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Utilisateur non connecté',
          life: 3000
        });
        this.router.navigate(['/auth/login']);
        return;
      }

      this.pwRequest = {
        id: currentUser.id,
        oldPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };

      
      this.authService.changePassword(this.pwRequest).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Mot de passe modifié avec succès',
            life: 3000
          });
          this.router.navigate(['/dashboard/auth/profile']);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Impossible de modifier le mot de passe' + error.message,
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