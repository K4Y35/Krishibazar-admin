"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import toast from "react-hot-toast";

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  order_quantity: number;
  unit_price: number;
  total_price: number;
  order_status: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: string;
  notes?: string;
  payment_method?: string;
  payment_status: string;
  first_name?: string;
  last_name?: string;
  user_email?: string;
  user_phone?: string;
  product_name?: string;
  product_type?: string;
  category?: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const url = new URL("http://localhost:4000/admin/orders");
      if (selectedStatus !== "all") {
        url.searchParams.append("order_status", selectedStatus);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders || []);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(
        `http://localhost:4000/admin/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderNotes(order.notes || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderNotes("");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <PermissionGuard permission="product_management">
      <DefaultLayout>
        <Breadcrumb pageName="Orders" />

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-title-lg font-semibold text-black dark:text-white">
                Product Orders
              </h3>
              <p className="text-sm text-body-color">
                Manage product and supply orders
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-stroke px-4 py-2"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.customer_name ||
                            `${order.first_name || ""} ${order.last_name || ""}` ||
                            "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_phone ||
                            order.user_phone ||
                            order.customer_email ||
                            order.user_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.product_name || "Unknown"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.order_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ৳{order.total_price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <select
                            value={order.order_status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className="text-xs rounded border border-stroke"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No orders found
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">#{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold">
                    {selectedOrder.customer_name ||
                      `${selectedOrder.first_name || ""} ${selectedOrder.last_name || ""}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-semibold">
                    {selectedOrder.customer_phone ||
                      selectedOrder.user_phone ||
                      selectedOrder.customer_email ||
                      selectedOrder.user_email ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-semibold">{selectedOrder.product_name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-semibold">{selectedOrder.order_quantity}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-semibold text-green-600 text-xl">
                    ৳{selectedOrder.total_price.toLocaleString()}
                  </p>
                </div>

                {selectedOrder.delivery_address && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-semibold">
                      {selectedOrder.delivery_address}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DefaultLayout>
    </PermissionGuard>
  );
}

