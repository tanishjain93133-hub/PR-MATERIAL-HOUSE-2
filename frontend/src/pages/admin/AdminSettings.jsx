import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings2, ShieldCheck, ShieldAlert, KeyRound, Palette, Eye, FileUp, EyeOff } from 'lucide-react';
import api, { resolveImageUrl } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminSettings = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('hero'); // hero, about, why, stats, cta, seo

  // Homepage Content State
  const [homeForm, setHomeForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroTagline: '',
    heroBgType: 'color',
    heroBgUrl: '',
    heroBgColor: '#F9FAFB',
    heroVideoUrl: '',
    heroBtnText: 'Explore Products',
    heroBtnLink: '/products',
    heroSecBtnText: 'Get a Quote',
    heroSecBtnLink: '/contact',
    heroAnimation: 'fade',
    aboutTitle: '',
    aboutSubtitle: '',
    aboutText: '',
    ctaTitle: '',
    ctaSubtitle: '',
    ctaBtnText: 'Get a Customized Quote',
    ctaBtnLink: '/contact',
    seoTitle: '',
    seoMetaDescription: '',
    whyChooseUs: [
      { title: 'Premium Quality', desc: 'Every batch undergoes rigorous quality validation checkups.', iconName: 'ShieldCheck' },
      { title: 'Trusted Brands', desc: 'Official authorized supply pipeline for market leaders.', iconName: 'Award' },
      { title: 'Competitive Rates', desc: 'Highly affordable B2B wholesale pricing strategies.', iconName: 'TrendingUp' }
    ],
    stats: [
      { value: '15+', label: 'Years Experience' },
      { value: '500+', label: 'Projects Supplied' },
      { value: '12+', label: 'Premium Brands' },
      { value: '10K+', label: 'Tons Cement Supplied' }
    ]
  });

  const [heroImageFile, setHeroImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [ctaBgImageFile, setCtaBgImageFile] = useState(null);

  const [homeLoading, setHomeLoading] = useState(true);
  const [homeSuccess, setHomeSuccess] = useState(false);
  const [homeError, setHomeError] = useState('');

  // Admin Profile Account State
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    profilePhotoFile: null
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  // Load account info when userInfo is ready
  useEffect(() => {
    if (userInfo) {
      setProfileForm(prev => ({
        ...prev,
        username: userInfo.username || '',
        email: userInfo.email || '',
        profilePhoto: userInfo.profilePhoto || ''
      }));
    }
  }, [userInfo]);

  const fetchHomeContent = async () => {
    if (!userInfo) return;
    try {
      setHomeLoading(true);
      const res = await api.get('/settings/homepage');
      if (res.data) {
        setHomeForm({
          heroTitle: res.data.heroTitle || '',
          heroSubtitle: res.data.heroSubtitle || '',
          heroTagline: res.data.heroTagline || '',
          heroBgType: res.data.heroBgType || 'color',
          heroBgUrl: res.data.heroBgUrl || '',
          heroBgColor: res.data.heroBgColor || '#F9FAFB',
          heroVideoUrl: res.data.heroVideoUrl || '',
          heroBtnText: res.data.heroBtnText || 'Explore Products',
          heroBtnLink: res.data.heroBtnLink || '/products',
          heroSecBtnText: res.data.heroSecBtnText || 'Get a Quote',
          heroSecBtnLink: res.data.heroSecBtnLink || '/contact',
          heroAnimation: res.data.heroAnimation || 'fade',
          aboutTitle: res.data.aboutTitle || '',
          aboutSubtitle: res.data.aboutSubtitle || '',
          aboutText: res.data.aboutText || '',
          ctaTitle: res.data.ctaTitle || '',
          ctaSubtitle: res.data.ctaSubtitle || '',
          ctaBtnText: res.data.ctaBtnText || 'Get a Customized Quote',
          ctaBtnLink: res.data.ctaBtnLink || '/contact',
          seoTitle: res.data.seoTitle || '',
          seoMetaDescription: res.data.seoMetaDescription || '',
          whyChooseUs: res.data.whyChooseUs && res.data.whyChooseUs.length > 0 
            ? res.data.whyChooseUs 
            : homeForm.whyChooseUs,
          stats: res.data.stats && res.data.stats.length > 0 
            ? res.data.stats 
            : homeForm.stats
        });
      }
    } catch (err) {
      console.error('Failed to load home config:', err);
    } finally {
      setHomeLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchHomeContent();
    }
  }, [userInfo]);

  const handleHomeSubmit = async (e) => {
    e.preventDefault();
    setHomeSuccess(false);
    setHomeError('');

    const formData = new FormData();
    Object.keys(homeForm).forEach((key) => {
      if (key === 'whyChooseUs' || key === 'stats') {
        formData.append(key, JSON.stringify(homeForm[key]));
      } else {
        formData.append(key, homeForm[key]);
      }
    });

    if (heroImageFile) formData.append('heroImageFile', heroImageFile);
    if (aboutImageFile) formData.append('aboutImageFile', aboutImageFile);
    if (ctaBgImageFile) formData.append('ctaBgImageFile', ctaBgImageFile);

    try {
      await api.put('/settings/homepage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHomeSuccess(true);
      setTimeout(() => setHomeSuccess(false), 3000);
      fetchHomeContent();
    } catch (err) {
      setHomeError(err.response?.data?.message || 'Failed to update homepage content.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setProfileError('Passwords do not match.');
      return;
    }

    setProfileLoading(true);
    const formData = new FormData();
    formData.append('username', profileForm.username);
    formData.append('email', profileForm.email);
    if (profileForm.password) {
      formData.append('password', profileForm.password);
    }
    if (profileForm.profilePhotoFile) {
      formData.append('profilePhotoFile', profileForm.profilePhotoFile);
    } else {
      formData.append('profilePhoto', profileForm.profilePhoto);
    }

    try {
      const res = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileSuccess(true);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleWhyChange = (idx, field, value) => {
    const updated = [...homeForm.whyChooseUs];
    updated[idx][field] = value;
    setHomeForm({ ...homeForm, whyChooseUs: updated });
  };

  const handleStatChange = (idx, field, value) => {
    const updated = [...homeForm.stats];
    updated[idx][field] = value;
    setHomeForm({ ...homeForm, stats: updated });
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="General Settings" />

        <main className="flex-grow p-8 flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto text-left">
          {/* Left Panel: Homepage CMS builder */}
          <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm flex-grow lg:w-2/3">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-150">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-2">
                <Settings2 size={16} className="text-orange-500" />
                CMS Sections Builder
              </h3>
              <span className="text-[10px] bg-orange-50 text-orange-600 font-extrabold uppercase px-2 py-1 rounded">No Code Required</span>
            </div>

            {/* CMS Tab Nav */}
            <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg mb-6">
              {[
                { id: 'hero', label: 'Hero Banner' },
                { id: 'about', label: 'About Section' },
                { id: 'why', label: 'Why Choose Us' },
                { id: 'stats', label: 'Statistics' },
                { id: 'cta', label: 'CTA & Footer' },
                { id: 'seo', label: 'SEO Metadata' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md font-bold text-2xs transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {homeLoading ? (
              <p className="text-xs text-gray-500 py-10 text-center">Loading homepage parameters...</p>
            ) : (
              <form onSubmit={handleHomeSubmit} className="flex flex-col gap-5 text-xs">
                {homeSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Homepage builder sections saved successfully! Changes are live.
                  </div>
                )}
                {homeError && (
                  <div className="p-3 bg-red-50 border border-red-255 text-red-600 rounded-lg text-2xs">
                    {homeError}
                  </div>
                )}

                {/* --- HERO BANNER TAB --- */}
                {activeTab === 'hero' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hero Main Title *</label>
                      <input
                        type="text"
                        required
                        value={homeForm.heroTitle}
                        onChange={(e) => setHomeForm({...homeForm, heroTitle: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hero Subtitle Text *</label>
                      <textarea
                        required
                        rows={2}
                        value={homeForm.heroSubtitle}
                        onChange={(e) => setHomeForm({...homeForm, heroSubtitle: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hero Accent Tagline</label>
                        <input
                          type="text"
                          value={homeForm.heroTagline}
                          onChange={(e) => setHomeForm({...homeForm, heroTagline: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hero Entrance Animation</label>
                        <select
                          value={homeForm.heroAnimation}
                          onChange={(e) => setHomeForm({...homeForm, heroAnimation: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 bg-white"
                        >
                          <option value="fade">Fade In</option>
                          <option value="slide">Slide Up</option>
                          <option value="scale">Scale Center</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Primary Button Label</label>
                        <input
                          type="text"
                          value={homeForm.heroBtnText}
                          onChange={(e) => setHomeForm({...homeForm, heroBtnText: e.target.value})}
                          className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Primary Button Link</label>
                        <input
                          type="text"
                          value={homeForm.heroBtnLink}
                          onChange={(e) => setHomeForm({...homeForm, heroBtnLink: e.target.value})}
                          className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Secondary Button Label</label>
                        <input
                          type="text"
                          value={homeForm.heroSecBtnText}
                          onChange={(e) => setHomeForm({...homeForm, heroSecBtnText: e.target.value})}
                          className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Hero Background Mode</label>
                          <select
                            value={homeForm.heroBgType}
                            onChange={(e) => setHomeForm({...homeForm, heroBgType: e.target.value})}
                            className="border border-gray-255 p-2 rounded-md text-xs outline-none focus:border-orange-500 bg-white"
                          >
                            <option value="color">Solid Background Color</option>
                            <option value="image">Uploaded Image Cover</option>
                            <option value="video">Ambient loop MP4 Video</option>
                          </select>
                        </div>
                        {homeForm.heroBgType === 'color' && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Background Color Picker</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={homeForm.heroBgColor}
                                onChange={(e) => setHomeForm({...homeForm, heroBgColor: e.target.value})}
                                className="w-10 h-10 border border-gray-255 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={homeForm.heroBgColor}
                                onChange={(e) => setHomeForm({...homeForm, heroBgColor: e.target.value})}
                                className="border border-gray-255 p-2 rounded text-xs w-28 outline-none"
                              />
                            </div>
                          </div>
                        )}
                        {homeForm.heroBgType === 'video' && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Ambient Video MP4 URL</label>
                            <input
                              type="text"
                              value={homeForm.heroVideoUrl}
                              placeholder="e.g. /uploads/video.mp4"
                              onChange={(e) => setHomeForm({...homeForm, heroVideoUrl: e.target.value})}
                              className="border border-gray-255 p-2 rounded text-xs outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                            <FileUp size={12} /> Upload Hero Layout Photo
                          </label>
                          <input
                            type="file"
                            onChange={(e) => setHeroImageFile(e.target.files[0])}
                            className="text-2xs text-gray-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Or Image Link URL</label>
                          <input
                            type="text"
                            value={homeForm.heroBgUrl}
                            placeholder="/cement.jpg"
                            onChange={(e) => setHomeForm({...homeForm, heroBgUrl: e.target.value})}
                            className="border border-gray-255 p-2 rounded text-xs outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- ABOUT US TAB --- */}
                {activeTab === 'about' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Section Main Title</label>
                        <input
                          type="text"
                          value={homeForm.aboutTitle}
                          onChange={(e) => setHomeForm({...homeForm, aboutTitle: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Section Tagline</label>
                        <input
                          type="text"
                          value={homeForm.aboutSubtitle}
                          onChange={(e) => setHomeForm({...homeForm, aboutSubtitle: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Biography description Details</label>
                      <textarea
                        rows={5}
                        value={homeForm.aboutText}
                        onChange={(e) => setHomeForm({...homeForm, aboutText: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                        <FileUp size={12} /> Upload Biography banner Photo
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setAboutImageFile(e.target.files[0])}
                        className="text-2xs text-gray-500 mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* --- WHY CHOOSE US TAB --- */}
                {activeTab === 'why' && (
                  <div className="flex flex-col gap-6 animate-fade-in">
                    {homeForm.whyChooseUs.map((card, i) => (
                      <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
                        <span className="font-bold text-[10px] text-orange-500 uppercase tracking-wider">Features Card #{i + 1}</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Card Title</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => handleWhyChange(i, 'title', e.target.value)}
                              className="border border-gray-250 p-2 rounded-md outline-none bg-white focus:border-orange-500"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lucide Icon Class</label>
                            <input
                              type="text"
                              value={card.iconName}
                              onChange={(e) => handleWhyChange(i, 'iconName', e.target.value)}
                              placeholder="e.g. ShieldCheck"
                              className="border border-gray-250 p-2 rounded-md outline-none bg-white focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Card Description</label>
                          <input
                            type="text"
                            value={card.desc}
                            onChange={(e) => handleWhyChange(i, 'desc', e.target.value)}
                            className="border border-gray-250 p-2 rounded-md outline-none bg-white focus:border-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- STATISTICS TAB --- */}
                {activeTab === 'stats' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    {homeForm.stats.map((stat, i) => (
                      <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
                        <span className="font-bold text-[10px] text-orange-500 uppercase tracking-wider">Counters Card #{i + 1}</span>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Value (Number String)</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                            className="border border-gray-250 p-2 rounded-md outline-none bg-white focus:border-orange-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Label Text</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                            className="border border-gray-250 p-2 rounded-md outline-none bg-white focus:border-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- CTA & FOOTER TAB --- */}
                {activeTab === 'cta' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CTA Banner Title</label>
                      <input
                        type="text"
                        value={homeForm.ctaTitle}
                        onChange={(e) => setHomeForm({...homeForm, ctaTitle: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CTA Banner Subtitle</label>
                      <input
                        type="text"
                        value={homeForm.ctaSubtitle}
                        onChange={(e) => setHomeForm({...homeForm, ctaSubtitle: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Button Label</label>
                        <input
                          type="text"
                          value={homeForm.ctaBtnText}
                          onChange={(e) => setHomeForm({...homeForm, ctaBtnText: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Button Redirect Link</label>
                        <input
                          type="text"
                          value={homeForm.ctaBtnLink}
                          onChange={(e) => setHomeForm({...homeForm, ctaBtnLink: e.target.value})}
                          className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                        <FileUp size={12} /> Upload CTA Background cover
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setCtaBgImageFile(e.target.files[0])}
                        className="text-2xs text-gray-500 mt-1"
                      />
                    </div>
                  </div>
                )}

                {/* --- SEO TAB --- */}
                {activeTab === 'seo' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Homepage Browser Title (SEO)</label>
                      <input
                        type="text"
                        required
                        value={homeForm.seoTitle}
                        onChange={(e) => setHomeForm({...homeForm, seoTitle: e.target.value})}
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Crawler Meta Description (SEO)</label>
                      <textarea
                        required
                        rows={4}
                        value={homeForm.seoMetaDescription}
                        onChange={(e) => setHomeForm({...homeForm, seoMetaDescription: e.target.value})}
                        className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-5 rounded-md text-xs self-start mt-4 flex items-center gap-1.5"
                >
                  <Eye size={14} />
                  Save CMS Configuration Changes
                </button>
              </form>
            )}
          </div>

          {/* Right Panel: Admin Account Settings */}
          <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm w-full lg:w-1/3">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-150 pb-3 flex items-center gap-2 mb-5">
              <KeyRound size={16} className="text-orange-500" />
              Admin Account
            </h3>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 text-xs">
              {profileSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Account updated successfully!
                </div>
              )}
              {profileError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-2xs flex items-center gap-1">
                  <ShieldAlert size={12} className="shrink-0" /> {profileError}
                </div>
              )}

              {/* Profile Photo Display & Upload */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-150 rounded-lg mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 bg-white shrink-0">
                  <img 
                    src={resolveImageUrl(profileForm.profilePhoto) || '/cement.jpg'} 
                    alt="Profile Avatar"
                    onError={(e) => { e.target.src = '/cement.jpg'; }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Change Profile Photo</label>
                  <input
                    type="file"
                    onChange={(e) => setProfileForm({ ...profileForm, profilePhotoFile: e.target.files[0] })}
                    className="text-3xs text-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Username *</label>
                <input
                  type="text"
                  required
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({...profileForm, username: e.target.value})}
                  className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address *</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                />
              </div>

              <hr className="border-gray-100 my-2" />

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                  placeholder="Enter new password"
                  className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-5 rounded-md text-xs mt-2 w-full flex justify-center items-center"
              >
                {profileLoading ? 'Saving...' : 'Update Account Details'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
