import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { DealsSection } from './components/home/DealsSection';
import { TopCategoriesSection } from './components/home/TopCategoriesSection';
import { BrandDealsSection } from './components/home/BrandDealsSection';
import { DailyEssentialsSection } from './components/home/DailyEssentialsSection';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { useAuthStore } from './store/authStore';

type ViewState = 'home' | 'login' | 'register';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [cartCount, setCartCount] = useState(2);
  const [activeCategory, setActiveCategory] = useState<string | null>('Groceries');

  const { user, isAuthenticated, logout } = useAuthStore();

  const handleAuthHeaderClick = () => {
    if (isAuthenticated) {
      if (confirm(`Logged in as ${user?.name}. Do you want to sign out?`)) {
        logout();
        setCurrentView('home');
      }
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <Header
        cartCount={cartCount}
        user={user}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setCurrentView('home');
        }}
        onSearch={(query) => console.log('Search query:', query)}
        onCartClick={() => alert('Cart clicked')}
        onAuthClick={handleAuthHeaderClick}
      />

      {currentView === 'home' && (
        <main className="flex-1 pb-12 animate-in fade-in-50">
          <HeroBanner />
          <DealsSection
            onProductClick={(p) => alert(`Selected Product: ${p.name}`)}
            onViewAll={() => alert('View all smartphones')}
          />
          <TopCategoriesSection
            onCategorySelect={(cat) => alert(`Selected Category: ${cat}`)}
            onViewAll={() => alert('View all categories')}
          />
          <BrandDealsSection
            onBrandClick={(brand) => alert(`Selected Brand: ${brand}`)}
            onViewAll={() => alert('View all brands')}
          />
          <DailyEssentialsSection
            onItemSelect={(item) => alert(`Selected Essential: ${item}`)}
            onViewAll={() => alert('View all essentials')}
          />
        </main>
      )}

      {currentView === 'login' && (
        <main className="flex-1 animate-in fade-in-50">
          <LoginPage
            onNavigateRegister={() => setCurrentView('register')}
            onSuccess={() => setCurrentView('home')}
          />
        </main>
      )}

      {currentView === 'register' && (
        <main className="flex-1 animate-in fade-in-50">
          <RegisterPage
            onNavigateLogin={() => setCurrentView('login')}
            onSuccess={() => setCurrentView('home')}
          />
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;
