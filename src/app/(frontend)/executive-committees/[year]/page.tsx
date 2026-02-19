import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import TermYearDropdown from '@/components/TermYearDropdown';
import { UserRemove01Icon } from 'hugeicons-react';

export default async function ExecutiveCommitteePage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
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

  // 2. Fetch Executive Members
  const membersQuery = await payload.find({
    collection: 'executive-committees',
    where: {
      committee: {
        equals: committee.id,
      },
    },
    limit: 100,
  });

  const members = membersQuery.docs;

  // 3. Fetch All Available Years for Dropdown
  const allCommitteesQuery = await payload.find({
    collection: 'committees',
    sort: '-year',
    limit: 100,
  });

  const availableYears = allCommitteesQuery.docs.map((c: any) => c.year);

  // 4. Sort members by Row then Position
  const sortedMembers = [...members].sort((a: any, b: any) => {
    const rowA = a.rowNumber || 99;
    const rowB = b.rowNumber || 99;
    if (rowA !== rowB) return rowA - rowB;

    const posA = a.positionNumber || 99;
    const posB = b.positionNumber || 99;
    return posA - posB;
  });

  // 5. Group by Row
  const rows: Record<number, any[]> = {};
  sortedMembers.forEach((member: any) => {
    const r = member.rowNumber || 1;
    if (!rows[r]) rows[r] = [];
    rows[r].push(member);
  });

  // Get sorted row keys
  const rowKeys = Object.keys(rows).map(Number).sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-gray-50 pt-8 pb-24">
      <div className="container">
        <Breadcrumbs />
        
        {/* Header with Dropdown */}
        {/* Header with Dropdown */}
        {/* Header with Dropdown */}
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-y-4 md:gap-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight order-1">
              Executive Committee <span className="text-[#F37C28]">{year}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-lg w-full order-2 md:order-3">
              {committee.theme || `Meet the dedicated leaders driving IEEE Young Professionals Sri Lanka forward in ${year}.`}
            </p>

            {/* Year Dropdown */}
            <TermYearDropdown 
              currentYear={year}
              availableYears={availableYears}
              basePath="executive-committees"
            />
        </div>

        {/* Dynamic Rows */}
        {members.length > 0 ? (
          <div className="space-y-12">
            {rowKeys.map((rowNum) => (
              <div key={rowNum} className={`grid grid-cols-1 md:grid-cols-${Math.min(rows[rowNum].length, 3)} lg:grid-cols-${Math.min(rows[rowNum].length, 3)} gap-10 md:gap-12 justify-center`}>
                {rows[rowNum].map((member: any) => (
                  <div 
                    key={member.id} 
                    className="relative w-full aspect-square rounded-[32px] overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                  >
                    {/* Member Photo */}
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={`${member.firstName} ${member.lastName}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    )}

                    {/* Info Card */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 group-hover:bottom-8">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                            {member.firstName} {member.lastName}
                          </h3>
                          {/* Position Tooltip/Truncate if too long, or just render */}
                          <p className="text-[#F37C28] text-xs font-bold uppercase tracking-wider">
                            {member.position}
                          </p>
                        </div>
                        
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-xl hover:bg-[#0077b5] transition-colors text-white ml-4 flex-shrink-0"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 shadow-inner mb-6">
              <UserRemove01Icon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no members listed for the <span className="font-semibold text-gray-900">Executive Committee</span> of <span className="font-semibold text-gray-900">{year}</span>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
