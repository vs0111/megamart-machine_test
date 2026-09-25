import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import {
  ShoppingCart,
  Check,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Star,
  Share2,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { ProductGallery } from '../../components/product/ProductGallery';
import { VariantSelector } from '../../components/product/VariantSelector';
import { StockIndicator } from '../../components/product/StockIndicator';
import { ProductCard } from '../../components/product/ProductCard';
import { productService } from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import type { Product, ProductVariant } from '../../types/product';

interface ProductDetailPageProps {
  slug: string;
  onBack?: () => void;
  onSelectProduct?: (product: Product) => void;
  onNavigateCart?: () => void;
  onNavigateLogin?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onBack,
  onSelectProduct,
  onNavigateCart,
  onNavigateLogin,
}) => {
  const { addItem } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 1. Fetch Product details
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  });

  // 2. Fetch related products from same category
  const { data: relatedData } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: () =>
      productService.getProducts({
        category: product?.category,
        limit: 4,
      }),
    enabled: !!product?.category,
  });

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  // Synchronize variant when product changes
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  // Handle quantity adjustment capped between 1 and available variant stock
  const handleQuantityChange = (newQty: number) => {
    if (!selectedVariant) return;
    const max = selectedVariant.stock;
    if (newQty >= 1 && newQty <= max) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in / log in first to add items to your cart.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#008ECC',
        confirmButtonText: 'Go to Sign In',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer',
          cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer',
        },
      }).then((result) => {
        if (result.isConfirmed && onNavigateLogin) {
          onNavigateLogin();
        }
      });
      return;
    }
    if (!product || !selectedVariant) return;
    const res = await addItem(product, selectedVariant, quantity);
    if (res.success) {
      setToastMessage(`Added ${quantity} x "${product.name}" to cart!`);
      setTimeout(() => setToastMessage(null), 4000);
      Swal.fire({
        title: 'Added to Cart!',
        text: `${quantity} x ${product.name} added to your cart successfully.`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: res.message || 'Could not add product to cart.',
        icon: 'error',
        confirmButtonColor: '#008ECC',
        customClass: {
          popup: 'rounded-2xl',
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-slate-200 rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-square bg-slate-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-10 bg-slate-200 rounded w-1/3" />
              <div className="h-24 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-slate-600 mb-6">The requested product could not be found or has been removed.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-[#008ECC] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#007bb3] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Products
        </button>
      </div>
    );
  }

  const currentVariant = selectedVariant || product.variants[0];
  const discountPercentage = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  const relatedProducts = relatedData?.data?.filter((p) => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
              <Check className="w-4 h-4" />
            </span>
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
          {onNavigateCart && (
            <button
              onClick={onNavigateCart}
              className="bg-[#008ECC] hover:bg-[#007bb3] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              View Cart
            </button>
          )}
        </div>
      )}

      {/* Breadcrumb Navigation Strip */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 flex-wrap">
        <button onClick={onBack} className="hover:text-[#008ECC] flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Products
        </button>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images}
            productName={product.name}
            discountPercentage={discountPercentage}
          />
        </div>

        {/* Right Column: Product Specs, Variants & Buying Options */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Category & Action Buttons */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#008ECC] bg-[#008ECC]/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'border-slate-200 text-slate-500 hover:text-rose-500 hover:border-rose-200'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  onClick={() => alert('Product link copied to clipboard!')}
                  className="p-2 rounded-full border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Review Summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">4.8 (124 reviews)</span>
              <span className="text-slate-300">|</span>
              <StockIndicator stock={currentVariant.stock} inStock={currentVariant.inStock} />
            </div>

            {/* Dynamic Price Breakdown */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{currentVariant.price.toLocaleString('en-IN')}
              </span>
              {currentVariant.originalPrice && currentVariant.originalPrice > currentVariant.price && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    ₹{currentVariant.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    Save ₹{(currentVariant.originalPrice - currentVariant.price).toLocaleString('en-IN')} ({discountPercentage}%)
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variant Selector (Size x Color) */}
            <div className="mb-6 pb-6 border-b border-slate-100">
              <VariantSelector
                variants={product.variants}
                selectedVariant={currentVariant}
                onSelectVariant={(v) => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
              />
            </div>

            {/* Quantity Selector & Add to Cart Controls */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || !currentVariant.inStock}
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= currentVariant.stock || !currentVariant.inStock}
                    className="p-2.5 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Primary Button */}
              <button
                onClick={handleAddToCart}
                disabled={!currentVariant.inStock || currentVariant.stock <= 0}
                className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 text-base shadow-sm transition-all ${
                  currentVariant.inStock && currentVariant.stock > 0
                    ? 'bg-[#008ECC] text-white hover:bg-[#007bb3] active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {currentVariant.inStock && currentVariant.stock > 0
                  ? 'Add to Cart'
                  : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50">
              <Truck className="w-5 h-5 text-[#008ECC]" />
              <span className="text-[11px] font-semibold text-slate-700">Free Express Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50">
              <RotateCcw className="w-5 h-5 text-[#008ECC]" />
              <span className="text-[11px] font-semibold text-slate-700">7 Days Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50">
              <ShieldCheck className="w-5 h-5 text-[#008ECC]" />
              <span className="text-[11px] font-semibold text-slate-700">1 Year Brand Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Shipping */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8">
        <div className="flex border-b border-slate-200 gap-8 mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[#008ECC] text-[#008ECC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[#008ECC] text-[#008ECC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'shipping'
                ? 'border-[#008ECC] text-[#008ECC]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Shipping & Returns
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
            <p>{product.description}</p>
            <p>
              Designed for maximum comfort and durability, this product meets all quality benchmarks. Made with premium materials to ensure long-lasting performance and aesthetic appeal.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Brand</span>
              <span className="font-semibold text-slate-900">MegaMart Exclusive</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold text-slate-900">{product.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">SKU</span>
              <span className="font-semibold text-slate-900">{currentVariant.sku}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Available Sizes</span>
              <span className="font-semibold text-slate-900">
                {product.variants.map((v) => v.size).join(', ')}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="text-sm text-slate-600 space-y-3">
            <p className="font-medium text-slate-800">Fast & Secure Delivery Options</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Standard Shipping: Delivered within 3-5 business days across India.</li>
              <li>Express Shipping: Next-day delivery available in metro cities.</li>
              <li>Hassle-free 7-day returns with 100% money-back guarantee.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Similar Products You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onSelect={(p) => {
                  if (onSelectProduct) onSelectProduct(p);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
