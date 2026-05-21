import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/domain.models';

const KEY = 'cs.wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _items = signal<Product[]>(this.read());
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);

  toggle(product: Product): void {
    const exists = this._items().some((p) => p.id === product.id);
    const next = exists
      ? this._items().filter((p) => p.id !== product.id)
      : [...this._items(), product];
    this.persist(next);
  }

  has(productId: number): boolean {
    return this._items().some((p) => p.id === productId);
  }

  clear(): void {
    this.persist([]);
  }

  private persist(next: Product[]): void {
    this._items.set(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  private read(): Product[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Product[];
    } catch {
      return [];
    }
  }
}
