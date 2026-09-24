import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

const TOP_CATEGORIES: CategoryItem[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'watches',
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'decor',
    name: 'Decor',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80',
  },
];

interface TopCategoriesProps {
  onCategorySelect?: (categoryName: string) => void;
  onViewAll?: () => void;
}

export const TopCategoriesSection: React.FC<TopCategoriesProps> = ({
  onCategorySelect,
  onViewAll,
}) => {
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

      {/* Categories Horizontal Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 sm:gap-6 items-center justify-items-center">
        {TOP_CATEGORIES.map((cat, idx) => {
          const isSelected = idx === 0; // First item encircled in cyan matching Figma
          return (
            <div
              key={cat.id}
              onClick={() => onCategorySelect?.(cat.name)}
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
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain filter drop-shadow-xs"
                />
              </div>

              <span className="text-xs font-medium text-gray-700 mt-2.5 group-hover:text-[#008ECC] transition-colors text-center">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopCategoriesSection;
