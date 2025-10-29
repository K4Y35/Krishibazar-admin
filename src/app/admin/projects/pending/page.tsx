"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import projectService from "@/services/projectServices";
import { Project } from "@/types/project";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PendingProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAllProjects({ status: "pending" });
      setProjects(response.data.projects || []);
    } catch (error) {
      toast.error("Failed to fetch pending projects");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this project?")) return;
    try {
      await projectService.approveProject(id);
      toast.success("Project approved successfully");
      fetchPendingProjects();
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
      fetchPendingProjects();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject project");
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <DefaultLayout>
      <PermissionGuard permission="project_approval">
        <Breadcrumb pageName="Pending Projects" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Projects Pending Approval
            </h3>
            <p className="text-sm text-gray-500">
              Review and approve projects submitted by administrators
            </p>
          </div>

          <div className="p-7">
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
                        Investment Details
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Duration
                      </th>
                      <th className="px-4 py-4 font-medium text-black dark:text-white">
                        Submitted
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
                            <p className="text-sm text-gray-500">
                              {project.farmer_address}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <div>
                            <p className="text-black dark:text-white">
                              ৳{project.per_unit_price} per unit
                            </p>
                            <p className="text-sm text-gray-500">
                              Returns: ৳{project.total_returnable_per_unit}
                            </p>
                            <p className="text-sm text-gray-500">
                              Earning: {project.earning_percentage}%
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-black dark:text-white">
                            {project.project_duration} months
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <p className="text-sm text-gray-500">
                            {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center space-x-3.5">
                            <button
                              onClick={() => handleViewDetails(project)}
                              className="hover:text-primary"
                            >
                              View Details
                            </button>
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
                No pending projects found
              </div>
            )}
          </div>
        </div>

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 dark:bg-boxdark">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-black dark:text-white">
                  Project Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Farmer Information */}
                <div>
                  <h4 className="mb-3 text-lg font-medium text-black dark:text-white">
                    Farmer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-black dark:text-white">{selectedProject.farmer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-black dark:text-white">{selectedProject.farmer_phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-black dark:text-white">{selectedProject.farmer_address}</p>
                    </div>
                    {(selectedProject.nid_card_front || selectedProject.nid_card_back) && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-2">NID Card Photos</p>
                        <div className="flex gap-4">
                          {selectedProject.nid_card_front && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Front</p>
                              <img
                                src={`http://localhost:4000/public/${selectedProject.nid_card_front}`}
                                alt="NID Front"
                                className="max-w-xs rounded border border-stroke dark:border-strokedark"
                              />
                            </div>
                          )}
                          {selectedProject.nid_card_back && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Back</p>
                              <img
                                src={`http://localhost:4000/public/${selectedProject.nid_card_back}`}
                                alt="NID Back"
                                className="max-w-xs rounded border border-stroke dark:border-strokedark"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Information */}
                <div>
                  <h4 className="mb-3 text-lg font-medium text-black dark:text-white">
                    Project Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Project Name</p>
                      <p className="text-black dark:text-white">{selectedProject.project_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-black dark:text-white">{selectedProject.project_duration} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Per Unit Price</p>
                      <p className="text-black dark:text-white">৳{selectedProject.per_unit_price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Units</p>
                      <p className="text-black dark:text-white font-medium">{selectedProject.total_units}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Returnable Per Unit</p>
                      <p className="text-black dark:text-white">৳{selectedProject.total_returnable_per_unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Earning Percentage</p>
                      <p className="text-black dark:text-white">{selectedProject.earning_percentage}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Why Fund with KrishiBazar</p>
                      <p className="text-black dark:text-white">{selectedProject.why_fund_with_krishibazar}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-stroke dark:border-strokedark">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded border border-stroke px-6 py-2 text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedProject.id!);
                      setShowModal(false);
                    }}
                    className="rounded bg-danger px-6 py-2 text-white hover:bg-opacity-90"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedProject.id!);
                      setShowModal(false);
                    }}
                    className="rounded bg-success px-6 py-2 text-white hover:bg-opacity-90"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </PermissionGuard>
    </DefaultLayout>
  );
}
