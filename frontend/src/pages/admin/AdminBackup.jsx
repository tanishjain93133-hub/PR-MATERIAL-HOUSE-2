import React, { useState } from 'react';
import api from '../../utils/api';
import AdminSidebar from '../../components/AdminSidebar';
import AdminNavbar from '../../components/AdminNavbar';
import { Download, Upload, AlertCircle } from 'lucide-react';

const AdminBackup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleDownloadBackup = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const res = await api.get('/admin/backup', { responseType: 'blob' });
      
      // Handle file download
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `pr_material_house_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Database backup generated and downloaded successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Failed to download database backup.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setLoading(true);
        setError('');
        setSuccess('');

        const backupData = JSON.parse(evt.target.result);
        
        // Safety verification
        if (!backupData || typeof backupData !== 'object' || !backupData.products) {
          throw new Error('Invalid backup file format. Must be a PR Material House backup JSON.');
        }

        const res = await api.post('/admin/restore', backupData);
        setSuccess(res.data.message || 'Database restored successfully! Re-sync complete.');
        
        // Reset file input
        e.target.value = '';
        setTimeout(() => setSuccess(''), 5000);
      } catch (err) {
        setError(`Failed to restore database: ${err.message}`);
        e.target.value = '';
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        
        <main className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-gray-900 flex items-center gap-3">
              💾 Backup &amp; Restore Database
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Ensure data safety by backing up all website content locally or restoring database states from files.
            </p>
          </div>

          {/* Banner logs */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-lg text-sm font-semibold">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg text-sm font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Download Backup Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <Download size={24} />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-2">
                  Backup Database
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Export all current products, categories, brand relationships, enquiries, customer registrations, and site configurations to a local JSON file. 
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg text-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Download Backup File'}
              </button>
            </div>

            {/* Restore Backup Box */}
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Upload size={24} />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900 mb-2">
                  Restore Database
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Upload a previously exported database backup JSON file. 
                </p>
                <div className="flex items-start gap-2 bg-yellow-50 text-yellow-800 text-xs p-3.5 rounded-lg border border-yellow-100 mb-6 text-left">
                  <AlertCircle size={18} className="shrink-0 text-yellow-600" />
                  <span>
                    <strong>Warning:</strong> Restoring a backup overrides the active database collections. Ensure you have backed up any current data before proceeding.
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestoreBackup}
                  disabled={loading}
                  id="restore-file-input"
                  className="hidden"
                />
                <label
                  htmlFor="restore-file-input"
                  className={`w-full border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-700 font-bold py-3 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-blue-50/20 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {loading ? 'Restoring Database...' : 'Select & Upload Backup File'}
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminBackup;
