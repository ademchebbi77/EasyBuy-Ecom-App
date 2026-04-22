import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center py-16 bg-surface">
      <div class="w-full max-w-md px-4">
        <div class="bg-card rounded-2xl border border-border p-8">
          <h1 class="font-display text-2xl font-bold text-foreground mb-6 text-center">Sign In</h1>

          @if (errorMessage) {
            <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }

          @if (successMessage) {
            <div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {{ successMessage }}
            </div>
          }

          <form (submit)="onSubmit($event)" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Username</label>
              <input
                  type="text"
                  [(ngModel)]="username"
                  name="username"
                  required
                  placeholder="admin or user"
                  class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  placeholder="admin123 or user123"
                  class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            <button
                type="submit"
                [disabled]="isLoading"
                class="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          <p class="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <a routerLink="/auth/register" class="text-primary font-semibold hover:underline">Sign up</a>
          </p>

          <div class="mt-6 pt-6 border-t border-border">
            <p class="text-xs text-muted-foreground text-center">
              Test Credentials:<br/>
              Admin: admin / admin123<br/>
              User: user / user123
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
      private authService: AuthService,
      private apiService: ApiService,
      private router: Router
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Login successful! Redirecting...';

        // Fetch current user from user-service and store their DB id.
        // The token is already saved by AuthService before this callback fires,
        // so the HTTP interceptor will attach it correctly.
        this.apiService.getCurrentUser().subscribe({
          next: (user: any) => {
            if (user?.id) {
              localStorage.setItem('user_service_id', String(user.id));
              // Reload user info so userId is available in AuthService
              this.authService.reloadUserInfo();
            }
          },
          error: (err: any) => {
            // Non-fatal: user is still logged in even if /me fails.
            // This can happen if the user does not yet exist in the user-service DB.
            console.warn('Could not fetch user profile from user-service:', err?.status, err?.message);
          }
        });

        setTimeout(() => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Login error:', error);

        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Make sure Keycloak is running on port 8080';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}