import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/919913377965?text=Hello%20PR%20Material%20House%2C%20I%20want%20to%20know%20more%20about%20your%20products.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 z-40 group cursor-pointer"
      aria-label="Contact support on WhatsApp"
    >
      {/* Subtle Ping Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      
      <MessageCircle size={28} className="relative z-10" />
      <span className="absolute right-16 scale-0 origin-right transition-all group-hover:scale-100 bg-gray-900 text-white text-xs font-bold py-2 px-4 rounded-md shadow-md whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
