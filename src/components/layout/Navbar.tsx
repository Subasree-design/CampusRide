import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { store, AppState } from '../../services/store';
import {
  Bell,
  LogOut,
  ShieldAlert,
  User as UserIcon,
  CheckCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  state: AppState;
  onOpenSOS?: () => void;
  onNavigate?: (tab: string) => void;
  activeTab?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onOpenSOS,
  onNavigate,
  activeTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const user = state.currentUser;

  // Filter unread notifications relevant to current user
  const userNotifications = state.notifications.filter((n) => {
    if (!user) return false;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === user.role) {
      if (!n.recipientId) return true;
      return n.recipientId === user.id;
    }
    return false;
  });

  const unreadCount = userNotifications.filter((n) => !n.readStatus).length;

  const handleLogout = () => {
    store.logout();
  };

  const handleMarkAllRead = () => {
    if (user) {
      store.markAllNotificationsRead(user.id, user.role);
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Student • {user.department || 'CSE'}
          </span>
        );
      case 'driver':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            Driver • KCG-07
          </span>
        );
      case 'hod':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            HOD • {user.department}
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
            Transport Admin
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Wordmark */}
        <div
          onClick={() => onNavigate?.('home')}
          className="cursor-pointer hover:opacity-95 transition-opacity"
        >
          <BrandLogo size="sm" horizontal showTagline={false} />
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency SOS Button for Students */}
          {user?.role === 'student' && onOpenSOS && (
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all animate-pulse"
              title="Emergency SOS Button"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="hidden xs:inline">SOS</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Tray */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications yet.
                    </div>
                  ) : (
                    userNotifications.slice(0, 10).map((n) => (
                      <div
                        key={n.notificationId}
                        onClick={() => {
                          store.markNotificationRead(n.notificationId);
                          if (user?.role === 'student' && onNavigate) onNavigate('notifications');
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.readStatus ? 'bg-amber-50/40 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 line-clamp-1">{n.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      if (onNavigate) onNavigate('notifications');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 w-full"
                  >
                    View All Notifications <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || 'Guest User'}
              </span>
              <span className="mt-0.5">{getRoleBadge()}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
