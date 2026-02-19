'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import BlogCard from './BlogCard';
import { PROJECTS } from '@/app/(payload)/access/constants';
import { FileRemoveIcon } from 'hugeicons-react';

interface BlogFilterListProps {
  initialArticles: any[];
  defaultYear?: string;
}

const BlogFilterList: React.FC<BlogFilterListProps> = ({ initialArticles, defaultYear }) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear().toString();
  const [activeProject, setActiveProject] = useState('all');
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear || currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  // Function to handle year change and navigation
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    
    // Detect if we are in events or blogs based on current path
    const basePath = pathname.includes('/events') ? '/events' : '/blogs';
    router.push(`${basePath}/${year}`);
  };

  // Extract unique years from articles
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(initialArticles.map(a => new Date(a.publishDate || a.createdAt).getFullYear())));
    // Ensure current year is included
    if (!uniqueYears.includes(parseInt(currentYear))) {
        uniqueYears.push(parseInt(currentYear));
    }
    return uniqueYears.sort((a, b) => b - a);
  }, [initialArticles, currentYear]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    let articles = initialArticles;

    // 1. Filter by Project
    if (activeProject !== 'all') {
      articles = articles.filter((article) => article.project === activeProject);
    }

    // 2. Filter by Year
    if (selectedYear !== 'all') {
        articles = articles.filter((article) => new Date(article.publishDate || article.createdAt).getFullYear().toString() === selectedYear);
    }
    
    // Sort descending by date
    articles.sort((a, b) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime());

    return articles;
  }, [initialArticles, activeProject, selectedYear]);

  return (
    <div className="space-y-12">
      {/* Header Section with Dropdown */}
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-y-4 md:gap-y-6">
           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight order-1">
               Latest <span className="text-[#F37C28]">Articles</span>
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-lg w-full order-2 md:order-3">
                Discover insights, news, and technical articles from our community of young professionals.
            </p>

            {/* Year Dropdown */}
            <div className="relative group min-w-[140px] md:min-w-[200px] flex-shrink-0 z-20 order-3 md:order-2 self-start md:self-auto">
              <button 
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                onBlur={() => setTimeout(() => setIsYearDropdownOpen(false), 200)}
                className="w-full flex items-center justify-between px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-[#002855] hover:border-[#F37C28] transition-colors shadow-sm text-sm md:text-base"
              >
                <span>{selectedYear === 'all' ? 'All Years' : `Year ${selectedYear}`}</span>
                <svg className={`w-4 h-4 md:w-5 md:h-5 ml-2 text-gray-400 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isYearDropdownOpen && (
                  <div className="absolute right-0 md:right-0 left-0 md:left-auto top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                    {years.map((y) => (
                      <button 
                        key={y} 
                        onClick={() => handleYearChange(y.toString())}
                        className={`block w-full text-left px-4 py-2 md:px-6 md:py-3 text-sm font-bold hover:bg-gray-50 transition-colors ${selectedYear === y.toString() ? 'text-[#F37C28] bg-orange-50' : 'text-gray-700'}`}
                      >
                        Year {y}
                      </button>
                    ))}
                  </div>
              )}
            </div>
      </div>

      {/* Project Tabs */}
      <div className="flex justify-center flex-wrap gap-3">
        {/* 'All' Tab */}
        <button
          onClick={() => setActiveProject('all')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
            activeProject === 'all'
              ? 'bg-[#F37C28] text-white border-[#F37C28]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          All Blogs
        </button>

        {/* Project Specific Tabs */}
        {PROJECTS.map((project) => (
          <button
            key={project.value}
            onClick={() => setActiveProject(project.value)}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-sm font-semibold transition-all duration-300 border ${
              activeProject === project.value
                ? 'bg-[#F37C28] text-white border-[#F37C28]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {project.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredArticles.map((article) => (
            <BlogCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6">
            <FileRemoveIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are currently no articles listed under the <span className="font-semibold text-gray-900">
                {activeProject === 'all' ? 'All Blogs' : PROJECTS.find(p => p.value === activeProject)?.label}
            </span> category in <span className="font-semibold text-gray-900">{selectedYear === 'all' ? 'any year' : selectedYear}</span>.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogFilterList;
