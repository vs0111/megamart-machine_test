import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { DealsSection } from './components/home/DealsSection';
import { TopCategoriesSection } from './components/home/TopCategoriesSection';
import { BrandDealsSection } from './components/home/BrandDealsSection';
import { DailyEssentialsSection } from './components/home/DailyEssentialsSection';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { ProductsPage } from './pages/Products/ProductsPage';
import { ProductDetailPage } from './pages/Products/ProductDetailPage';
import { CartPage } from './pages/Cart/CartPage';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import type { Product } from './types/product';

type ViewState = 'home' | 'products' | 'product-detail' | 'cart' | 'login' | 'register';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('galaxy-s22-ultra');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavigateProductDetail = (productOrSlug: Product | string) => {
    const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug.slug;
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string | null) => {
    setActiveCategory(categoryName);
    if (categoryName) {
      setSearchParams({ category: categoryName, page: '1' });
    } else {
      setSearchParams({ page: '1' });
    }
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchParams({ q: query, page: '1' });
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      Swal.fire({
        title: 'Sign Out?',
        text: `Logged in as ${user?.name || user?.email}. Do you want to sign out?`,
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
          handleLogout();
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
    } else {
      setCurrentView('login');
    }
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Only logged-in users can access the shopping cart.',
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
        if (result.isConfirmed) {
          setCurrentView('login');
        }
      });
    } else {
      setCurrentView('cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex flex-col justify-between font-sans">
      <Header
        cartCount={cartCount}
        user={user}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        onSearch={handleSearch}
        onCartClick={handleCartClick}
        onAuthClick={handleAuthClick}
        onLogout={handleLogout}
        hideCategoryStrip={currentView === 'products'}
      />

      <main className="flex-1 pb-12 animate-in fade-in-50">
        {currentView === 'home' && (
          <>
            <HeroBanner onProductClick={handleNavigateProductDetail} />
            <DealsSection
              onProductClick={handleNavigateProductDetail}
              onViewAll={() => {
                setSearchParams({});
                setCurrentView('products');
              }}
            />
            <TopCategoriesSection
              onCategorySelect={handleCategorySelect}
              onViewAll={() => {
                setSearchParams({});
                setCurrentView('products');
              }}
            />
            <BrandDealsSection
              onBrandClick={(productOrBrand) => {
                if (typeof productOrBrand === 'string') {
                  setSearchParams({ q: productOrBrand });
                  setCurrentView('products');
                } else {
                  handleNavigateProductDetail(productOrBrand);
                }
              }}
              onViewAll={() => {
                setSearchParams({});
                setCurrentView('products');
              }}
            />
            <DailyEssentialsSection
              onItemSelect={(item) => {
                setSearchParams({ category: 'Groceries', q: item });
                setCurrentView('products');
              }}
              onViewAll={() => {
                setSearchParams({ category: 'Groceries' });
                setCurrentView('products');
              }}
            />
          </>
        )}

        {currentView === 'products' && (
          <ProductsPage
            onSelectProduct={handleNavigateProductDetail}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            slug={selectedProductSlug}
            onBack={() => setCurrentView('products')}
            onSelectProduct={handleNavigateProductDetail}
            onNavigateCart={handleCartClick}
            onNavigateLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'cart' && (
          !isAuthenticated ? (
            <LoginPage
              onNavigateRegister={() => setCurrentView('register')}
              onSuccess={() => setCurrentView('cart')}
            />
          ) : (
            <CartPage
              onNavigateHome={() => setCurrentView('home')}
              onNavigateProducts={() => setCurrentView('products')}
            />
          )
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigateRegister={() => setCurrentView('register')}
            onSuccess={() => setCurrentView('home')}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onNavigateLogin={() => setCurrentView('login')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
