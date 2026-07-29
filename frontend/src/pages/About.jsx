import React, { useState, useEffect } from 'react';
import { Target, Compass, Eye, ShieldCheck, HelpCircle } from 'lucide-react';
import api, { resolveImageUrl } from '../utils/api';
import dbFallback from '../utils/db_fallback.json';

const About = () => {
  const [homepageData, setHomepageData] = useState({
    aboutTitle: 'Sourcing the foundations of modern architecture',
    aboutSubtitle: 'Company Bio',
    aboutText: 'PR Material House has grown from a local supplier to a premier B2B distributor of industrial cement, structural hardware, designer sanitary fittings, and high-performance concrete chemicals.',
    aboutImage: '',
    stats: [
      { value: '15+', label: 'Years Experience' },
      { value: '500+', label: 'Projects Supplied' },
      { value: '12+', label: 'Premium Brands' },
      { value: '10K+', label: 'Tons Cement Supplied' }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await api.get('/settings/homepage');
        if (res.data) {
          setHomepageData(prev => ({
            ...prev,
            ...res.data,
            stats: res.data.stats && res.data.stats.length > 0 ? res.data.stats : prev.stats
          }));
        }
      } catch (err) {
        console.warn('Fallback loading for about page');
        if (dbFallback.homepages && dbFallback.homepages[0]) {
          setHomepageData(dbFallback.homepages[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const values = [
    { title: 'Quality First', desc: 'We source only tested, certified building materials that exceed standard safety expectations.', icon: ShieldCheck },
    { title: 'Customer Trust', desc: 'Honest pricing and reliable site schedules build long-term B2B partnerships.', icon: Target },
    { title: 'Logistics Precision', desc: 'Our dedicated fleet ensures prompt deliveries directly to active sites, on time.', icon: Compass }
  ];

  return (
    <div className="pt-24 w-full">
      {/* Page Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">
            {homepageData.aboutSubtitle || 'Company Bio'}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-2">
            Pioneering Building Material Supply
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <h2 className="font-heading font-extrabold text-3xl text-gray-900 leading-tight">
              {homepageData.aboutTitle || 'Sourcing the foundations of modern architecture'}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {homepageData.aboutText}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {homepageData.aboutImage && (
              <div className="w-full h-56 rounded-xl overflow-hidden shadow-md border border-gray-150 bg-gray-50">
                <img 
                  src={resolveImageUrl(homepageData.aboutImage)} 
                  alt="PR Material House Biography" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {homepageData.stats.map((stat, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-orange-500 mb-2">{stat.value}</h3>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl bg-white border border-gray-150 flex flex-col gap-4 text-left shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Target size={20} />
            </div>
            <h3 className="font-heading font-bold text-xl text-gray-900">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To empower infrastructure developers by delivering standard-setting construction materials with absolute transparency, competitive pricing structures, and efficient fleet support.
            </p>
          </div>

          <div className="p-8 rounded-xl bg-white border border-gray-150 flex flex-col gap-4 text-left shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <Eye size={20} />
            </div>
            <h3 className="font-heading font-bold text-xl text-gray-900">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To become the first-choice digital material showroom in the region, bridging the gap between global manufacturers and local structural contractors via advanced web cataloging.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Company Principles</span>
          <h2 className="font-heading font-extrabold text-3xl text-gray-900 mt-2 mb-16">The Values We Stand By</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-3">{val.title}</h3>
                  <p className="text-xs text-gray-650 leading-relaxed max-w-xs">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
