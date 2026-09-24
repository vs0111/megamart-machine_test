import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../../types/product';

interface DealsSectionProps {
  onProductClick?: (product: Product) => void;
  onViewAll?: () => void;
}

const SMARTPHONE_DEALS: Product[] = [
  {
    id: 'sm-1',
    slug: 'galaxy-s22-ultra',
    name: 'Galaxy S22 Ultra',
    description: 'Flagship smartphone with S Pen and 108MP camera',
    category: 'Smartphones',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80'],
    featuredImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
    minPrice: 32999,
    maxPrice: 32999,
    variants: [
      { id: 'v1', sku: 'SAM-S22U-BLK', size: 'M', color: 'Black', price: 32999, originalPrice: 74999, stock: 12, inStock: true }
    ]
  },
  {
    id: 'sm-2',
    slug: 'galaxy-m13-4gb-64gb',
    name: 'Galaxy M13 (4GB | 64 GB )',
    description: 'Monster 6000mAh battery with FHD+ display',
    category: 'Smartphones',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80'],
    featuredImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    minPrice: 10499,
    maxPrice: 10499,
    variants: [
      { id: 'v2', sku: 'SAM-M13-GRN', size: 'M', color: 'Olive', price: 10499, originalPrice: 14999, stock: 8, inStock: true }
    ]
  },
  {
    id: 'sm-3',
    slug: 'galaxy-m33-4gb-64gb',
    name: 'Galaxy M33 (4GB | 64 GB )',
    description: '5G smartphone with 120Hz refresh rate',
    category: 'Smartphones',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80'],
    featuredImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    minPrice: 16999,
    maxPrice: 16999,
    variants: [
      { id: 'v3', sku: 'SAM-M33-BLU', size: 'M', color: 'Navy', price: 16999, originalPrice: 24999, stock: 15, inStock: true }
    ]
  },
  {
    id: 'sm-4',
    slug: 'galaxy-m53-4gb-64gb',
    name: 'Galaxy M53 (4GB | 64 GB )',
    description: '108MP Quad Camera with Voice Focus',
    category: 'Smartphones',
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80'],
    featuredImage: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&auto=format&fit=crop&q=80',
    minPrice: 31999,
    maxPrice: 31999,
    variants: [
      { id: 'v4', sku: 'SAM-M53-WHT', size: 'M', color: 'White', price: 31999, originalPrice: 40999, stock: 5, inStock: true }
    ]
  },
  {
    id: 'sm-5',
    slug: 'galaxy-s22-ultra-green',
    name: 'Galaxy S22 Ultra',
    description: 'Premium Green Edition with 256GB storage',
    category: 'Smartphones',
    images: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80'],
    featuredImage: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&auto=format&fit=crop&q=80',
    minPrice: 67999,
    maxPrice: 67999,
    variants: [
      { id: 'v5', sku: 'SAM-S22U-GRN', size: 'L', color: 'Olive', price: 67999, originalPrice: 85999, stock: 3, inStock: true }
    ]
  }
];

export const DealsSection: React.FC<DealsSectionProps> = ({
  onProductClick,
  onViewAll,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-6">
        <div className="relative pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span>Grab the best deal on</span>
            <span className="text-[#008ECC]">Smartphones</span>
          </h2>
          <div className="absolute -bottom-[9px] left-0 w-full h-[3px] bg-[#008ECC] rounded-full" />
        </div>

        <button
          onClick={onViewAll}
          className="text-xs md:text-sm font-semibold text-gray-500 hover:text-[#008ECC] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4 text-[#008ECC]" />
        </button>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {SMARTPHONE_DEALS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            discountPercentage={56}
            onSelect={onProductClick}
          />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
