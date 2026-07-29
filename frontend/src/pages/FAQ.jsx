import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "What is the minimum order quantity for bulk cement supply?",
      a: "For B2B wholesale prices, our standard minimum order quantity is 100 bags (OPC/PPC) or 5 tons for loose bulk deliveries. Smaller quantities are available at standard showroom rates."
    },
    {
      q: "Do you supply material test reports and certification sheets?",
      a: "Yes, we supply complete Manufacturer Test Certificates (MTC), lab test results, and ISO compliance datasheets for all cement batches, TMT steel shipments, and specialized waterproofing chemicals on request."
    },
    {
      q: "What is your standard B2B logistics delivery timeline?",
      a: "For items in stock (such as cement and standard plumbing materials), we deliver within 24 hours of order confirmation. For custom CP fittings or niche construction chemicals, delivery timelines range from 2 to 5 business days."
    },
    {
      q: "How can I request a customized project quotation?",
      a: "You can click 'Request Quote' on any product page, fill out the contact form on our website, or launch WhatsApp support to connect with a logistics specialist directly. We process and return all quotes within 2 business hours."
    },
    {
      q: "Do you offer credit facilities for construction contractors?",
      a: "Yes, we support commercial credit channels for registered builders and developers. Credit eligibility is subject to commercial validation checks and trade references."
    }
  ];

  return (
    <div className="pt-24 w-full">
      {/* Page Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Help Desk</span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-2">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs mt-3">
            Find quick answers regarding material specifications, site deliveries, B2B procurement, and payment channels.
          </p>
        </div>
      </section>

      {/* Accordions */}
      <section className="py-20 bg-white max-w-3xl mx-auto px-6">
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-150 rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-xs transition-shadow"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-semibold text-sm sm:text-base text-gray-800 focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-orange-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} 
                  />
                </button>

                {/* Transition Content */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal text-left">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
