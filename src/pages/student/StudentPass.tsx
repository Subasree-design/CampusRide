import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  QrCode,
  CheckCircle2,
  Calendar,
  Bus as BusIcon,
  ShieldCheck,
  Download,
  Share2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface StudentPassProps {
  state: AppState;
}

export const StudentPass: React.FC<StudentPassProps> = ({ state }) => {
  const [showQR, setShowQR] = useState(true);
  const [boardingMessage, setBoardingMessage] = useState<string | null>(null);

  const student = state.currentUser;
  const currentStudentData = state.students.find((s) => s.studentId === student?.id) || state.students[0];
  const bus = state.buses.find((b) => b.busId === currentStudentData.busId) || state.buses[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];

  const handleSimulateBoarding = () => {
    const result = store.recordBoarding(currentStudentData.studentId, bus.busId, 'qr_scan');
    setBoardingMessage(result.message);
    setTimeout(() => setBoardingMessage(null), 5000);
  };

  return (
    <div className="max-w-md mx-auto space-y-5 pb-20 md:pb-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Digital Bus Pass
        </h2>
        <p className="text-xs text-slate-500">
          Official KCG College of Technology Transit Credential
        </p>
      </div>

      {boardingMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{boardingMessage}</span>
        </div>
      )}

      {/* Official College Digital Pass Card */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-300/80 transition-all">
        {/* Pass Top Banner with College Identity */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4.5 pb-4 text-center border-b border-amber-400/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/kcg-college-bus-logo.png"
                alt="KCG Logo"
                className="w-10 h-10 rounded-full bg-white p-0.5 object-contain border border-amber-300"
              />
              <div className="text-left">
                <div className="text-xs font-black tracking-wider text-amber-400">
                  KCG COLLEGE OF TECHNOLOGY
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  Karapakkam, Chennai - 600097
                </div>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              STUDENT PASS
            </span>
          </div>
        </div>

        {/* Student Credential Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={currentStudentData.avatar}
              alt={currentStudentData.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
            />
            <div className="space-y-0.5 min-w-0">
              <h3 className="font-extrabold text-base text-slate-900 truncate">
                {currentStudentData.name}
              </h3>
              <div className="text-xs font-bold text-indigo-700">
                Roll No: <span className="font-mono">{currentStudentData.studentId}</span>
              </div>
              <div className="text-xs text-slate-600">
                Dept: <strong>{currentStudentData.department}</strong> • {currentStudentData.year}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {currentStudentData.email}
              </div>
            </div>
          </div>

          {/* Bus & Route Assignment Box */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Bus
              </span>
              <span className="font-black text-slate-900 text-sm">{bus.busNumber}</span>
              <span className="text-[10px] text-slate-500 block">{bus.plateNumber}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pickup Point
              </span>
              <span className="font-bold text-slate-900 truncate block">
                {currentStudentData.pickupStopName.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block">East Station</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Route
              </span>
              <span className="font-semibold text-slate-800 text-[11px] truncate block">
                {route.routeName.split(':')[0]}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Validity
              </span>
              <span className="font-semibold text-emerald-700 text-[11px] block">
                {currentStudentData.passValidUntil}
              </span>
            </div>
          </div>

          {/* Deterministic QR Code Section */}
          <div className="pt-2 text-center">
            {showQR ? (
              <div className="inline-block p-4 rounded-2xl bg-white border-2 border-slate-900 shadow-md">
                {/* SVG QR Code Simulation */}
                <svg
                  className="w-40 h-40 mx-auto"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="white" />
                  {/* Top-Left Position Detection Marker */}
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                  <rect x="15" y="15" width="14" height="14" fill="white" />
                  <rect x="19" y="19" width="6" height="6" fill="#0f172a" />

                  {/* Top-Right Position Detection Marker */}
                  <rect x="66" y="10" width="24" height="24" fill="#0f172a" rx="3" />
                  <rect x="71" y="15" width="14" height="14" fill="white" />
                  <rect x="75" y="19" width="6" height="6" fill="#0f172a" />

                  {/* Bottom-Left Position Detection Marker */}
                  <rect x="10" y="66" width="24" height="24" fill="#0f172a" rx="3" />
                  <rect x="15" y="71" width="14" height="14" fill="white" />
                  <rect x="19" y="75" width="6" height="6" fill="#0f172a" />

                  {/* Data Matrix Elements */}
                  <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="24" width="6" height="12" fill="#0f172a" />
                  <rect x="52" y="30" width="6" height="6" fill="#0f172a" />
                  
                  {/* Center Emblem Icon */}
                  <rect x="40" y="40" width="20" height="20" fill="#f59e0b" rx="4" />
                  <rect x="45" y="45" width="10" height="10" fill="#0f172a" rx="2" />

                  <rect x="12" y="42" width="6" height="12" fill="#0f172a" />
                  <rect x="24" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="70" y="42" width="6" height="18" fill="#0f172a" />
                  <rect x="82" y="48" width="6" height="12" fill="#0f172a" />

                  <rect x="42" y="68" width="12" height="6" fill="#0f172a" />
                  <rect x="60" y="68" width="6" height="12" fill="#0f172a" />
                  <rect x="42" y="80" width="6" height="6" fill="#0f172a" />
                  <rect x="54" y="80" width="18" height="6" fill="#0f172a" />
                  <rect x="78" y="74" width="6" height="12" fill="#0f172a" />
                </svg>

                <div className="text-[11px] font-mono text-slate-500 font-bold mt-2">
                  {currentStudentData.passToken}
                </div>
              </div>
            ) : (
              <div className="py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                QR Code hidden for privacy.
              </div>
            )}

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                {showQR ? 'Hide QR Code' : 'Display Boarding QR'}
              </button>
            </div>
          </div>

          {/* Boarding Status Banner */}
          <div className="pt-2 border-t border-slate-100">
            {currentStudentData.boardingStatus === 'boarded' ? (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Boarded Today at {currentStudentData.boardingTime || '07:45 AM'} on {bus.busNumber}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200 text-xs text-center font-bold">
                  ⚠️ Status: Awaiting Boarding on {bus.busNumber}
                </div>
                <button
                  type="button"
                  onClick={handleSimulateBoarding}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate QR Boarding Scan</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Cryptographically Signed • KCG Transport Dept</span>
        </div>
      </div>
    </div>
  );
};
