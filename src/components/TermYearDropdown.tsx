'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface TermYearDropdownProps {
  currentYear: string;
  availableYears: string[];
  basePath: string; // e.g. 'executive-committees' or 'standing-committees'
}

export default function TermYearDropdown({ currentYear, availableYears, basePath }: TermYearDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[140px] md:min-w-[200px] flex-shrink-0 z-20 order-3 md:order-2 self-start md:self-auto" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 md:px-6 md:py-3 bg-white border-2 rounded-xl font-bold text-[#002855] transition-all shadow-sm text-sm md:text-base ${isOpen ? 'border-[#F37C28] ring-4 ring-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
      >
        <span>Term {currentYear}</span>
        <svg 
          className={`w-4 h-4 md:w-5 md:h-5 ml-2 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F37C28]' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 md:right-0 left-0 md:left-auto top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
          {availableYears.map((y) => (
            <Link 
              key={y} 
              href={`/${basePath}/${y}`}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 md:px-6 md:py-3 text-sm font-semibold hover:bg-gray-50 transition-colors ${y === currentYear ? 'text-[#F37C28] bg-orange-50' : 'text-gray-700'}`}
            >
              Term {y}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
