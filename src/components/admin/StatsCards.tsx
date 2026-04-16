// src/components/admin/StatsCards.tsx
import { Calendar, Mail, Users, Clock, CheckCircle, XCircle, Newspaper, Package } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}

interface StatsCardsProps {
  stats: {
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    total_messages: number;
    unread_messages: number;
    total_waitlist: number;
    total_news: number;
    total_products: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCard[] = [
    { title: 'Total Bookings', value: stats.total_bookings, icon: Calendar, color: '#C79A6B', bgColor: 'rgba(199,154,107,0.1)' },
    { title: 'Pending', value: stats.pending_bookings, icon: Clock, color: '#EAB308', bgColor: 'rgba(234,179,8,0.1)' },
    { title: 'Confirmed', value: stats.confirmed_bookings, icon: CheckCircle, color: '#22C55E', bgColor: 'rgba(34,197,94,0.1)' },
    { title: 'Cancelled', value: stats.cancelled_bookings, icon: XCircle, color: '#EF4444', bgColor: 'rgba(239,68,68,0.1)' },
    { title: 'Messages', value: stats.total_messages, icon: Mail, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)' },
    { title: 'Unread', value: stats.unread_messages, icon: Mail, color: '#F59E0B', bgColor: 'rgba(245,158,11,0.1)' },
    { title: 'Waitlist', value: stats.total_waitlist, icon: Users, color: '#8B5CF6', bgColor: 'rgba(139,92,246,0.1)' },
    { title: 'News', value: stats.total_news, icon: Newspaper, color: '#EC4899', bgColor: 'rgba(236,72,153,0.1)' },
    { title: 'Products', value: stats.total_products, icon: Package, color: '#14B8A6', bgColor: 'rgba(20,184,166,0.1)' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="glass-card p-4 hover:scale-105 transition-transform duration-200"
            style={{ borderColor: `${card.color}30` }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <Icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <span className="text-2xl font-bold text-[#F4F1EC]">{card.value}</span>
            </div>
            <p className="text-sm text-[#B8B0A8] mt-3">{card.title}</p>
          </div>
        );
      })}
    </div>
  );
}