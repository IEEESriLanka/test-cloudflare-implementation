import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import BlogFilterList from '@/components/BlogFilterList';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogsYearPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;
    const payload = await getPayload({ config: configPromise });

    const articles = await payload.find({
        collection: 'articles',
        sort: '-publishDate',
        limit: 1000,
        depth: 2,
    });

    return (
        <main className="min-h-screen py-8">
            <div className="container">
                <Breadcrumbs />

                <BlogFilterList initialArticles={articles.docs} defaultYear={year} />
            </div>
        </main>
    );
}
