import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import api from './utils/api';

// Client Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Brands from './pages/Brands';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerProfile from './pages/CustomerProfile';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminUsers from './pages/admin/AdminUsers';
import AdminWebsiteConfig from './pages/admin/AdminWebsiteConfig';
import AdminContact from './pages/admin/AdminContact';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTrash from './pages/admin/AdminTrash';
import AdminLogs from './pages/admin/AdminLogs';
import AdminBackup from './pages/admin/AdminBackup';

// Layout wrapper for public client-facing pages
const ClientLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

// Route Guard for Admin Routes
const ProtectedAdminRoute = ({ children }) => {
  const { userInfo, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-xs text-gray-500 font-bold uppercase tracking-widest">
        Verifying Session...
      </div>
    );
  }
  
  if (!userInfo) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

const AppContent = () => {
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await api.get('/settings/website');
        if (res.data && res.data.colors) {
          const { primary, accent, background } = res.data.colors;
          if (primary) document.documentElement.style.setProperty('--color-primary', primary);
          if (accent) document.documentElement.style.setProperty('--color-secondary', accent);
          if (background) document.documentElement.style.setProperty('--color-bg', background);
        }
        if (res.data && res.data.websiteName) {
          document.title = res.data.seo?.title || res.data.websiteName;
        }
        if (res.data && res.data.favicon) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          const base = api.defaults.baseURL || '';
          link.href = res.data.favicon.startsWith('http') ? res.data.favicon : `${base}${res.data.favicon}`;
        }
      } catch (err) {
        console.warn('Could not load dynamic website styles:', err);
      }
    };
    fetchStyles();
  }, []);

  return (
    <Routes>
      {/* --- Public Customer-Facing Website Routes --- */}
      <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
      <Route path="/about" element={<ClientLayout><About /></ClientLayout>} />
      <Route path="/products" element={<ClientLayout><Products /></ClientLayout>} />
      <Route path="/products/:id" element={<ClientLayout><ProductDetail /></ClientLayout>} />
      <Route path="/brands" element={<ClientLayout><Brands /></ClientLayout>} />
      <Route path="/gallery" element={<ClientLayout><Gallery /></ClientLayout>} />
      <Route path="/contact" element={<ClientLayout><Contact /></ClientLayout>} />
      <Route path="/login" element={<ClientLayout><Login /></ClientLayout>} />
      <Route path="/register" element={<ClientLayout><Register /></ClientLayout>} />
      <Route path="/profile" element={<ClientLayout><CustomerProfile /></ClientLayout>} />

      {/* --- Unified Admin Portal Routing --- */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
      
      {/* Protected Admin Console Routes */}
      <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
      <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
      <Route path="/admin/brands" element={<ProtectedAdminRoute><AdminBrands /></ProtectedAdminRoute>} />
      <Route path="/admin/gallery" element={<ProtectedAdminRoute><AdminGallery /></ProtectedAdminRoute>} />
      <Route path="/admin/testimonials" element={<ProtectedAdminRoute><AdminTestimonials /></ProtectedAdminRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedAdminRoute><AdminEnquiries /></ProtectedAdminRoute>} />
      <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminEnquiries /></ProtectedAdminRoute>} />
      <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
      <Route path="/admin/website" element={<ProtectedAdminRoute><AdminWebsiteConfig /></ProtectedAdminRoute>} />
      <Route path="/admin/trash" element={<ProtectedAdminRoute><AdminTrash /></ProtectedAdminRoute>} />
      <Route path="/admin/logs" element={<ProtectedAdminRoute><AdminLogs /></ProtectedAdminRoute>} />
      <Route path="/admin/backup" element={<ProtectedAdminRoute><AdminBackup /></ProtectedAdminRoute>} />
      <Route path="/admin/contact" element={<ProtectedAdminRoute><AdminContact /></ProtectedAdminRoute>} />
      <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

      {/* Catch-all Routing Redirect to Homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
