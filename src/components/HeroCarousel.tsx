'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroCarouselProps {
  banners: any[];
  mainHeading?: string;
  subHeading?: string;
}

export default function HeroCarousel({ banners, mainHeading, subHeading }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Fallback slides if none provided
  const slides = banners?.length > 0 ? banners : [
    {
      image: { url: '/hero-bg.png' },
      title: 'Global Community',
    },
    {
      image: { url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=2000' },
      title: 'Technical Excellence',
    }
  ];

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[80vh] md:h-[85vh] overflow-hidden">
      {/* Full Width Carousel */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.image?.url && (
            <Image
              src={slide.image.url}
              alt={slide.title || 'Hero Image'}
              fill
              className="object-cover"
              priority={index === 0}
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 container mx-auto px-4 flex items-center">
            <div className="max-w-3xl space-y-6 md:space-y-8 animate-fade-in-up">
              <span className="inline-block py-1.5 px-3 md:py-2 md:px-4 rounded-full bg-white/10 backdrop-blur-md text-[#F37C28] text-[10px] md:text-sm font-bold tracking-widest uppercase border border-white/20">
                Official Website
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white tracking-tight">
                {mainHeading || (
                  <>
                    State-of-the-Art <br />
                    <span className="text-white/80">Innovation</span>
                  </>
                )}
              </h1>
              
              <p className="text-gray-300 text-sm md:text-md lg:text-lg max-w-xl leading-relaxed font-light">
                {subHeading || "Connect, grow, and lead with the global community of IEEE Young Professionals in Sri Lanka."}
              </p>

              <div className="flex flex-col md:flex-row gap-4 pt-4 pb-8">
                 <Link href="/events" className="px-6 py-4 md:px-8 md:py-5 bg-[#F37C28] text-white font-bold text-xs md:text-sm tracking-widest rounded-full hover:bg-[#d66a1e] transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 md:gap-3 group whitespace-nowrap w-fit">
                    Explore Events
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                 </Link>
                 <Link href="/overview" className="px-6 py-4 md:px-8 md:py-5 border border-white/30 bg-white/5 backdrop-blur-sm text-white font-bold text-xs md:text-sm tracking-widest rounded-full hover:bg-white hover:text-black transition-all whitespace-nowrap text-center flex items-center justify-center w-fit">
                    Discover More
                 </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation & Progress */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 container mx-auto px-4 flex justify-between items-center sm:items-end border-t border-white/10 pt-4 md:pt-8 bg-gradient-to-t from-black/40 to-transparent sm:bg-none">
         {/* Counter */}
         <div className="text-white font-mono text-sm md:text-lg tracking-widest">
            <span className="text-2xl md:text-3xl font-bold">{String(current + 1).padStart(2, '0')}</span>
            <span className="text-white/40"> / {String(slides.length).padStart(2, '0')}</span>
         </div>

         {/* Navigation Buttons */}
         <div className="flex gap-2 min-h-[48px] items-center">
            <button 
                onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-[#F37C28] hover:border-[#F37C28] hover:text-white transition-all text-white group"
            >
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
                onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-[#F37C28] hover:border-[#F37C28] hover:text-white transition-all text-white group"
            >
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
         </div>
      </div>
    </section>
  );
}
