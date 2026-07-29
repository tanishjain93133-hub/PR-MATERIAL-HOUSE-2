import React, { useEffect, useState } from 'react';
import api, { resolveImageUrl } from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import { RotateCcw, Trash, AlertTriangle, X } from 'lucide-react';

const AdminTrash = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Permanent Delete Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchDeleted = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/trash');
      setDeletedProducts(res.data);
    } catch (err) {
      setError('Failed to fetch deleted products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeleted();
  }, []);

  const handleRestore = async (id, name) => {
    try {
      await api.put(`/products/${id}/restore`);
      setSuccess(`"${name}" restored successfully!`);
      fetchDeleted();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(`Failed to restore product: ${err.response?.data?.message || err.message}`);
      setTimeout(() => setError(''), 4000);
    }
  };

  const openConfirmModal = (product) => {
    setSelectedProduct(product);
    setShowConfirmModal(true);
  };

  const handlePermanentDelete = async () => {
    if (!selectedProduct) return;
    try {
      await api.delete(`/products/${selectedProduct._id}/permanent`);
      setSuccess(`"${selectedProduct.name}" permanently deleted.`);
      setShowConfirmModal(false);
      setSelectedProduct(null);
      fetchDeleted();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(`Failed to permanently delete product: ${err.response?.data?.message || err.message}`);
      setShowConfirmModal(false);
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        
        <main className="flex-1 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 flex items-center gap-3">
                🗑️ Recycle Bin
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage recently deleted products. You can restore them to active status or delete them permanently.
              </p>
            </div>
          </div>

          {/* Success / Error Banners */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg text-sm font-semibold animate-pulse">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Main content table */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-semibold">Loading Recycle Bin...</div>
            ) : deletedProducts.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-gray-800">Recycle Bin is Empty</h3>
                <p className="text-gray-500 text-sm mt-1">Products you delete will show up here for recovery.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold uppercase tracking-wider text-gray-600">
                      <th className="px-6 py-4">Product Image</th>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Brand</th>
                      <th className="px-6 py-4">Deleted At</th>
                      <th className="px-6 py-4">Deleted By</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-sm text-gray-700">
                    {deletedProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <img 
                            src={resolveImageUrl(p.image)} 
                            alt={p.name} 
                            className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-200"
                            onError={(e) => { e.target.src = '/cement.jpg'; }}
                          />
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">{p.name}</td>
                        <td className="px-6 py-4">{p.category?.name || 'N/A'}</td>
                        <td className="px-6 py-4">{p.brand?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                          {p.deletedAt ? new Date(p.deletedAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-bold">
                            {p.deletedBy || 'admin'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => handleRestore(p._id, p.name)}
                              className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all active:scale-95"
                              title="Restore to catalog"
                            >
                              <RotateCcw size={13} />
                              Restore
                            </button>
                            <button
                              onClick={() => openConfirmModal(p)}
                              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all active:scale-95"
                              title="Delete permanently"
                            >
                              <Trash size={13} />
                              Delete Forever
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle size={32} />
                <h3 className="font-heading font-extrabold text-xl">Delete Permanently</h3>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-medium">
                Are you sure you want to permanently delete <strong className="text-gray-900">"{selectedProduct.name}"</strong>?
              </p>
              <p className="text-gray-500 text-xs leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100 text-left">
                ⚠️ This action cannot be undone. All database records and uploaded image assets associated with this product will be permanently purged.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-150">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrash;
