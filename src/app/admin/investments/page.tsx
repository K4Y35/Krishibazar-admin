"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import request from "@/services/httpServices";
import toast from "react-hot-toast";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaClock,
  FaUser,
  FaProjectDiagram,
} from "react-icons/fa";

export default function AdminInvestmentsPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<{
    status: string;
    payment_status: string;
    page: number;
    limit: number;
  }>({
    status: "",
    payment_status: "",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }>({
    totalPages: 1,
    currentPage: 1,
    totalCount: 0,
  });

  useEffect(() => {
    fetchInvestments();
  }, [filters]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.payment_status) queryParams.append("payment_status", filters.payment_status);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const response = await request.get(`/admin/investments?${queryParams}`);
      
      if (response.success) {
        setInvestments(response.data.investments);
        setPagination({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          totalCount: response.data.totalCount,
        });
      } else {
        toast.error("Failed to fetch investments");
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Failed to fetch investments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePaymentStatusChange = (payment_status: string) => {
    setFilters(prev => ({ ...prev, payment_status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const confirmInvestment = async (id: number) => {
    try {
      const paymentReference = prompt("Enter payment reference/transaction ID:");
      if (!paymentReference) return;

      const response = await request.put(`/admin/investments/${id}/confirm`, {
        payment_reference: paymentReference,
        payment_method: "bank_transfer",
      });

      if (response.success) {
        toast.success("Investment confirmed successfully");
        fetchInvestments();
      } else {
        toast.error(response.message || "Failed to confirm investment");
      }
    } catch (error) {
      console.error("Error confirming investment:", error);
      toast.error("Failed to confirm investment");
    }
  };

  const cancelInvestment = async (id: number) => {
    try {
      const reason = prompt("Enter cancellation reason:");
      if (!reason) return;

      const response = await request.put(`/admin/investments/${id}/cancel`, {
        reason,
      });

      if (response.success) {
        toast.success("Investment cancelled successfully");
        fetchInvestments();
      } else {
        toast.error(response.message || "Failed to cancel investment");
      }
    } catch (error) {
      console.error("Error cancelling investment:", error);
      toast.error("Failed to cancel investment");
    }
  };

  const completeInvestment = async (id: number) => {
    try {
      const returnAmount = prompt("Enter actual return amount:");
      if (!returnAmount) return;

      const response = await request.put(`/admin/investments/${id}/complete`, {
        return_amount: parseFloat(returnAmount),
      });

      if (response.success) {
        toast.success("Investment completed successfully");
        fetchInvestments();
      } else {
        toast.error(response.message || "Failed to complete investment");
      }
    } catch (error) {
      console.error("Error completing investment:", error);
      toast.error("Failed to complete investment");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FaClock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: FaCheck },
      cancelled: { color: "bg-red-100 text-red-800", icon: FaTimes },
      completed: { color: "bg-green-100 text-green-800", icon: FaCheck },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig: Record<string, { color: string; icon: any }> = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: FaClock },
      paid: { color: "bg-green-100 text-green-800", icon: FaCheck },
      failed: { color: "bg-red-100 text-red-800", icon: FaTimes },
      refunded: { color: "bg-gray-100 text-gray-800", icon: FaMoneyBillWave },
    };

    const config = statusConfig[paymentStatus] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Investments" />
        
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Investment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all investment requests and payments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Status
            </label>
            <select
              value={filters.payment_status}
              onChange={(e) => handlePaymentStatusChange(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Investments Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              All Investments ({pagination.totalCount})
            </h4>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
            <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-1 flex items-center">
                <p className="font-medium">User</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Project</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Amount</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Status</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Payment</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Date</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Actions</p>
              </div>
            </div>

            {investments.map((investment) => (
              <div
                key={investment.id}
                className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              >
                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-12.5 w-15 rounded-md">
                      <FaUser className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-black dark:text-white">
                        {investment.first_name} {investment.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{investment.email}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col">
                    <p className="text-sm text-black dark:text-white">
                      {investment.project_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {investment.farmer_name}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 flex items-center">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-black dark:text-white">
                      ৳{investment.total_amount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {investment.units_invested} units
                    </p>
                  </div>
                </div>

                <div className="col-span-1 flex items-center">
                  {getStatusBadge(investment.status)}
                </div>

                <div className="col-span-1 flex items-center">
                  {getPaymentStatusBadge(investment.payment_status)}
                </div>

                <div className="col-span-1 flex items-center">
                  <p className="text-sm text-black dark:text-white">
                    {new Date(investment.investment_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <button
                    onClick={() => router.push(`/admin/investments/${investment.id}`)}
                    className="inline-flex items-center justify-center rounded bg-primary px-3 py-1 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    <FaEye className="mr-1" />
                    View
                  </button>

                  {investment.status === "pending" && (
                    <>
                      <button
                        onClick={() => confirmInvestment(investment.id)}
                        className="inline-flex items-center justify-center rounded bg-green-600 px-3 py-1 text-center font-medium text-white hover:bg-opacity-90"
                      >
                        <FaCheck className="mr-1" />
                        Confirm
                      </button>
                      <button
                        onClick={() => cancelInvestment(investment.id)}
                        className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-1 text-center font-medium text-white hover:bg-opacity-90"
                      >
                        <FaTimes className="mr-1" />
                        Cancel
                      </button>
                    </>
                  )}

                  {investment.status === "confirmed" && (
                    <button
                      onClick={() => completeInvestment(investment.id)}
                      className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      <FaMoneyBillWave className="mr-1" />
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 md:px-6 2xl:px-7.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
