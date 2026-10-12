import {
  User,
  Bus,
  Route,
  Student,
  Driver,
  HOD,
  Department,
  BoardingRecord,
  NotificationItem,
  DelayAlert,
  EmergencyEvent,
  SimulationState,
} from '../types';
import {
  INITIAL_BUSES,
  INITIAL_ROUTES,
  INITIAL_STUDENTS,
  INITIAL_DRIVERS,
  INITIAL_HODS,
  INITIAL_DEPARTMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedData';

const STORAGE_KEY = 'campusride_v1_store';
const SESSION_KEY = 'campusride_v1_session';

export interface AppState {
  currentUser: User | null;
  buses: Bus[];
  routes: Route[];
  students: Student[];
  drivers: Driver[];
  hods: HOD[];
  departments: Department[];
  boardingRecords: BoardingRecord[];
  notifications: NotificationItem[];
  delayAlerts: DelayAlert[];
  emergencies: EmergencyEvent[];
  simulation: SimulationState;
}

const DEFAULT_SIMULATION: SimulationState = {
  isRunning: true,
  speedMultiplier: 1,
  activeBusId: 'BUS001', // KCG-07
  trafficSeverity: 'normal',
  simulatedDelayMinutes: 0,
  tripActive: true,
};

type Listener = (state: AppState) => void;

class CentralStore {
  private state: AppState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): AppState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const session = localStorage.getItem(SESSION_KEY);
      const currentUser = session ? JSON.parse(session) : null;

      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          currentUser: currentUser || parsed.currentUser || null,
          buses: parsed.buses || INITIAL_BUSES,
          routes: parsed.routes || INITIAL_ROUTES,
          students: parsed.students || INITIAL_STUDENTS,
          drivers: parsed.drivers || INITIAL_DRIVERS,
          hods: parsed.hods || INITIAL_HODS,
          departments: parsed.departments || INITIAL_DEPARTMENTS,
          boardingRecords: parsed.boardingRecords || [],
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          delayAlerts: parsed.delayAlerts || [],
          emergencies: parsed.emergencies || [],
          simulation: parsed.simulation || DEFAULT_SIMULATION,
        };
      }
    } catch (e) {
      console.warn('Failed to load from storage, using initial seed', e);
    }

    return {
      currentUser: null,
      buses: INITIAL_BUSES,
      routes: INITIAL_ROUTES,
      students: INITIAL_STUDENTS,
      drivers: INITIAL_DRIVERS,
      hods: INITIAL_HODS,
      departments: INITIAL_DEPARTMENTS,
      boardingRecords: [],
      notifications: INITIAL_NOTIFICATIONS,
      delayAlerts: [],
      emergencies: [],
      simulation: DEFAULT_SIMULATION,
    };
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      if (this.state.currentUser) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(this.state.currentUser));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in store listener', err);
      }
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Provide initial state immediately
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  public getState(): AppState {
    return this.state;
  }

  // --- Auth Methods ---
  public login(user: User): void {
    this.state = { ...this.state, currentUser: user };
    this.save();
  }

  public logout(): void {
    this.state = { ...this.state, currentUser: null };
    localStorage.removeItem(SESSION_KEY);
    this.save();
  }

  // --- Simulation Methods ---
  public updateSimulation(updates: Partial<SimulationState>): void {
    this.state = {
      ...this.state,
      simulation: {
        ...this.state.simulation,
        ...updates,
      },
    };
    this.save();
  }

  // --- Bus Methods ---
  public updateBus(busId: string, updates: Partial<Bus>): void {
    this.state = {
      ...this.state,
      buses: this.state.buses.map((b) => (b.busId === busId ? { ...b, ...updates } : b)),
    };
    this.save();
  }

  public addBus(newBus: Bus): void {
    this.state = {
      ...this.state,
      buses: [...this.state.buses, newBus],
    };
    this.save();
  }

  public deleteBus(busId: string): void {
    this.state = {
      ...this.state,
      buses: this.state.buses.filter((b) => b.busId !== busId),
    };
    this.save();
  }

  // --- Route Methods ---
  public updateRoute(routeId: string, updates: Partial<Route>): void {
    this.state = {
      ...this.state,
      routes: this.state.routes.map((r) => (r.routeId === routeId ? { ...r, ...updates } : r)),
    };
    this.save();
  }

  public addRoute(newRoute: Route): void {
    this.state = {
      ...this.state,
      routes: [...this.state.routes, newRoute],
    };
    this.save();
  }

  // --- Student Methods ---
  public updateStudent(studentId: string, updates: Partial<Student>): void {
    this.state = {
      ...this.state,
      students: this.state.students.map((s) => (s.studentId === studentId ? { ...s, ...updates } : s)),
    };
    this.save();
  }

  public addStudent(newStudent: Student): void {
    this.state = {
      ...this.state,
      students: [...this.state.students, newStudent],
    };
    this.save();
  }

  // --- Driver & HOD Methods ---
  public updateDriver(driverId: string, updates: Partial<Driver>): void {
    this.state = {
      ...this.state,
      drivers: this.state.drivers.map((d) => (d.driverId === driverId ? { ...d, ...updates } : d)),
    };
    this.save();
  }

  public updateHOD(hodId: string, updates: Partial<HOD>): void {
    this.state = {
      ...this.state,
      hods: this.state.hods.map((h) => (h.hodId === hodId ? { ...h, ...updates } : h)),
    };
    this.save();
  }

  // --- Boarding Methods ---
  public recordBoarding(studentId: string, busId: string, method: 'qr_scan' | 'manual_entry' = 'qr_scan'): {
    success: boolean;
    message: string;
    student?: Student;
    bus?: Bus;
  } {
    const student = this.state.students.find((s) => s.studentId === studentId);
    const bus = this.state.buses.find((b) => b.busId === busId);

    if (!student) {
      return { success: false, message: `Student ID "${studentId}" not found in college directory.` };
    }
    if (!bus) {
      return { success: false, message: `Bus not found.` };
    }
    if (student.busId !== busId) {
      const assignedBus = this.state.buses.find((b) => b.busId === student.busId);
      return {
        success: false,
        message: `Student ${student.name} is assigned to bus ${assignedBus?.busNumber || student.busId}, not ${bus.busNumber}!`,
      };
    }
    if (student.boardingStatus === 'boarded') {
      return {
        success: false,
        message: `Student ${student.name} (${student.studentId}) is already marked as boarded at ${student.boardingTime || 'earlier today'}.`,
        student,
        bus,
      };
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toISOString().split('T')[0];

    const newRecord: BoardingRecord = {
      boardingId: `BRD_${Date.now()}`,
      studentId: student.studentId,
      studentName: student.name,
      department: student.department,
      busId: bus.busId,
      busNumber: bus.busNumber,
      stopName: student.pickupStopName,
      date: dateString,
      boardingTime: timeString,
      method,
    };

    const updatedStudents = this.state.students.map((s) =>
      s.studentId === studentId
        ? { ...s, boardingStatus: 'boarded' as const, boardingTime: timeString }
        : s
    );

    const updatedBuses = this.state.buses.map((b) =>
      b.busId === busId ? { ...b, currentOccupancy: Math.min(b.capacity, b.currentOccupancy + 1) } : b
    );

    // Add confirmation notification to student
    const boardingNotif: NotificationItem = {
      notificationId: `NOTIF_BRD_${Date.now()}`,
      recipientRole: 'student',
      recipientId: student.studentId,
      busId: bus.busId,
      title: 'Boarding Confirmed',
      message: `You have successfully boarded bus ${bus.busNumber} at ${student.pickupStopName} at ${timeString}.`,
      timestamp: timeString,
      priority: 'normal',
      category: 'boarding',
      readStatus: false,
    };

    this.state = {
      ...this.state,
      students: updatedStudents,
      buses: updatedBuses,
      boardingRecords: [newRecord, ...this.state.boardingRecords],
      notifications: [boardingNotif, ...this.state.notifications],
    };
    this.save();

    return {
      success: true,
      message: `Boarding confirmed for ${student.name} (${student.department}) on ${bus.busNumber}`,
      student: { ...student, boardingStatus: 'boarded', boardingTime: timeString },
      bus: { ...bus, currentOccupancy: bus.currentOccupancy + 1 },
    };
  }

  // --- Notification Methods ---
  public addNotification(notification: NotificationItem): void {
    // Avoid duplicate notifications with same title and recipient within 1 minute
    const isDuplicate = this.state.notifications.some(
      (n) =>
        n.title === notification.title &&
        n.recipientRole === notification.recipientRole &&
        n.recipientId === notification.recipientId &&
        n.category === notification.category &&
        n.message === notification.message
    );

    if (isDuplicate) return;

    this.state = {
      ...this.state,
      notifications: [notification, ...this.state.notifications],
    };
    this.save();
  }

  public markNotificationRead(notificationId: string): void {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) =>
        n.notificationId === notificationId ? { ...n, readStatus: true } : n
      ),
    };
    this.save();
  }

  public markAllNotificationsRead(recipientId?: string, role?: string): void {
    this.state = {
      ...this.state,
      notifications: this.state.notifications.map((n) => {
        if (!role || n.recipientRole === 'all' || n.recipientRole === role) {
          if (!recipientId || !n.recipientId || n.recipientId === recipientId) {
            return { ...n, readStatus: true };
          }
        }
        return n;
      }),
    };
    this.save();
  }

  // --- Delay Alert Methods ---
  public addDelayAlert(alert: DelayAlert): void {
    // Replace active alert for the same bus if exists, or prepend
    const filtered = this.state.delayAlerts.filter(
      (a) => !(a.busId === alert.busId && a.status === 'active')
    );
    this.state = {
      ...this.state,
      delayAlerts: [alert, ...filtered],
    };
    this.save();
  }

  public acknowledgeDelayAlert(alertId: string, acknowledgedBy: string): void {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state = {
      ...this.state,
      delayAlerts: this.state.delayAlerts.map((a) =>
        a.alertId === alertId
          ? {
              ...a,
              status: 'acknowledged' as const,
              acknowledgedBy,
              acknowledgedAt: now,
            }
          : a
      ),
    };
    this.save();
  }

  // --- Emergency Methods ---
  public createEmergency(emergency: EmergencyEvent): void {
    this.state = {
      ...this.state,
      emergencies: [emergency, ...this.state.emergencies],
      buses: this.state.buses.map((b) =>
        b.busId === emergency.busId ? { ...b, status: 'emergency' as const } : b
      ),
    };
    this.save();
  }

  public resolveEmergency(eventId: string): void {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = this.state.emergencies.find((e) => e.eventId === eventId);
    this.state = {
      ...this.state,
      emergencies: this.state.emergencies.map((e) =>
        e.eventId === eventId ? { ...e, status: 'resolved' as const, resolvedAt: now } : e
      ),
      buses: target
        ? this.state.buses.map((b) =>
            b.busId === target.busId ? { ...b, status: 'on_time' as const } : b
          )
        : this.state.buses,
    };
    this.save();
  }

  // --- Reset to Initial Data ---
  public resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEY);
    const session = localStorage.getItem(SESSION_KEY);
    const currentUser = session ? JSON.parse(session) : null;
    this.state = {
      currentUser,
      buses: INITIAL_BUSES,
      routes: INITIAL_ROUTES,
      students: INITIAL_STUDENTS,
      drivers: INITIAL_DRIVERS,
      hods: INITIAL_HODS,
      departments: INITIAL_DEPARTMENTS,
      boardingRecords: [],
      notifications: INITIAL_NOTIFICATIONS,
      delayAlerts: [],
      emergencies: [],
      simulation: DEFAULT_SIMULATION,
    };
    this.save();
  }
}

export const store = new CentralStore();
