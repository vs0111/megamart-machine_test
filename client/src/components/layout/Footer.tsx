import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#008ECC] text-white overflow-hidden pt-12 pb-6 px-4 md:px-8 mt-16">
      {/* Background SVG with main filled circle and ONLY ONE outer stroke circle matching Figma */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[480px] h-[480px] md:w-[600px] md:h-[600px] pointer-events-none z-0"
        viewBox="0 0 600 600"
        fill="none"
      >
        {/* Main Inner Filled Disk */}
        <circle cx="300" cy="300" r="235" fill="white" fillOpacity="0.12" />
        
        {/* ONLY ONE Outer Concentric Circle Stroke Line */}
        <circle cx="300" cy="300" r="275" stroke="white" strokeOpacity="0.25" strokeWidth="2.5" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-white/20">
          
          {/* COLUMN 1: Brand & Contact & App Download */}
          <div className="md:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
                MegaMart
              </h2>

              <h3 className="text-base font-bold text-white mb-4">
                Contact Us
              </h3>

              {/* WhatsApp Item */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-normal">Whats App</div>
                  <div className="text-sm font-semibold text-white">+1 202-918-2132</div>
                </div>
              </div>

              {/* Call Us Item */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/80 font-normal">Call Us</div>
                  <div className="text-sm font-semibold text-white">+1 202-918-2132</div>
                </div>
              </div>
            </div>

            {/* App Store / Google Play Download Section */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">
                Download App
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {/* App Store Button */}
                <a
                  href="#app-store"
                  className="bg-black hover:bg-black/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.1-3.69-3.08-7.81-7.98-12.36-14.7-6.86-10.15-12.19-21.2-15.98-33.16-3.8-11.96-5.7-23.33-5.7-34.12 0-15.42 3.86-28.05 11.58-37.89 7.72-9.84 17.51-14.89 29.38-15.15 4.7 0 9.87 1.15 15.52 3.44 5.65 2.29 9.54 3.44 11.66 3.44 1.8 0 5.86-1.22 12.17-3.66 6.31-2.44 11.64-3.56 15.99-3.36 12.87.52 23.01 5.3 30.42 14.33-11.45 6.94-17.06 16.59-16.83 28.95.23 9.68 3.97 17.65 11.22 23.9 7.25 6.25 15.89 9.77 25.92 10.56-2.58 7.55-5.87 14.93-9.87 22.14zM119.22 31.07c0-7.39 2.65-14.47 7.95-21.24 5.3-6.77 12.01-10.84 20.13-12.21.67 7.52-1.89 14.76-7.68 21.72-5.79 6.96-12.56 10.95-20.4 11.73z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300 font-medium">Download on the</div>
                    <div className="text-xs font-bold leading-tight">App Store</div>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="#google-play"
                  className="bg-black hover:bg-black/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L18.81,13.97C19.6,13.5 19.6,12.5 18.81,12.03L16.81,10.88L14.81,12.88L16.81,15.12M4.6,1.41L14.28,11.09L16.28,9.09L5.3,2.78C4.94,2.57 4.74,2.07 4.6,1.41M4.6,22.59C4.74,21.93 4.94,21.43 5.3,21.22L16.28,14.91L14.28,12.91L4.6,22.59Z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-gray-300 font-medium">GET IT ON</div>
                    <div className="text-xs font-bold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Most Popular Categories */}
          <div className="md:col-span-4">
            <h3 className="text-base font-bold text-white relative pb-2 mb-4 border-b-2 border-white/80 w-fit pr-8">
              Most Popular Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-white/90 font-normal">
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Staples
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Beverages
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Personal Care
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Home Care
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Baby Care
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Vegetables & Fruits
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Snacks & Foods
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Dairy & Bakery
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Customer Services */}
          <div className="md:col-span-4">
            <h3 className="text-base font-bold text-white relative pb-2 mb-4 border-b-2 border-white/80 w-fit pr-8">
              Customer Services
            </h3>
            <ul className="space-y-2.5 text-sm text-white/90 font-normal">
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> About Us
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Terms & Conditions
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> FAQ
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Privacy Policy
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> E-waste Policy
              </li>
              <li className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-white/60">•</span> Cancellation & Return Policy
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT BOTTOM STRIP */}
        <div className="pt-6 text-center text-xs md:text-sm text-white/90 font-normal">
          © 2026 All rights reserved. Reliance Retail Ltd.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
