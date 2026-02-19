'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag01Icon } from 'hugeicons-react';

const MerchFloatingBadge = () => {
    return (
        <Link href="/merch" className="fixed left-0 top-[40%] -translate-y-1/2 z-50 group hidden md:block">
             {/* Badge Container - Vertical Tab */}
             <div className="flex flex-col items-center bg-[#002855] text-white rounded-r-2xl py-6 px-3 shadow-2xl hover:bg-[#F37C28] transition-all duration-300 hover:pl-5 border-2 border-l-0 border-white/20 group-hover:shadow-[0_0_20px_rgba(243,124,40,0.3)]">
                <div className="bg-white/10 p-2 rounded-full mb-4 group-hover:bg-white/20 transition-colors">
                    <ShoppingBag01Icon size={22} className="text-white" />
                </div>
                <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
                    YPSL Merch Hub
                </span>
             </div>
        </Link>
    );
};

export default MerchFloatingBadge;
