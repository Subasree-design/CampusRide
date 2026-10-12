import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Bus,
  Route,
  Users,
  UserCheck,
  Building2,
  ClockAlert,
  AlertTriangle,
  Sliders,
  LogOut,
} from 'lucide-react';
import { store } from '../../services/store';

interface AdminSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeDelayCount?: number;
  emergencyCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  activeDelayCount = 0,
  emergencyCount = 0,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'livemap', label: 'Live Fleet Map', icon: MapPin },
    { id: 'buses', label: 'Bus Fleet', icon: Bus },
    { id: 'routes', label: 'Routes & Stops', icon: Route },
    { id: 'students', label: 'Students Roster', icon: Users },
    { id: 'drivers', label: 'Drivers', icon: UserCheck },
    { id: 'hods', label: 'HODs & Depts', icon: Building2 },
    {
      id: 'delays',
      label: 'Delay Monitoring',
      icon: ClockAlert,
      badge: activeDelayCount > 0 ? `${activeDelayCount}` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
    {
      id: 'alerts',
      label: 'Emergency & Incidents',
      icon: AlertTriangle,
      badge: emergencyCount > 0 ? `${emergencyCount}` : undefined,
      badgeColor: 'bg-rose-600 text-white animate-pulse',
    },
    { id: 'settings', label: 'Settings & Demo', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 border-r border-slate-800 shrink-0 hidden md:flex">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Transport Administration
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800 text-xs">
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl mb-3 text-[11px] text-slate-400">
          <div className="font-bold text-slate-300">KCG Transit Ops v2.4</div>
          <div>Connected to Dispatch Desk</div>
        </div>
        <button
          onClick={() => store.logout()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
