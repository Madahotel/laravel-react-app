// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { adminAPI } from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login({ email, password });
      localStorage.setItem('admin_token', response.data.token);
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/images/logo.png" alt="RR Boerboels" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Admin Login</h1>
          <p className="text-[#B8B0A8] text-sm mt-2">Access the administration panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#B8B0A8] mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-3 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm text-[#B8B0A8] mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-3 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary rounded-lg py-3 font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}