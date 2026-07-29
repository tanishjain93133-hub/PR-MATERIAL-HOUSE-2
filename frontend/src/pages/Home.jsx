import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Award, TrendingUp, Truck, Users, Settings2, Star, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import api, { resolveImageUrl } from '../utils/api';
import InteractiveCategorySlider from '../components/InteractiveCategorySlider';
import dbFallback from '../utils/db_fallback.json';

const defaultCategories = [
  {
    _id: 'mock-1',
    name: 'Cement & Putty',
    image: '/cement.jpg',
    description: 'Premium grade OPC & PPC cements for foundation and structural strength.'
  },
  {
    _id: 'mock-2',
    name: 'Hardware & Tools',
    image: '/hardware.jpg',
    description: 'High-durability mechanical fixtures, fasteners, and manual power tools.'
  },
  {
    _id: 'mock-3',
    name: 'CP Fittings & Bath',
    image: '/cp_fittings.jpg',
    description: 'Elegant bath fixtures, chrome plated brass fittings, and sanitary ware.'
  },
  {
    _id: 'mock-4',
    name: 'Construction Chemicals',
    image: '/chemicals.jpg',
    description: 'Advanced waterproofing compounds, plasticizers, and structural sealants.'
  }
];

const defaultBrands = [
  {
    _id: 'mock-b1',
    name: 'UltraTech Cement',
    logo: '/products/cement/ultratech/front.png',
    description: 'The Engineer\'s Choice'
  },
  {
    _id: 'mock-b2',
    name: 'Ambuja Cement',
    logo: '/products/cement/ambuja/front.png',
    description: 'Giant Compressive Strength'
  },
  {
    _id: 'mock-b3',
    name: 'Hathi Cement',
    logo: '/products/cement/hathi/front.png',
    description: 'Trusted Building Material'
  }
];

const defaultTestimonials = [
  {
    _id: 'mock-t1',
    name: 'Rajesh Patel',
    role: 'Lead Architect',
    text: 'PR Material House consistently delivers top-tier building supplies. Highly professional service and authentic products.',
    rating: 5
  },
  {
    _id: 'mock-t2',
    name: 'Amit Shah',
    role: 'Structural Engineer',
    text: 'The quality of their cement and structural chemicals is unmatched. Essential supply partner for our major projects.',
    rating: 5
  }
];

const defaultWhyChooseUs = [
  { title: 'Premium Quality', desc: 'Every batch undergoes rigorous quality validation checkups.', iconName: 'ShieldCheck' },
  { title: 'Trusted Brands', desc: 'Official authorized supply pipeline for market leaders.', iconName: 'Award' },
  { title: 'Competitive Rates', desc: 'Highly affordable B2B wholesale pricing strategies.', iconName: 'TrendingUp' }
];

const defaultStats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Projects Supplied' },
  { value: '12+', label: 'Premium Brands' },
  { value: '10K+', label: 'Tons Cement Supplied' }
];

const mockCategories = dbFallback.categories && dbFallback.categories.length > 0 ? dbFallback.categories : defaultCategories;
const mockBrands = dbFallback.brands && dbFallback.brands.length > 0 ? dbFallback.brands : defaultBrands;
const mockTestimonials = dbFallback.testimonials && dbFallback.testimonials.length > 0 ? dbFallback.testimonials : defaultTestimonials;

const DynamicIcon = ({ name, size = 22, className }) => {
  const IconComponent = Icons[name] || HelpCircle;
  return <IconComponent size={size} className={className} />;
};

const Home = () => {
  const [homepageData, setHomepageData] = useState({
    heroTitle: 'Everything You Need to Build Stronger & Better',
    heroSubtitle: 'Premium Cement, Hardware, CP Fittings & Construction Chemicals for Every Project.',
    heroTagline: 'Your Trusted Partner for Quality Building Materials',
    heroBgType: 'color',
    heroBgColor: '#F9FAFB',
    heroBgUrl: '',
    heroVideoUrl: '',
    heroImage: '',
    heroBtnText: 'Explore Products',
    heroBtnLink: '/products',
    heroSecBtnText: 'Get a Quote',
    heroSecBtnLink: '/contact',
    heroAnimation: 'fade',
    aboutTitle: 'PR Material House',
    aboutSubtitle: 'Official Wholesale Distributors',
    aboutText: 'PR Material House supplies premium quality cement, hardware, CP fittings, construction chemicals, TMT steel, and other building materials.',
    aboutImage: '',
    ctaTitle: 'Ready to Source Premium Materials?',
    ctaSubtitle: 'Connect with our logistics and specifications desk today to receive customized wholesale quotes.',
    ctaBtnText: 'Get a Customized Quote',
    ctaBtnLink: '/contact',
    ctaBgImage: '',
    whyChooseUs: defaultWhyChooseUs,
    stats: defaultStats
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch homepage texts
        try {
          const homeRes = await api.get('/settings/homepage');
          if (homeRes.data) {
            setHomepageData(prev => ({
              ...prev,
              ...homeRes.data,
              whyChooseUs: homeRes.data.whyChooseUs && homeRes.data.whyChooseUs.length > 0 ? homeRes.data.whyChooseUs : defaultWhyChooseUs,
              stats: homeRes.data.stats && homeRes.data.stats.length > 0 ? homeRes.data.stats : defaultStats
            }));
          }
        } catch (e) {
          if (dbFallback.homepages && dbFallback.homepages[0]) {
            setHomepageData(dbFallback.homepages[0]);
          }
        }

        // Fetch categories
        try {
          const catRes = await api.get('/categories');
          if (catRes.data && catRes.data.length > 0) {
            setCategories(catRes.data);
          } else {
            setCategories(mockCategories);
          }
        } catch (e) {
          setCategories(mockCategories);
        }

        // Fetch brands
        try {
          const brandRes = await api.get('/brands');
          if (brandRes.data && brandRes.data.length > 0) {
            setBrands(brandRes.data);
          } else {
            setBrands(mockBrands);
          }
        } catch (e) {
          setBrands(mockBrands);
        }

        // Fetch testimonials
        try {
          const testRes = await api.get('/testimonials');
          if (testRes.data && testRes.data.length > 0) {
            setTestimonials(testRes.data);
          } else {
            setTestimonials(mockTestimonials);
          }
        } catch (e) {
          setTestimonials(mockTestimonials);
        }
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter hidden elements out
  const visibleCategories = categories.filter(c => !c.hide);
  const visibleTestimonials = testimonials.filter(t => !t.hide);

  const isDarkHero = homepageData.heroBgType === 'image' || homepageData.heroBgType === 'video';

  const base = api.defaults.baseURL || '';

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden transition-all duration-500"
        style={homepageData.heroBgType === 'color' ? { backgroundColor: homepageData.heroBgColor } : {}}
      >
        {/* If image background */}
        {homepageData.heroBgType === 'image' && (homepageData.heroBgUrl || homepageData.heroImage) && (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${resolveImageUrl(homepageData.heroBgUrl || homepageData.heroImage)})` }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
        )}

        {/* If video background */}
        {homepageData.heroBgType === 'video' && homepageData.heroVideoUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              src={homepageData.heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>
        )}

        {/* Abstract Blur Canvas (solid background fallback only) */}
        {homepageData.heroBgType === 'color' && (
          <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl animate-pulse duration-10000" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-250 rounded-full filter blur-3xl" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full py-12">
          {/* Left Text */}
          <div className="flex flex-col gap-6 text-left">
            <span className={`text-xs uppercase font-extrabold tracking-widest px-3 py-1.5 rounded-md self-start border ${
              isDarkHero 
                ? 'bg-white/10 text-orange-400 border-orange-500/25' 
                : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {homepageData.heroTagline}
            </span>
            <h1 className={`font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight ${
              isDarkHero ? 'text-white' : 'text-gray-900'
            }`}>
              {(homepageData.heroTitle || '').split('&').map((text, i) => (
                <span key={i}>
                  {text}
                  {i === 0 && <span className="text-orange-500 font-medium"> &amp; </span>}
                </span>
              ))}
            </h1>
            <p className={`text-lg max-w-xl font-normal leading-relaxed ${
              isDarkHero ? 'text-gray-200' : 'text-gray-600'
            }`}>
              {homepageData.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to={homepageData.heroBtnLink || '/products'}
                className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/15"
              >
                {homepageData.heroBtnText || 'Explore Products'}
                <ArrowRight size={16} />
              </Link>
              <Link
                to={homepageData.heroSecBtnLink || '/contact'}
                className={`btn font-bold py-4 px-8 rounded-md transition-all flex items-center justify-center ${
                  isDarkHero 
                    ? 'border border-white/20 hover:bg-white hover:text-black text-white' 
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {homepageData.heroSecBtnText || 'Get a Quote'}
              </Link>
            </div>
          </div>

          {/* Right Image Graphic Showcase */}
          <div className="relative flex justify-center items-center">
            <div className="w-full max-w-[480px] h-[340px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl relative border-4 border-white bg-gray-100">
              <img 
                src={resolveImageUrl(homepageData.heroImage || '/cement.jpg')} 
                alt="PR Material House Showcase" 
                className="w-full h-full object-cover transition-transform duration-10000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Quality Verified</span>
                <h3 className="font-heading font-bold text-xl">{homepageData.heroTagline || 'Industrial Cement & Steel'}</h3>
              </div>
            </div>
            
            {/* Float Cards */}
            <div className="hidden sm:flex absolute -left-12 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-gray-100 shadow-xl items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">✓</div>
              <div className="text-left text-xs">
                <h4 className="font-bold text-gray-800">ISO 9001:2015</h4>
                <p className="text-gray-500">Certified Grade Materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Interactive Category Slider Section */}
      <InteractiveCategorySlider categories={visibleCategories} />

      {/* Category Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Product Categories</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">Our Premium Material Lineup</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-16 text-sm">Click on any category below to filter products and review specifications.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className="group flex flex-col bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1.5"
                >
                  <div className="h-48 overflow-hidden relative bg-gray-200">
                    <img 
                      src={resolveImageUrl(cat.image)} 
                      alt={cat.name} 
                      onError={(e) => { e.target.src = '/cement.jpg'; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
                  </div>
                  <div className="p-6 text-left flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {cat.description || 'Premium-grade material formulations for long-lasting structural durability.'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-600 mt-4 group-hover:gap-2 transition-all">
                      Explore Lineup
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Shimmer placeholders if loading
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shimmer" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-900 text-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-400">Core Strengths</span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl mt-2 mb-4 text-white">Why Partners Choose PR Material House</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">We maintain standard-setting supply processes to keep high-value infrastructure projects moving.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageData.whyChooseUs.map((item, idx) => (
              <div 
                key={idx}
                className="p-8 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/35 hover:bg-white/10 transition-all duration-300 group text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
                  <DynamicIcon name={item.iconName} size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section (Dynamic Strip) */}
      {homepageData.stats && homepageData.stats.length > 0 && (
        <section className="bg-orange-500 py-12 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {homepageData.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <span className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl">{stat.value}</span>
                <span className="text-3xs uppercase font-extrabold tracking-widest text-orange-100">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-white/5 opacity-40 z-0 pointer-events-none" />
        </section>
      )}

      {/* Brands Slider Section */}
      <section className="py-16 bg-gray-50 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-gray-500">Industry Giants</span>
          <h3 className="font-heading font-bold text-lg text-gray-800 mt-1">Authorized Supply Partners</h3>
        </div>

        <div className="w-full flex overflow-hidden">
          <div className="flex gap-16 py-4 animate-marquee whitespace-nowrap">
            {brands.concat(brands).map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400 hover:text-orange-500 font-heading font-extrabold text-2xl tracking-widest uppercase transition-all duration-300">
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Endorsements</span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 mt-2 mb-4">What Our Clients Say</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Real reviews from structural leads, luxury architects, and construction managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleTestimonials.length > 0 ? (
              visibleTestimonials.map((test) => (
                <div key={test._id} className="p-8 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between text-left">
                  <div>
                    <div className="text-orange-500 text-sm mb-4 flex gap-0.5">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <Star key={i} size={13} className="fill-orange-500" />
                      ))}
                    </div>
                    <p className="text-sm italic text-gray-600 leading-relaxed mb-6">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-150/50 pt-4 mt-2">
                    {test.image ? (
                      <img
                        src={test.image.startsWith('http') ? test.image : `${base}${test.image}`}
                        alt={test.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm uppercase">
                        {test.name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <h4 className="font-heading font-bold text-sm text-gray-900">{test.name}</h4>
                      <p className="text-2xs text-gray-500">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Seeded fallbacks if none in DB
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-56 bg-gray-50 rounded-xl border border-gray-100 shimmer" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section 
        className="py-20 text-white relative bg-gray-900 overflow-hidden"
        style={homepageData.ctaBgImage ? {
          backgroundImage: `url(${resolveImageUrl(homepageData.ctaBgImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {homepageData.ctaBgImage && <div className="absolute inset-0 bg-black/75 z-0" />}

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col gap-6 items-center">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl leading-tight">
            {homepageData.ctaTitle || 'Ready to Source Premium Materials?'}
          </h2>
          <p className="text-gray-400 text-sm max-w-lg">
            {homepageData.ctaSubtitle || 'Connect with our logistics and specifications desk today to receive customized wholesale quotes for bulk supplies.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to={homepageData.ctaBtnLink || '/contact'}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {homepageData.ctaBtnText || 'Get a Customized Quote'}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="btn border border-white/20 hover:bg-white hover:text-black text-white font-bold py-3.5 px-8 rounded-md transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
