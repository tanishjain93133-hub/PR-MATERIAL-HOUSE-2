import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import dbFallback from '../utils/db_fallback.json';

const defaultBrands = [
  { _id: 'mock-b1', name: 'UltraTech Cement' },
  { _id: 'mock-b2', name: 'Ambuja Cement' },
  { _id: 'mock-b3', name: 'Hathi Cement' }
];

const mockBrands = dbFallback.brands && dbFallback.brands.length > 0 ? dbFallback.brands : defaultBrands;

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        if (res.data && res.data.length > 0) {
          setBrands(res.data);
        } else {
          setBrands(mockBrands);
        }
      } catch (err) {
        setBrands(mockBrands);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="pt-24 w-full">
      {/* Page Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Our Partners</span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-2">
            Authorized Material Distributors
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs mt-3">
            We partner with the industry's most reliable and highly certified manufacturing giants to guarantee structural stability.
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-50 border border-gray-100 shimmer" />
              ))}
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/products?brand=${brand._id}`}
                  className="group p-8 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-center hover:bg-white hover:border-orange-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Brand Logo/Badge */}
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-heading font-extrabold text-2xl tracking-tighter shadow-sm mb-4 border border-orange-100 group-hover:scale-105 transition-all">
                    {brand.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-heading font-bold text-base text-gray-900 group-hover:text-orange-500 transition-colors">
                    {brand.name}
                  </h3>
                  
                  {brand.website && (
                    <span className="text-[10px] text-gray-400 mt-1 block truncate max-w-[150px]">
                      {brand.website.replace('https://', '').replace('www.', '')}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Catalog
                    <ArrowRight size={10} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <Award size={36} className="mx-auto text-gray-300 mb-3" />
              <h3 className="font-heading font-bold text-lg text-gray-800">No Brands Available</h3>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Brands;
