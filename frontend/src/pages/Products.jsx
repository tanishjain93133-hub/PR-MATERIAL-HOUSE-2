import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, X, PhoneCall, RefreshCw } from 'lucide-react';
import api, { resolveImageUrl } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

import dbFallback from '../utils/db_fallback.json';

const defaultCategories = [
  { _id: 'mock-1', name: 'Cement & Putty' },
  { _id: 'mock-2', name: 'Hardware & Tools' },
  { _id: 'mock-3', name: 'CP Fittings & Bath' },
  { _id: 'mock-4', name: 'Construction Chemicals' }
];

const defaultBrands = [
  { _id: 'mock-b1', name: 'UltraTech Cement' },
  { _id: 'mock-b2', name: 'Ambuja Cement' },
  { _id: 'mock-b3', name: 'Hathi Cement' }
];

const defaultProducts = [
  {
    _id: 'mock-p1',
    name: 'UltraTech Premium OPC 53',
    brand: { _id: 'mock-b1', name: 'UltraTech Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/ultratech/front.png',
    description: 'High-compressive strength OPC cement, ideal for all concrete structures like slabs, columns, beams.',
    bestSeller: true,
    specifications: [
      { name: 'Grade', value: 'OPC 53' },
      { name: 'Weight', value: '50 kg' }
    ]
  },
  {
    _id: 'mock-p2',
    name: 'Ambuja Kawach Waterproof Cement',
    brand: { _id: 'mock-b2', name: 'Ambuja Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/ambuja/front.png',
    description: 'Specially formulated water-repellent cement designed to shield residential foundations and walls.',
    bestSeller: true,
    specifications: [
      { name: 'Type', value: 'Waterproof' },
      { name: 'Weight', value: '50 kg' }
    ]
  },
  {
    _id: 'mock-p3',
    name: 'Hathi PPC Cement',
    brand: { _id: 'mock-b3', name: 'Hathi Cement' },
    category: { _id: 'mock-1', name: 'Cement & Putty' },
    image: '/products/cement/hathi/front.png',
    description: 'Premium Portland Pozzolana Cement offering superior durability and resistance to sulphate attacks.',
    bestSeller: false,
    specifications: [
      { name: 'Type', value: 'PPC' },
      { name: 'Weight', value: '50 kg' }
    ]
  }
];

const mockCategories = dbFallback.categories && dbFallback.categories.length > 0 ? dbFallback.categories : defaultCategories;
const mockBrands = dbFallback.brands && dbFallback.brands.length > 0 ? dbFallback.brands : defaultBrands;
const mockProducts = dbFallback.products && dbFallback.products.length > 0 ? dbFallback.products : defaultProducts;

const Products = () => {
  const { userInfo } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(catParam || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Quote Request Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    city: '',
    quantity: '1',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch initial filters (Categories, Brands)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
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
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  // Sync category state if query parameter changes
  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
      setPage(1);
    }
  }, [catParam]);

  // Fetch products when filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&limit=9`; // Grid size of 9 for optimal layout
        if (searchTerm) url += `&keyword=${encodeURIComponent(searchTerm)}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;
        if (selectedBrand) url += `&brand=${selectedBrand}`;

        const res = await api.get(url);
        if (res.data && res.data.products && res.data.products.length > 0) {
          const visible = res.data.products.filter(p => !p.hide);
          setProducts(visible);
          setTotalPages(res.data.pages);
          setTotalProducts(res.data.total);
        } else {
          simulateLocalProducts();
        }
      } catch (err) {
        console.warn('Backend unavailable, simulating products list');
        simulateLocalProducts();
      } finally {
        setLoading(false);
      }
    };

    const simulateLocalProducts = () => {
      let filtered = mockProducts;
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category?._id === selectedCategory);
      }
      if (selectedBrand) {
        filtered = filtered.filter(p => p.brand?._id === selectedBrand);
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
      }
      
      const limit = 9;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);
      
      setProducts(paginated);
      setTotalPages(Math.ceil(filtered.length / limit) || 1);
      setTotalProducts(filtered.length);
    };

    fetchProducts();
  }, [page, selectedCategory, selectedBrand, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchParams({});
    setPage(1);
  };

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
        productName: selectedProduct.name,
        category: selectedProduct.category?.name,
        message: `${quoteForm.message} | Quantity: ${quoteForm.quantity}`
      });
      setFormSubmitted(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit quote request. Try again.');
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setQuoteForm({
      name: userInfo?.username || '',
      email: userInfo?.email || '',
      phone: userInfo?.phone || '',
      companyName: userInfo?.companyName || '',
      city: userInfo?.city || '',
      quantity: '1',
      message: `I would like to request a wholesale price quote for "${product.name}" (${product.brand?.name || 'Authorized brand'}). My project details are: `
    });
    setFormSubmitted(false);
    setSubmitError('');
  };

  return (
    <div className="pt-24 w-full">
      {/* Header banner */}
      <section className="bg-gray-50 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Material Catalog</span>
            <h1 className="font-heading font-extrabold text-3xl text-gray-900 mt-1">Digital Showroom</h1>
          </div>
          <div className="text-xs font-semibold text-gray-500 bg-gray-200/50 py-1.5 px-3 rounded-full border border-gray-200">
            Displaying {totalProducts} premium products
          </div>
        </div>
      </section>

      {/* Catalog Main Layout */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 border border-gray-150 p-6 rounded-2xl bg-white flex flex-col gap-6 h-fit text-left">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <SlidersHorizontal size={16} className="text-orange-500" />
              <h3 className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wide">Filter Materials</h3>
            </div>

            {/* Keyword Search */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Search Showroom</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  placeholder="e.g. Cement, Latex..."
                  className="w-full border border-gray-250 p-2.5 pl-9 rounded-lg text-xs outline-none focus:border-orange-500"
                />
                <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Categories list */}
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Categories</h4>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                <button
                  onClick={() => { setSelectedCategory(''); setPage(1); }}
                  className={`text-sm py-1.5 px-3 rounded-md text-left transition-all ${
                    selectedCategory === '' 
                      ? 'bg-orange-50 text-orange-600 font-bold' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => { setSelectedCategory(cat._id); setPage(1); }}
                    className={`text-sm py-1.5 px-3 rounded-md text-left transition-all ${
                      selectedCategory === cat._id 
                        ? 'bg-orange-50 text-orange-600 font-bold' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands checklist */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Brand Suppliers</h4>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
                <button
                  onClick={() => { setSelectedBrand(''); setPage(1); }}
                  className={`text-sm py-1.5 px-3 rounded-md text-left transition-all ${
                    selectedBrand === '' 
                      ? 'bg-orange-50 text-orange-600 font-bold' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand._id}
                    onClick={() => { setSelectedBrand(brand._id); setPage(1); }}
                    className={`text-sm py-1.5 px-3 rounded-md text-left transition-all ${
                      selectedBrand === brand._id 
                        ? 'bg-orange-50 text-orange-600 font-bold' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="mt-2 flex items-center justify-center gap-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-all"
            >
              <RefreshCw size={14} />
              Reset All Filters
            </button>
          </div>

          {/* Products Catalog Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 rounded-xl bg-gray-50 border border-gray-100 shimmer" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <div
                      key={prod._id}
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-150 flex flex-col justify-between"
                    >
                      <Link to={`/products/${prod._id}`}>
                        <div className="h-48 overflow-hidden relative bg-gray-50">
                          <img 
                            src={resolveImageUrl(prod.image)} 
                            alt={prod.name} 
                            onError={(e) => { e.target.src = '/cement.jpg'; }}
                            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
                          />
                          {prod.bestSeller && (
                            <span className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest bg-orange-500 text-white px-2 py-1 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-5 text-left flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600">
                            {prod.brand?.name || 'Supplier'}
                          </span>
                          <Link to={`/products/${prod._id}`}>
                            <h3 className="font-heading font-bold text-base text-gray-900 mt-1 mb-2 hover:text-orange-500 transition-colors line-clamp-1">
                              {prod.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                            {prod.description}
                          </p>
                          
                          {/* Specs list preview */}
                          {prod.specifications?.length > 0 && (
                            <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                              {prod.specifications.slice(0, 2).map((spec, i) => (
                                <div key={i} className="flex justify-between text-3xs font-semibold">
                                  <span className="text-gray-400 uppercase tracking-wider">{spec.name}</span>
                                  <span className="text-gray-700">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 items-center mt-5 border-t border-gray-55 pt-4">
                          <Link 
                            to={`/products/${prod._id}`}
                            className="btn border border-gray-200 hover:border-orange-500 hover:text-orange-600 flex-grow text-2xs font-bold py-2 px-3 rounded-md transition-all text-center"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="btn bg-gray-950 hover:bg-orange-500 text-white flex-grow text-2xs font-bold py-2 px-3 rounded-md transition-all shadow-sm"
                          >
                            Request Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 border-t border-gray-100 pt-8">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-250 rounded-md text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-md text-xs font-bold transition-all ${
                          page === i + 1 
                            ? 'bg-orange-500 text-white' 
                            : 'border border-gray-250 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-250 rounded-md text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
                <SlidersHorizontal size={36} className="mx-auto text-gray-300 mb-3" />
                <h3 className="font-heading font-bold text-lg text-gray-800">No Materials Found</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4">Try refining your search keyword or clearing active filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-xs"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quote Request Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up relative border border-gray-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between text-left">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600">Request quotation</span>
                <h3 className="font-heading font-extrabold text-lg text-gray-900 mt-0.5">{selectedProduct.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {formSubmitted ? (
                <div className="text-center py-6 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-orange-55 rounded-full flex items-center justify-center text-orange-600 border border-orange-100">
                    ✓
                  </div>
                  <h4 className="font-heading font-bold text-lg text-gray-900">Quotation Request Sent</h4>
                  <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                    Thank you! Our engineering and specifications desk will calculate your wholesale quote and contact you.
                  </p>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="btn bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-2 px-6 rounded-md transition-all mt-4"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-4 text-left">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={quoteForm.name} 
                        onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                        placeholder="Enter name"
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        value={quoteForm.phone} 
                        onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                        placeholder="+91 XXXXX XXXXX"
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        value={quoteForm.email} 
                        onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                        placeholder="Enter email"
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 col-span-1">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">Quantity *</label>
                      <input 
                        type="number" 
                        required 
                        min="1"
                        value={quoteForm.quantity} 
                        onChange={(e) => setQuoteForm({...quoteForm, quantity: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">Company Name</label>
                      <input 
                        type="text" 
                        value={quoteForm.companyName} 
                        onChange={(e) => setQuoteForm({...quoteForm, companyName: e.target.value})}
                        placeholder="Company"
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-505 uppercase tracking-wide">City / Location *</label>
                      <input 
                        type="text" 
                        required
                        value={quoteForm.city} 
                        onChange={(e) => setQuoteForm({...quoteForm, city: e.target.value})}
                        placeholder="City"
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Project Details &amp; message *</label>
                    <textarea 
                      required 
                      rows={3} 
                      value={quoteForm.message} 
                      onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2.5 border border-gray-250 rounded-md text-xs font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold transition-all shadow-sm shadow-orange-500/10 flex items-center gap-1.5"
                    >
                      <PhoneCall size={14} />
                      Request Quote
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
