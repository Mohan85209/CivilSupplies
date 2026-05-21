import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { Enquiry, PageResponse, Quote } from '@core/models/domain.models';

@Component({
  selector: 'cs-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Dashboard</h1>
      <p class="text-muted">Operational snapshot of enquiries, quotes, and pipeline status.</p>
    </header>

    <div class="kpi-grid">
      <article class="card kpi">
        <span class="kpi-icon enquiry"><mat-icon>contact_mail</mat-icon></span>
        <div>
          <small>Total enquiries</small>
          <strong>{{ enquiries()?.totalElements ?? '—' }}</strong>
          <a routerLink="../enquiries" class="link-arrow">View all <mat-icon>arrow_forward</mat-icon></a>
        </div>
      </article>
      <article class="card kpi">
        <span class="kpi-icon quote"><mat-icon>request_quote</mat-icon></span>
        <div>
          <small>Total quotes</small>
          <strong>{{ quotes()?.totalElements ?? '—' }}</strong>
          <a routerLink="../quotes" class="link-arrow">View all <mat-icon>arrow_forward</mat-icon></a>
        </div>
      </article>
      <article class="card kpi">
        <span class="kpi-icon pending"><mat-icon>pending_actions</mat-icon></span>
        <div>
          <small>New / unhandled</small>
          <strong>{{ newCount() }}</strong>
          <small class="text-muted">across enquiries + quotes</small>
        </div>
      </article>
    </div>

    <section class="recent-grid">
      <div class="card recent">
        <header><h3>Recent enquiries</h3><a routerLink="../enquiries">View all</a></header>
        <ul>
          @for (e of enquiries()?.content?.slice(0, 5) ?? []; track e.id) {
            <li>
              <strong>{{ e.name }}</strong>
              <span class="text-muted">{{ e.city || 'Unknown city' }} · {{ e.phone }}</span>
              <span class="badge" [class.badge--orange]="e.status === 'NEW'">{{ e.status }}</span>
            </li>
          } @empty {
            <li class="empty">No enquiries yet.</li>
          }
        </ul>
      </div>

      <div class="card recent">
        <header><h3>Recent quotes</h3><a routerLink="../quotes">View all</a></header>
        <ul>
          @for (q of quotes()?.content?.slice(0, 5) ?? []; track q.id) {
            <li>
              <strong>{{ q.name }}</strong>
              <span class="text-muted">{{ q.siteLocation || 'Site n/a' }} · {{ q.email }}</span>
              <span class="badge" [class.badge--orange]="q.status === 'NEW'">{{ q.status }}</span>
            </li>
          } @empty {
            <li class="empty">No quotes yet.</li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: [
    `
      .page-head { margin-bottom: 1.25rem; }
      .page-head h1 { margin: 0 0 0.25rem; }
      .page-head p { margin: 0; }

      .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.75rem; }
      .kpi { display: flex; gap: 1rem; align-items: center; padding: 1.25rem; }
      .kpi-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: var(--radius-sm); }
      .kpi-icon.enquiry { background: rgba(15,44,92,0.08); color: var(--color-navy); }
      .kpi-icon.quote { background: rgba(245,130,32,0.12); color: var(--color-orange); }
      .kpi-icon.pending { background: rgba(217,155,28,0.12); color: var(--color-warning); }
      .kpi strong { font-size: 1.5rem; display: block; font-family: var(--font-display); color: var(--color-navy); }
      .link-arrow { display: inline-flex; align-items: center; gap: 0.2rem; color: var(--color-orange); font-size: 0.85rem; font-weight: 600; margin-top: 0.25rem; }

      .recent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .recent header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
      .recent ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
      .recent li { display: grid; grid-template-columns: 1fr 1.4fr auto; gap: 0.5rem; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--color-border); }
      .recent li:last-child { border-bottom: 0; }
      .recent .empty { color: var(--color-text-muted); display: block; padding: 0.5rem 0; }

      @media (max-width: 900px) { .recent-grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly enquiries = signal<PageResponse<Enquiry> | null>(null);
  readonly quotes = signal<PageResponse<Quote> | null>(null);
  readonly newCount = signal(0);

  ngOnInit(): void {
    forkJoin({
      e: this.api.listEnquiries(0, 50).pipe(catchError(() => of(null))),
      q: this.api.listQuotes(0, 50).pipe(catchError(() => of(null))),
    }).subscribe(({ e, q }) => {
      this.enquiries.set(e);
      this.quotes.set(q);
      const en = e?.content.filter((x) => x.status === 'NEW').length ?? 0;
      const qn = q?.content.filter((x) => x.status === 'NEW').length ?? 0;
      this.newCount.set(en + qn);
    });
  }
}
