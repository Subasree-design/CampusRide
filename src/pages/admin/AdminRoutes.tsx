import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { Route, Stop } from '../../types';
import { Route as RouteIcon, MapPin, Plus, Trash2, Clock, Check } from 'lucide-react';

interface AdminRoutesProps {
  state: AppState;
}

export const AdminRoutes: React.FC<AdminRoutesProps> = ({ state }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(state.routes[0]?.routeId || 'RT001');
  const [newStopName, setNewStopName] = useState('');
  const [newStopTime, setNewStopTime] = useState('08:05 AM');

  const selectedRoute = state.routes.find((r) => r.routeId === selectedRouteId) || state.routes[0];

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopName.trim()) return;

    const newStop: Stop = {
      stopId: `STP_${Date.now()}`,
      routeId: selectedRoute.routeId,
      name: newStopName.trim(),
      latitude: 12.9150,
      longitude: 80.1400,
      scheduledTime: newStopTime,
      estimatedTime: newStopTime,
      sequence: selectedRoute.stops.length + 1,
      status: 'upcoming',
    };

    const updatedStops = [...selectedRoute.stops, newStop];
    store.updateRoute(selectedRoute.routeId, { stops: updatedStops });
    setNewStopName('');
  };

  const handleRemoveStop = (stopId: string) => {
    const updatedStops = selectedRoute.stops.filter((s) => s.stopId !== stopId);
    store.updateRoute(selectedRoute.routeId, { stops: updatedStops });
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Transit Routes &amp; Ordered Stops
          </h2>
          <p className="text-xs text-slate-500">
            Configure transit pathways, ordered waypoints, and stop timetables
          </p>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {state.routes.map((r) => (
          <button
            key={r.routeId}
            onClick={() => setSelectedRouteId(r.routeId)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors border ${
              selectedRouteId === r.routeId
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {r.routeName}
          </button>
        ))}
      </div>

      {/* Route Detail Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{selectedRoute.routeName}</h3>
            <p className="text-xs text-slate-500">
              {selectedRoute.origin} → {selectedRoute.destination} ({selectedRoute.distanceKm} km, ~{selectedRoute.expectedDurationMin} mins)
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
            {selectedRoute.stops.length} Ordered Stops
          </span>
        </div>

        {/* Stops Ordered List */}
        <div className="space-y-2">
          {selectedRoute.stops.map((stop, index) => (
            <div
              key={stop.stopId}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 truncate block">{stop.name}</span>
                  <span className="text-[11px] text-slate-500">
                    Scheduled Time: <strong>{stop.scheduledTime}</strong> • Coords: [{stop.latitude}, {stop.longitude}]
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                  {stop.status}
                </span>
                {selectedRoute.stops.length > 2 && (
                  <button
                    onClick={() => handleRemoveStop(stop.stopId)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Remove Stop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Stop Form */}
        <form onSubmit={handleAddStop} className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row gap-2 text-xs">
          <input
            type="text"
            value={newStopName}
            onChange={(e) => setNewStopName(e.target.value)}
            placeholder="Add new stop name (e.g. Pallavaram Junction)"
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            value={newStopTime}
            onChange={(e) => setNewStopTime(e.target.value)}
            placeholder="08:00 AM"
            className="w-28 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stop</span>
          </button>
        </form>
      </div>
    </div>
  );
};
