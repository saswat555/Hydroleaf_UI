// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update baseUrl for authentication endpoints.
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Login now posts to "/login" (expects form-data).
  login(formData: FormData): Observable<{ access_token: string; token_type: string }> {
    return this.http.post<{ access_token: string; token_type: string }>(`${this.baseUrl}/login`, formData);
  }

  // Signup endpoint is now at "/signup"
  signup(userData: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/signup`, userData);
  }

  // These remain under the "/api/v1" namespace.
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/api/v1/users/me`);
  }

  updateCurrentUser(updateData: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/api/v1/users/me`, updateData);
  }

  // For admin impersonation, call the endpoint directly (no extra "/api/v1")
  impersonateUser(userId: number): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.baseUrl}/admin/users/impersonate/${userId}`, {});
  }

  // Helper methods for user state…
  private currentUser: User | null = null;
  isAdmin(): boolean {
    return this.currentUser ? this.currentUser.role === 'admin' : false;
  }
  setCurrentUser(user: User) {
    this.currentUser = user;
  }
  getCurrentUserId(): number | null {
    return this.currentUser ? this.currentUser.id : null;
  }
}
