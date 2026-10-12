import React from 'react';
import { AppState } from '../../services/store';
import { UserCheck, Phone, Bus, Star, Award } from 'lucide-react';

interface AdminDriversProps {
  state: AppState;
}

export const AdminDrivers: React.FC<AdminDriversProps> = ({ state }) => {
  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          College Transit Drivers Roster
        </h2>
        <p className="text-xs text-slate-500">
          Authorized heavy vehicle operators, driver license credentials, and assigned bus units
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {state.drivers.map((d) => {
          const bus = state.buses.find((b) => b.busId === d.busId);
          return (
            <div
              key={d.driverId}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">{d.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono">ID: {d.driverId}</div>
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{d.rating} Rating</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">License Number:</span>
                  <strong className="text-slate-900 font-mono">{d.licenseNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Bus:</span>
                  <strong className="text-indigo-600 font-bold">{bus?.busNumber || 'None'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Contact:</span>
                  <a href={`tel:${d.phone}`} className="text-slate-900 font-medium hover:underline">
                    {d.phone}
                  </a>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Active On Duty
                </span>
                <a
                  href={`tel:${d.phone}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Call Driver</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
