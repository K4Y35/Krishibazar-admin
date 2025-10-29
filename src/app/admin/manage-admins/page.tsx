"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import rbacService from "@/services/rbacServices";
import toast from "react-hot-toast";

interface Permission {
  id: number;
  permission_key: string;
  label: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Admin {
  id: number;
  username: string;
  email: string;
  name: string;
  roles: Role[];
  directPermissions: Permission[];
  effectivePermissions: Permission[];
}

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role_ids: [] as number[],
    permission_ids: [] as number[],
  });

  useEffect(() => {
    fetchAdmins();
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await rbacService.getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      toast.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await rbacService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await rbacService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingAdmin(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role_ids: [],
      permission_ids: [],
    });
    setShowModal(true);
  };

  const handleEdit = (admin: Admin) => {
    setIsCreating(false);
    setEditingAdmin(admin);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role_ids: admin.roles.map((r) => r.id),
      permission_ids: admin.directPermissions.map((p) => p.id),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCreating) {
        // Create new admin
        if (!formData.name || !formData.username || !formData.email || !formData.password) {
          toast.error("Please fill in all required fields");
          return;
        }

        await rbacService.createAdmin({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role_ids: formData.role_ids,
          permission_ids: formData.permission_ids,
        });
        toast.success("Admin created successfully");
      } else {
        // Update existing admin
        if (!editingAdmin) return;

        await rbacService.updateAdminRoles(editingAdmin.id, formData.role_ids);
        await rbacService.updateAdminPermissions(
          editingAdmin.id,
          formData.permission_ids
        );
        toast.success("Admin permissions updated successfully");
      }

      setShowModal(false);
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save admin");
    }
  };

  const toggleRole = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }));
  };

  const togglePermission = (permissionId: number) => {
    setFormData((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="rbac_management">
        <Breadcrumb pageName="Admin Management" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Manage Admin Permissions
          </h3>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            Create Admin
          </button>
        </div>

        <div className="p-7">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Admin
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Email
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Roles
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Direct Permissions
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-stroke dark:border-strokedark"
                    >
                      <td className="px-4 py-5">
                        <div>
                          <p className="text-black dark:text-white">{admin.name}</p>
                          <p className="text-sm text-gray-500">@{admin.username}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-black dark:text-white">{admin.email}</p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-wrap gap-2">
                          {admin.roles.length > 0 ? (
                            admin.roles.map((role) => (
                              <span
                                key={role.id}
                                className="inline-flex rounded-full bg-primary bg-opacity-10 px-3 py-1 text-sm font-medium text-primary"
                              >
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No roles</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-wrap gap-2">
                          {admin.directPermissions.length > 0 ? (
                            admin.directPermissions.map((perm) => (
                              <span
                                key={perm.id}
                                className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success"
                              >
                                {perm.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              No direct permissions
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        {admin.username !== "superadmin" && (
                          <button
                            onClick={() => handleEdit(admin)}
                            className="hover:text-primary"
                          >
                            Edit Permissions
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-200 rounded-lg bg-white p-8 dark:bg-boxdark">
            <h3 className="mb-5 text-xl font-medium text-black dark:text-white">
              {isCreating ? "Create New Admin" : `Edit Permissions for ${editingAdmin?.name}`}
            </h3>
            <form onSubmit={handleSubmit}>
              {isCreating && (
                <>
                  <div className="mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Full Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Username <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="johndoe"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Email <span className="text-red">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password <span className="text-red">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter password"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Password must be at least 6 characters
                    </p>
                  </div>
                </>
              )}


              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Assign Roles
                </label>
                <div className="max-h-40 overflow-y-auto rounded border border-stroke p-4 dark:border-strokedark">
                  {roles.map((role) => (
                    <div key={role.id} className="mb-2">
                      <label className="flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={formData.role_ids.includes(role.id)}
                          onChange={() => toggleRole(role.id)}
                          className="mr-2"
                        />
                        <span className="text-black dark:text-white">
                          {role.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Direct Permissions (override role permissions)
                </label>
                <div className="max-h-40 overflow-y-auto rounded border border-stroke p-4 dark:border-strokedark">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="mb-2">
                      <label className="flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={formData.permission_ids.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mr-2"
                        />
                        <span className="text-black dark:text-white">
                          {permission.label} ({permission.permission_key})
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
                >
                  {isCreating ? "Create Admin" : "Update Permissions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </PermissionGuard>
    </DefaultLayout>
  );
}

