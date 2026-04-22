import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="min-h-screen py-16 bg-surface">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 class="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {{ pageTitle }}
        </h1>
        
        @if (isLoading) {
          <div class="text-center py-12">
            <p class="text-muted-foreground">Loading products...</p>
          </div>
        }
        
        @if (errorMessage) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>
        }
        
        @if (!isLoading && filteredProducts.length === 0) {
          <div class="text-center py-12">
            <p class="text-muted-foreground">No products found.</p>
          </div>
        }
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <app-product-card *ngFor="let product of filteredProducts" [product]="product"></app-product-card>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  filteredProducts: Product[] = [];
  isLoading = true;
  errorMessage = '';
  pageTitle = 'Products';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      const searchQuery = params['search'];
      
      if (categoryId) {
        this.pageTitle = 'Products by Category';
        this.loadProductsByCategory(Number(categoryId));
      } else if (searchQuery) {
        this.pageTitle = `Search Results for "${searchQuery}"`;
        this.searchProducts(searchQuery);
      } else {
        this.pageTitle = 'All Products';
        this.loadAllProducts();
      }
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.apiService.getProducts(0, 50).subscribe({
      next: (response) => {
        this.filteredProducts = response.content || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.apiService.getProductsByCategory(categoryId, 0, 50).subscribe({
      next: (response) => {
        this.filteredProducts = response.content || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products by category:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  searchProducts(query: string): void {
    this.isLoading = true;
    this.apiService.searchProducts(query, 0, 50).subscribe({
      next: (response) => {
        this.filteredProducts = response.content || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.errorMessage = 'Failed to search products. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
