import { Injectable } from '@angular/core';
import { CanActivate, Router,ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const roles = route.data['roles'];
      const userRoles = this.authService.getCurrentUser()?.roles;
      if (roles && !roles.some((i: string) => userRoles?.includes(i))) {
        this.router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }

    this.messageService.add({
      severity: 'warn',
      summary: 'Accès refusé',
      detail: 'Veuillez vous connecter pour accéder à cette page'
    });

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
} 


  