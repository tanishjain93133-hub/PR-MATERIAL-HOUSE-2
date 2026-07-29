import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Building, AlertCircle, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    city: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/profile');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      username: form.username,
      email: form.email,
      password: form.password,
      phone: form.phone,
      companyName: form.companyName,
      city: form.city
    });
    setLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-xl mx-auto px-6 text-left">
      <div className="bg-white border border-gray-150 p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-orange-600">Client Portal</span>
          <h2 className="font-heading font-extrabold text-2xl text-gray-900 mt-1">Create B2B Buyer Account</h2>
          <p className="text-xs text-gray-500 mt-1">Join PR Material House to track quotes and streamline deliveries.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs mb-6 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Username *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({...form, username: e.target.value})}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <Mail size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <Lock size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Phone Contact *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({...form, companyName: e.target.value})}
                  placeholder="e.g. Apex Infra Ltd"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <Building size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">City *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({...form, city: e.target.value})}
                  placeholder="e.g. Navi Mumbai"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-250 text-gray-900 rounded-lg text-xs focus:border-orange-500 focus:bg-white outline-none transition-all"
                />
                <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-lg transition-all shadow-md shadow-orange-500/10 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="text-orange-600 hover:underline font-bold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
