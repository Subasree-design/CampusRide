import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Search,
  UserCheck,
  Camera,
  RefreshCw,
  Users,
} from 'lucide-react';

interface DriverBoardingScannerProps {
  state: AppState;
}

export const DriverBoardingScanner: React.FC<DriverBoardingScannerProps> = ({ state }) => {
  const [manualInput, setManualInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
    studentId?: string;
    department?: string;
    time?: string;
  } | null>(null);

  const bus = state.buses.find((b) => b.busId === 'BUS001') || state.buses[0]; // KCG-07
  const assignedStudents = state.students.filter((s) => s.busId === bus.busId);
  const boardedCount = assignedStudents.filter((s) => s.boardingStatus === 'boarded').length;
  const remainingCount = assignedStudents.length - boardedCount;

  const handleProcessToken = (tokenOrId: string) => {
    let cleanId = tokenOrId.trim().toUpperCase();
    if (cleanId.includes('STU')) {
      const match = cleanId.match(/STU\d+/);
      if (match) cleanId = match[0];
    }

    const result = store.recordBoarding(cleanId, bus.busId, 'qr_scan');
    if (result.success && result.student) {
      setScanResult({
        success: true,
        message: result.message,
        studentName: result.student.name,
        studentId: result.student.studentId,
        department: result.student.department,
        time: result.student.boardingTime,
      });
      setManualInput('');
    } else {
      setScanResult({
        success: false,
        message: result.message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            QR Boarding Scanner
          </h2>
          <p className="text-xs text-slate-500">
            Bus {bus.busNumber} • {boardedCount}/{assignedStudents.length} Boarded
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            {remainingCount} Awaiting
          </span>
        </div>
      </div>

      {/* Camera / Visual Scanner Viewport */}
      <div className="relative bg-slate-950 rounded-3xl overflow-hidden p-6 text-white text-center shadow-xl border border-slate-800">
        <div className="relative w-48 h-48 mx-auto my-3 flex items-center justify-center border-2 border-dashed border-amber-400 rounded-2xl">
          {/* Laser Scan Animation Line */}
          <div className="absolute left-0 right-0 h-1 bg-amber-400/90 shadow-[0_0_12px_#f59e0b] animate-bounce" />
          <QrCode className="w-20 h-20 text-slate-600" />
        </div>

        <p className="text-xs text-slate-300 font-medium">
          Align Student's Digital Pass QR within frame
        </p>

        {/* Quick Simulated Scan Action */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => handleProcessToken('STU001')}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Simulate Scan: Subasree (STU001)</span>
          </button>
        </div>
      </div>

      {/* Boarding Result Modal / Banner */}
      {scanResult && (
        <div
          className={`p-4 rounded-2xl border text-xs shadow-md animate-in fade-in zoom-in-95 ${
            scanResult.success
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              {scanResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-extrabold text-sm">
                  {scanResult.success ? '✅ Boarding Confirmed' : '❌ Boarding Rejected'}
                </h4>
                <p className="mt-0.5 text-slate-700">{scanResult.message}</p>
                {scanResult.success && (
                  <div className="mt-2 grid grid-cols-2 gap-1.5 p-2 bg-white/80 rounded-xl border border-emerald-200 text-[11px] font-mono">
                    <div>Student: <strong>{scanResult.studentName}</strong></div>
                    <div>ID: <strong>{scanResult.studentId}</strong></div>
                    <div>Dept: <strong>{scanResult.department}</strong></div>
                    <div>Time: <strong>{scanResult.time}</strong></div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setScanResult(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Manual Roll Number Entry Form */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Manual Student ID / Token Entry
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter Student ID (e.g. STU001, STU002)"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
          />
          <button
            onClick={() => handleProcessToken(manualInput)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Check In
          </button>
        </div>

        {/* Quick Boarding Candidates */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            1-Click Simulate for Assigned Students:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {assignedStudents.slice(0, 6).map((s) => (
              <button
                key={s.studentId}
                onClick={() => handleProcessToken(s.studentId)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  s.boardingStatus === 'boarded'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 opacity-60'
                    : 'bg-slate-50 hover:bg-amber-100 text-slate-800 border-slate-200'
                }`}
              >
                {s.name.split(' ')[0]} ({s.studentId})
                {s.boardingStatus === 'boarded' && ' ✓'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
