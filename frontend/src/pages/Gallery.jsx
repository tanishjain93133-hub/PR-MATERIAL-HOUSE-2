import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, SlidersHorizontal, Play } from 'lucide-react';
import api, { resolveImageUrl } from '../utils/api';
import Lightbox from '../components/Lightbox';
import dbFallback from '../utils/db_fallback.json';

const mockGallery = dbFallback.galleries || [];

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState(['All Projects']);
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [activeIdx, setActiveIdx] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data && res.data.length > 0) {
          setGalleryItems(res.data);
          const uniq = ['All Projects', ...new Set(res.data.map(item => item.category))];
          setCategories(uniq);
        } else {
          setGalleryItems(mockGallery);
          const uniq = ['All Projects', ...new Set(mockGallery.map(item => item.category))];
          setCategories(uniq);
        }
      } catch (err) {
        setGalleryItems(mockGallery);
        const uniq = ['All Projects', ...new Set(mockGallery.map(item => item.category))];
        setCategories(uniq);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All Projects'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const handlePrev = () => {
    setActiveIdx(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-24 w-full">
      {/* Page Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Portfolio</span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-2">
            Project Deliveries &amp; Materials Gallery
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs mt-3">
            Explore images of site foundation pours, luxury bathroom installations, and bulk materials supplied across standard architectures.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white max-w-7xl mx-auto px-6 border-b border-gray-50 text-left">
        <div className="flex gap-2 flex-wrap items-center">
          <SlidersHorizontal size={14} className="text-gray-400 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setActiveIdx(null); }}
              className={`text-2xs font-extrabold uppercase tracking-widest py-2.5 px-5 rounded-md border transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Portfolio */}
      <section className="py-16 bg-white max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-gray-50 border border-gray-100 shimmer" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <button
                key={item._id}
                onClick={() => setActiveIdx(idx)}
                className="group flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all hover:-translate-y-1 text-left w-full focus:outline-none cursor-zoom-in"
              >
                <div className="h-56 overflow-hidden relative bg-gray-200 w-full flex items-center justify-center">
                  {item.type === 'video' ? (
                    <>
                      <video
                        src={resolveImageUrl(item.image)}
                        className="w-full h-full object-cover transition-transform duration-505 group-hover:scale-103"
                        preload="metadata"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-all">
                          <Play size={16} className="fill-white ml-0.5" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img 
                      src={resolveImageUrl(item.image)}
                      alt={item.title} 
                      onError={(e) => { e.target.src = '/cement.jpg'; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h4 className="font-heading font-bold text-sm text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mt-2 block">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <ImageIcon size={36} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-heading font-bold text-lg text-gray-800">Gallery Empty</h3>
            <p className="text-xs text-gray-500 mt-1">No images uploaded under this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox Trigger */}
      {activeIdx !== null && filteredItems[activeIdx] && (
        <Lightbox
          item={filteredItems[activeIdx]}
          onClose={() => setActiveIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default Gallery;
