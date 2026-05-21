import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '@core/services/api.service';
import { PageResponse, Quote, QuoteStatus } from '@core/models/domain.models';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'cs-admin-quotes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatPaginatorModule, MatSelectModule, MatFormFieldModule, MatTableModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <h1>Quote requests</h1>
        <p class="text-muted">BOQ submissions and quote pipeline.</p>
      </div>
      <mat-form-field appearance="outline" class="status-filter">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusFilter">
          <mat-option [value]="null">All</mat-option>
          <mat-option value="NEW">New</mat-option>
          <mat-option value="IN_REVIEW">In review</mat-option>
          <mat-option value="QUOTED">Quoted</mat-option>
          <mat-option value="WON">Won</mat-option>
          <mat-option value="LOST">Lost</mat-option>
        </mat-select>
      </mat-form-field>
    </header>

    <div class="card table-wrap">
      <table mat-table [dataSource]="page()?.content ?? []" class="data-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Customer</th>
          <td mat-cell *matCellDef="let q">
            <strong>{{ q.name }}</strong>
            <div class="text-muted small">{{ q.phone }} · {{ q.email }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="site">
          <th mat-header-cell *matHeaderCellDef>Site / timeline</th>
          <td mat-cell *matCellDef="let q">
            {{ q.siteLocation || '—' }}
            <div class="text-muted small">{{ q.timeline || 'No timeline' }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="details">
          <th mat-header-cell *matHeaderCellDef>Project details</th>
          <td mat-cell *matCellDef="let q"><p class="msg">{{ q.projectDetails || '—' }}</p></td>
        </ng-container>
        <ng-container matColumnDef="boq">
          <th mat-header-cell *matHeaderCellDef>BOQ</th>
          <td mat-cell *matCellDef="let q">
            @if (q.boqFilename) {
              <button class="btn btn--ghost btn--sm" (click)="downloadBoq(q)">
                <mat-icon>download</mat-icon> {{ q.boqFilename }}
              </button>
            } @else {
              <span class="text-muted">—</span>
            }
          </td>
        </ng-container>
        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Received</th>
          <td mat-cell *matCellDef="let q">{{ q.createdAt | date:'MMM d, y' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let q">
            <mat-form-field appearance="outline" class="row-select">
              <mat-select [value]="q.status" (selectionChange)="updateStatus(q, $event.value)">
                <mat-option value="NEW">New</mat-option>
                <mat-option value="IN_REVIEW">In review</mat-option>
                <mat-option value="QUOTED">Quoted</mat-option>
                <mat-option value="WON">Won</mat-option>
                <mat-option value="LOST">Lost</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      @if ((page()?.content?.length ?? 0) === 0) {
        <p class="empty">No quote requests to display.</p>
      }

      @if (page()) {
        <mat-paginator
          [length]="page()!.totalElements"
          [pageIndex]="page()!.number"
          [pageSize]="page()!.size"
          [pageSizeOptions]="[10, 20, 50]"
          (page)="onPage($event)"
        ></mat-paginator>
      }
    </div>
  `,
  styles: [
    `
      .page-head { display: flex; justify-content: space-between; align-items: end; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem; }
      .status-filter { min-width: 220px; }
      .table-wrap { padding: 0; overflow-x: auto; }
      .data-table { width: 100%; }
      .small { font-size: 0.8rem; }
      .msg { margin: 0; max-width: 320px; color: var(--color-text); }
      .row-select { width: 150px; }
      .btn--sm { padding: 0.4rem 0.7rem; font-size: 0.85rem; }
      .empty { text-align: center; color: var(--color-text-muted); padding: 2rem 0; }
    `,
  ],
})
export class AdminQuotesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly notify = inject(NotificationService);

  readonly columns = ['name', 'site', 'details', 'boq', 'created', 'status'];
  readonly statusFilter = new FormControl<QuoteStatus | null>(null);
  readonly page = signal<PageResponse<Quote> | null>(null);

  private pageIndex = 0;
  private pageSize = 20;

  ngOnInit(): void {
    this.load();
    this.statusFilter.valueChanges.subscribe(() => {
      this.pageIndex = 0;
      this.load();
    });
  }

  onPage(ev: PageEvent): void {
    this.pageIndex = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.load();
  }

  updateStatus(q: Quote, status: QuoteStatus): void {
    this.api.updateQuoteStatus(q.id, status).subscribe({
      next: () => {
        this.notify.success(`Quote moved to ${status.toLowerCase()}.`);
        this.load();
      },
    });
  }

  downloadBoq(q: Quote): void {
    this.api.getQuoteBoqUrl(q.id).subscribe({
      next: (res) => window.open(res.url, '_blank', 'noopener'),
    });
  }

  private load(): void {
    this.api.listQuotes(this.pageIndex, this.pageSize, this.statusFilter.value ?? undefined).subscribe({
      next: (p) => this.page.set(p),
      error: () => this.page.set({ content: [], totalElements: 0, totalPages: 0, number: 0, size: this.pageSize, first: true, last: true }),
    });
  }
}
