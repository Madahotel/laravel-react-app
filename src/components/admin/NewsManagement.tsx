// src/components/admin/NewsManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users,
  Star,
  X,
  Image as ImageIcon,
  Save,
  Search,
  Eye,
  Filter
} from 'lucide-react';
import { adminAPI, type News } from '../../services/adminApi';

export default function NewsManagement() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'event' | 'achievement' | 'announcement'>('all');
  const [filterHighlight, setFilterHighlight] = useState<'all' | 'highlighted' | 'normal'>('all');
  const [formData, setFormData] = useState({
    title_en: '',
    title_fr: '',
    content_en: '',
    content_fr: '',
    type: 'event' as 'event' | 'achievement' | 'announcement',
    event_date: '',
    location: '',
    is_highlight: false,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getNews();
      setNews(response.data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les actualités
  const filteredNews = news.filter(item => {
    const matchesSearch = 
      item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content_en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesHighlight = 
      filterHighlight === 'all' ? true :
      filterHighlight === 'highlighted' ? item.is_highlight :
      !item.is_highlight;
    
    return matchesSearch && matchesType && matchesHighlight;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'achievement':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Event';
      case 'achievement':
        return 'Achievement';
      default:
        return 'Announcement';
    }
  };

  const handleOpenModal = (newsItem?: News) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title_en: newsItem.title_en,
        title_fr: newsItem.title_fr,
        content_en: newsItem.content_en,
        content_fr: newsItem.content_fr,
        type: newsItem.type,
        event_date: newsItem.event_date || '',
        location: newsItem.location || '',
        is_highlight: newsItem.is_highlight,
        image: null,
      });
      if (newsItem.image) {
        setImagePreview(`http://localhost:8000/storage/${newsItem.image}`);
      }
    } else {
      setEditingNews(null);
      setFormData({
        title_en: '',
        title_fr: '',
        content_en: '',
        content_fr: '',
        type: 'event',
        event_date: '',
        location: '',
        is_highlight: false,
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
    setFormData({
      title_en: '',
      title_fr: '',
      content_en: '',
      content_fr: '',
      type: 'event',
      event_date: '',
      location: '',
      is_highlight: false,
      image: null,
    });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title_en', formData.title_en);
      submitData.append('title_fr', formData.title_fr);
      submitData.append('content_en', formData.content_en);
      submitData.append('content_fr', formData.content_fr);
      submitData.append('type', formData.type);
      submitData.append('is_highlight', formData.is_highlight ? '1' : '0');
      if (formData.event_date) submitData.append('event_date', formData.event_date);
      if (formData.location) submitData.append('location', formData.location);
      if (formData.image) submitData.append('image', formData.image);

      if (editingNews) {
        await adminAPI.updateNews(editingNews.id, submitData);
      } else {
        await adminAPI.createNews(submitData);
      }
      
      handleCloseModal();
      fetchNews();
    } catch (error: any) {
      console.error('Failed to save news:', error);
      if (error.response?.status === 422) {
        alert('Validation error: ' + JSON.stringify(error.response.data.errors));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      try {
        await adminAPI.deleteNews(id);
        fetchNews();
      } catch (error) {
        console.error('Failed to delete news:', error);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#F4F1EC]">News Management</h1>
          <p className="text-[#B8B0A8] mt-1">Manage kennel news, events, and achievements</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add News
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Total News</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{news.length}</p>
            </div>
            <Newspaper className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Events</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{news.filter(n => n.type === 'event').length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Achievements</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{news.filter(n => n.type === 'achievement').length}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Featured</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{news.filter(n => n.is_highlight).length}</p>
            </div>
            <Star className="w-8 h-8 text-[#C79A6B]" />
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
              placeholder="Search news by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg pl-10 pr-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            >
              <option value="all">All Types</option>
              <option value="event">Events</option>
              <option value="achievement">Achievements</option>
              <option value="announcement">Announcements</option>
            </select>
            <select
              value={filterHighlight}
              onChange={(e) => setFilterHighlight(e.target.value as any)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            >
              <option value="all">All Status</option>
              <option value="highlighted">Featured Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(199,154,107,0.2)] bg-[rgba(199,154,107,0.05)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Image</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Title (EN)</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Date/Location</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Created</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <Newspaper className="w-12 h-12 text-[#666] mx-auto mb-4" />
                    <p className="text-[#B8B0A8]">No news found</p>
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-[rgba(199,154,107,0.1)] hover:bg-[rgba(199,154,107,0.05)] transition-colors ${
                      item.is_highlight ? 'bg-[rgba(199,154,107,0.03)]' : ''
                    }`}
                  >
                    {/* Image */}
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[rgba(199,154,107,0.05)] to-[rgba(199,154,107,0.15)]">
                        {item.image ? (
                          <img
                            src={`http://localhost:8000/storage/${item.image}`}
                            alt={item.title_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-[#666]" />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Title */}
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-[#F4F1EC]">{item.title_en}</p>
                        <p className="text-xs text-[#666] mt-1">{item.title_fr}</p>
                      </div>
                    </td>
                    
                    {/* Type */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {getTypeLabel(item.type)}
                      </span>
                    </td>
                    
                    {/* Date/Location */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {item.event_date && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <Calendar className="w-3 h-3 text-[#C79A6B]" />
                            <span>{new Date(item.event_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {item.location && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <MapPin className="w-3 h-3 text-[#C79A6B]" />
                            <span className="truncate max-w-[150px]">{item.location}</span>
                          </div>
                        )}
                        {!item.event_date && !item.location && (
                          <span className="text-xs text-[#666]">—</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      {item.is_highlight ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C79A6B]/20 text-[#C79A6B] rounded-full text-xs font-semibold">
                          <Star className="w-3 h-3 fill-[#C79A6B]" />
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-[rgba(255,255,255,0.05)] text-[#666] rounded-full text-xs">
                          Normal
                        </span>
                      )}
                    </td>
                    
                    {/* Created */}
                    <td className="p-4">
                      <p className="text-xs text-[#B8B0A8]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Keep existing modal code */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#F4F1EC]">
                {editingNews ? 'Edit News' : 'Add News'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 text-[#B8B0A8] hover:text-[#F4F1EC]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#141414]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg text-sm text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.1)] transition-colors">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              
              {/* Type */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                >
                  <option value="event">Event</option>
                  <option value="achievement">Achievement</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              
              {/* Title EN */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Title (English)</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  required
                />
              </div>
              
              {/* Title FR */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Title (French)</label>
                <input
                  type="text"
                  value={formData.title_fr}
                  onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  required
                />
              </div>
              
              {/* Content EN */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Content (English)</label>
                <textarea
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  rows={4}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] resize-none"
                  required
                />
              </div>
              
              {/* Content FR */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Content (French)</label>
                <textarea
                  value={formData.content_fr}
                  onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
                  rows={4}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] resize-none"
                  required
                />
              </div>
              
              {/* Event Date */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Event Date (optional)</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
              
              {/* Location */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Location (optional)</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  placeholder="e.g., Antananarivo, Madagascar"
                />
              </div>
              
              {/* Highlight */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="highlight"
                  checked={formData.is_highlight}
                  onChange={(e) => setFormData({ ...formData, is_highlight: e.target.checked })}
                  className="w-4 h-4 rounded border-[rgba(199,154,107,0.3)] bg-[rgba(255,255,255,0.05)] text-[#C79A6B] focus:ring-[#C79A6B]"
                />
                <label htmlFor="highlight" className="text-sm text-[#B8B0A8]">
                  Featured / Highlight this news
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}