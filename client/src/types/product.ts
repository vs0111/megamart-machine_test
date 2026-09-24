export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type ProductColor = 'Black' | 'White' | 'Navy' | 'Olive' | 'Beige' | 'Grey';

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
