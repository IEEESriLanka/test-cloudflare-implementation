'use client';

import React, { useState, useMemo } from 'react';
import MerchCard from '@/components/merch/MerchCard';
import RequestMerchModal from '@/components/merch/RequestMerchModal';
import { ShoppingBag01Icon } from 'hugeicons-react';

interface MerchPageClientProps {
    initialMerchants: any[];
    categories: any[];
}

const MerchPageClient: React.FC<MerchPageClientProps> = ({ initialMerchants, categories }) => {
    const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const handleRequestClick = (merchant: any) => {
        setSelectedMerchant(merchant);
        setIsModalOpen(true);
    };

    const filters = useMemo(() => {
        const dynamicFilters = categories.map(cat => ({
            label: cat.name,
            value: cat.slug
        }));
        return [{ label: 'All Items', value: 'all' }, ...dynamicFilters];
    }, [categories]);

    const filteredMerchants = useMemo(() => {
        if (activeFilter === 'all') return initialMerchants;
        return initialMerchants.filter(m => {
            const cat = m.category;
            if (!cat) return false;
            // Handle both object and ID (though depth 2 should be object)
            const catSlug = typeof cat === 'object' ? cat.slug : cat;
            return catSlug === activeFilter;
        });
    }, [activeFilter, initialMerchants]);

    return (
        <>
            {/* Filter Tabs */}
            <div className="flex justify-center flex-wrap gap-3 mb-12">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-[12px] sm:text-sm font-semibold transition-all duration-300 border ${
                            activeFilter === filter.value
                                ? 'bg-[#F37C28] text-white border-[#F37C28]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredMerchants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {filteredMerchants.map((merchant) => (
                        <MerchCard 
                            key={merchant.id} 
                            merchant={merchant} 
                            onRequestClick={handleRequestClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-sm animate-in zoom-in-95 duration-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 text-gray-300">
                        <ShoppingBag01Icon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        We don't have any items in this category right now. Try selecting another filter!
                    </p>
                </div>
            )}

            {/* Modal */}
            <RequestMerchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedMerchant={selectedMerchant}
            />
        </>
    );
};

export default MerchPageClient;
