import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/home/HeroBanner';

function App() {
  const [cartCount, setCartCount] = useState(2);
  const [activeCategory, setActiveCategory] = useState<string | null>('Groceries');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header
        cartCount={cartCount}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onSearch={(query) => console.log('Search query:', query)}
        onCartClick={() => alert('Cart clicked')}
        onAuthClick={() => alert('Auth clicked')}
      />

      <main className="flex-1">
        <HeroBanner />
      </main>
    </div>
  );
}

export default App;
