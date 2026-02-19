import './globals.css';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IEEE Young Professionals Sri Lanka',
  description: 'The official website of IEEE Young Professionals Sri Lanka (YPSL). Empowering young engineers and professionals across the island.',
  openGraph: {
    title: 'IEEE Young Professionals Sri Lanka',
    description: 'Empowering young engineers and professionals across the island.',
    url: 'https://ieeeyp.lk',
    siteName: 'IEEE YPSL',
    images: [
      {
        url: '/media/IEEE-YP-SL-Logo.png',
        width: 1200,
        height: 630,
        alt: 'IEEE YPSL Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IEEE Young Professionals Sri Lanka',
    description: 'Empowering young engineers and professionals across the island.',
    images: ['/media/IEEE-YP-SL-Logo.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: configPromise });

  // 1. Fetch all Committees (Years)
  const committeesQuery = await payload.find({
    collection: 'committees',
    sort: '-year',
    limit: 50,
  });

  const years = committeesQuery.docs;

  // 2. Identify which years have Executive/Standing members
  // We'll run parallel checks
  const yearChecks = await Promise.all(
    years.map(async (committee) => {
      const [exCount, subCount] = await Promise.all([
        payload.count({
          collection: 'executive-committees',
          where: { committee: { equals: committee.id } },
        }),
        payload.count({
          collection: 'sub-committees',
          where: { committee: { equals: committee.id } },
        }),
      ]);

      return {
        year: committee.year as string,
        active: committee.active as boolean,
        hasExecutive: exCount.totalDocs > 0,
        hasStanding: subCount.totalDocs > 0,
      };
    })
  );

  const executiveYears = yearChecks
    .filter(y => y.hasExecutive || y.active)
    .map(y => y.year);
    
  const standingYears = yearChecks
    .filter(y => (y.hasStanding || y.active) && parseInt(y.year) >= 2024)
    .map(y => y.year);

  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        <Preloader />
        <Navbar executiveYears={executiveYears} standingYears={standingYears} />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}