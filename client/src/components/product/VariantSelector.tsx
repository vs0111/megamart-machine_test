import React from 'react';
import type { ProductVariant } from '../../types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

// Comprehensive color name to hex mapper with smart fallbacks
const COLOR_NAME_MAP: Record<string, string> = {
  black: '#111827',
  'space black': '#1F2937',
  'titanium black': '#1C1C1E',
  'natural titanium': '#8E8E93',
  white: '#F9FAFB',
  starlight: '#F5F5F0',
  silver: '#E5E7EB',
  navy: '#1E3A8A',
  'midnight navy': '#0F172A',
  blue: '#2563EB',
  'sierra blue': '#60A5FA',
  olive: '#3F6212',
  green: '#16A34A',
  beige: '#F5F5DC',
  grey: '#64748B',
  gray: '#64748B',
  'space grey': '#4B5563',
  'space gray': '#4B5563',
  red: '#DC2626',
  yellow: '#EAB308',
  gold: '#D97706',
  rose: '#FB7185',
  pink: '#EC4899',
  purple: '#9333EA',
  brown: '#78350F',
  maroon: '#881337',
  'stainless steel': '#D1D5DB',
  'matte black': '#0F172A',
  original: '#008ECC',
  natural: '#10B981',
  fresh: '#0EA5E9',
  premium: '#8B5CF6',
};

const getColorHex = (colorName: string): string => {
  if (!colorName) return '#94A3B8';
  const norm = colorName.trim().toLowerCase();
  if (COLOR_NAME_MAP[norm]) return COLOR_NAME_MAP[norm];

  for (const [key, hex] of Object.entries(COLOR_NAME_MAP)) {
    if (norm.includes(key)) return hex;
  }

  // Consistent deterministic color generator for custom names
  let hash = 0;
  for (let i = 0; i < colorName.length; i++) {
    hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Helper to derive human-friendly section labels based on size string
const getSizeSectionLabel = (sizes: string[]): string => {
  const sample = sizes.join(' ').toLowerCase();
  if (sample.includes('gb') || sample.includes('tb') || sample.includes('ram') || sample.includes('ssd')) {
    return 'Storage / Capacity';
  }
  if (sample.includes('kg') || sample.includes('g') || sample.includes('ml') || sample.includes('litre') || sample.includes('pack')) {
    return 'Net Weight / Pack Size';
  }
  if (sample.includes('uk')) {
    return 'Shoe Size (UK)';
  }
  if (sample.includes('mm') || sample.includes('inch')) {
    return 'Display / Dial Size';
  }
  return 'Size / Option';
};

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  // Extract unique sizes and colors available across product variants
  const availableSizes = Array.from(new Set(variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(variants.map((v) => v.color)));

  const sizeLabel = getSizeSectionLabel(availableSizes);

  const handleSizeSelect = (size: string) => {
    const match =
      variants.find((v) => v.size === size && v.color === selectedVariant.color) ||
      variants.find((v) => v.size === size);

    if (match) {
      onSelectVariant(match);
    }
  };

  const handleColorSelect = (color: string) => {
    const match =
      variants.find((v) => v.color === color && v.size === selectedVariant.size) ||
      variants.find((v) => v.color === color);

    if (match) {
      onSelectVariant(match);
    }
  };

  return (
    <div className="space-y-6">
      {/* Color / Style Selection */}
      {availableColors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Color / Finish: <span className="text-slate-900 font-extrabold normal-case tracking-normal">{selectedVariant.color}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {availableColors.map((color) => {
              const isSelected = selectedVariant.color === color;
              const isAnyInStock = variants.some((v) => v.color === color && v.inStock && v.stock > 0);
              const hexColor = getColorHex(color);

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-semibold ${
                    isSelected
                      ? 'border-[#008ECC] bg-[#EAF6FC] text-[#008ECC] ring-2 ring-[#008ECC]/20 shadow-xs'
                      : isAnyInStock
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-[#008ECC] hover:bg-slate-50'
                      : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                  title={`${color}${!isAnyInStock ? ' (Out of Stock)' : ''}`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 shadow-xs block shrink-0"
                    style={{ backgroundColor: hexColor }}
                  />
                  <span>{color}</span>
                  {!isAnyInStock && (
                    <span className="text-rose-500 font-bold text-[10px] ml-0.5">(Out of Stock)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size / Spec / Weight Selection */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {sizeLabel}: <span className="text-slate-900 font-extrabold normal-case tracking-normal">{selectedVariant.size}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {availableSizes.map((size) => {
              const isSelected = selectedVariant.size === size;
              const variantForCombo = variants.find(
                (v) => v.size === size && v.color === selectedVariant.color
              );
              const isAvailable = variantForCombo && variantForCombo.inStock && variantForCombo.stock > 0;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#008ECC] text-white border-[#008ECC] shadow-md'
                      : isAvailable
                      ? 'bg-white text-slate-800 border-slate-200 hover:border-[#008ECC] hover:text-[#008ECC] hover:bg-[#F3F9FB]'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-70'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Price & SKU Summary */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>
          SKU: <span className="font-mono font-semibold text-slate-700">{selectedVariant.sku}</span>
        </div>
        <div>
          Unit Price: <span className="font-bold text-slate-900">₹{selectedVariant.price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};

export default VariantSelector;
