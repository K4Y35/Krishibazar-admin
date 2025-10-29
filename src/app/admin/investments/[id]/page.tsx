"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import request from "@/services/httpServices";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaClock,
  FaUser,
  FaProjectDiagram,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function InvestmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [investment, setInvestment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestment();
  }, [params.id]);

  const fetchInvestment = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/admin/investments/${params.id}`);
      
      if (response.success) {
        setInvestment(response.data);
      } else {
        toast.error("Investment not found");
        router.push("/admin/investments");
      }
    } catch (error) {
      console.error("Error fetching investment:", error);
      toast.error("Failed to fetch investment details");
      router.push("/admin/investments");
    } finally {
      setLoading(false);
    }
  };

  const confirmInvestment = async () => {
    try {
      const paymentReference = prompt("Enter payment reference/transaction ID:");
      if (!paymentReference) return;

      const response = await request.put(`/admin/investments/${params.id}/confirm`, {
        payment_reference: paymentReference,
        payment_method: "bank_transfer",
      });

      if (response.success) {
        toast.success("Investment confirmed successfully");
        fetchInvestment();
      } else {
        toast.error(response.message || "Failed to confirm investment");
      }
    } catch (error) {
      console.error("Error confirming investment:", error);
      toast.error("Failed to confirm investment");
    }
  };

  const cancelInvestment = async () => {
    try {
      const reason = prompt("Enter cancellation reason:");
      if (!reason) return;

      const response = await request.put(`/admin/investments/${params.id}/cancel`, {
        reason,
      });

      if (response.success) {
        toast.success("Investment cancelled successfully");
        fetchInvestment();
      } else {
        toast.error(response.message || "Failed to cancel investment");
      }
    } catch (error) {
      console.error("Error cancelling investment:", error);
      toast.error("Failed to cancel investment");
    }
  };

  const completeInvestment = async () => {
    try {
      const returnAmount = prompt("Enter actual return amount:");
      if (!returnAmount) return;

      const response = await request.put(`/admin/investments/${params.id}/complete`, {
        return_amount: parseFloat(returnAmount),
      });

      if (response.success) {
        toast.success("Investment completed successfully");
        fetchInvestment();
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading investment details...</p>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (!investment) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Investment Not Found</h2>
            <button
              onClick={() => router.push("/admin/investments")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Investments
            </button>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Investment Details" />
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Investments
          </button>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Investment Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Investment ID: #{investment.id}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Investment Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4">Investment Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(investment.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Status:</span>
                {getPaymentStatusBadge(investment.payment_status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Units Invested:</span>
                <span>{investment.units_invested}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Amount per Unit:</span>
                <span>৳{investment.amount_per_unit?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="font-semibold">৳{investment.total_amount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Expected Return:</span>
                <span className="text-green-600 font-semibold">৳{investment.expected_return_amount?.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{investment.payment_method}</span>
              </div>

              {investment.payment_reference && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Payment Reference:</span>
                  <span className="font-mono text-sm">{investment.payment_reference}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="font-medium">Investment Date:</span>
                <span>{new Date(investment.investment_date).toLocaleDateString()}</span>
              </div>

              {investment.payment_date && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Payment Date:</span>
                  <span>{new Date(investment.payment_date).toLocaleDateString()}</span>
                </div>
              )}

              {investment.return_received > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Return Received:</span>
                  <span className="text-green-600 font-semibold">৳{investment.return_received?.toLocaleString()}</span>
                </div>
              )}

              {investment.return_date && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Return Date:</span>
                  <span>{new Date(investment.return_date).toLocaleDateString()}</span>
                </div>
              )}

              {investment.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="text-gray-600 mt-1">{investment.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-boxdark">
            <h2 className="text-xl font-semibold mb-4">Investor Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUser className="text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-600">{investment.first_name} {investment.last_name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <FaUser className="text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{investment.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-boxdark lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaProjectDiagram className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Project Name</p>
                    <p className="text-gray-600">{investment.project_name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUser className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Farmer</p>
                    <p className="text-gray-600">{investment.farmer_name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-600">{investment.farmer_address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Project Duration:</span>
                  <span>{investment.project_duration} months</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Per Unit Price:</span>
                  <span>৳{investment.per_unit_price?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Expected Return per Unit:</span>
                  <span>৳{investment.total_returnable_per_unit?.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Earning Percentage:</span>
                  <span>{investment.earning_percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          {investment.status === "pending" && (
            <>
              <button
                onClick={confirmInvestment}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <FaCheck className="mr-2" />
                Confirm Investment
              </button>
              <button
                onClick={cancelInvestment}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel Investment
              </button>
            </>
          )}

          {investment.status === "confirmed" && (
            <button
              onClick={completeInvestment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FaMoneyBillWave className="mr-2" />
              Complete Investment
            </button>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
