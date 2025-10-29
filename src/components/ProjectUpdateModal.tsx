"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import projectUpdateService, { CreateUpdateData } from "@/services/projectUpdateService";

interface ProjectUpdateModalProps {
  projectId: number;
  projectName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectUpdateModal({
  projectId,
  projectName,
  onClose,
  onSuccess,
}: ProjectUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<CreateUpdateData>({
    project_id: projectId,
    title: "",
    description: "",
    update_type: "general",
    farmer_notes: "",
    milestone_status: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const imageFiles = files.slice(0, 5); // Limit to 5 images
      setImages(imageFiles);
      
      // Create preview URLs
      const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(previewUrls);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.update_type) {
      toast.error("Title and update type are required");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const updateFormData = new FormData();
      updateFormData.append('project_id', formData.project_id.toString());
      updateFormData.append('title', formData.title);
      updateFormData.append('update_type', formData.update_type);
      
      if (formData.description) updateFormData.append('description', formData.description);
      if (formData.milestone_status) updateFormData.append('milestone_status', formData.milestone_status);
      if (formData.farmer_notes) updateFormData.append('farmer_notes', formData.farmer_notes);
      
      // Append images
      if (images.length > 0) {
        images.forEach((image) => {
          updateFormData.append('media_files', image);
        });
      }

      await projectUpdateService.createUpdateWithFiles(updateFormData);
      toast.success("Project update created and investors notified!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Post Update for: {projectName}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Crop Planting Completed"
              required
              className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Update Type <span className="text-red-500">*</span>
            </label>
            <select
              name="update_type"
              value={formData.update_type}
              onChange={handleChange}
              required
              className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            >
              <option value="general">General</option>
              <option value="progress">Progress</option>
              <option value="milestone">Milestone</option>
              <option value="financial">Financial</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed update information..."
              rows={4}
              className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block text-black dark:text-white">
              Milestone Status
            </label>
            <input
              type="text"
              name="milestone_status"
              value={formData.milestone_status}
              onChange={handleChange}
              placeholder="e.g., Planting Complete, First Harvest Ready"
              className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Farmer Notes
            </label>
            <textarea
              name="farmer_notes"
              value={formData.farmer_notes}
              onChange={handleChange}
              placeholder="Any additional notes from the farmer..."
              rows={3}
              className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">
              Update Images (Optional)
            </label>
            <div className="border-2 border-dashed border-stroke rounded-lg p-4 dark:border-strokedark">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-primary"
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm">Click to upload images (max 5)</span>
              </label>
            </div>

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-stroke dark:border-strokedark"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Update & Notify Investors"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

