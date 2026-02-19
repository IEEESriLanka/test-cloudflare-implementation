'use client';

import React from 'react';
import Image from 'next/image';

interface Award {
  id: string | number;
  awardName: string;
  awardCategory?: string | null;
  awardImage?: { url: string } | null;
  year?: string | null;
  winnerName: string;
}

interface AwardSliderProps {
  awards: Award[];
}

// Award Badge SVG Component (Fallback)
const AwardBadgeFallback = ({ title, category }: { title: string; category?: string | null }) => (
  <div className="relative w-48 h-48 flex items-center justify-center">
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-[#002855] drop-shadow-xl" fill="currentColor">
        <path d="M100 0 L112 25 L138 15 L140 42 L165 45 L155 70 L178 85 L160 105 L178 125 L155 140 L165 165 L140 168 L138 195 L112 185 L100 210 L88 185 L62 195 L60 168 L35 165 L45 140 L22 125 L40 105 L22 85 L45 70 L35 45 L60 42 L62 15 L88 25 Z" fill="#002855" stroke="#F37C28" strokeWidth="4"/>
        <circle cx="100" cy="105" r="70" fill="none" stroke="#F37C28" strokeWidth="3" strokeDasharray="5,3" />
        <path d="M50 140 Q 30 100 50 60" fill="none" stroke="#F37C28" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 140 Q 170 100 150 60" fill="none" stroke="#F37C28" strokeWidth="3" strokeLinecap="round" />
    </svg>
    
    <div className="relative z-10 text-center px-6 pt-4 space-y-2">
      <div className="text-[#F37C28] font-black text-xs uppercase tracking-widest leading-tight">
        {title}
      </div>
      {category && (
        <div className="text-white/80 font-medium text-[10px] uppercase tracking-wide">
          ({category})
        </div>
      )}
      <div className="flex justify-center gap-1 mt-2">
         {[1,2,3,4,5].map(i => (
             <svg key={i} className="w-2 h-2 text-[#F37C28]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
         ))}
      </div>
    </div>
  </div>
);

export default function AwardSlider({ awards }: AwardSliderProps) {
  const [itemsPerView, setItemsPerView] = React.useState(4);
  
  // We need to determine if we should loop. 
  // User wanted no duplication for a single card.
  const shouldLoop = awards.length > 1;

  // We add clones to the start and end to allow seamless transition
  // Only if looping is enabled
  const clonesCount = shouldLoop ? itemsPerView : 0;
  
  // Prepare the extended list
  const extendedAwards = React.useMemo(() => {
    if (!shouldLoop) return awards;
    // Prepend last 'itemsPerView' items, Append first 'itemsPerView' items
    // This supports scrolling in both directions seamlessly
    // If awards.length < itemsPerView, we might need to repeat the array multiple times to fill clones
    // But simplest valid approach:
    const startClones = awards.slice(-itemsPerView);
    // If fewer items than itemsPerView, we need more clones to fill the space? 
    // Usually safe to just clone the available items if they are fewer, but standard approach:
    while (startClones.length < itemsPerView) {
        startClones.unshift(...awards);
    }
    const endClones = awards.slice(0, itemsPerView);
    while (endClones.length < itemsPerView) {
        endClones.push(...awards);
    }
    
    // Take exactly itemsPerView length from generated arrays to be safe, 
    // consistent with loop logic
    return [
        ...startClones.slice(-itemsPerView), 
        ...awards, 
        ...endClones.slice(0, itemsPerView)
    ];
  }, [awards, shouldLoop, itemsPerView]);

  // Current active index refers to the index in 'extendedAwards'
  // Initial position is 'itemsPerView' (which is the start of the real items)
  const [activeIndex, setActiveIndex] = React.useState(clonesCount);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Responsive items per view
  React.useEffect(() => {
    const handleResize = () => {
      let newItemsPerView = 4;
      if (window.innerWidth < 640) newItemsPerView = 1;
      else if (window.innerWidth < 1024) newItemsPerView = 2;
      
      setItemsPerView(newItemsPerView);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to start of real items when itemsPerView or awards change
  React.useEffect(() => {
    if (shouldLoop) {
        setActiveIndex(itemsPerView);
    } else {
        setActiveIndex(0);
    }
    setIsTransitioning(false);
  }, [itemsPerView, awards, shouldLoop]);

  // Handle circular navigation reset
  const handleTransitionEnd = () => {
    setIsTransitioning(false);

    if (!shouldLoop) return;

    // The real items are from index [clonesCount] to [clonesCount + awards.length - 1]
    const realCount = awards.length;
    
    // If we scrolled past the last real item into the end clones
    if (activeIndex >= clonesCount + realCount) {
        // Jump back to the first real item
        // The corresponding real item is at (activeIndex - realCount)
        setActiveIndex(activeIndex - realCount);
    } 
    // If we scrolled before the first real item into the start clones
    else if (activeIndex < clonesCount) {
        // Jump forward to the last real item set
        setActiveIndex(activeIndex + realCount);
    }
  };

  const goToNext = () => {
    if (!shouldLoop) return;
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (!shouldLoop) return;
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveIndex((prev) => prev - 1);
  };

  // Auto-play
  React.useEffect(() => {
    if (!shouldLoop) return;

    const interval = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldLoop, isTransitioning, activeIndex]); // Depend on state to avoid closure staleness issues if any, though next state update handles it

  return (
    <section className="bg-[#111111] overflow-hidden py-16 md:py-24 text-white">
      <div className="container mb-12 md:mb-16 text-center space-y-4">
         <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-sm">Our Excellence</h4>
         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">Awards & Major Achievements</h2>
         <p className="text-sm md:text-md text-gray-400 max-w-2xl mx-auto px-4 sm:px-0">
            Awards speak about us more than us.
         </p>
      </div>

      <div className="container relative overflow-hidden px-4 sm:px-6">
        {/* Navigation Arrows */}
        {shouldLoop && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-[#F37C28] hover:bg-[#d66a1f] text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Previous award"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-[#F37C28] hover:bg-[#d66a1f] text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Next award"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Carousel Track */}
        <div 
            className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{ transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)` }}
            onTransitionEnd={handleTransitionEnd}
        >
          {extendedAwards.map((award, index) => {
            return (
              <div 
                key={`${award.id}-${index}`} 
                className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-2 sm:px-4`}
              >
                  <div className="relative h-full p-6 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 group rounded-[2.5rem] border border-[#F37C28] bg-[#1a1a1a]">
                    {/* Trophy/Badge Image */}
                    <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden rounded-2xl">
                        {award.awardImage && typeof award.awardImage !== 'string' && award.awardImage.url ? (
                            <Image 
                                src={award.awardImage.url} 
                                alt={award.awardName} 
                                fill 
                                className="object-cover drop-shadow-2xl transition-all duration-500"
                            />
                        ) : (
                            // Fallback Trophy Icon
                            <div className="w-full h-full flex items-center justify-center text-[#F37C28]">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 001 3.72V17a2 2 0 001.8 1.95l2.12.32A9.95 9.95 0 0012 21a9.95 9.95 0 004.08-1.73l2.12-.32A2 2 0 0020 17v-6.28A2 2 0 0021 7V5a2 2 0 00-2-2H5zm14 4h-2v4h2V7zm-8 12a8 8 0 01-3.29-.98l-1.71-.26V7h10v10.76l-1.71.26A8 8 0 0111 19zM5 7v4h2V7H5z"/></svg>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                    <div className="h-20 flex items-center justify-center w-full">
                        <h3 className="text-xl font-bold leading-tight text-white mb-0">
                            {award.awardName}
                        </h3>
                    </div>

                    <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                {award.year || '202X'}
                            </div>
                            <div className="text-sm text-[#F37C28] font-medium">
                                {award.winnerName}
                            </div>
                        </div>

                        {/* Optional Category Label */}
                        <p className="text-xs text-gray-400 italic mt-2 pt-2 border-t border-gray-700 w-full">
                            {award.awardCategory || "Achievement"}
                        </p>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
