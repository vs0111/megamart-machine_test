import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  LogOut
} from 'lucide-react';
import Swal from 'sweetalert2';
import { productService } from '../../services/productService';

interface HeaderProps {
  cartCount?: number;
  user?: { name: string; email: string } | null;
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onAuthClick?: () => void;
  onLogout?: () => void;
  activeCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  hideCategoryStrip?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  user = null,
  onSearch,
  onCartClick,
  onAuthClick,
  onLogout,
  activeCategory: externalActiveCategory,
  onSelectCategory,
  hideCategoryStrip = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [internalActiveCategory, setInternalActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of MegaMart?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#008ECC',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer',
        cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold cursor-pointer',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (onLogout) {
          onLogout();
        } else if (onAuthClick) {
          onAuthClick();
        }
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been signed out successfully.',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl',
          },
        });
      }
    });
  };

  useEffect(() => {
    let isMounted = true;
    productService.getCategories().then((cats) => {
      if (isMounted) {
        setCategories(cats.filter((c) => c !== 'All'));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalActiveCategory;

  const handleCategoryClick = (category: string) => {
    const nextCategory = activeCategory === category ? null : category;
    if (onSelectCategory) {
      onSelectCategory(nextCategory);
    } else {
      setInternalActiveCategory(nextCategory);
    }
  };

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
            {user ? (
              <div 
                className="relative py-1 group"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#008ECC] transition-colors cursor-pointer py-1"
                >
                  <div className="w-7 h-7 rounded-full bg-[#EAF6FC] text-[#008ECC] flex items-center justify-center font-extrabold text-xs border border-[#BCE3F5] shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate font-semibold">
                    {user.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-[#008ECC] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-[#008ECC]' : ''}`} />
                </button>

                {/* HOVER / CLICK POPUP MENU */}
                <div
                  className={`absolute right-0 top-full mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transition-all duration-200 z-50 ${
                    isUserMenuOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#008ECC] text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onAuthClick}
                className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#008ECC] transition-colors cursor-pointer py-1"
              >
                <User className="w-5 h-5 text-[#008ECC]" />
                <span className="hidden sm:inline">Sign Up/Sign In</span>
              </button>
            )}

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

      {/* 3. CATEGORY NAVIGATION PILLS STRIP */}
      {!hideCategoryStrip && (
        <div className="bg-white border-b border-gray-100 hidden md:block py-2.5">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <nav className="flex items-center gap-2.5 overflow-x-auto scrollbar-none text-xs font-medium">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs ${
                      isActive 
                        ? 'bg-[#008ECC] text-white font-semibold shadow-xs' 
                        : 'bg-[#F3F9FB] text-gray-700 hover:bg-[#EAF6FC] hover:text-[#008ECC]'
                    }`}
                  >
                    <span>{category}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white rotate-180' : 'text-[#008ECC]'
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            Categories
          </div>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  handleCategoryClick(cat);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-medium flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-[#008ECC] text-white'
                    : 'text-gray-700 hover:bg-[#F3F9FB] hover:text-[#008ECC]'
                }`}
              >
                <span>{cat}</span>
                <ChevronDown className={`w-4 h-4 ${activeCategory === cat ? 'text-white' : 'text-gray-400'}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
