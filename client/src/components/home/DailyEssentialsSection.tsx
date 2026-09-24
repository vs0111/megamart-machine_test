import React from 'react';
import { ChevronRight } from 'lucide-react';

interface EssentialItem {
  id: string;
  name: string;
  offer: string;
  image: string;
}

const DAILY_ESSENTIALS: EssentialItem[] = [
  {
    id: 'essentials',
    name: 'Daily Essentials',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'vegetables',
    name: 'Vegitables',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'fruits',
    name: 'Fruits',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'mango',
    name: 'Mango',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cherry',
    name: 'Cherry',
    offer: 'UP to 50% OFF',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&auto=format&fit=crop&q=80',
  },
];

interface DailyEssentialsProps {
  onItemSelect?: (name: string) => void;
  onViewAll?: () => void;
}

export const DailyEssentialsSection: React.FC<DailyEssentialsProps> = ({
  onItemSelect,
  onViewAll,
}) => {
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

      {/* Grid of 6 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {DAILY_ESSENTIALS.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemSelect?.(item.name)}
            className="group flex flex-col cursor-pointer"
          >
            {/* Image Box */}
            <div className="w-full h-44 sm:h-48 md:h-52 bg-[#F5F7FA] rounded-2xl p-4 flex items-center justify-center border-2 border-slate-100/80 hover:border-[#008ECC] hover:shadow-md hover:bg-white transition-all duration-300 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="max-h-full max-w-full object-contain filter drop-shadow-md transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Info below card */}
            <div className="mt-3 text-center">
              <div className="text-xs font-medium text-gray-500 group-hover:text-[#008ECC] transition-colors">
                {item.name}
              </div>
              <div className="text-sm font-extrabold text-gray-900 mt-0.5 tracking-tight">
                {item.offer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DailyEssentialsSection;
