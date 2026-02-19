import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import RichText from '@/components/RichText';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PROJECTS } from '@/app/(payload)/access/constants';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: Promise<{ year: string, slug: string }> }) {
    const { year, slug: rawSlug } = await params;
    const decodedSlug = decodeURIComponent(rawSlug);
    const payload = await getPayload({ config: configPromise });

    // Get date range for the year
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`).toISOString();
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`).toISOString();

    // Try finding by slug (hyphenated)
    let articles = await payload.find({
        collection: 'articles',
        where: {
            and: [
                {
                    slug: {
                        equals: decodedSlug,
                    },
                },
                {
                    publishDate: {
                        greater_than_equal: startOfYear,
                    },
                },
                {
                    publishDate: {
                        less_than_equal: endOfYear,
                    },
                },
            ]
        },
        depth: 2,
    });

    // If not found, try a more aggressive search
    if (articles.docs.length === 0) {
        articles = await payload.find({
            collection: 'articles',
            where: {
                and: [
                    {
                        or: [
                            { title: { equals: decodedSlug } },
                            { slug: { equals: decodedSlug.replace(/-/g, ' ') } }
                        ]
                    },
                    {
                        publishDate: {
                            greater_than_equal: startOfYear,
                        },
                    },
                    {
                        publishDate: {
                            less_than_equal: endOfYear,
                        },
                    },
                ]
            },
            depth: 2,
        });
    }

    const article = articles.docs[0];

    if (!article) {
        return notFound();
    }

    const publishDate = new Date(article.publishDate || new Date());
    const formattedDate = publishDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const author = article.author;
    const authorName = (author && typeof author === 'object') ? (author as any).name : 'IEEE YPSL';
    const authorRole = (author && typeof author === 'object') ? (author as any).role : 'Member';
    const authorPhoto = (author && typeof author === 'object' && (author as any).photo && typeof (author as any).photo === 'object' && 'url' in (author as any).photo) 
        ? (author as any).photo.url 
        : null;

    const projectLabel = PROJECTS.find(p => p.value === article.project)?.label;

    return (
        <main className="min-h-screen pt-8 pb-32 bg-white">
            <div className="container">
                {/* 1. Breadcrumbs - Full Width in Grid */}
                <div className="mb-8">
                    <Breadcrumbs />
                </div>
                
                <div className="max-w-5xl mx-auto">
                    {/* Editorial Layout - Inspiration: Indonesia to Host ASEAN Climate Summit */}
                    <div className="mb-12">
                        {/* 1. Title at the top */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                            {article.title}
                        </h1>

                        {/* 2. Metadata row: Author · Project Tag · Date */}
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-2 text-sm text-gray-600 font-medium">
                            {/* Author with Avatar */}
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    {authorPhoto ? (
                                        <Image
                                            src={authorPhoto}
                                            alt={authorName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#F37C28]/10 flex items-center justify-center text-[#F37C28] text-[12px] font-black">
                                            {authorName.substring(0, 1)}
                                        </div>
                                    )}
                                </div>
                                <span>{authorName}</span>
                            </div>

                            <span className="text-gray-300">•</span>

                            {/* Project Tag with specific underline */}
                            {projectLabel && (
                                <span className="relative pb-0.5">
                                    {projectLabel}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px]" />
                                </span>
                            )}

                            {projectLabel && <span className="text-gray-300">•</span>}

                            {/* Date */}
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* 3. Featured Image - Shorter height, rounded corners */}
                    <div className="mb-16">
                        <div className="relative aspect-[21/9] w-full rounded-[32px] overflow-hidden shadow-sm border border-gray-100 bg-[#fcfcfc]">
                            {article.featuredImage && typeof article.featuredImage === 'object' && 'url' in article.featuredImage && article.featuredImage.url && (
                                <Image
                                    src={article.featuredImage.url}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>
                    </div>

                    {/* 4. Main Content Area */}
                    <div className="max-w-3xl px-4 lg:px-0">
                        <div className="prose prose-lg md:prose-xl prose-slate max-w-none text-gray-800 leading-relaxed font-medium">
                            <RichText content={article.content} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
