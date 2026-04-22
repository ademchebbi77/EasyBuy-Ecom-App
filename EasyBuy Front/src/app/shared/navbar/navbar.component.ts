import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService, UserInfo } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  mobileOpen = false;
  profileOpen = false;
  searchQuery = '';
  totalItems$ = this.cartService.totalItems$;
  currentUser: UserInfo | null = null;

  navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Deals', href: '/products?badge=Deal' },
  ];

  constructor(
    public cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get displayName(): string {
    if (!this.currentUser) return 'Guest';
    return this.currentUser.name || this.currentUser.preferred_username || 'User';
  }

  get displayEmail(): string {
    if (!this.currentUser) return '';
    return this.currentUser.email || this.currentUser.preferred_username || '';
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  toggleMobile(): void { this.mobileOpen = !this.mobileOpen; }
  toggleProfile(): void { this.profileOpen = !this.profileOpen; }
  closeMobile(): void { this.mobileOpen = false; }
  closeProfile(): void { this.profileOpen = false; }

  logout(): void {
    this.authService.logout();
    this.profileOpen = false;
    this.router.navigate(['/auth/login']);
  }
}
