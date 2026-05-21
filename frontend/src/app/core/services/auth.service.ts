import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { AdminUser, LoginRequest, LoginResponse, Role } from '../models/domain.models';

const TOKEN_KEY = 'cs.auth.token';
const REFRESH_KEY = 'cs.auth.refresh';
const USER_KEY = 'cs.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _user = signal<AdminUser | null>(this.readStoredUser());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user() && !!this.getToken());
  readonly roles = computed<Role[]>(() => this._user()?.roles ?? []);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/admin/login`, payload).pipe(
      tap((res) => this.persist(res)),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    void this.router.navigate(['/admin/login']);
  }

  refresh(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/admin/refresh`, { refreshToken })
      .pipe(tap((res) => this.persist(res)));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(...roles: Role[]): boolean {
    const userRoles = this._user()?.roles ?? [];
    return roles.some((r) => userRoles.includes(r));
  }

  private persist(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    if (res.refreshToken) localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this._user.set(res.user);
  }

  private readStoredUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  }
}
