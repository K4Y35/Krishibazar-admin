"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import projectService from "@/services/projectServices";
import { Project, ProjectFormData } from "@/types/project";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    farmer_name: "",
    farmer_phone: "",
    farmer_address: "",
    nid_card_front: null,
    nid_card_back: null,
    project_images: null,
    project_name: "",
    per_unit_price: 0,
    total_returnable_per_unit: 0,
    project_duration: 0,
    total_units: 0,
    why_fund_with_krishibazar: "",
    earning_percentage: 0,
    category_id: undefined,
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [existingPhoto, setExistingPhoto] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchProject(Number(params.id));
    }
    fetchCategories();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:4000/admin/categories?is_active=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
        console.log("Categories loaded:", data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProject = async (id: number) => {
    try {
      setInitialLoading(true);
      const response = await projectService.getProjectById(id);
      const project = response.data;
      
      setFormData({
        farmer_name: project.farmer_name,
        farmer_phone: project.farmer_phone,
        farmer_address: project.farmer_address,
        nid_card_front: null,
        nid_card_back: null,
        project_images: null,
        project_name: project.project_name,
        per_unit_price: project.per_unit_price,
        total_returnable_per_unit: project.total_returnable_per_unit,
        project_duration: project.project_duration,
        total_units: project.total_units,
        why_fund_with_krishibazar: project.why_fund_with_krishibazar,
        earning_percentage: project.earning_percentage,
        category_id: (project as any).category_id,
      });
      
      if (project.nid_card_front) {
        setExistingPhoto(project.nid_card_front);
      }
    } catch (error) {
      toast.error("Failed to fetch project details");
      router.push("/admin/projects");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name.includes('price') || name.includes('duration') || name.includes('percentage') || name.includes('units')
      ? parseFloat(value) || 0 
      : value;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: numValue
      };

      // Auto-calculate total_returnable_per_unit when earning_percentage changes
      if (name === 'earning_percentage' && typeof updated.per_unit_price === 'number' && updated.per_unit_price > 0 && typeof numValue === 'number' && numValue > 0) {
        updated.total_returnable_per_unit = updated.per_unit_price * (1 + numValue / 100);
      }

      // Auto-calculate earning_percentage when total_returnable_per_unit changes
      if (name === 'total_returnable_per_unit' && typeof updated.per_unit_price === 'number' && updated.per_unit_price > 0 && typeof numValue === 'number' && numValue > 0) {
        updated.earning_percentage = ((numValue - updated.per_unit_price) / updated.per_unit_price) * 100;
      }

      // Recalculate both when per_unit_price changes
      if (name === 'per_unit_price' && typeof numValue === 'number' && numValue > 0) {
        // Recalculate earning percentage based on returnable
        if (typeof updated.total_returnable_per_unit === 'number' && updated.total_returnable_per_unit > 0) {
          updated.earning_percentage = ((updated.total_returnable_per_unit - numValue) / numValue) * 100;
        }
      }

      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // Note: This page uses a single file upload for NID card
    // The field name needs to match the backend expectation
    setFormData(prev => ({
      ...prev,
      nid_card_front: file
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.farmer_name.trim()) {
      newErrors.farmer_name = "Farmer name is required";
    }
    if (!formData.farmer_phone.trim()) {
      newErrors.farmer_phone = "Farmer phone is required";
    }
    if (!formData.farmer_address.trim()) {
      newErrors.farmer_address = "Farmer address is required";
    }
    if (!formData.project_name.trim()) {
      newErrors.project_name = "Project name is required";
    }
    if (typeof formData.per_unit_price === 'number' && formData.per_unit_price <= 0) {
      (newErrors as any).per_unit_price = "Per unit price must be greater than 0";
    }
    if (typeof formData.total_returnable_per_unit === 'number' && formData.total_returnable_per_unit <= 0) {
      (newErrors as any).total_returnable_per_unit = "Total returnable per unit must be greater than 0";
    }
    if (typeof formData.project_duration === 'number' && formData.project_duration <= 0) {
      (newErrors as any).project_duration = "Project duration must be greater than 0";
    }
    if (!formData.why_fund_with_krishibazar.trim()) {
      newErrors.why_fund_with_krishibazar = "Why fund with KrishiBazar is required";
    }
    if (typeof formData.earning_percentage === 'number' && formData.earning_percentage <= 0) {
      (newErrors as any).earning_percentage = "Earning percentage must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      await projectService.updateProject(Number(params.id), formData);
      toast.success("Project updated successfully");
      router.push(`/admin/projects/${params.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">Loading...</div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_management">
        <Breadcrumb pageName="Edit Project" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Edit Project Information</h3>
          </div>

          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farmer Information Section */}
              <div className="border-b border-stroke pb-6 dark:border-strokedark">
                <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                  Farmer Information
                </h4>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Farmer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmer_name"
                      value={formData.farmer_name}
                      onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter farmer's full name"
                    />
                    {errors.farmer_name && (
                      <p className="mt-1 text-sm text-danger">{errors.farmer_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      name="farmer_phone"
                      value={formData.farmer_phone}
                      onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter phone number"
                    />
                    {errors.farmer_phone && (
                      <p className="mt-1 text-sm text-danger">{errors.farmer_phone}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="farmer_address"
                    value={formData.farmer_address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    placeholder="Enter complete address"
                  />
                  {errors.farmer_address && (
                    <p className="mt-1 text-sm text-danger">{errors.farmer_address}</p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    NID Card Photo
                  </label>
                  {existingPhoto && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Current Photo:</p>
                      <img
                        src={existingPhoto}
                        alt="Current NID Card"
                        className="max-w-xs rounded border"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Leave empty to keep current photo
                    </p>
                </div>
              </div>

              {/* Project Information Section */}
              <div className="border-b border-stroke pb-6 dark:border-strokedark">
                <h4 className="mb-4 text-lg font-medium text-black dark:text-white">
                  Project Information
                </h4>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Project Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="project_name"
                      value={formData.project_name}
                      onChange={handleInputChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter project name"
                    />
                    {errors.project_name && (
                      <p className="mt-1 text-sm text-danger">{errors.project_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Project Duration (months) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="project_duration"
                      value={formData.project_duration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter duration in months"
                    />
                    {errors.project_duration && (
                      <p className="mt-1 text-sm text-danger">{errors.project_duration}</p>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="md:col-span-2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id || ""}
                      onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) || undefined })}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading categories...</option>
                      )}
                    </select>
                    {errors.category_id && (
                      <p className="mt-1 text-sm text-danger">{errors.category_id}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Per Unit Price (৳) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="per_unit_price"
                      value={formData.per_unit_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter price per unit"
                    />
                    {errors.per_unit_price && (
                      <p className="mt-1 text-sm text-danger">{errors.per_unit_price}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Total Returnable Per Unit (৳) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="total_returnable_per_unit"
                      value={formData.total_returnable_per_unit}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter returnable amount"
                    />
                    {errors.total_returnable_per_unit && (
                      <p className="mt-1 text-sm text-danger">{errors.total_returnable_per_unit}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2.5 block text-black dark:text-white">
                      Earning Percentage (%) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="earning_percentage"
                      value={formData.earning_percentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      placeholder="Enter earning percentage"
                    />
                    {errors.earning_percentage && (
                      <p className="mt-1 text-sm text-danger">{errors.earning_percentage}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Why should you fund with KrishiBazar? <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="why_fund_with_krishibazar"
                    value={formData.why_fund_with_krishibazar}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    placeholder="Explain why investors should fund this project through KrishiBazar"
                  />
                  {errors.why_fund_with_krishibazar && (
                    <p className="mt-1 text-sm text-danger">{errors.why_fund_with_krishibazar}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PermissionGuard>
    </DefaultLayout>
  );
}
