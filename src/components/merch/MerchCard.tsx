'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight01Icon } from 'hugeicons-react';

import { Merchant, MerchCategory, Media } from '@/payload-types';

interface MerchCardProps {
    merchant: Merchant;
    onRequestClick: (merchant: Merchant) => void;
}

const MerchCard: React.FC<MerchCardProps> = ({ merchant, onRequestClick }) => {
    const mainImage = (merchant.images?.[0]?.image && typeof merchant.images[0].image === 'object')
        ? (merchant.images[0].image as Media).url || '/placeholder-merch.jpg'
        : '/placeholder-merch.jpg';
        
    const categoryName = (merchant.category && typeof merchant.category === 'object')
        ? (merchant.category as MerchCategory).name 
        : 'Merchandize';

    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
            {/* Image Container Area */}
            <div className="relative aspect-video bg-[#F9FAFB] overflow-hidden flex items-center justify-center">
                {/* Available Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                        {merchant.statusTag === 'available' ? 'Available' : (merchant.statusTag || '').replace(/-/g, ' ')}
                    </div>
                </div>

                <Image 
                    src={mainImage}
                    alt={merchant.merchantName}
                    width={800}
                    height={450}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />

                {/* Pagination Dots (Visual only) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#002855]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
            </div>

            {/* Content Area */}
            <div className="px-6 py-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#002855] mb-1 leading-tight group-hover:text-[#F37C28] transition-colors duration-300">
                    {merchant.merchantName}
                </h3>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                    IEEE YP {categoryName}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-1 mb-6">
                    {merchant.description || `Official ${merchant.merchantName} - Premium quality ${categoryName} for IEEE YP SL.`}
                </p>
                
                <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-50 pt-5">
                    {/* Price Tag */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>
                        <span className="text-lg font-black text-[#002855] leading-none">
                            <span className="text-xs font-bold mr-1">LKR</span>
                            {merchant.price.toLocaleString()}
                        </span>
                    </div>
                    
                    {/* Action Button */}
                    <button 
                        onClick={() => onRequestClick(merchant)}
                        disabled={merchant.statusTag === 'out-of-stock'}
                        className={`px-5 py-2 rounded-xl border-2 font-bold text-xs transition-all duration-300 uppercase tracking-tight whitespace-nowrap flex items-center justify-center ${
                            merchant.statusTag === 'out-of-stock'
                                ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                                : 'border-[#F37C28] text-[#F37C28] hover:bg-[#F37C28] hover:text-white active:scale-95 shadow-sm hover:shadow-md'
                        }`}
                    >
                        {merchant.statusTag === 'out-of-stock' ? 'Sold Out' : 'Request to Buy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MerchCard;
