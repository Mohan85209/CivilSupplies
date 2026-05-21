import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '@core/services/wishlist.service';
import { ProductCardComponent } from '@shared/components/product-card/product-card.component';

@Component({
  selector: 'cs-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container">
        <header class="page-header">
          <div>
            <h1>Your wishlist</h1>
            <p class="text-muted">Items saved for later. Submit a quote when you're ready.</p>
          </div>
          @if (wishlist.count() > 0) {
            <div class="header-actions">
              <a routerLink="/quote" class="btn btn--primary">
                <mat-icon>request_quote</mat-icon> Quote all {{ wishlist.count() }}
              </a>
              <button class="btn btn--ghost" (click)="wishlist.clear()">
                <mat-icon>delete_sweep</mat-icon> Clear list
              </button>
            </div>
          }
        </header>

        <div class="grid">
          @for (p of wishlist.items(); track p.id) {
            <cs-product-card [product]="p" />
          } @empty {
            <div class="empty card">
              <mat-icon>favorite_border</mat-icon>
              <h3>No items saved yet</h3>
              <p class="text-muted">Browse the catalog and tap the heart icon to add products here.</p>
              <a routerLink="/products" class="btn btn--secondary">Browse products</a>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-header { display: flex; justify-content: space-between; align-items: end; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
      .header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }
      .empty { grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
      .empty mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: var(--color-text-muted); }
    `,
  ],
})
export class WishlistComponent {
  readonly wishlist = inject(WishlistService);
}
