import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/home/HeroBanner';
import { DealsSection } from './components/home/DealsSection';
import { TopCategoriesSection } from './components/home/TopCategoriesSection';
import { BrandDealsSection } from './components/home/BrandDealsSection';
import { DailyEssentialsSection } from './components/home/DailyEssentialsSection';

function App() {
  const [cartCount, setCartCount] = useState(2);
  const [activeCategory, setActiveCategory] = useState<string | null>('Groceries');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Header
        cartCount={cartCount}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onSearch={(query) => console.log('Search query:', query)}
        onCartClick={() => alert('Cart clicked')}
        onAuthClick={() => alert('Auth clicked')}
      />

      <main className="flex-1 pb-16">
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
    </div>
  );
}

export default App;
