import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Star, FileUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminTestimonials = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    text: '',
    rating: 5,
    hide: false,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitError, setSubmitError] = useState('');

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadTestimonials();
    }
  }, [userInfo]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', role: '', text: '', rating: 5, hide: false, image: '' });
    setImageFile(null);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (test) => {
    setEditingId(test._id);
    setForm({
      name: test.name,
      role: test.role,
      text: test.text,
      rating: test.rating || 5,
      hide: test.hide || false,
      image: test.image || ''
    });
    setImageFile(null);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete review.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.name || !form.role || !form.text) {
      setSubmitError('Please fill in name, role, and message fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('role', form.role);
    formData.append('text', form.text);
    formData.append('rating', form.rating);
    formData.append('hide', form.hide);

    if (imageFile) {
      formData.append('imageFile', imageFile);
    } else {
      formData.append('image', form.image);
    }

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/testimonials', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModalOpen(false);
      loadTestimonials();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save review.');
    }
  };

  const handleToggleHide = async (test) => {
    try {
      const nextHide = !test.hide;
      await api.put(`/testimonials/${test._id}`, { ...test, hide: nextHide });
      setTestimonials(prev => prev.map(t => t._id === test._id ? { ...t, hide: nextHide } : t));
    } catch (err) {
      console.error(err);
      alert('Failed to toggle visibility.');
    }
  };

  if (authLoading) return null;

  const base = api.defaults.baseURL || '';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Testimonials" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-gray-500 uppercase tracking-wider">Client Reviews CMS</h3>
            <button
              onClick={handleOpenAdd}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold text-2xs px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> Add Review
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center items-center text-gray-500 text-xs">
                <Loader2 className="animate-spin text-orange-500 mr-2" size={18} />
                Loading reviews...
              </div>
            ) : testimonials.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Customer Details</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Review Statement</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Rating</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Visibility</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map(test => (
                    <tr key={test._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {test.image ? (
                            <img
                              src={test.image.startsWith('http') ? test.image : `${base}${test.image}`}
                              alt={test.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase border border-orange-200">
                              {test.name.substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-800">{test.name}</h4>
                            <p className="text-3xs text-gray-450 mt-0.5">{test.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-550 max-w-xs truncate">
                        "{test.text}"
                      </td>
                      <td className="p-4 text-orange-400 font-bold flex items-center gap-0.5 mt-3">
                        <Star size={12} className="fill-orange-400" />
                        {test.rating || 5} / 5
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleHide(test)}
                          className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase py-1 px-2.5 rounded-full border transition-all ${
                            test.hide
                              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                          }`}
                        >
                          {test.hide ? (
                            <>
                              <EyeOff size={11} /> Hidden
                            </>
                          ) : (
                            <>
                              <Eye size={11} /> Visible
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="p-1.5 bg-gray-100 hover:bg-orange-50 text-gray-650 hover:text-orange-600 rounded transition-all"
                          title="Edit Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(test._id)}
                          className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-650 hover:text-red-655 rounded transition-all"
                          title="Delete Review"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p className="text-xs">No customer testimonials found.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-250 overflow-hidden text-left text-xs animate-scale-up">
            <div className="bg-gray-50 border-b border-gray-150 p-4 flex justify-between items-center">
              <h3 className="font-heading font-bold text-sm text-gray-900">
                {editingId ? 'Edit Customer Review' : 'Create New Review Card'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold font-mono text-base"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 flex flex-col gap-4">
              {submitError && <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-md font-medium text-2xs">{submitError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Client Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Designation / Role (e.g. Builder)</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Rating Stars (1-5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="border border-gray-255 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Satisfactory</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terribe</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Visibility Option</label>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="hide-check"
                      checked={form.hide}
                      onChange={(e) => setForm({ ...form, hide: e.target.checked })}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400 cursor-pointer"
                    />
                    <label htmlFor="hide-check" className="text-2xs font-semibold text-gray-600 cursor-pointer">Hide review from home</label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Client Photo</label>
                <div className="relative border border-dashed border-gray-250 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 truncate max-w-[200px]">
                    {imageFile ? imageFile.name : form.image ? 'Custom photo path set' : 'Choose JPG/PNG...'}
                  </span>
                  <label className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded cursor-pointer font-bold text-[10px] flex items-center gap-1 border border-gray-200">
                    <FileUp size={12} />
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="Or raw URL link path"
                  className="border border-gray-250 p-2 rounded text-2xs mt-1 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Review Message Statement</label>
                <textarea
                  required
                  rows={4}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md"
                >
                  {editingId ? 'Apply Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
