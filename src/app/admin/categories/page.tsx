"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { GiCow, GiGoat, GiChicken } from "react-icons/gi";
import { FaSeedling, FaFish } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    iconFile: null as File | null,
    description: "",
    is_active: true,
  });

  // Default icons for display fallback
  const iconOptions = [
    { value: "crop", label: "Crop Farming", icon: <FaSeedling className="text-2xl" /> },
    { value: "cow", label: "Cow Farming", icon: <GiCow className="text-2xl" /> },
    { value: "goat", label: "Goat Farming", icon: <GiGoat className="text-2xl" /> },
    { value: "chicken", label: "Chicken Farming", icon: <GiChicken className="text-2xl" /> },
    { value: "fish", label: "Fish Farming", icon: <FaFish className="text-2xl" /> },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:4000/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, iconFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const url = editingCategory
        ? `http://localhost:4000/admin/categories/${editingCategory.id}`
        : "http://localhost:4000/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("is_active", String(formData.is_active));
      
      if (formData.iconFile) {
        dataToSend.append("icon", formData.iconFile);
      } else if (formData.icon) {
        dataToSend.append("icon", formData.icon);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingCategory ? "Category updated!" : "Category created!");
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", icon: "crop", description: "", is_active: true });
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to save category");
      }
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://localhost:4000/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category deleted!");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      iconFile: null,
      description: category.description || "",
      is_active: category.is_active,
    });
    setShowModal(true);
  };

  const getIconComponent = (category: Category) => {
    // Check if icon is a default icon identifier or a file
    const defaultIcons = ['crop', 'cow', 'goat', 'chicken', 'fish'];
    const isDefaultIcon = defaultIcons.includes(category.icon);
    
    // If it's a file (has extension), show the image
    if (!isDefaultIcon && category.icon && category.icon.includes('.')) {
      return <img src={`http://localhost:4000/public/${category.icon}`} alt={category.name} className="w-10 h-10 object-contain" />;
    }
    
    // Otherwise show predefined icon based on icon field
    const icon = iconOptions.find((opt) => opt.value === category.icon);
    return icon ? icon.icon : <FaSeedling className="text-2xl" />;
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_management">
        <Breadcrumb pageName="Categories" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-black dark:text-white">
                  Project Categories
                </h3>
                <p className="text-sm text-gray-500">
                  Manage project categories and icons
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(true);
                  setEditingCategory(null);
                  setFormData({ name: "", icon: "", iconFile: null, description: "", is_active: true });
                }}
                className="flex items-center gap-2 bg-primary px-4 py-2 text-white rounded hover:bg-opacity-90"
              >
                <FiPlus /> Add Category
              </button>
            </div>
          </div>

          <div className="p-7">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No categories found
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-stroke rounded-lg p-6 dark:border-strokedark dark:bg-boxdark"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl flex items-center justify-center">
                          {getIconComponent(category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-black dark:text-white">
                            {category.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {category.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          category.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md dark:bg-boxdark">
              <h3 className="text-xl font-medium mb-6 text-black dark:text-white">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded border border-stroke px-3 py-2 dark:bg-boxdark dark:border-strokedark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Icon *
                  </label>
                  
                  {/* Upload Icon File */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIconChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
                      required={!editingCategory}
                    />
                    {formData.iconFile && (
                      <div className="mt-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                        <img 
                          src={URL.createObjectURL(formData.iconFile)} 
                          alt="Preview" 
                          className="w-12 h-12 object-contain rounded" 
                        />
                        <span className="text-sm text-gray-600">{formData.iconFile.name}</span>
                      </div>
                    )}
                    {!formData.iconFile && editingCategory && editingCategory.icon && !editingCategory.icon.match(/^(crop|cow|goat|chicken|fish)$/) && (
                      <div className="mt-2 p-2 bg-gray-100 rounded flex items-center gap-2">
                        <img 
                          src={`http://localhost:4000/public/${editingCategory.icon}`} 
                          alt="Current" 
                          className="w-12 h-12 object-contain rounded" 
                        />
                        <span className="text-sm text-gray-600">Current icon</span>
                      </div>
                    )}
                    {!formData.iconFile && editingCategory && !editingCategory.icon && (
                      <p className="text-sm text-gray-500 mt-2">No icon uploaded</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full rounded border border-stroke px-3 py-2 dark:bg-boxdark dark:border-strokedark"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label className="text-sm text-black dark:text-white">
                    Active
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      setFormData({
                        name: "",
                        icon: "crop",
                        description: "",
                        is_active: true,
                      });
                    }}
                    className="flex-1 border border-stroke px-4 py-2 rounded hover:bg-gray-50 dark:border-strokedark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary px-4 py-2 rounded text-white hover:bg-opacity-90"
                  >
                    {editingCategory ? "Update" : "Create"}
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

