// src/components/admin/GalleryManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Image, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Upload,
  Save,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Camera
} from 'lucide-react';
import { adminAPI, type GalleryItem } from '../../services/adminApi';
import toast from 'react-hot-toast';

export default function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'puppies' | 'dogs' | 'events'>('all');
  const [formData, setFormData] = useState({
    title_en: '',
    title_fr: '',
    category: 'puppies' as 'puppies' | 'dogs' | 'events',
    order: 0,
    is_active: true,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getGallery();
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    filterCategory === 'all' ? true : item.category === filterCategory
  );

  const handleOpenModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title_en: item.title_en || '',
        title_fr: item.title_fr || '',
        category: item.category,
        order: item.order,
        is_active: item.is_active,
        image: null,
      });
      setImagePreview(`http://localhost:8000/storage/${item.image}`);
    } else {
      setEditingItem(null);
      setFormData({
        title_en: '',
        title_fr: '',
        category: 'puppies',
        order: items.length,
        is_active: true,
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title_en: '',
      title_fr: '',
      category: 'puppies',
      order: 0,
      is_active: true,
      image: null,
    });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
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
    
    if (!formData.image && !editingItem) {
      toast.error('Please select an image');
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title_en', formData.title_en);
      submitData.append('title_fr', formData.title_fr);
      submitData.append('category', formData.category);
      submitData.append('order', String(formData.order));
      submitData.append('is_active', formData.is_active ? '1' : '0');
      if (formData.image) submitData.append('image', formData.image);

      if (editingItem) {
        await adminAPI.updateGallery(editingItem.id, submitData);
        toast.success('Gallery item updated successfully');
      } else {
        await adminAPI.createGallery(submitData);
        toast.success('Gallery item added successfully');
      }
      
      handleCloseModal();
      fetchGallery();
    } catch (error: any) {
      console.error('Failed to save gallery item:', error);
      toast.error(error.response?.data?.error || 'Failed to save gallery item');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await adminAPI.deleteGallery(id);
        toast.success('Gallery item deleted successfully');
        fetchGallery();
      } catch (error) {
        console.error('Failed to delete gallery item:', error);
        toast.error('Failed to delete gallery item');
      }
    }
  };

  const updateOrder = async (id: number, newOrder: number) => {
    try {
      const submitData = new FormData();
      submitData.append('order', String(newOrder));
      await adminAPI.updateGallery(id, submitData);
      fetchGallery();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'puppies': return 'Puppies';
      case 'dogs': return 'Dogs';
      case 'events': return 'Events';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'puppies': return 'bg-pink-500/20 text-pink-400';
      case 'dogs': return 'bg-blue-500/20 text-blue-400';
      case 'events': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Gallery Management</h1>
          <p className="text-[#B8B0A8] mt-1">Manage photos for the puppy gallery</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Total Photos</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{items.length}</p>
            </div>
            <Camera className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Puppies</p>
              <p className="text-2xl font-bold text-pink-400">{items.filter(i => i.category === 'puppies').length}</p>
            </div>
            <Image className="w-8 h-8 text-pink-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Dogs</p>
              <p className="text-2xl font-bold text-blue-400">{items.filter(i => i.category === 'dogs').length}</p>
            </div>
            <Image className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Active</p>
              <p className="text-2xl font-bold text-green-400">{items.filter(i => i.is_active).length}</p>
            </div>
            <Eye className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterCategory === 'all' ? 'bg-[#C79A6B] text-[#0B0B0C]' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.2)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterCategory('puppies')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterCategory === 'puppies' ? 'bg-pink-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(236,72,153,0.2)]'
            }`}
          >
            Puppies
          </button>
          <button
            onClick={() => setFilterCategory('dogs')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterCategory === 'dogs' ? 'bg-blue-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(59,130,246,0.2)]'
            }`}
          >
            Dogs
          </button>
          <button
            onClick={() => setFilterCategory('events')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filterCategory === 'events' ? 'bg-green-500 text-white' : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(34,197,94,0.2)]'
            }`}
          >
            Events
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-4 glass-card p-12 text-center">
            <Image className="w-12 h-12 text-[#666] mx-auto mb-4" />
            <p className="text-[#B8B0A8]">No photos found</p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={item.id} className="glass-card overflow-hidden group">
              <div className="relative aspect-square bg-[#141414]">
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.title_en || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="p-2 bg-[#C79A6B] rounded-lg text-[#0B0B0C] hover:bg-[#D4AF37] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {!item.is_active && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/80 text-white text-xs rounded-full flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Hidden
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => index > 0 && updateOrder(item.id, item.order - 1)}
                      className="p-1 text-[#B8B0A8] hover:text-[#C79A6B]"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => index < filteredItems.length - 1 && updateOrder(item.id, item.order + 1)}
                      className="p-1 text-[#B8B0A8] hover:text-[#C79A6B]"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {item.title_en && (
                  <p className="text-xs text-[#B8B0A8] truncate">{item.title_en}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#F4F1EC]">
                {editingItem ? 'Edit Photo' : 'Add New Photo'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 text-[#B8B0A8] hover:text-[#F4F1EC]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Image *</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#141414]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg text-sm text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.1)] transition-colors">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-[#666] mt-2">Max size: 5MB. Formats: JPG, PNG, GIF</p>
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Title (English)</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  placeholder="e.g., Beautiful Puppy"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Title (French)</label>
                <input
                  type="text"
                  value={formData.title_fr}
                  onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  placeholder="e.g., Magnifique Chiot"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                >
                  <option value="puppies">Puppies</option>
                  <option value="dogs">Dogs</option>
                  <option value="events">Events</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-[rgba(199,154,107,0.3)] bg-[rgba(255,255,255,0.05)] text-[#C79A6B] focus:ring-[#C79A6B]"
                />
                <label htmlFor="active" className="text-sm text-[#B8B0A8]">
                  Show on website
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