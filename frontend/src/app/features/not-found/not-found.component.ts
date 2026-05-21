import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'cs-not-found',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container not-found">
        <mat-icon>error_outline</mat-icon>
        <h1>404 — page not found</h1>
        <p>The page you're looking for may have moved, or never existed.</p>
        <div class="cta">
          <a routerLink="/" class="btn btn--secondary"><mat-icon>home</mat-icon> Back to home</a>
          <a routerLink="/contact" class="btn btn--ghost"><mat-icon>support_agent</mat-icon> Contact support</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .not-found { text-align: center; max-width: 540px; margin: 0 auto; padding: 3rem 0; }
      .not-found mat-icon { font-size: 4rem; width: 4rem; height: 4rem; color: var(--color-orange); margin-bottom: 0.5rem; }
      .cta { display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap; }
    `,
  ],
})
export class NotFoundComponent {}
