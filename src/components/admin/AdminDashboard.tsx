// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { adminAPI, type DashboardStats, type Booking, type ContactMessage, type WaitlistEntry } from '../../services/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatsCards from '../../components/admin/StatsCards';
import BookingsManagement from '../../components/admin/BookingsManagement';
import MessagesManagement from '../../components/admin/MessagesManagement';
import WaitlistManagement from '../../components/admin/WaitlistManagement';
import NewsManagement from '../../components/admin/NewsManagement';
import ProductsManagement from '../../components/admin/ProductsManagement';
import KennelManagement from '../../components/admin/KennelManagement';
import Settings from './Settings';
import GalleryManagement from '../../components/admin/GalleryManagement';
import { Activity, TrendingUp, Users, Mail, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  const getActivePath = () => {
    const path = location.pathname.replace('/admin', '') || '/';
    return path;
  };

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Rafraîchir toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(`/admin${path}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C79A6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F4F1EC]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      <AdminSidebar activePath={getActivePath()} onNavigate={handleNavigate} onLogout={handleLogout} />
      
      <div className="lg:ml-64">
        <AdminHeader adminName={adminName} onSearch={handleSearch} />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={
              <>
                {/* Welcome Section */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-[#F4F1EC]">Dashboard</h1>
                  <p className="text-[#B8B0A8] mt-1">Welcome back! Here's what's happening with your kennel today.</p>
                </div>

                {/* Stats Cards */}
                {stats && <StatsCards stats={stats} />}

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Recent Bookings */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#F4F1EC]">Recent Bookings</h2>
                      <Calendar className="w-5 h-5 text-[#C79A6B]" />
                    </div>
                    <div className="space-y-3">
                      {stats?.recent_bookings && stats.recent_bookings.length > 0 ? (
                        stats.recent_bookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.03)] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#F4F1EC]">{booking.bitch_reg_name}</p>
                              <p className="text-xs text-[#B8B0A8]">{booking.owner_name}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[#B8B0A8] py-4">No recent bookings</p>
                      )}
                    </div>
                  </div>

                  {/* Recent Messages */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-[#F4F1EC]">Recent Messages</h2>
                      <Mail className="w-5 h-5 text-[#C79A6B]" />
                    </div>
                    <div className="space-y-3">
                      {stats?.recent_messages && stats.recent_messages.length > 0 ? (
                        stats.recent_messages.slice(0, 5).map((message) => (
                          <div key={message.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.03)] rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-[#F4F1EC]">{message.name}</p>
                              <p className="text-xs text-[#B8B0A8] truncate max-w-[200px]">{message.message}</p>
                            </div>
                            {!message.is_read && (
                              <span className="w-2 h-2 bg-[#C79A6B] rounded-full"></span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-[#B8B0A8] py-4">No recent messages</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => handleNavigate('/bookings')}
                    className="p-4 glass-card text-center hover:border-[#C79A6B] transition-all group"
                  >
                    <Calendar className="w-6 h-6 text-[#C79A6B] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-[#F4F1EC]">Manage Bookings</p>
                  </button>
                  <button
                    onClick={() => handleNavigate('/messages')}
                    className="p-4 glass-card text-center hover:border-[#C79A6B] transition-all group"
                  >
                    <Mail className="w-6 h-6 text-[#C79A6B] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-[#F4F1EC]">View Messages</p>
                  </button>
                  <button
                    onClick={() => handleNavigate('/waitlist')}
                    className="p-4 glass-card text-center hover:border-[#C79A6B] transition-all group"
                  >
                    <Users className="w-6 h-6 text-[#C79A6B] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-[#F4F1EC]">Waitlist</p>
                  </button>
                  <button
                    onClick={() => handleNavigate('/news')}
                    className="p-4 glass-card text-center hover:border-[#C79A6B] transition-all group"
                  >
                    <Activity className="w-6 h-6 text-[#C79A6B] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm text-[#F4F1EC]">Manage News</p>
                  </button>
                </div>
              </>
            } />
            <Route path="/bookings" element={<BookingsManagement />} />
            <Route path="/messages" element={<MessagesManagement />} />
            <Route path="/waitlist" element={<WaitlistManagement />} />
            <Route path="/news" element={<NewsManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/kennel" element={<KennelManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/gallery" element={<GalleryManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}