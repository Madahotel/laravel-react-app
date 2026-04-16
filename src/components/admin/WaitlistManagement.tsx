// src/pages/admin/WaitlistManagement.tsx
import { useState, useEffect } from 'react';
import { adminAPI, type WaitlistEntry } from '../../services/adminApi';
import { Users, Mail, Phone, User, Trash2, Download, Calendar as CalendarIcon } from 'lucide-react';

export default function WaitlistManagement() {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getWaitlist();
      setWaitlist(response.data);
    } catch (error) {
      console.error('Failed to fetch waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: number) => {
    if (confirm('Are you sure you want to remove this entry from the waitlist?')) {
      try {
        await adminAPI.deleteWaitlistEntry(id);
        fetchWaitlist();
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Email', 'Name', 'Phone', 'Joined Date'];
    const rows = waitlist.map(entry => [
      entry.email,
      entry.name || '',
      entry.phone || '',
      new Date(entry.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waitlist_${new Date().toISOString().split('T')[0]}.csv`;
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Waitlist</h1>
          <p className="text-[#B8B0A8] mt-1">Manage puppy waitlist subscribers</p>
        </div>
        
        {waitlist.length > 0 && (
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Total Subscribers</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{waitlist.length}</p>
            </div>
            <Users className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">With Names</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{waitlist.filter(w => w.name).length}</p>
            </div>
            <User className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">With Phone</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{waitlist.filter(w => w.phone).length}</p>
            </div>
            <Phone className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(199,154,107,0.2)]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#B8B0A8]">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#B8B0A8]">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#B8B0A8]">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#B8B0A8]">Joined</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#B8B0A8]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitlist.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#B8B0A8]">
                    <Users className="w-12 h-12 text-[#666] mx-auto mb-4" />
                    No waitlist entries yet
                  </td>
                </tr>
              ) : (
                waitlist.map((entry) => (
                  <tr key={entry.id} className="border-b border-[rgba(199,154,107,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#C79A6B]" />
                        <a href={`mailto:${entry.email}`} className="text-[#F4F1EC] hover:text-[#C79A6B]">
                          {entry.email}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#B8B0A8]">{entry.name || '-'}</td>
                    <td className="py-4 px-6">
                      {entry.phone ? (
                        <a href={`tel:${entry.phone}`} className="text-[#B8B0A8] hover:text-[#C79A6B] flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {entry.phone}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-6 text-[#B8B0A8] text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}