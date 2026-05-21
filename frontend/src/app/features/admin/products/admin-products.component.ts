import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ApiService } from '@core/services/api.service';
import { PageResponse, Product } from '@core/models/domain.models';

@Component({
  selector: 'cs-admin-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatPaginatorModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <h1>Products</h1>
        <p class="text-muted">Read-only catalog view. Product CRUD is managed via the admin seed and backend tools.</p>
      </div>
    </header>

    <div class="card table-wrap">
      <table mat-table [dataSource]="page()?.content ?? []" class="data-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Product</th>
          <td mat-cell *matCellDef="let p">
            <strong>{{ p.name }}</strong>
            <div class="text-muted small">{{ p.slug }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Category</th>
          <td mat-cell *matCellDef="let p">{{ p.categoryName || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="brand">
          <th mat-header-cell *matHeaderCellDef>Brand</th>
          <td mat-cell *matCellDef="let p">{{ p.brand || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>Active</th>
          <td mat-cell *matCellDef="let p">
            <span class="badge" [class.badge--success]="p.isActive" [class.badge--warning]="!p.isActive">
              {{ p.isActive ? 'Yes' : 'No' }}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Created</th>
          <td mat-cell *matCellDef="let p">{{ p.createdAt | date:'MMM d, y' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      @if ((page()?.content?.length ?? 0) === 0) { <p class="empty">No products yet.</p> }

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
      .page-head { margin-bottom: 1.25rem; }
      .page-head h1 { margin: 0 0 0.25rem; }
      .table-wrap { padding: 0; overflow-x: auto; }
      .data-table { width: 100%; }
      .small { font-size: 0.8rem; }
      .empty { text-align: center; color: var(--color-text-muted); padding: 2rem 0; }
      .badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
    `,
  ],
})
export class AdminProductsComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly columns = ['name', 'category', 'brand', 'active', 'created'];
  readonly page = signal<PageResponse<Product> | null>(null);

  private pageIndex = 0;
  private pageSize = 20;

  ngOnInit(): void {
    this.load();
  }

  onPage(ev: PageEvent): void {
    this.pageIndex = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.load();
  }

  private load(): void {
    this.api.listProducts({ page: this.pageIndex, size: this.pageSize }).subscribe({
      next: (p) => this.page.set(p),
      error: () => this.page.set({ content: [], totalElements: 0, totalPages: 0, number: 0, size: this.pageSize, first: true, last: true }),
    });
  }
}
