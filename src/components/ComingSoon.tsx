'use client';

import Link from 'next/link';
import { ArrowLeft02Icon } from 'hugeicons-react';
import Breadcrumbs from './Breadcrumbs';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ 
  title, 
  description = "We're working hard to bring you this content. Stay tuned for updates!" 
}: ComingSoonProps) {
  return (
    <div className="container py-8 min-h-[60vh] flex flex-col">
      <Breadcrumbs />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 mt-12">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight">
            {title}
            <span className="text-[#F37C28] block mt-2">Coming Soon</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* <div className="w-24 h-1 bg-gradient-to-r from-[#00629B] to-[#F37C28] rounded-full opacity-80" /> */}

        {/* <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00629B] text-white rounded-lg hover:bg-[#00507a] transition-all transform hover:scale-105 shadow-md"
        >
          <ArrowLeft02Icon size={20} />
          <span>Back to Home</span>
        </Link> */}
      </div>
    </div>
  );
}
