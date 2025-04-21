import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, PwRequest, SignupRequest, User, UserResponse } from '../models/user.model';
import { OcrResult } from '../../../service/ocr.service';

const AUTH_API = 'http://localhost:8081/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserResponse | null>;
  public currentUser: Observable<UserResponse | null>;

  constructor(private http: HttpClient) {
    const currentUser = this.getCurrentUser();
    console.log('AuthService initialized with user:', currentUser);
    this.currentUserSubject = new BehaviorSubject<UserResponse | null>(currentUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    const token = localStorage.getItem('jwt-token');
    console.log('Getting token from localStorage:', token ? 'Token exists' : 'No token found');
    return token;
  }

  private setToken(token: string): void {
    console.log('Setting token in localStorage');
    localStorage.setItem('jwt-token', token);
  }

  login(loginRequest: LoginRequest): Observable<any> {
    console.log('Attempting login with:', loginRequest);
    return this.http.post(AUTH_API + 'signin', loginRequest, httpOptions).pipe(
      tap((response: any) => {
        console.log('Login response:', response);
        if (response && response.accessToken) {
          console.log('Setting token:', response.accessToken);
          this.setToken(response.accessToken);
          const userInfo = { ...response };
          delete userInfo.accessToken;
          this.currentUserSubject.next(userInfo);
          localStorage.setItem('currentUser', JSON.stringify(userInfo));
          console.log('User info stored:', userInfo);
        }
      })
    );
  }
  // create first user if number of users = 0 
  createFirstUser(): Observable<any> {
    return this.http.post(AUTH_API + 'create-admin', {}, httpOptions);
  }

  register(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(AUTH_API + 'signup', signupRequest, httpOptions);
  }

  logout(): Observable<any> {
    console.log('Logging out user');
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.http.post(AUTH_API + 'signout', {}, { withCredentials: true });
  }

  getCurrentUser(): UserResponse | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      console.log('Getting current user from localStorage:', userStr ? 'User exists' : 'No user found');
      if (!userStr) {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }

  private getAuthHeaders() {
    const token = this.getToken();
    console.log('Getting auth headers with token:', token ? 'Token exists' : 'No token found');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${AUTH_API}${user.id}`, user, this.getAuthHeaders())
      .pipe(
        tap((updatedUser: User) => {
          const currentUser = this.getCurrentUser();
          if (currentUser) {
            const newUser = { ...currentUser, ...updatedUser };
            this.currentUserSubject.next(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
          }
        })
      );
  }

  changePassword(pwRequest: PwRequest): Observable<any> {
    return this.http.post(`${AUTH_API}${pwRequest.id}`, pwRequest, httpOptions);
  }

  isAuthenticated(): boolean {
    const isAuth = !!this.getToken();
    console.log('Checking authentication status:', isAuth ? 'Authenticated' : 'Not authenticated');
    return isAuth;
  }

  hasRole(role: string): boolean {
    const hasRole = this.currentUserValue?.roles?.includes(role) || false;
    console.log(`Checking role ${role}:`, hasRole ? 'Has role' : 'Does not have role');
    return hasRole;
  }
}
