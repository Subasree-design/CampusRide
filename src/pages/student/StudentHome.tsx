import React from 'react';
import { AppState, store } from '../../services/store';
import { calculateDistanceMeters } from '../../services/busTrackingService';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import {
  MapPin,
  PhoneCall,
  Clock,
  ShieldAlert,
  QrCode,
  Bus as BusIcon,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Users,
  Compass,
} from 'lucide-react';

interface StudentHomeProps {
  state: AppState;
  onNavigate: (tab: string) => void;
  onOpenSOS: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  state,
  onNavigate,
  onOpenSOS,
}) => {
  const student = state.currentUser;
  const currentStudentData = state.students.find((s) => s.studentId === student?.id) || state.students[0];
  const bus = state.buses.find((b) => b.busId === currentStudentData.busId) || state.buses[0];
  const driver = state.drivers.find((d) => d.driverId === bus.driverId) || state.drivers[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];
  const pickupStop = route.stops.find((s) => s.stopId === currentStudentData.pickupStopId) || route.stops[4]; // Tambaram

  // Distance from current bus GPS coordinates to student's pickup stop
  const distanceToPickupMeters = calculateDistanceMeters(
    bus.currentLocation.latitude,
    bus.currentLocation.longitude,
    pickupStop.latitude,
    pickupStop.longitude
  );

  const distanceKmFormatted =
    distanceToPickupMeters > 1000
      ? `${(distanceToPickupMeters / 1000).toFixed(1)} km`
      : `${distanceToPickupMeters} meters`;

  // Status Styling
  const getStatusBadge = () => {
    if (bus.status === 'delayed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Delayed ({bus.delayMinutes} min)</span>
        </span>
      );
    }
    if (bus.status === 'breakdown') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>Breakdown Reported</span>
        </span>
      );
    }
    if (bus.status === 'approaching') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
          <Navigation className="w-3.5 h-3.5 text-indigo-600" />
          <span>Approaching Stop</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>On Schedule</span>
      </span>
    );
  };

  const handleSimulateBoarding = () => {
    const result = store.recordBoarding(currentStudentData.studentId, bus.busId, 'manual_entry');
    if (result.success) {
      alert(`✅ ${result.message}`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Simulation Badge */}
      <div className="flex items-center justify-between">
        <SimulationBadge />
        <span className="text-[11px] text-slate-500 font-medium">
          Route 7 • Tambaram Line
        </span>
      </div>

      {/* Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10 max-w-xl">
          <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 mb-2">
            KCG College Transit ID: {currentStudentData.studentId}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Good Morning, {student?.name || 'Subasree'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Department: <strong className="text-white">{currentStudentData.department}</strong> • Assigned Bus: <strong className="text-amber-400">{bus.busNumber}</strong>
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">Boarding Status:</span>
            {currentStudentData.boardingStatus === 'boarded' ? (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Boarded at {currentStudentData.boardingTime || '07:45 AM'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Awaiting Boarding at {pickupStop.name.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Primary Bus Status Live Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">{bus.busNumber}</h3>
                <span className="text-[11px] font-mono text-slate-500">{bus.plateNumber}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {route.origin} → {route.destination.split(',')[0]}
              </p>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-500" /> Expected ETA
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {bus.currentETA}
            </div>
            <span className="text-[10px] text-slate-500">Scheduled: {bus.expectedETA}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" /> To Your Stop
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {distanceKmFormatted}
            </div>
            <span className="text-[10px] text-slate-500 truncate block">{pickupStop.name.split(' ')[0]}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-500" /> Current Speed
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {bus.currentSpeed} km/h
            </div>
            <span className="text-[10px] text-slate-500">Heading {bus.currentLocation.heading}°</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-500" /> Occupancy
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {bus.currentOccupancy} / {bus.capacity}
            </div>
            <span className="text-[10px] text-slate-500">Students Boarded</span>
          </div>
        </div>

        {/* Current Location & Driver Contact */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 min-w-0">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">
              Live Location: <strong className="text-slate-900">{bus.currentLocation.address}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-7 h-7 rounded-full object-cover border border-indigo-200"
              />
              <div>
                <div className="font-bold text-slate-900 leading-none">{driver.name}</div>
                <div className="text-[10px] text-slate-500">Driver</div>
              </div>
            </div>
            <a
              href={`tel:${driver.phone}`}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              title="Call Driver"
            >
              <PhoneCall className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => onNavigate('track')}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 active:scale-98 transition-all shadow-md"
          >
            <Navigation className="w-4 h-4 text-amber-400" />
            <span>Track Live Map</span>
          </button>

          <button
            onClick={() => onNavigate('pass')}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 active:scale-98 transition-all shadow-md shadow-amber-400/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Digital Pass &amp; QR</span>
          </button>

          <button
            onClick={() => onNavigate('mybus')}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-98 transition-all"
          >
            <BusIcon className="w-4 h-4 text-indigo-600" />
            <span>View All Stops</span>
          </button>

          {currentStudentData.boardingStatus === 'not_boarded' ? (
            <button
              onClick={handleSimulateBoarding}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98 transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Simulate Boarding</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('pass')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Boarded at {currentStudentData.boardingTime || '07:45 AM'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Assistance Quick Bar */}
      <div className="bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 p-4 rounded-3xl border border-red-200 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/20">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Need Immediate Transit Help?</div>
            <div className="text-[11px] text-slate-600">
              One-touch dispatch to Driver, CSE HOD, and KCG Transport Desk
            </div>
          </div>
        </div>

        <button
          onClick={onOpenSOS}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/30 transition-all shrink-0"
        >
          SOS Trigger
        </button>
      </div>
    </div>
  );
};
