'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS } from '@/app/(payload)/access/constants';

interface EventCardProps {
  event: any;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.startDate);
  const eventTimezone = (event.timezone as string) || 'Asia/Colombo';
  
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: eventTimezone
  });

  const isPast = startDate < new Date();
  const ctaText = isPast ? 'VIEW DETAILS' : 'ATTEND';

  // Extract description text from richText if it exists
  const getDescription = (richText: any) => {
    if (!richText || !richText.root || !richText.root.children) return '';
    
    let text = '';
    const extractText = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.text) text += node.text;
        if (node.children) extractText(node.children);
      });
    };
    
    extractText(richText.root.children);
    return text.substring(0, 100) + (text.length > 100 ? '...' : '');
  };

  const venue = event.venueLocation || (event.eventType === 'online' ? event.onlinePlatform : 'TBA');
  const projectLabel = PROJECTS.find(p => p.value === event.project)?.label || 'YP Sri Lanka';

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
      {/* Poster Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        {event.image && typeof event.image === 'object' && 'url' in event.image && (
          <Image
            src={event.image.url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Project Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#F37C28] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
            {projectLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Venue/Location */}
        <div className="flex items-start gap-2 mb-3 text-gray-600">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F37C28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-medium leading-tight capitalize">
            {venue}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1 leading-tight group-hover:text-[#F37C28] transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">
          {getDescription(event.description)}
        </p>

        {/* Footer: Date & Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-[#F37C28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-bold">{formattedDate}</span>
          </div>

          <Link 
            href={`/events/${startDate.getFullYear()}/${event.slug?.replace(/\s+/g, '-')}`}
            className="px-5 py-2 rounded-xl border-2 border-[#F37C28] text-[#F37C28] font-bold text-xs hover:bg-[#F37C28] hover:text-white transition-all duration-300"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
