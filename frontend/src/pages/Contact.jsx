import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageSquarePlus, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import dbFallback from '../utils/db_fallback.json';

const Contact = () => {
  const [contactData, setContactData] = useState({
    phone: '+91 99133 77965',
    email: 'prmaterialhouse@gmail.com',
    address: 'Remote Pan, Ahmedabad, Gujarat, India',
    whatsappNumber: '919913377965'
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    productName: '',
    category: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const res = await api.get('/settings/contact');
        if (res.data) setContactData(res.data);
      } catch (err) {
        if (dbFallback.contactdetails && dbFallback.contactdetails[0]) {
          setContactData(dbFallback.contactdetails[0]);
        }
      }
    };
    fetchContactDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.phone || !form.productName || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/enquiries', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        productName: form.productName,
        category: form.category,
        message: form.message
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      productName: '',
      category: '',
      message: ''
    });
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="pt-24 w-full">
      {/* Page Header */}
      <section className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Contact Us</span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mt-2">
            Let's Discuss Your Project
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-xs mt-3">
            Reach out directly for ISO certification paperwork, bulk pricing quotes, or general material spec sheets.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 bg-white max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Contact Form */}
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-150 relative overflow-hidden">
            {submitted ? (
              <div className="py-16 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 border border-orange-200 rounded-full flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="font-heading font-extrabold text-xl text-gray-900">Request Sent Successfully</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                  Thank you! A PR Material House B2B coordinator will evaluate your request and contact you shortly.
                </p>
                <button
                  onClick={handleReset}
                  className="btn bg-gray-950 hover:bg-orange-500 text-white font-bold text-xs py-2.5 px-6 rounded-md transition-all mt-4 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquarePlus size={20} className="text-orange-500" />
                  Submit Price Inquiry
                </h3>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="Enter name"
                    className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      placeholder="email@example.com"
                      className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                      className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Product Interested In *</label>
                    <input
                      type="text"
                      required
                      value={form.productName}
                      onChange={(e) => setForm({...form, productName: e.target.value})}
                      placeholder="e.g. UltraTech Cement 53 Grade"
                      className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Material Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none"
                    >
                      <option value="">Select Material Lineup</option>
                      <option value="Cement">Cement Supply</option>
                      <option value="Hardware">Hardware &amp; Fasteners</option>
                      <option value="CP Fittings">Sanitary &amp; CP Fittings</option>
                      <option value="Chemicals">Construction Chemicals</option>
                      <option value="Plumbing">Plumbing &amp; Pipes</option>
                      <option value="Electrical">Electrical Switchgear</option>
                      <option value="Mixed">Mixed Bulk Logistics</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Project Details &amp; Quantity Needed *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder="Describe your specifications and delivery deadlines"
                    className="bg-white border border-gray-250 p-3 rounded-md text-xs focus:border-orange-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-md transition-all text-xs w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {loading ? 'Submitting...' : 'Send Request'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Details & CTAs */}
          <div className="flex flex-col justify-between gap-8 text-left bg-gray-50/50 p-8 rounded-3xl border border-gray-150 relative overflow-hidden backdrop-blur-xs">
            <div className="flex flex-col gap-6">
              
              {/* Phone Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200/60 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Phone size={20} />
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Support</span>
                  <h4 className="font-heading font-extrabold text-base text-gray-900 mt-0.5">{contactData.phone}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">B2B Bulk Wholesales Hotline</p>
                </div>
                <a 
                  href={`tel:${contactData.phone.replace(/\s+/g, '')}`} 
                  className="self-center bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-2xs px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  Call Now
                </a>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200/60 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Mail size={20} />
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</span>
                  <h4 className="font-heading font-extrabold text-sm text-gray-900 mt-0.5 truncate max-w-[170px] sm:max-w-xs">{contactData.email}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Submit specifications and RFQs</p>
                </div>
                <a 
                  href={`mailto:${contactData.email}`} 
                  className="self-center bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-2xs px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  Send Email
                </a>
              </div>

              {/* WhatsApp Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200/60 shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 2.698 1.498 4.74 1.499 5.516.002 10.002-4.482 10.005-9.998.003-2.673-1.03-5.185-2.909-7.068-1.879-1.88-4.394-2.916-7.066-2.917-5.52.001-10.007 4.485-10.01 10.002-.001 1.93.488 3.391 1.393 4.957l-.989 3.612 3.738-.979z"/>
                  </svg>
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp Support</span>
                  <h4 className="font-heading font-extrabold text-base text-gray-900 mt-0.5">Quick Quote Chat</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium">Instantly clear B2B pricing queries</p>
                </div>
                <a 
                  href="https://wa.me/919913377965?text=Hello%20PR%20Material%20House%2C%20I%20want%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-center bg-green-500 hover:bg-green-600 text-white font-extrabold text-2xs px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  Chat Now
                </a>
              </div>

              {/* Address Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200/60 shadow-2xs group">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Corporate Headquarters</span>
                  <h4 className="font-heading font-extrabold text-sm text-gray-900 mt-0.5 leading-relaxed">
                    {contactData.address}
                  </h4>
                </div>
              </div>

            </div>

            {/* Premium Glassmorphic Summary Card */}
            <div className="w-full p-6 rounded-2xl bg-white/70 border border-gray-200 shadow-sm backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-orange-200">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/30 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
              
              <h4 className="font-heading font-extrabold text-xs text-gray-900 mb-4 pb-2 border-b border-gray-150">
                Direct Contact Card
              </h4>
              
              <ul className="flex flex-col gap-3 text-xs mb-5">
                <li className="flex items-center gap-2.5 text-gray-700">
                  <span className="text-sm shrink-0">📍</span>
                  <strong className="font-semibold text-gray-900 shrink-0">Address:</strong>
                  <span className="truncate">{contactData.address}</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-700">
                  <span className="text-sm shrink-0">📞</span>
                  <strong className="font-semibold text-gray-900 shrink-0">Phone:</strong>
                  <span>{contactData.phone}</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-700">
                  <span className="text-sm shrink-0">📧</span>
                  <strong className="font-semibold text-gray-900 shrink-0">Email:</strong>
                  <span className="truncate">{contactData.email}</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-700">
                  <span className="text-sm shrink-0">💬</span>
                  <strong className="font-semibold text-gray-900 shrink-0">WhatsApp:</strong>
                  <span>+91 99133 77965</span>
                </li>
              </ul>

              {/* Responsive Quick Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <a 
                  href={`tel:${contactData.phone.replace(/\s+/g, '')}`} 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-3xs py-2.5 px-1 rounded-lg text-center shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Call Now
                </a>
                <a 
                  href="https://wa.me/919913377965?text=Hello%20PR%20Material%20House%2C%20I%20want%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-extrabold text-3xs py-2.5 px-1 rounded-lg text-center shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  WhatsApp
                </a>
                <a 
                  href={`mailto:${contactData.email}`} 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-3xs py-2.5 px-1 rounded-lg text-center shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Email Us
                </a>
                <button 
                  type="button"
                  onClick={() => {
                    const formEl = document.querySelector('form');
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      const nameInput = formEl.querySelector('input');
                      if (nameInput) nameInput.focus();
                    }
                  }}
                  className="bg-gray-900 hover:bg-orange-500 text-white font-extrabold text-3xs py-2.5 px-1 rounded-lg text-center shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
