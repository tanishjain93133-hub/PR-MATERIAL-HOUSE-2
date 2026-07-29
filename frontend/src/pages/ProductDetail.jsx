import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, PhoneCall, MessageCircle, RotateCcw, Building, MapPin, Landmark, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import api, { resolveImageUrl } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import WhatsAppButton from '../components/WhatsAppButton';

import dbFallback from '../utils/db_fallback.json';

const defaultProducts = [
  {
    _id: 'mock-p1',
    name: 'UltraTech Premium OPC 53',
    brand: { _id: 'mock-b1', name: 'UltraTech Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/ultratech/front.png',
    images: ['/products/cement/ultratech/front.png', '/products/cement/ultratech/powder.png', '/products/cement/ultratech/site.png'],
    description: 'High-compressive strength OPC cement, ideal for all concrete structures like slabs, columns, beams.',
    specifications: [
      { name: 'Grade', value: 'OPC 53' },
      { name: 'Weight', value: '50 kg' },
      { name: 'Composition', value: 'Ordinary Portland Cement' }
    ]
  },
  {
    _id: 'mock-p2',
    name: 'Ambuja Kawach Waterproof Cement',
    brand: { _id: 'mock-b2', name: 'Ambuja Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/ambuja/front.png',
    images: ['/products/cement/ambuja/front.png', '/products/cement/ambuja/powder.png', '/products/cement/ambuja/site.png'],
    description: 'Specially formulated water-repellent cement designed to shield residential foundations and walls.',
    specifications: [
      { name: 'Type', value: 'Waterproof PPC' },
      { name: 'Weight', value: '50 kg' },
      { name: 'Coverage', value: 'High' }
    ]
  },
  {
    _id: 'mock-p3',
    name: 'Hathi PPC Cement',
    brand: { _id: 'mock-b3', name: 'Hathi Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/hathi/front.png',
    images: ['/products/cement/hathi/front.png', '/products/cement/hathi/powder.png', '/products/cement/hathi/site.png'],
    description: 'Premium Portland Pozzolana Cement offering superior durability and resistance to sulphate attacks.',
    specifications: [
      { name: 'Type', value: 'PPC' },
      { name: 'Weight', value: '50 kg' },
      { name: 'Standard', value: 'IS 1489 Part 1' }
    ]
  }
];

const mockProducts = dbFallback.products && dbFallback.products.length > 0 ? dbFallback.products : defaultProducts;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gallery and Zoom States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.5)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  // Quote Request Form
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    city: '',
    quantity: '1',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        let productData = null;
        if (id && id.startsWith('mock-')) {
          productData = mockProducts.find(p => p._id === id);
        } else {
          try {
            const res = await api.get(`/products/${id}`);
            productData = res.data;
          } catch (e) {
            console.warn('API error, falling back to mock product details');
            productData = mockProducts.find(p => p._id === id) || mockProducts[0];
          }
        }

        if (!productData) {
          throw new Error('Product not found');
        }

        setProduct(productData);
        
        // Fetch related products in the same category
        if (!id.startsWith('mock-') && productData.category) {
          try {
            const relRes = await api.get(`/products?category=${productData.category._id}&limit=4`);
            const filtered = relRes.data.products.filter(p => p._id !== id);
            setRelatedProducts(filtered.slice(0, 3));
          } catch (e) {
            const rel = mockProducts.filter(p => p._id !== productData._id);
            setRelatedProducts(rel.slice(0, 3));
          }
        } else {
          const rel = mockProducts.filter(p => p._id !== productData._id);
          setRelatedProducts(rel.slice(0, 3));
        }

        // Initialize quote message
        setQuoteForm(prev => ({
          ...prev,
          name: userInfo?.username || '',
          email: userInfo?.email || '',
          phone: userInfo?.phone || '',
          companyName: userInfo?.companyName || '',
          city: userInfo?.city || '',
          message: `Hi PR Material House, I am interested in inquiring about a bulk price quote for "${productData.name}". Please contact me with details.`
        }));

        // Increment view count via backend trigger in the background
        if (!id.startsWith('mock-')) {
          api.put(`/products/${id}/view`, {}).catch(() => {});
        }

        setSubmitted(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load product details. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, userInfo]);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!quoteForm.name || !quoteForm.email || !quoteForm.phone || !quoteForm.message) {
      setSubmitError('Please complete all required fields.');
      return;
    }

    try {
      await api.post('/enquiries', {
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        companyName: quoteForm.companyName,
        city: quoteForm.city,
        productName: product.name,
        category: product.category?.name,
        message: `${quoteForm.message} | Quantity Requested: ${quoteForm.quantity}`
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit quote request. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 max-w-7xl mx-auto px-6 pb-20 text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-gray-500 text-sm">Loading product profile...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 max-w-xl mx-auto px-6 pb-20 text-center">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-200">
          {error || 'Product not found.'}
        </div>
        <Link to="/products" className="btn bg-gray-900 text-white text-xs font-bold py-2.5 px-6 rounded-md">
          Return to Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 w-full">
      {/* Back button */}
      <section className="bg-white max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 text-left">
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Materials Catalog
        </button>
      </section>

      {/* Main Details Section */}
      <section className="py-12 bg-white max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Product Image & Gallery */}
          <div className="flex flex-col gap-6">
            {(() => {
              const galleryImages = (product.images && product.images.length > 0)
                ? product.images
                : [product.image || '/cement.jpg'];
              return (
                <>
                  <div className="relative w-full bg-gray-50 rounded-2xl border border-gray-150 overflow-hidden h-[340px] sm:h-[420px] md:h-[480px] group">
                    <div 
                      className="w-full h-full overflow-hidden cursor-zoom-in"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => setIsLightboxOpen(true)}
                    >
                      <img 
                        src={resolveImageUrl(galleryImages[activeImageIndex])}
                        alt={product.name} 
                        onError={(e) => { e.target.src = '/cement.jpg'; }}
                        style={{ ...zoomStyle, transition: 'transform 0.1s ease-out' }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Navigation Chevrons */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}

                    {/* Counter Badge */}
                    <div className="absolute bottom-4 right-4 bg-gray-900/60 backdrop-blur-xs text-white text-[10px] font-bold py-1 px-2.5 rounded-full z-10 flex items-center gap-1">
                      <Maximize2 size={10} />
                      {activeImageIndex + 1} / {galleryImages.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {galleryImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {galleryImages.map((imgUrl, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                            activeImageIndex === index 
                              ? 'border-orange-500 shadow-md shadow-orange-500/10' 
                              : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={resolveImageUrl(imgUrl)} 
                            alt={`Thumbnail ${index + 1}`}
                            onError={(e) => { e.target.src = '/cement.jpg'; }}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
            
            {/* Features panel */}
            {product.features?.length > 0 && (
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-left">
                <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">Key Features</h3>
                <ul className="flex flex-col gap-3">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: Info, Specs & Forms */}
          <div className="flex flex-col gap-8 text-left">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">
                {product.category?.name || 'Category'}
              </span>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 mt-1 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span>Brand: <span className="text-gray-900">{product.brand?.name || 'Authorized'}</span></span>
                <span>•</span>
                <span>Stock Status: <span className={product.stockStatus === 'In Stock' ? 'text-green-600' : 'text-red-500'}>{product.stockStatus}</span></span>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Specifications table */}
            {product.specifications?.length > 0 && (
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Specifications</h4>
                <div className="border border-gray-150 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i} className="border-b border-gray-150 last:border-0 bg-white hover:bg-gray-50/50">
                          <td className="p-3.5 font-bold text-gray-400 uppercase tracking-wide bg-gray-50/50 w-1/3">{spec.name}</td>
                          <td className="p-3.5 text-gray-700 font-semibold">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Available sizes */}
            {product.sizes?.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Available Sizes / Volumes</h4>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, i) => (
                    <span key={i} className="text-2xs font-bold bg-gray-100 text-gray-800 py-1.5 px-3.5 rounded-full border border-gray-200">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* B2B Quotation Form Box */}
            <div className="p-6 rounded-xl border border-gray-150 bg-gray-50 flex flex-col gap-4">
              <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-3 flex items-center gap-2">
                <PhoneCall size={16} className="text-orange-500" />
                Request Custom Wholesale Quote
              </h3>
              
              {submitted ? (
                <div className="text-center py-6 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h4 className="font-heading font-bold text-sm text-gray-900">Quotation request registered</h4>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    One of our B2B coordinators will calculate custom bulk delivery rates and call you.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="flex items-center gap-2 text-2xs font-bold text-orange-600 hover:underline mx-auto mt-2 animate-fade-in"
                  >
                    <RotateCcw size={12} />
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4">
                  {submitError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                      {submitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required 
                      value={quoteForm.name} 
                      onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                      placeholder="Your Name *"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                    <input 
                      type="tel" 
                      required 
                      value={quoteForm.phone} 
                      onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                      placeholder="Phone Number *"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input 
                      type="email" 
                      required 
                      value={quoteForm.email} 
                      onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                      placeholder="Email Address *"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none sm:col-span-2"
                    />
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={quoteForm.quantity} 
                      onChange={(e) => setQuoteForm({...quoteForm, quantity: e.target.value})}
                      placeholder="Qty *"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none sm:col-span-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={quoteForm.companyName} 
                      onChange={(e) => setQuoteForm({...quoteForm, companyName: e.target.value})}
                      placeholder="Company Name"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                    <input 
                      type="text" 
                      required
                      value={quoteForm.city} 
                      onChange={(e) => setQuoteForm({...quoteForm, city: e.target.value})}
                      placeholder="City / Delivery Location *"
                      className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>

                  <textarea 
                    required 
                    rows={3} 
                    value={quoteForm.message} 
                    onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                    placeholder="Describe specific project requirements..."
                    className="bg-white border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none resize-none"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-grow bg-gray-950 hover:bg-orange-500 text-white font-bold py-3.5 px-6 rounded-md transition-all text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <PhoneCall size={14} />
                      Request Quote
                    </button>
                    <a
                      href="https://wa.me/919913377965?text=Hello%20PR%20Material%20House%2C%20I%20want%20to%20know%20more%20about%20your%20products."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-md transition-all text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <MessageCircle size={14} />
                      WhatsApp Inquiry
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100 text-left">
          <div className="max-w-7xl mx-auto px-6">
            <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-8">Related Materials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <Link
                  key={prod._id}
                  to={`/products/${prod._id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-150 flex flex-col justify-between"
                >
                  <div className="h-40 overflow-hidden relative bg-gray-100">
                    <img 
                      src={resolveImageUrl(prod.image)} 
                      alt={prod.name} 
                      onError={(e) => { e.target.src = '/cement.jpg'; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-orange-600">{prod.brand?.name || 'Brand'}</span>
                      <h4 className="font-heading font-bold text-sm text-gray-900 mt-0.5 line-clamp-1 group-hover:text-orange-500 transition-colors">
                        {prod.name}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating WhatsApp button */}
      <WhatsAppButton />

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 select-none">
          <div className="absolute inset-0 animate-fade-in" onClick={() => setIsLightboxOpen(false)} />
          
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-[10000]"
          >
            <X size={24} />
          </button>

          {(() => {
            const galleryImages = (product.images && product.images.length > 0)
              ? product.images
              : [product.image || '/cement.jpg'];
            return (
              <>
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[10000] text-xl font-bold"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[10000] text-xl font-bold"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                <div className="relative max-w-5xl max-h-[85vh] z-[10000] flex flex-col items-center gap-3">
                  <img
                    src={resolveImageUrl(galleryImages[activeImageIndex])}
                    alt={product.name}
                    onError={(e) => { e.target.src = '/cement.jpg'; }}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-fade-in"
                  />
                  <div className="text-center text-white/80 text-xs font-semibold">
                    {product.name} — {activeImageIndex + 1} of {galleryImages.length}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
