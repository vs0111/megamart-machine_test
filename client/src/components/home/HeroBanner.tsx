import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import smartwatchImg from '../../assets/smartwatch.jpg';

interface BannerSlide {
  id: number;
  subtitle: string;
  title: string;
  offer: string;
  bgGradient: string;
  image: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    subtitle: 'Best Deal Online on smart watches',
    title: 'SMART WEARABLE.',
    offer: 'UP to 80% OFF',
    bgGradient: 'from-[#1B233A] to-[#263152]',
    image: smartwatchImg,
  },
  {
    id: 2,
    subtitle: 'Fresh Organic Produce',
    title: 'GROCERIES & ESSENTIALS.',
    offer: 'FLAT 30% OFF',
    bgGradient: 'from-[#123832] to-[#1C4D45]',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    subtitle: 'Latest Flagship Smartphones',
    title: 'MOBILE PHONES.',
    offer: 'UP to 50% OFF',
    bgGradient: 'from-[#152B46] to-[#1E3A5F]',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
  };

  const activeBanner = BANNERS[currentSlide];

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-8 my-6">
      {/* Left Navigation Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-[#008ECC] shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100/80 focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white text-[#008ECC] shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-slate-100/80 focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Main Banner Card */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${activeBanner.bgGradient} text-white shadow-xl min-h-[280px] sm:min-h-[320px] md:min-h-[360px] flex items-center px-6 sm:px-12 md:px-16 py-8 transition-all duration-500`}>
        
        {/* Subtle background decorative element */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/4 -translate-y-1/4" />

        <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center gap-6 z-10">
          
          {/* Left Content */}
          <div className="md:col-span-7 flex flex-col justify-center overflow-hidden">
            <span className="text-slate-300 text-sm sm:text-base md:text-lg font-normal mb-1 tracking-wide">
              {activeBanner.subtitle}
            </span>
            
            {/* Title strictly on ONE single line */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {activeBanner.title}
            </h2>

            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 tracking-wide">
              {activeBanner.offer}
            </div>

            {/* Pagination Indicators matching Figma */}
            <div className="flex items-center gap-2 mt-2">
              {BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    currentSlide === idx
                      ? 'w-7 h-2.5 bg-white'
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Container with rounded-2xl overflow-hidden */}
          <div className="md:col-span-5 flex justify-center md:justify-end relative">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-white/5">
              <img
                src={activeBanner.image}
                alt={activeBanner.title}
                className="w-full h-full object-cover filter drop-shadow-xl hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
