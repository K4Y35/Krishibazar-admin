"use client";
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PermissionGuard from "@/components/common/PermissionGuard";
import toast from "react-hot-toast";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  type: 'product' | 'supply';
  category: string;
  price: number;
  quantity: number;
  unit: string;
  min_order: number;
  max_order?: number;
  product_images?: string;
  in_stock: boolean;
  description?: string;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'product' | 'supply'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    type: 'product' as 'product' | 'supply',
    category: "",
    price: "",
    quantity: "",
    min_order: "",
    max_order: "",
    description: "",
    in_stock: true,
    product_image: null as File | null,
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedType, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const url = new URL("http://localhost:4000/admin/products");
      if (selectedType !== 'all') {
        url.searchParams.append('type', selectedType);
      }
      if (searchTerm) {
        url.searchParams.append('search', searchTerm);
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products || []);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      type: 'product',
      category: "",
      price: "",
      quantity: "",
      min_order: "",
      max_order: "",
      description: "",
      in_stock: true,
      product_image: null,
    });
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      type: product.type,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      min_order: product.min_order.toString(),
      max_order: product.max_order?.toString() || "",
      description: product.description || "",
      in_stock: product.in_stock,
      product_image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key === 'product_image') {
          if (formData.product_image) {
            formDataToSend.append('product_image', formData.product_image);
          }
        } else if (key !== 'max_order' || formData.max_order) {
          const value = formData[key as keyof typeof formData];
          if (value !== null && value !== undefined && value !== '') {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      const url = editingProduct 
        ? `http://localhost:4000/admin/products/${editingProduct.id}`
        : "http://localhost:4000/admin/products";
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(editingProduct ? "Product updated successfully" : "Product created successfully");
        setShowModal(false);
        fetchProducts();
      } else {
        toast.error(data.message || "Failed to save product");
      }
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch(`http://localhost:4000/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedType !== 'all' && product.type !== selectedType) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <PermissionGuard permission="product_management">
      <DefaultLayout>
        <Breadcrumb pageName="Products & Supplies" />
        
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-title-lg font-semibold text-black dark:text-white">
                Manage Products & Supplies
              </h3>
              <p className="text-sm text-body-color">
                Add and manage products and farm supplies
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              + Add New
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded ${
                  selectedType === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('product')}
                className={`px-4 py-2 rounded ${
                  selectedType === 'product'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setSelectedType('supply')}
                className={`px-4 py-2 rounded ${
                  selectedType === 'supply'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Farm Supplies
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-md border border-stroke px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.product_images ? (
                          <img
                            src={`http://localhost:4000/public/${product.product_images.split(',')[0]}`}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.type === 'product' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.type === 'product' ? 'Product' : 'Farm Supply'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ৳{product.price}/{product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.in_stock ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">No products found</div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'product' | 'supply' })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    required
                  >
                    <option value="product">Product</option>
                    <option value="supply">Farm Supply</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-md border border-stroke px-4 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-md border border-stroke px-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Order *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.min_order}
                    onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Order</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_order}
                    onChange={(e) => setFormData({ ...formData, max_order: e.target.value })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, product_image: e.target.files?.[0] || null })}
                    className="w-full rounded-md border border-stroke px-4 py-2"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">In Stock</label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                  >
                    {editingProduct ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DefaultLayout>
    </PermissionGuard>
  );
}

