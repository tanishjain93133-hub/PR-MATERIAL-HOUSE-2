import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Building, KeyRound, CheckCircle, FileText, Settings, LogOut, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const CustomerProfile = () => {
  const { userInfo, updateProfile, logout, changePassword, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('history'); // history | profile
  const [enquiries, setEnquiries] = useState([]);
  const [enqLoading, setEnqLoading] = useState(true);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    email: '',
    phone: '',
    companyName: '',
    city: ''
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password States
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/login');
    }
  }, [userInfo, authLoading, navigate]);

  // Load user profile details into form
  useEffect(() => {
    if (userInfo) {
      setProfileForm({
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        companyName: userInfo.companyName || '',
        city: userInfo.city || ''
      });
      loadEnquiries();
    }
  }, [userInfo]);

  const loadEnquiries = async () => {
    try {
      setEnqLoading(true);
      const res = await api.get('/enquiries/my');
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEnqLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileLoading(true);

    const result = await updateProfile(profileForm);
    setProfileLoading(false);

    if (result.success) {
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } else {
      setProfileError(result.message);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }

    setPassLoading(true);
    const result = await changePassword(passForm.oldPassword, passForm.newPassword);
    setPassLoading(false);

    if (result.success) {
      setPassSuccess('Password updated successfully!');
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassSuccess(''), 3000);
    } else {
      setPassError(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || !userInfo) return null;

  return (
    <div className="pt-28 pb-20 bg-gray-50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-heading font-black text-xl mx-auto mb-4 border border-orange-200">
              {userInfo.username.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-heading font-extrabold text-sm text-gray-900 line-clamp-1">{userInfo.username}</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{userInfo.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-orange-50 border border-orange-100 text-[9px] font-bold text-orange-600 rounded-full uppercase tracking-wider">
              {userInfo.role}
            </span>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden flex flex-col text-xs font-bold">
            <button
              onClick={() => setActiveTab('history')}
              className={`p-4 border-b border-gray-100 flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'history' 
                  ? 'bg-orange-50/50 text-orange-600 border-r-4 border-r-orange-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={16} />
              Enquiry History
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-4 border-b border-gray-100 flex items-center gap-2.5 transition-all text-left ${
                activeTab === 'profile' 
                  ? 'bg-orange-50/50 text-orange-600 border-r-4 border-r-orange-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={16} />
              Account Settings
            </button>
            <button
              onClick={handleLogout}
              className="p-4 text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-all text-left"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3">
          {activeTab === 'history' ? (
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">Your Sent Quotation Enquiries</h3>
                <p className="text-3xs text-gray-400 mt-0.5">Track reviews and completions status.</p>
              </div>

              {enqLoading ? (
                <div className="py-20 flex justify-center items-center text-gray-400 text-xs">
                  <Loader2 className="animate-spin text-orange-500 mr-2" size={18} />
                  Loading enquiries...
                </div>
              ) : enquiries.length > 0 ? (
                <div className="flex flex-col gap-4 text-xs">
                  {enquiries.map(enq => (
                    <div key={enq._id} className="border border-gray-150 rounded-xl p-5 hover:shadow-sm transition-all text-left">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                          <span className="text-[10px] text-gray-450 block">{new Date(enq.createdAt).toLocaleDateString()}</span>
                          <h4 className="font-bold text-gray-800 text-sm mt-0.5">{enq.productName || 'General Inquiry'}</h4>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider py-1 px-3 border rounded-full ${
                          enq.status === 'Pending' 
                            ? 'bg-orange-50 text-orange-600 border-orange-100' 
                            : enq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-2xs mb-3">
                        <div>
                          <span className="text-gray-400 font-bold block">Company Name</span>
                          <span className="text-gray-700 font-semibold">{enq.companyName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block">Location City</span>
                          <span className="text-gray-700 font-semibold">{enq.city || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block">Registered Phone</span>
                          <span className="text-gray-700 font-semibold">{enq.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block">Category Tag</span>
                          <span className="text-gray-700 font-semibold">{enq.category || 'General'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wide font-bold">Your Project Requirements Details</span>
                        <p className="text-gray-600 leading-relaxed mt-1 text-2xs font-normal bg-gray-50/50 p-2.5 rounded border border-gray-100">{enq.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <p>You haven't submitted any quote requests yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Profile Details */}
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 border-b border-gray-150 pb-3 flex items-center gap-2 mb-5">
                  <User size={16} className="text-orange-500" />
                  Personal &amp; Company Details
                </h3>

                <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 text-xs">
                  {profileSuccess && <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold">{profileSuccess}</div>}
                  {profileError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-2xs">{profileError}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Company Name</label>
                      <input
                        type="text"
                        value={profileForm.companyName}
                        onChange={(e) => setForm({...profileForm, companyName: e.target.value})}
                        className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                        placeholder="Apex Construction Ltd"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Location City</label>
                      <input
                        type="text"
                        required
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                        className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-md text-xs self-start mt-2"
                  >
                    {profileLoading ? 'Saving...' : 'Update Details'}
                  </button>
                </form>
              </div>

              {/* Password update */}
              <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-left">
                <h3 className="font-heading font-extrabold text-sm text-gray-900 border-b border-gray-150 pb-3 flex items-center gap-2 mb-5">
                  <KeyRound size={16} className="text-orange-500" />
                  Reset Password Session
                </h3>

                <form onSubmit={handlePassSubmit} className="flex flex-col gap-4 text-xs">
                  {passSuccess && <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold">{passSuccess}</div>}
                  {passError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-2xs">{passError}</div>}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passForm.oldPassword}
                      onChange={(e) => setPassForm({...passForm, oldPassword: e.target.value})}
                      placeholder="••••••••"
                      className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">New Password</label>
                    <input
                      type="password"
                      required
                      value={passForm.newPassword}
                      onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                      placeholder="Min 6 characters"
                      className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passForm.confirmPassword}
                      onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      className="border border-gray-250 p-3 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passLoading}
                    className="btn bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-md text-xs self-start mt-2"
                  >
                    {passLoading ? 'Updating...' : 'Change Password'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomerProfile;
