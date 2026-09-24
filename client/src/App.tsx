import React, { useState } from 'react';
import { Header } from './components/layout/Header';

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        cartCount={cartCount}
        onSearch={(query) => console.log('Search query:', query)}
        onCartClick={() => console.log('Cart clicked')}
        onAuthClick={() => console.log('Auth clicked')}
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Content will be mounted here */}
      </main>
    </div>
  );
}

export default App;
