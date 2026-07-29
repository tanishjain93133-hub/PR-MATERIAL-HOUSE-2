import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Package, 
  Layers, 
  Users, 
  MailWarning, 
  Eye, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Users2
} from 'lucide-react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
  const { userInfo, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalEnquiries: 0,
    newUsers: 0,
    visitors: 0,
    mostViewed: [],
    mostRequested: []
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !userInfo) {
      navigate('/admin/login');
    }
  }, [userInfo, authLoading, navigate]);

  const loadDashboardData = async () => {
    if (!userInfo) return;
    try {
      setLoading(true);
      const analyticRes = await api.get('/admin/analytics');
      setAnalytics(analyticRes.data);

      const enqRes = await api.get('/enquiries');
      setRecentEnquiries(enqRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      loadDashboardData();
    }
  }, [userInfo]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      setRecentEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-grow flex flex-col min-w-0">
        <AdminNavbar title="Dashboard Overview" />

        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <main className="flex-grow p-8 flex flex-col gap-8 max-w-6xl w-full mx-auto text-left">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl border border-gray-150 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900">Welcome, {userInfo?.username}!</h3>
                <p className="text-xs text-gray-500 mt-1">CMS Control center for PR Material House.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 border border-green-100 py-1.5 px-3 rounded-md">
                <ShieldCheck size={14} />
                System Active
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Products</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1">{analytics.totalProducts}</h3>
              </div>
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Categories</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1">{analytics.totalCategories}</h3>
              </div>
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Customers</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1">{analytics.totalUsers}</h3>
              </div>
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Enquiries</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1">{analytics.totalEnquiries}</h3>
              </div>
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">New Users (7d)</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1 text-orange-600">{analytics.newUsers}</h3>
              </div>
              <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Web Visitors</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mt-1">{analytics.visitors}</h3>
              </div>
            </div>

            {/* Popular Items Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Most Viewed */}
              <div className="bg-white rounded-xl border border-gray-150 shadow-sm p-5 text-left">
                <h4 className="font-heading font-bold text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Eye size={14} className="text-blue-500" />
                  Most Viewed Materials
                </h4>
                <div className="flex flex-col gap-3 text-2xs">
                  {analytics.mostViewed.map((prod, idx) => (
                    <div key={prod._id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-gray-800">{prod.name}</span>
                        <span className="block text-3xs text-gray-400">{prod.category?.name || 'General'}</span>
                      </div>
                      <span className="font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{prod.viewCount || 0} views</span>
                    </div>
                  ))}
                  {analytics.mostViewed.length === 0 && <p className="text-gray-400 italic">No views registered yet.</p>}
                </div>
              </div>

              {/* Most Requested */}
              <div className="bg-white rounded-xl border border-gray-150 shadow-sm p-5 text-left">
                <h4 className="font-heading font-bold text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-orange-500" />
                  Most Requested Quotes
                </h4>
                <div className="flex flex-col gap-3 text-2xs">
                  {analytics.mostRequested.map((prod, idx) => (
                    <div key={prod._id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-gray-800">{prod.name}</span>
                        <span className="block text-3xs text-gray-400">{prod.category?.name || 'General'}</span>
                      </div>
                      <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{prod.enquiryCount || 0} quotes</span>
                    </div>
                  ))}
                  {analytics.mostRequested.length === 0 && <p className="text-gray-400 italic">No quotes requested yet.</p>}
                </div>
              </div>
            </div>

            {/* Recent Enquiries Section */}
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-orange-500" />
                  Recent Quote Enquiries
                </h3>
                <Link to="/admin/enquiries" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  View All Enquiries
                  <ArrowRight size={14} />
                </Link>
              </div>

              {recentEnquiries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Client Details</th>
                        <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Material Requested</th>
                        <th className="p-4 font-bold text-gray-400 uppercase tracking-wide">Status</th>
                        <th className="p-4 font-bold text-gray-400 uppercase tracking-wide text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnquiries.map((enq) => (
                        <tr key={enq._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                          <td className="p-4">
                            <h4 className="font-bold text-gray-800">{enq.name}</h4>
                            <p className="text-3xs text-gray-400 mt-0.5">{enq.phone} | {enq.email}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-700">{enq.productName || 'General Inquiry'}</span>
                            {enq.category && (
                              <span className="block text-3xs text-orange-500 font-bold uppercase mt-0.5">{enq.category}</span>
                            )}
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
                          <td className="p-4 text-right flex justify-end gap-1.5 mt-2">
                            <select
                              value={enq.status}
                              onChange={(e) => handleUpdateStatus(enq._id, e.target.value)}
                              className="border border-gray-250 rounded p-1 text-[10px] outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <p className="text-xs">No enquiries received yet.</p>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
