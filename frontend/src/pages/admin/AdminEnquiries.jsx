import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailOpen, Trash2, Eye, X, CheckSquare, PhoneCall, HelpCircle, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminEnquiries = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quotes'); // quotes, messages

  // Detail Modal State
  const [selectedEnq, setSelectedEnq] = useState(null);

  // Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/enquiries');
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadEnquiries();
    }
  }, [userInfo]);

  const handleMarkStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
      if (selectedEnq && selectedEnq._id === id) {
        setSelectedEnq(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update enquiry status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete enquiry record?')) return;
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
      if (selectedEnq && selectedEnq._id === id) {
        setSelectedEnq(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete enquiry.');
    }
  };

  // Filter logic
  const quoteRequests = enquiries.filter(e => e.productName && e.productName !== 'General Inquiry');
  const generalMessages = enquiries.filter(e => !e.productName || e.productName === 'General Inquiry');
  const displayList = activeTab === 'quotes' ? quoteRequests : generalMessages;

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Customer Queries &amp; Quotes" />

        <main className="flex-grow p-8 flex flex-col gap-6 max-w-5xl w-full mx-auto text-left">
          
          {/* Tabs header */}
          <div className="flex gap-4 border-b border-gray-150 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`pb-2 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'quotes'
                  ? 'border-orange-500 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Product Quote Requests ({quoteRequests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`pb-2 font-heading font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'messages'
                  ? 'border-orange-500 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              General Contact Messages ({generalMessages.length})
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex justify-center items-center text-gray-500 text-xs">
                <Loader2 className="animate-spin text-orange-500 mr-2" size={18} />
                Loading inquiries...
              </div>
            ) : displayList.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Client Details</th>
                    {activeTab === 'quotes' ? (
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Product / Lineup</th>
                    ) : (
                      <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Message Preview</th>
                    )}
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Date</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.map(enq => (
                    <tr key={enq._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="p-4">
                        <h4 className="font-bold text-gray-800">{enq.name}</h4>
                        <p className="text-3xs text-gray-450 mt-0.5">{enq.phone} | {enq.email}</p>
                      </td>
                      <td className="p-4">
                        {activeTab === 'quotes' ? (
                          <>
                            <span className="font-semibold text-gray-700">{enq.productName}</span>
                            {enq.category && (
                              <span className="block text-[9px] text-orange-500 font-extrabold uppercase mt-0.5">{enq.category}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-550 line-clamp-1 max-w-sm">{enq.message}</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-450">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border ${
                          enq.status === 'Pending' 
                            ? 'bg-orange-50 text-orange-600 border-orange-100' 
                            : enq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2 items-center mt-2">
                        <select
                          value={enq.status}
                          onChange={(e) => handleMarkStatus(enq._id, e.target.value)}
                          className="border border-gray-250 rounded p-1 text-[10px] outline-none bg-white font-semibold text-gray-700"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => setSelectedEnq(enq)}
                          className="p-1.5 bg-gray-100 hover:bg-orange-100 text-gray-650 hover:text-orange-600 rounded transition-all"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(enq._id)}
                          className="p-1.5 bg-gray-100 hover:bg-red-155 text-gray-650 hover:text-red-600 rounded transition-all"
                          title="Delete Record"
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
                <p className="text-xs">No entries found under this section.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnq && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up relative border border-gray-150 text-left">
            <div className="p-6 border-b border-gray-150 flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <MailOpen size={18} className="text-orange-500" />
                Enquiry Details
              </h3>
              <button onClick={() => setSelectedEnq(null)} className="text-gray-400 hover:text-gray-750 bg-gray-100 p-1.5 rounded-full font-bold">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Client Name</span>
                  <h4 className="font-bold text-gray-800 mt-0.5">{selectedEnq.name}</h4>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Date Received</span>
                  <p className="text-gray-800 mt-0.5 font-semibold">{new Date(selectedEnq.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Phone</span>
                  <p className="text-gray-800 mt-0.5 font-semibold">
                    <a href={`tel:${selectedEnq.phone}`} className="hover:text-orange-500 hover:underline">{selectedEnq.phone}</a>
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Email Address</span>
                  <p className="text-gray-800 mt-0.5 font-semibold">
                    <a href={`mailto:${selectedEnq.email}`} className="hover:text-orange-500 hover:underline">{selectedEnq.email}</a>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Company Name</span>
                  <p className="text-gray-855 font-semibold mt-0.5">{selectedEnq.companyName || '-'}</p>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">City / Location</span>
                  <p className="text-gray-855 font-semibold mt-0.5">{selectedEnq.city || '-'}</p>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Product / Service Needed</span>
                <p className="text-gray-800 font-bold mt-0.5 text-sm">{selectedEnq.productName || 'General Inquiry'}</p>
                {selectedEnq.category && (
                  <span className="inline-block text-[8px] font-extrabold bg-orange-50 text-orange-600 px-2 py-0.5 rounded mt-1 uppercase border border-orange-100">
                    {selectedEnq.category}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[9px] font-bold text-gray-455 uppercase tracking-wide">Project Details &amp; message</span>
                <p className="text-gray-605 leading-relaxed mt-1 font-normal bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-32 overflow-y-auto">
                  {selectedEnq.message}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedEnq._id)}
                  className="text-red-500 hover:text-red-750 font-bold flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete Record
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMarkStatus(selectedEnq._id, 'Pending')}
                    className={`p-2 rounded text-[10px] font-bold border transition-all ${
                      selectedEnq.status === 'Pending' 
                        ? 'bg-orange-500 text-white border-orange-600' 
                        : 'bg-white hover:bg-orange-50 text-gray-700 border-gray-250'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleMarkStatus(selectedEnq._id, 'Contacted')}
                    className={`p-2 rounded text-[10px] font-bold border transition-all ${
                      selectedEnq.status === 'Contacted' 
                        ? 'bg-blue-500 text-white border-blue-600' 
                        : 'bg-white hover:bg-blue-50 text-gray-700 border-gray-250'
                    }`}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleMarkStatus(selectedEnq._id, 'Completed')}
                    className={`p-2 rounded text-[10px] font-bold border transition-all ${
                      selectedEnq.status === 'Completed' 
                        ? 'bg-green-500 text-white border-green-600' 
                        : 'bg-white hover:bg-green-50 text-gray-700 border-gray-250'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
