const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiUrls = {
  base_url: API_BASE_URL,
  auth: {
    login: "/admin/auth/login",
    // logout: `${API_BASE_URL}/admin/logout`,
  },
  user: {
    allUsers: "/admin/users/all-users",
    details: "/admin/users/details",
    approve: "/admin/users/approve",
  },
  rbac: {
    permissions: "/admin/rbac/permissions",
    roles: "/admin/rbac/roles",
    admins: "/admin/rbac/admins",
    myPermissions: "/admin/rbac/me/permissions",
  },
  projects: {
    list: "/admin/projects",
    create: "/admin/projects",
    update: "/admin/projects",
    delete: "/admin/projects",
    approve: "/admin/projects/approve",
    reject: "/admin/projects/reject",
    start: "/admin/projects/start",
    complete: "/admin/projects/complete",
    getById: "/admin/projects",
  },
  projectUpdates: {
    list: "/admin/project-updates",
    create: "/admin/project-updates",
    update: "/admin/project-updates",
    delete: "/admin/project-updates",
  },
  products: {
    list: "/admin/products",
    create: "/admin/products",
    update: "/admin/products",
    delete: "/admin/products",
  },
};

export default apiUrls;
