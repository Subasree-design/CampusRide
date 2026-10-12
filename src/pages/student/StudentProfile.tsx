import React from 'react';
import { AppState, store } from '../../services/store';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  User,
  Mail,
  Phone,
  Bus,
  MapPin,
  Calendar,
  LogOut,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface StudentProfileProps {
  state: AppState;
  onNavigate: (tab: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ state, onNavigate }) => {
  const student = state.currentUser;
  const currentStudentData = state.students.find((s) => s.studentId === student?.id) || state.students[0];
  const bus = state.buses.find((b) => b.busId === currentStudentData.busId) || state.buses[0];
  const route = state.routes.find((r) => r.routeId === bus.routeId) || state.routes[0];

  return (
    <div className="max-w-md mx-auto space-y-5 pb-20 md:pb-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 text-center space-y-3">
        <div className="relative inline-block">
          <img
            src={currentStudentData.avatar}
            alt={currentStudentData.name}
            className="w-24 h-24 rounded-3xl object-cover mx-auto border-4 border-amber-300 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{currentStudentData.name}</h2>
          <div className="text-xs font-bold text-indigo-600 mt-0.5">
            Roll No: {currentStudentData.studentId} • {currentStudentData.department}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{currentStudentData.year}</div>
        </div>

        <div className="pt-2 flex justify-center gap-2">
          <button
            onClick={() => onNavigate('pass')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
          >
            Open Digital Bus Pass
          </button>
        </div>
      </div>

      {/* Transit Assignment Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-3">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
          College Transit Profile
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <Bus className="w-4 h-4 text-indigo-500" /> Allocated Bus
            </span>
            <strong className="text-slate-900">{bus.busNumber} ({bus.plateNumber})</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" /> Pickup Stop
            </span>
            <strong className="text-slate-900 truncate max-w-[200px]">
              {currentStudentData.pickupStopName}
            </strong>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Pass Validity
            </span>
            <strong className="text-emerald-700">{currentStudentData.passValidUntil}</strong>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-500" /> Department HOD
            </span>
            <strong className="text-slate-900">Dr. J. Collins (CSE)</strong>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 space-y-3">
        <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
          Emergency &amp; Contact Info
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Student Email
            </span>
            <strong className="text-slate-900">{currentStudentData.email}</strong>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Student Phone
            </span>
            <strong className="text-slate-900">{currentStudentData.phone}</strong>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" /> Parent Contact
            </span>
            <strong className="text-slate-900">{currentStudentData.parentPhone}</strong>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={() => store.logout()}
        className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out of CampusRide</span>
      </button>
    </div>
  );
};
