import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '@core/services/api.service';
import { Enquiry, EnquiryStatus, PageResponse } from '@core/models/domain.models';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'cs-admin-enquiries',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatPaginatorModule, MatSelectModule, MatFormFieldModule, MatTableModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <h1>Enquiries</h1>
        <p class="text-muted">All contact-form submissions from prospects.</p>
      </div>
      <mat-form-field appearance="outline" class="status-filter">
        <mat-label>Filter by status</mat-label>
        <mat-select [formControl]="statusFilter">
          <mat-option [value]="null">All</mat-option>
          <mat-option value="NEW">New</mat-option>
          <mat-option value="CONTACTED">Contacted</mat-option>
          <mat-option value="CLOSED">Closed</mat-option>
          <mat-option value="SPAM">Spam</mat-option>
        </mat-select>
      </mat-form-field>
    </header>

    <div class="card table-wrap">
      <table mat-table [dataSource]="page()?.content ?? []" class="data-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let e"><strong>{{ e.name }}</strong></td>
        </ng-container>
        <ng-container matColumnDef="contact">
          <th mat-header-cell *matHeaderCellDef>Contact</th>
          <td mat-cell *matCellDef="let e">{{ e.phone }} · {{ e.email }}</td>
        </ng-container>
        <ng-container matColumnDef="city">
          <th mat-header-cell *matHeaderCellDef>City</th>
          <td mat-cell *matCellDef="let e">{{ e.city || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="project">
          <th mat-header-cell *matHeaderCellDef>Project / message</th>
          <td mat-cell *matCellDef="let e">
            <span class="text-muted small">{{ e.projectType || '—' }}</span>
            <p class="msg">{{ e.message || '—' }}</p>
          </td>
        </ng-container>
        <ng-container matColumnDef="created">
          <th mat-header-cell *matHeaderCellDef>Received</th>
          <td mat-cell *matCellDef="let e">{{ e.createdAt | date:'MMM d, y, h:mm a' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let e">
            <mat-form-field appearance="outline" class="row-select">
              <mat-select [value]="e.status" (selectionChange)="updateStatus(e, $event.value)">
                <mat-option value="NEW">New</mat-option>
                <mat-option value="CONTACTED">Contacted</mat-option>
                <mat-option value="CLOSED">Closed</mat-option>
                <mat-option value="SPAM">Spam</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
      </table>

      @if ((page()?.content?.length ?? 0) === 0) {
        <p class="empty">No enquiries to display.</p>
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
      .page-head h1 { margin: 0 0 0.25rem; }
      .page-head p { margin: 0; }
      .status-filter { min-width: 220px; }
      .table-wrap { padding: 0; overflow-x: auto; }
      .data-table { width: 100%; }
      .small { font-size: 0.8rem; }
      .msg { margin: 0.15rem 0 0; max-width: 320px; color: var(--color-text); }
      .row-select { width: 140px; }
      .empty { text-align: center; color: var(--color-text-muted); padding: 2rem 0; }
    `,
  ],
})
export class AdminEnquiriesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly notify = inject(NotificationService);

  readonly columns = ['name', 'contact', 'city', 'project', 'created', 'status'];
  readonly statusFilter = new FormControl<EnquiryStatus | null>(null);
  readonly page = signal<PageResponse<Enquiry> | null>(null);

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

  updateStatus(e: Enquiry, status: EnquiryStatus): void {
    this.api.updateEnquiryStatus(e.id, status).subscribe({
      next: () => {
        this.notify.success(`Enquiry marked ${status.toLowerCase()}.`);
        this.load();
      },
    });
  }

  private load(): void {
    this.api.listEnquiries(this.pageIndex, this.pageSize, this.statusFilter.value ?? undefined).subscribe({
      next: (p) => this.page.set(p),
      error: () => this.page.set({ content: [], totalElements: 0, totalPages: 0, number: 0, size: this.pageSize, first: true, last: true }),
    });
  }
}
