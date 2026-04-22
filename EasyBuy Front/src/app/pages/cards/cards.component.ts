import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardService, Card } from '../../services/card.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen py-16 bg-surface">
      <div class="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 class="font-display text-3xl font-bold text-foreground mb-8">My Cards</h1>

        <!-- Card list -->
        @if (cards.length === 0) {
          <div class="bg-card rounded-2xl border border-border p-10 text-center text-muted-foreground mb-8">
            No cards saved yet. Add one below.
          </div>
        }

        <div class="space-y-4 mb-8">
          @for (card of cards; track card.id) {
            <div class="bg-card rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div [class]="'w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ' + cardBg(card.type)">
                  {{ cardIcon(card.type) }}
                </div>
                <div>
                  <p class="font-semibold text-foreground">{{ card.label }}</p>
                  <p class="text-xs text-muted-foreground">{{ card.holderName }} &bull; {{ card.expiry }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button (click)="startEdit(card)"
                  class="text-xs px-3 py-1 border border-border rounded-lg hover:bg-accent transition-colors">
                  Edit
                </button>
                <button (click)="deleteCard(card.id)"
                  class="text-xs px-3 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Add / Edit form -->
        <div class="bg-card rounded-2xl border border-border p-6">
          <h2 class="font-semibold text-foreground text-lg mb-5">{{ editingId ? 'Edit Card' : 'Add New Card' }}</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Card Type</label>
              <select [(ngModel)]="form.type" (ngModelChange)="updateLabel()"
                class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40">
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="PAYPAL">PayPal</option>
                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              </select>
            </div>

            @if (form.type !== 'CASH_ON_DELIVERY') {
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Cardholder Name</label>
                <input type="text" [(ngModel)]="form.holderName" placeholder="John Doe"
                  class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">Last 4 digits</label>
                  <input type="text" [(ngModel)]="form.last4" (ngModelChange)="updateLabel()" maxlength="4" placeholder="4242"
                    class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">Expiry (MM/YY)</label>
                  <input type="text" [(ngModel)]="form.expiry" maxlength="5" placeholder="12/27"
                    class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">RIB (Bank Account Number)</label>
                <input type="text" [(ngModel)]="form.rib" placeholder="e.g. 12345678901234567890"
                  class="w-full px-4 py-2.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            } @else {
              <p class="text-sm text-muted-foreground">Pay with cash when your order is delivered.</p>
            }

            @if (error) {
              <p class="text-sm text-red-600">{{ error }}</p>
            }

            <div class="flex gap-3 pt-2">
              <button (click)="save()"
                class="flex-1 bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-[#0284c7] transition-colors">
                {{ editingId ? 'Save Changes' : 'Add Card' }}
              </button>
              @if (editingId) {
                <button (click)="cancelEdit()"
                  class="px-5 py-2.5 border border-border rounded-xl hover:bg-accent transition-colors text-sm font-semibold">
                  Cancel
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];
  editingId: string | null = null;
  error = '';

  form = { type: 'CREDIT_CARD', holderName: '', last4: '', expiry: '', rib: '', label: '' };

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.cards = this.cardService.getCards();
  }

  updateLabel(): void {
    if (this.form.type === 'CASH_ON_DELIVERY') {
      this.form.label = 'Cash on Delivery';
    } else if (this.form.type === 'PAYPAL') {
      this.form.label = this.form.last4 ? `PayPal ending in ${this.form.last4}` : 'PayPal';
    } else {
      this.form.label = this.form.last4 ? `Visa ending in ${this.form.last4}` : 'Credit Card';
    }
  }

  save(): void {
    this.error = '';
    if (this.form.type !== 'CASH_ON_DELIVERY') {
      if (!this.form.holderName.trim()) { this.error = 'Cardholder name is required.'; return; }
      if (!/^\d{4}$/.test(this.form.last4)) { this.error = 'Enter exactly 4 digits.'; return; }
      if (!/^\d{2}\/\d{2}$/.test(this.form.expiry)) { this.error = 'Expiry must be MM/YY.'; return; }
    }
    this.updateLabel();

    if (this.editingId) {
      this.cardService.updateCard(this.editingId, { ...this.form });
    } else {
      this.cardService.addCard({ ...this.form });
    }
    this.cards = this.cardService.getCards();
    this.resetForm();
  }

  startEdit(card: Card): void {
    this.editingId = card.id;
    this.form = { type: card.type, holderName: card.holderName, last4: card.last4, expiry: card.expiry, rib: (card as any).rib || '', label: card.label };
  }

  cancelEdit(): void { this.resetForm(); }

  deleteCard(id: string): void {
    if (!confirm('Remove this card?')) return;
    this.cardService.deleteCard(id);
    this.cards = this.cardService.getCards();
  }

  resetForm(): void {
    this.editingId = null;
    this.error = '';
    this.form = { type: 'CREDIT_CARD', holderName: '', last4: '', expiry: '', rib: '', label: '' };
  }

  cardBg(type: string): string {
    return type === 'PAYPAL' ? 'bg-blue-500' : type === 'CASH_ON_DELIVERY' ? 'bg-gray-500' : 'bg-gradient-to-r from-primary to-blue-600';
  }

  cardIcon(type: string): string {
    return type === 'PAYPAL' ? 'PP' : type === 'CASH_ON_DELIVERY' ? 'COD' : 'VISA';
  }
}
