import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '../utils/api';

const Lightbox = ({ item, onClose, onPrev, onNext }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
        aria-label="Close Lightbox"
      >
        <X size={24} />
      </button>

      {/* Navigation Arrow Left */}
      <button 
        onClick={onPrev}
        className="absolute left-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
        aria-label="Previous Image"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Main Image/Video Container */}
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center gap-4">
        {item.type === 'video' ? (
          <video
            src={resolveImageUrl(item.image)}
            controls
            autoPlay
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl animate-fade-in"
          />
        ) : (
          <img 
            src={resolveImageUrl(item.image)}
            alt={item.title} 
            onError={(e) => { e.target.src = '/cement.jpg'; }}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl animate-fade-in"
          />
        )}
        <div className="text-center text-white">
          <h3 className="font-heading font-bold text-lg md:text-xl">{item.title}</h3>
          <span className="text-xs text-orange-500 font-semibold tracking-widest uppercase mt-1 inline-block">
            {item.category}
          </span>
        </div>
      </div>

      {/* Navigation Arrow Right */}
      <button 
        onClick={onNext}
        className="absolute right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
        aria-label="Next Image"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default Lightbox;
