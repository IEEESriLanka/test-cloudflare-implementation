'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS } from '@/app/(payload)/access/constants';

interface BlogCardProps {
  article: any;
}

const BlogCard: React.FC<BlogCardProps> = ({ article }) => {
  const publishDate = new Date(article.publishDate || new Date());
  const formattedDate = publishDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const author = article.author;
  const authorName = (author && typeof author === 'object') ? author.name : 'IEEE YPSL';
  const authorRole = (author && typeof author === 'object') ? author.role : 'Member';
  const authorPhoto = (author && typeof author === 'object' && author.photo && typeof author.photo === 'object' && 'url' in author.photo) ? author.photo.url : null;
  const projectLabel = PROJECTS.find(p => p.value === article.project)?.label || 'YP Sri Lanka';

  // Extract preview text from richText content
  const getPreviewText = (richText: any) => {
    if (!richText || !richText.root || !richText.root.children) return '';
    
    let text = '';
    const extractText = (nodes: any[]) => {
      nodes.forEach((node: any) => {
        if (node.text) text += node.text;
        if (node.children) extractText(node.children);
      });
    };
    
    extractText(richText.root.children);
    return text;
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full group">
      {/* Featured Image */}
      <div className="p-4 pb-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
          {article.featuredImage && typeof article.featuredImage === 'object' && 'url' in article.featuredImage && (
            <Image
              src={article.featuredImage.url as string}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          )}
          {/* Project Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#F37C28] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              {projectLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pt-5 md:pt-6 flex flex-col flex-grow">
        {/* Date */}
        <div className="flex items-center gap-2 mb-3 md:mb-4 text-[#F37C28]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 text-gray-900 line-clamp-2 leading-tight group-hover:text-[#F37C28] transition-colors duration-300">
          {article.title}
        </h3>

        {/* Excerpt - Auto-generated from content */}
        <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">
          {getPreviewText(article.content) || "IEEE Young Professionals Sri Lanka provides the tools and network to excel in your technical career."}
        </p>

        {/* Footer: Author & Button */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {authorPhoto ? (
                <Image
                  src={authorPhoto}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                  {authorName.substring(0, 1)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="block font-bold text-gray-900 text-sm truncate">{authorName}</span>
              <span className="block text-xs text-gray-400 truncate">{authorRole}</span>
            </div>
          </div>

          <Link 
            href={`/blogs/${publishDate.getFullYear()}/${article.slug?.replace(/\s+/g, '-')}`}
            className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 font-bold text-xs hover:border-[#F37C28] hover:bg-[#F37C28] hover:text-white transition-all duration-300 whitespace-nowrap"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
