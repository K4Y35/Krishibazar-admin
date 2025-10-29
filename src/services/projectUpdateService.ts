import request from "./httpServices";
import apiUrls from "@/config/apiUrls";

export interface ProjectUpdate {
  id: number;
  project_id: number;
  title: string;
  description: string;
  update_type: "progress" | "financial" | "milestone" | "general" | "harvest";
  media_files: string | string[] | null;
  milestone_status: string | null;
  financial_data: any;
  farmer_notes: string | null;
  impact_metrics: any;
  created_by: number;
  created_at: string;
  updated_at: string;
  project_name?: string;
  farmer_name?: string;
}

export interface CreateUpdateData {
  project_id: number;
  title: string;
  description?: string;
  update_type: "progress" | "financial" | "milestone" | "general" | "harvest";
  media_files?: string[];
  milestone_status?: string;
  financial_data?: any;
  farmer_notes?: string;
  impact_metrics?: any;
}

const projectUpdateService = {
  // Get all updates
  getAllUpdates: async (filters?: {
    project_id?: number;
    update_type?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.project_id) params.append("project_id", filters.project_id.toString());
    if (filters?.update_type) params.append("update_type", filters.update_type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    
    const url = apiUrls.projectUpdates.list + (params.toString() ? `?${params.toString()}` : "");
    return request.get(url);
  },

  // Get update by ID
  getUpdateById: async (id: number) => {
    return request.get(`${apiUrls.projectUpdates.list}/${id}`);
  },

  // Create new update
  createUpdate: async (data: CreateUpdateData) => {
    return request.post(apiUrls.projectUpdates.create, data);
  },

  // Create update with file uploads
  createUpdateWithFiles: async (formData: FormData) => {
    return request.post(apiUrls.projectUpdates.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update update
  updateUpdate: async (id: number, data: Partial<CreateUpdateData>) => {
    return request.put(`${apiUrls.projectUpdates.update}/${id}`, data);
  },

  // Delete update
  deleteUpdate: async (id: number) => {
    return request.delete(`${apiUrls.projectUpdates.delete}/${id}`);
  },
};

export default projectUpdateService;

