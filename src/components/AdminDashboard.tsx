import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

import Link from 'next/link';

export const AdminDashboard: React.FC = async () => {
  const payload = await getPayload({ config: configPromise });
  
  const eventsCount = await payload.count({
    collection: 'events',
  });

  const articlesCount = await payload.count({
    collection: 'articles',
  });

  const usersCount = await payload.count({
    collection: 'users',
  });

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400">Welcome to IEEE YPSL Management System</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Total Events</h3>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{eventsCount.totalDocs}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Articles Published</h3>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{articlesCount.totalDocs}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-gray-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">Total Users</h3>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{usersCount.totalDocs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-black mb-6 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/collections/events/create" className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 group">
              <span className="block font-bold dark:text-slate-200">New Event</span>
              <span className="text-xs text-gray-400 dark:text-slate-500 group-hover:text-orange-400">Add a program or workshop</span>
            </Link>
            <Link href="/admin/collections/articles/create" className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 group">
              <span className="block font-bold dark:text-slate-200">New Article</span>
              <span className="text-xs text-gray-400 dark:text-slate-500 group-hover:text-blue-400">Write a blog post</span>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-black mb-6 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-400 dark:text-slate-500 italic">No recent activities to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
