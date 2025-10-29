export type Product = {
  id?: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  min_order: number;
  max_order?: number | null;
  product_images?: string | string[]; // Array of image URLs or comma-separated string
  in_stock: boolean;
  description?: string | null;
  nutritional_info?: string | null;
  harvest_date?: string | null;
  shelf_life?: string | null;
  farmer?: string | null;
  certifications?: string | null;
  rating?: number;
  reviews?: number;
  created_by: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductFormData = {
  name: string;
  category: string;
  price: number;
  unit: string;
  min_order: number;
  max_order?: number | null;
  product_images: File[] | null;
  in_stock: boolean;
  description?: string;
  nutritional_info?: string;
  harvest_date?: string;
  shelf_life?: string;
  farmer?: string;
  certifications?: string;
  rating?: number;
  reviews?: number;
};

export type ProductFilters = {
  category?: string;
  in_stock?: string;
  search?: string;
  page?: number;
  limit?: number;
};
