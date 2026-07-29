import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotTip, setShowForgotTip] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username || !password) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 relative z-10 text-left">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-500/10">
            <KeyRound size={22} />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">PR Material House Admin Portal</h2>
          <p className="text-2xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">
            Authorize Administrative Session
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg text-xs mb-6 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-xs focus:border-orange-500 outline-none transition-all"
              />
              <User size={14} className="absolute left-3.5 top-3.5 text-gray-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
              <button 
                type="button" 
                onClick={() => setShowForgotTip(!showForgotTip)} 
                className="text-[10px] text-orange-400 hover:underline hover:text-orange-500 font-semibold focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg text-xs focus:border-orange-500 outline-none transition-all"
              />
              <Lock size={14} className="absolute left-3.5 top-3.5 text-gray-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {showForgotTip && (
            <div className="p-3 bg-orange-950/20 border border-orange-500/30 text-orange-400 rounded-lg text-xs flex items-start gap-2 leading-relaxed">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>Super Admin Credentials: Username: <strong>Rj</strong> | Password: <strong>Rahul12#</strong></span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-3.5 rounded-lg transition-all shadow-md shadow-orange-500/10 mt-2 flex items-center justify-center"
          >
            {loading ? 'Validating Session...' : 'Authorize Login'}
          </button>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-750">
          <Link to="/" className="text-xs text-orange-400 hover:underline">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
