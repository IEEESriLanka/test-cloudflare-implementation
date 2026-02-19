'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search01Icon, Cancel01Icon, ArrowDown01Icon, Menu01Icon, ShoppingBag01Icon } from 'hugeicons-react';

const TOP_LINKS = [
  { label: 'IEEE', href: 'https://www.ieee.org/' },
  { label: 'IEEE XPLORE DIGITAL LIBRARY', href: 'https://ieeexplore.ieee.org/' },
  { label: 'IEEE STANDARDS', href: 'https://standards.ieee.org/' },
  { label: 'IEEE SPECTRUM', href: 'https://spectrum.ieee.org/' },
  { label: 'MORE SITES', href: 'https://www.ieee.org/sitemap.html' },
];

const PROJECTS = [
  { label: 'AI-Driven Sri Lanka', href: 'https://aidriven.ieeeyp.lk/' },
  { label: 'INSL', href: 'https://insl.ieeeyp.lk/' },
  { label: 'LETs Talk', href: 'https://letstalk.ieeeyp.lk/' },
  { label: 'SLInspire', href: 'https://slinspire.lk/' },
  { label: 'StudPro', href: 'https://studpro.ieeeyp.lk/' },
  { label: 'Y2NPro', href: 'https://y2npro.ieeeyp.lk/' },
];

interface NavbarProps {
  executiveYears?: string[];
  standingYears?: string[];
}



import NavSearch from './navbar/NavSearch';
import NavMobile from './navbar/NavMobile';

export default function Navbar({ executiveYears = [], standingYears = [] }: NavbarProps) {
  const filteredStandingYears = standingYears.filter(year => parseInt(year) >= 2024);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-100 bg-[#fcfcfc] hidden md:block">
        <div className="container py-2 flex justify-start gap-8">
          {TOP_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="top-nav-link text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#F37C28] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="container bg-white py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/media/IEEE-YP-SL-Logo.png" 
            alt="IEEE Young Professionals Sri Lanka" 
            width={200} 
            height={70}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className={`nav-link font-bold transition-colors ${isActive('/') ? 'text-[#F37C28]' : 'text-gray-700 hover:text-[#F37C28]'}`}>Home</Link>
          
          {/* About Us Dropdown */}
          <div className="relative group py-2">
            <button className={`nav-link flex items-center gap-1 font-bold transition-colors ${isActive('/overview') || isActive('/executive-committees') || isActive('/standing-committees') || isActive('/event-funding') || isActive('/reports') ? 'text-[#F37C28]' : 'text-gray-700 group-hover:text-[#F37C28]'}`}>
              About Us
              <ArrowDown01Icon size={16} className="transition-transform group-hover:rotate-180" />
            </button>
            
            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-gray-100 min-w-[260px] rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <Link href="/overview" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 transition-all text-sm font-bold ${isActive('/overview') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>
                Overview
              </Link>

              <div className="relative group/sub">
                <button className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-l-4 text-sm font-bold transition-all ${isActive('/executive-committees') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>
                  Executive Committees
                  <ArrowDown01Icon size={16} className="-rotate-90 transform text-gray-400" />
                </button>
                <div className="absolute top-0 left-full hidden group-hover/sub:block bg-white shadow-xl border border-gray-100 min-w-[180px] rounded-2xl -ml-1 p-2 animate-in fade-in slide-in-from-left-2 duration-200 z-50">
                   {executiveYears.length > 0 ? (
                     executiveYears.map(year => (
                       <Link 
                         key={year} 
                         href={`/executive-committees/${year}`} 
                         className={`block px-4 py-2 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all ${isActive(`/executive-committees/${year}`) ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:text-[#F37C28]'}`}
                       >
                         {year}
                       </Link>
                     ))
                   ) : (
                     <span className="block px-4 py-2 text-gray-400 text-xs italic">No years available</span>
                   )}
                </div>
              </div>

              <div className="relative group/sub">
                <button className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-l-4 text-sm font-bold transition-all ${isActive('/standing-committees') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>
                  Standing Committees
                  <ArrowDown01Icon size={16} className="-rotate-90 transform text-gray-400" />
                </button>
                <div className="absolute top-0 left-full hidden group-hover/sub:block bg-white shadow-xl border border-gray-100 min-w-[180px] rounded-2xl -ml-1 p-2 animate-in fade-in slide-in-from-left-2 duration-200 z-50">
                   {filteredStandingYears.length > 0 ? (
                     filteredStandingYears.map(year => (
                       <Link 
                         key={year} 
                         href={`/standing-committees/${year}`} 
                         className={`block px-4 py-2 hover:bg-gray-50 text-sm font-bold rounded-xl transition-all ${isActive(`/standing-committees/${year}`) ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:text-[#F37C28]'}`}
                       >
                         {year}
                       </Link>
                     ))
                   ) : (
                     <span className="block px-4 py-2 text-gray-400 text-xs italic">No years available</span>
                   )}
                </div>
              </div>

              <Link href="/event-funding" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 transition-all text-sm font-bold ${isActive('/event-funding') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>
                IEEE YP Event Funding
              </Link>

              <Link href="/reports" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 transition-all text-sm font-bold rounded-b-xl ${isActive('/reports') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>
                Reports
              </Link>
            </div>
          </div>

          <div className="relative group py-2">
            <button className={`nav-link flex items-center font-bold gap-1 transition-colors ${isActive('/events') || isActive('/the-shed') ? 'text-[#F37C28]' : 'text-gray-700 group-hover:text-[#F37C28]'}`}>
              Events
              <ArrowDown01Icon size={16} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-gray-100 min-w-[240px] rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200 text-sm font-bold">
              <Link href="/events" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 transition-all ${isActive('/events') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>Programs & Events</Link>
              <Link href="/the-shed" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 transition-all ${isActive('/the-shed') ? 'border-[#F37C28] text-[#F37C28]' : 'border-transparent text-gray-700 hover:border-[#F37C28]'}`}>The SHED</Link>
              <Link href="https://educationweek.ieee.lk/" className="block px-6 py-4 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#F37C28] transition-all text-gray-700 rounded-b-xl">IEEE Education Week</Link>
            </div>
          </div>

          <Link href="/blogs" className={`nav-link font-bold transition-colors ${isActive('/blogs') ? 'text-[#F37C28]' : 'text-gray-700 hover:text-[#F37C28]'}`}>Blogs</Link>

          <div className="relative group py-2">
            <button className="nav-link flex font-bold items-center gap-1 text-gray-700 group-hover:text-[#F37C28] transition-colors">
              Projects
              <ArrowDown01Icon size={16} className="transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-gray-100 min-w-[240px] rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200 text-sm font-bold">
              {PROJECTS.map((proj, idx) => (
                <a key={proj.label} href={proj.href} target="_blank" rel="noopener noreferrer" className={`block px-6 py-4 hover:bg-gray-50 border-l-4 border-transparent hover:border-[#F37C28] transition-all text-gray-700 whitespace-nowrap ${idx === PROJECTS.length - 1 ? 'rounded-b-xl' : ''}`}>{proj.label}</a>
              ))}
            </div>
          </div>

          <Link href="/gallery" className={`nav-link font-bold transition-colors ${isActive('/gallery') ? 'text-[#F37C28]' : 'text-gray-700 hover:text-[#F37C28]'}`}>Gallery</Link>
          <a href="https://drive.google.com/file/d/1ot1WWie9m-9tGr3wFCOslmqfKeE4Q_R4/view" target="_blank" rel="noopener noreferrer" className="nav-link font-bold text-gray-700 hover:text-[#F37C28] transition-colors">Brand Guidelines</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-500 hover:text-[#F37C28] hover:bg-gray-50 rounded-full transition-all duration-300"
            title="Search website"
          >
            <Search01Icon size={24} />
          </button>
          
          <Link 
            href="/merch" 
            className="lg:hidden p-2 text-gray-500 hover:text-[#F37C28] hover:bg-gray-50 rounded-full transition-all duration-300"
            title="YPSL Merch Hub"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag01Icon size={24} />
          </Link>

          <button 
            className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu01Icon size={24} />
          </button>
        </div>
      </nav>

      <NavSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <NavMobile 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isActive={isActive}
        executiveYears={executiveYears}
        standingYears={filteredStandingYears}
        projects={PROJECTS}
        activeSubmenu={activeMobileSubmenu}
        setActiveSubmenu={setActiveMobileSubmenu}
        activeNestedSubmenu={activeNestedSubmenu}
        setActiveNestedSubmenu={setActiveNestedSubmenu}
      />
    </header>
  );
}
