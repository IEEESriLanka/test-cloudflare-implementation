'use client';

import React, { useRef, useEffect } from 'react';
import { Search01Icon, Cancel01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

interface NavSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const QUICK_LINKS = ['Impact 2024', 'AI Summit', 'INSL', 'IEEE Education Week'];

export default function NavSearch({ isOpen, onClose, searchQuery, setSearchQuery }: NavSearchProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  const handleQuickLink = (tag: string) => {
    setSearchQuery(tag);
    router.push(`/search?q=${encodeURIComponent(tag)}`);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="container h-full flex flex-col justify-start pt-32">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-black text-gray-900">What are you looking for?</h2>
          <button 
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-[#F37C28] hover:bg-gray-50 rounded-full transition-all"
          >
            <Cancel01Icon size={32} />
          </button>
        </div>
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search articles, events, or committees..."
              className="w-full bg-transparent border-b-4 border-gray-100 py-6 text-3xl font-bold placeholder:text-gray-200 focus:outline-none focus:border-[#F37C28] transition-all"
            />
            <button 
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-[#F37C28] opacity-0 group-focus-within:opacity-100 transition-opacity"
            >
              <Search01Icon size={40} />
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mr-4 self-center">Quick links:</span>
            {QUICK_LINKS.map(tag => (
              <button 
                key={tag}
                type="button"
                onClick={() => handleQuickLink(tag)}
                className="px-4 py-2 bg-gray-50 hover:bg-[#F37C28] hover:text-white rounded-full text-sm font-bold text-gray-600 transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
