'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import EventCard from './EventCard';
import { PROJECTS } from '@/app/(payload)/access/constants';
import { CalendarRemove01Icon } from 'hugeicons-react';

interface EventsFilterListProps {
  initialEvents: any[];
  defaultYear?: string;
}

const EventsFilterList: React.FC<EventsFilterListProps> = ({ initialEvents, defaultYear }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear().toString();
  const [activeProject, setActiveProject] = useState('all');
  const [activeTime, setActiveTime] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear || currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // Function to handle year change and navigation
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    
    // Detect if we are in events or blogs based on current path
    const basePath = pathname.includes('/events') ? '/events' : '/blogs';
    router.push(`${basePath}/${year}`);
  };

  // Helper to get date/year in event's specific timezone
  const getDateInTimezone = (dateStr: string, timezone: string = 'Asia/Colombo') => {
    const date = new Date(dateStr);
    // Use toLocaleDateString to get a stable string in the target timezone, then parse it back
    const zonedDateStr = date.toLocaleString('en-US', { timeZone: timezone });
    return new Date(zonedDateStr);
  };

  const getYearInTimezone = (dateStr: string, timezone: string = 'Asia/Colombo') => {
    const date = new Date(dateStr);
    return parseInt(date.toLocaleDateString('en-US', { timeZone: timezone, year: 'numeric' }));
  };

  // Extract unique years from events
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialEvents.map(e => getYearInTimezone(e.startDate, e.timezone || 'Asia/Colombo'))));
    if (!uniqueYears.includes(parseInt(currentYear))) {
        uniqueYears.push(parseInt(currentYear));
    }
    return uniqueYears.sort((a, b) => b - a);
  }, [initialEvents, currentYear]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = initialEvents;

    // 1. Filter by Project
    if (activeProject !== 'all') {
      events = events.filter((event) => event.project === activeProject);
    }

    // 2. Filter by Year
    if (selectedYear !== 'all') {
        events = events.filter((event) => getYearInTimezone(event.startDate, event.timezone || 'Asia/Colombo').toString() === selectedYear);
    }

    // 3. Filter by Time (Upcoming vs Past) - ONLY if current year
    const now = new Date();
    // Use Asia/Colombo for "now" comparison as it's the primary target
    const nowInSL = getDateInTimezone(now.toISOString(), 'Asia/Colombo');
    nowInSL.setHours(0, 0, 0, 0);

    if (selectedYear === currentYear) {
        if (activeTime === 'upcoming') {
            events = events.filter((event) => {
                const eventDate = getDateInTimezone(event.startDate, event.timezone || 'Asia/Colombo');
                return eventDate >= nowInSL;
            });
            events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        } else {
            events = events.filter((event) => {
                const eventDate = getDateInTimezone(event.startDate, event.timezone || 'Asia/Colombo');
                return eventDate < nowInSL;
            });
            events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        }
    } else {
        events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    return events;
  }, [initialEvents, activeProject, activeTime, selectedYear, currentYear]);

  return (
    <div className="space-y-8">
      {/* Header Section with Dropdown (Moved here for alignment) */}
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-y-4 md:gap-y-6">
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight order-1">
               Programs & <span className="text-[#F37C28]">Events</span>
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-lg w-full order-2 md:order-3">
                Stay updated with our latest workshops, seminars, and networking sessions designed to empower young professionals in Sri Lanka.
            </p>

            {/* Year Dropdown */}
            <div className="relative group min-w-[140px] md:min-w-[200px] flex-shrink-0 z-20 order-3 md:order-2 self-start md:self-auto">
              <button 
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                onBlur={() => setTimeout(() => setIsYearDropdownOpen(false), 200)}
                className="w-full flex items-center justify-between px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-[#002855] hover:border-[#F37C28] transition-colors shadow-sm text-sm md:text-base"
              >
                <span>{selectedYear === 'all' ? 'All Years' : `Year ${selectedYear}`}</span>
                <svg className={`w-4 h-4 md:w-5 md:h-5 ml-2 text-gray-400 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isYearDropdownOpen && (
                  <div className="absolute right-0 md:right-0 left-0 md:left-auto top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                    {years.map((y) => (
                      <button 
                        key={y} 
                        onClick={() => handleYearChange(y.toString())}
                        className={`block w-full text-left px-4 py-2 md:px-6 md:py-3 text-sm font-bold hover:bg-gray-50 transition-colors ${selectedYear === y.toString() ? 'text-[#F37C28] bg-orange-50' : 'text-gray-700'}`}
                      >
                        Year {y}
                      </button>
                    ))}
                  </div>
              )}
            </div>
      </div>

      {/* Time Tabs (Upcoming / Past) - Only visible for current year */}
      {selectedYear === currentYear && (
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-full inline-flex w-full sm:w-auto">
              <button
                onClick={() => setActiveTime('upcoming')}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-sm font-bold transition-all ${
                  activeTime === 'upcoming'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTime('past')}
                className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-sm font-bold transition-all ${
                  activeTime === 'past'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>
      )}

      {/* Project Tabs */}
      <div className="flex justify-center flex-wrap gap-3">
        {/* 'All' Tab */}
        <button
          onClick={() => setActiveProject('all')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
            activeProject === 'all'
              ? 'bg-[#F37C28] text-white border-[#F37C28]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          All Projects
        </button>

        {/* Project Specific Tabs */}
        {PROJECTS.map((project) => (
          <button
            key={project.value}
            onClick={() => setActiveProject(project.value)}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-sm font-semibold transition-all duration-300 border ${
              activeProject === project.value
                ? 'bg-[#F37C28] text-white border-[#F37C28]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {project.label}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6">
            <CalendarRemove01Icon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTime} events found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn&apos;t find any {activeTime} events for the <span className="font-semibold text-gray-900">
                {activeProject === 'all' ? 'All Projects' : PROJECTS.find(p => p.value === activeProject)?.label}
            </span> category in <span className="font-semibold text-gray-900">{selectedYear === 'all' ? 'any year' : selectedYear}</span>.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsFilterList;
