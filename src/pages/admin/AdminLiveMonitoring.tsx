import React, { useState } from 'react';
import { AppState } from '../../services/store';
import { LiveBusMap } from '../../components/map/LiveBusMap';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import { Bus, MapPin, Compass, Users } from 'lucide-react';

interface AdminLiveMonitoringProps {
  state: AppState;
}

export const AdminLiveMonitoring: React.FC<AdminLiveMonitoringProps> = ({ state }) => {
  const [selectedBusId, setSelectedBusId] = useState<string>('BUS001');

  const selectedBus = state.buses.find((b) => b.busId === selectedBusId) || state.buses[0];
  const selectedRoute = state.routes.find((r) => r.routeId === selectedBus.routeId) || state.routes[0];
  const selectedDriver = state.drivers.find((d) => d.driverId === selectedBus.driverId);

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Live Fleet Radar &amp; Telemetry
          </h2>
          <p className="text-xs text-slate-500">
            Real-time GPS tracking across all college transit corridors
          </p>
        </div>
        <SimulationBadge />
      </div>

      {/* Bus Selection Pill Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {state.buses.map((b) => {
          const isSelected = b.busId === selectedBusId;
          return (
            <button
              key={b.busId}
              onClick={() => setSelectedBusId(b.busId)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>🚌 {b.busNumber}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                b.status === 'delayed'
                  ? 'bg-amber-900 text-white'
                  : b.status === 'breakdown'
                  ? 'bg-rose-900 text-white'
                  : 'bg-emerald-900 text-white'
              }`}>
                {b.currentSpeed} km/h
              </span>
            </button>
          );
        })}
      </div>

      {/* Map View */}
      <LiveBusMap
        bus={selectedBus}
        route={selectedRoute}
        heightClass="h-[480px] sm:h-[580px]"
      />

      {/* Selected Bus Telemetry Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Assigned Route</span>
          <strong className="text-slate-900 text-sm">{selectedRoute.routeName}</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Assigned Driver</span>
          <strong className="text-slate-900 text-sm">{selectedDriver?.name} ({selectedDriver?.phone})</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Live Location</span>
          <strong className="text-slate-900 text-xs truncate block">{selectedBus.currentLocation.address}</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">Passenger Load</span>
          <strong className="text-slate-900 text-sm">{selectedBus.currentOccupancy} / {selectedBus.capacity} Boarded</strong>
        </div>
      </div>
    </div>
  );
};
