import request from "./httpServices";
import apiUrls from "@/config/apiUrls";
import { Project, ProjectFormData, ProjectFilters } from "@/types/project";

const projectService = {
  // Get all projects with filters
  getAllProjects: async (filters?: ProjectFilters) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${apiUrls.projects.list}?${queryString}` : apiUrls.projects.list;
    return request.get(url);
  },

  // Get project by ID
  getProjectById: async (id: number) => {
    return request.get(`${apiUrls.projects.list}/${id}`);
  },

  // Create new project
  createProject: async (data: ProjectFormData) => {
    const formData = new FormData();
    formData.append('farmer_name', data.farmer_name);
    formData.append('farmer_phone', data.farmer_phone);
    formData.append('farmer_address', data.farmer_address);
    formData.append('project_name', data.project_name);
    formData.append('per_unit_price', data.per_unit_price.toString());
    formData.append('total_returnable_per_unit', data.total_returnable_per_unit.toString());
    formData.append('project_duration', data.project_duration.toString());
    formData.append('total_units', data.total_units.toString());
    formData.append('why_fund_with_krishibazar', data.why_fund_with_krishibazar);
    formData.append('earning_percentage', data.earning_percentage.toString());
    
    if (data.category_id) {
      formData.append('category_id', data.category_id.toString());
    }
    
    if (data.nid_card_front) {
      formData.append('nid_card_front', data.nid_card_front);
    }
    if (data.nid_card_back) {
      formData.append('nid_card_back', data.nid_card_back);
    }
    if (data.project_images && data.project_images.length > 0) {
      data.project_images.forEach((image) => {
        formData.append('project_images', image);
      });
    }

    return request.post(apiUrls.projects.create, formData);
  },

  // Update project
  updateProject: async (id: number, data: Partial<ProjectFormData>) => {
    const formData = new FormData();
    
    if (data.farmer_name) formData.append('farmer_name', data.farmer_name);
    if (data.farmer_phone) formData.append('farmer_phone', data.farmer_phone);
    if (data.farmer_address) formData.append('farmer_address', data.farmer_address);
    if (data.project_name) formData.append('project_name', data.project_name);
    if (data.per_unit_price) formData.append('per_unit_price', data.per_unit_price.toString());
    if (data.total_returnable_per_unit) formData.append('total_returnable_per_unit', data.total_returnable_per_unit.toString());
    if (data.project_duration) formData.append('project_duration', data.project_duration.toString());
    if (data.why_fund_with_krishibazar) formData.append('why_fund_with_krishibazar', data.why_fund_with_krishibazar);
    if (data.earning_percentage) formData.append('earning_percentage', data.earning_percentage.toString());
    
    if (data.category_id !== undefined) {
      formData.append('category_id', data.category_id?.toString() || '');
    }
    
    if (data.nid_card_photo) {
      formData.append('nid_card_photo', data.nid_card_photo);
    }

    return request.put(`${apiUrls.projects.update}/${id}`, formData);
  },

  // Delete project
  deleteProject: async (id: number) => {
    return request.delete(`${apiUrls.projects.delete}/${id}`);
  },

  // Approve project (super admin only)
  approveProject: async (id: number) => {
    return request.post(`${apiUrls.projects.approve}/${id}`);
  },

  // Reject project (super admin only)
  rejectProject: async (id: number, rejection_reason: string) => {
    return request.post(`${apiUrls.projects.reject}/${id}`, { rejection_reason });
  },

  // Start project (admin with permission)
  startProject: async (id: number) => {
    return request.post(`${apiUrls.projects.start}/${id}`);
  },

  // Complete project (admin with permission)
  completeProject: async (id: number) => {
    return request.post(`${apiUrls.projects.complete}/${id}`);
  },
};

export default projectService;
