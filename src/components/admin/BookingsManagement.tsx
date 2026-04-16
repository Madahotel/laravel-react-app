// src/pages/admin/BookingsManagement.tsx
import { useState, useEffect } from 'react';
import { adminAPI, type Booking } from '../../services/adminApi';
import { 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2,
  Search,
  Eye,
  PawPrint,
  User,
  MessageSquare,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await adminAPI.getBookings(params);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const deleteBooking = async (id: number) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminAPI.deleteBooking(id);
        fetchBookings();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-green-500/30 bg-green-500/5';
      case 'cancelled': return 'border-red-500/30 bg-red-500/5';
      default: return 'border-yellow-500/30 bg-yellow-500/5';
    }
  };

  // Filtrer les réservations
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bitch_reg_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone?.includes(searchTerm);
    return matchesSearch;
  });

  // Extraire les informations du message
  const parseMessageInfo = (message: string | null) => {
    if (!message) return null;
    
    const info: any = {};
    const lines = message.split('\n');
    
    for (const line of lines) {
      if (line.includes('Female Dog Name:')) {
        info.bitch_name = line.replace('Female Dog Name:', '').trim();
      } else if (line.includes('Breed:')) {
        info.breed = line.replace('Breed:', '').trim();
      } else if (line.includes('Age:')) {
        info.age = line.replace('Age:', '').trim();
      } else if (line.includes('Previous Pregnancies:')) {
        info.previous_pregnancies = line.replace('Previous Pregnancies:', '').trim();
      } else if (line.includes('Selected Stud:')) {
        info.selected_stud = line.replace('Selected Stud:', '').trim();
      } else if (line.includes('Message:')) {
        info.user_message = line.replace('Message:', '').trim();
      }
    }
    
    return info;
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Female Dog', 'Owner', 'Email', 'Phone', 'Date', 'Status', 'Created At'];
    const rows = bookings.map(booking => [
      booking.id,
      booking.bitch_reg_name,
      booking.owner_name,
      booking.email,
      booking.phone,
      new Date(booking.booking_date).toLocaleDateString(),
      booking.status,
      new Date(booking.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#C79A6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Statistiques
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Stud Bookings</h1>
          <p className="text-[#B8B0A8] mt-1">Manage all stud service booking requests</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] text-[#B8B0A8] rounded-lg text-sm hover:bg-[rgba(199,154,107,0.1)] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] text-[#B8B0A8] rounded-lg text-sm hover:bg-[rgba(199,154,107,0.1)] transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Total Bookings</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Confirmed</p>
              <p className="text-2xl font-bold text-green-400">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B8B0A8]" />
            <input
              type="text"
              placeholder="Search by female dog, owner, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg pl-10 pr-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === 'all' ? 'bg-[#C79A6B] text-[#0B0B0C]' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.2)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(234,179,8,0.2)]'
              }`}
            >
              <Clock className="w-3 h-3" />
              Pending
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(34,197,94,0.2)]'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              Confirmed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(239,68,68,0.2)]'
              }`}
            >
              <XCircle className="w-3 h-3" />
              Cancelled
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(199,154,107,0.2)] bg-[rgba(199,154,107,0.05)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">ID</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Female Dog</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Owner</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <Calendar className="w-12 h-12 text-[#666] mx-auto mb-4" />
                    <p className="text-[#B8B0A8]">No bookings found</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const messageInfo = parseMessageInfo(booking.message);
                  return (
                    <tr 
                      key={booking.id} 
                      className={`border-b border-[rgba(199,154,107,0.1)] hover:bg-[rgba(199,154,107,0.05)] transition-colors ${getStatusColor(booking.status)}`}
                    >
                      <td className="p-4">
                        <span className="text-sm text-[#C79A6B] font-mono">#{booking.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-semibold text-[#F4F1EC]">{booking.bitch_reg_name}</p>
                          {messageInfo?.bitch_name && (
                            <p className="text-xs text-[#B8B0A8]">({messageInfo.bitch_name})</p>
                          )}
                          {messageInfo?.breed && (
                            <p className="text-xs text-[#666]">{messageInfo.breed}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-[#F4F1EC]">{booking.owner_name}</p>
                          {messageInfo?.age && (
                            <p className="text-xs text-[#666]">Age: {messageInfo.age}</p>
                          )}
                          {messageInfo?.previous_pregnancies && (
                            <p className="text-xs text-[#666]">Pregnancies: {messageInfo.previous_pregnancies}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <a href={`mailto:${booking.email}`} className="text-sm text-[#B8B0A8] hover:text-[#C79A6B] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.email}
                          </a>
                          <a href={`tel:${booking.phone}`} className="text-sm text-[#B8B0A8] hover:text-[#C79A6B] flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {booking.phone}
                          </a>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-[#C79A6B]" />
                          <span className="text-sm text-[#F4F1EC]">
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#666] mt-1">
                          Booked: {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1.5 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                className="p-1.5 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                                title="Confirm"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                title="Cancel"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteBooking(booking.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] text-[#F4F1EC] max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#C79A6B] flex items-center gap-2">
                  <PawPrint className="w-5 h-5" />
                  Booking Details #{selectedBooking.id}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Status */}
                <div className="flex justify-between items-center p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                  <span className="text-sm text-[#B8B0A8]">Status</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                {/* Female Dog Info */}
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                  <h3 className="text-sm font-semibold text-[#C79A6B] mb-2 flex items-center gap-2">
                    <PawPrint className="w-4 h-4" />
                    Female Dog Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-[#666]">Registration Name:</span>
                      <p className="text-sm text-[#F4F1EC]">{selectedBooking.bitch_reg_name}</p>
                    </div>
                    {(() => {
                      const info = parseMessageInfo(selectedBooking.message);
                      if (info) {
                        return (
                          <>
                            {info.bitch_name && (
                              <div>
                                <span className="text-xs text-[#666]">Name:</span>
                                <p className="text-sm text-[#F4F1EC]">{info.bitch_name}</p>
                              </div>
                            )}
                            {info.breed && (
                              <div>
                                <span className="text-xs text-[#666]">Breed:</span>
                                <p className="text-sm text-[#F4F1EC]">{info.breed}</p>
                              </div>
                            )}
                            {info.age && (
                              <div>
                                <span className="text-xs text-[#666]">Age:</span>
                                <p className="text-sm text-[#F4F1EC]">{info.age}</p>
                              </div>
                            )}
                            {info.previous_pregnancies && (
                              <div>
                                <span className="text-xs text-[#666]">Previous Pregnancies:</span>
                                <p className="text-sm text-[#F4F1EC]">{info.previous_pregnancies}</p>
                              </div>
                            )}
                            {info.selected_stud && (
                              <div>
                                <span className="text-xs text-[#666]">Selected Stud:</span>
                                <p className="text-sm text-[#F4F1EC]">{info.selected_stud}</p>
                              </div>
                            )}
                          </>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Owner Info */}
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                  <h3 className="text-sm font-semibold text-[#C79A6B] mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Owner Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-[#666]">Name:</span>
                      <p className="text-sm text-[#F4F1EC]">{selectedBooking.owner_name}</p>
                    </div>
                    <div>
                      <span className="text-xs text-[#666]">Email:</span>
                      <a href={`mailto:${selectedBooking.email}`} className="text-sm text-[#C79A6B] hover:underline">
                        {selectedBooking.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-xs text-[#666]">Phone:</span>
                      <a href={`tel:${selectedBooking.phone}`} className="text-sm text-[#C79A6B] hover:underline">
                        {selectedBooking.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                  <h3 className="text-sm font-semibold text-[#C79A6B] mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Booking Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-[#666]">Requested Date:</span>
                      <p className="text-sm text-[#F4F1EC]">{new Date(selectedBooking.booking_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-[#666]">Submitted on:</span>
                      <p className="text-sm text-[#F4F1EC]">{new Date(selectedBooking.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {(() => {
                  const info = parseMessageInfo(selectedBooking.message);
                  if (info?.user_message) {
                    return (
                      <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                        <h3 className="text-sm font-semibold text-[#C79A6B] mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </h3>
                        <p className="text-sm text-[#B8B0A8] italic">"{info.user_message}"</p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking.id, 'confirmed');
                        setIsDetailsOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => {
                        updateStatus(selectedBooking.id, 'cancelled');
                        setIsDetailsOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}