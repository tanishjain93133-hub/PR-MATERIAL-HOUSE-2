import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMinus, ShieldAlert, ShieldCheck, Loader2, UserPlus, KeyRound, CheckSquare, Square, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminUsers = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('staff'); // staff, customers
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Staff Form State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'manager',
    permissions: []
  });
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const availablePermissions = [
    { id: 'products', label: 'Manage Products' },
    { id: 'categories', label: 'Manage Categories' },
    { id: 'brands', label: 'Manage Brands' },
    { id: 'gallery', label: 'Manage Media Gallery' },
    { id: 'testimonials', label: 'Manage Testimonials' },
    { id: 'enquiries', label: 'Manage Enquiries & Quotes' },
    { id: 'users', label: 'Manage Users & Permissions' },
    { id: 'settings', label: 'System Settings & Backups' }
  ];

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadData = async () => {
    if (!userInfo) return;
    try {
      setLoading(true);
      if (activeTab === 'customers') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else {
        const res = await api.get('/admin/staff');
        setStaff(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userInfo, activeTab]);

  // Customer handlers
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    if (!window.confirm(`Are you sure you want to change user status to ${nextStatus.toUpperCase()}?`)) return;

    try {
      await api.put(`/admin/users/${id}/status`, { status: nextStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: nextStatus } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update user status.');
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Delete customer account permanently? Warning: Sent enquiries records might remain orphan.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  // Staff handlers
  const handleOpenCreateStaff = () => {
    setEditingStaffId(null);
    setStaffForm({
      username: '',
      email: '',
      password: '',
      role: 'manager',
      permissions: ['products', 'gallery']
    });
    setModalError('');
    setModalSuccess('');
    setShowStaffModal(true);
  };

  const handleOpenEditStaff = (member) => {
    setEditingStaffId(member._id);
    setStaffForm({
      username: member.username,
      email: member.email,
      password: '', // optional on edit
      role: member.role || 'manager',
      permissions: member.permissions || []
    });
    setModalError('');
    setModalSuccess('');
    setShowStaffModal(true);
  };

  const handlePermissionToggle = (permissionId) => {
    const isChecked = staffForm.permissions.includes(permissionId);
    if (isChecked) {
      setStaffForm({
        ...staffForm,
        permissions: staffForm.permissions.filter(p => p !== permissionId)
      });
    } else {
      setStaffForm({
        ...staffForm,
        permissions: [...staffForm.permissions, permissionId]
      });
    }
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    try {
      if (editingStaffId) {
        // Update details
        const payload = {
          role: staffForm.role,
          permissions: staffForm.permissions
        };
        if (staffForm.password) {
          payload.password = staffForm.password;
        }
        await api.put(`/admin/staff/${editingStaffId}`, payload);
        setModalSuccess('Staff permissions updated successfully!');
      } else {
        // Create new
        await api.post('/admin/staff', staffForm);
        setModalSuccess('New administrative account created!');
      }
      setTimeout(() => {
        setShowStaffModal(false);
        loadData();
      }, 1500);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to save staff configurations.');
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (userInfo.username === name) {
      alert('You cannot delete your own administrative account.');
      return;
    }
    if (!window.confirm(`Delete administrative staff account "${name}" permanently?`)) return;
    try {
      await api.delete(`/admin/staff/${id}`);
      setStaff(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete staff member.');
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="System Users &amp; Permissions" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          
          {/* Tabs header */}
          <div className="flex justify-between items-center border-b border-gray-150 pb-2">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`pb-2 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'staff'
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Administrative Staff
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customers')}
                className={`pb-2 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                  activeTab === 'customers'
                    ? 'border-orange-500 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Registered Customers
              </button>
            </div>

            {activeTab === 'staff' && (
              <button
                onClick={handleOpenCreateStaff}
                className="btn bg-orange-500 hover:bg-orange-600 text-white font-bold text-2xs px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus size={13} /> Add Staff Account
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center items-center text-gray-500 text-xs">
                <Loader2 className="animate-spin text-orange-500 mr-2" size={18} />
                Loading users...
              </div>
            ) : activeTab === 'customers' ? (
              /* CUSTOMERS LIST */
              users.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Client Details</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Company</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Location</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Status</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold font-heading text-xs">
                              {user.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{user.username}</h4>
                              <p className="text-3xs text-gray-400 mt-0.5">{user.email} | {user.phone || 'No phone'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-gray-700">{user.companyName || '-'}</td>
                        <td className="p-4 text-gray-500">{user.city || '-'}</td>
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border ${
                            user.status === 'active' 
                              ? 'bg-green-50 text-green-600 border-green-100' 
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 mt-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(user._id, user.status)}
                              className="p-1.5 bg-gray-100 hover:bg-red-55 text-gray-650 hover:text-red-600 rounded transition-all"
                              title="Block User"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(user._id, user.status)}
                              className="p-1.5 bg-gray-100 hover:bg-green-55 text-gray-650 hover:text-green-600 rounded transition-all"
                              title="Activate User"
                            >
                              <ShieldCheck size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCustomer(user._id)}
                            className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-650 hover:text-red-600 rounded transition-all"
                            title="Delete Account"
                          >
                            <UserMinus size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-xs">No registered customer accounts found.</p>
                </div>
              )
            ) : (
              /* STAFF LIST */
              staff.length > 0 ? (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Staff Member</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Role</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Active Permissions</th>
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(member => (
                      <tr key={member._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold font-heading text-xs border border-gray-200">
                              {member.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{member.username}</h4>
                              <p className="text-3xs text-gray-400 mt-0.5">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block text-[9px] font-extrabold uppercase py-0.5 px-2 rounded-md ${
                            member.role === 'admin'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : member.role === 'editor'
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-sm">
                            {member.role === 'admin' ? (
                              <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">All Access Control</span>
                            ) : member.permissions && member.permissions.length > 0 ? (
                              member.permissions.map(perm => (
                                <span key={perm} className="text-[9px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                  {perm}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] text-gray-400 italic">No permissions set</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => handleOpenEditStaff(member)}
                            className="p-1.5 bg-gray-100 hover:bg-orange-50 text-gray-650 hover:text-orange-600 rounded transition-all"
                            title="Edit Role/Permissions"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member._id, member.username)}
                            className="p-1.5 bg-gray-100 hover:bg-red-100 text-gray-650 hover:text-red-650 rounded transition-all"
                            title="Remove Account"
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
                  <p className="text-xs">No administrative staff accounts found.</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* --- STAFF ADD/EDIT MODAL --- */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-gray-200 overflow-hidden text-left text-xs animate-scale-up">
            <div className="bg-gray-50 border-b border-gray-150 p-4 flex justify-between items-center">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <KeyRound size={16} className="text-orange-500" />
                {editingStaffId ? 'Configure Staff Member' : 'New Administrative Staff'}
              </h3>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold font-mono text-base"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-5 flex flex-col gap-4">
              {modalError && <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-md font-medium text-2xs">{modalError}</div>}
              {modalSuccess && <div className="p-2.5 bg-green-50 border border-green-200 text-green-600 rounded-md font-medium text-2xs">{modalSuccess}</div>}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Username</label>
                <input
                  type="text"
                  required
                  disabled={!!editingStaffId}
                  value={staffForm.username}
                  onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                  className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!!editingStaffId}
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {editingStaffId ? 'Reset Password (Leave blank to keep)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingStaffId}
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  placeholder={editingStaffId ? 'Reset password string...' : 'Minimum 6 characters'}
                  className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Role Authority</label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="border border-gray-250 p-2.5 rounded-md text-xs outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="manager">Manager</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {staffForm.role !== 'admin' && (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Granular CMS Permissions</label>
                  <div className="grid grid-cols-2 gap-2 text-2xs font-semibold text-gray-600">
                    {availablePermissions.map(perm => {
                      const isChecked = staffForm.permissions.includes(perm.id);
                      return (
                        <button
                          key={perm.id}
                          type="button"
                          onClick={() => handlePermissionToggle(perm.id)}
                          className="flex items-center gap-1.5 p-1 rounded hover:bg-gray-50 text-left"
                        >
                          {isChecked ? (
                            <CheckSquare size={13} className="text-orange-500 fill-orange-50/20" />
                          ) : (
                            <Square size={13} className="text-gray-300" />
                          )}
                          {perm.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end border-t border-gray-100 pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-700 font-bold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-md"
                >
                  {editingStaffId ? 'Apply Changes' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
