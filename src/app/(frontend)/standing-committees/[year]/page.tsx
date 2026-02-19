import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StandingCommitteesTabs from '@/components/StandingCommitteesTabs';

import Breadcrumbs from '@/components/Breadcrumbs';
import TermYearDropdown from '@/components/TermYearDropdown';

export default async function StandingCommitteePage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  
  // Standing Committees only exist from 2024 onwards
  if (parseInt(year) < 2024) {
    notFound();
  }

  const payload = await getPayload({ config: configPromise });

  // 1. Fetch the Committee Document
  const committeeQuery = await payload.find({
    collection: 'committees',
    where: {
      year: {
        equals: year,
      },
    },
    limit: 1,
  });

  if (committeeQuery.totalDocs === 0) {
    notFound();
  }

  const committee = committeeQuery.docs[0];

  // 2. Fetch Standing Committee Members (Sub-Committees)
  const membersQuery = await payload.find({
    collection: 'sub-committees',
    where: {
      committee: {
        equals: committee.id,
      },
    },
    limit: 200,
  });

  const members = membersQuery.docs;

  // 3. Fetch Available Years (>= 2024)
  const allCommitteesQuery = await payload.find({
    collection: 'committees',
    sort: '-year',
    limit: 100,
  });

  const availableYears = allCommitteesQuery.docs
    .map((c: any) => c.year)
    .filter((y: string) => parseInt(y) >= 2024);

  return (
    <main className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="container">
        <Breadcrumbs />
        
        {/* Header with Dropdown */}
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-y-4 md:gap-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight order-1">
              Standing Committees <span className="text-[#F37C28]">{year}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-lg w-full order-2 md:order-3">
              {committee.theme || `Meet the dedicated standing committee members supporting IEEE Young Professionals Sri Lanka in ${year}.`}
            </p>

            {/* Year Dropdown */}
            <TermYearDropdown 
              currentYear={year}
              availableYears={availableYears}
              basePath="standing-committees"
            />
        </div>

        {/* Tabs Component */}
        <StandingCommitteesTabs members={members as any} />
      </div>
    </main>
  );
}
