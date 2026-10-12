import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import {
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Phone,
  QrCode,
} from 'lucide-react';

interface DriverStudentsProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const DriverStudents: React.FC<DriverStudentsProps> = ({ state, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const bus = state.buses.find((b) => b.busId === 'BUS001') || state.buses[0];
  const assigned = state.students.filter((s) => s.busId === bus.busId);

  const filtered = assigned.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupStopName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || s.department === filterDept;
    const matchesStatus = filterStatus === 'all' || s.boardingStatus === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const boardedCount = assigned.filter((s) => s.boardingStatus === 'boarded').length;

  const handleToggleBoarding = (studentId: string, currentStatus: string) => {
    if (currentStatus === 'not_boarded') {
      store.recordBoarding(studentId, bus.busId, 'manual_entry');
    } else {
      // Toggle back to not boarded
      store.updateStudent(studentId, {
        boardingStatus: 'not_boarded',
        boardingTime: undefined,
      });
      store.updateBus(bus.busId, {
        currentOccupancy: Math.max(0, bus.currentOccupancy - 1),
      });
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Assigned Student Roster
          </h2>
          <p className="text-xs text-slate-500">
            Bus {bus.busNumber} • {boardedCount} of {assigned.length} Boarded
          </p>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
        >
          <QrCode className="w-4 h-4" />
          <span>Open Scanner</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, ID (e.g. Subasree, STU001) or stop..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Departments</option>
            <option value="CSE">CSE Dept (18)</option>
            <option value="ECE">ECE Dept (10)</option>
            <option value="IT">IT Dept (7)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Boarding Status</option>
            <option value="boarded">Boarded Only</option>
            <option value="not_boarded">Not Boarded Only</option>
          </select>
        </div>
      </div>

      {/* Student Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filtered.map((s) => {
          const isBoarded = s.boardingStatus === 'boarded';
          return (
            <div
              key={s.studentId}
              className={`p-3.5 rounded-2xl border transition-all shadow-2xs flex items-center justify-between gap-3 ${
                isBoarded
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{s.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {s.department}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{s.studentId}</div>
                  <div className="text-[11px] text-slate-600 truncate mt-0.5">
                    Stop: <strong>{s.pickupStopName.split(' ')[0]}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleBoarding(s.studentId, s.boardingStatus)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                    isBoarded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  {isBoarded ? '✓ Boarded' : 'Check In'}
                </button>
                <a
                  href={`tel:${s.phone}`}
                  className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-0.5"
                >
                  <Phone className="w-2.5 h-2.5" /> Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
