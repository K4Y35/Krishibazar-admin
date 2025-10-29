export type Project = {
  id?: number;
  farmer_name: string;
  farmer_phone: string;
  farmer_address: string;
  nid_card_front?: string;
  nid_card_back?: string;
  project_name: string;
  project_images?: string | string[]; // Array of image URLs or comma-separated string
  per_unit_price: number;
  total_returnable_per_unit: number;
  project_duration: number; // in months
  total_units: number;
  why_fund_with_krishibazar: string;
  earning_percentage: number;
  status: 'pending' | 'approved' | 'rejected' | 'running' | 'completed';
  created_by: number;
  created_at?: string;
  updated_at?: string;
  approved_by?: number;
  approved_at?: string;
  started_at?: string;
  completed_at?: string;
  rejection_reason?: string;
};

export type ProjectFormData = {
  farmer_name: string;
  farmer_phone: string;
  farmer_address: string;
  nid_card_front: File | null;
  nid_card_back: File | null;
  project_name: string;
  project_images: File[] | null;
  per_unit_price: number;
  total_returnable_per_unit: number;
  project_duration: number;
  total_units: number;
  why_fund_with_krishibazar: string;
  earning_percentage: number;
  category_id?: number;
};

export type ProjectFilters = {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
};
