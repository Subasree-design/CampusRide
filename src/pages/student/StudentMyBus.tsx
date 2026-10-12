import React from 'react';
import { AppState } from '../../services/store';
import { calculateDistanceMeters } from '../../services/busTrackingService';
import {
  Bus as BusIcon,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  AlertTriangle,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface StudentMyBusProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const StudentMyBus: React.FC<StudentMyBusProps> = ({ state, onNavigate }) => {
  const student = state.currentUser;
  const currentStudentData = state.students.find((s) => s.studentId === student?.id) || state.students[0];
  const bus = state.buses.find((b) => b.busId === currentStudentData.busId) || state.buses[0];
  const driver = state.drivers.find((d) => d.driverId === bus.driverId) || state.drivers[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];

  const occupancyPercent = Math.min(100, Math.round((bus.currentOccupancy / bus.capacity) * 100));

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Bus Profile Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{bus.busNumber}</h2>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                  {bus.plateNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{route.routeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('track')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Track on Map
            </button>
          </div>
        </div>

        {/* Bus Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Bus Capacity</div>
            <div className="text-base font-black text-slate-900 mt-1">{bus.capacity} Seats</div>
            <div className="text-slate-500 text-[11px]">Commercial Bus</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Current Occupancy</div>
            <div className="text-base font-black text-slate-900 mt-1">{bus.currentOccupancy} Boarded</div>
            <div className="text-slate-500 text-[11px]">{bus.capacity - bus.currentOccupancy} seats left</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Expected College ETA</div>
            <div className="text-base font-black text-slate-900 mt-1">{bus.currentETA}</div>
            <div className="text-slate-500 text-[11px]">Scheduled: {bus.expectedETA}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-slate-400 font-bold uppercase text-[10px]">Current Status</div>
            <div className="text-base font-black text-amber-600 capitalize mt-1">
              {bus.status.replace('_', ' ')}
            </div>
            <div className="text-slate-500 text-[11px]">{bus.currentSpeed} km/h speed</div>
          </div>
        </div>

        {/* Occupancy Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Seat Capacity Fill Level</span>
            <span>{occupancyPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                occupancyPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-amber-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-11 h-11 rounded-2xl object-cover border border-white shadow-xs"
            />
            <div>
              <div className="font-bold text-sm text-slate-900">{driver.name}</div>
              <div className="text-xs text-slate-600">
                Authorized College Driver • License: {driver.licenseNumber}
              </div>
              <div className="text-[11px] text-amber-700 font-medium">★ {driver.rating} Rating</div>
            </div>
          </div>

          <a
            href={`tel:${driver.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Driver</span>
          </a>
        </div>
      </div>

      {/* Ordered Stops List */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Ordered Route Stops</h3>
            <p className="text-xs text-slate-500">
              Live status derived from GPS coordinates along {route.routeName}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
            {route.stops.length} Stops
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {route.stops.map((stop, index) => {
            const isPickup = stop.stopId === currentStudentData.pickupStopId;
            const isCollege = index === route.stops.length - 1;

            const distMeters = calculateDistanceMeters(
              bus.currentLocation.latitude,
              bus.currentLocation.longitude,
              stop.latitude,
              stop.longitude
            );

            // Compute dynamic status
            let stopBadge = (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                Upcoming
              </span>
            );
            if (distMeters <= 100) {
              stopBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                  Reached
                </span>
              );
            } else if (distMeters <= 1200) {
              stopBadge = (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  Approaching
                </span>
              );
            }

            return (
              <div
                key={stop.stopId}
                className={`py-3.5 flex items-center justify-between gap-3 text-xs ${
                  isPickup ? 'bg-amber-50/60 px-3 -mx-3 rounded-2xl' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold shrink-0 ${
                      isPickup
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isCollege
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isPickup ? '★' : index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{stop.name}</span>
                      {isPickup && (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                          Your Pickup
                        </span>
                      )}
                      {isCollege && (
                        <span className="text-[10px] font-extrabold text-indigo-800 bg-indigo-100 px-1.5 py-0.2 rounded">
                          Campus Gate
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Scheduled: <strong>{stop.scheduledTime}</strong> • Estimated:{' '}
                      <span className="text-indigo-600 font-medium">{stop.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div>{stopBadge}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {distMeters > 1000 ? `${(distMeters / 1000).toFixed(1)} km away` : `${distMeters} m away`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
