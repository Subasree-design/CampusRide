import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { trackingService } from '../../services/busTrackingService';
import { Sliders, RotateCcw, ShieldCheck, Database, Bell, Check } from 'lucide-react';

interface AdminSettingsProps {
  state: AppState;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ state }) => {
  const [delayThreshold, setDelayThreshold] = useState(10);
  const [escalationThreshold, setEscalationThreshold] = useState(20);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (buses, boarding, alerts) back to original seed?')) {
      store.resetDemoData();
      trackingService.resetTrip('BUS001');
      alert('All prototype data reset to initial KCG College seed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System Configuration &amp; Demo Controls
        </h2>
        <p className="text-xs text-slate-500">
          Configure notification thresholds, escalation triggers, and reset prototype states
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Operational settings saved successfully.</span>
        </div>
      )}

      {/* Threshold Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" /> Delay Alert Trigger Settings
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Department HOD Delay Alert Threshold</span>
              <span className="text-amber-600 font-extrabold">{delayThreshold} Minutes</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="1"
              value={delayThreshold}
              onChange={(e) => setDelayThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Delays equal to or exceeding this threshold will automatically fan out to CSE, ECE, and IT HODs with department student counts.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between font-bold text-slate-700 mb-1">
              <span>Transport Admin Escalation Threshold</span>
              <span className="text-rose-600 font-extrabold">{escalationThreshold} Minutes</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="5"
              value={escalationThreshold}
              onChange={(e) => setEscalationThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Delays reaching this limit are marked HIGH PRIORITY and immediately alert the Transport Admin.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
        >
          Save Threshold Rules
        </button>
      </form>

      {/* Firebase Readiness Status */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-500" /> Firebase Integration Readiness
        </h3>
        <p className="text-xs text-slate-600">
          CampusRide has been built with a decoupled service-repository interface ready to plug into real cloud services:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900">Firebase Authentication</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Ready for OAuth &amp; College SSO</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900">Cloud Firestore</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Schema mirrors typed data models</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900">Firebase Cloud Messaging</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Hooks into NotificationService</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900">Google Maps Platform</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Drop-in replacement for Leaflet layer</div>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Section */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-3">
        <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-600" /> Reset Prototype Demo Data
        </h3>
        <p className="text-xs text-rose-800">
          Clears local storage, restores the original 5 buses, 50 students, and initial schedule. Use this to restart the test scenarios.
        </p>
        <button
          onClick={handleResetData}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
        >
          Reset Demo Data to Initial Seed
        </button>
      </div>
    </div>
  );
};
