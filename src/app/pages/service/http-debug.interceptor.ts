import { HttpInterceptorFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/core/services/auth.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const HttpDebugInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    
    console.log('=== Request Debug ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Token:', token);
    
    // Clone la requête et ajoute le token si présent
    let authReq = req;
    if (token) {
        // Preserve existing headers and withCredentials setting
        const headers = req.headers.set('Authorization', `Bearer ${token}`);
        authReq = req.clone({
            headers,
            withCredentials: true
        });
    }
    
    return next(authReq).pipe(
        tap({
            next: (response) => {
                if (response instanceof HttpResponse) {
                    console.log('=== Response Debug ===');
                    console.log('Status:', response.status);
                    console.log('Headers:', response.headers);
                }
            },
            error: (error) => {
                console.error('=== Error Debug ===');
                console.error('Status:', error.status);
                console.error('Message:', error.message);
                console.error('Error:', error);
                
                // Handle 401 errors
                if (error.status === 401) {
                    console.error('Authentication failed - logging out user');
                    authService.logout();
                }
            }
        })
    );
};


