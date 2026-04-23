import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CardService, Card } from '../../services/card.service';
import { of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen py-16 bg-surface">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex justify-between items-center mb-8">
          <h1 class="font-display text-3xl font-bold text-foreground">My Dashboard</h1>
          <button 
            (click)="logout()" 
            class="bg-red-500 text-white font-semibold px-6 py-2 rounded-xl hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
        
        @if (userInfo) {
          <div class="bg-card rounded-2xl border border-border p-6 mb-8">
            <h2 class="font-semibold text-foreground text-xl mb-4">User Information</h2>
            <div class="space-y-2">
              <p><strong>Username:</strong> {{ userInfo.preferred_username }}</p>
              <p><strong>Email:</strong> {{ userInfo.email || 'N/A' }}</p>
              <p><strong>Role:</strong> 
                <span [class]="userInfo.roles.includes('ADMIN') ? 'text-red-600 font-semibold' : 'text-blue-600 font-semibold'">
                  {{ userInfo.roles.join(', ') }}
                </span>
              </p>
            </div>
          </div>
        }
        
        @if (isLoading) {
          <div class="text-center py-12">
            <p class="text-muted-foreground">Loading orders...</p>
          </div>
        }
        
        @if (errorMessage) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>
        }
        
        @if (!isLoading) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-card rounded-2xl border border-border p-6">
              <p class="text-sm text-muted-foreground mb-2">Total Orders</p>
              <p class="text-3xl font-bold text-foreground">{{orders.length}}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-6">
              <p class="text-sm text-muted-foreground mb-2">Total Spent</p>
              <p class="text-3xl font-bold text-foreground">TND {{totalSpent.toFixed(2)}}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-6">
              <p class="text-sm text-muted-foreground mb-2">Pending Orders</p>
              <p class="text-3xl font-bold text-foreground">{{pendingOrders}}</p>
            </div>
          </div>

          <div class="bg-card rounded-2xl border border-border p-6">
            <h2 class="font-semibold text-foreground text-xl mb-6">Recent Orders</h2>
            
            @if (orders.length === 0) {
              <p class="text-muted-foreground text-center py-8">No orders yet. Start shopping!</p>
            }
            
            <div class="space-y-4">
              @for (order of orders; track order.id) {
                <div class="flex items-center gap-4 p-4 bg-surface rounded-xl">
                  <div class="flex-1">
                    <p class="font-semibold text-foreground">Order #{{order.id}}</p>
                    <p class="text-sm text-muted-foreground">
                      Ref: {{order.reference}} &bull; Qty: {{order.quantity}}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-foreground">TND {{order.totalAmount?.toFixed(2)}}</p>
                    <span [class]="'text-xs px-2 py-1 rounded-full ' + getStatusClass(order.status)">
                      {{order.status}}
                    </span>
                  </div>
                  <!-- Payment badge -->
                  <div class="text-right min-w-[110px]">
                    @if (order.payment) {
                      <span [class]="'text-xs px-2 py-1 rounded-full ' + getPaymentClass(order.payment.status)">
                        💳 {{order.payment.status}}
                      </span>
                    } @else if (order.status === 'CONFIRMED') {
                      <div class="flex flex-col items-end gap-2 min-w-[180px]">
                        <select [(ngModel)]="order.selectedCardId"
                          class="text-xs px-2 py-1.5 border border-border rounded-lg bg-surface w-full">
                          <option value="">Select a card...</option>
                          @for (card of cards; track card.id) {
                            <option [value]="card.id">{{ card.label }}</option>
                          }
                        </select>
                        @if (cards.length === 0) {
                          <a routerLink="/cards" class="text-xs text-primary hover:underline">+ Add a card first</a>
                        } @else {
                          <button (click)="payOrder(order)"
                            [disabled]="!order.selectedCardId || order.paying"
                            class="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-[#0284c7] transition-colors disabled:opacity-50 w-full font-semibold">
                            {{ order.paying ? 'Processing...' : 'Pay Now' }}
                          </button>
                        }
                      </div>
                    }
                  </div>
                  <div class="flex gap-2">
                    @if (order.status === 'PENDING') {
                      <button
                        (click)="cancelOrder(order.id)"
                        class="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded-lg">
                        Cancel
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  orders: any[] = [];
  totalSpent = 0;
  pendingOrders = 0;
  isLoading = true;
  errorMessage = '';
  userInfo: any = null;
  cards: Card[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private cardService: CardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getCurrentUser();
    this.cards = this.cardService.getCards();
    this.loadOrders();

    // Refresh cards whenever user navigates back to this page
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.cards = this.cardService.getCards();
    });
  }

  loadOrders(): void {
    this.isLoading = true;

    if (this.authService.isAdmin()) {
      this.apiService.getOrders(0, 50).subscribe({
        next: (response) => {
          this.orders = response.content || response;
          this.calculateStats();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.errorMessage = 'Failed to load orders. Please try again later.';
          this.isLoading = false;
        }
      });
    } else {
      const storedUser = this.authService.getCurrentUser();
      const userId = storedUser?.userId;
      if (userId) {
        this._loadOrdersForUser(userId);
      } else {
        this.apiService.getCurrentUser().subscribe({
          next: (user: any) => this._loadOrdersForUser(user?.id || user?.userId),
          error: () => { this.errorMessage = 'Could not load user info.'; this.isLoading = false; }
        });
      }
    }
  }

  _loadOrdersForUser(userId: number): void {
    this.apiService.getOrdersByUser(userId).subscribe({
      next: (response) => {
        const orders = response.content || response;
        this.orders = orders.map((order: any) => ({ ...order, payment: null }));
        this.calculateStats();
        this.isLoading = false;
        orders.forEach((order: any, i: number) => {
          if (order.status === 'CONFIRMED') {
            this.apiService.getPaymentByOrderId(order.id).pipe(
              catchError(() => of(null))
            ).subscribe((payment: any) => {
              this.orders[i] = { ...this.orders[i], payment };
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.totalSpent = this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    this.pendingOrders = this.orders.filter(o => o.status === 'PENDING').length;
  }

  payOrder(order: any): void {
    if (!order.selectedCardId) return;
    const card = this.cards.find(c => c.id === order.selectedCardId);
    if (!card) return;

    order.paying = true;

    // Create payment then process it
    const paymentData = {
      orderId: order.id,
      userId: order.userId,
      amount: order.totalAmount,
      method: card.type
    };

    this.apiService.createPayment(paymentData).subscribe({
      next: (payment: any) => {
        this.apiService.processPayment(payment.id).subscribe({
          next: () => {
            order.paying = false;
            this.loadOrders(); // refresh to show payment status
          },
          error: () => {
            order.paying = false;
            this.loadOrders();
          }
        });
      },
      error: (err: any) => {
        console.error('Payment creation failed', err);
        order.paying = false;
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      CONFIRMED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      CANCELLED: 'bg-red-100 text-red-700',
      DELIVERED: 'bg-blue-100 text-blue-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  getPaymentClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      COMPLETED: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
      REFUNDED: 'bg-blue-100 text-blue-700',
      EXPIRED: 'bg-gray-100 text-gray-500',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  cancelOrder(orderId: string): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    this.apiService.cancelOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order.');
      }
    });
  }

  confirmOrder(orderId: string): void {
    if (!confirm('Confirm this order?')) return;
    
    this.apiService.confirmOrder(orderId).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error confirming order:', error);
        alert('Failed to confirm order.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
