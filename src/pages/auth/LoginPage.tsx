import React, { useState } from 'react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { store, AppState } from '../../services/store';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  KeyRound,
  Check,
} from 'lucide-react';

interface LoginPageProps {
  state: AppState;
}

export const LoginPage: React.FC<LoginPageProps> = ({ state }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('STU001');
  const [password, setPassword] = useState('demo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Demo accounts helper
  const handleSelectDemoAccount = (role: UserRole, id: string) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword('demo123');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim().toUpperCase();

    if (!cleanId) {
      setErrorMessage('Please enter your College ID or registered email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Role-specific authentication matching
    if (selectedRole === 'student') {
      const student = state.students.find(
        (s) => s.studentId.toUpperCase() === cleanId || s.email.toLowerCase() === identifier.trim().toLowerCase()
      );
      if (student) {
        store.login({
          id: student.studentId,
          name: student.name,
          email: student.email,
          role: 'student',
          department: student.department,
          busId: student.busId,
          pickupStopId: student.pickupStopId,
          avatar: student.avatar,
        });
        return;
      }
    } else if (selectedRole === 'driver') {
      const driver = state.drivers.find(
        (d) => d.driverId.toUpperCase() === cleanId || d.name.toLowerCase().includes(cleanId.toLowerCase())
      );
      if (driver) {
        store.login({
          id: driver.driverId,
          name: driver.name,
          email: 'driver.ravi@kcgcollege.com',
          role: 'driver',
          phone: driver.phone,
          busId: driver.busId,
          avatar: driver.avatar,
        });
        return;
      }
    } else if (selectedRole === 'hod') {
      const hod = state.hods.find(
        (h) => h.hodId.toUpperCase() === cleanId || h.department.toUpperCase() === cleanId
      );
      if (hod) {
        store.login({
          id: hod.hodId,
          name: hod.name,
          email: hod.email,
          role: 'hod',
          department: hod.department,
          phone: hod.phone,
        });
        return;
      }
    } else if (selectedRole === 'admin') {
      if (cleanId === 'ADMIN001' || cleanId.includes('ADMIN')) {
        store.login({
          id: 'ADMIN001',
          name: 'Mr. G. Meganathan',
          email: 'transport@kcgcollege.com',
          role: 'admin',
          phone: '+91 94440 00123',
        });
        return;
      }
    }

    setErrorMessage(`Invalid credentials for ${selectedRole.toUpperCase()} role. Use demo ID (e.g. ${
      selectedRole === 'student' ? 'STU001' : selectedRole === 'driver' ? 'DRV001' : selectedRole === 'hod' ? 'HOD001' : 'ADMIN001'
    }) with password "demo123".`);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-amber-50/20 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Prominent Official College Bus Logo */}
        <div className="inline-block p-2 rounded-3xl bg-white shadow-md border border-slate-200/80 mb-3">
          <BrandLogo size="lg" showWordmark={true} showTagline={true} />
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-7 px-5 sm:px-9 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
              Select Your Access Portal
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  setIdentifier('STU001');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'student'
                    ? 'bg-white text-amber-600 shadow-xs border border-amber-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('driver');
                  setIdentifier('DRV001');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'driver'
                    ? 'bg-white text-emerald-600 shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚌 Driver
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('hod');
                  setIdentifier('HOD001');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'hod'
                    ? 'bg-white text-indigo-600 shadow-xs border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏛️ Dept HOD
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setIdentifier('ADMIN001');
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-white text-rose-600 shadow-xs border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Admin
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {selectedRole === 'student'
                  ? 'Student ID or Registered Email'
                  : selectedRole === 'driver'
                  ? 'Driver Staff ID'
                  : selectedRole === 'hod'
                  ? 'HOD Faculty ID (e.g. HOD001, HOD002, HOD003)'
                  : 'Transport Admin ID'}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'STU001 (or subasreegopi@gmail.com)'
                      : selectedRole === 'driver'
                      ? 'DRV001'
                      : selectedRole === 'hod'
                      ? 'HOD001'
                      : 'ADMIN001'
                  }
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                Remember my login on this device
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.99] shadow-md shadow-amber-400/20 border border-amber-300 transition-all cursor-pointer"
            >
              <span>Access {selectedRole.toUpperCase()} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> 1-Click Demo Accounts
              </span>
              <span className="text-[10px] text-slate-400">Password: demo123</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('student', 'STU001')}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-left transition-all group"
              >
                <div className="font-bold text-amber-900 group-hover:text-amber-950">
                  Subasree (Student)
                </div>
                <div className="text-[11px] text-amber-700">STU001 • CSE Dept</div>
                <div className="text-[10px] text-slate-500">Bus KCG-07 (Tambaram)</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('driver', 'DRV001')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-left transition-all group"
              >
                <div className="font-bold text-emerald-900 group-hover:text-emerald-950">
                  Ravi Kumar (Driver)
                </div>
                <div className="text-[11px] text-emerald-700">DRV001 • Bus KCG-07</div>
                <div className="text-[10px] text-slate-500">Route 7 Guduvanchery</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('hod', 'HOD001')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-left transition-all group"
              >
                <div className="font-bold text-indigo-900 group-hover:text-indigo-950">
                  CSE HOD
                </div>
                <div className="text-[11px] text-indigo-700">Dr. Collins (HOD001)</div>
                <div className="text-[10px] text-slate-500">18 Students on KCG-07</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('hod', 'HOD002')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-left transition-all group"
              >
                <div className="font-bold text-indigo-900 group-hover:text-indigo-950">
                  ECE HOD
                </div>
                <div className="text-[11px] text-indigo-700">Dr. Deiva (HOD002)</div>
                <div className="text-[10px] text-slate-500">10 Students on KCG-07</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('hod', 'HOD003')}
                className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-left transition-all group"
              >
                <div className="font-bold text-indigo-900 group-hover:text-indigo-950">
                  IT HOD
                </div>
                <div className="text-[11px] text-indigo-700">Dr. Anand (HOD003)</div>
                <div className="text-[10px] text-slate-500">7 Students on KCG-07</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoAccount('admin', 'ADMIN001')}
                className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-left transition-all group"
              >
                <div className="font-bold text-rose-900 group-hover:text-rose-950">
                  Transport Admin
                </div>
                <div className="text-[11px] text-rose-700">ADMIN001 • Desk</div>
                <div className="text-[10px] text-slate-500">Full Fleet Control</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Firebase Ready Note */}
        <div className="mt-5 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KCG College Campus Transit Security Architecture</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Prototype Authentication • Architecture prepared for Firebase Auth &amp; Cloud Firestore
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Reset Campus Transit Password</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Enter your college email address (e.g. subasreegopi@gmail.com) and we'll send a simulated recovery link.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Reset link simulated! Password reset to "demo123".
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@kcgcollege.com"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
