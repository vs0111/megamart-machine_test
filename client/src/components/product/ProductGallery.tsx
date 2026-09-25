import React, { useState, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPercentage?: number;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  discountPercentage,
}) => {
  // Ensure images array is not empty
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'];
  const [selectedImage, setSelectedImage] = useState<string>(displayImages[0]);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  useEffect(() => {
    if (displayImages.length > 0) {
      setSelectedImage(displayImages[0]);
      setIsZoomed(false);
    }
  }, [images]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group">
        <img
          src={selectedImage}
          alt={productName}
          className={`w-full h-full object-contain p-6 transition-transform duration-300 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Discount Badge */}
        {discountPercentage !== undefined && discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-[#008ECC] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Zoom Hint Icon */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 hover:text-[#008ECC] hover:bg-white transition-colors shadow-sm"
          title={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail Bar */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((imgUrl, index) => {
            const isSelected = selectedImage === imgUrl;
            return (
              <button
                key={index}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative w-20 h-20 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 transition-all ${
                  isSelected
                    ? 'border-[#008ECC] ring-2 ring-[#008ECC]/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
