import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingStarsComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() className?: string;

  constructor(private cartService: CartService) {}

  get discount(): number | null {
    if (this.product.originalPrice) {
      return Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100);
    }
    return null;
  }

  isInStock(): boolean {
    // Check stock number if available
    if (this.product.stock !== undefined) {
      return this.product.stock > 0;
    }
    // Otherwise check inStock boolean
    if (this.product.inStock !== undefined) {
      return this.product.inStock;
    }
    // Default to true if neither is set
    return true;
  }

  onAddToCart(): void {
    this.cartService.addToCart(this.product);
  }

  getImageUrl(): string {
    const url = this.product.imageUrl || this.product.image;
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return '';
  }

  hasValidImage(): boolean {
    const url = this.product.imageUrl || this.product.image;
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
