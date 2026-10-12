import React from 'react';
import { AppState, store } from '../../services/store';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import { DelayDetectionService } from '../../services/delayDetectionService';
import {
  Bus,
  Users,
  Route,
  AlertTriangle,
  ClockAlert,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface AdminDashboardProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onNavigate }) => {
  const totalBuses = state.buses.length;
  const activeBuses = state.buses.filter((b) => b.status !== 'idle' && b.status !== 'breakdown').length;
  const totalStudents = state.students.length;
  const boardedStudents = state.students.filter((s) => s.boardingStatus === 'boarded').length;
  const delayedBuses = state.buses.filter((b) => b.status === 'delayed').length;
  const activeEmergencies = state.emergencies.filter((e) => e.status === 'active').length;
  const totalRoutes = state.routes.length;
  const totalDrivers = state.drivers.length;

  const currentBus = state.buses.find((b) => b.busId === 'BUS001') || state.buses[0];

  const handleSimulate15m = () => {
    DelayDetectionService.evaluateBusDelay(currentBus.busId, 15, 'Heavy GST Road Traffic');
  };

  const handleSimulate25m = () => {
    DelayDetectionService.evaluateBusDelay(currentBus.busId, 25, 'Severe Road Works at Tambaram');
  };

  const handleClearDelay = () => {
    store.updateBus(currentBus.busId, {
      status: 'on_time',
      delayMinutes: 0,
      currentETA: currentBus.expectedETA,
    });
    store.updateSimulation({ simulatedDelayMinutes: 0, trafficSeverity: 'normal' });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Campus Transit Operations Command
          </h2>
          <p className="text-xs text-slate-500">
            Real-time fleet telemetry, boarding counters, and HOD delay alert dispatch
          </p>
        </div>
        <SimulationBadge />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Fleet Buses</span>
            <Bus className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBuses} Buses</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{activeBuses} in active transit</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Student Boardings</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{boardedStudents} / {totalStudents}</div>
          <span className="text-[11px] text-slate-500 font-medium">
            {Math.round((boardedStudents / totalStudents) * 100)}% Checked in today
          </span>
        </div>

        <div className={`p-4 rounded-3xl border shadow-2xs ${
          delayedBuses > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Delayed Buses</span>
            <ClockAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className={`text-2xl font-black ${delayedBuses > 0 ? 'text-amber-900' : 'text-slate-900'}`}>
            {delayedBuses}
          </div>
          <span className="text-[11px] text-slate-600">Threshold: &gt;10 min</span>
        </div>

        <div className={`p-4 rounded-3xl border shadow-2xs ${
          activeEmergencies > 0 ? 'bg-rose-50/80 border-rose-300' : 'bg-white border-slate-200/90'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Active Incidents</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className={`text-2xl font-black ${activeEmergencies > 0 ? 'text-rose-900' : 'text-slate-900'}`}>
            {activeEmergencies}
          </div>
          <span className="text-[11px] text-slate-600">SOS / Mechanical</span>
        </div>
      </div>

      {/* Simulator Quick Action Toolbar */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">Simulator Test Bench (Bus {currentBus.busNumber})</div>
            <div className="text-xs text-slate-300">
              Trigger delays to observe real-time HOD fan-out &amp; 20-min escalation
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSimulate15m}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer"
          >
            +15m Delay (Alert HODs)
          </button>
          <button
            onClick={handleSimulate25m}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
          >
            +25m Delay (Escalate Admin)
          </button>
          <button
            onClick={handleClearDelay}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            Clear Delay
          </button>
        </div>
      </div>

      {/* Live Fleet Overview Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900">Live College Fleet Status</h3>
            <p className="text-xs text-slate-500">Real-time GPS telemetry from all 5 campus routes</p>
          </div>
          <button
            onClick={() => onNavigate('livemap')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Interactive Fullscreen Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Bus</th>
                <th className="py-2.5 px-3">Route</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">Occupancy</th>
                <th className="py-2.5 px-3">ETA</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.buses.map((b) => {
                const driver = state.drivers.find((d) => d.driverId === b.driverId);
                const route = state.routes.find((r) => r.routeId === b.routeId);

                const getStatusPill = () => {
                  switch (b.status) {
                    case 'delayed':
                      return (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          Delayed (+{b.delayMinutes}m)
                        </span>
                      );
                    case 'breakdown':
                      return (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                          Breakdown
                        </span>
                      );
                    case 'approaching':
                      return (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                          Approaching
                        </span>
                      );
                    default:
                      return (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          On Time
                        </span>
                      );
                  }
                };

                return (
                  <tr key={b.busId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{b.busNumber}</div>
                      <div className="font-mono text-[10px] text-slate-400">{b.plateNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 line-clamp-1">{route?.routeName.split(':')[0]}</div>
                      <div className="text-[10px] text-slate-400">{route?.origin}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{driver?.name}</div>
                      <div className="text-[10px] text-slate-400">{driver?.phone}</div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="truncate text-slate-700">{b.currentLocation.address}</div>
                      <div className="text-[10px] text-slate-400">{b.currentSpeed} km/h</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.currentOccupancy} / {b.capacity}</div>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${Math.round((b.currentOccupancy / b.capacity) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-indigo-600">{b.currentETA}</div>
                      <div className="text-[10px] text-slate-400">Sched: {b.expectedETA}</div>
                    </td>
                    <td className="py-3 px-3">{getStatusPill()}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('delays')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
