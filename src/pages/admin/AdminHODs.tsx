import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { HOD } from '../../types';
import { Building2, Mail, Phone, Users, Edit2, X, Check } from 'lucide-react';

interface AdminHODsProps {
  state: AppState;
}

export const AdminHODs: React.FC<AdminHODsProps> = ({ state }) => {
  const [editingHOD, setEditingHOD] = useState<HOD | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cabin, setCabin] = useState('');

  const handleOpenEdit = (hod: HOD) => {
    setEditingHOD(hod);
    setName(hod.name);
    setEmail(hod.email);
    setPhone(hod.phone);
    setCabin(hod.cabin);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHOD) return;

    store.updateHOD(editingHOD.hodId, {
      name,
      email,
      phone,
      cabin,
    });
    setEditingHOD(null);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Department HOD Directorate &amp; Escalation Map
        </h2>
        <p className="text-xs text-slate-500">
          Automated routing targets for departmental delay fan-out and emergency notifications
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {state.hods.map((hod) => {
          const studentCount = state.students.filter((s) => s.department === hod.department).length;
          const kcg07Count = state.students.filter(
            (s) => s.department === hod.department && s.busId === 'BUS001'
          ).length;

          return (
            <div
              key={hod.hodId}
              className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center border border-indigo-200">
                    {hod.department}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{hod.name}</h3>
                    <span className="text-[11px] text-slate-500">HOD - {hod.department} Department</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(hod)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                  title="Edit HOD Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                  </span>
                  <strong className="text-slate-900">{hod.email}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
                  </span>
                  <strong className="text-slate-900">{hod.phone}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Cabin:
                  </span>
                  <strong className="text-slate-900">{hod.cabin}</strong>
                </div>
              </div>

              {/* Department Student Counters - CRITICAL */}
              <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Dept Commuters:</span>
                  <strong className="text-slate-900">{studentCount} Students</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-900 font-bold">On Demo Bus KCG-07:</span>
                  <strong className="text-amber-900 font-black">{kcg07Count} Students</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit HOD Modal */}
      {editingHOD && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                Edit {editingHOD.department} HOD Profile
              </h3>
              <button
                onClick={() => setEditingHOD(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">HOD Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Cabin Location</label>
                <input
                  type="text"
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHOD(null)}
                  className="flex-1 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
