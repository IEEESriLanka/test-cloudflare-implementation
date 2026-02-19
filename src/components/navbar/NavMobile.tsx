'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown01Icon } from 'hugeicons-react';

interface NavMobileProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: (path: string) => boolean;
  executiveYears: string[];
  standingYears: string[];
  projects: { label: string; href: string }[];
  activeSubmenu: string | null;
  setActiveSubmenu: (menu: string | null) => void;
  activeNestedSubmenu: string | null;
  setActiveNestedSubmenu: (menu: string | null) => void;
}

export default function NavMobile({
  isOpen,
  onClose,
  isActive,
  executiveYears,
  standingYears,
  projects,
  activeSubmenu,
  setActiveSubmenu,
  activeNestedSubmenu,
  setActiveNestedSubmenu
}: NavMobileProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-2 h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top duration-300">
      <Link 
        href="/" 
        className={`block font-bold uppercase py-3 px-4 rounded-lg transition-all ${isActive('/') ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`} 
        onClick={onClose}
      >
        Home
      </Link>
      
      {/* About Us Submenu */}
      <div>
        <button 
          onClick={() => setActiveSubmenu(activeSubmenu === 'about' ? null : 'about')}
          className={`w-full flex items-center justify-between font-bold uppercase py-3 px-4 rounded-lg transition-all ${isActive('/overview') || isActive('/executive-committees') || isActive('/standing-committees') || isActive('/event-funding') || isActive('/reports') ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          About Us
          <ArrowDown01Icon size={20} className={`transition-transform duration-300 ${activeSubmenu === 'about' ? 'rotate-180' : ''}`} />
        </button>
        {activeSubmenu === 'about' && (
          <div className="pl-6 mt-1 space-y-1 bg-gray-50/50 rounded-lg py-2">
            <Link 
              href="/overview" 
              className={`block py-2 px-4 text-sm font-medium rounded-lg transition-all ${isActive('/overview') ? 'text-[#F37C28]' : 'text-gray-700 hover:bg-gray-50'}`} 
              onClick={onClose}
            >
              Overview
            </Link>
            
            {/* Executive Committees Nested Dropdown */}
            <div>
              <button 
                onClick={() => setActiveNestedSubmenu(activeNestedSubmenu === 'executive' ? null : 'executive')}
                className={`w-full flex items-center justify-between py-2 px-4 text-sm font-medium rounded-lg mt-1 transition-all ${isActive('/executive-committees') ? 'text-[#F37C28]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Executive Committees
                <ArrowDown01Icon size={16} className={`transition-transform duration-300 ${activeNestedSubmenu === 'executive' ? 'rotate-180 text-[#F37C28]' : 'text-gray-400'}`} />
              </button>
              {activeNestedSubmenu === 'executive' && (
                <div className="flex flex-col gap-2 px-4 pt-1 pb-2">
                  {executiveYears.map(year => (
                    <Link 
                      key={year} 
                      href={`/executive-committees/${year}`} 
                      className={`py-2 px-4 text-sm font-medium border border-gray-100 rounded-lg flex items-center justify-center transition-all ${isActive(`/executive-committees/${year}`) ? 'text-[#F37C28] bg-[#F37C28]/5 border-[#F37C28]/20' : 'text-gray-600 bg-white shadow-sm hover:text-[#F37C28]'}`} 
                      onClick={onClose}
                    >
                      {year}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Standing Committees Nested Dropdown */}
            <div>
              <button 
                onClick={() => setActiveNestedSubmenu(activeNestedSubmenu === 'standing' ? null : 'standing')}
                className={`w-full flex items-center justify-between py-2 px-4 text-sm font-medium rounded-lg mt-1 transition-all ${isActive('/standing-committees') ? 'text-[#F37C28]' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Standing Committees
                <ArrowDown01Icon size={16} className={`transition-transform duration-300 ${activeNestedSubmenu === 'standing' ? 'rotate-180 text-[#F37C28]' : 'text-gray-400'}`} />
              </button>
              {activeNestedSubmenu === 'standing' && (
                <div className="flex flex-col gap-2 px-4 pt-1 pb-2">
                  {standingYears.map(year => (
                    <Link 
                      key={year} 
                      href={`/standing-committees/${year}`} 
                      className={`py-2 px-4 text-sm font-medium border border-gray-100 rounded-lg flex items-center justify-center transition-all ${isActive(`/standing-committees/${year}`) ? 'text-[#F37C28] bg-[#F37C28]/5 border-[#F37C28]/20' : 'text-gray-600 bg-white shadow-sm hover:text-[#F37C28]'}`} 
                      onClick={onClose}
                    >
                      {year}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/event-funding" 
              className={`block py-2 px-4 text-sm font-medium rounded-lg mt-1 transition-all ${isActive('/event-funding') ? 'text-[#F37C28]' : 'text-gray-700 hover:bg-gray-50'}`} 
              onClick={onClose}
            >
              IEEE YP Event Funding
            </Link>
            <Link 
              href="/reports" 
              className={`block py-2 px-4 text-sm font-medium rounded-lg mt-1 transition-all ${isActive('/reports') ? 'text-[#F37C28]' : 'text-gray-700 hover:bg-gray-50'}`} 
              onClick={onClose}
            >
              Reports
            </Link>
          </div>
        )}
      </div>

      {/* Events Submenu */}
      <div>
        <button 
          onClick={() => setActiveSubmenu(activeSubmenu === 'events' ? null : 'events')}
          className={`w-full flex items-center justify-between font-bold uppercase py-3 px-4 rounded-lg transition-all ${isActive('/events') || isActive('/the-shed') ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          Events
          <ArrowDown01Icon size={20} className={`transition-transform duration-300 ${activeSubmenu === 'events' ? 'rotate-180' : ''}`} />
        </button>
        {activeSubmenu === 'events' && (
          <div className="pl-6 mt-1 space-y-1 bg-gray-50/50 rounded-lg py-2">
            <Link 
              href="/events" 
              className={`block py-2 px-4 text-sm font-medium transition-all ${isActive('/events') ? 'text-[#F37C28]' : 'text-gray-600 hover:bg-gray-50'}`} 
              onClick={onClose}
            >
              Programs & Events
            </Link>
            <Link 
              href="/the-shed" 
              className={`block py-2 px-4 text-sm font-medium transition-all ${isActive('/the-shed') ? 'text-[#F37C28]' : 'text-gray-600 hover:bg-gray-50'}`} 
              onClick={onClose}
            >
              The SHED
            </Link>
            <Link href="/education-week" className="block py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50" onClick={onClose}>IEEE Education Week</Link>
          </div>
        )}
      </div>

      <Link 
        href="/blogs" 
        className={`block font-bold uppercase py-3 px-4 rounded-lg transition-all ${isActive('/blogs') ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`} 
        onClick={onClose}
      >
        Blogs
      </Link>

      {/* Projects Submenu */}
      <div>
        <button 
          onClick={() => setActiveSubmenu(activeSubmenu === 'projects' ? null : 'projects')}
          className="w-full flex items-center justify-between font-bold uppercase py-3 px-4 hover:bg-gray-50 rounded-lg text-gray-700"
        >
          Projects
          <ArrowDown01Icon size={20} className={`transition-transform duration-300 ${activeSubmenu === 'projects' ? 'rotate-180' : ''}`} />
        </button>
        {activeSubmenu === 'projects' && (
          <div className="pl-6 mt-1 space-y-1 bg-gray-50/50 rounded-lg py-2">
            {projects.map(proj => (
              <a key={proj.label} href={proj.href} target="_blank" rel="noopener noreferrer" className="block py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-50" onClick={onClose}>{proj.label}</a>
            ))}
          </div>
        )}
      </div>

      <Link 
        href="/gallery" 
        className={`block font-bold uppercase py-3 px-4 rounded-lg transition-all ${isActive('/gallery') ? 'text-[#F37C28] bg-gray-50' : 'text-gray-700 hover:bg-gray-50'}`} 
        onClick={onClose}
      >
        Gallery
      </Link>
      <a href="https://drive.google.com/file/d/1ot1WWie9m-9tGr3wFCOslmqfKeE4Q_R4/view" target="_blank" rel="noopener noreferrer" className="block font-bold uppercase py-3 px-4 hover:bg-gray-50 rounded-lg text-gray-700" onClick={onClose}>Brand Guidelines</a>
    </div>
  );
}
