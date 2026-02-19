'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight01Icon, Home01Icon } from 'hugeicons-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  // Remove query parameters and trailing slash
  const path = pathname.split('?')[0].replace(/\/$/, '');
  
  // Don't show on home page
  if (path === '') return null;

  const segments = path.split('/').filter(Boolean);

  // Map segments to readable labels
  const getLabel = (segment: string) => {
    // Decode URL component to handle %20 etc.
    const decoded = decodeURIComponent(segment);
    
    // Custom overrides
    if (decoded === 'executive-committees') return 'Executive Committees';

    // Check if it's a year (4 digits)
    if (/^\d{4}$/.test(decoded)) return decoded;
    
    // Convert kebab-case to Title Case
    return decoded
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
      <Link 
        href="/" 
        className="flex items-center hover:text-[#F37C28] transition-colors"
      >
        <Home01Icon size={16} />
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const isNonClickable = ['executive-committees', 'standing-committees'].includes(segment);

        return (
          <div key={url} className="flex items-center">
            <ArrowRight01Icon size={14} className="mx-2 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900 border-b border-[#F37C28]">
                {getLabel(segment)}
              </span>
            ) : isNonClickable ? (
              <span className="text-gray-500">
                {getLabel(segment)}
              </span>
            ) : (
              <Link 
                href={url}
                className="hover:text-[#F37C28] transition-colors"
              >
                {getLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
