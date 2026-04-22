import { Injectable } from '@angular/core';

export interface Card {
  id: string;
  label: string;       // e.g. "Visa ending in 4242"
  type: string;        // CREDIT_CARD | PAYPAL | CASH_ON_DELIVERY
  last4: string;
  holderName: string;
  expiry: string;      // MM/YY
}

@Injectable({ providedIn: 'root' })
export class CardService {
  private KEY = 'user_cards';

  getCards(): Card[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch {
      return [];
    }
  }

  addCard(card: Omit<Card, 'id'>): Card {
    const cards = this.getCards();
    const newCard: Card = { ...card, id: crypto.randomUUID() };
    cards.push(newCard);
    localStorage.setItem(this.KEY, JSON.stringify(cards));
    return newCard;
  }

  updateCard(id: string, data: Omit<Card, 'id'>): void {
    const cards = this.getCards().map(c => c.id === id ? { ...data, id } : c);
    localStorage.setItem(this.KEY, JSON.stringify(cards));
  }

  deleteCard(id: string): void {
    const cards = this.getCards().filter(c => c.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(cards));
  }
}
