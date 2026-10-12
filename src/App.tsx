import React, { useEffect, useState } from 'react';
import { store, AppState } from './services/store';
import { trackingService } from './services/busTrackingService';

// Common Components
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { DemoControlPanel } from './components/common/DemoControlPanel';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Student Screens
import { StudentHome } from './pages/student/StudentHome';
import { StudentTrack } from './pages/student/StudentTrack';
import { StudentMyBus } from './pages/student/StudentMyBus';
import { StudentPass } from './pages/student/StudentPass';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentSOSModal } from './pages/student/StudentSOSModal';

// Driver Screens
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { DriverLiveRoute } from './pages/driver/DriverLiveRoute';
import { DriverBoardingScanner } from './pages/driver/DriverBoardingScanner';
import { DriverStudents } from './pages/driver/DriverStudents';

// HOD Screens
import { HODDashboard } from './pages/hod/HODDashboard';
import { HODAlerts } from './pages/hod/HODAlerts';
import { HODStudents } from './pages/hod/HODStudents';

// Admin Screens
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLiveMonitoring } from './pages/admin/AdminLiveMonitoring';
import { AdminBuses } from './pages/admin/AdminBuses';
import { AdminRoutes } from './pages/admin/AdminRoutes';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminDrivers } from './pages/admin/AdminDrivers';
import { AdminHODs } from './pages/admin/AdminHODs';
import { AdminDelayMonitoring } from './pages/admin/AdminDelayMonitoring';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminSettings } from './pages/admin/AdminSettings';

import 'leaflet/dist/leaflet.css';

export default function App() {
  const [appState, setAppState] = useState<AppState>(store.getState());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);

  // Subscribe to Central Store updates & initialize Tracking simulation
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setAppState(newState);
    });

    trackingService.init();

    return () => {
      unsubscribe();
      trackingService.stopSimulation();
    };
  }, []);

  // When user logs in or switches, adjust default tab
  useEffect(() => {
    if (appState.currentUser) {
      if (appState.currentUser.role === 'admin') {
        setActiveTab('dashboard');
      } else if (appState.currentUser.role === 'driver') {
        setActiveTab('dashboard');
      } else if (appState.currentUser.role === 'hod') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('home');
      }
    }
  }, [appState.currentUser?.role]);

  // If not authenticated, show Login page
  if (!appState.currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <LoginPage state={appState} />
        {/* Floating Demo Control Panel for quick testing */}
        <DemoControlPanel state={appState} />
      </div>
    );
  }

  const role = appState.currentUser.role;

  // Compute unread notification count for current user
  const unreadCount = appState.notifications.filter((n) => {
    if (n.readStatus) return false;
    if (n.recipientRole === 'all') return true;
    if (n.recipientRole === role) {
      if (!n.recipientId || n.recipientId === appState.currentUser?.id) return true;
    }
    return false;
  }).length;

  const activeDelayCount = appState.delayAlerts.filter((a) => a.status === 'active').length;
  const emergencyCount = appState.emergencies.filter((e) => e.status === 'active').length;

  // Render role-specific screens with strict Access Control
  const renderContent = () => {
    switch (role) {
      case 'student':
        switch (activeTab) {
          case 'home':
            return (
              <StudentHome
                state={appState}
                onNavigate={setActiveTab}
                onOpenSOS={() => setShowSOSModal(true)}
              />
            );
          case 'track':
            return (
              <StudentTrack
                state={appState}
                onNavigate={setActiveTab}
                onOpenSOS={() => setShowSOSModal(true)}
              />
            );
          case 'mybus':
            return <StudentMyBus state={appState} onNavigate={setActiveTab} />;
          case 'pass':
            return <StudentPass state={appState} />;
          case 'notifications':
            return <StudentNotifications state={appState} onNavigate={setActiveTab} />;
          case 'profile':
            return <StudentProfile state={appState} onNavigate={setActiveTab} />;
          default:
            return (
              <StudentHome
                state={appState}
                onNavigate={setActiveTab}
                onOpenSOS={() => setShowSOSModal(true)}
              />
            );
        }

      case 'driver':
        switch (activeTab) {
          case 'dashboard':
            return <DriverDashboard state={appState} onNavigate={setActiveTab} />;
          case 'route':
            return <DriverLiveRoute state={appState} />;
          case 'scanner':
            return <DriverBoardingScanner state={appState} />;
          case 'students':
            return <DriverStudents state={appState} onNavigate={setActiveTab} />;
          case 'notifications':
            return <StudentNotifications state={appState} onNavigate={setActiveTab} />;
          case 'profile':
            return <StudentProfile state={appState} onNavigate={setActiveTab} />;
          default:
            return <DriverDashboard state={appState} onNavigate={setActiveTab} />;
        }

      case 'hod':
        switch (activeTab) {
          case 'dashboard':
            return <HODDashboard state={appState} onNavigate={setActiveTab} />;
          case 'livebuses':
            return <AdminLiveMonitoring state={appState} />;
          case 'alerts':
            return <HODAlerts state={appState} />;
          case 'students':
            return <HODStudents state={appState} />;
          case 'profile':
            return <StudentProfile state={appState} onNavigate={setActiveTab} />;
          default:
            return <HODDashboard state={appState} onNavigate={setActiveTab} />;
        }

      case 'admin':
        switch (activeTab) {
          case 'dashboard':
            return <AdminDashboard state={appState} onNavigate={setActiveTab} />;
          case 'livemap':
            return <AdminLiveMonitoring state={appState} />;
          case 'buses':
            return <AdminBuses state={appState} />;
          case 'routes':
            return <AdminRoutes state={appState} />;
          case 'students':
            return <AdminStudents state={appState} />;
          case 'drivers':
            return <AdminDrivers state={appState} />;
          case 'hods':
            return <AdminHODs state={appState} />;
          case 'delays':
            return <AdminDelayMonitoring state={appState} />;
          case 'alerts':
            return <AdminAlerts state={appState} />;
          case 'settings':
            return <AdminSettings state={appState} />;
          default:
            return <AdminDashboard state={appState} onNavigate={setActiveTab} />;
        }

      default:
        return <div>Unknown Role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        state={appState}
        onOpenSOS={() => setShowSOSModal(true)}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar for Admin */}
        {role === 'admin' && (
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            activeDelayCount={activeDelayCount}
            emergencyCount={emergencyCount}
          />
        )}

        {/* Content Pane */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation for Student, Driver & HOD */}
      {role !== 'admin' && (
        <BottomNav
          role={role}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadCount={unreadCount}
        />
      )}

      {/* Admin Mobile Navigation Pill (for Admin on mobile devices) */}
      {role === 'admin' && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 text-white p-2 md:hidden flex justify-around text-[10px] font-bold border-t border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'dashboard' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('livemap')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'livemap' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            Live Map
          </button>
          <button
            onClick={() => setActiveTab('delays')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'delays' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            Delays {activeDelayCount > 0 && `(${activeDelayCount})`}
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'students' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-1 px-2 rounded-lg ${activeTab === 'settings' ? 'text-amber-400 font-extrabold' : 'text-slate-400'}`}
          >
            Settings
          </button>
        </nav>
      )}

      {/* Student SOS Emergency Modal */}
      {showSOSModal && (
        <StudentSOSModal
          state={appState}
          onClose={() => setShowSOSModal(false)}
        />
      )}

      {/* Floating Demo Simulator Control Panel */}
      <DemoControlPanel state={appState} />
    </div>
  );
}
