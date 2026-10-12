import React from 'react';
import { AppState, store } from '../../services/store';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import {
  Building2,
  AlertTriangle,
  Clock,
  Users,
  Bus as BusIcon,
  PhoneCall,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface HODDashboardProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const HODDashboard: React.FC<HODDashboardProps> = ({ state, onNavigate }) => {
  const user = state.currentUser;
  const currentDept = user?.department || 'CSE';
  const hod = state.hods.find((h) => h.department === currentDept) || state.hods[0];

  // Students belonging to THIS department only!
  const deptStudents = state.students.filter((s) => s.department === currentDept);
  const totalDeptStudents = deptStudents.length;

  // Active delay alerts for buses carrying students from this department
  const activeAlerts = state.delayAlerts.filter((alert) => {
    return alert.affectedDepartments.some((d) => d.department === currentDept);
  });

  // Delayed buses with students from this department
  const delayedBuses = state.buses.filter((b) => {
    if (b.status !== 'delayed' && b.status !== 'breakdown') return false;
    const hasDeptStudents = state.students.some(
      (s) => s.busId === b.busId && s.department === currentDept
    );
    return hasDeptStudents;
  });

  // Calculate total affected students in this department right now
  let totalAffectedDeptStudents = 0;
  delayedBuses.forEach((b) => {
    const count = state.students.filter(
      (s) => s.busId === b.busId && s.department === currentDept
    ).length;
    totalAffectedDeptStudents += count;
  });

  const handleAcknowledge = (alertId: string) => {
    store.acknowledgeDelayAlert(alertId, hod.name);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentDept} Department Transit Monitoring
          </h2>
          <p className="text-xs text-slate-500">
            Head of Department: <strong className="text-slate-800">{hod.name}</strong> • {hod.cabin}
          </p>
        </div>
        <SimulationBadge />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" /> Total {currentDept} Commuters
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalDeptStudents}</div>
          <span className="text-[10px] text-slate-500">Registered on college buses</span>
        </div>

        <div className={`p-4 rounded-2xl border shadow-2xs ${
          delayedBuses.length > 0
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-slate-200/90'
        }`}>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Delayed Buses
          </span>
          <div className={`text-2xl font-black mt-1 ${
            delayedBuses.length > 0 ? 'text-amber-900' : 'text-slate-900'
          }`}>
            {delayedBuses.length}
          </div>
          <span className="text-[10px] text-slate-600">Affecting your department</span>
        </div>

        <div className={`p-4 rounded-2xl border shadow-2xs ${
          totalAffectedDeptStudents > 0
            ? 'bg-rose-50/70 border-rose-300'
            : 'bg-white border-slate-200/90'
        }`}>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-600" /> Affected {currentDept} Students
          </span>
          <div className={`text-2xl font-black mt-1 ${
            totalAffectedDeptStudents > 0 ? 'text-rose-900' : 'text-slate-900'
          }`}>
            {totalAffectedDeptStudents}
          </div>
          <span className="text-[10px] text-slate-600">Pending delayed arrival</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Transit Priority
          </span>
          <div className="text-lg font-black text-emerald-700 mt-1">Normal Ops</div>
          <span className="text-[10px] text-slate-500">Emergency desk live</span>
        </div>
      </div>

      {/* Active Delay Alerts Section (CRITICAL SECTION 16 & 17) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Department Delay &amp; Impact Alerts
            </h3>
            <p className="text-xs text-slate-500">
              Filtered specifically for <strong>{currentDept}</strong> department students
            </p>
          </div>
          {activeAlerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {activeAlerts.length} Active Alert{activeAlerts.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Active Delays for {currentDept}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All college buses carrying {currentDept} students are running on schedule. You can use the Demo Simulator bar to simulate a 15-minute or 25-minute delay.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const deptImpact = alert.affectedDepartments.find(
                (d) => d.department === currentDept
              );
              const bus = state.buses.find((b) => b.busId === alert.busId);
              const driver = state.drivers.find((d) => d.driverId === bus?.driverId);
              const isAcknowledged = alert.status === 'acknowledged';

              return (
                <div
                  key={alert.alertId}
                  className={`p-5 rounded-3xl border shadow-sm space-y-3 transition-all ${
                    alert.priority === 'high'
                      ? 'bg-gradient-to-r from-rose-50/70 to-amber-50/70 border-rose-300'
                      : 'bg-white border-amber-300 ring-2 ring-amber-100'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                        🚨
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            BUS DELAY ALERT: {alert.busNumber}
                          </h4>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full ${
                            alert.priority === 'high'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-950'
                          }`}>
                            {alert.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{alert.routeName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-400 block">
                        Alerted: {alert.timestamp}
                      </span>
                      {isAcknowledged ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Acknowledged by {alert.acknowledgedBy}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Awaiting HOD Acknowledgment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Impact Breakdown - CRITICAL REQUIREMENT */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Department
                      </span>
                      <div className="font-black text-slate-900 text-sm mt-0.5">
                        {currentDept} Dept
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-300">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">
                        Affected Students
                      </span>
                      <div className="font-black text-amber-950 text-base mt-0.5">
                        {deptImpact?.studentCount || 0} {currentDept} Students
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Delay Duration
                      </span>
                      <div className="font-black text-rose-600 text-sm mt-0.5">
                        +{alert.delayMinutes} Minutes
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Current ETA
                      </span>
                      <div className="font-black text-indigo-700 text-sm mt-0.5">
                        {alert.currentETA} (Sched: {alert.expectedETA})
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200">
                    <strong>Reported Cause:</strong> {alert.reason}
                  </div>

                  {/* Driver & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {driver && (
                      <div className="flex items-center gap-2 text-xs">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-slate-600 font-medium">
                          Driver: <strong className="text-slate-900">{driver.name}</strong> ({driver.phone})
                        </span>
                        <a
                          href={`tel:${driver.phone}`}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Call Driver"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('students')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        View {deptImpact?.studentCount || 0} {currentDept} Students
                      </button>

                      {!isAcknowledged && (
                        <button
                          onClick={() => handleAcknowledge(alert.alertId)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-xs"
                        >
                          Acknowledge Alert
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assigned Buses Table for this Department */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">
            College Buses Carrying {currentDept} Students
          </h3>
          <span className="text-xs text-slate-500 font-medium">All Route Lines</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {state.buses.map((b) => {
            const count = state.students.filter(
              (s) => s.busId === b.busId && s.department === currentDept
            ).length;
            const driver = state.drivers.find((d) => d.driverId === b.driverId);
            const route = state.routes.find((r) => r.routeId === b.routeId);

            return (
              <div key={b.busId} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 font-black text-sm flex items-center justify-center shrink-0">
                    🚌
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                      <span>{b.busNumber}</span>
                      <span className="font-mono text-[10px] text-slate-400">({b.plateNumber})</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {count} {currentDept} Students
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] truncate">
                      {route?.routeName.split(':')[0]} • Driver: {driver?.name}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-bold capitalize ${
                    b.status === 'delayed'
                      ? 'text-amber-600'
                      : b.status === 'breakdown'
                      ? 'text-rose-600'
                      : 'text-emerald-600'
                  }`}>
                    {b.status === 'delayed' ? `Delayed (+${b.delayMinutes}m)` : b.status}
                  </div>
                  <div className="text-[11px] text-slate-400">ETA: {b.currentETA}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
