import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface BrandCard {
  id: string;
  brand: string;
  badge: string;
  title: string;
  offer: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  logo: string | React.ReactNode;
  image: string;
}

const BRAND_CARDS: BrandCard[] = [
  {
    id: 'apple',
    brand: 'Apple',
    badge: 'IPHONE',
    title: 'iPhone',
    offer: 'UP to 80% OFF',
    bgColor: 'bg-[#25282B]',
    textColor: 'text-white',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    logo: (
      <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.69-3.08-7.81-7.98-12.36-14.7-6.86-10.15-12.19-21.2-15.98-33.16-3.8-11.96-5.7-23.33-5.7-34.12 0-15.42 3.86-28.05 11.58-37.89 7.72-9.84 17.51-14.89 29.38-15.15 4.7 0 9.87 1.15 15.52 3.44 5.65 2.29 9.54 3.44 11.66 3.44 1.8 0 5.86-1.22 12.17-3.66 6.31-2.44 11.64-3.56 15.99-3.36 12.87.52 23.01 5.3 30.42 14.33-11.45 6.94-17.06 16.59-16.83 28.95.23 9.68 3.97 17.65 11.22 23.9 7.25 6.25 15.89 9.77 25.92 10.56-2.58 7.55-5.87 14.93-9.87 22.14zM119.22 31.07c0-7.39 2.65-14.47 7.95-21.24 5.3-6.77 12.01-10.84 20.13-12.21.67 7.52-1.89 14.76-7.68 21.72-5.79 6.96-12.56 10.95-20.4 11.73z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'realme',
    brand: 'Realme',
    badge: 'REALME',
    title: 'realme',
    offer: 'UP to 80% OFF',
    bgColor: 'bg-[#FFF4D3]',
    textColor: 'text-gray-900',
    badgeBg: 'bg-[#F7E7B6]',
    badgeText: 'text-amber-950',
    logo: (
      <span className="font-extrabold text-[#FFC400] text-xl bg-black px-2 py-0.5 rounded-sm">
        realme
      </span>
    ),
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'xiaomi',
    brand: 'Xiaomi',
    badge: 'XIAOMI',
    title: 'mi',
    offer: 'UP to 80% OFF',
    bgColor: 'bg-[#FFEBE5]',
    textColor: 'text-gray-900',
    badgeBg: 'bg-[#FFD9CD]',
    badgeText: 'text-orange-950',
    logo: (
      <div className="w-8 h-8 bg-[#FF6900] text-white rounded-lg flex items-center justify-center font-black text-sm">
        mi
      </div>
    ),
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
  },
];

interface BrandDealsProps {
  onBrandClick?: (brand: string) => void;
  onViewAll?: () => void;
}

export const BrandDealsSection: React.FC<BrandDealsProps> = ({
  onBrandClick,
  onViewAll,
}) => {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-6">
        <div className="relative pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span>Top</span>
            <span className="text-[#008ECC]">Electronics Brands</span>
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

      {/* Brand Banner Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BRAND_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => onBrandClick?.(card.brand)}
            className={`relative overflow-hidden rounded-2xl ${card.bgColor} ${card.textColor} p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-48 flex items-center justify-between group`}
          >
            {/* Left Info */}
            <div className="flex flex-col justify-between h-full z-10">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md w-fit ${card.badgeBg} ${card.badgeText}`}>
                {card.badge}
              </span>

              <div className="my-auto">
                <div className="mb-1">{card.logo}</div>
                <div className="text-xl font-extrabold tracking-tight">
                  {card.offer}
                </div>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <img
                src={card.image}
                alt={card.brand}
                className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[0, 1, 2, 3, 4, 5, 6].map((dot) => (
          <button
            key={dot}
            onClick={() => setActiveDot(dot)}
            className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
              activeDot === dot
                ? 'w-6 h-2 bg-[#008ECC]'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Brand Slide ${dot + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BrandDealsSection;
