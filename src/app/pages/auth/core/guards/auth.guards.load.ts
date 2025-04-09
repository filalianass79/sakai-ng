import { Injectable }       from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
 
@Injectable()
export class AuthGuardLoad implements CanLoad {
  
  constructor(private router: Router,
        private authService: AuthService
    ) {
  }
 
  canLoad(route: Route): boolean {
    
        const userRoles =this.authService.getCurrentUser()?.roles;
        if (this.authService.isAuthenticated()) {            // check if route is restricted by role
            const roles = route.data?.['roles'];

            if (roles && !roles.some((i: string) => userRoles?.includes(i))) {
                // role not authorized so redirect to home page
                alert('Il faut disposer des autorisations pour acceder')
                return false;
            }

            // authorized so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login']);
        return false;
  }
}