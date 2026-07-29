import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import { History, Search, RefreshCw } from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.adminName.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(search.toLowerCase()))
  );

  const getActionBadgeColor = (action) => {
    const act = action.toLowerCase();
    if (act.includes('delete') || act.includes('block')) return 'bg-red-50 text-red-700 border-red-200';
    if (act.includes('add') || act.includes('restore') || act.includes('upload')) return 'bg-green-50 text-green-700 border-green-200';
    if (act.includes('update') || act.includes('change')) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (act.includes('login')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
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
                <History className="text-orange-500" /> Administrative Activity Log
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Audit trail of all administrative events, including item creations, updates, soft-deletions, price shifts, and data restores.
              </p>
            </div>
            
            <button
              onClick={fetchLogs}
              className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Search bar */}
          <div className="mb-6 relative max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search logs by action, admin or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-150 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all shadow-2xs"
            />
          </div>

          {/* Main Logs Table */}
          <div className="bg-white rounded-xl shadow-xs border border-gray-150 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-semibold">Loading Activity Log...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-16 text-center text-gray-500 font-medium">
                No activity logs found matching search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold uppercase tracking-wider text-gray-600">
                      <th className="px-6 py-4">Admin Name</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-sm text-gray-700">
                    {filteredLogs.map((l) => (
                      <tr key={l._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {l.adminName}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getActionBadgeColor(l.action)}`}>
                            {l.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-500">{l.date}</td>
                        <td className="px-6 py-4 font-medium text-gray-500">{l.time}</td>
                        <td className="px-6 py-4 text-xs font-medium text-gray-600 max-w-sm break-words">
                          {l.details || '-'}
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
    </div>
  );
};

export default AdminLogs;
