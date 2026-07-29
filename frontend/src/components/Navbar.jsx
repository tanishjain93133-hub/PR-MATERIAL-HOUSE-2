import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield, LogOut, UserCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import dbFallback from '../utils/db_fallback.json';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteConfig, setSiteConfig] = useState({
    websiteName: 'PR Material House',
    companyLogo: ''
  });

  const location = useLocation();
  const { userInfo, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const fetchConfig = async () => {
      try {
        const res = await api.get('/settings/website');
        if (res.data) {
          setSiteConfig({
            websiteName: res.data.websiteName || 'PR Material House',
            companyLogo: res.data.companyLogo || ''
          });
        }
      } catch (err) {
        if (dbFallback.websiteconfigs && dbFallback.websiteconfigs[0]) {
          setSiteConfig({
            websiteName: dbFallback.websiteconfigs[0].websiteName || 'PR Material House',
            companyLogo: dbFallback.websiteconfigs[0].companyLogo || ''
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    fetchConfig();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Brands', path: '/brands' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 shadow-md py-3 backdrop-blur-md border-b border-gray-100' 
          : 'bg-white/60 py-5 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105">
            P
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-gray-900">
            {siteConfig.websiteName}
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleLinkClick}
              className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                isActive(link.path) 
                  ? 'text-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 rounded-full animate-fade-in" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {userInfo ? (
            <div className="flex items-center gap-3">
              {userInfo.role !== 'admin' && (
                <Link 
                  to="/profile" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-1.5 text-2xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-600 py-2.5 px-4 rounded-md transition-all border border-orange-100 uppercase tracking-wider"
                >
                  <UserCheck size={12} />
                  My Account
                </Link>
              )}
              <button 
                onClick={logout}
                className="flex items-center gap-1 text-2xs font-bold text-red-600 hover:bg-red-50 py-2 px-3 rounded-md transition-all uppercase tracking-wider"
                title="Logout"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="text-xs font-bold text-gray-700 hover:text-orange-500 transition-all uppercase tracking-wider px-3"
              >
                Client Login
              </Link>
              <Link 
                to="/contact" 
                onClick={handleLinkClick}
                className="text-2xs font-extrabold uppercase tracking-widest bg-gray-900 hover:bg-orange-500 hover:shadow-orange-200 text-white px-5 py-3 rounded-md transition-all duration-300 flex items-center gap-1.5 group shadow-sm"
              >
                Get a Quote
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-screen py-6' : 'max-h-0'
        }`}
      >
        <div className="px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleLinkClick}
              className={`text-base font-semibold py-2 border-b border-gray-50 ${
                isActive(link.path) ? 'text-orange-500' : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {userInfo ? (
            <div className="flex flex-col gap-3 pt-3">
              {userInfo.role !== 'admin' && (
                <Link 
                  to="/profile" 
                  onClick={handleLinkClick}
                  className="w-full text-center py-3 bg-orange-50 border border-orange-100 text-orange-600 font-bold flex items-center justify-center gap-2 rounded-md"
                >
                  <UserCheck size={16} />
                  My Account
                </Link>
              )}
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-center py-3 bg-red-50 hover:bg-red-100 rounded-md text-red-600 font-bold flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link 
                to="/login"
                onClick={handleLinkClick}
                className="w-full text-center py-3 border border-gray-250 rounded-md text-gray-800 font-bold text-xs uppercase tracking-wider"
              >
                Client Login
              </Link>
              <Link 
                to="/contact" 
                onClick={handleLinkClick}
                className="w-full text-center py-3.5 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-bold tracking-wide uppercase text-xs"
              >
                Request a B2B Quote
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
