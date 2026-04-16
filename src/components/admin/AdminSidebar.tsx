// src/components/admin/AdminSidebar.tsx
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Mail, 
  Users, 
  Newspaper, 
  Package, 
  PawPrint,
  Settings,
  LogOut,
  Menu,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface NavItem {
  name: string;
  icon: any;
  path: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Stud Bookings', icon: Calendar, path: '/bookings' },
  { name: 'Messages', icon: Mail, path: '/messages' },
  { name: 'Waitlist', icon: Users, path: '/waitlist' },
  { name: 'News', icon: Newspaper, path: '/news' },
  { name: 'Products', icon: Package, path: '/products' },
  { name: 'Kennel', icon: PawPrint, path: '/kennel' },
  { name: 'Gallery', icon: ImageIcon, path: '/gallery' },  // CORRIGÉ: 'name' au lieu de 'label'
  { name: 'Settings', icon: Settings, path: '/settings' },
];

interface AdminSidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activePath, onNavigate, onLogout }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[rgba(199,154,107,0.2)]">
        <img src="/images/logo.png" alt="RR Boerboels" className="h-10" />
        <div>
          <h1 className="text-lg font-bold text-[#F4F1EC]">RR Boerboels</h1>
          <p className="text-xs text-[#B8B0A8]">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => {
                onNavigate(item.path);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[rgba(199,154,107,0.2)] text-[#C79A6B] border-l-2 border-[#C79A6B]'
                  : 'text-[#B8B0A8] hover:bg-[rgba(199,154,107,0.1)] hover:text-[#F4F1EC]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[rgba(199,154,107,0.2)] text-center">
        <p className="text-xs text-[#666]">© 2024 RR Boerboels</p>
        <p className="text-xs text-[#666] mt-1">Bred to Bond</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0B0B0C] border-r border-[rgba(199,154,107,0.2)] p-4 fixed left-0 top-0 h-full overflow-y-auto z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0B0B0C] border border-[rgba(199,154,107,0.3)] rounded-lg text-[#F4F1EC]"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 w-72 h-full bg-[#0B0B0C] border-r border-[rgba(199,154,107,0.2)] p-4 z-40 overflow-y-auto">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}