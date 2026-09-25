import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex flex-col justify-between h-80 animate-pulse">
      {/* Top Image Placeholder */}
      <div className="bg-slate-100 rounded-xl h-44 w-full mb-4" />

      {/* Title Placeholder */}
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-slate-100 rounded-md w-3/4" />
        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
      </div>

      {/* Price & Savings Placeholder */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 bg-slate-100 rounded-md w-1/3" />
        <div className="h-4 bg-slate-100 rounded-md w-1/4" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
