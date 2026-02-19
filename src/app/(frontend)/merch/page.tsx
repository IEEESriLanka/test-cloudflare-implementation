import Link from 'next/link';
import React, { Suspense } from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import MerchPageClient from './MerchPageClient'
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 60;

export default async function MerchPage() {
    const payload = await getPayload({ config: configPromise });

    // Fetch Merch Items
    const merchants = await payload.find({
        collection: 'merchants',
        where: {
            availability: {
                equals: 'available',
            },
        },
        sort: '-createdAt',
        depth: 2,
    });

    // Fetch Merch Categories
    const categories = await payload.find({
        collection: 'merch-categories',
        limit: 100,
        sort: 'name',
    });

    return (
        <main className="min-h-screen bg-gray-50 pt-8 pb-24">
            <div className="container">
                <Breadcrumbs />

                {/* Header */}
                <div className="mb-10 md:mb-16 flex flex-col items-center text-center space-y-4">
                    <h4 className="text-[#F37C28] font-bold uppercase tracking-widest text-xs md:text-sm">Official Merchandise</h4>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight">
                        Represent the <span className="text-[#F37C28]">Impact</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto">
                        Grab your exclusive IEEE Young Professionals Sri Lanka merchandise. Show your support and be part of the community in style!
                    </p>
                </div>
                
                {/* Client Component for filtering/interaction */}
                <Suspense fallback={<div className="text-center py-20">Loading Items...</div>}>
                    <MerchPageClient 
                        initialMerchants={merchants.docs} 
                        categories={categories.docs}
                    />
                </Suspense>
            </div>
        </main>
    );
}
