'use client';

import { useState } from 'react';

interface FAQSectionProps {
  faqs: any[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-white">
      <div className="container max-w-4xl px-4">
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-sm">Have Questions?</h4>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002855] tracking-tight leading-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs?.length > 0 ? faqs.map((faq, i) => (
            <div key={i} className={`border rounded-[24px] overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-[#F37C28] shadow-lg shadow-orange-50' : 'border-gray-100 hover:border-[#F37C28]/30 shadow-sm'}`}>
              <button 
                className={`w-full text-left px-5 sm:px-8 py-5 sm:py-7 flex justify-between items-center gap-4 transition-colors ${openIndex === i ? 'bg-orange-50/10' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`font-bold text-md sm:text-lg leading-tight ${openIndex === i ? 'text-[#F37C28]' : 'text-gray-900'}`}>{faq.question}</span>
                <div className={`p-2 rounded-full transition-all duration-300 ${openIndex === i ? 'bg-[#F37C28] text-white rotate-180' : 'bg-gray-100 text-gray-500'}`}>
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === i ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-8 pt-2 text-gray-600 leading-relaxed font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[32px] text-gray-400 font-medium italic">
              Questions coming soon...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
