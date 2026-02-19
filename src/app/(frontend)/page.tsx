import Link from 'next/link';
import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import HeroCarousel from '@/components/HeroCarousel';
import AboutStats from '@/components/AboutStats';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import FAQSection from '@/components/FAQSection';

import EventCard from '@/components/EventCard';
import BlogCard from '@/components/BlogCard';
import AwardSlider from '@/components/AwardSlider';
import MerchFloatingBadge from '@/components/merch/MerchFloatingBadge';

import { Article, Award, Event, Media } from '@/payload-types';

export const revalidate = 60;

export default async function HomePage() {
    const payload = await getPayload({ config: configPromise });

    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).toISOString();

    let heroSettings: any, 
        aboutSettings: any, 
        upcomingEventsRes: any, 
        pastEventsRes: any, 
        projectsRes: any, 
        awardsRes: any, 
        faqsRes: any, 
        currentYearArticlesRes: any, 
        fallbackArticlesRes: any;

    try {
        [
            heroSettings,
            aboutSettings,
            upcomingEventsRes,
            pastEventsRes,
            projectsRes,
            awardsRes,
            faqsRes,
            currentYearArticlesRes,
            fallbackArticlesRes
        ] = await Promise.all([
            payload.findGlobal({ slug: 'hero-section', depth: 2 }),
            payload.findGlobal({ slug: 'about-section', depth: 2 }),
            payload.find({
                collection: 'events',
                where: { startDate: { greater_than_equal: now.toISOString() } },
                sort: 'startDate',
                limit: 6,
                depth: 2,
            }),
            payload.find({
                collection: 'events',
                where: {
                    and: [
                        { startDate: { less_than: now.toISOString() } },
                        { startDate: { greater_than_equal: startOfYear } }
                    ]
                },
                sort: '-startDate',
                limit: 6,
                depth: 2,
            }),
            payload.find({ collection: 'ieee-projects', limit: 6, depth: 2 }),
            payload.find({ collection: 'awards', limit: 10, depth: 1 }),
            payload.find({ collection: 'faqs', sort: 'createdAt', limit: 10 }),
            payload.find({
                collection: 'articles',
                where: { publishDate: { greater_than_equal: startOfYear } },
                sort: '-publishDate',
                limit: 6,
                depth: 2,
            }),
            payload.find({
                collection: 'articles',
                sort: '-publishDate',
                limit: 6,
                depth: 2,
            }),
        ]);
    } catch (error) {
        console.error('Error fetching data for HomePage:', error);
        // Provide fallbacks or re-throw
        throw error;
    }

    const displayEvents = upcomingEventsRes.docs.length > 0 
        ? (upcomingEventsRes.docs as Event[]) 
        : (pastEventsRes.docs as Event[]);

    const displayArticles = currentYearArticlesRes.docs.length > 0 
        ? (currentYearArticlesRes.docs as Article[]) 
        : (fallbackArticlesRes.docs as Article[]);

    const transformedAwards = awardsRes.docs.map((award: Award) => ({
        ...award,
        awardImage: award.awardImage && typeof award.awardImage === 'object' 
            ? { url: (award.awardImage as Media).url || '' }
            : null
    }));

    return (
        <main className="min-h-screen">
            {/* 1. Hero Section */}
            <HeroCarousel 
                banners={heroSettings?.banners || []} 
                mainHeading={heroSettings?.mainHeading}
                subHeading={heroSettings?.subHeading}
            />

            {/* 2. About Section */}
            <AboutStats 
                description={aboutSettings?.description} 
                stats={aboutSettings?.stats} 
            />

            {/* 3. Latest Programs & Events */}
            <section className="section-padding bg-gray-50">
                <div className="container">
                    <div className="mb-10 md:mb-12 text-center space-y-2">
                        <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-xs md:text-sm">Experience More</h4>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#002855]">Programs & Events</h2>
                    </div>

                    {displayEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {displayEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100 italic text-gray-400">
                            No events available at the moment.
                        </div>
                    )}
                    
                    <div className="mt-8 md:mt-12 text-center">
                        <Link href="/events" className="inline-block px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl border-2 border-[#F37C28] text-[#F37C28] font-bold text-xs md:text-sm hover:bg-[#F37C28] hover:text-white transition-all tracking-tight">
                            View All Events
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Latest Articles */}
            <section className="section-padding bg-white">
                <div className="container">
                    <div className="mb-10 md:mb-12 text-center space-y-2">
                        <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-xs md:text-sm">Stay Updated</h4>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[#002855]">Latest Articles</h2>
                    </div>
                    
                    {displayArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {displayArticles.map((article) => (
                                <BlogCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="container text-center text-gray-400 italic py-20 border-2 border-dashed border-gray-100 rounded-[40px]">
                            <p className="col-span-full">No blog articles available at the moment.</p>
                        </div>
                    )}

                    <div className="mt-8 md:mt-12 text-center">
                        <Link href="/blogs" className="inline-block px-6 py-2.5 md:px-8 md:py-3.5 rounded-xl border-2 border-[#F37C28] text-[#F37C28] font-bold text-xs md:text-sm hover:bg-[#F37C28] hover:text-white transition-all tracking-tight">
                            View All Articles
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. IEEE YPSL Projects */}
            <ProjectsShowcase projects={projectsRes.docs} />

            {/* 6. Awards Section */}
            <AwardSlider awards={transformedAwards as any} />

            {/* 7. UPCOMING MONTHLY EVENT CALENDAR */}
            <section className="section-padding bg-gray-50">
                <div className="container">
                    <div className="text-center mb-10 md:mb-16 space-y-4">
                        <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-sm">Save the Date</h4>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002855]">Event Calendar</h2>
                    </div>
                    <div className="rounded-[40px] overflow-hidden shadow-2xl bg-white p-2 border border-gray-100">
                        <div className="w-full h-[600px] bg-gray-50 rounded-[32px] overflow-hidden">
                            <iframe 
                                src="https://calendar.google.com/calendar/u/0/embed?wkst=1&ctz=Asia/Colombo&title=IEEE+YPSL+Reported+Event+Calendar&showTabs=1&showNav=1&src=aWdrbGdjc28ydDdkMWFjNWY1anRxMnVqNm0yOGQ4cG9AaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=cmZ0aG1jNWVjNnM4dDlrMXJicjIxdXRuajhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=bTM2MGc0ZzVta203OWZqc3MzNmNhNnZxNzdrc3FjdTlAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=MDAzdjhxcTJhOWttNjNrc2MzcThxaHA4NmNsY3ZsbjFAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=dGd0OG12a25saXF2ajlncGc3cW02Y2Y0cmc0bGhnZGFAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20&src=N2JrMjQ4a3JyaGRsc3ZnZjhhbm5najlrc2dAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23009688&color=%23616161&color=%23F6BF26&color=%23A79B8E&color=%23009688&color=%23B39DDB" 
                                style={{ borderWidth: 0 }} 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FAQ */}
            <FAQSection faqs={faqsRes.docs} />
            
            <MerchFloatingBadge />
            
        </main>
    );
}
