// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  Calendar, 
  Mail, 
  Users, 
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';

interface Booking {
  id: number;
  bitch_reg_name: string;
  owner_name: string;
  email: string;
  phone: string;
  booking_date: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface WaitlistEntry {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'waitlist'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes, messagesRes, waitlistRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getBookings(),
        adminAPI.getMessages(),
        adminAPI.getWaitlist(),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data);
      setMessages(messagesRes.data);
      setWaitlist(waitlistRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const markMessageRead = async (id: number) => {
    try {
      await adminAPI.markMessageRead(id);
      fetchData();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" />Confirmed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="text-[#C79A6B] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C]">
      {/* Header */}
      <header className="bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] sticky top-0 z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="RR Boerboels" className="h-10" />
            <h1 className="text-xl font-bold text-[#F4F1EC]">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('admin_token');
              window.location.href = '/admin/login';
            }}
            className="text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <Calendar className="w-8 h-8 text-[#C79A6B]" />
            <span className="text-2xl font-bold text-[#F4F1EC]">{stats?.total_bookings || 0}</span>
          </div>
          <p className="text-sm text-[#B8B0A8] mt-2">Total Bookings</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <Clock className="w-8 h-8 text-yellow-400" />
            <span className="text-2xl font-bold text-[#F4F1EC]">{stats?.pending_bookings || 0}</span>
          </div>
          <p className="text-sm text-[#B8B0A8] mt-2">Pending</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <Mail className="w-8 h-8 text-[#C79A6B]" />
            <span className="text-2xl font-bold text-[#F4F1EC]">{stats?.total_messages || 0}</span>
          </div>
          <p className="text-sm text-[#B8B0A8] mt-2">Messages</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-[#C79A6B]" />
            <span className="text-2xl font-bold text-[#F4F1EC]">{stats?.total_waitlist || 0}</span>
          </div>
          <p className="text-sm text-[#B8B0A8] mt-2">Waitlist</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-[rgba(199,154,107,0.2)]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-2 transition-colors ${
              activeTab === 'bookings' 
                ? 'text-[#C79A6B] border-b-2 border-[#C79A6B]' 
                : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
            }`}
          >
            Stud Bookings
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-2 transition-colors ${
              activeTab === 'messages' 
                ? 'text-[#C79A6B] border-b-2 border-[#C79A6B]' 
                : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
            }`}
          >
            Contact Messages
          </button>
          <button
            onClick={() => setActiveTab('waitlist')}
            className={`pb-3 px-2 transition-colors ${
              activeTab === 'waitlist' 
                ? 'text-[#C79A6B] border-b-2 border-[#C79A6B]' 
                : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
            }`}
          >
            Waitlist
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-[#F4F1EC]">{booking.bitch_reg_name}</h3>
                    <p className="text-sm text-[#B8B0A8]">Owner: {booking.owner_name}</p>
                    <p className="text-sm text-[#B8B0A8]">Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                    <p className="text-sm text-[#B8B0A8]">Email: {booking.email}</p>
                    <p className="text-sm text-[#B8B0A8]">Phone: {booking.phone}</p>
                    {booking.message && <p className="text-sm text-[#B8B0A8] mt-2">Message: {booking.message}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(booking.status)}
                    <div className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`glass-card p-4 ${!message.is_read ? 'border-[#C79A6B]/50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-[#F4F1EC]">{message.name}</h3>
                      {!message.is_read && (
                        <span className="px-2 py-0.5 bg-[#C79A6B]/20 text-[#C79A6B] rounded-full text-xs">New</span>
                      )}
                    </div>
                    <p className="text-sm text-[#B8B0A8]">{message.email}</p>
                    <p className="text-sm text-[#F4F1EC] mt-2">{message.message}</p>
                    <p className="text-xs text-[#666] mt-2">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                  {!message.is_read && (
                    <button
                      onClick={() => markMessageRead(message.id)}
                      className="p-2 text-[#C79A6B] hover:bg-[rgba(199,154,107,0.1)] rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'waitlist' && (
          <div className="space-y-4">
            {waitlist.map((entry) => (
              <div key={entry.id} className="glass-card p-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#F4F1EC]">{entry.email}</h3>
                  {entry.name && <p className="text-sm text-[#B8B0A8]">Name: {entry.name}</p>}
                  {entry.phone && <p className="text-sm text-[#B8B0A8]">Phone: {entry.phone}</p>}
                  <p className="text-xs text-[#666] mt-2">Joined: {new Date(entry.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}