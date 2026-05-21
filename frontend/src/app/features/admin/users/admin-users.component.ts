import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '@core/services/api.service';
import { AdminUser } from '@core/models/domain.models';
import { NotificationService } from '@core/services/notification.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'cs-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <h1>Admin users</h1>
        <p class="text-muted">Manage admin and staff accounts. Only ADMIN role can create new users.</p>
      </div>
    </header>

    <div class="grid">
      <div class="card table-wrap">
        <table mat-table [dataSource]="users()" class="data-table">
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let u">
              <strong>{{ u.email }}</strong>
              <div class="text-muted small">{{ u.fullName || '—' }}</div>
            </td>
          </ng-container>
          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>Roles</th>
            <td mat-cell *matCellDef="let u">
              @for (r of u.roles; track r) {
                <span class="badge">{{ r.replace('ROLE_', '') }}</span>
              }
            </td>
          </ng-container>
          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef>Active</th>
            <td mat-cell *matCellDef="let u">
              <span class="badge" [class.badge--success]="u.active" [class.badge--warning]="!u.active">
                {{ u.active ? 'Yes' : 'No' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="created">
            <th mat-header-cell *matHeaderCellDef>Created</th>
            <td mat-cell *matCellDef="let u">{{ u.createdAt | date:'MMM d, y' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns"></tr>
        </table>
        @if (users().length === 0) { <p class="empty">No users yet.</p> }
      </div>

      @if (auth.hasRole('ROLE_ADMIN')) {
        <form class="card create-form" [formGroup]="form" (ngSubmit)="create()">
          <h3>Create new user</h3>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Full name</mat-label>
            <input matInput formControlName="fullName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Temporary password</mat-label>
            <input matInput formControlName="password" type="text" required />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Roles</mat-label>
            <mat-select formControlName="roles" multiple required>
              <mat-option value="ROLE_ADMIN">Admin</mat-option>
              <mat-option value="ROLE_STAFF">Staff</mat-option>
              <mat-option value="ROLE_VIEWER">Viewer</mat-option>
            </mat-select>
          </mat-form-field>
          <button type="submit" class="btn btn--primary btn--block" [disabled]="form.invalid">
            <mat-icon>person_add</mat-icon> Create user
          </button>
        </form>
      }
    </div>
  `,
  styles: [
    `
      .page-head h1 { margin: 0 0 0.25rem; }
      .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; align-items: start; }
      .table-wrap { padding: 0; overflow-x: auto; }
      .data-table { width: 100%; }
      .small { font-size: 0.8rem; }
      .empty { text-align: center; color: var(--color-text-muted); padding: 2rem 0; }
      .badge { padding: 0.2rem 0.55rem; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: var(--color-surface-2); color: var(--color-navy); margin-right: 0.3rem; }
      .create-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
      .create-form mat-form-field { width: 100%; }
      @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
    `,
  ],
})
export class AdminUsersComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthService);

  readonly columns = ['email', 'roles', 'active', 'created'];
  readonly users = signal<AdminUser[]>([]);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    roles: [['ROLE_STAFF'], Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.api.createAdminUser(this.form.getRawValue()).subscribe({
      next: () => {
        this.notify.success('User created.');
        this.form.reset({ email: '', fullName: '', password: '', roles: ['ROLE_STAFF'] });
        this.load();
      },
    });
  }

  private load(): void {
    this.api.listAdminUsers().subscribe({
      next: (u) => this.users.set(u),
      error: () => this.users.set([]),
    });
  }
}
