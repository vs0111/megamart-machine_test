import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../../types/product';
import { productService } from '../../services/productService';

interface DealsSectionProps {
  onProductClick?: (product: Product) => void;
  onViewAll?: () => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  onProductClick,
  onViewAll,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getProducts({ limit: 5, sort: 'newest' })
      .then((res) => {
        if (isMounted) {
          setProducts(res.data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-10">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-6">
        <div className="relative pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span>Grab the best deal on</span>
            <span className="text-[#008ECC]">Top Products</span>
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              discountPercentage={20}
              onSelect={onProductClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DealsSection;
