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

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    permission_ids: [] as number[],
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await rbacService.getAllRoles();
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
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
    setEditingRole(null);
    setFormData({ name: "", permission_ids: [] });
    setShowModal(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permission_ids: role.permissions.map((p) => p.id),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await rbacService.updateRole(editingRole.id, formData);
        toast.success("Role updated successfully");
      } else {
        await rbacService.createRole(formData);
        toast.success("Role created successfully");
      }
      setShowModal(false);
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save role");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await rbacService.deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
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
        <Breadcrumb pageName="Roles Management" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Roles</h3>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            Create Role
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
                      Role Name
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Permissions
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b border-stroke dark:border-strokedark">
                      <td className="px-4 py-5">
                        <p className="text-black dark:text-white">{role.name}</p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.map((perm) => (
                            <span
                              key={perm.id}
                              className="inline-flex rounded-full bg-success bg-opacity-10 px-3 py-1 text-sm font-medium text-success"
                            >
                              {perm.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => handleEdit(role)}
                            className="hover:text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="hover:text-danger"
                          >
                            Delete
                          </button>
                        </div>
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
          <div className="w-full max-w-142.5 rounded-lg bg-white p-8 dark:bg-boxdark">
            <h3 className="mb-5 text-xl font-medium text-black dark:text-white">
              {editingRole ? "Edit Role" : "Create Role"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Role Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Permissions
                </label>
                <div className="max-h-60 overflow-y-auto rounded border border-stroke p-4 dark:border-strokedark">
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
                  {editingRole ? "Update" : "Create"}
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

