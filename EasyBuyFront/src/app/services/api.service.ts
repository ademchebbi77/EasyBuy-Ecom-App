import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // ─── Products ────────────────────────────────────────────────────────────────

  getProducts(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get(`${environment.services.products}/api/products`, { params });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${environment.services.products}/api/products/${id}`);
  }

  getProductsByCategory(categoryId: number, page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${environment.services.products}/api/products/category/${categoryId}`);
  }

  searchProducts(name: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
        .set('name', name)
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get(`${environment.services.products}/api/products`, { params });
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${environment.services.products}/api/products`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${environment.services.products}/api/products/${id}`, product);
  }

  uploadProductImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.services.products}/api/images/upload`, formData);
  }

  // FIX: was string → changed to number (product ids are numbers)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${environment.services.products}/api/products/${id}`);
  }

  // ─── Categories ──────────────────────────────────────────────────────────────

  getCategories(): Observable<any> {
    return this.http.get(`${environment.services.categories}/api/categories`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${environment.services.categories}/api/categories/${id}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${environment.services.categories}/api/categories`, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${environment.services.categories}/api/categories/${id}`, category);
  }

  // FIX: was string → changed to number (category ids are numbers)
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${environment.services.categories}/api/categories/${id}`);
  }

  // ─── Orders ──────────────────────────────────────────────────────────────────

  getOrders(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get(`${environment.services.orders}/api/orders`, { params });
  }

  getOrdersByUser(userId: number): Observable<any> {
    return this.http.get(`${environment.services.orders}/api/orders/user/${userId}`);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${environment.services.orders}/api/orders/${id}`);
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${environment.services.orders}/api/orders`, orderData);
  }

  confirmOrder(id: string): Observable<any> {
    return this.http.put(`${environment.services.orders}/api/orders/${id}/confirm`, {});
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.put(`${environment.services.orders}/api/orders/${id}/cancel`, {});
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${environment.services.orders}/api/orders/${id}`);
  }

  // ─── Reviews ─────────────────────────────────────────────────────────────────

  getReviews(page: number = 0, size: number = 200): Observable<any> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get(`${environment.services.reviews}/api/reviews`, { params });
  }

  getReviewsByProduct(productId: number): Observable<any> {
    return this.http.get(`${environment.services.reviews}/api/reviews/product/${productId}`);
  }

  createReview(review: any): Observable<any> {
    return this.http.post(`${environment.services.reviews}/api/reviews`, review);
  }

  updateReview(id: string, review: any): Observable<any> {
    return this.http.put(`${environment.services.reviews}/api/reviews/${id}`, review);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${environment.services.reviews}/api/reviews/${id}`);
  }

  // ─── Users ───────────────────────────────────────────────────────────────────

  getUsers(): Observable<any> {
    return this.http.get(`${environment.services.users}/api/users`);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${environment.services.users}/api/users/me`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${environment.services.users}/api/users/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${environment.services.users}/api/users`, user);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${environment.services.users}/api/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.services.users}/api/users/${id}`);
  }

  // FIX: was string → changed to number to match acc.id (number) in admin component
  enableUser(id: number): Observable<any> {
    return this.http.patch(`${environment.services.users}/api/users/${id}/enable`, {});
  }

  // FIX: was string → changed to number to match acc.id (number) in admin component
  disableUser(id: number): Observable<any> {
    return this.http.patch(`${environment.services.users}/api/users/${id}/disable`, {});
  }

  // ─── Payments ────────────────────────────────────────────────────────────────

  getPayments(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    return this.http.get(`${environment.services.payments}/api/payments`, { params });
  }

  createPayment(data: any): Observable<any> {
    return this.http.post(`${environment.services.payments}/api/payments`, data);
  }

  getPaymentById(id: string): Observable<any> {
    return this.http.get(`${environment.services.payments}/api/payments/${id}`);
  }

  getPaymentByOrderId(orderId: number): Observable<any> {
    return this.http.get(`${environment.services.payments}/api/payments/order/${orderId}`);
  }

  getPaymentsByUser(userId: number): Observable<any> {
    return this.http.get(`${environment.services.payments}/api/payments/user/${userId}`);
  }

  processPayment(id: string): Observable<any> {
    return this.http.put(`${environment.services.payments}/api/payments/${id}/process`, {});
  }

  refundPayment(id: string): Observable<any> {
    return this.http.put(`${environment.services.payments}/api/payments/${id}/refund`, {});
  }

  retryPayment(id: string): Observable<any> {
    return this.http.put(`${environment.services.payments}/api/payments/${id}/retry`, {});
  }
}