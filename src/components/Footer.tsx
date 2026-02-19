'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  InstagramIcon, 
  Facebook02Icon, 
  Linkedin01Icon, 
  NewTwitterIcon, 
  YoutubeIcon, 
  Location01Icon, 
  CallIcon, 
  Mail01Icon, 
  ArrowUp02Icon, 
  TiktokIcon,
  ThreadsIcon
} from 'hugeicons-react';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white relative">
      <div className="container px-4">
        
        {/* Top Global Links */}
        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-3 py-6 md:py-8 text-[10px] md:text-sm font-medium tracking-wide text-gray-300 uppercase text-center px-2">
          <a href="https://www.ieee.org/" target="_blank" rel="noopener" className="hover:text-[#F37C28] transition-colors">IEEE</a>
          <a href="https://ieeexplore.ieee.org/" target="_blank" rel="noopener" className="hover:text-[#F37C28] transition-colors">IEEE Xplore Digital Library</a>
          <a href="https://standards.ieee.org/" target="_blank" rel="noopener" className="hover:text-[#F37C28] transition-colors">IEEE Standards</a>
          <a href="https://spectrum.ieee.org/" target="_blank" rel="noopener" className="hover:text-[#F37C28] transition-colors">IEEE Spectrum</a>
          <a href="https://www.ieee.org/sitemap.html" target="_blank" rel="noopener" className="hover:text-[#F37C28] transition-colors">More Sites</a>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800" />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              {/* White Logo construction based on text */}
              <Image 
                src="/media/IEEE-YP-SL-Logo-white.png" 
                alt="IEEE Young Professionals Sri Lanka" 
                width={200} 
                height={70}
                className="h-16 w-auto object-contain"
              />
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              We&apos;re an inspiring community of recent graduates, emerging leaders, and seasoned professionals united by a commitment to innovation, growth, and community impact. Whether you want to expand your network, gain new skills, or give back to society, you&apos;ve come to the right place.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { icon: InstagramIcon, url: 'https://www.instagram.com/ieeeypsl/' }, 
                { icon: Facebook02Icon, url: 'https://www.facebook.com/ypsrilanka' },
                { icon: Linkedin01Icon, url: 'https://www.linkedin.com/company/ieeeypsl/' },
                { icon: ThreadsIcon, url: 'https://www.threads.com/@ieeeypsl' }, 
                { icon: TiktokIcon, url: 'https://www.tiktok.com/@ieee.ypsl' },
                { icon: YoutubeIcon, url: 'https://www.youtube.com/channel/UC8LrGEKHHuzqiyj5BeU7uKQ' }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-600 text-gray-400 hover:text-[#F37C28] hover:border-white hover:bg-gray-800 transition-all"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="lg:pl-12">
            <h3 className="text-white text-2xl font-bold mb-8">Contact</h3>
            <ul className="space-y-6 text-gray-300">
              <li className="flex items-start gap-4">
                <a 
                  href="https://maps.google.com/?q=Trace+Expert+City+Colombo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 hover:text-[#F37C28] transition-colors"
                >
                  <div className="mt-1 flex-shrink-0">
                     <Location01Icon size={20} className="text-gray-400" />
                  </div>
                  <span>Trace Expert City, Colombo</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <a 
                  href="tel:+94710646688" 
                  className="flex items-center gap-4 hover:text-[#F37C28] transition-colors"
                >
                  <div className="flex-shrink-0">
                     <CallIcon size={20} className="text-gray-400" />
                  </div>
                  <span>+94710646688</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <a 
                  href="mailto:info@ieeeyp.lk" 
                  className="flex items-center gap-4 hover:text-[#F37C28] transition-colors"
                >
                  <div className="flex-shrink-0">
                     <Mail01Icon size={20} className="text-gray-400" />
                  </div>
                  <span>info@ieeeyp.lk</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="lg:pl-8">
            <h3 className="text-white text-2xl font-bold mb-8">Useful Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="https://ieee.lk" target="_blank" rel="noopener noreferrer" className="hover:text-[#F37C28] hover:translate-x-1 transition-all inline-block">IEEE Sri Lanka Section</a></li>
              <li><a href="https://www.ieeer10.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#F37C28] hover:translate-x-1 transition-all inline-block">IEEE R10</a></li>
              <li><a href="https://yp.ieeer10.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#F37C28] hover:translate-x-1 transition-all inline-block">IEEE R10 Young Professionals</a></li>
              <li><a href="https://yp.ieee.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#F37C28] hover:translate-x-1 transition-all inline-block">IEEE Young Professionals</a></li>
              <li><a href="https://ieee.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#F37C28] hover:translate-x-1 transition-all inline-block">IEEE</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800" />

        {/* Bottom Bar */}
        <div className="py-8 text-center text-gray-500 text-sm">
          <p>Copyright © {new Date().getFullYear()} IEEE Young Professionals Sri Lanka – All rights reserved.</p>
        </div>

      </div>

      {/* Floating Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#F37C28] text-white flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-50 pointer-events-none'
        } hover:bg-[#d96a1e] hover:-translate-y-1`}
        title="Go to Top"
      >
        <ArrowUp02Icon size={24} />
      </button>
    </footer>
  );
}
