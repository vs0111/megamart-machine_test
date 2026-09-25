import React, { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

interface BrandDealsProps {
  onBrandClick?: (brandOrProduct: Product) => void;
  onViewAll?: () => void;
}

const CARD_STYLES = [
  {
    bgColor: 'bg-[#1E293B]',
    textColor: 'text-white',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
  },
  {
    bgColor: 'bg-[#FFF4D3]',
    textColor: 'text-slate-900',
    badgeBg: 'bg-[#F7E7B6]',
    badgeText: 'text-amber-950',
  },
  {
    bgColor: 'bg-[#FFEBE5]',
    textColor: 'text-slate-900',
    badgeBg: 'bg-[#FFD9CD]',
    badgeText: 'text-orange-950',
  },
];

export const BrandDealsSection: React.FC<BrandDealsProps> = ({
  onBrandClick,
  onViewAll,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getProducts({ limit: 3, sort: 'price_desc' })
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

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 my-12">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2 mb-6">
        <div className="relative pb-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-1.5">
            <span>Featured</span>
            <span className="text-[#008ECC]">Premium Deals</span>
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

      {/* Brand / Premium Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const style = CARD_STYLES[index % CARD_STYLES.length];
          const mainVariant = product.variants?.[0];
          const price = mainVariant?.price ?? product.minPrice;
          const originalPrice = mainVariant?.originalPrice;

          return (
            <div
              key={product.id}
              onClick={() => onBrandClick?.(product)}
              className={`relative overflow-hidden rounded-2xl ${style.bgColor} ${style.textColor} p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-52 flex items-center justify-between group`}
            >
              {/* Left Info */}
              <div className="flex flex-col justify-between h-full z-10 max-w-[55%]">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md w-fit ${style.badgeBg} ${style.badgeText}`}>
                  {product.category}
                </span>

                <div className="my-auto space-y-1">
                  <h3 className="font-extrabold text-base line-clamp-1 group-hover:text-[#008ECC] transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-lg font-black tracking-tight">
                    ₹{price.toLocaleString('en-IN')}
                    {originalPrice && originalPrice > price && (
                      <span className="text-xs font-medium opacity-60 line-through ml-2">
                        ₹{originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold underline cursor-pointer">
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Right Product Image */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 bg-white/10 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                <img
                  src={product.featuredImage || product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BrandDealsSection;
