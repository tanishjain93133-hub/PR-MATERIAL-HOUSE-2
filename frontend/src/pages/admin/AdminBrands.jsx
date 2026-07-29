import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, FileUp } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminBrands = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    logoFile: null,
    website: ''
  });
  const [submitError, setSubmitError] = useState('');

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get('/brands');
      setBrands(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadBrands();
    }
  }, [userInfo]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', logo: '', logoFile: null, website: '' });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingId(brand._id);
    setForm({
      name: brand.name,
      logo: brand.logo,
      logoFile: null,
      website: brand.website || ''
    });
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete brand supplier?')) return;
    try {
      await api.delete(`/brands/${id}`);
      setBrands(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete brand.');
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
    formData.append('website', form.website);

    if (form.logoFile) {
      formData.append('logoFile', form.logoFile);
    } else {
      formData.append('logo', form.logo);
    }

    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/brands', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModalOpen(false);
      loadBrands();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save brand.');
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Brands" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm text-gray-500 uppercase tracking-wider">Brand Suppliers List</h3>
            <button
              onClick={handleOpenAdd}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-md transition-all text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} />
              Add Brand
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-gray-500">
                <p className="text-xs">Fetching brands...</p>
              </div>
            ) : brands.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Logo</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Brand Name</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Website</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(brand => (
                    <tr key={brand._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-4 w-20">
                        <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center font-heading font-extrabold text-sm text-orange-500">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-gray-800">{brand.name}</td>
                      <td className="p-4 text-gray-500">{brand.website || '-'}</td>
                      <td className="p-4 text-right flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="p-1.5 bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
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
              <div className="py-16 text-center text-gray-500">
                <p className="text-xs">No brands found.</p>
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
                {editingId ? 'Edit Brand Info' : 'Add Brand Partner'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
              {submitError && <div className="p-2.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs">{submitError}</div>}
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. UltraTech"
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Website URL</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => setForm({...form, website: e.target.value})}
                  placeholder="e.g. https://www.ultratech.com"
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                />
              </div>

              {/* Logo File upload */}
              <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <FileUp size={12} /> Upload Logo File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setForm({...form, logoFile: e.target.files[0]})}
                    className="text-2xs text-gray-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Or Logo URL</label>
                  <input
                    type="text"
                    value={form.logo}
                    onChange={(e) => setForm({...form, logo: e.target.value, logoFile: null})}
                    placeholder="/favicon.svg"
                    className="border border-gray-250 p-2 rounded-md text-2xs outline-none bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-250 rounded-md text-xs font-bold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold">
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBrands;
