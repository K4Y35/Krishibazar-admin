import request from "./httpServices";
import apiUrls from "@/config/apiUrls";
import { Product, ProductFormData, ProductFilters } from "@/types/product";

const productService = {
  // Get all products with filters
  getAllProducts: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.in_stock) params.append('in_stock', filters.in_stock);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `${apiUrls.products.list}?${queryString}` : apiUrls.products.list;
    return request.get(url);
  },

  // Get product by ID
  getProductById: async (id: number) => {
    return request.get(`${apiUrls.products.list}/${id}`);
  },

  // Create new product
  createProduct: async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', data.price.toString());
    formData.append('unit', data.unit);
    formData.append('min_order', data.min_order.toString());
    if (data.max_order) formData.append('max_order', data.max_order.toString());
    formData.append('in_stock', data.in_stock.toString());
    if (data.description) formData.append('description', data.description);
    if (data.nutritional_info) formData.append('nutritional_info', data.nutritional_info);
    if (data.harvest_date) formData.append('harvest_date', data.harvest_date);
    if (data.shelf_life) formData.append('shelf_life', data.shelf_life);
    if (data.farmer) formData.append('farmer', data.farmer);
    if (data.certifications) formData.append('certifications', data.certifications);
    if (data.rating) formData.append('rating', data.rating.toString());
    if (data.reviews) formData.append('reviews', data.reviews.toString());
    
    if (data.product_images && data.product_images.length > 0) {
      data.product_images.forEach((image) => {
        formData.append('product_image', image);
      });
    }

    return request.post(apiUrls.products.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update product
  updateProduct: async (id: number, data: Partial<ProductFormData>) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key as keyof ProductFormData];
      if (value !== undefined && value !== null && key !== 'product_images') {
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'number') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as string);
        }
      }
    });
    
    if (data.product_images && data.product_images.length > 0) {
      data.product_images.forEach((image) => {
        formData.append('product_image', image);
      });
    }

    return request.put(`${apiUrls.products.update}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete product
  deleteProduct: async (id: number) => {
    return request.delete(`${apiUrls.products.delete}/${id}`);
  },
};

export default productService;


