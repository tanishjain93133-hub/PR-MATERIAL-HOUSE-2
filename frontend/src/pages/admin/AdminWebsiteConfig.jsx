import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, ShieldCheck, FileUp, Globe, Settings } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminWebsiteConfig = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    websiteName: '',
    companyLogo: '',
    favicon: '',
    colors: { primary: '', accent: '', background: '', lightGray: '' },
    fonts: { headings: '', body: '' },
    socialLinks: { facebook: '', linkedin: '', twitter: '' },
    seo: { title: '', metaDescription: '', metaKeywords: '' },
    header: { announcementBar: '', showAnnouncement: true },
    footer: { copyrightText: '', aboutSnippet: '' },
    googleAnalyticsId: '',
    facebookPixelId: ''
  });

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings/website');
      if (res.data) {
        setForm({
          websiteName: res.data.websiteName || 'PR Material House',
          companyLogo: res.data.companyLogo || '',
          favicon: res.data.favicon || '',
          colors: res.data.colors || { primary: '#1F2937', accent: '#F97316', background: '#FFFFFF', lightGray: '#F3F4F6' },
          fonts: res.data.fonts || { headings: 'Outfit', body: 'Plus Jakarta Sans' },
          socialLinks: res.data.socialLinks || { facebook: '', linkedin: '', twitter: '' },
          seo: res.data.seo || { title: '', metaDescription: '', metaKeywords: '' },
          header: res.data.header || { announcementBar: '', showAnnouncement: true },
          footer: res.data.footer || { copyrightText: '', aboutSnippet: '' },
          googleAnalyticsId: res.data.googleAnalyticsId || '',
          facebookPixelId: res.data.facebookPixelId || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadConfig();
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    const formData = new FormData();
    formData.append('websiteName', form.websiteName);
    formData.append('colors', JSON.stringify(form.colors));
    formData.append('fonts', JSON.stringify(form.fonts));
    formData.append('socialLinks', JSON.stringify(form.socialLinks));
    formData.append('seo', JSON.stringify(form.seo));
    formData.append('header', JSON.stringify(form.header));
    formData.append('footer', JSON.stringify(form.footer));
    formData.append('googleAnalyticsId', form.googleAnalyticsId);
    formData.append('facebookPixelId', form.facebookPixelId);

    if (logoFile) {
      formData.append('logoFile', logoFile);
    } else {
      formData.append('companyLogo', form.companyLogo);
    }

    if (faviconFile) {
      formData.append('faviconFile', faviconFile);
    } else {
      formData.append('favicon', form.favicon);
    }

    try {
      await api.put('/settings/website', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadConfig();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save configurations.');
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Website Configurations" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-4xl w-full mx-auto text-left">
          
          <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm">
            {loading ? (
              <p className="text-xs text-gray-500">Loading configurations...</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs">
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-2xs font-bold flex items-center gap-1.5 animate-fade-in">
                    <ShieldCheck size={14} /> Website configurations updated successfully! Changes are live.
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-2xs">
                    {error}
                  </div>
                )}

                {/* General site variables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Website Display Name</label>
                    <input
                      type="text"
                      required
                      value={form.websiteName}
                      onChange={(e) => setForm({...form, websiteName: e.target.value})}
                      placeholder="e.g. PR Material House"
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Header Announcement Notice</label>
                    <input
                      type="text"
                      value={form.header.announcementBar}
                      onChange={(e) => setForm({...form, header: { ...form.header, announcementBar: e.target.value }})}
                      placeholder="e.g. Special discounts for registered builders"
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Theme colors */}
                <div className="border-b border-gray-100 pb-5 flex flex-col gap-3">
                  <h4 className="font-bold font-heading text-xs text-gray-900 flex items-center gap-1">
                    <Palette size={14} className="text-orange-500" />
                    Theme Design Tokens (Colors)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-450">Primary color</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={form.colors.primary}
                          onChange={(e) => setForm({...form, colors: { ...form.colors, primary: e.target.value }})}
                          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.colors.primary}
                          onChange={(e) => setForm({...form, colors: { ...form.colors, primary: e.target.value }})}
                          className="border border-gray-250 p-1.5 rounded text-xs outline-none w-20 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-455">Accent Highlight (Orange)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={form.colors.accent}
                          onChange={(e) => setForm({...form, colors: { ...form.colors, accent: e.target.value }})}
                          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={form.colors.accent}
                          onChange={(e) => setForm({...form, colors: { ...form.colors, accent: e.target.value }})}
                          className="border border-gray-250 p-1.5 rounded text-xs outline-none w-20 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Upload (Logo & Favicon) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-5">
                  <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <FileUp size={12} /> Company Header Logo
                    </span>
                    <input
                      type="file"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                      className="text-2xs text-gray-500"
                    />
                    <input
                      type="text"
                      value={form.companyLogo}
                      onChange={(e) => setForm({...form, companyLogo: e.target.value, logoFile: null})}
                      placeholder="Or Logo URL path"
                      className="border border-gray-250 p-2 rounded text-2xs bg-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <FileUp size={12} /> Browser Tab Favicon
                    </span>
                    <input
                      type="file"
                      onChange={(e) => setFaviconFile(e.target.files[0])}
                      className="text-2xs text-gray-500"
                    />
                    <input
                      type="text"
                      value={form.favicon}
                      onChange={(e) => setForm({...form, favicon: e.target.value, faviconFile: null})}
                      placeholder="Or Favicon URL path"
                      className="border border-gray-250 p-2 rounded text-2xs bg-white outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* SEO Meta Tags */}
                <div className="border-b border-gray-100 pb-5 flex flex-col gap-4">
                  <h4 className="font-bold font-heading text-xs text-gray-900 flex items-center gap-1">
                    <Globe size={14} className="text-orange-500" />
                    SEO Search Engine Parameters
                  </h4>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-450">SEO Document Title</label>
                    <input
                      type="text"
                      value={form.seo.title}
                      onChange={(e) => setForm({...form, seo: { ...form.seo, title: e.target.value }})}
                      placeholder="e.g. PR Material House | Premium Steel & Cement Supplier"
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-450">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={form.seo.metaDescription}
                      onChange={(e) => setForm({...form, seo: { ...form.seo, metaDescription: e.target.value }})}
                      placeholder="Brief overview indexed by crawlers"
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-455">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      value={form.seo.metaKeywords}
                      onChange={(e) => setForm({...form, seo: { ...form.seo, metaKeywords: e.target.value }})}
                      placeholder="cement, steel, CP fittings, builders supplier"
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Tracking & Integrations */}
                <div className="border-b border-gray-100 pb-5 flex flex-col gap-4">
                  <h4 className="font-bold font-heading text-xs text-gray-900 flex items-center gap-1">
                    <Globe size={14} className="text-orange-500" />
                    Tracking &amp; Analytics Integrations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-450">Google Analytics Measurement ID (G-XXXXXXXXXX)</label>
                      <input
                        type="text"
                        value={form.googleAnalyticsId}
                        onChange={(e) => setForm({...form, googleAnalyticsId: e.target.value})}
                        placeholder="G-XXXXXXXXXX"
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-455">Facebook Pixel ID</label>
                      <input
                        type="text"
                        value={form.facebookPixelId}
                        onChange={(e) => setForm({...form, facebookPixelId: e.target.value})}
                        placeholder="e.g. 123456789012345"
                        className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer and Socials */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Facebook Link</label>
                    <input
                      type="text"
                      value={form.socialLinks.facebook}
                      onChange={(e) => setForm({...form, socialLinks: { ...form.socialLinks, facebook: e.target.value }})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">LinkedIn Link</label>
                    <input
                      type="text"
                      value={form.socialLinks.linkedin}
                      onChange={(e) => setForm({...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value }})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Twitter Link</label>
                    <input
                      type="text"
                      value={form.socialLinks.twitter}
                      onChange={(e) => setForm({...form, socialLinks: { ...form.socialLinks, twitter: e.target.value }})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Footer Copyright Text</label>
                  <input
                    type="text"
                    value={form.footer.copyrightText}
                    onChange={(e) => setForm({...form, footer: { ...form.footer, copyrightText: e.target.value }})}
                    className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-md transition-all text-xs flex items-center justify-center gap-1.5 mt-2 self-start shadow-md"
                >
                  <Settings size={14} /> Update Site Configurations
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminWebsiteConfig;
