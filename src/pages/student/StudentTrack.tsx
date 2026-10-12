import React, { useState } from 'react';
import { AppState } from '../../services/store';
import { LiveBusMap } from '../../components/map/LiveBusMap';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import { calculateDistanceMeters } from '../../services/busTrackingService';
import {
  MapPin,
  Clock,
  Compass,
  Navigation,
  PhoneCall,
  RotateCw,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface StudentTrackProps {
  state: AppState;
  onNavigate: (tab: string) => void;
  onOpenSOS: () => void;
}

export const StudentTrack: React.FC<StudentTrackProps> = ({
  state,
  onNavigate,
  onOpenSOS,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const student = state.currentUser;
  const currentStudentData = state.students.find((s) => s.studentId === student?.id) || state.students[0];
  const bus = state.buses.find((b) => b.busId === currentStudentData.busId) || state.buses[0];
  const driver = state.drivers.find((d) => d.driverId === bus.driverId) || state.drivers[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];
  const pickupStop = route.stops.find((s) => s.stopId === currentStudentData.pickupStopId) || route.stops[4];

  const distanceToPickup = calculateDistanceMeters(
    bus.currentLocation.latitude,
    bus.currentLocation.longitude,
    pickupStop.latitude,
    pickupStop.longitude
  );

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Live GPS Transit Map
          </h2>
          <p className="text-xs text-slate-500">
            Tracking {bus.busNumber} on {route.routeName}
          </p>
        </div>
        <SimulationBadge />
      </div>

      {/* Interactive Map Component */}
      <div className="relative">
        <LiveBusMap
          key={refreshKey}
          bus={bus}
          route={route}
          studentPickupStop={pickupStop}
          heightClass="h-[440px] sm:h-[520px]"
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Your Pickup Status */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Your Boarding Stop
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Stop #{pickupStop.sequence}
            </span>
          </div>
          <div className="font-extrabold text-sm text-slate-900 truncate">
            {pickupStop.name}
          </div>
          <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Distance to bus:</span>
            <strong className="text-amber-600 font-bold">
              {distanceToPickup > 1000
                ? `${(distanceToPickup / 1000).toFixed(2)} km`
                : `${distanceToPickup} m`}
            </strong>
          </div>
        </div>

        {/* Card 2: ETA & Speed */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> College Arrival ETA
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              bus.status === 'delayed'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {bus.status === 'delayed' ? `+${bus.delayMinutes}m delay` : 'On time'}
            </span>
          </div>
          <div className="font-extrabold text-sm text-slate-900">
            {bus.currentETA}
          </div>
          <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>Current Speed:</span>
            <strong className="text-slate-800 font-bold">{bus.currentSpeed} km/h</strong>
          </div>
        </div>

        {/* Card 3: Driver & Actions */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Driver
            </span>
            <a
              href={`tel:${driver.phone}`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> Call Driver
            </a>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-900 truncate">{driver.name}</div>
              <div className="text-[10px] text-slate-500">{driver.phone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stops Timeline Mini-View */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Route Stops Sequence
          </h4>
          <button
            onClick={() => onNavigate('mybus')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Full Route Table <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center overflow-x-auto pb-2 gap-3 text-xs scrollbar-thin">
          {route.stops.map((stop, i) => {
            const isPickup = stop.stopId === pickupStop.stopId;
            return (
              <div
                key={stop.stopId}
                className={`p-2.5 rounded-xl border shrink-0 min-w-[150px] ${
                  isPickup
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Stop #{i + 1}</span>
                  <span className="font-semibold">{stop.scheduledTime}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs truncate">
                  {stop.name.split(' ')[0]}
                </div>
                {isPickup && (
                  <div className="text-[10px] font-bold text-amber-700 mt-1">
                    ⭐️ Your Pickup
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
