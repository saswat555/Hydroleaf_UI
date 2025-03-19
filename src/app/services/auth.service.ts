// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin' | 'superadmin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update baseUrl for authentication endpoints.
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  // Login now posts to "/api/v1/auth/login" and expects URL‑encoded parameters.
  login(params: HttpParams): Observable<{ access_token: string; token_type: string }> {
    return this.http.post<{ access_token: string; token_type: string }>(
      `${this.baseUrl}/api/v1/auth/login`,
      params
    );
  }

  signup(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/v1/auth/signup`, userData);
  }

  // In getCurrentUser we attach the token in the Authorization header.
  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('access_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<User>(`${this.baseUrl}/api/v1/users/me`, { headers });
  }

  updateCurrentUser(updateData: any): Observable<User> {
    const token = localStorage.getItem('access_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.put<User>(`${this.baseUrl}/api/v1/users/me`, updateData, { headers });
  }

  impersonateUser(userId: number): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${this.baseUrl}/admin/users/impersonate/${userId}`,
      {}
    );
  }

  // Helper methods for user state…
  private currentUser: User | null = null;

  isAdmin(): boolean {
    return this.currentUser
      ? this.currentUser.role === 'admin' || this.currentUser.role === 'superadmin'
      : false;
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUserId(): number | null {
    return this.currentUser ? this.currentUser.id : null;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUser = null;
  }
}
