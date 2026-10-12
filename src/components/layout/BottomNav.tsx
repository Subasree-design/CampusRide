import React from 'react';
import { UserRole } from '../../types';
import {
  Home,
  MapPin,
  Bus as BusIcon,
  Bell,
  User,
  Navigation,
  Users,
  AlertTriangle,
  QrCode,
  Map,
} from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeTab,
  onSelectTab,
  unreadCount = 0,
}) => {
  // Navigation tabs config based on user role
  const getTabs = () => {
    switch (role) {
      case 'student':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'track', label: 'Track', icon: MapPin },
          { id: 'mybus', label: 'My Bus', icon: BusIcon },
          { id: 'pass', label: 'Pass', icon: QrCode },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'driver':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'route', label: 'Live Route', icon: Navigation },
          { id: 'scanner', label: 'Scanner', icon: QrCode },
          { id: 'students', label: 'Roster', icon: Users },
          { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadCount },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      case 'hod':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'livebuses', label: 'Live Buses', icon: BusIcon },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: unreadCount },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'profile', label: 'Profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();
  if (tabs.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center py-1 px-2 min-w-[50px] transition-colors rounded-xl ${
                isActive ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-white">
                    {tab.badge! > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
