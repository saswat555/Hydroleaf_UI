// src/app/features/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="user@example.com">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">
          Login
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 2rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; }
    .full-width { width: 100%; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('username', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);
      this.authService.login(formData).subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          // After login, load the current user details and navigate to the dashboard
          this.authService.getCurrentUser().subscribe(user => {
            this.authService.setCurrentUser(user);
            this.router.navigate(['/dashboard']);
          });
        },
        error: err => {
          console.error('Login failed:', err);
          // Show error message as needed.
        }
      });
    }
  }
}
