import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-surface flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-card border-r border-border flex flex-col fixed h-screen">
        <div class="p-6 border-b border-border">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </span>
            <div>
              <h1 class="font-display text-lg font-bold text-foreground">EasyToBuy</h1>
              <p class="text-xs text-primary font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <button (click)="activeSection = 'accounts'; loadAccounts()"
            [class]="getSidebarClass('accounts')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Accounts</span>
          </button>

          <button (click)="activeSection = 'products'; loadProducts()"
            [class]="getSidebarClass('products')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span>Products</span>
          </button>

          <button (click)="activeSection = 'categories'; loadCategories()"
            [class]="getSidebarClass('categories')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Categories</span>
          </button>

          <button (click)="activeSection = 'orders'; loadOrders()"
            [class]="getSidebarClass('orders')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span>Orders</span>
          </button>

          <button (click)="activeSection = 'payments'; loadPayments()"
            [class]="getSidebarClass('payments')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span>Payments</span>
          </button>

          <button (click)="activeSection = 'reviews'; loadReviews()"
            [class]="getSidebarClass('reviews')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Reviews</span>
          </button>
        </nav>

        <div class="p-4 border-t border-border bg-card">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-primary font-bold text-sm">{{ adminName.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-foreground truncate">{{ adminName }}</p>
              <p class="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <button (click)="logout()"
            class="w-full bg-red-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 ml-64 overflow-auto">
        <div class="max-w-7xl mx-auto px-6 py-8">

        <!-- Stats -->
        @if (activeSection === 'orders') {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p class="text-3xl font-bold text-foreground">{{ allOrders.length }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Pending Orders</p>
              <p class="text-3xl font-bold text-yellow-500">{{ countByStatus('PENDING') }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Confirmed</p>
              <p class="text-3xl font-bold text-green-500">{{ countByStatus('CONFIRMED') }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Cancelled</p>
              <p class="text-3xl font-bold text-red-500">{{ countByStatus('CANCELLED') }}</p>
            </div>
          </div>
        }

        @if (activeSection === 'payments') {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Total Payments</p>
              <p class="text-3xl font-bold text-foreground">{{ allPayments.length }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Pending</p>
              <p class="text-3xl font-bold text-yellow-500">{{ countPaymentByStatus('PENDING') }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Completed</p>
              <p class="text-3xl font-bold text-green-500">{{ countPaymentByStatus('COMPLETED') }}</p>
            </div>
            <div class="bg-card rounded-2xl border border-border p-5">
              <p class="text-xs text-muted-foreground mb-1">Failed</p>
              <p class="text-3xl font-bold text-red-500">{{ countPaymentByStatus('FAILED') }}</p>
            </div>
          </div>
        }

        @if (errorMessage) {
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{{ errorMessage }}</div>
        }

        <!-- ACCOUNTS SECTION -->
        @if (activeSection === 'accounts') {
          <h2 class="text-2xl font-bold text-foreground mb-6">Manage Accounts</h2>
          @if (isLoadingAccounts) {
            <div class="text-center py-16 text-muted-foreground">Loading accounts...</div>
          } @else if (accounts.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No accounts found.</div>
          } @else {
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface border-b border-border">
                  <tr>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Username</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Email</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Role</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let acc of accounts"
                    class="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td class="px-6 py-4">{{ acc.id }}</td>
                    <td class="px-6 py-4 font-semibold">{{ acc.username }}</td>
                    <td class="px-6 py-4">{{ acc.email }}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (acc.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')">
                        {{ acc.role }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + (acc.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')">
                        {{ acc.enabled ? 'Active' : 'Disabled' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button (click)="editAccount(acc)" title="Edit Account"
                          class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        @if (acc.enabled) {
                          <button (click)="disableAccount(acc.id)" title="Disable Account"
                            class="p-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                            </svg>
                          </button>
                        } @else {
                          <button (click)="enableAccount(acc.id)" title="Enable Account"
                            class="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        }
                        <button (click)="deleteAccount(acc.id)" title="Delete Account"
                          class="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }

          <!-- Edit Account Modal -->
          @if (editingAccount) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeEditModal()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full" (click)="$event.stopPropagation()">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-border">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-foreground">Edit Account</h3>
                      <p class="text-xs text-muted-foreground">Update user information</p>
                    </div>
                  </div>
                  <button (click)="closeEditModal()" class="p-2 hover:bg-accent rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Username</label>
                    <input type="text" [(ngModel)]="editForm.username"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                      placeholder="username" />
                    <p class="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Admin can change username (will also update in Keycloak)
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                    <input type="email" [(ngModel)]="editForm.email"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                      placeholder="user@example.com" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Role</label>
                    <select [(ngModel)]="editForm.role"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                      <option value="USER">User</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">New Password</label>
                    <input type="password" [(ngModel)]="editForm.password" placeholder="Leave blank to keep current password"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" />
                    <p class="text-xs text-muted-foreground mt-1.5">Only fill this if you want to change the password</p>
                  </div>

                  @if (editError) {
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span>{{ editError }}</span>
                    </div>
                  }
                </div>

                <!-- Modal Footer -->
                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="closeEditModal()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="saveAccountEdit()" [disabled]="isSavingEdit"
                    class="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    @if (isSavingEdit) {
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>Save Changes</span>
                    }
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Delete Confirmation Modal -->
          @if (deleteConfirmAccount) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDeleteAccount()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full" (click)="$event.stopPropagation()">
                <!-- Modal Header -->
                <div class="p-6 border-b border-border">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-foreground mb-1">Delete Account</h3>
                      <p class="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                  <p class="text-foreground mb-4">
                    Are you sure you want to delete the account for 
                    <span class="font-semibold text-primary">{{ deleteConfirmAccount.username }}</span>?
                  </p>
                  <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 flex-shrink-0 mt-0.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div class="text-sm text-red-800">
                        <p class="font-semibold mb-1">Warning</p>
                        <p>All user data, orders, and associated records will be permanently deleted.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Modal Footer -->
                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="cancelDeleteAccount()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="confirmDeleteAccount()"
                    class="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          }
        }

        <!-- PRODUCTS SECTION -->
        @if (activeSection === 'products') {
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-foreground">Manage Products</h2>
            <button (click)="openAddProduct()"
              class="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0284c7] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add Product</span>
            </button>
          </div>
          @if (isLoadingProducts) {
            <div class="text-center py-16 text-muted-foreground">Loading products...</div>
          } @else if (products.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No products found.</div>
          } @else {
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface border-b border-border">
                  <tr>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Name</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Price</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Stock</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Category</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let prod of products"
                    class="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td class="px-6 py-4">{{ prod.id }}</td>
                    <td class="px-6 py-4 font-semibold">{{ prod.name }}</td>
                    <td class="px-6 py-4">TND {{ prod.price?.toFixed(2) }}</td>
                    <td class="px-6 py-4">{{ prod.stock }}</td>
                    <td class="px-6 py-4">{{ prod.categoryId }}</td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        <button (click)="openEditProduct(prod)" title="Edit Product"
                          class="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button (click)="deleteProduct(prod.id)" title="Delete Product"
                          class="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }

          <!-- Add/Edit Product Modal -->
          @if (addingProduct || editingProduct) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeProductModal()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-foreground">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
                      <p class="text-xs text-muted-foreground">{{ editingProduct ? 'Update product information' : 'Create a new product' }}</p>
                    </div>
                  </div>
                  <button (click)="closeProductModal()" class="p-2 hover:bg-accent rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Product Name</label>
                    <input type="text" [(ngModel)]="productForm.name"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                      placeholder="Enter product name" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Description</label>
                    <textarea [(ngModel)]="productForm.description" rows="3"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" 
                      placeholder="Enter product description"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-foreground mb-2">Price ($)</label>
                      <input type="number" [(ngModel)]="productForm.price" step="0.01" min="0"
                        class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                        placeholder="0.00" />
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-foreground mb-2">Stock</label>
                      <input type="number" [(ngModel)]="productForm.stock" min="0"
                        class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                        placeholder="0" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Category</label>
                    <select [(ngModel)]="productForm.categoryId"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                      <option [value]="0" disabled>Select a category</option>
                      <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Product Image</label>
                    
                    <!-- Image Preview -->
                    @if (imagePreview) {
                      <div class="mb-3 relative inline-block">
                        <img [src]="imagePreview" 
                          alt="Product preview" 
                          class="w-32 h-32 object-cover rounded-xl border-2 border-border" />
                        <button type="button" (click)="clearImage()" 
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    }
                    
                    <!-- Upload Button -->
                    <div class="flex gap-3">
                      <label class="flex-1 cursor-pointer">
                        <div class="w-full px-4 py-3 bg-surface border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span class="text-sm font-semibold">Upload from Desktop</span>
                        </div>
                        <input type="file" #fileInput (change)="onFileSelected($event)" 
                          accept="image/*" class="hidden" />
                      </label>
                    </div>
                    
                    <!-- OR Divider -->
                    <div class="flex items-center gap-3 my-3">
                      <div class="flex-1 h-px bg-border"></div>
                      <span class="text-xs text-muted-foreground font-medium">OR</span>
                      <div class="flex-1 h-px bg-border"></div>
                    </div>
                    
                    <!-- URL Input -->
                    <input type="text" [(ngModel)]="productForm.imageUrl" (ngModelChange)="onUrlChange()"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                      placeholder="Or paste image URL" />
                    <p class="text-xs text-muted-foreground mt-1.5">Upload an image or provide a URL</p>
                  </div>

                  @if (productError) {
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span>{{ productError }}</span>
                    </div>
                  }
                </div>

                <!-- Modal Footer -->
                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="closeProductModal()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="saveProduct()" [disabled]="isSavingProduct"
                    class="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    @if (isSavingProduct) {
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{{ editingProduct ? 'Save Changes' : 'Create Product' }}</span>
                    }
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Delete Product Confirmation Modal -->
          @if (deleteConfirmProduct) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDeleteProduct()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full" (click)="$event.stopPropagation()">
                <div class="p-6 border-b border-border">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-foreground mb-1">Delete Product</h3>
                      <p class="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                <div class="p-6">
                  <p class="text-foreground mb-4">
                    Are you sure you want to delete 
                    <span class="font-semibold text-primary">{{ deleteConfirmProduct.name }}</span>?
                  </p>
                  <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 flex-shrink-0 mt-0.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div class="text-sm text-red-800">
                        <p class="font-semibold mb-1">Warning</p>
                        <p>This product will be permanently removed from the catalog.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="cancelDeleteProduct()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="confirmDeleteProduct()"
                    class="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span>Delete Product</span>
                  </button>
                </div>
              </div>
            </div>
          }
        }

        <!-- CATEGORIES SECTION -->
        @if (activeSection === 'categories') {
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-foreground">Manage Categories</h2>
            <button (click)="openAddCategory()"
              class="bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0284c7] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add Category</span>
            </button>
          </div>
          @if (isLoadingCategories) {
            <div class="text-center py-16 text-muted-foreground">Loading categories...</div>
          } @else if (categories.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No categories found.</div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div *ngFor="let cat of categories"
                class="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-lg font-bold text-foreground">{{ cat.name }}</h3>
                  <div class="flex gap-2">
                    <button (click)="openEditCategory(cat)" title="Edit Category"
                      class="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button (click)="deleteCategory(cat.id)" title="Delete Category"
                      class="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <p class="text-sm text-muted-foreground">{{ cat.description }}</p>
              </div>
            </div>
          }

          <!-- Add/Edit Category Modal -->
          @if (addingCategory || editingCategory) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeCategoryModal()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full" (click)="$event.stopPropagation()">
                <!-- Modal Header -->
                <div class="flex items-center justify-between p-6 border-b border-border">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-foreground">{{ editingCategory ? 'Edit Category' : 'Add Category' }}</h3>
                      <p class="text-xs text-muted-foreground">{{ editingCategory ? 'Update category information' : 'Create a new category' }}</p>
                    </div>
                  </div>
                  <button (click)="closeCategoryModal()" class="p-2 hover:bg-accent rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Category Name</label>
                    <input type="text" [(ngModel)]="categoryForm.name"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all" 
                      placeholder="Enter category name" />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-foreground mb-2">Description</label>
                    <textarea [(ngModel)]="categoryForm.description" rows="3"
                      class="w-full px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" 
                      placeholder="Enter category description"></textarea>
                  </div>

                  @if (categoryError) {
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span>{{ categoryError }}</span>
                    </div>
                  }
                </div>

                <!-- Modal Footer -->
                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="closeCategoryModal()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="saveCategory()" [disabled]="isSavingCategory"
                    class="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-[#0284c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    @if (isSavingCategory) {
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{{ editingCategory ? 'Save Changes' : 'Create Category' }}</span>
                    }
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Delete Category Confirmation Modal -->
          @if (deleteConfirmCategory) {
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDeleteCategory()">
              <div class="bg-card rounded-2xl border border-border shadow-2xl max-w-md w-full" (click)="$event.stopPropagation()">
                <div class="p-6 border-b border-border">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-xl font-bold text-foreground mb-1">Delete Category</h3>
                      <p class="text-sm text-muted-foreground">This action cannot be undone</p>
                    </div>
                  </div>
                </div>

                <div class="p-6">
                  <p class="text-foreground mb-4">
                    Are you sure you want to delete 
                    <span class="font-semibold text-primary">{{ deleteConfirmCategory.name }}</span>?
                  </p>
                  <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div class="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 flex-shrink-0 mt-0.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div class="text-sm text-red-800">
                        <p class="font-semibold mb-1">Warning</p>
                        <p>All products in this category may be affected.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 p-6 border-t border-border bg-surface/30">
                  <button (click)="cancelDeleteCategory()"
                    class="flex-1 px-5 py-3 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold text-foreground">
                    Cancel
                  </button>
                  <button (click)="confirmDeleteCategory()"
                    class="flex-1 bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    <span>Delete Category</span>
                  </button>
                </div>
              </div>
            </div>
          }
        }

        <!-- REVIEWS SECTION -->
        @if (activeSection === 'reviews') {
          <h2 class="text-2xl font-bold text-foreground mb-6">Manage Reviews</h2>
          @if (isLoadingReviews) {
            <div class="text-center py-16 text-muted-foreground">Loading reviews...</div>
          } @else if (reviews.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No reviews found.</div>
          } @else {
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface border-b border-border">
                  <tr>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Product ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">User ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Rating</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Comment</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let rev of reviews"
                    class="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td class="px-6 py-4">{{ rev.id }}</td>
                    <td class="px-6 py-4">{{ rev.productId }}</td>
                    <td class="px-6 py-4">{{ rev.userId }}</td>
                    <td class="px-6 py-4">
                      <span class="text-yellow-500 font-semibold">★ {{ rev.rating }}/5</span>
                    </td>
                    <td class="px-6 py-4 max-w-xs truncate">{{ rev.comment }}</td>
                    <td class="px-6 py-4">
                      <button (click)="deleteReview(rev.id)"
                        class="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        }

        <!-- ORDERS SECTION -->
        @if (activeSection === 'orders') {
          <h2 class="text-2xl font-bold text-foreground mb-6">Manage Orders</h2>
          <div class="flex gap-2 mb-4">
            <button *ngFor="let f of orderFilters" (click)="activeOrderFilter = f; applyOrderFilter()"
              [class]="'px-4 py-2 rounded-xl text-sm font-semibold transition-colors ' +
                (activeOrderFilter === f ? 'bg-primary text-white' : 'bg-card border border-border text-foreground hover:bg-accent')">
              {{ f }}
            </button>
          </div>
          @if (isLoadingOrders) {
            <div class="text-center py-16 text-muted-foreground">Loading orders...</div>
          } @else if (filteredOrders.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No orders found.</div>
          } @else {
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface border-b border-border">
                  <tr>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Reference</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">User ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Product ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Qty</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Total</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of filteredOrders"
                    class="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td class="px-6 py-4 font-mono text-xs">{{ order.reference }}</td>
                    <td class="px-6 py-4">{{ order.userId }}</td>
                    <td class="px-6 py-4">{{ order.productId }}</td>
                    <td class="px-6 py-4">{{ order.quantity }}</td>
                    <td class="px-6 py-4 font-semibold">TND {{ order.totalAmount?.toFixed(2) }}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        @if (order.status === 'PENDING') {
                          <button (click)="confirmOrder(order.id)"
                            class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold">
                            Confirm
                          </button>
                          <button (click)="cancelOrder(order.id)"
                            class="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold">
                            Cancel
                          </button>
                        }
                        @if (order.status === 'CONFIRMED') {
                          <button (click)="createPaymentForOrder(order)"
                            class="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-semibold">
                            Init Payment
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        }

        <!-- PAYMENTS SECTION -->
        @if (activeSection === 'payments') {
          <h2 class="text-2xl font-bold text-foreground mb-6">Manage Payments</h2>
          <div class="flex gap-2 mb-4">
            <button *ngFor="let f of paymentFilters" (click)="activePaymentFilter = f; applyPaymentFilter()"
              [class]="'px-4 py-2 rounded-xl text-sm font-semibold transition-colors ' +
                (activePaymentFilter === f ? 'bg-primary text-white' : 'bg-card border border-border text-foreground hover:bg-accent')">
              {{ f }}
            </button>
          </div>
          @if (isLoadingPayments) {
            <div class="text-center py-16 text-muted-foreground">Loading payments...</div>
          } @else if (filteredPayments.length === 0) {
            <div class="text-center py-16 text-muted-foreground">No payments found.</div>
          } @else {
            <div class="bg-card rounded-2xl border border-border overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-surface border-b border-border">
                  <tr>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Reference</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Order ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">User ID</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Amount</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Method</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Status</th>
                    <th class="text-left px-6 py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of filteredPayments"
                    class="border-b border-border last:border-0 hover:bg-surface transition-colors">
                    <td class="px-6 py-4 font-mono text-xs">{{ p.reference }}</td>
                    <td class="px-6 py-4">{{ p.orderId }}</td>
                    <td class="px-6 py-4">{{ p.userId }}</td>
                    <td class="px-6 py-4 font-semibold">TND {{ p.amount?.toFixed(2) }}</td>
                    <td class="px-6 py-4">{{ p.method }}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 rounded-full text-xs font-semibold ' + getPaymentClass(p.status)">
                        {{ p.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        @if (p.status === 'PENDING') {
                          <button (click)="processPayment(p.id)"
                            class="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold">
                            Process
                          </button>
                        }
                        @if (p.status === 'FAILED') {
                          <button (click)="retryPayment(p.id)"
                            class="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 font-semibold">
                            Retry
                          </button>
                        }
                        @if (p.status === 'COMPLETED') {
                          <button (click)="refundPayment(p.id)"
                            class="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold">
                            Refund
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        }

        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeSection = 'orders';
  
  // Accounts
  accounts: any[] = [];
  isLoadingAccounts = false;
  editingAccount: any = null;
  editForm = { username: '', email: '', role: '', password: '' };
  editError = '';
  isSavingEdit = false;
  deleteConfirmAccount: any = null;

  // Products
  products: any[] = [];
  isLoadingProducts = false;
  editingProduct: any = null;
  addingProduct = false;
  productForm: { 
    name: string; 
    description: string; 
    price: number; 
    stock: number; 
    categoryId: number | string; 
    imageUrl: string 
  } = { name: '', description: '', price: 0, stock: 0, categoryId: 0, imageUrl: '' };
  productError = '';
  isSavingProduct = false;
  deleteConfirmProduct: any = null;
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  // Categories
  categories: any[] = [];
  isLoadingCategories = false;
  editingCategory: any = null;
  addingCategory = false;
  categoryForm = { name: '', description: '' };
  categoryError = '';
  isSavingCategory = false;
  deleteConfirmCategory: any = null;

  // Reviews
  reviews: any[] = [];
  isLoadingReviews = false;

  // Orders
  allOrders: any[] = [];
  filteredOrders: any[] = [];
  orderFilters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];
  activeOrderFilter = 'PENDING';
  isLoadingOrders = true;

  // Payments
  allPayments: any[] = [];
  filteredPayments: any[] = [];
  paymentFilters = ['ALL', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
  activePaymentFilter = 'PENDING';
  isLoadingPayments = false;
  paymentsLoaded = false;

  errorMessage = '';
  adminName = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminName = this.authService.getCurrentUser()?.preferred_username || 'Admin';
    this.loadOrders();
  }

  getSidebarClass(section: string): string {
    const base = 'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ';
    return base + (this.activeSection === section 
      ? 'bg-primary text-white' 
      : 'text-foreground hover:bg-accent');
  }

  // ACCOUNTS
  loadAccounts(): void {
    if (this.accounts.length > 0) return;
    this.isLoadingAccounts = true;
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.accounts = users;
        this.isLoadingAccounts = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load accounts.';
        this.isLoadingAccounts = false;
      }
    });
  }

  enableAccount(id: number): void {
    this.apiService.enableUser(id).subscribe({
      next: () => {
        const acc = this.accounts.find(a => a.id === id);
        if (acc) acc.enabled = true;
      },
      error: () => alert('Failed to enable account.')
    });
  }

  disableAccount(id: number): void {
    this.apiService.disableUser(id).subscribe({
      next: () => {
        const acc = this.accounts.find(a => a.id === id);
        if (acc) acc.enabled = false;
      },
      error: () => alert('Failed to disable account.')
    });
  }

  editAccount(account: any): void {
    this.editingAccount = account;
    this.editForm = {
      username: account.username,
      email: account.email,
      role: account.role,
      password: ''
    };
    this.editError = '';
  }

  closeEditModal(): void {
    this.editingAccount = null;
    this.editForm = { username: '', email: '', role: '', password: '' };
    this.editError = '';
  }

  saveAccountEdit(): void {
    if (!this.editingAccount) return;

    this.isSavingEdit = true;
    this.editError = '';

    const payload: any = {
      username: this.editForm.username.trim(),
      email: this.editForm.email.trim(),
      role: this.editForm.role
    };
    if (this.editForm.password.trim()) {
      payload.password = this.editForm.password;
    }

    this.apiService.updateUser(String(this.editingAccount.id), payload).subscribe({
      next: (updated) => {
        const acc = this.accounts.find(a => a.id === this.editingAccount.id);
        if (acc) {
          acc.username = updated.username;
          acc.email = updated.email;
          acc.role = updated.role;
        }
        this.isSavingEdit = false;
        this.closeEditModal();
      },
      error: (err: any) => {
        this.isSavingEdit = false;
        this.editError = err?.error?.message || 'Failed to update account.';
      }
    });
  }

  deleteAccount(id: number): void {
    const account = this.accounts.find(a => a.id === id);
    if (account) {
      this.deleteConfirmAccount = account;
    }
  }

  confirmDeleteAccount(): void {
    if (!this.deleteConfirmAccount) return;
    
    this.apiService.deleteUser(String(this.deleteConfirmAccount.id)).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(a => a.id !== this.deleteConfirmAccount.id);
        this.deleteConfirmAccount = null;
      },
      error: () => {
        alert('Failed to delete account.');
        this.deleteConfirmAccount = null;
      }
    });
  }

  cancelDeleteAccount(): void {
    this.deleteConfirmAccount = null;
  }

  // PRODUCTS
  loadProducts(): void {
    if (this.products.length > 0) return;
    this.isLoadingProducts = true;
    this.apiService.getProducts(0, 200).subscribe({
      next: (response) => {
        this.products = response.content || response;
        this.isLoadingProducts = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load products.';
        this.isLoadingProducts = false;
      }
    });
  }

  openAddProduct(): void {
    this.addingProduct = true;
    this.productForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, imageUrl: '' };
    this.productError = '';
    this.imagePreview = null;
    this.selectedImageFile = null;
    // Load categories if not already loaded
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }

  openEditProduct(product: any): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || ''
    };
    this.productError = '';
    this.imagePreview = null;
    this.selectedImageFile = null;
    // Load categories if not already loaded
    if (this.categories.length === 0) {
      this.loadCategories();
    }
  }

  closeProductModal(): void {
    this.addingProduct = false;
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, stock: 0, categoryId: 0, imageUrl: '' };
    this.productError = '';
    this.imagePreview = null;
    this.selectedImageFile = null;
  }


  saveProduct(): void {
    this.isSavingProduct = true;
    this.productError = '';

    // Convert categoryId to number (select returns string)
    const categoryIdNum = typeof this.productForm.categoryId === 'string' 
        ? parseInt(this.productForm.categoryId as string, 10) 
        : this.productForm.categoryId as number;
    
    // FIX: send null when no category is selected (0 means "not chosen")
    const categoryId = categoryIdNum > 0 ? categoryIdNum : null;

    // FIX: get real userId from the logged-in admin token, never hardcode 1
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.sub
        ? parseInt(currentUser.sub as string, 10) || 1
        : 1;

    // FIX: Don't send base64 data - only send filename or URL
    let imageUrl = this.productForm.imageUrl.trim();
    if (imageUrl.startsWith('data:image')) {
      // If base64 data somehow got into the field, use the filename instead
      imageUrl = this.selectedImageFile ? this.selectedImageFile.name : '';
    }

    const payload = {
      name: this.productForm.name.trim(),
      description: this.productForm.description.trim(),
      price: this.productForm.price,
      stock: this.productForm.stock,
      categoryId: categoryId,           // ← was always sending 0
      imageUrl: imageUrl,
      userId: this.editingProduct?.userId ?? userId   // ← was hardcoded to 1
    };

    if (this.editingProduct) {
      this.apiService.updateProduct(this.editingProduct.id, payload).subscribe({
        next: (updated) => {
          const prod = this.products.find(p => p.id === this.editingProduct.id);
          if (prod) Object.assign(prod, updated);
          this.isSavingProduct = false;
          this.closeProductModal();
        },
        error: (err: any) => {
          this.isSavingProduct = false;
          this.productError = err?.error?.message || 'Failed to update product.';
        }
      });
    } else {
      this.apiService.createProduct(payload).subscribe({
        next: (created) => {
          this.products.unshift(created);
          this.isSavingProduct = false;
          this.closeProductModal();
        },
        error: (err: any) => {
          this.isSavingProduct = false;
          this.productError = err?.error?.message || 'Failed to create product.';
        }
      });
    }
  }


  deleteProduct(id: number): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.deleteConfirmProduct = product;
    }
  }

  confirmDeleteProduct(): void {
    if (!this.deleteConfirmProduct) return;
    
    this.apiService.deleteProduct(this.deleteConfirmProduct.id)
.subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.deleteConfirmProduct.id);
        this.deleteConfirmProduct = null;
      },
      error: () => {
        alert('Failed to delete product.');
        this.deleteConfirmProduct = null;
      }
    });
  }

  cancelDeleteProduct(): void {
    this.deleteConfirmProduct = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.productError = 'Please select a valid image file.';
      return;
    }

    this.selectedImageFile = file;
    this.productError = '';

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e: any) => { this.imagePreview = e.target.result; };
    reader.readAsDataURL(file);

    // Upload to backend and store the returned URL
    this.apiService.uploadProductImage(file).subscribe({
      next: (res) => {
        // Build full URL so the image is accessible
        this.productForm.imageUrl = `http://localhost:8083${res.url}`;
      },
      error: () => {
        this.productError = 'Image upload failed. Try again.';
      }
    });
  }

  onUrlChange(): void {
    // Clear file selection if user types a URL
    if (this.productForm.imageUrl && !this.productForm.imageUrl.startsWith('data:')) {
      this.selectedImageFile = null;
      this.imagePreview = null;
    }
  }

  clearImage(): void {
    this.productForm.imageUrl = '';
    this.imagePreview = null;
    this.selectedImageFile = null;
    this.productError = '';
  }

  // CATEGORIES
  loadCategories(): void {
    if (this.categories.length > 0) return;
    this.isLoadingCategories = true;
    this.apiService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.isLoadingCategories = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load categories.';
        this.isLoadingCategories = false;
      }
    });
  }

  openAddCategory(): void {
    this.addingCategory = true;
    this.categoryForm = { name: '', description: '' };
    this.categoryError = '';
  }

  openEditCategory(category: any): void {
    this.editingCategory = category;
    this.categoryForm = {
      name: category.name,
      description: category.description
    };
    this.categoryError = '';
  }

  closeCategoryModal(): void {
    this.addingCategory = false;
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '' };
    this.categoryError = '';
  }

  saveCategory(): void {
    this.isSavingCategory = true;
    this.categoryError = '';

    const payload = {
      name: this.categoryForm.name.trim(),
      description: this.categoryForm.description.trim()
    };

    if (this.editingCategory) {
      // Update existing category
      this.apiService.updateCategory(this.editingCategory.id, payload).subscribe({
        next: (updated) => {
          const cat = this.categories.find(c => c.id === this.editingCategory.id);
          if (cat) {
            Object.assign(cat, updated);
          }
          this.isSavingCategory = false;
          this.closeCategoryModal();
        },
        error: (err: any) => {
          this.isSavingCategory = false;
          this.categoryError = err?.error?.message || 'Failed to update category.';
        }
      });
    } else {
      // Create new category
      this.apiService.createCategory(payload).subscribe({
        next: (created) => {
          this.categories.unshift(created);
          this.isSavingCategory = false;
          this.closeCategoryModal();
        },
        error: (err: any) => {
          this.isSavingCategory = false;
          this.categoryError = err?.error?.message || 'Failed to create category.';
        }
      });
    }
  }

  deleteCategory(id: number): void {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      this.deleteConfirmCategory = category;
    }
  }

  confirmDeleteCategory(): void {
    if (!this.deleteConfirmCategory) return;
    
    this.apiService.deleteCategory(this.deleteConfirmCategory.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== this.deleteConfirmCategory.id);
        this.deleteConfirmCategory = null;
      },
      error: () => {
        alert('Failed to delete category.');
        this.deleteConfirmCategory = null;
      }
    });
  }

  cancelDeleteCategory(): void {
    this.deleteConfirmCategory = null;
  }

  // REVIEWS
  loadReviews(): void {
    if (this.reviews.length > 0) return;
    this.isLoadingReviews = true;
    this.apiService.getReviews(0, 200).subscribe({
      next: (response) => {
        this.reviews = response.content || response;
        this.isLoadingReviews = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load reviews.';
        this.isLoadingReviews = false;
      }
    });
  }

  deleteReview(id: number): void {
    if (!confirm('Delete this review?')) return;
    this.apiService.deleteReview(String(id)).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      },
      error: () => alert('Failed to delete review.')
    });
  }

  // ORDERS

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.errorMessage = '';
    this.apiService.getOrders(0, 200).subscribe({
      next: (response) => {
        this.allOrders = response.content || response;
        this.applyOrderFilter();
        this.isLoadingOrders = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load orders.';
        this.isLoadingOrders = false;
      }
    });
  }

  loadPayments(): void {
    if (this.paymentsLoaded) return;
    this.isLoadingPayments = true;
    this.apiService.getPayments(0, 200).subscribe({
      next: (response) => {
        this.allPayments = response.content || response;
        this.applyPaymentFilter();
        this.isLoadingPayments = false;
        this.paymentsLoaded = true;
      },
      error: () => {
        this.errorMessage = 'Failed to load payments.';
        this.isLoadingPayments = false;
      }
    });
  }

  applyOrderFilter(): void {
    this.filteredOrders = this.activeOrderFilter === 'ALL'
      ? this.allOrders
      : this.allOrders.filter(o => o.status === this.activeOrderFilter);
  }

  applyPaymentFilter(): void {
    this.filteredPayments = this.activePaymentFilter === 'ALL'
      ? this.allPayments
      : this.allPayments.filter(p => p.status === this.activePaymentFilter);
  }

  countByStatus(status: string): number {
    return this.allOrders.filter(o => o.status === status).length;
  }

  countPaymentByStatus(status: string): number {
    return this.allPayments.filter(p => p.status === status).length;
  }

  confirmOrder(id: number): void {
    this.apiService.confirmOrder(String(id)).subscribe({
      next: () => { this.loadOrders(); this.paymentsLoaded = false; },
      error: () => alert('Failed to confirm order.')
    });
  }

  createPaymentForOrder(order: any): void {
    const data = {
      orderId: order.id,
      userId: order.userId,
      amount: order.totalAmount,
      method: 'CASH_ON_DELIVERY'
    };
    this.apiService.createPayment(data).subscribe({
      next: () => {
        alert(`Payment created for Order #${order.id}`);
        this.paymentsLoaded = false;
      },
      error: (err: any) => {
        if (err.status === 400) {
          alert(`Payment already exists for Order #${order.id}`);
        } else {
          alert('Failed to create payment.');
        }
      }
    });
  }

  cancelOrder(id: number): void {
    if (!confirm('Cancel this order?')) return;
    this.apiService.cancelOrder(String(id)).subscribe({
      next: () => this.loadOrders(),
      error: () => alert('Failed to cancel order.')
    });
  }

  processPayment(id: string): void {
    this.apiService.processPayment(id).subscribe({
      next: () => { this.paymentsLoaded = false; this.loadPayments(); },
      error: () => alert('Failed to process payment.')
    });
  }

  retryPayment(id: string): void {
    this.apiService.retryPayment(id).subscribe({
      next: () => { this.paymentsLoaded = false; this.loadPayments(); },
      error: () => alert('Failed to retry payment.')
    });
  }

  refundPayment(id: string): void {
    if (!confirm('Refund this payment?')) return;
    this.apiService.refundPayment(id).subscribe({
      next: () => { this.paymentsLoaded = false; this.loadPayments(); },
      error: () => alert('Failed to refund payment.')
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
