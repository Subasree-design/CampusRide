import React, { useState } from 'react';
import { DelayDetectionService } from '../../services/delayDetectionService';
import { X, Clock, AlertTriangle } from 'lucide-react';

interface DriverReportDelayModalProps {
  busId: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const DriverReportDelayModal: React.FC<DriverReportDelayModalProps> = ({
  busId,
  onClose,
  onSuccess,
}) => {
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [reason, setReason] = useState('Heavy GST Road Congestion / Traffic Diversion');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = DelayDetectionService.evaluateBusDelay(busId, delayMinutes, reason);
    if (result.alertCreated) {
      onSuccess(
        `🚨 Delay of ${delayMinutes} mins recorded! Department HODs notified with department student counts.`
      );
    } else {
      onSuccess(`Bus delay updated to ${delayMinutes} minutes.`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Report Trip Delay</h3>
              <p className="text-xs text-slate-500">Notifies Students, HODs &amp; Transport Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Delay Duration (Minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDelayMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    delayMinutes === mins
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Primary Cause of Delay
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Heavy GST Road Congestion / Traffic Diversion">
                Heavy GST Road Congestion / Traffic Diversion
              </option>
              <option value="Road Construction / Single-Lane Diversion">
                Road Construction / Single-Lane Diversion
              </option>
              <option value="Minor Mechanical / Tire Pressure Check">
                Minor Mechanical / Tire Pressure Check
              </option>
              <option value="Inclement Weather / Waterlogging">
                Inclement Weather / Waterlogging
              </option>
              <option value="Student Boarding Delay at Busy Stop">
                Student Boarding Delay at Busy Stop
              </option>
            </select>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-1">
            <div className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Automatic Escalation Rules:
            </div>
            <p className="text-[11px] text-amber-800">
              • 10–19 mins: Marks bus delayed &amp; sends department student count alerts to CSE, ECE, and IT HODs.<br />
              • 20+ mins: Escalates to HIGH PRIORITY and alerts Transport Desk head.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-400/20"
            >
              Broadcast Delay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
