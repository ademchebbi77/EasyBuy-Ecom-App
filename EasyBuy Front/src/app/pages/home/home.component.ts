import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { CategoryCardComponent } from '../../shared/category-card/category-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, CategoryCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  featuredProducts: any[] = [];
  isLoading = true;
  errorMessage = '';

  trustBadges: { icon: SafeHtml; title: string; desc: string }[];

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer) {
    this.trustBadges = [
      { 
        icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/>'),
        title: 'Free Delivery',
        desc: 'On orders over $50'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),
        title: 'Easy Returns',
        desc: '30-day return policy'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'),
        title: 'Secure Payment',
        desc: '100% protected'
      },
      {
        icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-2"/>'),
        title: '24/7 Support',
        desc: 'Always here to help'
      }
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load categories
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load products
    this.apiService.getProducts(0, 8).subscribe({
      next: (response) => {
        this.products = response.content || response;
        this.featuredProducts = this.products.slice(0, 4);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
