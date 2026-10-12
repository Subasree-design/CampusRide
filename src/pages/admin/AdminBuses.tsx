import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { Bus, BusStatus } from '../../types';
import { Bus as BusIcon, Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';

interface AdminBusesProps {
  state: AppState;
}

export const AdminBuses: React.FC<AdminBusesProps> = ({ state }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // Form State
  const [busNumber, setBusNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState(45);
  const [driverId, setDriverId] = useState(state.drivers[0]?.driverId || '');
  const [routeId, setRouteId] = useState(state.routes[0]?.routeId || '');
  const [status, setStatus] = useState<BusStatus>('on_time');

  const handleOpenAdd = () => {
    setEditingBus(null);
    setBusNumber(`KCG-${String(state.buses.length + 8).padStart(2, '0')}`);
    setPlateNumber(`TN 19 KCG 00${state.buses.length + 8}`);
    setCapacity(45);
    setDriverId(state.drivers[0]?.driverId || '');
    setRouteId(state.routes[0]?.routeId || '');
    setStatus('on_time');
    setShowModal(true);
  };

  const handleOpenEdit = (bus: Bus) => {
    setEditingBus(bus);
    setBusNumber(bus.busNumber);
    setPlateNumber(bus.plateNumber);
    setCapacity(bus.capacity);
    setDriverId(bus.driverId);
    setRouteId(bus.routeId);
    setStatus(bus.status);
    setShowModal(true);
  };

  const handleDelete = (busId: string, busNum: string) => {
    if (window.confirm(`Are you sure you want to decommission and delete ${busNum}?`)) {
      store.deleteBus(busId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busNumber.trim()) return;
    if (capacity < 10 || capacity > 100) {
      alert('Capacity must be between 10 and 100 seats.');
      return;
    }

    if (editingBus) {
      store.updateBus(editingBus.busId, {
        busNumber,
        plateNumber,
        capacity,
        driverId,
        routeId,
        status,
      });
    } else {
      const newBus: Bus = {
        busId: `BUS_${Date.now()}`,
        busNumber,
        plateNumber,
        driverId,
        routeId,
        capacity,
        currentOccupancy: 0,
        currentLocation: {
          latitude: 12.9249,
          longitude: 80.1245,
          heading: 0,
          address: 'Tambaram Terminal Depot',
        },
        currentSpeed: 0,
        status,
        expectedETA: '08:30 AM',
        currentETA: '08:30 AM',
        delayMinutes: 0,
        currentStopIndex: 0,
        distanceToNextStopMeters: 2000,
        trafficCondition: 'light',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      store.addBus(newBus);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bus Fleet Management
          </h2>
          <p className="text-xs text-slate-500">
            Configure college transit fleet, seat capacities, and driver route links
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Bus</span>
        </button>
      </div>

      {/* Buses List Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {state.buses.map((bus) => {
          const driver = state.drivers.find((d) => d.driverId === bus.driverId);
          const route = state.routes.find((r) => r.routeId === bus.routeId);
          const assignedCount = state.students.filter((s) => s.busId === bus.busId).length;

          return (
            <div
              key={bus.busId}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg">
                    🚌
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{bus.busNumber}</h3>
                    <span className="text-[11px] font-mono text-slate-400">{bus.plateNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(bus)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                    title="Edit Bus"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bus.busId, bus.busNumber)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                    title="Delete Bus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Driver:</span>
                  <strong className="text-slate-900">{driver?.name || 'Unassigned'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Route Line:</span>
                  <strong className="text-slate-900 truncate max-w-[150px]">
                    {route?.routeName.split(':')[0] || 'Unassigned'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seat Capacity:</span>
                  <strong className="text-slate-900">{bus.capacity} Seats</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Students:</span>
                  <strong className="text-indigo-600 font-bold">{assignedCount} Students</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold capitalize text-amber-600">{bus.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingBus ? `Edit Bus ${editingBus.busNumber}` : 'Add New College Bus'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Bus Number (e.g. KCG-07)
                </label>
                <input
                  type="text"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Registration Plate Number
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Seating Capacity (Seats)
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                  min={10}
                  max={100}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Assign Driver
                </label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {state.drivers.map((d) => (
                    <option key={d.driverId} value={d.driverId}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Assign Route
                </label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {state.routes.map((r) => (
                    <option key={r.routeId} value={r.routeId}>
                      {r.routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xs cursor-pointer"
                >
                  Save Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
