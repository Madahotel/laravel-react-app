// src/components/admin/KennelManagement.tsx
import { useState, useEffect } from 'react';
import { 
  PawPrint, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Image as ImageIcon,
  Save,
  Heart,
  Award,
  Calendar,
  Scale,
  Search,
  Star,
  Venus,
  Mars
} from 'lucide-react';
import { adminAPI, type Dog } from '../../services/adminApi';

export default function KennelManagement() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'male' | 'female'>('all');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'normal'>('all');
  const [formData, setFormData] = useState({
    name: '',
    role: 'male' as 'male' | 'female',
    role_label: '',
    description_en: '',
    description_fr: '',
    age: '',
    color: '',
    weight: '',
    registration: '',
    achievements: '',
    is_featured: false,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDogs();
      setDogs(response.data);
    } catch (error) {
      console.error('Failed to fetch dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les chiens
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = 
      dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.role_label.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || dog.role === filterRole;
    const matchesFeatured = 
      filterFeatured === 'all' ? true :
      filterFeatured === 'featured' ? dog.is_featured :
      !dog.is_featured;
    
    return matchesSearch && matchesRole && matchesFeatured;
  });

  const getRoleIcon = (role: string) => {
    return role === 'male' ? <Mars className="w-4 h-4" /> : <Venus className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    return role === 'male' 
      ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
      : 'text-pink-400 bg-pink-500/10 border-pink-500/20';
  };

  const getRoleLabel = (role: string) => {
    return role === 'male' ? 'Stud' : 'Female';
  };

  const handleOpenModal = (dog?: Dog) => {
    if (dog) {
      setEditingDog(dog);
      setFormData({
        name: dog.name,
        role: dog.role,
        role_label: dog.role_label,
        description_en: dog.description_en,
        description_fr: dog.description_fr,
        age: dog.age,
        color: dog.color,
        weight: dog.weight,
        registration: dog.registration,
        achievements: dog.achievements.join(', '),
        is_featured: dog.is_featured,
        image: null,
      });
      if (dog.image) {
        setImagePreview(`http://localhost:8000/storage/${dog.image}`);
      }
    } else {
      setEditingDog(null);
      setFormData({
        name: '',
        role: 'male',
        role_label: '',
        description_en: '',
        description_fr: '',
        age: '',
        color: '',
        weight: '',
        registration: '',
        achievements: '',
        is_featured: false,
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDog(null);
    setFormData({
      name: '',
      role: 'male',
      role_label: '',
      description_en: '',
      description_fr: '',
      age: '',
      color: '',
      weight: '',
      registration: '',
      achievements: '',
      is_featured: false,
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
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('role_label', formData.role_label);
      submitData.append('description_en', formData.description_en);
      submitData.append('description_fr', formData.description_fr);
      submitData.append('age', formData.age);
      submitData.append('color', formData.color);
      submitData.append('weight', formData.weight);
      submitData.append('registration', formData.registration);
      submitData.append('achievements', formData.achievements);
      submitData.append('is_featured', formData.is_featured ? '1' : '0');
      if (formData.image) submitData.append('image', formData.image);

      if (editingDog) {
        await adminAPI.updateDog(editingDog.id, submitData);
      } else {
        await adminAPI.createDog(submitData);
      }
      
      handleCloseModal();
      fetchDogs();
    } catch (error: any) {
      console.error('Failed to save dog:', error);
      if (error.response?.status === 422) {
        alert('Validation error: ' + JSON.stringify(error.response.data.errors));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this dog from the kennel?')) {
      try {
        await adminAPI.deleteDog(id);
        fetchDogs();
      } catch (error) {
        console.error('Failed to delete dog:', error);
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
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Kennel Management</h1>
          <p className="text-[#B8B0A8] mt-1">Manage your dogs and breeding program</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Dog
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Total Dogs</p>
              <p className="text-2xl font-bold text-[#F4F1EC]">{dogs.length}</p>
            </div>
            <PawPrint className="w-8 h-8 text-[#C79A6B]" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Males</p>
              <p className="text-2xl font-bold text-blue-400">{dogs.filter(d => d.role === 'male').length}</p>
            </div>
            <Mars className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Females</p>
              <p className="text-2xl font-bold text-pink-400">{dogs.filter(d => d.role === 'female').length}</p>
            </div>
            <Venus className="w-8 h-8 text-pink-400" />
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#B8B0A8]">Featured</p>
              <p className="text-2xl font-bold text-yellow-400">{dogs.filter(d => d.is_featured).length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
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
              placeholder="Search dogs by name, description or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg pl-10 pr-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            >
              <option value="all">All Roles</option>
              <option value="male">Males (Stud)</option>
              <option value="female">Females</option>
            </select>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value as any)}
              className="bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            >
              <option value="all">All Status</option>
              <option value="featured">Featured Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dogs Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(199,154,107,0.2)] bg-[rgba(199,154,107,0.05)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Photo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Name</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Details</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Achievements</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <PawPrint className="w-12 h-12 text-[#666] mx-auto mb-4" />
                    <p className="text-[#B8B0A8]">No dogs found</p>
                  </td>
                </tr>
              ) : (
                filteredDogs.map((dog) => (
                  <tr 
                    key={dog.id} 
                    className={`border-b border-[rgba(199,154,107,0.1)] hover:bg-[rgba(199,154,107,0.05)] transition-colors ${
                      dog.is_featured ? 'bg-[rgba(199,154,107,0.03)]' : ''
                    }`}
                  >
                    {/* Photo */}
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[rgba(199,154,107,0.05)] to-[rgba(199,154,107,0.15)]">
                        {dog.image ? (
                          <img
                            src={`http://localhost:8000/storage/${dog.image}`}
                            alt={dog.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PawPrint className="w-5 h-5 text-[#666]" />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Name */}
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-semibold text-[#F4F1EC]">{dog.name}</p>
                        <p className="text-xs text-[#C79A6B] mt-1">{dog.role_label}</p>
                      </div>
                    </td>
                    
                    {/* Role */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getRoleColor(dog.role)}`}>
                        {getRoleIcon(dog.role)}
                        {getRoleLabel(dog.role)}
                      </span>
                    </td>
                    
                    {/* Details */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {dog.age && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <Calendar className="w-3 h-3 text-[#C79A6B]" />
                            <span>{dog.age}</span>
                          </div>
                        )}
                        {dog.weight && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <Scale className="w-3 h-3 text-[#C79A6B]" />
                            <span>{dog.weight}</span>
                          </div>
                        )}
                        {dog.color && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <PawPrint className="w-3 h-3 text-[#C79A6B]" />
                            <span>{dog.color}</span>
                          </div>
                        )}
                        {dog.registration && (
                          <div className="flex items-center gap-1 text-xs text-[#B8B0A8]">
                            <Award className="w-3 h-3 text-[#C79A6B]" />
                            <span>{dog.registration}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Achievements */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {dog.achievements.length > 0 ? (
                          dog.achievements.slice(0, 2).map((achievement, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[rgba(199,154,107,0.1)] text-[#C79A6B] text-xs rounded-full">
                              {achievement.length > 20 ? achievement.substring(0, 20) + '...' : achievement}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-[#666]">—</span>
                        )}
                        {dog.achievements.length > 2 && (
                          <span className="px-2 py-0.5 text-[#666] text-xs">
                            +{dog.achievements.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      {dog.is_featured ? (
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
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(dog)}
                          className="p-1.5 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dog.id)}
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

      {/* Modal - Add/Edit Dog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#F4F1EC]">
                {editingDog ? 'Edit Dog' : 'Add New Dog'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 text-[#B8B0A8] hover:text-[#F4F1EC]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Dog Photo</label>
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
              
              {/* Name */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Dog Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  required
                />
              </div>
              
              {/* Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  >
                    <option value="male">Male (Stud)</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Role Label</label>
                  <input
                    type="text"
                    value={formData.role_label}
                    onChange={(e) => setFormData({ ...formData, role_label: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="e.g., Available Stud, Young Female"
                  />
                </div>
              </div>
              
              {/* Descriptions */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Description (English)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Description (French)</label>
                <textarea
                  value={formData.description_fr}
                  onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                  rows={3}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B] resize-none"
                  required
                />
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="e.g., 1.5 years"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="e.g., Solid Black, Fawn"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="e.g., 78 kg"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Registration</label>
                  <input
                    type="text"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="e.g., SABBS"
                  />
                </div>
              </div>
              
              {/* Achievements */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Achievements (comma separated)</label>
                <input
                  type="text"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  placeholder="e.g., SABBS Registered, Puppy Champion, Gold Medal 2025"
                />
              </div>
              
              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-[rgba(199,154,107,0.3)] bg-[rgba(255,255,255,0.05)] text-[#C79A6B] focus:ring-[#C79A6B]"
                />
                <label htmlFor="featured" className="text-sm text-[#B8B0A8]">
                  Feature this dog on the homepage
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