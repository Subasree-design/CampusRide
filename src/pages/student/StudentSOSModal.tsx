import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  AlertTriangle,
  CheckCircle,
  X,
  Radio,
} from 'lucide-react';
import { store, AppState } from '../../services/store';

interface StudentSOSModalProps {
  state: AppState;
  onClose: () => void;
}

export const StudentSOSModal: React.FC<StudentSOSModalProps> = ({ state, onClose }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Medical Emergency / Feeling Unwell');
  const [callSimulated, setCallSimulated] = useState<string | null>(null);

  const student = state.currentUser;
  const bus = state.buses.find((b) => b.busId === student?.busId) || state.buses[0];
  const driver = state.drivers.find((d) => d.driverId === bus?.driverId) || state.drivers[0];

  const handleConfirmSOS = () => {
    if (!student) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Create High-Priority Emergency Record
    store.createEmergency({
      eventId: `EVT_SOS_${Date.now()}`,
      busId: bus.busId,
      busNumber: bus.busNumber,
      routeId: bus.routeId,
      reportedByRole: 'student',
      reportedByName: `${student.name} (${student.department})`,
      reportedById: student.id,
      reason: selectedReason,
      latitude: bus.currentLocation.latitude,
      longitude: bus.currentLocation.longitude,
      timestamp: nowTime,
      priority: 'urgent',
      affectedDepartments: [student.department || 'CSE'],
      recipientsNotified: ['DRV001', 'HOD001', 'ADMIN001'],
      status: 'active',
    });

    // 2. Alert Driver
    store.addNotification({
      notificationId: `NOTIF_SOS_DRV_${Date.now()}`,
      recipientRole: 'driver',
      recipientId: driver.driverId,
      busId: bus.busId,
      title: `🚨 PASSENGER SOS: ${student.name}`,
      message: `Student ${student.name} (${student.department}) pressed SOS: "${selectedReason}". Check student onboard immediately.`,
      timestamp: nowTime,
      priority: 'urgent',
      category: 'emergency',
      readStatus: false,
    });

    // 3. Alert Department HOD
    const hod = state.hods.find((h) => h.department === student.department);
    if (hod) {
      store.addNotification({
        notificationId: `NOTIF_SOS_HOD_${Date.now()}`,
        recipientRole: 'hod',
        recipientId: hod.hodId,
        busId: bus.busId,
        title: `🚨 STUDENT EMERGENCY: ${student.name} (${student.department})`,
        message: `${student.department} student ${student.name} triggered SOS on Bus ${bus.busNumber}. Reason: ${selectedReason}. Location: ${bus.currentLocation.address}.`,
        timestamp: nowTime,
        priority: 'urgent',
        category: 'emergency',
        readStatus: false,
      });
    }

    // 4. Alert Transport Admin
    store.addNotification({
      notificationId: `NOTIF_SOS_ADM_${Date.now()}`,
      recipientRole: 'admin',
      busId: bus.busId,
      title: `🚨 EMERGENCY SOS: ${student.name}`,
      message: `SOS activated on Bus ${bus.busNumber} by ${student.name} (${student.department}). Coords: [${bus.currentLocation.latitude}, ${bus.currentLocation.longitude}]. Reason: ${selectedReason}.`,
      timestamp: nowTime,
      priority: 'urgent',
      category: 'emergency',
      readStatus: false,
    });

    setConfirmed(true);
  };

  const simulateCall = (contact: string, phone: string) => {
    setCallSimulated(`Simulating priority call to ${contact} (${phone})...`);
    setTimeout(() => setCallSimulated(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Campus Transit SOS</h3>
              <p className="text-[11px] text-slate-500">KCG Student Emergency Response Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {callSimulated && (
          <div className="my-3 p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-bounce">
            <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>{callSimulated}</span>
          </div>
        )}

        {confirmed ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Emergency Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your driver <strong>{driver.name}</strong>, Department HOD, and the KCG Transport Desk have been alerted with your live location.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-left text-xs space-y-1 border border-slate-200 font-mono">
              <div>Bus: <strong>{bus.busNumber}</strong></div>
              <div>Location: <strong>{bus.currentLocation.address}</strong></div>
              <div>Status: <span className="text-red-600 font-bold">HIGH PRIORITY ALERT ACTIVE</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-3">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                Use this only in genuine emergencies. Your live location and identity will be dispatched immediately.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Situation
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Medical Emergency / Feeling Unwell">Medical Emergency / Feeling Unwell</option>
                <option value="Safety or Security Concern">Safety or Security Concern</option>
                <option value="Bus Accident or Breakdown">Bus Accident or Breakdown</option>
                <option value="Missed Boarding / Stranded at Stop">Missed Boarding / Stranded at Stop</option>
                <option value="Other Urgent Assistance Needed">Other Urgent Assistance Needed</option>
              </select>
            </div>

            {/* Direct Calling Actions */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Direct Contact Lines:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${driver.phone}`}
                  onClick={() => simulateCall(`Driver ${driver.name}`, driver.phone)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 flex items-center gap-2 font-medium transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <div className="font-bold">Call Driver</div>
                    <div className="text-[10px] text-slate-500">{driver.phone}</div>
                  </div>
                </a>

                <a
                  href="tel:+919444000123"
                  onClick={() => simulateCall('KCG Transport Desk', '+91 94440 00123')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 flex items-center gap-2 font-medium transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="text-left">
                    <div className="font-bold">Transport Desk</div>
                    <div className="text-[10px] text-slate-500">+91 94440 00123</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Simulated Live Location */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">
                Simulated Location: <strong>{bus.currentLocation.address}</strong>
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSOS}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-md shadow-red-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Confirm SOS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
