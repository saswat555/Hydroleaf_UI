// src/app/features/signup/signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <div class="signup-container">
      <h2>Sign Up</h2>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="user@example.com">
          <mat-error *ngIf="signupForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="signupForm.get('email')?.hasError('email')">
            Invalid email address
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" placeholder="Enter password">
          <mat-error *ngIf="signupForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="signupForm.get('password')?.hasError('minlength')">
            Password must be at least 6 characters
          </mat-error>
        </mat-form-field>
        <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
        <button mat-raised-button color="primary" type="submit" [disabled]="signupForm.invalid">
          Sign Up
        </button>
      </form>
    </div>
  `,
  styles: [`
    .signup-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .full-width {
      width: 100%;
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.signupForm.valid) {
      // Call the signup endpoint
      this.authService.signup(this.signupForm.value).subscribe({
        next: (user: User) => {
          // After successful signup, automatically log in using the same credentials.
          const params = new HttpParams()
            .set('username', this.signupForm.value.email)
            .set('password', this.signupForm.value.password);
  
          this.authService.login(params).subscribe({
            next: (loginResponse) => {
              localStorage.setItem('access_token', loginResponse.access_token);
              this.authService.setCurrentUser(user);
              this.router.navigate(['/dashboard']);
            },
            error: err => {
              console.error('Auto login failed:', err);
              this.errorMessage = 'Signup succeeded but auto login failed. Please login manually.';
              this.router.navigate(['/login']);
            }
          });
        },
        error: err => {
          console.error('Signup failed:', err);
          this.errorMessage = err.error?.detail || 'Signup failed. Please try again.';
        }
      });
    }
  }
}
