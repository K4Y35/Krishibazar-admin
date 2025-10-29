"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import projectService from "@/services/projectServices";
import projectUpdateService, { ProjectUpdate } from "@/services/projectUpdateService";
import { Project } from "@/types/project";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import ProjectUpdateModal from "@/components/ProjectUpdateModal";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [investmentStats, setInvestmentStats] = useState<any>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      fetchProject(Number(params.id));
      fetchUpdates(Number(params.id));
      fetchCategories();
    }
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
        // Get category after project is loaded
        if (project && (project as any).category_id) {
          const category = data.data.find((cat: any) => cat.id === (project as any).category_id);
          if (category) {
            setCategoryName(category.name);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (project && (project as any).category_id) {
      fetchCategories();
    }
  }, [project]);

  const fetchUpdates = async (projectId: number) => {
    try {
      setLoadingUpdates(true);
      const response = await projectUpdateService.getAllUpdates({ project_id: projectId });
      setUpdates(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const fetchProject = async (id: number) => {
    try {
      setLoading(true);
      const response = await projectService.getProjectById(id);
      setProject(response.data);
      
      // Get investment stats from the project data if available
      if (response.data.investment_stats) {
        setInvestmentStats(response.data.investment_stats);
      } else {
        // Fallback: Fetch investment stats separately
        const statsResponse = await fetch(`http://localhost:4000/api/admin/investments/stats/project/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setInvestmentStats(stats.data);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch project details");
      router.push("/admin/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!project?.id) return;
    if (!confirm("Are you sure you want to approve this project?")) return;
    
    try {
      await projectService.approveProject(project.id);
      toast.success("Project approved successfully");
      fetchProject(project.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve project");
    }
  };

  const handleReject = async () => {
    if (!project?.id) return;
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;
    
    try {
      await projectService.rejectProject(project.id, reason);
      toast.success("Project rejected successfully");
      fetchProject(project.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject project");
    }
  };

  const handleDelete = async () => {
    if (!project?.id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await projectService.deleteProject(project.id);
      toast.success("Project deleted successfully");
      router.push("/admin/projects");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const handleStart = async () => {
    if (!project?.id) return;
    if (!confirm("Are you sure you want to start this project? This will prevent new investments.")) return;
    
    try {
      await projectService.startProject(project.id);
      toast.success("Project started successfully");
      fetchProject(project.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start project");
    }
  };

  const handleComplete = async () => {
    if (!project?.id) return;
    if (!confirm("Are you sure you want to complete this project?")) return;
    
    try {
      await projectService.completeProject(project.id);
      toast.success("Project completed successfully");
      fetchProject(project.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete project");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-warning bg-opacity-10 text-warning",
      approved: "bg-success bg-opacity-10 text-success",
      rejected: "bg-danger bg-opacity-10 text-danger",
      running: "bg-blue-500 bg-opacity-10 text-blue-600",
      completed: "bg-purple-500 bg-opacity-10 text-purple-600",
    };
    
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">Loading...</div>
        </div>
      </DefaultLayout>
    );
  }

  if (!project) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              Project Not Found
            </h2>
            <button
              onClick={() => router.push("/admin/projects")}
              className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_management">
        <Breadcrumb pageName={`Project: ${project.project_name}`} />

        <div className="space-y-6">
          {/* Project Header */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
              <div>
                <h3 className="text-xl font-medium text-black dark:text-white">
                  {project.project_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {getStatusBadge(project.status)}
                {project.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleApprove}
                      className="rounded bg-success px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="rounded bg-danger px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {project.status === "approved" && (
                  <>
                    <button
                      onClick={handleStart}
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Start Project
                    </button>
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Post Update
                    </button>
                  </>
                )}
                {project.status === "running" && (
                  <>
                    <button
                      onClick={handleComplete}
                      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Complete Project
                    </button>
                    <button
                      onClick={() => setShowUpdateModal(true)}
                      className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                    >
                      Post Update
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className="rounded border border-danger px-4 py-2 text-danger hover:bg-danger hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Farmer Information */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h4 className="text-lg font-medium text-black dark:text-white">
                Farmer Information
              </h4>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Farmer Name</p>
                  <p className="text-black dark:text-white font-medium">{project.farmer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-black dark:text-white">{project.farmer_phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-black dark:text-white">{project.farmer_address}</p>
                </div>
                {project.nid_card_front && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">NID Card Photos</p>
                    <div className="flex gap-4">
                      {project.nid_card_front && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Front</p>
                          <img
                            src={`http://localhost:4000/public/${project.nid_card_front}`}
                            alt="NID Front"
                            className="max-w-md rounded border"
                          />
                        </div>
                      )}
                      {project.nid_card_back && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Back</p>
                          <img
                            src={`http://localhost:4000/public/${project.nid_card_back}`}
                            alt="NID Back"
                            className="max-w-md rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h4 className="text-lg font-medium text-black dark:text-white">
                Project Details
              </h4>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Project Name</p>
                  <p className="text-black dark:text-white font-medium">{project.project_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-black dark:text-white">{categoryName || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="text-black dark:text-white">{project.project_duration} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Per Unit Price</p>
                  <p className="text-black dark:text-white font-medium">৳{project.per_unit_price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Units</p>
                  <p className="text-black dark:text-white font-medium">{project.total_units}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Units</p>
                  <p className={`font-medium ${
                    !investmentStats || (project.total_units - (investmentStats?.total_booked_units || 0)) === 0 
                      ? 'text-red-600' 
                      : (project.total_units - (investmentStats?.total_booked_units || 0)) < project.total_units * 0.2
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                    {!investmentStats ? project.total_units : Math.max(0, project.total_units - (investmentStats.total_booked_units || 0))} units
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Returnable Per Unit</p>
                  <p className="text-black dark:text-white font-medium">৳{project.total_returnable_per_unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Earning Percentage</p>
                  <p className="text-black dark:text-white font-medium">{project.earning_percentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Profit Per Unit</p>
                  <p className="text-black dark:text-white font-medium text-success">
                    ৳{(project.total_returnable_per_unit - project.per_unit_price).toFixed(2)}
                  </p>
                </div>
                {investmentStats && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Booked Units (All Statuses)</p>
                      <p className="text-black dark:text-white font-medium">
                        {investmentStats.total_booked_units || 0} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Confirmed Units</p>
                      <p className="text-green-600 font-medium">
                        {investmentStats.confirmed_units || 0} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Confirmed Investment</p>
                      <p className="text-black dark:text-white font-medium">
                        ৳{(investmentStats.confirmed_amount || 0).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Why Fund with KrishiBazar</p>
                  <p className="text-black dark:text-white">{project.why_fund_with_krishibazar}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          {project.status !== "pending" && (
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h4 className="text-lg font-medium text-black dark:text-white">
                  Approval Information
                </h4>
              </div>
              <div className="p-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p className="text-black dark:text-white">{getStatusBadge(project.status)}</p>
                  </div>
                  {project.approved_at && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Approved At</p>
                      <p className="text-black dark:text-white">
                        {new Date(project.approved_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {project.rejection_reason && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Rejection Reason</p>
                      <p className="text-black dark:text-white">{project.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Updates */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h4 className="text-lg font-medium text-black dark:text-white">
                Project Updates
              </h4>
            </div>
            <div className="p-7">
              {loadingUpdates ? (
                <p className="text-gray-500 text-center">Loading updates...</p>
              ) : updates.length === 0 ? (
                <p className="text-gray-500 text-center">No updates posted yet</p>
              ) : (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="border border-stroke rounded-lg p-4 dark:border-strokedark"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-black dark:text-white text-lg">
                          {update.title}
                        </h5>
                        <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-primary bg-opacity-10 text-primary">
                          {update.update_type}
                        </span>
                      </div>
                      {update.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                          {update.description}
                        </p>
                      )}
                      {update.milestone_status && (
                        <p className="text-sm text-gray-500 mb-2">
                          Status: {update.milestone_status}
                        </p>
                      )}
                      {(() => {
                        let mediaFiles: string[] = [];
                        if (update.media_files) {
                          if (typeof update.media_files === 'string') {
                            try {
                              mediaFiles = JSON.parse(update.media_files);
                            } catch {
                              mediaFiles = [update.media_files];
                            }
                          } else {
                            mediaFiles = update.media_files;
                          }
                        }
                        return mediaFiles.length > 0 ? (
                          <div className="my-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Images:
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {mediaFiles.map((file: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={`http://localhost:4000/uploads/${file}`}
                                  alt={`Update ${idx + 1}`}
                                  className="w-full h-24 object-cover rounded border border-stroke dark:border-strokedark"
                                />
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
                      {update.farmer_notes && (
                        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                            Farmer Notes:
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            {update.farmer_notes}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Posted: {new Date(update.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => router.push("/admin/projects")}
              className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Back to Projects
            </button>
            <button
              onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
              className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
            >
              Edit Project
            </button>
          </div>
        </div>
      </PermissionGuard>

      {/* Update Modal */}
      {showUpdateModal && project && project.id && (
        <ProjectUpdateModal
          projectId={project.id}
          projectName={project.project_name}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            fetchUpdates(Number(params.id));
            toast.success("Update posted successfully!");
          }}
        />
      )}
    </DefaultLayout>
  );
}
