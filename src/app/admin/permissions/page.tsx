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

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    permission_key: "",
    label: "",
  });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await rbacService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      toast.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPermission(null);
    setFormData({ permission_key: "", label: "" });
    setShowModal(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      permission_key: permission.permission_key,
      label: permission.label,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await rbacService.updatePermission(editingPermission.id, formData);
        toast.success("Permission updated successfully");
      } else {
        await rbacService.createPermission(formData);
        toast.success("Permission created successfully");
      }
      setShowModal(false);
      fetchPermissions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save permission");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await rbacService.deletePermission(id);
      toast.success("Permission deleted successfully");
      fetchPermissions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete permission");
    }
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="rbac_management">
        <Breadcrumb pageName="Permissions Management" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Permissions</h3>
          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            Create Permission
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
                      Permission Key
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Label
                    </th>
                    <th className="px-4 py-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="border-b border-stroke dark:border-strokedark">
                      <td className="px-4 py-5">
                        <code className="rounded bg-gray-2 px-2 py-1 text-black dark:bg-meta-4 dark:text-white">
                          {permission.permission_key}
                        </code>
                      </td>
                      <td className="px-4 py-5">
                        <p className="text-black dark:text-white">{permission.label}</p>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => handleEdit(permission)}
                            className="hover:text-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(permission.id)}
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
              {editingPermission ? "Edit Permission" : "Create Permission"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block text-black dark:text-white">
                  Permission Key
                </label>
                <input
                  type="text"
                  value={formData.permission_key}
                  onChange={(e) =>
                    setFormData({ ...formData, permission_key: e.target.value })
                  }
                  placeholder="e.g., manage_users"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g., Manage Users"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
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
                  {editingPermission ? "Update" : "Create"}
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

