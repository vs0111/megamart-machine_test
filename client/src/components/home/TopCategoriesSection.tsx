import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { productService } from '../../services/productService';

interface TopCategoriesProps {
  onCategorySelect?: (categoryName: string) => void;
  onViewAll?: () => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
  Electronics: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
  Groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80',
  Fashion: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&auto=format&fit=crop&q=80',
  'Beauty & Personal Care': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80',
  'Sports & Outdoors': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&auto=format&fit=crop&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80';

export const TopCategoriesSection: React.FC<TopCategoriesProps> = ({
  onCategorySelect,
  onViewAll,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getCategories()
      .then((cats) => {
        if (isMounted) {
          // Filter out 'All' for top categories display
          setCategories(cats.filter((c) => c !== 'All'));
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
            <span>Shop From</span>
            <span className="text-[#008ECC]">Top Categories</span>
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

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-6 animate-pulse py-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-24 h-24 rounded-full bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6 items-center justify-items-center">
          {categories.map((cat, idx) => {
            const isSelected = idx === 0;
            const catImg = CATEGORY_IMAGES[cat] || DEFAULT_IMAGE;

            return (
              <div
                key={cat}
                onClick={() => onCategorySelect?.(cat)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-[#F5F7FA] flex items-center justify-center p-4 transition-all duration-300 group-hover:scale-105 ${
                    isSelected
                      ? 'border-2 border-[#008ECC] shadow-md bg-white'
                      : 'group-hover:shadow-md border border-gray-100'
                  }`}
                >
                  <img
                    src={catImg}
                    alt={cat}
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                <span className="text-xs font-medium text-gray-700 mt-2.5 group-hover:text-[#008ECC] transition-colors text-center line-clamp-1">
                  {cat}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopCategoriesSection;
