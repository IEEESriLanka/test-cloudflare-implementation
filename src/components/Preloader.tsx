'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Initial delay to show the animation
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade out animation to finish
      const removeTimer = setTimeout(() => {
        setLoading(false);
      }, 800);
      return () => clearTimeout(removeTimer);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8 animate-pulse-slow">
          <Image 
            src="/media/IEEE-YP-SL-Logo.png" 
            alt="IEEE YPSL Logo" 
            width={240} 
            height={90}
            className="w-48 md:w-64 h-auto object-contain"
            priority
          />
          
          {/* Subtle Glow Effect */}
          <div className="absolute inset-0 bg-[#F37C28]/5 blur-3xl -z-10 rounded-full animate-pulse" />
        </div>

        {/* Modern Loader Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#F37C28] rounded-full animate-loading-bar" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-fade-in-out">
            Initializing
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; }
        }
        @keyframes loading-bar {
          0% { width: 0%; left: 0; }
          50% { width: 40%; left: 30%; }
          100% { width: 0%; left: 100%; }
        }
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
