"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import projectService from "@/services/projectServices";
import { ProjectFormData } from "@/types/project";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    farmer_name: "",
    farmer_phone: "",
    farmer_address: "",
    nid_card_front: null,
    nid_card_back: null,
    project_name: "",
    project_images: null,
    per_unit_price: 0,
    total_returnable_per_unit: 0,
    project_duration: 0,
    total_units: 0,
    why_fund_with_krishibazar: "",
    earning_percentage: 0,
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [previewImages, setPreviewImages] = useState<{
    front: string | null;
    back: string | null;
    project: string[];
  }>({ front: null, back: null, project: [] });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numValue = name.includes('price') || name.includes('duration') || name.includes('percentage') 
      ? parseFloat(value) || 0 
      : value;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: numValue
      };

      // Auto-calculate total_returnable_per_unit when earning_percentage changes
      if (name === 'earning_percentage' && updated.per_unit_price > 0 && numValue > 0) {
        const percentage = numValue as number;
        updated.total_returnable_per_unit = updated.per_unit_price * (1 + percentage / 100);
      }

      // Auto-calculate earning_percentage when total_returnable_per_unit changes
      if (name === 'total_returnable_per_unit' && updated.per_unit_price > 0 && numValue > 0) {
        const returnable = numValue as number;
        updated.earning_percentage = ((returnable - updated.per_unit_price) / updated.per_unit_price) * 100;
      }

      // Recalculate both when per_unit_price changes
      if (name === 'per_unit_price' && numValue > 0) {
        const unitPrice = numValue as number;
        // Recalculate earning percentage based on returnable
        if (updated.total_returnable_per_unit > 0) {
          updated.earning_percentage = ((updated.total_returnable_per_unit - unitPrice) / unitPrice) * 100;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'project') => {
    if (type === 'project') {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const imageFiles = files.slice(0, 5); // Limit to 5 images
        setFormData(prev => ({
          ...prev,
          project_images: imageFiles
        }));
        
        // Create preview URLs
        const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => ({
          ...prev,
          project: previewUrls
        }));
      }
    } else {
      const file = e.target.files?.[0] || null;
      if (file) {
        setFormData(prev => ({
          ...prev,
          [`nid_card_${type}`]: file
        }));
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewImages(prev => ({
          ...prev,
          [type]: previewUrl
        }));
        
        // Clear error when user selects file
        if (errors[`nid_card_${type}` as keyof ProjectFormData]) {
          setErrors(prev => ({
            ...prev,
            [`nid_card_${type}`]: undefined
          }));
        }
      }
    }
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
    if (formData.per_unit_price <= 0) {
      newErrors.per_unit_price = "Per unit price must be greater than 0";
    }
    if (formData.total_returnable_per_unit <= 0) {
      newErrors.total_returnable_per_unit = "Total returnable per unit must be greater than 0";
    }
    if (formData.project_duration <= 0) {
      newErrors.project_duration = "Project duration must be greater than 0";
    }
    if (!formData.why_fund_with_krishibazar.trim()) {
      newErrors.why_fund_with_krishibazar = "Why fund with KrishiBazar is required";
    }
    if (formData.earning_percentage <= 0) {
      newErrors.earning_percentage = "Earning percentage must be greater than 0";
    }
    if (formData.total_units <= 0) {
      newErrors.total_units = "Total units must be greater than 0";
    }
    if (!formData.nid_card_front) {
      newErrors.nid_card_front = "NID card front photo is required";
    }
    if (!formData.nid_card_back) {
      newErrors.nid_card_back = "NID card back photo is required";
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
      await projectService.createProject(formData);
      toast.success("Project created successfully and submitted for approval");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_management">
        <Breadcrumb pageName="Add New Project" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Project Information</h3>
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
                    NID Card Photos <span className="text-danger">*</span>
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Side */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-600">
                        Front Side
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'front')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      {errors.nid_card_front && (
                        <p className="mt-1 text-sm text-danger">{errors.nid_card_front}</p>
                      )}
                      {previewImages.front && (
                        <div className="mt-3">
                          <img
                            src={previewImages.front}
                            alt="NID Front Preview"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>

                    {/* Back Side */}
                    <div>
                      <label className="mb-2 block text-sm text-gray-600">
                        Back Side
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'back')}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                      />
                      {errors.nid_card_back && (
                        <p className="mt-1 text-sm text-danger">{errors.nid_card_back}</p>
                      )}
                      {previewImages.back && (
                        <div className="mt-3">
                          <img
                            src={previewImages.back}
                            alt="NID Back Preview"
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
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
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <p className="mt-1 text-sm text-danger">{errors.category_id}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Project Images <span className="text-meta-1">(Optional)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, 'project')}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500">You can upload up to 5 images</p>
                  {previewImages.project.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewImages.project.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Project Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    Total Units Available <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="total_units"
                    value={formData.total_units}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    placeholder="Enter total number of units available for investment"
                  />
                  {errors.total_units && (
                    <p className="mt-1 text-sm text-danger">{errors.total_units}</p>
                  )}
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
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </PermissionGuard>
    </DefaultLayout>
  );
}
