"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import request from "@/services/httpServices";
import toast from "react-hot-toast";
import { FaClock, FaEye, FaMoneyBillWave } from "react-icons/fa";

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }>({ totalPages: 1, currentPage: 1, totalCount: 0 });

  useEffect(() => {
    fetchInvestments();
  }, [page]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("payment_status", "pending");
      params.append("page", page.toString());
      params.append("limit", "20");
      const response = await request.get(`/admin/investments?${params}`);
      if (response.success) {
        setInvestments(response.data.investments || []);
        setPagination({
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
          totalCount: response.data.totalCount,
        });
      } else {
        toast.error("Failed to fetch investments for payment confirmation");
      }
    } catch (err) {
      console.error("Error fetching investments:", err);
      toast.error("Failed to fetch investments for payment confirmation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Payment Confirmation" />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Payment Confirmation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review investments awaiting payment confirmation
          </p>
        </div>

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="px-4 py-6 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Pending Payment ({pagination.totalCount})
            </h4>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center">
                  <p className="font-medium">Project</p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">Units</p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">Amount</p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">Payment</p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">Actions</p>
                </div>
              </div>

              {investments.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                >
                  <div className="col-span-2 flex items-center">
                    <div className="flex flex-col">
                      <p className="text-sm text-black dark:text-white">
                        {inv.project_name}
                      </p>
                      <p className="text-xs text-gray-500">{inv.farmer_name}</p>
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {inv.units_invested}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="text-sm font-medium text-black dark:text-white">
                      ৳{inv.total_amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FaClock className="w-3 h-3 mr-1" />
                      Pending
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/investments/${inv.id}`)}
                      className="inline-flex items-center justify-center rounded bg-primary px-3 py-1 text-center font-medium text-white hover:bg-opacity-90"
                    >
                      <FaEye className="mr-1" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 md:px-6 2xl:px-7.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
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


