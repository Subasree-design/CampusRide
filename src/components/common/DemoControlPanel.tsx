import React, { useState } from 'react';
import {
  Play,
  Pause,
  FastForward,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Car,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
} from 'lucide-react';
import { store, AppState } from '../../services/store';
import { trackingService } from '../../services/busTrackingService';
import { DelayDetectionService } from '../../services/delayDetectionService';
import { UserRole } from '../../types';

interface DemoControlPanelProps {
  state: AppState;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({ state }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentBus = state.buses.find((b) => b.busId === state.simulation.activeBusId) || state.buses[0];

  const handleToggleSimulation = () => {
    if (state.simulation.isRunning) {
      trackingService.stopSimulation();
      showToast('Simulation paused');
    } else {
      trackingService.startSimulation();
      showToast('Simulation running');
    }
  };

  const handleSpeedChange = (speed: number) => {
    trackingService.setSpeedMultiplier(speed);
    showToast(`Simulation speed set to ${speed}x`);
  };

  const handleSimulate15MinDelay = () => {
    store.updateSimulation({
      simulatedDelayMinutes: 15,
      trafficSeverity: 'heavy',
    });
    DelayDetectionService.evaluateBusDelay(currentBus.busId, 15, 'Heavy GST Road Congestion');
    showToast('🚨 15-min Delay Simulated! Department HODs notified with department student counts.');
  };

  const handleSimulate25MinDelay = () => {
    store.updateSimulation({
      simulatedDelayMinutes: 25,
      trafficSeverity: 'severe',
    });
    DelayDetectionService.evaluateBusDelay(
      currentBus.busId,
      25,
      'Severe Bottleneck & Road Construction at Tambaram'
    );
    showToast('⚠️ 25-min Delay Simulated! Escalated to HIGH PRIORITY & Transport Admin notified!');
  };

  const handleClearDelay = () => {
    store.updateSimulation({
      simulatedDelayMinutes: 0,
      trafficSeverity: 'normal',
    });
    store.updateBus(currentBus.busId, {
      status: 'on_time',
      delayMinutes: 0,
      currentETA: currentBus.expectedETA,
    });
    showToast('✅ Traffic delay cleared. Bus back on schedule.');
  };

  const handleSimulateBreakdown = () => {
    store.updateBus(currentBus.busId, {
      status: 'breakdown',
      currentSpeed: 0,
    });
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Broadcast emergency breakdown notification
    store.addNotification({
      notificationId: `NOTIF_BD_${Date.now()}`,
      recipientRole: 'all',
      busId: currentBus.busId,
      title: `🚨 BREAKDOWN: Bus ${currentBus.busNumber}`,
      message: `Bus ${currentBus.busNumber} reported mechanical breakdown near ${currentBus.currentLocation.address}. Backup transit dispatched.`,
      timestamp: nowTime,
      priority: 'urgent',
      category: 'breakdown',
      readStatus: false,
    });

    store.createEmergency({
      eventId: `EVT_BD_${Date.now()}`,
      busId: currentBus.busId,
      busNumber: currentBus.busNumber,
      routeId: currentBus.routeId,
      reportedByRole: 'driver',
      reportedByName: 'Ravi Kumar (Driver)',
      reportedById: 'DRV001',
      reason: 'Engine overheating and coolant leakage',
      latitude: currentBus.currentLocation.latitude,
      longitude: currentBus.currentLocation.longitude,
      timestamp: nowTime,
      priority: 'urgent',
      affectedDepartments: ['CSE', 'ECE', 'IT'],
      recipientsNotified: ['HOD001', 'HOD002', 'HOD003', 'ADMIN001'],
      status: 'active',
    });

    showToast('🚨 Breakdown reported! Drivers, HODs & Transport Admin alerted.');
  };

  const handleSimulateStudentSOS = () => {
    const student = state.students[0]; // Subasree
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    store.createEmergency({
      eventId: `EVT_SOS_${Date.now()}`,
      busId: currentBus.busId,
      busNumber: currentBus.busNumber,
      routeId: currentBus.routeId,
      reportedByRole: 'student',
      reportedByName: `${student.name} (${student.department})`,
      reportedById: student.studentId,
      reason: 'Medical Assistance / Safety Alert triggered via Student SOS',
      latitude: currentBus.currentLocation.latitude,
      longitude: currentBus.currentLocation.longitude,
      timestamp: nowTime,
      priority: 'urgent',
      affectedDepartments: [student.department],
      recipientsNotified: ['DRV001', 'HOD001', 'ADMIN001'],
      status: 'active',
    });

    store.addNotification({
      notificationId: `NOTIF_SOS_${Date.now()}`,
      recipientRole: 'admin',
      busId: currentBus.busId,
      title: `🚨 STUDENT SOS: ${student.name}`,
      message: `Emergency SOS triggered by ${student.name} (${student.department}) on Bus ${currentBus.busNumber}. Location: ${currentBus.currentLocation.address}.`,
      timestamp: nowTime,
      priority: 'urgent',
      category: 'emergency',
      readStatus: false,
    });

    showToast(`🚨 SOS Triggered by student ${student.name}! Admins & Driver notified.`);
  };

  const handleResetTrip = () => {
    trackingService.resetTrip(currentBus.busId);
    showToast('Bus trip reset to starting terminal.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (buses, boarding, alerts) back to original seed?')) {
      store.resetDemoData();
      trackingService.resetTrip('BUS001');
      showToast('All data reset to initial prototype seed.');
    }
  };

  // Quick Switch Roles
  const handleSwitchRole = (role: UserRole, id: string) => {
    if (role === 'student') {
      const student = state.students.find((s) => s.studentId === id) || state.students[0];
      store.login({
        id: student.studentId,
        name: student.name,
        email: student.email,
        role: 'student',
        department: student.department,
        busId: student.busId,
        pickupStopId: student.pickupStopId,
        avatar: student.avatar,
      });
      showToast(`Switched to Student: ${student.name} (${student.department})`);
    } else if (role === 'driver') {
      const driver = state.drivers.find((d) => d.driverId === id) || state.drivers[0];
      store.login({
        id: driver.driverId,
        name: driver.name,
        email: 'driver.ravi@kcgcollege.com',
        role: 'driver',
        phone: driver.phone,
        busId: driver.busId,
        avatar: driver.avatar,
      });
      showToast(`Switched to Driver: ${driver.name} (Bus KCG-07)`);
    } else if (role === 'hod') {
      const hod = state.hods.find((h) => h.hodId === id) || state.hods[0];
      store.login({
        id: hod.hodId,
        name: hod.name,
        email: hod.email,
        role: 'hod',
        department: hod.department,
        phone: hod.phone,
      });
      showToast(`Switched to ${hod.department} HOD: ${hod.name}`);
    } else if (role === 'admin') {
      store.login({
        id: 'ADMIN001',
        name: 'G. Meganathan',
        email: 'transport@kcgcollege.com',
        role: 'admin',
        phone: '+91 94440 00123',
      });
      showToast('Switched to Transport Admin');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 animate-bounce flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Control Hub */}
      <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-4 z-40 max-w-sm sm:max-w-md w-[calc(100%-1.5rem)] sm:w-auto">
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden transition-all duration-300">
          {/* Header Bar */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Demo Simulator
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                {currentBus.busNumber} • {state.simulation.speedMultiplier}x
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="text-[11px]">{isExpanded ? 'Hide Controls' : 'Open Controls'}</span>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>

          {/* Expanded Simulation Controls */}
          {isExpanded && (
            <div className="p-3.5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
              {/* Quick Role Switcher */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Switch Logged-in Role:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleSwitchRole('student', 'STU001')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'student'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🎓 Student
                    <span className="block text-[10px] opacity-80">Subasree (CSE)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('driver', 'DRV001')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'driver'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🚌 Driver
                    <span className="block text-[10px] opacity-80">Ravi (KCG-07)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('admin', 'ADMIN001')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'admin'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    ⚡ Admin
                    <span className="block text-[10px] opacity-80">Transport Desk</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('hod', 'HOD001')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'hod' && state.currentUser.department === 'CSE'
                        ? 'bg-indigo-500 text-white font-bold border-indigo-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🏛️ CSE HOD
                    <span className="block text-[10px] opacity-80">Dr. Collins (18)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('hod', 'HOD002')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'hod' && state.currentUser.department === 'ECE'
                        ? 'bg-indigo-500 text-white font-bold border-indigo-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🏛️ ECE HOD
                    <span className="block text-[10px] opacity-80">Dr. Deiva (10)</span>
                  </button>

                  <button
                    onClick={() => handleSwitchRole('hod', 'HOD003')}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium border transition-colors ${
                      state.currentUser?.role === 'hod' && state.currentUser.department === 'IT'
                        ? 'bg-indigo-500 text-white font-bold border-indigo-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    🏛️ IT HOD
                    <span className="block text-[10px] opacity-80">Dr. Anand (7)</span>
                  </button>
                </div>
              </div>

              {/* GPS Movement & Speed */}
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-400" /> GPS Engine
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleToggleSimulation}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors ${
                        state.simulation.isRunning
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      {state.simulation.isRunning ? (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleResetTrip}
                      title="Reset bus trip to origin"
                      className="p-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Speed Multipliers */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <FastForward className="w-3 h-3 text-cyan-400" /> Speed:
                  </span>
                  {[1, 2, 5, 10].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`flex-1 py-1 rounded text-[11px] font-bold transition-colors ${
                        state.simulation.speedMultiplier === s
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Delay & Incident Scenarios (Test Requirements) */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Simulate Scenarios:
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={handleSimulate15MinDelay}
                    className="p-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-lg text-left transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>⚠️ +15m Delay</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Alerts CSE (18), ECE (10), IT (7) HODs
                    </div>
                  </button>

                  <button
                    onClick={handleSimulate25MinDelay}
                    className="p-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-lg text-left transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>🚨 +25m Delay</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Escalates to Admin &amp; HODs
                    </div>
                  </button>

                  <button
                    onClick={handleSimulateBreakdown}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-left transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <span>🛑 Breakdown</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Speed=0, alerts driver &amp; desk
                    </div>
                  </button>

                  <button
                    onClick={handleSimulateStudentSOS}
                    className="p-2 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-purple-300 rounded-lg text-left transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>SOS Emergency</span>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      Subasree SOS dispatched
                    </div>
                  </button>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={handleClearDelay}
                    className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold text-center transition-colors"
                  >
                    ✅ Clear Delay / On Time
                  </button>
                  <button
                    onClick={handleResetData}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-medium text-center transition-colors"
                  >
                    Reset Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
