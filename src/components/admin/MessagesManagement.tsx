// src/pages/admin/MessagesManagement.tsx
import { useState, useEffect } from 'react';
import { adminAPI, type ContactMessage } from '../../services/adminApi';
import { Mail, Trash2, CheckCircle, User, Calendar as CalendarIcon } from 'lucide-react';

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? { unread_only: true } : {};
      const response = await adminAPI.getMessages(params);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await adminAPI.markMessageRead(id);
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await adminAPI.deleteMessage(id);
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
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
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Contact Messages</h1>
          <p className="text-[#B8B0A8] mt-1">Manage messages from the contact form</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'all' ? 'bg-[#C79A6B] text-[#0B0B0C]' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.2)]'
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'unread' ? 'bg-[#C79A6B] text-[#0B0B0C]' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.2)]'
            }`}
          >
            Unread Only
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Mail className="w-12 h-12 text-[#666] mx-auto mb-4" />
            <p className="text-[#B8B0A8]">No messages found</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`glass-card p-6 transition-all ${!message.is_read ? 'border-[#C79A6B]/50' : ''}`}>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#C79A6B]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#F4F1EC]">{message.name}</h3>
                          <a href={`mailto:${message.email}`} className="text-sm text-[#C79A6B] hover:underline">
                            {message.email}
                          </a>
                        </div>
                      </div>
                      {!message.is_read && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C79A6B]/20 text-[#C79A6B] rounded-full text-xs">
                          <Mail className="w-3 h-3" />
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#666] flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-lg">
                    <p className="text-[#F4F1EC] leading-relaxed">{message.message}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!message.is_read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}