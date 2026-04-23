import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen py-16 bg-surface">
      <div class="max-w-xl mx-auto px-4 sm:px-6">
        <h1 class="font-display text-3xl font-bold text-foreground mb-8">Edit Profile</h1>

        @if (successMessage) {
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {{ successMessage }}
          </div>
        }
        @if (errorMessage) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ errorMessage }}
          </div>
        }

        @if (isLoading) {
          <div class="text-center py-12 text-muted-foreground">Loading...</div>
        } @else if (!userId) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Could not identify your account. Please log out and log in again.
          </div>
        } @else {
          <div class="bg-card rounded-2xl border border-border p-6 space-y-5">

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Username</label>
              <input type="text" [value]="form.username" disabled
                     class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl opacity-60 cursor-not-allowed" />
              <p class="text-xs text-muted-foreground mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Email</label>
              <input type="email" [(ngModel)]="form.email"
                     class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">
                New Password
                <span class="text-muted-foreground text-xs">(leave blank to keep current)</span>
              </label>
              <input type="password" [(ngModel)]="form.password" placeholder="••••••••"
                     class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>

            <div class="flex gap-3 pt-2">
              <button (click)="save()" [disabled]="isSaving"
                      class="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50">
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
              <a routerLink="/"
                 class="px-5 py-2.5 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-center">
                Cancel
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  form = { username: '', email: '', password: '' };
  userId: number | null = null;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
      private apiService: ApiService,
      private authService: AuthService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getCurrentUser().subscribe({
      next: (user: any) => {
        // /me returns { id, username, email, role, enabled }
        this.userId = user?.id ?? user?.userId ?? null;
        this.form.username = user?.username || '';
        this.form.email = user?.email || '';

        if (this.userId) {
          // Keep AuthService in sync with the DB user id
          localStorage.setItem('user_service_id', String(this.userId));
          this.authService.reloadUserInfo();
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err?.status === 404) {
          this.errorMessage = 'Your account was not found in the system. Please contact support.';
        } else if (err?.status === 401) {
          // Token expired — redirect to login
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          this.errorMessage = 'Could not load profile. Please try again.';
        }
      }
    });
  }

  save(): void {
    if (!this.userId) {
      this.errorMessage = 'Cannot save: user ID is missing. Please refresh the page.';
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Only send fields the user is allowed to change
    const payload: any = {
      email: this.form.email.trim()
    };
    if (this.form.password.trim()) {
      payload.password = this.form.password;
    }

    this.apiService.updateUser(String(this.userId), payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Profile updated successfully!';
        this.form.password = '';
      },
      error: (err: any) => {
        this.isSaving = false;
        if (err?.status === 403) {
          this.errorMessage = 'You are not allowed to edit this profile.';
        } else if (err?.status === 401) {
          this.errorMessage = 'Session expired. Please log in again.';
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          this.errorMessage = err?.error?.message || 'Failed to update profile. Please try again.';
        }
      }
    });
  }
}