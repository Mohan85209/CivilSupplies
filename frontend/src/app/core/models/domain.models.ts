export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CLOSED' | 'SPAM';
export type QuoteStatus = 'NEW' | 'IN_REVIEW' | 'QUOTED' | 'WON' | 'LOST';

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  productCount?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  categoryName?: string;
  brand: string | null;
  unit: string | null;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface ProductFilter {
  category?: string;
  q?: string;
  page?: number;
  size?: number;
  sort?: 'name,asc' | 'name,desc' | 'createdAt,desc';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string | null;
  projectType: string | null;
  materials: string[] | null;
  quantity: string | null;
  message: string | null;
  status: EnquiryStatus;
  createdAt: string;
}

export interface EnquiryCreate {
  name: string;
  phone: string;
  email: string;
  city?: string;
  projectType?: string;
  materials?: string[];
  quantity?: string;
  message?: string;
}

export interface Quote {
  id: number;
  name: string;
  phone: string;
  email: string;
  projectDetails: string | null;
  siteLocation: string | null;
  timeline: string | null;
  boqFilename: string | null;
  boqFileUrl: string | null;
  status: QuoteStatus;
  createdAt: string;
}

export interface QuoteCreate {
  name: string;
  phone: string;
  email: string;
  projectDetails?: string;
  siteLocation?: string;
  timeline?: string;
}

export type Role = 'ROLE_ADMIN' | 'ROLE_STAFF' | 'ROLE_VIEWER';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string | null;
  roles: Role[];
  createdAt: string;
  active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AdminUser;
  expiresAt: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
  fieldErrors?: Record<string, string>;
}
