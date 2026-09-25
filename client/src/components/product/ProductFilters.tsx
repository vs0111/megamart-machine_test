import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import type { ProductFilters as FilterType } from '../../types/product';
import { productService } from '../../services/productService';

interface ProductFiltersProps {
  filters: FilterType;
  onFilterChange: (newFilters: Partial<FilterType>) => void;
  onReset: () => void;
}

export const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const [minPriceInput, setMinPriceInput] = useState<string>(
    filters.minPrice !== undefined ? String(filters.minPrice) : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : ''
  );
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    let isMounted = true;
    productService.getCategories().then((cats) => {
      if (isMounted) {
        setCategories(cats);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setMinPriceInput(filters.minPrice !== undefined ? String(filters.minPrice) : '');
    setMaxPriceInput(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const min = minPriceInput ? Number(minPriceInput) : undefined;
    const max = maxPriceInput ? Number(maxPriceInput) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      Swal.fire({
        title: 'Invalid Price Range',
        text: 'Minimum price cannot be greater than Maximum price.',
        icon: 'warning',
        confirmButtonColor: '#008ECC',
        customClass: {
          popup: 'rounded-2xl',
        },
      });
      return;
    }

    onFilterChange({
      minPrice: min,
      maxPrice: max,
      page: 1, // Reset to page 1 on filter update
    });
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
          <Filter className="w-5 h-5 text-[#008ECC]" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-[#008ECC] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const isSelected =
              (!filters.category && cat === 'All') ||
              filters.category?.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() =>
                  onFilterChange({
                    category: cat === 'All' ? undefined : cat,
                    page: 1,
                  })
                }
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#EAF6FC] text-[#008ECC]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#008ECC]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-[#008ECC]" />
          <span>Price Range (₹)</span>
        </h4>

        <form onSubmit={handlePriceApply} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#008ECC]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                placeholder="100000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#008ECC]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#008ECC] hover:bg-[#0077B3] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Apply Price Filter
          </button>
        </form>
      </div>
    </aside>
  );
};

export default ProductFiltersComponent;
