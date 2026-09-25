import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product';

interface HeroBannerProps {
  onProductClick?: (product: Product) => void;
}

const BG_GRADIENTS = [
  'from-[#1B233A] to-[#263152]',
  'from-[#123832] to-[#1C4D45]',
  'from-[#152B46] to-[#1E3A5F]',
  'from-[#2C183B] to-[#47225D]',
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ onProductClick }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getProducts({ limit: 4, sort: 'newest' })
      .then((res) => {
        if (isMounted && res.data.length > 0) {
          setFeaturedProducts(res.data);
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

  const prevSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 my-6">
        <div className="w-full min-h-[300px] bg-slate-200 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (featuredProducts.length === 0) return null;

  const activeProduct = featuredProducts[currentSlide];
  const bgGradient = BG_GRADIENTS[currentSlide % BG_GRADIENTS.length];
  const mainVariant = activeProduct.variants?.[0];
  const price = mainVariant?.price ?? activeProduct.minPrice;
  const originalPrice = mainVariant?.originalPrice;

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 my-6">
      {/* Left Navigation Arrow */}
      {featuredProducts.length > 1 && (
        <button
          onClick={prevSlide}
          className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-[#008ECC] shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100/80 focus:outline-none"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Right Navigation Arrow */}
      {featuredProducts.length > 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-[#008ECC] shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100/80 focus:outline-none"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Main Banner Card */}
      <div
        onClick={() => onProductClick?.(activeProduct)}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${bgGradient} text-white shadow-xl min-h-[280px] sm:min-h-[320px] md:min-h-[360px] flex items-center px-6 sm:px-12 md:px-16 py-8 transition-all duration-500 cursor-pointer group`}
      >
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/4 -translate-y-1/4" />

        <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center gap-6 z-10">
          {/* Left Content */}
          <div className="md:col-span-7 flex flex-col justify-center overflow-hidden">
            <span className="text-slate-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">
              {activeProduct.category}
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-snug line-clamp-2 group-hover:text-[#60A5FA] transition-colors">
              {activeProduct.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-base text-slate-300 line-through font-medium">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-2 bg-[#008ECC] hover:bg-[#0077B3] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors w-fit shadow-md">
              <span>Explore Product</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Slide Pagination Dots */}
            {featuredProducts.length > 1 && (
              <div className="flex items-center gap-2 mt-6">
                {featuredProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                      currentSlide === idx
                        ? 'w-7 h-2.5 bg-white'
                        : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Image Container */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-white p-4">
              <img
                src={activeProduct.featuredImage || activeProduct.images[0]}
                alt={activeProduct.name}
                className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
