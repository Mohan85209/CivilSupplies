import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Category,
  Enquiry,
  EnquiryCreate,
  EnquiryStatus,
  PageResponse,
  Product,
  ProductFilter,
  Quote,
  QuoteCreate,
  QuoteStatus,
  AdminUser,
} from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  /* ---------- Products & categories (public) ---------- */
  listProducts(filter: ProductFilter = {}): Observable<PageResponse<Product>> {
    let params = new HttpParams();
    if (filter.category) params = params.set('category', filter.category);
    if (filter.q) params = params.set('q', filter.q);
    if (filter.page != null) params = params.set('page', String(filter.page));
    if (filter.size != null) params = params.set('size', String(filter.size));
    if (filter.sort) params = params.set('sort', filter.sort);
    return this.http.get<PageResponse<Product>>(`${this.base}/products`, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${slug}`);
  }

  listCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  /* ---------- Enquiries ---------- */
  submitEnquiry(payload: EnquiryCreate): Observable<Enquiry> {
    return this.http.post<Enquiry>(`${this.base}/enquiries`, payload);
  }

  listEnquiries(page = 0, size = 20, status?: EnquiryStatus): Observable<PageResponse<Enquiry>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Enquiry>>(`${this.base}/enquiries`, { params });
  }

  updateEnquiryStatus(id: number, status: EnquiryStatus): Observable<Enquiry> {
    return this.http.patch<Enquiry>(`${this.base}/enquiries/${id}`, { status });
  }

  /* ---------- Quotes ---------- */
  submitQuote(payload: QuoteCreate, boqFile?: File): Observable<Quote> {
    const formData = new FormData();
    formData.append(
      'quote',
      new Blob([JSON.stringify(payload)], { type: 'application/json' }),
    );
    if (boqFile) formData.append('boq', boqFile);
    return this.http.post<Quote>(`${this.base}/quotes`, formData);
  }

  listQuotes(page = 0, size = 20, status?: QuoteStatus): Observable<PageResponse<Quote>> {
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (status) params = params.set('status', status);
    return this.http.get<PageResponse<Quote>>(`${this.base}/quotes`, { params });
  }

  updateQuoteStatus(id: number, status: QuoteStatus): Observable<Quote> {
    return this.http.patch<Quote>(`${this.base}/quotes/${id}`, { status });
  }

  getQuoteBoqUrl(id: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.base}/quotes/${id}/boq`);
  }

  /* ---------- Newsletter (extra feature) ---------- */
  subscribeNewsletter(email: string): Observable<{ ok: true }> {
    return this.http.post<{ ok: true }>(`${this.base}/newsletter/subscribe`, { email });
  }

  /* ---------- Admin users ---------- */
  listAdminUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.base}/admin/users`);
  }

  createAdminUser(payload: { email: string; password: string; fullName?: string; roles: string[] }): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.base}/admin/users`, payload);
  }

  me(): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.base}/admin/me`);
  }
}
