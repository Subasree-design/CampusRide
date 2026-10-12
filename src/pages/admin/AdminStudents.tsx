import React, { useState } from 'react';
import { AppState, store } from '../../services/store';
import { Student } from '../../types';
import { Users, Search, Plus, Edit2, CheckCircle2, Phone, X, Bus, MapPin } from 'lucide-react';

interface AdminStudentsProps {
  state: AppState;
}

export const AdminStudents: React.FC<AdminStudentsProps> = ({ state }) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterBus, setFilterBus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<'CSE' | 'ECE' | 'IT'>('CSE');
  const [year, setYear] = useState('III Year');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [busId, setBusId] = useState('BUS001');
  const [pickupStopId, setPickupStopId] = useState('STP005');

  const filtered = state.students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.pickupStopName.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || s.department === filterDept;
    const matchesBus = filterBus === 'all' || s.busId === filterBus;
    return matchesSearch && matchesDept && matchesBus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setPhone('+91 98765 00000');
    setDepartment('CSE');
    setYear('III Year');
    setBusId('BUS001');
    setPickupStopId('STP005');
    setShowAddModal(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartment(student.department);
    setYear(student.year);
    setBusId(student.busId);
    setPickupStopId(student.pickupStopId);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const route = state.routes.find((r) => r.routeId === 'RT001') || state.routes[0];
    const pickupStop = route.stops.find((st) => st.stopId === pickupStopId) || route.stops[0];

    if (editingStudent) {
      store.updateStudent(editingStudent.studentId, {
        name,
        email,
        phone,
        department,
        year,
        busId,
        pickupStopId,
        pickupStopName: pickupStop.name,
      });
    } else {
      const idNum = String(state.students.length + 1).padStart(3, '0');
      const newStudent: Student = {
        studentId: `STU${idNum}`,
        name,
        department,
        year,
        email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@kcgcollege.com`,
        phone,
        parentPhone: '+91 94441 99999',
        busId,
        routeId: route.routeId,
        pickupStopId,
        pickupStopName: pickupStop.name,
        boardingStatus: 'not_boarded',
        passValidUntil: '31 May 2027',
        passToken: `KCG-BUS-STU${idNum}-${department}-2027`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      };
      store.addStudent(newStudent);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student Transit Directory ({state.students.length})
          </h2>
          <p className="text-xs text-slate-500">
            Allocate bus routes, manage boarding passes, and update student pickup stops
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student name, Roll No (STU001) or pickup stop..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Departments</option>
            <option value="CSE">CSE Dept</option>
            <option value="ECE">ECE Dept</option>
            <option value="IT">IT Dept</option>
          </select>

          <select
            value={filterBus}
            onChange={(e) => setFilterBus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Allocated Buses</option>
            {state.buses.map((b) => (
              <option key={b.busId} value={b.busId}>
                {b.busNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200/90 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3">Allocated Bus</th>
              <th className="py-2.5 px-3">Pickup Stop</th>
              <th className="py-2.5 px-3">Boarding Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => {
              const bus = state.buses.find((b) => b.busId === s.busId);
              const isBoarded = s.boardingStatus === 'boarded';

              return (
                <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900">{s.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{s.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {s.department}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {bus?.busNumber || s.busId}
                  </td>
                  <td className="py-3 px-3 text-slate-600 truncate max-w-[180px]">
                    {s.pickupStopName}
                  </td>
                  <td className="py-3 px-3">
                    {isBoarded ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Boarded ({s.boardingTime || '07:45 AM'})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Not Boarded
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingStudent ? `Edit Student: ${editingStudent.name}` : 'Register New Student'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Subasree G"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="CSE">CSE Dept</option>
                    <option value="ECE">ECE Dept</option>
                    <option value="IT">IT Dept</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">College Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="subasreegopi@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Allocated Bus</label>
                <select
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {state.buses.map((b) => (
                    <option key={b.busId} value={b.busId}>
                      {b.busNumber} ({b.plateNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Pickup Stop</label>
                <select
                  value={pickupStopId}
                  onChange={(e) => setPickupStopId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {state.routes[0]?.stops.map((st) => (
                    <option key={st.stopId} value={st.stopId}>
                      {st.name} ({st.scheduledTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold cursor-pointer"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
