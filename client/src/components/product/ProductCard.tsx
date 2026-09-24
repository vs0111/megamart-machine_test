import React from 'react';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  discountPercentage?: number;
  onSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discountPercentage = 56,
  onSelect,
}) => {
  const mainVariant = product.variants?.[0];
  const price = mainVariant?.price ?? product.minPrice;
  const originalPrice = mainVariant?.originalPrice ?? Math.round(price * 1.8);
  const savings = originalPrice - price;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN').format(val);
  };

  return (
    <div
      onClick={() => onSelect?.(product)}
      className="group relative bg-white rounded-2xl border-2 border-slate-100 hover:border-[#008ECC] shadow-xs hover:shadow-md transition-colors duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Top Right Discount Badge */}
      <div className="absolute top-0 right-0 z-10 bg-[#008ECC] text-white font-extrabold text-[11px] px-2.5 py-1 rounded-bl-xl rounded-tr-xl tracking-tight shadow-xs">
        {discountPercentage}% OFF
      </div>

      {/* Image Container */}
      <div className="bg-[#F5F7FA] p-6 rounded-t-2xl flex items-center justify-center h-48 sm:h-52 relative overflow-hidden">
        <img
          src={product.featuredImage || product.images?.[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          <h3 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-[#008ECC] transition-colors">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-extrabold text-gray-900 text-base md:text-lg">
              ₹{formatPrice(price)}
            </span>
            {originalPrice > price && (
              <span className="text-gray-400 line-through text-xs font-medium">
                ₹{formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Savings Green Indicator */}
        {savings > 0 && (
          <div className="pt-2 border-t border-gray-100 text-[#00A046] font-bold text-xs">
            Save - ₹{formatPrice(savings)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
