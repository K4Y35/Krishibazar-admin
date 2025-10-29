import request from "./httpServices";
import apiUrls from "@/config/apiUrls";

const rbacService = {
  // Permissions
  getAllPermissions: async () => {
    return request.get(apiUrls.rbac.permissions);
  },
  createPermission: async (data: { permission_key: string; label: string }) => {
    return request.post(apiUrls.rbac.permissions, data);
  },
  updatePermission: async (id: number, data: { permission_key: string; label: string }) => {
    return request.put(`${apiUrls.rbac.permissions}/${id}`, data);
  },
  deletePermission: async (id: number) => {
    return request.delete(`${apiUrls.rbac.permissions}/${id}`);
  },

  // Roles
  getAllRoles: async () => {
    return request.get(apiUrls.rbac.roles);
  },
  getRoleById: async (id: number) => {
    return request.get(`${apiUrls.rbac.roles}/${id}`);
  },
  createRole: async (data: { name: string; permission_ids?: number[] }) => {
    return request.post(apiUrls.rbac.roles, data);
  },
  updateRole: async (id: number, data: { name: string; permission_ids?: number[] }) => {
    return request.put(`${apiUrls.rbac.roles}/${id}`, data);
  },
  deleteRole: async (id: number) => {
    return request.delete(`${apiUrls.rbac.roles}/${id}`);
  },

  // Admins
  getAllAdmins: async () => {
    return request.get(apiUrls.rbac.admins);
  },
  getAdminById: async (id: number) => {
    return request.get(`${apiUrls.rbac.admins}/${id}`);
  },
  createAdmin: async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    role_ids?: number[];
    permission_ids?: number[];
  }) => {
    return request.post(apiUrls.rbac.admins, data);
  },
  updateAdminRoles: async (id: number, role_ids: number[]) => {
    return request.put(`${apiUrls.rbac.admins}/${id}/roles`, { role_ids });
  },
  updateAdminPermissions: async (id: number, permission_ids: number[]) => {
    return request.put(`${apiUrls.rbac.admins}/${id}/permissions`, { permission_ids });
  },

  // My permissions
  getMyPermissions: async () => {
    return request.get(apiUrls.rbac.myPermissions);
  },
};

export default rbacService;

