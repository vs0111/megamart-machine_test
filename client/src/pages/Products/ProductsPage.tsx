import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, AlertTriangle, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/product/ProductCardSkeleton';
import { ProductFiltersComponent } from '../../components/product/ProductFilters';
import { productService } from '../../services/productService';
import type { Product, ProductFilters as FilterType } from '../../types/product';

interface ProductsPageProps {
  onSelectProduct?: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onSelectProduct }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filter state from URL search params
  const filters: FilterType = useMemo(() => {
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = (searchParams.get('sort') as FilterType['sort']) || 'newest';
    const q = searchParams.get('q') || undefined;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

    return {
      category,
      minPrice,
      maxPrice,
      sort,
      q,
      page,
      limit: 8,
    };
  }, [searchParams]);

  // Search input local state for debounced searching
  const [searchInput, setSearchInput] = useState(filters.q || '');

  useEffect(() => {
    setSearchInput(filters.q || '');
  }, [filters.q]);

  // Debounced search effect updating searchParams
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (searchInput.trim() !== currentQ) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('q', searchInput.trim());
          } else {
            next.delete('q');
          }
          next.set('page', '1');
          return next;
        });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, searchParams, setSearchParams]);

  // Fetch products from productService using TanStack Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  // Filter update handler updating URL searchParams
  const updateFilters = (newFilters: Partial<FilterType>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          next.set(key, String(value));
        } else {
          next.delete(key);
        }
      });
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in-50">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
        <a href="/" className="hover:text-[#008ECC] transition-colors">Home</a>
        <span>/</span>
        <span className="text-slate-900 font-bold">Products</span>
        {filters.category && (
          <>
            <span>/</span>
            <span className="text-[#008ECC] font-bold">{filters.category}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-3">
          <ProductFiltersComponent
            filters={filters}
            onFilterChange={updateFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Main Listing Section */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Controls Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-[#008ECC] focus:bg-white transition-all"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector & Product Count */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-500 font-medium">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>Showing <strong className="text-slate-900 font-bold">{data?.data.length || 0}</strong> of <strong className="text-slate-900 font-bold">{data?.pagination.total || 0}</strong> products</>
                )}
              </span>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#008ECC]" />
                <select
                  value={filters.sort || 'newest'}
                  onChange={(e) => updateFilters({ sort: e.target.value as FilterType['sort'], page: 1 })}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 outline-none focus:border-[#008ECC] cursor-pointer"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {(filters.category || filters.minPrice || filters.maxPrice || filters.q) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Active Filters:</span>
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EAF6FC] text-[#008ECC] text-xs font-semibold rounded-full">
                  Category: {filters.category}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ category: undefined, page: 1 })} />
                </span>
              )}
              {filters.q && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  Search: "{filters.q}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchInput('')} />
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                  Price: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || 'Max'}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined, page: 1 })} />
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#008ECC] underline cursor-pointer ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* LOADING STATE: Skeleton Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-red-900">Failed to load products</h3>
              <p className="text-xs text-red-700 max-w-md mx-auto">
                {error instanceof Error ? error.message : 'An unexpected network error occurred while fetching product listings.'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && data?.data.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF6FC] text-[#008ECC] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No products found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your current filters or search query. Try resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#008ECC] hover:bg-[#0077B3] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* SUCCESS STATE: Product Grid */}
          {!isLoading && !isError && (data?.data.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {data?.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}

          {/* SERVER PAGINATION BAR */}
          {!isLoading && !isError && (data?.pagination.totalPages ?? 0) > 1 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between mt-8">
              <button
                disabled={!data?.pagination.hasPrevPage}
                onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: data?.pagination.totalPages || 1 }, (_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = (filters.page || 1) === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateFilters({ page: pNum })}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#008ECC] text-white shadow-xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!data?.pagination.hasNextPage}
                onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
