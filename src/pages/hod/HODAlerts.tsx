import React from 'react';
import { AppState, store } from '../../services/store';
import { AlertTriangle, Clock, Users, CheckCircle2, PhoneCall } from 'lucide-react';

interface HODAlertsProps {
  state: AppState;
}

export const HODAlerts: React.FC<HODAlertsProps> = ({ state }) => {
  const user = state.currentUser;
  const currentDept = user?.department || 'CSE';
  const hod = state.hods.find((h) => h.department === currentDept) || state.hods[0];

  // All alerts with students from this department
  const deptAlerts = state.delayAlerts.filter((alert) =>
    alert.affectedDepartments.some((d) => d.department === currentDept)
  );

  const handleAcknowledge = (alertId: string) => {
    store.acknowledgeDelayAlert(alertId, hod.name);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Department Delay Incident Log
        </h2>
        <p className="text-xs text-slate-500">
          Audited log of transit delays and escalations affecting {currentDept} students
        </p>
      </div>

      <div className="space-y-3">
        {deptAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">No Delay Incidents on Record</h4>
            <p className="text-xs text-slate-500 mt-1">
              Any delays crossing the 10-minute threshold will be recorded and audited here.
            </p>
          </div>
        ) : (
          deptAlerts.map((alert) => {
            const deptImpact = alert.affectedDepartments.find((d) => d.department === currentDept);
            const isAck = alert.status === 'acknowledged';

            return (
              <div
                key={alert.alertId}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {alert.busNumber} • {alert.routeName}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      alert.priority === 'high' ? 'bg-rose-100 text-rose-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {alert.priority} Priority
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Affected {currentDept} Students
                    </span>
                    <strong className="text-slate-900 text-sm">{deptImpact?.studentCount || 0} Students</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Delay Duration
                    </span>
                    <strong className="text-rose-600 text-sm">+{alert.delayMinutes} mins</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Current Campus ETA
                    </span>
                    <strong className="text-indigo-600 text-sm">{alert.currentETA}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <strong>Reason:</strong> {alert.reason}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div>
                    {isAck ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold text-[11px]">
                        Pending your acknowledgment
                      </span>
                    )}
                  </div>

                  {!isAck && (
                    <button
                      onClick={() => handleAcknowledge(alert.alertId)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-xs"
                    >
                      Acknowledge
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
