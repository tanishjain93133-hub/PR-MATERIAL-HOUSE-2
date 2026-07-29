import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  FolderHeart, 
  Image, 
  MessageSquareQuote, 
  MailWarning, 
  PhoneCall, 
  Settings, 
  LogOut, 
  Globe,
  Users,
  Palette,
  Trash2,
  History,
  Database
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: FolderHeart },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MailWarning },
    { name: 'Users List', path: '/admin/users', icon: Users },
    { name: 'Website CMS', path: '/admin/website', icon: Palette },
    { name: 'Deleted Products', path: '/admin/trash', icon: Trash2 },
    { name: 'Activity Logs', path: '/admin/logs', icon: History },
    { name: 'Backup & Restore', path: '/admin/backup', icon: Database },
    { name: 'Contact Details', path: '/admin/contact', icon: PhoneCall },
    { name: 'General Settings', path: '/admin/settings', icon: Settings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col border-r border-gray-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="font-heading font-extrabold text-lg text-white">
            Admin Portal
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-grow p-4 flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                isActive(item.path)
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:text-white transition-all"
        >
          <Globe size={18} className="text-orange-500" />
          View Live Website
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
