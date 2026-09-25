export type ProductSize = string;
export type ProductColor = string;

export interface ProductVariant {
  id: string;
  sku: string;
  size: ProductSize;
  color: ProductColor;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  featuredImage: string;
  minPrice: number;
  maxPrice: number;
  variants: ProductVariant[];
  createdAt?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

