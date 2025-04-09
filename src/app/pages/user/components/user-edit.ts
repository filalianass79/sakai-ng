import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '../../../pages/auth/core/services/user.service';
import { User } from '../../../pages/auth/core/models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../auth/core/services/auth.service';

interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-user-edit',
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
                <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-3xl px-10">Modifier Utilisateur</h1>
            </div>
            </div>

            <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
                <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                    <div class="col-span-12">
                        <div class="bg-surface-0 dark:bg-surface-900 p-12 rounded-border shadow mb-2">
                            <div class="grid grid-cols-12 gap-4 grid-cols-12 gap-6 grid-cols-12 gap-12">
                             <!--   <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Nom d'utilisateur</label>
                                        </div>
                                        <input pInputText formControlName="username" class="w-full" />
                                    </div>
                                </div>
                      -->
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-envelope mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Email</label>
                                        </div>
                                        <input pInputText formControlName="email" class="w-full" />
                                    </div>
                                </div>
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Nom</label>
                                        </div>
                                        <input pInputText formControlName="lastName" class="w-full" />
                                    </div>
                                </div>
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-user mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Prénom</label>
                                        </div>
                                        <input pInputText formControlName="firstName" class="w-full" />
                                    </div>
                                </div>
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-lock mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Nouveau mot de passe</label>
                                        </div>
                                        <p-password formControlName="password" [toggleMask]="true" [feedback]="true" class="w-full"></p-password>
                                        <small class="text-surface-500 dark:text-surface-300">Laissez vide pour ne pas modifier le mot de passe</small>
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
                                    </div>
                                </div>
                      
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-calendar mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Date de création</label>
                                        </div>
                                        <span>{{ user?.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                    </div>
                                </div>
                                <div class="col-span-12 py-2">
                                    <div class="flex flex-col gap-12">
                                        <div class="flex items-center">
                                            <i class="pi pi-clock mr-2 text-surface-500 dark:text-surface-300"></i>
                                            <label class="font-bold text-surface-500 dark:text-surface-300" style="min-width: 150px;">Dernière modification</label>
                                        </div>
                                        <span>{{ user?.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                                    </div>
                                </div>
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
                        label="Enregistrer" 
                        severity="success" 
                        type="submit"
                        [loading]="loading"
                    ></p-button>
                </div>
            </form>
        </p-card>
      </div>
    </div>
  `
})
export class UserEdit implements OnInit {
  userForm: FormGroup;
  user: User | null = null;
  loading = false;
  roles: Role[] = [
    { id: 1, name: 'ROLE_USER' },
    { id: 2, name: 'ROLE_ADMIN' },
    { id: 3, name: 'ROLE_MODERATOR' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
    //  username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.minLength(6)]],
      roles: [[], Validators.required]
    });
  }

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
        this.userForm.patchValue({
        //  username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          roles: user.roles.map((role: any) => typeof role === 'object' ? role.id : role)
        });
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

  onSubmit() {
    if (this.userForm.valid && this.user) {
      this.loading = true;
      const updatedUser: Partial<User> = {
        ...this.userForm.value,
        id: this.user.id,
      };

      if (!updatedUser.password) {
        delete updatedUser.password;
      }

      this.userService.updateUser(updatedUser).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur mis à jour avec succès',
            life: 3000
          });
          this.router.navigate(['/dashboard/users/list-users']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: error.error?.message || 'Impossible de mettre à jour l\'utilisateur',
            life: 3000
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users/list-users']);
  }
} 