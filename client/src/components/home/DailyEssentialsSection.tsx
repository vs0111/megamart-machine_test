import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

interface DailyEssentialsProps {
  onItemSelect?: (name: string) => void;
  onViewAll?: () => void;
}

export const DailyEssentialsSection: React.FC<DailyEssentialsProps> = ({
  onItemSelect,
  onViewAll,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getProducts({ category: 'Groceries', limit: 6 })
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
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-6">
        <div className="relative pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span>Daily</span>
            <span className="text-[#008ECC]">Essentials</span>
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

      {/* Grid of Essential Products */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemSelect?.(item.name)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Box */}
              <div className="w-full h-44 sm:h-48 md:h-52 bg-[#F5F7FA] rounded-2xl p-4 flex items-center justify-center border-2 border-slate-100/80 hover:border-[#008ECC] hover:shadow-md hover:bg-white transition-all duration-300 overflow-hidden">
                <img
                  src={item.featuredImage || item.images[0]}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text Info below card */}
              <div className="mt-3 text-center">
                <div className="text-xs font-medium text-gray-500 line-clamp-1 group-hover:text-[#008ECC] transition-colors">
                  {item.name}
                </div>
                <div className="text-sm font-extrabold text-gray-900 mt-0.5 tracking-tight">
                  ₹{item.minPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DailyEssentialsSection;
