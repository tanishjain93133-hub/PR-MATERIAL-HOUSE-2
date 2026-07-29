import React, { useContext, useState, useEffect } from 'react';
import { User, ShieldAlert, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { resolveImageUrl } from '../utils/api';

const AdminNavbar = ({ title = 'Dashboard' }) => {
  const { userInfo } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('adminTheme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('admin-dark-theme');
      localStorage.setItem('adminTheme', 'dark');
    } else {
      document.body.classList.remove('admin-dark-theme');
      localStorage.setItem('adminTheme', 'light');
    }
  }, [isDark]);

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shadow-sm header-theme transition-all duration-200">
      <h2 className="font-heading font-extrabold text-xl text-gray-800 tracking-tight header-title transition-colors">
        {title}
      </h2>

      <div className="flex items-center gap-6">
        {/* Connection Status Flag */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-orange-50 text-orange-700 py-1 px-3 rounded-full border border-orange-100 session-badge transition-colors">
          <ShieldAlert size={12} />
          Super Admin Session
        </div>

        {/* Theme Toggle Switch */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all text-gray-500 hover:text-gray-800 theme-toggle-btn cursor-pointer"
          title="Toggle Light/Dark Mode"
        >
          {isDark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} />}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            {userInfo?.profilePhoto ? (
              <img 
                src={resolveImageUrl(userInfo.profilePhoto)} 
                alt=""
                onError={(e) => { e.target.src = '/cement.jpg'; }}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-800 leading-tight profile-name transition-colors">
              {userInfo?.username || 'Administrator'}
            </h4>
            <p className="text-2xs text-gray-500 font-medium profile-email transition-colors">
              {userInfo?.email || 'admin@prmaterial.com'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
