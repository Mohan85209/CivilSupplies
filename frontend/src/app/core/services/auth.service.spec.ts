import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });

  it('stores token + user on successful login', () => {
    const payload = { email: 'admin@example.com', password: 'password!' };
    service.login(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      expiresAt: new Date().toISOString(),
      user: { id: 1, email: 'admin@example.com', fullName: 'Admin', roles: ['ROLE_ADMIN'], createdAt: new Date().toISOString(), active: true },
    });

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.hasRole('ROLE_ADMIN')).toBeTrue();
  });

  it('clears state on logout', () => {
    localStorage.setItem('cs.auth.token', 'x');
    localStorage.setItem('cs.auth.user', JSON.stringify({ id: 1, email: 'a@b', roles: ['ROLE_ADMIN'], createdAt: '', active: true, fullName: null }));
    service = TestBed.inject(AuthService);
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
