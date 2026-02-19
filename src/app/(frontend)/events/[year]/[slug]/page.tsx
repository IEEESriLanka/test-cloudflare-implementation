import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import Image from 'next/image';
import RichText from '@/components/RichText';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';

export default async function EventDetailPage({ params }: { params: Promise<{ year: string, slug: string }> }) {
    const payload = await getPayload({ config: configPromise });
    const { year, slug: rawSlug } = await params;
    const decodedSlug = decodeURIComponent(rawSlug);

    // Get date range for the year
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`).toISOString();
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`).toISOString();

    let events = await payload.find({
        collection: 'events',
        where: {
            and: [
                {
                    slug: {
                        equals: decodedSlug,
                    },
                },
                {
                    startDate: {
                        greater_than_equal: startOfYear,
                    },
                },
                {
                    startDate: {
                        less_than_equal: endOfYear,
                    },
                },
            ]
        },
        depth: 2,
    });

    // If not found, try a more aggressive search
    if (events.docs.length === 0) {
        events = await payload.find({
            collection: 'events',
            where: {
                and: [
                    {
                        or: [
                            { title: { equals: decodedSlug } },
                            { slug: { equals: decodedSlug.replace(/-/g, ' ') } }
                        ]
                    },
                    {
                        startDate: {
                            greater_than_equal: startOfYear,
                        },
                    },
                    {
                        startDate: {
                            less_than_equal: endOfYear,
                        },
                    },
                ]
            },
            depth: 2,
        });
    }

    const event = events.docs[0];

    if (!event) return notFound();

    const eventTimezone = (event.timezone as string) || 'Asia/Colombo';

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;
    
    const isSameDate = endDate && startDate.toDateString() === endDate.toDateString();
    
    const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: eventTimezone
    };

    const formattedDate = (endDate && !isSameDate)
        ? `${startDate.toLocaleDateString('en-US', { ...dateOptions, month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { ...dateOptions, month: 'short', day: 'numeric', year: 'numeric' })}`
        : startDate.toLocaleDateString('en-US', { ...dateOptions, month: 'long', day: 'numeric', year: 'numeric' });

    const formatTime = (dateStr: string | null | undefined, timezone: string) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true,
            timeZone: timezone
        });
    };

    const startTimeFormatted = formatTime(event.startTime, eventTimezone);
    const endTimeFormatted = formatTime(event.endTime, eventTimezone);
    
    const timeString = startTimeFormatted 
        ? `${startTimeFormatted}${endTimeFormatted ? ` - ${endTimeFormatted}` : ''}`
        : 'TBA';

    // Type guard for image
    const eventImage = event.image && typeof event.image === 'object' ? event.image : null;

    const isPast = startDate < new Date();

    return (
        <main className="min-h-screen pt-8 pb-32 bg-[#fcfcfc]">
            <div className="container max-w-7xl mx-auto px-4">
                <Breadcrumbs />
                
                {/* Header Title */}
                <div className="mt-8 mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight text-center md:text-left">
                        {event.title}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Main Content Area: Banner + Description Combined */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                            {/* Centered Banner Section */}
                            <div className="p-6 md:pt-16 flex justify-center bg-gray-50/30">
                                <div className="relative w-full max-w-2xl aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-100">
                                    {eventImage && (
                                        <Image
                                            src={(eventImage as any).url || ''}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="p-8 md:p-12">
                                <h2 className="text-3xl font-black mb-8 text-gray-900">Event Description</h2>
                                <div className="prose prose-lg prose-slate max-w-none">
                                    <RichText content={event.description} />
                                </div>

                                {/* Hashtags */}
                                    {event.hashtags && (
                                        <div className="flex flex-wrap gap-3 text-gray-400 font-bold text-sm tracking-wide">
                                            {(event.hashtags as string).split(' ').map((tag: string) => (
                                                <span key={tag} className="hover:text-[#F37C28] transition-colors cursor-default">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                
                                {/* Registration Button */}
                                {!isPast && event.registrationUrl && (
                                    <div className="mt-12 flex flex-col md:flex-row items-center gap-6">
                                        <a 
                                            href={event.registrationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-fit text-center px-10 py-5 bg-[#1a1a1a] text-white font-black text-xl rounded-2xl hover:bg-[#F37C28] transition-all duration-300 shadow-lg hover:shadow-2xl translate-y-0 hover:-translate-y-1"
                                        >
                                            Register Now
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area: Simplified Cards */}
                    <aside className="lg:col-span-4 space-y-6">
                        
                        {/* Event Details Card */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100 space-y-10">
                            {/* Date Section */}
                            <div>
                                <h4 className="text-gray-400 font-bold tracking-widest text-[14px] mb-3">Date</h4>
                                <p className="text-xl font-black text-gray-900 leading-tight">{formattedDate}</p>
                            </div>
                            
                            {/* Time Section */}
                            <div>
                                <h4 className="text-gray-400 font-bold tracking-widest text-[14px] mb-3">Time</h4>
                                <p className="text-xl font-black text-gray-900 leading-tight">
                                    {timeString}
                                </p>
                            </div>

                            {/* Venue Section */}
                            <div>
                                <h4 className="text-gray-400 font-bold tracking-widest text-[14px] mb-3">Venue & Platform</h4>
                                <div className="space-y-4">
                                    {(event.eventType === 'physical' || event.eventType === 'hybrid') && (
                                        <div className="space-y-2">
                                            <span className="inline-block text-[10px] font-black bg-gray-100 px-2.5 py-1 rounded-md text-gray-500 tracking-wider">Physical</span>
                                            <p className="text-xl font-black text-gray-900 leading-tight">{event.venueLocation || 'TBA'}</p>
                                        </div>
                                    )}
                                    {(event.eventType === 'online' || event.eventType === 'hybrid') && (
                                        <div className="space-y-2">
                                            <span className="inline-block text-[10px] font-black bg-blue-50 px-2.5 py-1 rounded-md text-blue-500 uppercase tracking-wider">Online</span>
                                            <p className="text-xl font-black text-gray-900 leading-tight capitalize">{event.onlinePlatform?.replace('-', ' ') || 'Webinar'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Organizers Card */}
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
                            <h3 className="text-gray-400 font-bold tracking-widest text-[14px] mb-8">Organizers</h3>
                            <div className="space-y-6">
                                {event.organizers && (event.organizers as any[]).length > 0 ? (
                                    (event.organizers as any[]).map((org: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            {org.logo && typeof org.logo === 'object' && (
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-gray-100 p-2 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <Image
                                                        src={org.logo.url || ''}
                                                        alt={org.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                {org.website ? (
                                                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-lg font-black text-gray-900 hover:text-[#F37C28] transition-colors leading-tight">
                                                        {org.name}
                                                    </a>
                                                ) : (
                                                    <p className="text-lg font-black text-gray-900 leading-tight">{org.name}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col leading-tight grayscale opacity-70 scale-90">
                                            <span className="text-gray-900 font-black text-lg leading-none">IEEE</span>
                                            <span className="text-[#F37C28] font-black text-xs tracking-tighter">youngprofessionals</span>
                                            <span className="text-gray-900 font-bold text-sm text-center border-t border-gray-200 pt-0.5">Sri Lanka</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-400">IEEE YP Sri Lanka</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
