import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'cs-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <h2 class="sidebar-brand"><mat-icon>admin_panel_settings</mat-icon> Admin</h2>
        <nav>
          <a routerLink="dashboard" routerLinkActive="is-active"><mat-icon>dashboard</mat-icon> Dashboard</a>
          <a routerLink="enquiries" routerLinkActive="is-active"><mat-icon>contact_mail</mat-icon> Enquiries</a>
          <a routerLink="quotes" routerLinkActive="is-active"><mat-icon>request_quote</mat-icon> Quotes</a>
          <a routerLink="products" routerLinkActive="is-active"><mat-icon>inventory_2</mat-icon> Products</a>
          <a routerLink="users" routerLinkActive="is-active"><mat-icon>group</mat-icon> Users</a>
        </nav>
        <div class="sidebar-foot">
          <small class="text-muted">Signed in as</small>
          <strong>{{ auth.user()?.email }}</strong>
          <button class="btn btn--ghost btn--block" (click)="auth.logout()"><mat-icon>logout</mat-icon> Sign out</button>
        </div>
      </aside>
      <section class="admin-main">
        <router-outlet />
      </section>
    </div>
  `,
  styles: [
    `
      .admin-layout { display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - var(--header-height)); }
      .sidebar { background: var(--color-surface); border-right: 1px solid var(--color-border); padding: 1.5rem 1rem; display: flex; flex-direction: column; }
      .sidebar-brand { display: inline-flex; align-items: center; gap: 0.4rem; color: var(--color-navy); margin: 0 0 1.5rem; font-family: var(--font-display); }
      .sidebar nav { display: flex; flex-direction: column; gap: 0.25rem; }
      .sidebar nav a { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); color: var(--color-text); font-weight: 500; }
      .sidebar nav a:hover { background: var(--color-surface-2); color: var(--color-navy); }
      .sidebar nav a.is-active { background: var(--color-navy); color: #fff; }
      .sidebar nav a.is-active mat-icon { color: var(--color-orange); }
      .sidebar-foot { margin-top: auto; display: flex; flex-direction: column; gap: 0.4rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); }
      .admin-main { padding: 1.75rem; overflow: auto; }
      @media (max-width: 800px) {
        .admin-layout { grid-template-columns: 1fr; }
        .sidebar { display: none; }
      }
    `,
  ],
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
}
