// Mirrors backend Pydantic schemas. Update both sides together.

export type ProjectType = "Residential" | "Commercial" | "Infrastructure" | "Industrial";
export type Status = "new" | "contacted" | "closed";

export type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  brand: string | null;
  unit: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProductList = {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
};

export type EnquiryCreate = {
  name: string;
  phone: string;
  email: string;
  city?: string | null;
  project_type?: ProjectType | null;
  materials?: string[];
  quantity?: string | null;
  message?: string | null;
};

export type EnquiryOut = {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string | null;
  project_type: string | null;
  materials: string[] | null;
  quantity: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type EnquiryResponse = {
  success: boolean;
  message: string;
  enquiry_id: number;
};

export type QuoteOut = {
  id: number;
  name: string;
  phone: string;
  email: string;
  project_details: string | null;
  site_location: string | null;
  timeline: string | null;
  boq_filename: string | null;
  boq_file_url: string | null;
  status: string;
  created_at: string;
};

export type QuoteResponse = {
  success: boolean;
  message: string;
  quote_id: number;
};

export type TokenOut = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type AdminMe = {
  id: number;
  email: string;
  created_at: string;
};
