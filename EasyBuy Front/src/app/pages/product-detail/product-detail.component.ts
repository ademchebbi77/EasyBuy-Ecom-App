import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RatingStarsComponent } from '../../shared/rating-stars/rating-stars.component';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingStarsComponent, FormsModule],
  template: `
    <div class="min-h-screen py-16 bg-surface">
      @if (isLoading) {
        <div class="text-center py-12">
          <p class="text-muted-foreground">Loading product...</p>
        </div>
      }
      
      @if (errorMessage) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>
        </div>
      }
      
      @if (product && !isLoading) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="bg-white rounded-2xl overflow-hidden">
              <img [src]="product.image || product.imageUrl || 'https://via.placeholder.com/400'" [alt]="product.name" class="w-full h-96 object-cover" />
            </div>
            <div class="flex flex-col gap-6">
              <div>
                <span class="text-sm text-muted-foreground uppercase tracking-wide">{{product.categoryName || product.category || 'Product'}}</span>
                <h1 class="font-display text-3xl font-bold text-foreground mt-2">{{product.name}}</h1>
              </div>
              <div class="flex items-center gap-3">
                <app-rating-stars [rating]="averageRating"></app-rating-stars>
                <span class="text-sm text-muted-foreground">({{reviews.length}} reviews)</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-3xl font-bold text-foreground">TND {{product.price.toFixed(2)}}</span>
              </div>
              <p class="text-foreground leading-relaxed">{{product.description}}</p>
              <div class="text-sm">
                <p><strong>Stock:</strong> {{product.stock || (product.inStock ? 'In Stock' : 'Out of Stock')}}</p>
              </div>
              <button 
                (click)="addToCart()" 
                [disabled]="(product.stock !== undefined && product.stock === 0) || (product.inStock !== undefined && !product.inStock)" 
                class="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:bg-[#0284c7] transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">
                {{(product.stock !== undefined && product.stock > 0) || (product.inStock !== undefined && product.inStock) ? 'Add to Cart' : 'Out of Stock'}}
              </button>
            </div>
          </div>
          
          <!-- Reviews Section -->
          <div class="mt-16">
            <h2 class="font-display text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            
            @if (authService.isAuthenticated()) {
              <div class="bg-card rounded-2xl border border-border p-6 mb-8">
                <h3 class="font-semibold text-foreground mb-4">Write a Review</h3>
                <form (submit)="submitReview($event)" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Rating</label>
                    <select [(ngModel)]="newReview.rating" name="rating" required class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl">
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Terrible</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Comment</label>
                    <textarea 
                      [(ngModel)]="newReview.comment" 
                      name="comment" 
                      required
                      rows="4"
                      class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl"></textarea>
                  </div>
                  <button 
                    type="submit" 
                    [disabled]="isSubmittingReview"
                    class="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50">
                    {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
                  </button>
                </form>
              </div>
            }
            
            @if (reviews.length === 0) {
              <p class="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            }
            
            <div class="space-y-4">
              @for (review of reviews; track review.id) {
                <div class="bg-card rounded-2xl border border-border p-6">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <app-rating-stars [rating]="review.rating"></app-rating-stars>
                      <span class="text-sm text-muted-foreground">{{review.createdAt | date}}</span>
                    </div>
                    @if (authService.isAdmin()) {
                      <button 
                        (click)="deleteReview(review.id)" 
                        class="text-red-600 hover:text-red-800 text-sm">
                        Delete
                      </button>
                    }
                  </div>
                  <div class="mb-2">
                    <span class="font-semibold text-foreground">{{review.username || 'Anonymous'}}</span>
                  </div>
                  <p class="text-foreground">{{review.comment}}</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  reviews: any[] = [];
  averageRating = 0;
  isLoading = true;
  errorMessage = '';
  isSubmittingReview = false;
  
  newReview = {
    rating: 5,
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
    this.loadReviews(id);
  }

  loadProduct(id: number): void {
    this.apiService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.errorMessage = 'Failed to load product details.';
        this.isLoading = false;
      }
    });
  }

  loadReviews(productId: number): void {
    this.apiService.getReviewsByProduct(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  submitReview(event: Event): void {
    event.preventDefault();
    
    if (!this.product) return;
    
    this.isSubmittingReview = true;
    
    const reviewData = {
      productId: this.product.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    };

    this.apiService.createReview(reviewData).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.calculateAverageRating();
        this.newReview = { rating: 5, comment: '' };
        this.isSubmittingReview = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
        this.isSubmittingReview = false;
      }
    });
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    this.apiService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        alert('Failed to delete review.');
      }
    });
  }
}
