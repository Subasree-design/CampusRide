import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { NotificationCategory } from '../../types';
import {
  Bell,
  CheckCheck,
  Check,
  AlertTriangle,
  Radio,
  ShieldAlert,
  QrCode,
  Bus,
  Filter,
  ExternalLink,
} from 'lucide-react';

interface StudentNotificationsProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  state,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const user = state.currentUser;

  // Filter student-applicable notifications
  const notifications = state.notifications.filter((n) => {
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === 'student') {
      if (!n.recipientId || n.recipientId === user?.id) return true;
    }
    return false;
  });

  const filtered = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const unreadCount = filtered.filter((n) => !n.readStatus).length;

  const handleMarkAll = () => {
    store.markAllNotificationsRead(user?.id, 'student');
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'proximity':
        return <Radio className="w-4 h-4 text-amber-500" />;
      case 'delay':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'breakdown':
      case 'emergency':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'boarding':
        return <QrCode className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bus className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs text-slate-500">
            Real-time proximity, delay alerts, and transit announcements
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
        {['all', 'proximity', 'delay', 'boarding', 'emergency', 'announcement'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors capitalize ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm">No Notifications in this Category</h4>
            <p className="text-xs text-slate-400 mt-1">
              Alerts regarding bus arrival and delay updates will appear here.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.notificationId}
              onClick={() => store.markNotificationRead(item.notificationId)}
              className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
                !item.readStatus
                  ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                      {!item.readStatus && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{item.timestamp}</span>
                      {item.busId && (
                        <>
                          <span>•</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('track');
                            }}
                            className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                          >
                            Track Bus <ExternalLink className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!item.readStatus && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      store.markNotificationRead(item.notificationId);
                    }}
                    title="Mark as read"
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
