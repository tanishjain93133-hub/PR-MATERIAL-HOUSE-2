import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import dbFallback from '../utils/db_fallback.json';

const Footer = () => {
  const [siteConfig, setSiteConfig] = useState({
    websiteName: 'PR Material House',
    aboutSnippet: 'Premium building materials distributor. We source and supply industry-certified products for residential projects, architectures, and large infrastructure sites.',
    copyrightText: '© 2026 PR Material House. All rights reserved. ISO Certified B2B Wholesaler.',
    socialLinks: { facebook: '#', linkedin: '#', twitter: '#' }
  });

  const [contact, setContact] = useState({
    phone: '+91 99133 77965',
    email: 'prmaterialhouse@gmail.com',
    address: 'Remote Pan, Ahmedabad, Gujarat, India'
  });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const webRes = await api.get('/settings/website');
        if (webRes.data) {
          setSiteConfig({
            websiteName: webRes.data.websiteName || 'PR Material House',
            aboutSnippet: webRes.data.footer?.aboutSnippet || 'Premium building materials distributor. We source and supply industry-certified products for residential projects, architectures, and large infrastructure sites.',
            copyrightText: webRes.data.footer?.copyrightText || '© 2026 PR Material House. All rights reserved. ISO Certified B2B Wholesaler.',
            socialLinks: webRes.data.socialLinks || { facebook: '#', linkedin: '#', twitter: '#' }
          });
        }
      } catch (err) {
        if (dbFallback.websiteconfigs && dbFallback.websiteconfigs[0]) {
          const w = dbFallback.websiteconfigs[0];
          setSiteConfig({
            websiteName: w.websiteName || 'PR Material House',
            aboutSnippet: w.footer?.aboutSnippet || 'Premium building materials distributor. We source and supply industry-certified products for residential projects, architectures, and large infrastructure sites.',
            copyrightText: w.footer?.copyrightText || '© 2026 PR Material House. All rights reserved. ISO Certified B2B Wholesaler.',
            socialLinks: w.socialLinks || { facebook: '#', linkedin: '#', twitter: '#' }
          });
        }
      }

      try {
        const contactRes = await api.get('/settings/contact');
        if (contactRes.data) {
          setContact({
            phone: contactRes.data.phone || '+91 99133 77965',
            email: contactRes.data.email || 'prmaterialhouse@gmail.com',
            address: contactRes.data.address || 'Remote Pan, Ahmedabad, Gujarat, India'
          });
        }
      } catch (err) {
        if (dbFallback.contactdetails && dbFallback.contactdetails[0]) {
          const c = dbFallback.contactdetails[0];
          setContact({
            phone: c.phone || '+91 99133 77965',
            email: c.email || 'prmaterialhouse@gmail.com',
            address: c.address || 'Remote Pan, Ahmedabad, Gujarat, India'
          });
        }
      }
    };
    fetchFooterData();
  }, []);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800 text-left">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group self-start">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              {siteConfig.websiteName}
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-gray-400">
            {siteConfig.aboutSnippet}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a href={siteConfig.socialLinks.facebook} className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Facebook size={14} />
            </a>
            <a href={siteConfig.socialLinks.linkedin} className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Linkedin size={14} />
            </a>
            <a href={siteConfig.socialLinks.twitter} className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black transition-all">
              <Twitter size={14} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-2xs">
            <li><Link to="/" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link to="/about" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">About Us</Link></li>
            <li><Link to="/products" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Browse Materials</Link></li>
            <li><Link to="/brands" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Brands Slider</Link></li>
            <li><Link to="/gallery" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Projects Showcase</Link></li>
            <li><Link to="/contact" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-6">Product Lineup</h4>
          <ul className="flex flex-col gap-3 text-2xs">
            <li><Link to="/products?category=cement" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">OPC &amp; PPC Cement</Link></li>
            <li><Link to="/products?category=hardware" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Locks &amp; Hardware</Link></li>
            <li><Link to="/products?category=cp-fittings" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">CP Fittings</Link></li>
            <li><Link to="/products?category=chemicals" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Waterproofing Adhesives</Link></li>
            <li><Link to="/products?category=plumbing" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Plumbing Fittings</Link></li>
            <li><Link to="/products?category=tmt-steel" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">TMT Steel Bars</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 text-xs">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs mb-2">Corporate Office</h4>
          <div className="flex items-start gap-3 text-2xs">
            <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
            <p>{contact.address}</p>
          </div>
          <div className="flex items-center gap-3 text-2xs">
            <Phone size={14} className="text-orange-500 shrink-0" />
            <p><a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="hover:text-orange-500">{contact.phone}</a></p>
          </div>
          <div className="flex items-center gap-3 text-2xs">
            <Mail size={14} className="text-orange-500 shrink-0" />
            <p><a href={`mailto:${contact.email}`} className="hover:text-orange-500">{contact.email}</a></p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
        <p>{siteConfig.copyrightText}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms of Supply</a>
          <Link to="/admin/login" onClick={() => window.scrollTo(0,0)} className="hover:text-orange-500 transition-colors">Portal Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
