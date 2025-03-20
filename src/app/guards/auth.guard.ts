import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Check if the user is logged in (using your AuthService logic)
    if (this.authService.getCurrentUserId()) {
      return true;
    }
    // If not logged in, redirect to the login page.
    return this.router.parseUrl('/login');
  }
}
