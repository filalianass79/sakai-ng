import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

const API_URL = 'http://localhost:8081/api/users/';
const AUTH_API = 'http://localhost:8081/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHttpOptions() {
    const token = this.authService.getToken();
    console.log('Current token in UserService:', token);

    if (!token) {
      console.error('No token found in UserService - user might not be logged in');
      throw new Error('Authentication required');
    }

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true
    };
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}all`, this.getHttpOptions());
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}${id}`, this.getHttpOptions());
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${API_URL}me`, this.getHttpOptions());
  }




  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${API_URL}${user.id}`, user, this.getHttpOptions())
      .pipe(
        tap((updatedUser: User) => {
          this.authService.updateUser(updatedUser);
        })
      );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${API_URL}${id}`, this.getHttpOptions());
  }

  addUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(`${API_URL}add`, userData, this.getHttpOptions());
  }
}
