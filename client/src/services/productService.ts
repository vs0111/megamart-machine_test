import type { Product, ProductFilters, PaginatedProductsResponse } from '../types/product';

const API_BASE_URL = 'http://localhost:5000/api/products';

export const productService = {
  /**
   * Fetch product grid listing driven by backend API parameters:
   * category, minPrice, maxPrice, sort, search query (q), and pagination.
   */
  async getProducts(filters: ProductFilters = {}): Promise<PaginatedProductsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.q && filters.q.trim()) {
        queryParams.append('q', filters.q.trim());
      }
      if (filters.category && filters.category.trim() && filters.category !== 'All') {
        queryParams.append('category', filters.category.trim());
      }
      if (filters.minPrice !== undefined) {
        queryParams.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined) {
        queryParams.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.sort) {
        queryParams.append('sort', filters.sort);
      }
      if (filters.page) {
        queryParams.append('page', filters.page.toString());
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products from backend API.');
      }

      const resData = await response.json();
      return {
        data: resData.data,
        pagination: resData.pagination,
      };
    } catch (err) {
      console.error('Error fetching products from API:', err);
      throw err;
    }
  },

  /**
   * Fetch single product details by slug from backend API.
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch product details for ${slug}`);
      }

      const resData = await response.json();
      return resData.product;
    } catch (err) {
      console.error(`Error fetching product slug ${slug}:`, err);
      return null;
    }
  },

  /**
   * Fetch list of distinct product categories strictly from backend MongoDB database.
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories from MongoDB database.');
      }
      const resData = await response.json();
      return ['All', ...resData.categories];
    } catch (err) {
      console.error('Error fetching categories from database API:', err);
      return ['All'];
    }
  },
};
