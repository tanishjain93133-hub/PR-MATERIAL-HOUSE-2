import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, ShieldCheck, Mail, MapPin, MessageSquare } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminContact = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    googleMapUrl: '',
    whatsappNumber: ''
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  useEffect(() => {
    const fetchContact = async () => {
      if (!userInfo) return;
      try {
        const res = await api.get('/settings/contact');
        if (res.data) {
          setForm({
            phone: res.data.phone || '',
            email: res.data.email || '',
            address: res.data.address || '',
            googleMapUrl: res.data.googleMapUrl || '',
            whatsappNumber: res.data.whatsappNumber || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      await api.put('/settings/contact', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact details.');
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Contact Details" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-2xl w-full mx-auto text-left">
          
          <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm">
            {loading ? (
              <p className="text-xs text-gray-500">Loading configurations...</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs">
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Contact configurations updated successfully!
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-250 text-red-600 rounded-lg text-2xs">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <PhoneCall size={12} className="text-orange-500" />
                    Phone Support Number
                  </label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="+91 99133 77965"
                    className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={12} className="text-orange-500" />
                    Email Specifications Inbox
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="prmaterialhouse@gmail.com"
                    className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare size={12} className="text-orange-500" />
                    WhatsApp Number (Digits only, including country code)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({...form, whatsappNumber: e.target.value})}
                    placeholder="e.g. 919913377965"
                    className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin size={12} className="text-orange-500" />
                    Office Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    placeholder="Enter physical corporate office address"
                    className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    Google Map Embed Iframe URL (src attribute)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.googleMapUrl}
                    onChange={(e) => setForm({...form, googleMapUrl: e.target.value})}
                    placeholder="Enter map HTTPS embed source URL"
                    className="border border-gray-250 p-3 rounded-md text-2xs outline-none focus:border-orange-500 resize-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-md transition-all text-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  Save Configurations
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminContact;
