// src/components/admin/ProductsManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Image as ImageIcon,
  Save,
  DollarSign,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { adminAPI, type Product } from '../../services/adminApi';

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [formData, setFormData] = useState({
    name_en: '',
    name_fr: '',
    description_en: '',
    description_fr: '',
    price: '',
    currency: 'Ariary',
    is_available: true,
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description_en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAvailability = 
      filterAvailability === 'all' ? true :
      filterAvailability === 'available' ? product.is_available :
      !product.is_available;
    
    return matchesSearch && matchesAvailability;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name_en: product.name_en,
        name_fr: product.name_fr,
        description_en: product.description_en,
        description_fr: product.description_fr,
        price: product.price?.toString() || '',
        currency: product.currency,
        is_available: product.is_available,
        image: null,
      });
      if (product.image) {
        setImagePreview(`http://localhost:8000/storage/${product.image}`);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name_en: '',
        name_fr: '',
        description_en: '',
        description_fr: '',
        price: '',
        currency: 'Ariary',
        is_available: true,
        image: null,
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name_en: '',
      name_fr: '',
      description_en: '',
      description_fr: '',
      price: '',
      currency: 'Ariary',
      is_available: true,
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
      submitData.append('name_en', formData.name_en);
      submitData.append('name_fr', formData.name_fr);
      submitData.append('description_en', formData.description_en);
      submitData.append('description_fr', formData.description_fr);
      submitData.append('price', formData.price);
      submitData.append('currency', formData.currency);
      submitData.append('is_available', formData.is_available ? '1' : '0');
      if (formData.image) submitData.append('image', formData.image);

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, submitData);
      } else {
        await adminAPI.createProduct(submitData);
      }
      
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      if (error.response?.status === 422) {
        console.error('Validation errors:', error.response.data.errors);
        alert('Validation error: ' + JSON.stringify(error.response.data.errors));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const toggleAvailability = async (id: number, currentStatus: boolean) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        const submitData = new FormData();
        submitData.append('name_en', product.name_en);
        submitData.append('name_fr', product.name_fr);
        submitData.append('description_en', product.description_en);
        submitData.append('description_fr', product.description_fr);
        submitData.append('price', product.price?.toString() || '');
        submitData.append('currency', product.currency);
        submitData.append('is_available', !currentStatus ? '1' : '0');
        await adminAPI.updateProduct(id, submitData);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to update product status:', error);
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
          <h1 className="text-2xl font-bold text-[#F4F1EC]">Products Management</h1>
          <p className="text-[#B8B0A8] mt-1">Manage pet products and supplies</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg text-sm font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B8B0A8]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg pl-10 pr-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterAvailability === 'all' 
                  ? 'bg-[#C79A6B] text-[#0B0B0C]' 
                  : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.2)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAvailability('available')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterAvailability === 'available' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(34,197,94,0.2)]'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilterAvailability('unavailable')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterAvailability === 'unavailable' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-[rgba(255,255,255,0.05)] text-[#B8B0A8] hover:bg-[rgba(239,68,68,0.2)]'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des produits */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[rgba(199,154,107,0.2)]">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Image</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Name (EN)</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Name (FR)</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Price</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Created</th>
                <th className="text-left p-4 text-sm font-semibold text-[#C79A6B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12">
                    <Package className="w-12 h-12 text-[#666] mx-auto mb-4" />
                    <p className="text-[#B8B0A8]">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[rgba(199,154,107,0.1)] hover:bg-[rgba(199,154,107,0.05)] transition-colors">
                    {/* Image */}
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[rgba(199,154,107,0.05)] to-[rgba(199,154,107,0.15)]">
                        {product.image ? (
                          <img
                            src={`http://localhost:8000/storage/${product.image}`}
                            alt={product.name_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-[#666]" />
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Name EN */}
                    <td className="p-4">
                      <p className="text-sm font-medium text-[#F4F1EC]">{product.name_en}</p>
                    </td>
                    
                    {/* Name FR */}
                    <td className="p-4">
                      <p className="text-sm text-[#B8B0A8]">{product.name_fr}</p>
                    </td>
                    
                    {/* Price */}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#C79A6B]" />
                        <span className="text-sm text-[#F4F1EC]">
                          {product.price ? `${Number(product.price).toLocaleString()} ${product.currency}` : '—'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        product.is_available 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.is_available ? 'Available' : 'Coming Soon'}
                      </span>
                    </td>
                    
                    {/* Created */}
                    <td className="p-4">
                      <p className="text-xs text-[#B8B0A8]">
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleAvailability(product.id, product.is_available)}
                          className={`p-1.5 transition-colors ${
                            product.is_available 
                              ? 'text-green-400 hover:bg-green-500/10' 
                              : 'text-red-400 hover:bg-red-500/10'
                          }`}
                          title={product.is_available ? 'Mark as Coming Soon' : 'Mark as Available'}
                        >
                          {product.is_available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

      {/* Modal (inchangé) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#F4F1EC]">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 text-[#B8B0A8] hover:text-[#F4F1EC]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Product Image</label>
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
              
              {/* Name EN */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Name (English)</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  required
                />
              </div>
              
              {/* Name FR */}
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Name (French)</label>
                <input
                  type="text"
                  value={formData.name_fr}
                  onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  required
                />
              </div>
              
              {/* Description EN */}
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
              
              {/* Description FR */}
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
              
              {/* Price and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  >
                    <option value="Ariary">Ariary</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              
              {/* Availability */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4 rounded border-[rgba(199,154,107,0.3)] bg-[rgba(255,255,255,0.05)] text-[#C79A6B] focus:ring-[#C79A6B]"
                />
                <label htmlFor="available" className="text-sm text-[#B8B0A8]">
                  Product is available for sale
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