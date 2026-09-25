import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
  inStock: boolean;
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({ stock, inStock }) => {
  if (!inStock || stock <= 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Out of Stock</span>
      </div>
    );
  }

  if (stock <= 5) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>Only {stock} left in stock - Order soon</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>In Stock ({stock} available)</span>
    </div>
  );
};
