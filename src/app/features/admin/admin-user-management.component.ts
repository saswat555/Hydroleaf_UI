// src/app/features/admin/admin-user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Needed for *ngIf, *ngFor, etc.
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.scss']
})
// src/app/features/admin/admin-user-management.component.ts
export class AdminUserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  // Update the base URL to remove the /api/v1 prefix.
  baseUrl = 'http://localhost:8000/admin/users';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<User[]>(`${this.baseUrl}/`).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

  impersonate(userId: number): void {
    this.http.post<{ access_token: string }>(`${this.baseUrl}/impersonate/${userId}`, {}).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Impersonation failed:', err)
    });
  }
}
