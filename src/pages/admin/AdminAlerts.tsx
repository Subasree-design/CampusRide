import React from 'react';
import { AppState, store } from '../../services/store';
import { ShieldAlert, CheckCircle2, Clock, MapPin, AlertTriangle, Phone } from 'lucide-react';

interface AdminAlertsProps {
  state: AppState;
}

export const AdminAlerts: React.FC<AdminAlertsProps> = ({ state }) => {
  const handleResolve = (eventId: string) => {
    store.resolveEmergency(eventId);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Transit Incidents &amp; Emergency Logs
        </h2>
        <p className="text-xs text-slate-500">
          Real-time registry of student SOS alarms, mechanical breakdowns, and response dispatches
        </p>
      </div>

      <div className="space-y-3">
        {state.emergencies.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">All Transit Routes Clear</h4>
            <p className="text-xs text-slate-500 mt-1">
              No active student emergencies or mechanical breakdowns reported today.
            </p>
          </div>
        ) : (
          state.emergencies.map((evt) => {
            const isResolved = evt.status === 'resolved';

            return (
              <div
                key={evt.eventId}
                className={`p-5 rounded-3xl border shadow-2xs space-y-3 transition-all ${
                  isResolved
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-red-50/60 border-red-300 ring-2 ring-red-100'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                      <ShieldAlert className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {evt.busNumber}: {evt.reason}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-red-600 text-white">
                          HIGH PRIORITY
                        </span>
                      </div>
                      <span className="text-xs text-slate-600">
                        Reported By: <strong>{evt.reportedByName}</strong> ({evt.reportedByRole.toUpperCase()})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 block">{evt.timestamp}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isResolved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Status: {evt.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Location Coords</span>
                    <strong className="text-slate-900">[{evt.latitude}, {evt.longitude}]</strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Dispatched To</span>
                    <strong className="text-indigo-700">{evt.recipientsNotified.join(', ')}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">
                    {isResolved ? `Resolved at ${evt.resolvedAt}` : 'Response active'}
                  </span>

                  {!isResolved && (
                    <button
                      onClick={() => handleResolve(evt.eventId)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
