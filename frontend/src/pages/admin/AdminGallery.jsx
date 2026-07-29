import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, X, FileUp, Image as ImageIcon, Copy, Play, Film } from 'lucide-react';
import api, { resolveImageUrl } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminGallery = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    type: 'image',
    image: '',
    imageFile: null
  });
  const [submitError, setSubmitError] = useState('');

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gallery');
      setGallery(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadGallery();
    }
  }, [userInfo]);

  const handleOpenAdd = () => {
    setForm({ title: '', category: 'Construction Projects', type: 'image', image: '', imageFile: null });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this media item from the portfolio gallery?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setGallery(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete gallery item.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.title || !form.category) {
      setSubmitError('Title and category are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('type', form.type);

    if (form.imageFile) {
      formData.append('imageFile', form.imageFile);
    } else {
      formData.append('image', form.image);
    }

    try {
      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModalOpen(false);
      loadGallery();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add media item.');
    }
  };

  const handleCopyLink = (path) => {
    const fullLink = path.startsWith('http') ? path : `${window.location.protocol}//${window.location.host}${path}`;
    navigator.clipboard.writeText(fullLink);
    alert('Link copied to clipboard: ' + fullLink);
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Media Gallery" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-gray-500 uppercase tracking-wider">Project Portfolio Media</h3>
            <button
              onClick={handleOpenAdd}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-md transition-all text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} />
              Add Media Item
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              <p className="text-xs">Fetching portfolio items...</p>
            </div>
          ) : gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map(item => (
                <div key={item._id} className="bg-white rounded-xl overflow-hidden shadow-xs border border-gray-150 flex flex-col group relative">
                  <div className="h-44 bg-gray-50 overflow-hidden relative">
                    {item.type === 'video' ? (
                      <video
                        src={resolveImageUrl(item.image)}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        preload="metadata"
                      />
                    ) : (
                      <img 
                        src={resolveImageUrl(item.image)} 
                        alt="" 
                        onError={(e) => { e.target.src = '/cement.jpg'; }}
                        className="w-full h-full object-cover" 
                      />
                    )}
                    
                    {/* Media Indicator Badge */}
                    <span className="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[8px] font-extrabold uppercase flex items-center gap-1">
                      {item.type === 'video' ? (
                        <>
                          <Film size={8} /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={8} /> Image
                        </>
                      )}
                    </span>

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => handleCopyLink(item.image)}
                        className="p-1.5 bg-gray-900/80 text-white rounded-md hover:bg-gray-900 transition-all shadow-md"
                        title="Copy Asset Path"
                      >
                        <Copy size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all shadow-md"
                        title="Remove Item"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow text-left flex justify-between items-start">
                    <div>
                      <h4 className="font-heading font-bold text-xs text-gray-900 line-clamp-1">{item.title}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-orange-500 mt-1 block">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyLink(item.image)}
                      className="text-gray-400 hover:text-orange-500 py-1 px-1.5 border border-gray-200 hover:border-orange-100 rounded text-3xs font-extrabold flex items-center gap-0.5 uppercase tracking-wider"
                    >
                      <Copy size={10} /> Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-xl bg-gray-50">
              <ImageIcon size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-xs text-gray-500">No project items registered in media showroom.</p>
            </div>
          )}
        </main>
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-up relative border border-gray-150 text-left">
            <div className="p-6 border-b border-gray-150 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-gray-900">Add Portfolio Item</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-705 bg-gray-100 p-1.5 rounded-full font-bold">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              {submitError && <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs">{submitError}</div>}
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Image Caption *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Slab casting for tower block"
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category Tab *</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="border border-gray-255 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none bg-white font-semibold"
                  >
                    <option value="Construction Projects">Construction Projects</option>
                    <option value="Interior Fitouts">Interior Fitouts</option>
                    <option value="Waterproofing">Waterproofing</option>
                    <option value="Hardware">Hardware Showcase</option>
                    <option value="Other Sites">Other Sites</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Media Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="border border-gray-255 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none bg-white font-semibold"
                  >
                    <option value="image">Static Image</option>
                    <option value="video">Ambient Video</option>
                  </select>
                </div>
              </div>

              {/* Photo file upload */}
              <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <FileUp size={12} /> Upload File ({form.type === 'video' ? 'video/*' : 'image/*'})
                  </label>
                  <input
                    type="file"
                    accept={form.type === 'video' ? 'video/*' : 'image/*'}
                    onChange={(e) => setForm({...form, imageFile: e.target.files[0]})}
                    className="text-2xs text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Or Media URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value, imageFile: null})}
                    placeholder={form.type === 'video' ? 'https://example.com/video.mp4' : '/cement.jpg'}
                    className="border border-gray-255 p-2 rounded-md text-2xs outline-none bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-250 rounded-md text-xs font-bold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
