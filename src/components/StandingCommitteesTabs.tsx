'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserRemove01Icon } from 'hugeicons-react';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  pillar: string;
  position: string;
  category: string;
  photo?: { url: string } | null;
}

interface StandingCommitteesTabsProps {
  members: Member[];
}

const PILLARS = [
  { label: 'Program Management', value: 'program-management' },
  { label: 'Finance & Partnership', value: 'finance-partnership' },
  { label: 'People Management', value: 'people-management' },
  { label: 'Public Visibility', value: 'public-visibility' },
];

const CATEGORY_ORDER: Record<string, string[]> = {
  'program-management': ['program-management', 'event-management'],
  'finance-partnership': ['finance-partnership', 'industry-engagements', 'collaboration'],
  'people-management': [
    'people-management',
    'volunteer-engagement',
    'volunteer-training-and-development',
    'volunteer-training', // Legacy
    'membership-development',
    'member-benefits-and-opportunities',
    'member-benefits', // Legacy
  ],
  'public-visibility': [
    'marketing-and-communication', 
    'marketing-committee', // Legacy
    'editorial', 
    'environmental-social-governance', 
    'esg' // Legacy
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  'program-management': 'Program Management',
  'event-management': 'Event Management',
  'finance-partnership': 'Finance and Partnership',
  'industry-engagements': 'Industry Engagements',
  'collaboration': 'Collaboration',
  'people-management': 'People Management',
  'volunteer-engagement': 'Volunteer Engagement',
  'volunteer-training-and-development': 'Volunteer Training and Development',
  'volunteer-training': 'Volunteer Training and Development',
  'membership-development': 'Membership Development',
  'member-benefits-and-opportunities': 'Member Benefits and Opportunities',
  'member-benefits': 'Member Benefits and Opportunities',
  'marketing-and-communication': 'Marketing and Communication',
  'marketing-committee': 'Marketing and Communication',
  'editorial': 'Editorial',
  'environmental-social-governance': 'Environmental Social Governance',
  'environmental-social-and-governance': 'Environmental Social Governance',
  'esg': 'Environmental Social Governance',
};

export default function StandingCommitteesTabs({ members }: StandingCommitteesTabsProps) {
  const [activePillar, setActivePillar] = useState('program-management');

  // Filter members by active pillar
  const filteredMembers = members.filter((m) => m.pillar === activePillar);

  // Sort members: Chairs first, then by the specific category order for that pillar
  const sortedMembers = filteredMembers.sort((a, b) => {
    // 1. Position: Chairs before Members
    if (a.position === 'chair' && b.position !== 'chair') return -1;
    if (a.position !== 'chair' && b.position === 'chair') return 1;

    // 2. Category: Based on CATEGORY_ORDER for the active pillar
    const order = CATEGORY_ORDER[activePillar] || [];
    const indexA = order.indexOf(a.category);
    const indexB = order.indexOf(b.category);

    if (indexA !== -1 && indexB !== -1) {
      if (indexA !== indexB) {
        return indexA - indexB;
      }
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    }

    // 3. Fallback: Sort by Name
    return a.fullName.localeCompare(b.fullName);
  });

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {PILLARS.map((pillar) => (
          <button
            key={pillar.value}
            onClick={() => setActivePillar(pillar.value)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ${
              activePillar === pillar.value
                ? 'bg-[#F37C28] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            {pillar.label}
          </button>
        ))}
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {sortedMembers.length > 0 ? (
          sortedMembers.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 text-center sm:text-left"
            >
              {/* Photo */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
                {member.photo?.url ? (
                  <Image
                    src={member.photo.url}
                    alt={member.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.fullName}
                </h3>
                <p className="text-sm font-semibold text-[#F37C28] uppercase tracking-wide">
                  {member.position === 'chair' ? 'Chair' : 'Member'} - {CATEGORY_LABELS[member.category] || member.category.replace(/-/g, ' ')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 shadow-inner mb-6">
              <UserRemove01Icon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no members listed under the <span className="font-semibold text-gray-900">{PILLARS.find(p => p.value === activePillar)?.label}</span> pillar for this term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
