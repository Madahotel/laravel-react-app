// src/components/admin/Settings.tsx
import { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Lock,
  User,
  Bell,
  Shield,
  Database
} from 'lucide-react';

interface SettingsData {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  whatsapp_number: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  business_hours: string;
  booking_notification_email: string;
  admin_email: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    site_name: 'RR Boerboels',
    site_description: 'Bred to Bond - Premium Boerboel breeder in Madagascar',
    contact_email: 'contact@rrboerboels.com',
    contact_phone: '+261 34 123 4567',
    address: 'Antananarivo, Madagascar',
    whatsapp_number: '+261341234567',
    facebook_url: 'https://facebook.com/rrboerboels',
    instagram_url: 'https://instagram.com/rrboerboels',
    youtube_url: 'https://youtube.com/@rrboerboels',
    twitter_url: 'https://twitter.com/rrboerboels',
    business_hours: 'Mon – Sat: 9:00 – 17:00',
    booking_notification_email: 'bookings@rrboerboels.com',
    admin_email: 'admin@rrboerboels.com',
  });
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'notifications' | 'security'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Remplacer par l'appel API réel
      // const response = await adminApi.getSettings();
      // setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remplacer par l'appel API réel
      // await adminApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F4F1EC]">Settings</h1>
        <p className="text-[#B8B0A8] mt-1">Manage your website configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[rgba(199,154,107,0.2)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'text-[#C79A6B] border-b-2 border-[#C79A6B]'
                  : 'text-[#B8B0A8] hover:text-[#F4F1EC]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#C79A6B]" />
                Site Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Site Name</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Site Description</label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    rows={3}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C79A6B]" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Contact Phone</label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Address</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Business Hours</label>
                  <input
                    type="text"
                    value={settings.business_hours}
                    onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                    placeholder="Mon – Sat: 9:00 – 17:00"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#C79A6B]" />
              Social Media Links
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-500" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={settings.youtube_url}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#C79A6B]" />
              Email Notifications
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Booking Notification Email</label>
                <input
                  type="email"
                  value={settings.booking_notification_email}
                  onChange={(e) => setSettings({ ...settings, booking_notification_email: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
                <p className="text-xs text-[#666] mt-1">Receive email when a new stud booking is made</p>
              </div>
              
              <div>
                <label className="text-sm text-[#B8B0A8] mb-2 block">Admin Email</label>
                <input
                  type="email"
                  value={settings.admin_email}
                  onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C79A6B]" />
                Change Password
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Current Password</label>
                  <input
                    type="password"
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-[#B8B0A8] mb-2 block">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg px-4 py-2 text-[#F4F1EC] focus:outline-none focus:border-[#C79A6B]"
                  />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-[#F4F1EC] mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C79A6B]" />
                Data Management
              </h2>
              
              <div className="space-y-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
                >
                  Export All Data (CSV)
                </button>
                
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors ml-3"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="sticky bottom-0 mt-6 pt-4 pb-4 bg-[#0B0B0C] border-t border-[rgba(199,154,107,0.2)]">
          <div className="flex items-center justify-between">
            {saved && (
              <div className="text-green-400 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" />
                Settings saved successfully!
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-[#C79A6B] text-[#0B0B0C] rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}