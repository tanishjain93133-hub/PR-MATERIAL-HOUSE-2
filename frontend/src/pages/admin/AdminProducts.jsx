import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, PlusCircle, MinusCircle, FileUp, Sparkles, Star, ArrowLeft, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import api, { resolveImageUrl } from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminProducts = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    availability: true,
    price: 0,
    featured: false,
    bestSeller: false,
    newArrival: false,
    images: [],
    imageFiles: [],
    primaryImage: ''
  });

  // Dynamic Array Fields in Form
  const [features, setFeatures] = useState(['']);
  const [specifications, setSpecifications] = useState([{ name: '', value: '' }]);
  const [sizes, setSizes] = useState(['']);

  const [submitError, setSubmitError] = useState('');

  // Undo delete toast state


  // Version History states
  const [activeVersions, setActiveVersions] = useState([]);
  const [compareVersion, setCompareVersion] = useState(null); // { ver, index }

  // Gallery Management handlers
  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setForm(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...filesArray]
      }));
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    setForm(prev => {
      const updatedImages = prev.images.filter((_, idx) => idx !== indexToDelete);
      let nextPrimary = prev.primaryImage;
      if (prev.primaryImage === prev.images[indexToDelete]) {
        nextPrimary = updatedImages[0] || '';
      }
      return {
        ...prev,
        images: updatedImages,
        primaryImage: nextPrimary
      };
    });
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetPrimary = (imgUrl) => {
    setForm(prev => ({
      ...prev,
      primaryImage: imgUrl
    }));
  };

  const handleMoveImage = (index, direction) => {
    setForm(prev => {
      const updatedImages = [...prev.images];
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < updatedImages.length) {
        const temp = updatedImages[index];
        updatedImages[index] = updatedImages[targetIndex];
        updatedImages[targetIndex] = temp;
      }
      return {
        ...prev,
        images: updatedImages
      };
    });
  };

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadProductsData = async () => {
    try {
      setLoading(true);
      let url = `/products?page=${page}&limit=10`;
      if (searchTerm) url += `&keyword=${encodeURIComponent(searchTerm)}`;
      
      const prodRes = await api.get(url);
      if (Array.isArray(prodRes.data)) {
        setProducts(prodRes.data);
        setTotalPages(1);
      } else if (prodRes.data && Array.isArray(prodRes.data.products)) {
        setProducts(prodRes.data.products);
        setTotalPages(prodRes.data.pages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }

      const catRes = await api.get('/categories');
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      
      const brandRes = await api.get('/brands');
      setBrands(Array.isArray(brandRes.data) ? brandRes.data : []);
    } catch (err) {
      console.error('Error loading inventory lists:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadProductsData();
    }
  }, [userInfo, page, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setActiveVersions([]);
    setForm({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      brand: brands[0]?._id || '',
      availability: true,
      price: 0,
      featured: false,
      bestSeller: false,
      newArrival: false,
      images: [],
      imageFiles: [],
      primaryImage: ''
    });
    setFeatures(['']);
    setSpecifications([{ name: '', value: '' }]);
    setSizes(['']);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod._id);
    setActiveVersions(prod.versions || []);

    const catVal = typeof prod.category === 'object' && prod.category !== null 
      ? (prod.category._id || prod.category.slug || prod.category.name || '') 
      : String(prod.category || '');
    const foundCat = categories.find(c => c._id === catVal || c.slug === catVal || c.name.toLowerCase() === catVal.toLowerCase())?._id || categories[0]?._id || catVal;

    const brandVal = typeof prod.brand === 'object' && prod.brand !== null
      ? (prod.brand._id || prod.brand.slug || prod.brand.name || '')
      : String(prod.brand || '');
    const foundBrand = brands.find(b => b._id === brandVal || b.slug === brandVal || b.name.toLowerCase() === brandVal.toLowerCase())?._id || brands[0]?._id || brandVal;

    setForm({
      name: prod.name || '',
      description: prod.description || '',
      category: foundCat,
      brand: foundBrand,
      availability: prod.availability !== false && prod.inStock !== false,
      price: prod.price || 0,
      featured: prod.featured || false,
      bestSeller: prod.bestSeller || false,
      newArrival: prod.newArrival || false,
      images: prod.images || (prod.image ? [prod.image] : []),
      imageFiles: [],
      primaryImage: prod.image || (prod.images && prod.images[0]) || ''
    });
    setFeatures(prod.features?.length > 0 ? prod.features : ['']);
    setSpecifications(prod.specifications?.length > 0 ? prod.specifications : [{ name: '', value: '' }]);
    setSizes(prod.sizes?.length > 0 ? prod.sizes : ['']);
    setSubmitError('');
    setModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Move "${name}" to the Recycle Bin?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      alert(`"${name}" moved to Recycle Bin.`);
    } catch (err) {
      console.error(err);
      alert('Failed to move product to Recycle Bin.');
    }
  };

  const handleRestoreVersion = async (index) => {
    if (!window.confirm('Are you sure you want to restore this older version? Current modifications will be archived.')) return;
    try {
      const res = await api.put(`/products/${editingId}/version/${index}/restore`);
      alert('Version restored successfully!');
      
      // Update form fields with restored fields
      const prod = res.data.product;
      handleOpenEdit(prod);
      loadProductsData();
    } catch (err) {
      alert(`Failed to restore version: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCompareVersions = (ver, index) => {
    setCompareVersion({ ver, index });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!form.name || !form.description || !form.category || !form.brand) {
      setSubmitError('Please fill in name, description, category, and brand fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('brand', form.brand);
    formData.append('availability', form.availability);
    formData.append('price', form.price);
    formData.append('featured', form.featured);
    formData.append('bestSeller', form.bestSeller);
    formData.append('newArrival', form.newArrival);
    
    formData.append('existingImages', JSON.stringify(form.images));
    formData.append('primaryImage', form.primaryImage || '');

    if (form.imageFiles && form.imageFiles.length > 0) {
      formData.append('imageFile', form.imageFiles[0]);
      form.imageFiles.forEach(file => {
        formData.append('imageFiles', file);
      });
    }

    // Filter out blank inputs in arrays before packing
    const cleanFeatures = features.filter(f => f.trim() !== '');
    const cleanSpecs = specifications.filter(s => s.name.trim() !== '' && s.value.trim() !== '');
    const cleanSizes = sizes.filter(s => s.trim() !== '');

    formData.append('features', JSON.stringify(cleanFeatures));
    formData.append('specifications', JSON.stringify(cleanSpecs));
    formData.append('sizes', JSON.stringify(cleanSizes));

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setModalOpen(false);
      loadProductsData();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save product details.');
    }
  };

  // Helper dynamic array handlers
  const handleAddRow = (setter) => {
    setter(prev => [...prev, '']);
  };
  const handleRemoveRow = (setter, idx) => {
    setter(prev => prev.filter((_, i) => i !== idx));
  };
  const handleArrayChange = (setter, idx, val) => {
    setter(prev => prev.map((item, i) => i === idx ? val : item));
  };

  const handleAddSpecRow = () => {
    setSpecifications(prev => [...prev, { name: '', value: '' }]);
  };
  const handleRemoveSpecRow = (idx) => {
    setSpecifications(prev => prev.filter((_, i) => i !== idx));
  };
  const handleSpecChange = (idx, field, val) => {
    setSpecifications(prev => prev.map((item, i) => i === idx ? { ...item, [field]: val } : item));
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Manage Catalog Inventory" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-6xl w-full mx-auto text-left">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-orange-500 transition-all shadow-xs"
              />
              <span className="absolute left-3 top-3 text-gray-400 text-xs">🔍</span>
            </div>

            <button
              onClick={handleOpenAdd}
              className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-md transition-all text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {/* Products List Table */}
          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-gray-500">
                <p className="text-xs">Fetching material catalog...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Image</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Product Details</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Category &amp; Brand</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">B2B Price</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Flags</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <td className="p-4 w-20">
                          <div className="w-12 h-12 bg-gray-50 border border-gray-150 rounded-lg overflow-hidden">
                            <img 
                              src={resolveImageUrl(prod.image || (prod.images && prod.images[0]) || '/cement.jpg')}
                              alt="" 
                              onError={(e) => { e.target.src = '/cement.jpg'; }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <h4 className="font-bold text-gray-800">{prod.name}</h4>
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded ${
                            (prod.availability !== false && prod.inStock !== false) ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                          }`}>
                            {(prod.availability !== false && prod.inStock !== false) ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-gray-700">{prod.category?.name || (categories.find(c => c.slug === prod.category || c._id === prod.category)?.name) || (typeof prod.category === 'string' ? prod.category : 'Category')}</span>
                          <span className="block text-3xs text-gray-400 mt-0.5">{prod.brand?.name || (brands.find(b => b.slug === prod.brand || b._id === prod.brand)?.name) || (typeof prod.brand === 'string' ? prod.brand : 'Brand')}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          ₹{prod.price || 0}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {prod.featured && <span className="bg-orange-50 text-orange-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Featured</span>}
                            {prod.bestSeller && <span className="bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">Bestseller</span>}
                            {prod.newArrival && <span className="bg-green-50 text-green-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">New</span>}
                          </div>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 rounded transition-all cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
                            className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded transition-all cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                <p className="text-xs">No products in showroom database. Click "Add Product" to create one.</p>
              </div>
            )}
          </div>
        </main>
      </div>


      {/* CRUD Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up relative border border-gray-150 text-left flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-heading font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                <Sparkles size={18} className="text-orange-500" />
                {editingId ? 'Edit Product Parameters' : 'Add New Material'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-6 flex-grow">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
                  {submitError}
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder="UltraTech Cement 53 Grade"
                    className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1 col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    >
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Brand *</label>
                    <select
                      value={form.brand}
                      onChange={(e) => setForm({...form, brand: e.target.value})}
                      className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    >
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">B2B Price *</label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm({...form, price: parseFloat(e.target.value) || 0})}
                      placeholder="430"
                      className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Enter detailed B2B product specifications and application uses."
                  className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none resize-none"
                />
              </div>

              {/* Product Gallery Manager */}
              <div className="flex flex-col gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <FileUp size={14} className="text-orange-500" />
                  Product Image Gallery Manager
                </h4>

                {/* Upload New Files */}
                <div className="flex flex-col gap-2">
                  <label className="text-2xs font-bold text-gray-600">Select Image Files (Select up to 10 files)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-2xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-2xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                </div>

                {/* Existing Images Grid */}
                {form.images?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-2xs font-bold text-gray-600">Existing Images &amp; Order (First image is default thumbnail)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {form.images.map((imgUrl, index) => {
                        const isPrimary = form.primaryImage === imgUrl;
                        return (
                          <div 
                            key={index} 
                            className={`relative rounded-lg overflow-hidden border-2 bg-white flex flex-col ${
                              isPrimary ? 'border-orange-500' : 'border-gray-200'
                            }`}
                          >
                            <img 
                              src={resolveImageUrl(imgUrl)} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-20 object-cover"
                            />
                            
                            {/* Toolbar */}
                            <div className="p-1.5 flex justify-between items-center bg-gray-50 border-t border-gray-100 text-[10px]">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMoveImage(index, -1)}
                                  className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowLeft size={10} />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === form.images.length - 1}
                                  onClick={() => handleMoveImage(index, 1)}
                                  className="p-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowRight size={10} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSetPrimary(imgUrl)}
                                className={`p-1 rounded ${
                                  isPrimary ? 'text-orange-500 font-bold' : 'text-gray-400 hover:text-gray-600'
                                }`}
                                title={isPrimary ? 'Primary Image' : 'Set as Primary'}
                              >
                                <Star size={12} fill={isPrimary ? 'currentColor' : 'none'} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteImage(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                title="Delete Image"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Newly Selected Files Grid */}
                {form.imageFiles?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-2xs font-bold text-orange-600">New Images to Upload ({form.imageFiles.length})</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {form.imageFiles.map((file, index) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={index} className="relative rounded-lg overflow-hidden border border-orange-200 bg-white flex flex-col">
                            <img 
                              src={previewUrl} 
                              alt={`New ${index + 1}`}
                              className="w-full h-20 object-cover"
                            />
                            <div className="p-1.5 flex justify-between items-center bg-gray-50 border-t border-gray-100 text-[10px]">
                              <span className="truncate max-w-[80px] text-gray-500 text-3xs font-semibold">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNewFile(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                                title="Remove File"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications Block */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Specifications Table</h4>
                  <button 
                    type="button" 
                    onClick={handleAddSpecRow}
                    className="text-3xs font-extrabold uppercase tracking-widest text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={12} /> Add Row
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Spec Parameter (e.g. Grade)"
                        value={spec.name}
                        onChange={(e) => handleSpecChange(idx, 'name', e.target.value)}
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none flex-grow"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. OPC 53)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none flex-grow"
                      />
                      {specifications.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSpecRow(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Features Block */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Key Features (Bullet points)</h4>
                  <button 
                    type="button" 
                    onClick={() => handleAddRow(setFeatures)}
                    className="text-3xs font-extrabold uppercase tracking-widest text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={12} /> Add Bullet
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="High compressive strength..."
                        value={feat}
                        onChange={(e) => handleArrayChange(setFeatures, idx, e.target.value)}
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none flex-grow"
                      />
                      {features.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRow(setFeatures, idx)}
                          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes Block */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Available Sizes / Volumes</h4>
                  <button 
                    type="button" 
                    onClick={() => handleAddRow(setSizes)}
                    className="text-3xs font-extrabold uppercase tracking-widest text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle size={12} /> Add Size
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {sizes.map((size, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="50 kg Bag, 10 Litre Bucket..."
                        value={size}
                        onChange={(e) => handleArrayChange(setSizes, idx, e.target.value)}
                        className="border border-gray-250 p-2.5 rounded-md text-xs focus:border-orange-500 outline-none flex-grow"
                      />
                      {sizes.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRow(setSizes, idx)}
                          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <MinusCircle size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkbox status flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-150 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.availability}
                    onChange={(e) => setForm({...form, availability: e.target.checked})}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({...form, featured: e.target.checked})}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  Featured Item
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.bestSeller}
                    onChange={(e) => setForm({...form, bestSeller: e.target.checked})}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  Bestseller
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newArrival}
                    onChange={(e) => setForm({...form, newArrival: e.target.checked})}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  New Arrival
                </label>
              </div>

              {/* Version History Section */}
              {editingId && activeVersions.length > 0 && (
                <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-150 rounded-xl">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-2">
                    📜 Edit Version History ({activeVersions.length})
                  </h4>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {activeVersions.map((ver, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded border border-gray-200 text-xs">
                        <div className="flex flex-col text-left">
                          <span className="font-bold text-gray-800">Version {idx + 1}</span>
                          <span className="text-3xs text-gray-400 font-medium">Saved: {new Date(ver.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCompareVersions(ver, idx)}
                            className="text-3xs font-extrabold bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1 rounded transition-all cursor-pointer active:scale-95"
                          >
                            Compare
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRestoreVersion(idx)}
                            className="text-3xs font-extrabold bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded transition-all cursor-pointer active:scale-95"
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form buttons */}
              <div className="flex gap-3 justify-end border-t border-gray-150 pt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-250 rounded-md text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Compare Version Modal */}
      {compareVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2">
                  Compare with Version {compareVersion.index + 1}
                </h3>
                <button
                  onClick={() => setCompareVersion(null)}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-96">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 font-bold uppercase text-gray-500">
                      <th className="p-2">Property</th>
                      <th className="p-2">Current Active</th>
                      <th className="p-2">Version {compareVersion.index + 1}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-gray-700">
                    <tr className={form.name !== compareVersion.ver.name ? 'bg-orange-50/40' : ''}>
                      <td className="p-2.5 font-bold">Name</td>
                      <td className="p-2.5 truncate max-w-[130px]">{form.name}</td>
                      <td className="p-2.5 truncate max-w-[130px]">{compareVersion.ver.name}</td>
                    </tr>
                    <tr className={form.price !== compareVersion.ver.price ? 'bg-orange-50/40' : ''}>
                      <td className="p-2.5 font-bold">B2B Price</td>
                      <td className="p-2.5">₹{form.price}</td>
                      <td className="p-2.5">₹{compareVersion.ver.price}</td>
                    </tr>
                    <tr className={form.description !== compareVersion.ver.description ? 'bg-orange-50/40' : ''}>
                      <td className="p-2.5 font-bold">Description</td>
                      <td className="p-2.5 max-w-[130px] truncate">{form.description}</td>
                      <td className="p-2.5 max-w-[130px] truncate">{compareVersion.ver.description}</td>
                    </tr>
                    <tr className={form.availability !== compareVersion.ver.availability ? 'bg-orange-50/40' : ''}>
                      <td className="p-2.5 font-bold">In Stock</td>
                      <td className="p-2.5">{form.availability ? 'Yes' : 'No'}</td>
                      <td className="p-2.5">{compareVersion.ver.availability ? 'Yes' : 'No'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-150">
              <button
                onClick={() => setCompareVersion(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-95"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
