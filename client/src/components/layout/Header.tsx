import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  ListFilter, 
  User, 
  ShoppingCart, 
  MapPin, 
  Truck, 
  BadgePercent,
  X,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  cartCount?: number;
  user?: { name: string; email: string } | null;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onAuthClick?: () => void;
}

const CATEGORIES = [
  'Groceries',
  'Premium Fruits',
  'Home Improvement',
  'Electronics',
  'Fashion & Apparel',
  'Beauty & Care',
  'Toys & Sports'
];

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  user = null,
  onSearch,
  onCartClick,
  onAuthClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-40">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#F3F9FB] border-b border-gray-100 text-xs text-gray-600 py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-normal text-gray-500">
            Welcome to worldwide Megamart!
          </span>

          <div className="flex items-center gap-3 md:gap-4 font-medium">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#008ECC] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#008ECC]" />
              <span>Deliver to <strong className="text-gray-900 font-semibold">423651</strong></span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#008ECC] transition-colors">
              <Truck className="w-3.5 h-3.5 text-[#008ECC]" />
              <span>Track your order</span>
            </div>

            <span className="text-gray-300">|</span>

            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#008ECC] transition-colors">
              <BadgePercent className="w-3.5 h-3.5 text-[#008ECC]" />
              <span>All Offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="border-b border-gray-100 py-3.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
          
          {/* LEFT: Menu button + Brand Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-[#EAF6FC] hover:bg-[#DDF0FA] text-[#008ECC] transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <a href="/" className="flex items-center gap-1 focus:outline-none">
              <span className="text-2xl md:text-3xl font-extrabold text-[#008ECC] tracking-tight">
                MegaMart
              </span>
            </a>
          </div>

          {/* CENTER: Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-2xl hidden md:block"
          >
            <div className="flex items-center bg-[#F3F9FB] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#008ECC] focus-within:bg-white transition-all shadow-xs">
              <Search className="w-4 h-4 text-[#008ECC] mr-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search essentials, groceries and more..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none font-normal"
              />
              <button 
                type="button" 
                className="p-1 hover:bg-gray-200/50 rounded-md transition-colors"
                title="Filter options"
              >
                <ListFilter className="w-4 h-4 text-[#008ECC] shrink-0" />
              </button>
            </div>
          </form>

          {/* RIGHT: User Auth + Cart */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={onAuthClick}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#008ECC] transition-colors cursor-pointer py-1"
            >
              <User className="w-5 h-5 text-[#008ECC]" />
              <span className="hidden sm:inline">
                {user ? user.name : 'Sign Up/Sign In'}
              </span>
            </button>

            <span className="h-5 w-[1px] bg-gray-200 hidden sm:block" />

            <button
              type="button"
              onClick={onCartClick}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#008ECC] transition-colors cursor-pointer relative py-1"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#008ECC]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#008ECC] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center bg-[#F3F9FB] rounded-xl px-3.5 py-2 border border-transparent focus-within:border-[#008ECC] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-[#008ECC] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search essentials, groceries and more..."
                className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none"
              />
              <ListFilter className="w-4 h-4 text-[#008ECC] shrink-0" />
            </div>
          </form>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION STRIP */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium text-gray-600">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(isActive ? null : category)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#EAF6FC] text-[#008ECC] font-semibold' 
                      : 'hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{category}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isActive ? 'rotate-180 text-[#008ECC]' : ''}`} />
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            Categories
          </div>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC] rounded-lg transition-colors font-medium flex items-center justify-between"
              >
                <span>{cat}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
