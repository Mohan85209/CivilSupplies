import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '@env/environment';

describe('ApiService', () => {
  let api: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    api = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('listProducts builds query params correctly', () => {
    api.listProducts({ category: 'cement', q: 'ultratech', page: 1, size: 24, sort: 'name,asc' }).subscribe();
    const req = httpMock.expectOne((r) =>
      r.url === `${environment.apiUrl}/products` &&
      r.params.get('category') === 'cement' &&
      r.params.get('q') === 'ultratech' &&
      r.params.get('page') === '1' &&
      r.params.get('size') === '24' &&
      r.params.get('sort') === 'name,asc'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, number: 1, size: 24, first: true, last: true });
  });

  it('submitEnquiry POSTs to /enquiries', () => {
    const body = { name: 'Test', phone: '9505056386', email: 't@x.com' };
    api.submitEnquiry(body).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/enquiries`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 1, ...body, city: null, projectType: null, materials: null, quantity: null, message: null, status: 'NEW', createdAt: new Date().toISOString() });
  });

  it('submitQuote sends multipart with quote JSON and optional file', () => {
    const file = new File(['x'], 'boq.pdf', { type: 'application/pdf' });
    api.submitQuote({ name: 'A', phone: '1', email: 'a@b' }, file).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/quotes`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({});
  });
});
