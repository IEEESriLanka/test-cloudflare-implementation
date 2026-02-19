import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar01Icon, UserIcon, ArrowRight01Icon } from 'hugeicons-react';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q: query } = await searchParams;
  const payload = await getPayload({ config: configPromise });

  if (!query) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="container text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight mb-4">Search</h1>
          <p className="text-gray-500">Enter a keyword to search the website.</p>
        </div>
      </main>
    );
  }

  // Search articles
  const articles = await payload.find({
    collection: 'articles',
    where: {
      or: [
        { title: { contains: query } },
        { slug: { contains: query } },
      ],
    },
    limit: 10,
    depth: 1,
  });

  // Search events
  const events = await payload.find({
    collection: 'events',
    where: {
      or: [
        { title: { contains: query } },
        { venueLocation: { contains: query } },
        { slug: { contains: query } },
      ],
    },
    limit: 10,
    depth: 1,
  });

  const totalResults = articles.totalDocs + events.totalDocs;

  return (
    <main className="min-h-screen pt-32 pb-20 bg-gray-50 text-gray-900">
      <div className="container">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight mb-2">Search Results</h1>
          <p className="text-gray-500">
            {totalResults} results found for <span className="text-[#F37C28] font-bold">&quot;{query}&quot;</span>
          </p>
        </div>

        <div className="space-y-16">
          {/* Articles Section */}
          {articles.docs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Articles <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{articles.totalDocs}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                {articles.docs.map((article: any) => (
                  <Link 
                    key={article.id} 
                    href={`/blogs/${article.slug}`}
                    className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {article.featuredImage?.url ? (
                        <Image 
                          src={article.featuredImage.url} 
                          alt={article.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-[10px] font-black uppercase text-[#F37C28] tracking-widest mb-2">Article</div>
                      <h3 className="text-xl font-bold group-hover:text-[#F37C28] transition-colors mb-4 line-clamp-2">{article.title}</h3>
                      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium pt-4 border-t border-gray-50">
                        <span className="flex items-center gap-1">
                          <Calendar01Icon size={14} />
                          {new Date(article.publishDate).toLocaleDateString()}
                        </span>
                        <ArrowRight01Icon size={16} className="text-[#F37C28] transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Events Section */}
          {events.docs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Events <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{events.totalDocs}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                {events.docs.map((event: any) => (
                  <Link 
                    key={event.id} 
                    href={`/events/${event.slug}`}
                    className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {event.image?.url ? (
                        <Image 
                          src={event.image.url} 
                          alt={event.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">No Image</div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-2">Event</div>
                      <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors mb-4 line-clamp-2">{event.title}</h3>
                      <div className="mt-auto flex items-center justify-between text-xs text-gray-500 font-medium pt-4 border-t border-gray-50">
                        <span className="flex items-center gap-1">
                          <Calendar01Icon size={14} />
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                        <ArrowRight01Icon size={16} className="text-blue-600 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {totalResults === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 px-4">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn&apos;t find any articles or events matching &quot;{query}&quot;. Try using different keywords or checking for spelling errors.
              </p>
              <Link href="/" className="inline-block mt-8 text-[#F37C28] font-bold hover:underline">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
