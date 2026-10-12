export type UserRole = 'student' | 'driver' | 'hod' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string; // For HOD & Student: 'CSE' | 'ECE' | 'IT'
  busId?: string; // For Student & Driver
  pickupStopId?: string; // For Student
  avatar?: string;
}

export interface Stop {
  stopId: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
  scheduledTime: string; // e.g. "07:30 AM"
  estimatedTime: string;
  sequence: number;
  status: 'upcoming' | 'approaching' | 'reached' | 'delayed';
}

export interface Route {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  expectedDurationMin: number;
  stops: Stop[];
  pathCoordinates: [number, number][]; // [lat, lng] array for route polyline
}

export type BusStatus = 'on_time' | 'approaching' | 'delayed' | 'breakdown' | 'emergency' | 'completed' | 'idle';

export interface Bus {
  busId: string;
  busNumber: string;
  plateNumber: string;
  driverId: string;
  routeId: string;
  capacity: number;
  currentOccupancy: number;
  currentLocation: {
    latitude: number;
    longitude: number;
    heading: number;
    address: string;
  };
  currentSpeed: number; // km/h
  status: BusStatus;
  expectedETA: string; // e.g. "08:30 AM"
  currentETA: string;
  delayMinutes: number;
  currentStopIndex: number; // Index in route.stops
  distanceToNextStopMeters: number;
  trafficCondition: 'light' | 'moderate' | 'heavy' | 'severe';
  lastUpdated: string;
}

export interface Driver {
  driverId: string;
  name: string;
  phone: string;
  busId: string;
  licenseNumber: string;
  rating: number;
  avatar: string;
}

export interface Department {
  departmentId: string;
  departmentName: string;
  code: 'CSE' | 'ECE' | 'IT';
  hodId: string;
}

export interface HOD {
  hodId: string;
  name: string;
  department: 'CSE' | 'ECE' | 'IT';
  email: string;
  phone: string;
  cabin: string;
}

export interface Student {
  studentId: string;
  name: string;
  department: 'CSE' | 'ECE' | 'IT';
  year: string;
  email: string;
  phone: string;
  parentPhone: string;
  busId: string;
  routeId: string;
  pickupStopId: string;
  pickupStopName: string;
  boardingStatus: 'not_boarded' | 'boarded';
  boardingTime?: string;
  passValidUntil: string;
  passToken: string;
  avatar: string;
}

export interface BoardingRecord {
  boardingId: string;
  studentId: string;
  studentName: string;
  department: string;
  busId: string;
  busNumber: string;
  stopName: string;
  date: string;
  boardingTime: string;
  method: 'qr_scan' | 'manual_entry';
}

export type NotificationCategory = 
  | 'proximity' 
  | 'delay' 
  | 'breakdown' 
  | 'emergency' 
  | 'boarding' 
  | 'announcement' 
  | 'route';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationItem {
  notificationId: string;
  recipientRole: UserRole | 'all';
  recipientId?: string; // studentId, hodId, driverId, or undefined for role-wide
  busId?: string;
  title: string;
  message: string;
  timestamp: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  readStatus: boolean;
  relatedEventId?: string;
  metadata?: {
    delayMinutes?: number;
    affectedStudentCount?: number;
    department?: string;
    stopName?: string;
    currentETA?: string;
  };
}

export interface DelayAlert {
  alertId: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  expectedETA: string;
  currentETA: string;
  delayMinutes: number;
  affectedStudentIds: string[];
  affectedDepartments: {
    department: 'CSE' | 'ECE' | 'IT';
    studentCount: number;
    hodId: string;
    hodNotified: boolean;
    notificationTimestamp?: string;
  }[];
  adminNotified: boolean;
  reason: string;
  priority: 'moderate' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface EmergencyEvent {
  eventId: string;
  busId: string;
  busNumber: string;
  routeId: string;
  reportedByRole: UserRole;
  reportedByName: string;
  reportedById: string;
  reason: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  priority: 'urgent';
  affectedDepartments: string[];
  recipientsNotified: string[];
  status: 'active' | 'responding' | 'resolved';
  resolvedAt?: string;
}

export interface SimulationState {
  isRunning: boolean;
  speedMultiplier: number; // 1, 2, 5, 10
  activeBusId: string;
  trafficSeverity: 'normal' | 'moderate' | 'heavy' | 'severe';
  simulatedDelayMinutes: number;
  tripActive: boolean;
}
