import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { DelayDetectionService } from '../../services/delayDetectionService';
import { Bus, DelayAlert } from '../../types';
import {
  ClockAlert,
  AlertTriangle,
  Users,
  Building2,
  CheckCircle2,
  X,
  PhoneCall,
  MapPin,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface AdminDelayMonitoringProps {
  state: AppState;
}

export const AdminDelayMonitoring: React.FC<AdminDelayMonitoringProps> = ({ state }) => {
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulate15m = (busId: string) => {
    const res = DelayDetectionService.evaluateBusDelay(busId, 15, 'Heavy GST Road Congestion');
    showToast(`🚨 15-minute delay simulated for Bus ${busId}! CSE, ECE, and IT HODs notified.`);
  };

  const handleSimulate25m = (busId: string) => {
    const res = DelayDetectionService.evaluateBusDelay(busId, 25, 'Severe Road Work Bottleneck at Tambaram');
    showToast(`⚠️ 25-minute delay simulated! Escalated to HIGH PRIORITY & Transport Admin alerted.`);
  };

  const handleClearDelay = (busId: string) => {
    const bus = state.buses.find((b) => b.busId === busId);
    if (bus) {
      store.updateBus(busId, {
        status: 'on_time',
        delayMinutes: 0,
        currentETA: bus.expectedETA,
      });
      store.updateSimulation({ simulatedDelayMinutes: 0 });
      showToast(`✅ Delay cleared for ${bus.busNumber}.`);
    }
  };

  const filteredBuses = state.buses.filter((b) => {
    const matchesSearch =
      b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.currentLocation.address.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const selectedBus = state.buses.find((b) => b.busId === selectedBusId);
  const selectedBusDriver = state.drivers.find((d) => d.driverId === selectedBus?.driverId);
  const selectedBusRoute = state.routes.find((r) => r.routeId === selectedBus?.routeId);
  const assignedStudents = state.students.filter((s) => s.busId === selectedBus?.busId);

  // Group by department for selected bus
  const deptBreakdown: Record<string, number> = {};
  assignedStudents.forEach((s) => {
    deptBreakdown[s.department] = (deptBreakdown[s.department] || 0) + 1;
  });

  const recentAlertsForBus = state.delayAlerts.filter((a) => a.busId === selectedBusId);

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Delay Monitoring &amp; HOD Escalation Engine
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of ETA slippage, department student impacts, and automated HOD alert logs
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSimulate15m('BUS001')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-xs"
          >
            Simulate 15m Delay (KCG-07)
          </button>
          <button
            onClick={() => handleSimulate25m('BUS001')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-xs"
          >
            Simulate 25m Delay (Escalate)
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce border border-slate-700">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Rules Information Ribbon */}
      <div className="p-3.5 bg-gradient-to-r from-amber-50 to-indigo-50 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-1">
        <div className="font-bold text-amber-950 flex items-center gap-1.5">
          <ClockAlert className="w-4 h-4 text-amber-600" /> Active System Escalation Thresholds:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
          <div>• <strong>&lt; 10 Mins:</strong> Normal schedule, no automated alerts.</div>
          <div>• <strong>10–19 Mins:</strong> Marks Delayed, notifies CSE, ECE, IT HODs with student counts.</div>
          <div>• <strong>≥ 20 Mins:</strong> HIGH PRIORITY, escalates to HODs + Transport Admin.</div>
        </div>
      </div>

      {/* Delay Monitoring Fleet Table */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900">Fleet Delay Evaluation Matrix</h3>
          <span className="text-xs text-slate-500">Click any bus row to inspect department breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Bus</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Expected ETA</th>
                <th className="py-2.5 px-3">Current ETA</th>
                <th className="py-2.5 px-3">Delay</th>
                <th className="py-2.5 px-3">Assigned Students</th>
                <th className="py-2.5 px-3">Department Distribution</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((b) => {
                const route = state.routes.find((r) => r.routeId === b.routeId);
                const studentsOnBus = state.students.filter((s) => s.busId === b.busId);
                const cseCount = studentsOnBus.filter((s) => s.department === 'CSE').length;
                const eceCount = studentsOnBus.filter((s) => s.department === 'ECE').length;
                const itCount = studentsOnBus.filter((s) => s.department === 'IT').length;

                return (
                  <tr
                    key={b.busId}
                    onClick={() => setSelectedBusId(b.busId)}
                    className="hover:bg-amber-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      <strong className="text-slate-900">{b.busNumber}</strong>
                      <div className="text-[10px] text-slate-400 font-mono">{b.plateNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-700">{route?.routeName.split(':')[0]}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-500">{b.expectedETA}</td>
                    <td className="py-3 px-3 font-bold text-indigo-700">{b.currentETA}</td>
                    <td className="py-3 px-3">
                      {b.delayMinutes > 0 ? (
                        <span className={`font-bold ${b.delayMinutes >= 20 ? 'text-rose-600' : 'text-amber-600'}`}>
                          +{b.delayMinutes} mins
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">On Schedule</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      {studentsOnBus.length} Students
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1 text-[10px] font-bold">
                        {cseCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                            CSE: {cseCount}
                          </span>
                        )}
                        {eceCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-700">
                            ECE: {eceCount}
                          </span>
                        )}
                        {itCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700">
                            IT: {itCount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {b.status === 'delayed' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                          Delayed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          On Time
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSimulate15m(b.busId)}
                          className="px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px]"
                          title="Simulate 15 min delay"
                        >
                          +15m
                        </button>
                        <button
                          onClick={() => handleSimulate25m(b.busId)}
                          className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-[10px]"
                          title="Simulate 25 min delay"
                        >
                          +25m
                        </button>
                        {b.delayMinutes > 0 && (
                          <button
                            onClick={() => handleClearDelay(b.busId)}
                            className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px]"
                            title="Clear delay"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bus Detail Drawer / Modal (SECTION 20 REQUIREMENT) */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center">
                  🚌
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Delay Audit Dossier: {selectedBus.busNumber}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedBusRoute?.routeName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBusId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Current Speed</span>
                <strong className="text-slate-900 text-base">{selectedBus.currentSpeed} km/h</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Current Delay</span>
                <strong className="text-rose-600 text-base">+{selectedBus.delayMinutes} mins</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Current ETA</span>
                <strong className="text-indigo-600 text-base">{selectedBus.currentETA}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Driver</span>
                <strong className="text-slate-900 text-sm">{selectedBusDriver?.name}</strong>
              </div>
            </div>

            {/* Simulated Location */}
            <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Simulated GPS Location: <strong>{selectedBus.currentLocation.address}</strong> (Heading {selectedBus.currentLocation.heading}°)
              </span>
            </div>

            {/* Department Breakdown & Notified HODs - CRITICAL REQUIREMENT */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                Department Breakdown &amp; Alert Recipients
              </h4>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.entries(deptBreakdown).map(([dept, count]) => {
                  const hod = state.hods.find((h) => h.department === dept);
                  return (
                    <div
                      key={dept}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
                    >
                      <div className="font-black text-slate-900 text-sm flex items-center justify-between">
                        <span>{dept} Department</span>
                        <span className="text-indigo-600 font-extrabold">{count}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        HOD: <strong>{hod?.name}</strong>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold pt-1">
                        ✓ Notification dispatched dynamically
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delay Alert Audit History */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Logged Delay Alerts for this Bus:
              </h4>

              {recentAlertsForBus.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                  No active delay alerts logged for {selectedBus.busNumber}.
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  {recentAlertsForBus.map((alert) => (
                    <div
                      key={alert.alertId}
                      className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">
                          {alert.reason} (+{alert.delayMinutes}m)
                        </strong>
                        <span className="text-[10px] font-mono text-slate-400">
                          {alert.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        HODs Notified: {alert.affectedDepartments.map((d) => `${d.department} (${d.studentCount} students)`).join(', ')}
                      </div>
                      {alert.adminNotified && (
                        <div className="text-[10px] text-rose-700 font-bold">
                          ⚠️ Transport Admin notified (delay &gt;= 20 mins)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBusId(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
