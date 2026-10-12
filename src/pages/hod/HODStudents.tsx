import React, { useState } from 'react';
import { AppState } from '../../services/store';
import { Search, Users, Phone, Bus, MapPin, CheckCircle2 } from 'lucide-react';

interface HODStudentsProps {
  state: AppState;
}

export const HODStudents: React.FC<HODStudentsProps> = ({ state }) => {
  const [search, setSearch] = useState('');
  const user = state.currentUser;
  const currentDept = user?.department || 'CSE';

  // Access Control: HOD can ONLY view students belonging to their department!
  const deptStudents = state.students.filter((s) => s.department === currentDept);

  const filtered = deptStudents.filter((s) => {
    return (
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupStopName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const boardedCount = deptStudents.filter((s) => s.boardingStatus === 'boarded').length;

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentDept} Student Commuter Directory
          </h2>
          <p className="text-xs text-slate-500">
            Authorized view for {currentDept} HOD • Total {deptStudents.length} Students
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            {boardedCount} of {deptStudents.length} Boarded Today
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${currentDept} students by name, Roll No (e.g. Subasree, STU001) or stop...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        />
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => {
          const bus = state.buses.find((b) => b.busId === s.busId);
          const isBoarded = s.boardingStatus === 'boarded';

          return (
            <div
              key={s.studentId}
              className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{s.name}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {s.studentId}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">{s.year}</div>
                  <div className="text-[11px] text-indigo-700 font-semibold truncate">
                    {s.email}
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Bus className="w-3 h-3 text-indigo-500" /> Bus:
                  </span>
                  <strong>{bus?.busNumber || 'KCG Bus'}</strong>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-amber-500" /> Pickup:
                  </span>
                  <strong className="truncate max-w-[150px]">{s.pickupStopName.split(' ')[0]}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                {isBoarded ? (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Boarded at {s.boardingTime || '07:45 AM'}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-700">
                    Awaiting Transit
                  </span>
                )}
                <a
                  href={`tel:${s.phone}`}
                  className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
