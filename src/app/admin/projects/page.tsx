"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import projectService from "@/services/projectServices";
import { Project, ProjectFilters } from "@/types/project";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

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

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Not assigned";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects(filters);
      setProjects(response.data.projects || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status: status === "all" ? "" : status, page: 1 });
  };

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search, page: 1 });
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this project?")) return;
    try {
      await projectService.approveProject(id);
      toast.success("Project approved successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve project");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;
    
    try {
      await projectService.rejectProject(id, reason);
      toast.success("Project rejected successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject project");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await projectService.deleteProject(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-warning bg-opacity-10 text-warning",
      approved: "bg-success bg-opacity-10 text-success",
      rejected: "bg-danger bg-opacity-10 text-danger",
    };
    
    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_management">
        <Breadcrumb pageName="All Projects" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Projects</h3>
            <Link
              href="/admin/projects/add"
              className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
            >
              Add New Project
            </Link>
          </div>

          <div className="p-7">
            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusFilter("all")}
                  className={`px-4 py-2 rounded ${
                    filters.status === "" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleStatusFilter("pending")}
                  className={`px-4 py-2 rounded ${
                    filters.status === "pending" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusFilter("approved")}
                  className={`px-4 py-2 rounded ${
                    filters.status === "approved" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleStatusFilter("rejected")}
                  className={`px-4 py-2 rounded ${
                    filters.status === "rejected" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Project Name
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Farmer
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Category
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Price/Unit
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Duration
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Earning %
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-stroke dark:border-strokedark">
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white font-medium">
                            {project.project_name}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <div>
                            <p className="text-black dark:text-white font-medium">
                              {project.farmer_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {project.farmer_phone}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white">
                            {getCategoryName((project as any).category_id)}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white">
                            ৳{project.per_unit_price}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white">
                            {project.project_duration} months
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white">
                            {project.earning_percentage}%
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          {getStatusBadge(project.status)}
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center space-x-3.5">
                            <Link
                              href={`/admin/projects/${project.id}`}
                              className="hover:text-primary"
                            >
                              View
                            </Link>
                            {project.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(project.id!)}
                                  className="hover:text-success"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(project.id!)}
                                  className="hover:text-danger"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(project.id!)}
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

            {projects.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No projects found
              </div>
            )}
          </div>
        </div>
      </PermissionGuard>
    </DefaultLayout>
  );
}
