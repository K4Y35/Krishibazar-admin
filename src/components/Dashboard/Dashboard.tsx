"use client";

import React, { useEffect, useState } from "react";
import CardDataStats from "@/components/CardDataStats";
import userService from "@/services/userServices";
import productService from "@/services/productServices";
import projectService from "@/services/projectServices";


type KpiCounts = {
  users: number;
  products: number;
  projects: number;
  orders: number;
  pendingProjects: number;
};

const Dashboard: React.FC = () => {
  const [counts, setCounts] = useState<KpiCounts>({
    users: 0,
    products: 0,
    projects: 0,
    orders: 0,
    pendingProjects: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [usersRes, productsRes, projectsRes] = await Promise.all([
          userService
            .getAllUsers()
            .then((r: any) => r?.data?.users?.length ?? r?.data?.length ?? 0)
            .catch(() => 0),
          productService
            .getAllProducts({ page: 1, limit: 10 })
            .then(
              (r: any) =>
                r?.data?.total ??
                r?.data?.products?.total ??
                r?.data?.length ??
                0,
            )
            .catch(() => 0),
          projectService
            .getAllProjects({ page: 1, limit: 10 })
            .then((r: any) => {
              const total =
                r?.data?.total ??
                r?.data?.projects?.total ??
                r?.data?.length ??
                0;
              const list =
                r?.data?.projects?.data ?? r?.data?.projects ?? r?.data ?? [];
              const pending = Array.isArray(list)
                ? list.filter((p: any) => p?.status === "pending").length
                : 0;
              return { total, pending };
            })
            .catch(() => ({ total: 0, pending: 0 })),
        ]);

        const ordersResponse = await fetch(
          "http://localhost:4000/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
          },
        )
          .then((r) => r.json())
          .catch(() => null);

        if (!isMounted) return;
        const ordersList: any[] = ordersResponse?.data?.orders ?? [];
        setCounts({
          users: Number(usersRes) || 0,
          products: Number(productsRes) || 0,
          projects: Number(projectsRes?.total) || 0,
          orders: Array.isArray(ordersList) ? ordersList.length : 0,
          pendingProjects: Number(projectsRes?.pending) || 0,
        });
        setRecentOrders(
          Array.isArray(ordersList) ? ordersList.slice(0, 5) : [],
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-full md:p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-5 rounded-lg bg-white p-4 dark:bg-gray-800 md:flex-row">
        <h4 className="text-2xl font-bold text-primaryPink  dark:text-white md:text-3xl">
          Dashboard
        </h4>
      </div>

      <div className="mb-6 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardDataStats
            title="Total Users"
            total={loading ? "…" : String(counts.users)}
            trend="neutral"
            pageUrl="/manage-users/all-users"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.761 0 5-2.686 5-6S14.761 0 12 0 7 2.686 7 6s2.239 6 5 6Z"
                  fill="currentColor"
                />
                <path
                  d="M0 22c0-4.418 5.373-8 12-8s12 3.582 12 8v2H0v-2Z"
                  fill="currentColor"
                />
              </svg>
            }
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardDataStats
            title="Products"
            total={loading ? "…" : String(counts.products)}
            trend="neutral"
            pageUrl="/admin/products"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7l9-5 9 5v10l-9 5-9-5V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardDataStats
            title="Orders"
            total={loading ? "…" : String(counts.orders)}
            trend="neutral"
            pageUrl="/admin/orders"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M1 21h22" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CardDataStats
            title="Projects (pending)"
            total={
              loading ? "…" : `${counts.projects} (${counts.pendingProjects})`
            }
            trend={counts.pendingProjects > 0 ? "down" : "up"}
            trendPercentage={
              counts.pendingProjects > 0 ? `${counts.pendingProjects}` : "0"
            }
            pageUrl="/admin/projects"
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 4h16v6H4z" stroke="currentColor" strokeWidth="2" />
                <path d="M4 14h10v6H4z" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-title-lg font-semibold text-black dark:text-white">
                  Recent Orders
                </h3>
                <p className="text-body-color text-sm">Last 5 orders</p>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center">Loading…</div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No orders found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          #{order.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {order.customer_name ||
                            `${order.first_name || ""} ${order.last_name || ""}` ||
                            "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {order.product_name || "Unknown"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {order.order_quantity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          ৳{(order.total_price ?? 0).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                          {order.order_status}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString()
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
