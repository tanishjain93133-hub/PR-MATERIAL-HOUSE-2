import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, FileUp, ArrowUp, ArrowDown, Eye, EyeOff, Tag, Loader2 } from 'lucide-react';
import api, { resolveImageUrl } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminCategories = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    hide: false,
    image: '',
    imageFile: null
  });
  const [submitError, setSubmitError] = useState('');

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      // Already sorted by 'order' from backend
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadCategories();
    }
  }, [userInfo]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', icon: 'Shield', hide: false, image: '', imageFile: null });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || '',
      hide: cat.hide || false,
      image: cat.image,
      imageFile: null
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? Warning: Products linked to this category might be affected.')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.name) {
      setSubmitError('Name is required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('description', form.description);
    formData.append('icon', form.icon);
    formData.append('hide', form.hide);

    if (form.imageFile) {
      formData.append('imageFile', form.imageFile);
    } else {
      formData.append('image', form.image);
    }

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleToggleHide = async (cat) => {
    try {
      const nextHide = !cat.hide;
      await api.put(`/categories/${cat._id}`, { ...cat, hide: nextHide });
      setCategories(prev => prev.map(c => c._id === cat._id ? { ...c, hide: nextHide } : c));
    } catch (err) {
      console.error(err);
      alert('Failed to toggle visibility.');
    }
  };

  const handleMove = async (index, direction) => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCategories.length) return;
    
    // Swap items in memory
    const temp = newCategories[index];
    newCategories[index] = newCategories[targetIndex];
    newCategories[targetIndex] = temp;
    
    // Assign new order sequence values
    const ordersPayload = newCategories.map((cat, idx) => ({
      id: cat._id,
      order: idx
    }));
    
    setCategories(newCategories);
    
    try {
      await api.post('/categories/reorder', { orders: ordersPayload });
    } catch (err) {
      console.error(err);
      alert('Failed to persist sorting order in database.');
      loadCategories(); // rollback
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Categories" />
        
        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-gray-500 uppercase tracking-wider">Product Categories List</h3>
            <button
              onClick={handleOpenAdd}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-md transition-all text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center items-center text-gray-500 text-xs">
                <Loader2 className="animate-spin text-orange-500 mr-2" size={18} />
                Loading categories...
              </div>
            ) : categories.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide w-16">Sort</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Image</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Name &amp; Slug</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Icon Name</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Visibility</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, idx) => (
                    <tr key={cat._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-4 w-16">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMove(idx, 'up')}
                            className="p-0.5 hover:bg-gray-100 rounded text-gray-450 disabled:opacity-30"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            disabled={idx === categories.length - 1}
                            onClick={() => handleMove(idx, 'down')}
                            className="p-0.5 hover:bg-gray-100 rounded text-gray-455 disabled:opacity-30"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="p-4 w-20">
                        <div className="w-12 h-12 bg-gray-50 border border-gray-150 rounded-lg overflow-hidden">
                          <img 
                            src={resolveImageUrl(cat.image)} 
                            alt="" 
                            onError={(e) => { e.target.src = '/cement.jpg'; }}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <h4 className="font-bold text-gray-800">{cat.name}</h4>
                        <code className="text-3xs text-orange-550 font-mono mt-0.5 block">{cat.slug}</code>
                      </td>
                      <td className="p-4 font-semibold text-gray-600 font-mono">
                        {cat.icon || '-'}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleHide(cat)}
                          className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase py-1 px-2.5 rounded-full border transition-all ${
                            cat.hide
                              ? 'bg-red-50 text-red-650 border-red-100 hover:bg-red-100'
                              : 'bg-green-50 text-green-650 border-green-100 hover:bg-green-100'
                          }`}
                        >
                          {cat.hide ? (
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
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p className="text-xs">No categories found.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-up relative border border-gray-150 text-left">
            <div className="p-6 border-b border-gray-150 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full font-bold">
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              {submitError && <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs">{submitError}</div>}
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category Slug (Optional)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({...form, slug: e.target.value})}
                    placeholder="cement-TMT"
                    className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lucide Icon Class</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({...form, icon: e.target.value})}
                    placeholder="e.g. ShieldCheck"
                    className="border border-gray-255 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Visibility Option</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="cat-hide-check"
                    checked={form.hide}
                    onChange={(e) => setForm({ ...form, hide: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400 cursor-pointer"
                  />
                  <label htmlFor="cat-hide-check" className="text-2xs font-semibold text-gray-600 cursor-pointer">Hide category from homepage &amp; header</label>
                </div>
              </div>

              {/* Photo file upload */}
              <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <FileUp size={12} /> Upload Photo File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setForm({...form, imageFile: e.target.files[0]})}
                    className="text-2xs text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Or Photo URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({...form, image: e.target.value, imageFile: null})}
                    placeholder="/cement.jpg"
                    className="border border-gray-255 p-2 rounded-md text-2xs outline-none bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description Details</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-255 rounded-md text-xs font-bold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
