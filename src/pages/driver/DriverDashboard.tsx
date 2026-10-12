import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { trackingService } from '../../services/busTrackingService';
import { DriverReportDelayModal } from './DriverReportDelayModal';
import { SimulationBadge } from '../../components/common/SimulationBadge';
import {
  Play,
  Square,
  Clock,
  MapPin,
  Compass,
  AlertTriangle,
  Send,
  ShieldAlert,
  Users,
  CheckCircle2,
  Navigation,
  QrCode,
  Volume2,
} from 'lucide-react';

interface DriverDashboardProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ state, onNavigate }) => {
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showAnnouncementInput, setShowAnnouncementInput] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const bus = state.buses.find((b) => b.busId === 'BUS001') || state.buses[0]; // KCG-07
  const driver = state.drivers.find((d) => d.driverId === bus.driverId) || state.drivers[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];
  const assignedStudents = state.students.filter((s) => s.busId === bus.busId);
  const boardedCount = assignedStudents.filter((s) => s.boardingStatus === 'boarded').length;
  const currentStop = route.stops[bus.currentStopIndex] || route.stops[0];

  const showAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleStartTrip = () => {
    trackingService.startSimulation();
    store.updateBus(bus.busId, { status: 'approaching' });
    showAlert('🚀 Trip Started! Simulated GPS updates initialized.');
  };

  const handleEndTrip = () => {
    trackingService.stopSimulation();
    store.updateBus(bus.busId, { status: 'completed', currentSpeed: 0 });
    showAlert('🏁 Trip Ended. Bus parked at KCG College Campus.');
  };

  const handleMarkStopReached = () => {
    const nextIdx = Math.min(route.stops.length - 1, bus.currentStopIndex + 1);
    store.updateBus(bus.busId, {
      currentStopIndex: nextIdx,
      currentLocation: {
        ...bus.currentLocation,
        latitude: currentStop.latitude,
        longitude: currentStop.longitude,
        address: `At ${currentStop.name}`,
      },
    });

    // Notify assigned students waiting at this stop
    const studentsAtStop = assignedStudents.filter((s) => s.pickupStopId === currentStop.stopId);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    studentsAtStop.forEach((s) => {
      store.addNotification({
        notificationId: `NOTIF_REACH_${s.studentId}_${Date.now()}`,
        recipientRole: 'student',
        recipientId: s.studentId,
        busId: bus.busId,
        title: `✅ Bus Arrived at ${currentStop.name}`,
        message: `Driver Ravi Kumar has arrived at ${currentStop.name}. Boarding is open.`,
        timestamp: nowTime,
        priority: 'urgent',
        category: 'proximity',
        readStatus: false,
      });
    });

    showAlert(`✅ Marked "${currentStop.name}" as reached! Waiting students notified.`);
  };

  const handleReportBreakdown = () => {
    store.updateBus(bus.busId, {
      status: 'breakdown',
      currentSpeed: 0,
    });
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    store.createEmergency({
      eventId: `EVT_BD_${Date.now()}`,
      busId: bus.busId,
      busNumber: bus.busNumber,
      routeId: bus.routeId,
      reportedByRole: 'driver',
      reportedByName: `${driver.name} (Driver)`,
      reportedById: driver.driverId,
      reason: 'Engine breakdown on route',
      latitude: bus.currentLocation.latitude,
      longitude: bus.currentLocation.longitude,
      timestamp: nowTime,
      priority: 'urgent',
      affectedDepartments: ['CSE', 'ECE', 'IT'],
      recipientsNotified: ['HOD001', 'HOD002', 'HOD003', 'ADMIN001'],
      status: 'active',
    });

    showAlert('🚨 Breakdown reported! High-priority alerts sent to Admin & HODs.');
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Send notification to all students assigned to this bus
    assignedStudents.forEach((student) => {
      store.addNotification({
        notificationId: `NOTIF_ANN_${student.studentId}_${Date.now()}`,
        recipientRole: 'student',
        recipientId: student.studentId,
        busId: bus.busId,
        title: `📢 Announcement from Driver (${bus.busNumber})`,
        message: announcementText,
        timestamp: nowTime,
        priority: 'normal',
        category: 'announcement',
        readStatus: false,
      });
    });

    showAlert(`📢 Announcement dispatched to ${assignedStudents.length} students!`);
    setAnnouncementText('');
    setShowAnnouncementInput(false);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Driver Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Driver Console: {driver.name}
          </h2>
          <p className="text-xs text-slate-500">
            Assigned: <strong>{bus.busNumber}</strong> ({bus.plateNumber}) • {route.routeName}
          </p>
        </div>
        <SimulationBadge />
      </div>

      {actionAlert && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Main Bus Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-sm">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg">{bus.busNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  bus.status === 'delayed'
                    ? 'bg-amber-100 text-amber-900'
                    : bus.status === 'breakdown'
                    ? 'bg-rose-100 text-rose-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  Status: {bus.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Next Stop: <strong className="text-slate-800">{currentStop.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('scanner')}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Open Scanner</span>
            </button>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-500" /> Current Speed
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">{bus.currentSpeed} km/h</div>
            <span className="text-[10px] text-slate-500">Heading {bus.currentLocation.heading}°</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" /> Students Boarded
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">
              {boardedCount} / {assignedStudents.length}
            </div>
            <span className="text-[10px] text-slate-500">{bus.capacity - boardedCount} seats remaining</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Destination ETA
            </span>
            <div className="text-lg font-black text-slate-900 mt-1">{bus.currentETA}</div>
            <span className="text-[10px] text-slate-500">
              {bus.delayMinutes > 0 ? `+${bus.delayMinutes}m delay` : 'On schedule'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Current Address
            </span>
            <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
              {bus.currentLocation.address}
            </div>
            <span className="text-[10px] text-slate-500">Updated {bus.lastUpdated}</span>
          </div>
        </div>

        {/* Operational Primary Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {state.simulation.isRunning ? (
            <button
              onClick={handleEndTrip}
              className="py-3 px-3 rounded-2xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Square className="w-4 h-4 text-rose-400" />
              <span>End Trip</span>
            </button>
          ) : (
            <button
              onClick={handleStartTrip}
              className="py-3 px-3 rounded-2xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              <Play className="w-4 h-4 text-white" />
              <span>Start Trip</span>
            </button>
          )}

          <button
            onClick={handleMarkStopReached}
            className="py-3 px-3 rounded-2xl font-bold text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-200" />
            <span>Mark Stop Reached</span>
          </button>

          <button
            onClick={() => setShowDelayModal(true)}
            className="py-3 px-3 rounded-2xl font-bold text-xs bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <AlertTriangle className="w-4 h-4 text-slate-950" />
            <span>Report Delay</span>
          </button>

          <button
            onClick={handleReportBreakdown}
            className="py-3 px-3 rounded-2xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Report Breakdown</span>
          </button>
        </div>

        {/* Announcement Dispatch */}
        <div className="pt-2 border-t border-slate-100">
          {!showAnnouncementInput ? (
            <button
              onClick={() => setShowAnnouncementInput(true)}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Broadcast Passenger Announcement to Assigned Students</span>
            </button>
          ) : (
            <form onSubmit={handleSendAnnouncement} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Broadcast Passenger Message:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Traffic clear, arriving at Tambaram in 5 mins."
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnnouncementInput(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Quick Navigation to Route and Students */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('route')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 text-left flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-sm text-slate-900">View Full Live GPS Route</div>
            <div className="text-xs text-slate-500">Interactive map with all 8 ordered stops</div>
          </div>
          <Navigation className="w-5 h-5 text-indigo-600" />
        </button>

        <button
          onClick={() => onNavigate('students')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 text-left flex items-center justify-between"
        >
          <div>
            <div className="font-bold text-sm text-slate-900">Passenger Boarding Roster</div>
            <div className="text-xs text-slate-500">
              {boardedCount} Boarded • {assignedStudents.length - boardedCount} Not Boarded
            </div>
          </div>
          <Users className="w-5 h-5 text-emerald-600" />
        </button>
      </div>

      {/* Delay Modal */}
      {showDelayModal && (
        <DriverReportDelayModal
          busId={bus.busId}
          onClose={() => setShowDelayModal(false)}
          onSuccess={showAlert}
        />
      )}
    </div>
  );
};
