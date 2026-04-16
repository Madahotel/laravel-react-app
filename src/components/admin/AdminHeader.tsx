// src/components/admin/AdminHeader.tsx
import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';

interface AdminHeaderProps {
  adminName: string;
  onSearch?: (query: string) => void;
}

export default function AdminHeader({ adminName, onSearch }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="bg-[#0B0B0C] border-b border-[rgba(199,154,107,0.2)] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(199,154,107,0.3)] rounded-lg text-[#F4F1EC] placeholder:text-[#666] focus:outline-none focus:border-[#C79A6B] w-80"
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 text-[#B8B0A8] hover:text-[#C79A6B] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[rgba(199,154,107,0.2)] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-[#C79A6B]" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-[#F4F1EC]">{adminName}</p>
              <p className="text-xs text-[#B8B0A8]">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}