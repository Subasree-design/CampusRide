import { Route, Bus, Driver, HOD, Department, Student, NotificationItem, DelayAlert } from '../types';

export const INITIAL_HODS: HOD[] = [
  {
    hodId: 'HOD001',
    name: 'Dr. J. Collins',
    department: 'CSE',
    email: 'hod.cse@kcgcollege.com',
    phone: '+91 94441 23451',
    cabin: 'Aero-Block Room 204',
  },
  {
    hodId: 'HOD002',
    name: 'Dr. P. Deiva Sundari',
    department: 'ECE',
    email: 'hod.ece@kcgcollege.com',
    phone: '+91 94441 23452',
    cabin: 'Electronics Block Room 102',
  },
  {
    hodId: 'HOD003',
    name: 'Dr. R. Anand',
    department: 'IT',
    email: 'hod.it@kcgcollege.com',
    phone: '+91 94441 23453',
    cabin: 'IT Tower Room 301',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    departmentId: 'DEP-CSE',
    departmentName: 'Computer Science & Engineering',
    code: 'CSE',
    hodId: 'HOD001',
  },
  {
    departmentId: 'DEP-ECE',
    departmentName: 'Electronics & Communication Engineering',
    code: 'ECE',
    hodId: 'HOD002',
  },
  {
    departmentId: 'DEP-IT',
    departmentName: 'Information Technology',
    code: 'IT',
    hodId: 'HOD003',
  },
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    driverId: 'DRV001',
    name: 'Ravi Kumar',
    phone: '+91 98401 54321',
    busId: 'BUS001', // KCG-07
    licenseNumber: 'TN-07-2015-004312',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  },
  {
    driverId: 'DRV002',
    name: 'M. Selvam',
    phone: '+91 98402 65432',
    busId: 'BUS002', // KCG-04
    licenseNumber: 'TN-09-2012-009823',
    rating: 4.6,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    driverId: 'DRV003',
    name: 'K. Saravanan',
    phone: '+91 98403 76543',
    busId: 'BUS003', // KCG-12
    licenseNumber: 'TN-12-2017-001290',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    driverId: 'DRV004',
    name: 'T. Murugan',
    phone: '+91 98404 87654',
    busId: 'BUS004', // KCG-15
    licenseNumber: 'TN-14-2016-004921',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    driverId: 'DRV005',
    name: 'S. Suresh',
    phone: '+91 98405 98765',
    busId: 'BUS005', // KCG-21
    licenseNumber: 'TN-19-2019-007621',
    rating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_ROUTES: Route[] = [
  {
    routeId: 'RT001',
    routeName: 'Route 7: Guduvanchery - Tambaram - KCG College',
    origin: 'Guduvanchery',
    destination: 'KCG College of Technology, Karapakkam',
    distanceKm: 32.4,
    expectedDurationMin: 65,
    stops: [
      {
        stopId: 'STP001',
        routeId: 'RT001',
        name: 'Guduvanchery Bus Stand',
        latitude: 12.8466,
        longitude: 80.0620,
        scheduledTime: '07:15 AM',
        estimatedTime: '07:15 AM',
        sequence: 1,
        status: 'reached',
      },
      {
        stopId: 'STP002',
        routeId: 'RT001',
        name: 'Urapakkam Junction',
        latitude: 12.8672,
        longitude: 80.0768,
        scheduledTime: '07:25 AM',
        estimatedTime: '07:25 AM',
        sequence: 2,
        status: 'reached',
      },
      {
        stopId: 'STP003',
        routeId: 'RT001',
        name: 'Vandalur Zoo Gate',
        latitude: 12.8906,
        longitude: 80.0815,
        scheduledTime: '07:35 AM',
        estimatedTime: '07:35 AM',
        sequence: 3,
        status: 'reached',
      },
      {
        stopId: 'STP004',
        routeId: 'RT001',
        name: 'Perungalathur Bypass',
        latitude: 12.9056,
        longitude: 80.0984,
        scheduledTime: '07:45 AM',
        estimatedTime: '07:45 AM',
        sequence: 4,
        status: 'approaching',
      },
      {
        stopId: 'STP005',
        routeId: 'RT001',
        name: 'Tambaram Railway Station (East)',
        latitude: 12.9249,
        longitude: 80.1245,
        scheduledTime: '08:00 AM',
        estimatedTime: '08:00 AM',
        sequence: 5,
        status: 'upcoming',
      },
      {
        stopId: 'STP006',
        routeId: 'RT001',
        name: 'Medavakkam Koot Road',
        latitude: 12.9198,
        longitude: 80.1873,
        scheduledTime: '08:15 AM',
        estimatedTime: '08:15 AM',
        sequence: 6,
        status: 'upcoming',
      },
      {
        stopId: 'STP007',
        routeId: 'RT001',
        name: 'Sholinganallur Junction',
        latitude: 12.9010,
        longitude: 80.2279,
        scheduledTime: '08:25 AM',
        estimatedTime: '08:25 AM',
        sequence: 7,
        status: 'upcoming',
      },
      {
        stopId: 'STP008',
        routeId: 'RT001',
        name: 'KCG College of Technology, Karapakkam (Campus)',
        latitude: 12.9172,
        longitude: 80.2285,
        scheduledTime: '08:30 AM',
        estimatedTime: '08:30 AM',
        sequence: 8,
        status: 'upcoming',
      },
    ],
    pathCoordinates: [
      [12.8466, 80.0620],
      [12.8550, 80.0690],
      [12.8672, 80.0768],
      [12.8780, 80.0790],
      [12.8906, 80.0815],
      [12.8980, 80.0900],
      [12.9056, 80.0984],
      [12.9150, 80.1100],
      [12.9249, 80.1245],
      [12.9220, 80.1500],
      [12.9198, 80.1873],
      [12.9100, 80.2100],
      [12.9010, 80.2279],
      [12.9120, 80.2282],
      [12.9172, 80.2285],
    ],
  },
  {
    routeId: 'RT002',
    routeName: 'Route 4: Guindy - Velachery - KCG College',
    origin: 'Guindy Kathipara',
    destination: 'KCG College of Technology, Karapakkam',
    distanceKm: 21.5,
    expectedDurationMin: 45,
    stops: [
      {
        stopId: 'STP010',
        routeId: 'RT002',
        name: 'Guindy Kathipara Junction',
        latitude: 13.0067,
        longitude: 80.2033,
        scheduledTime: '07:30 AM',
        estimatedTime: '07:30 AM',
        sequence: 1,
        status: 'reached',
      },
      {
        stopId: 'STP011',
        routeId: 'RT002',
        name: 'Velachery Vijayanagar',
        latitude: 12.9784,
        longitude: 80.2212,
        scheduledTime: '07:50 AM',
        estimatedTime: '07:50 AM',
        sequence: 2,
        status: 'approaching',
      },
      {
        stopId: 'STP012',
        routeId: 'RT002',
        name: 'Thoraipakkam OMR Toll',
        latitude: 12.9382,
        longitude: 80.2366,
        scheduledTime: '08:15 AM',
        estimatedTime: '08:15 AM',
        sequence: 3,
        status: 'upcoming',
      },
      {
        stopId: 'STP013',
        routeId: 'RT002',
        name: 'KCG College Campus Gate',
        latitude: 12.9172,
        longitude: 80.2285,
        scheduledTime: '08:30 AM',
        estimatedTime: '08:30 AM',
        sequence: 4,
        status: 'upcoming',
      },
    ],
    pathCoordinates: [
      [13.0067, 80.2033],
      [12.9900, 80.2120],
      [12.9784, 80.2212],
      [12.9550, 80.2310],
      [12.9382, 80.2366],
      [12.9250, 80.2320],
      [12.9172, 80.2285],
    ],
  },
  {
    routeId: 'RT003',
    routeName: 'Route 12: Koyambedu - Porur - KCG College',
    origin: 'Koyambedu CMBT',
    destination: 'KCG College of Technology, Karapakkam',
    distanceKm: 28.0,
    expectedDurationMin: 55,
    stops: [
      {
        stopId: 'STP020',
        routeId: 'RT003',
        name: 'Koyambedu CMBT',
        latitude: 13.0694,
        longitude: 80.1948,
        scheduledTime: '07:20 AM',
        estimatedTime: '07:20 AM',
        sequence: 1,
        status: 'reached',
      },
      {
        stopId: 'STP021',
        routeId: 'RT003',
        name: 'Porur Roundtana',
        latitude: 13.0382,
        longitude: 80.1565,
        scheduledTime: '07:45 AM',
        estimatedTime: '07:45 AM',
        sequence: 2,
        status: 'approaching',
      },
      {
        stopId: 'STP022',
        routeId: 'RT003',
        name: 'KCG College Campus Gate',
        latitude: 12.9172,
        longitude: 80.2285,
        scheduledTime: '08:30 AM',
        estimatedTime: '08:30 AM',
        sequence: 3,
        status: 'upcoming',
      },
    ],
    pathCoordinates: [
      [13.0694, 80.1948],
      [13.0382, 80.1565],
      [12.9900, 80.1800],
      [12.9400, 80.2100],
      [12.9172, 80.2285],
    ],
  },
];

export const INITIAL_BUSES: Bus[] = [
  {
    busId: 'BUS001',
    busNumber: 'KCG-07',
    plateNumber: 'TN 19 KCG 0007',
    driverId: 'DRV001', // Ravi Kumar
    routeId: 'RT001',
    capacity: 45,
    currentOccupancy: 12,
    currentLocation: {
      latitude: 12.9120, // Between Perungalathur and Tambaram
      longitude: 80.1060,
      heading: 42,
      address: 'Near Perungalathur Bypass, GST Road, Chennai',
    },
    currentSpeed: 38,
    status: 'approaching',
    expectedETA: '08:30 AM',
    currentETA: '08:30 AM',
    delayMinutes: 0,
    currentStopIndex: 3, // Passed Vandalur, heading to Perungalathur/Tambaram
    distanceToNextStopMeters: 1400,
    trafficCondition: 'light',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    busId: 'BUS002',
    busNumber: 'KCG-04',
    plateNumber: 'TN 19 KCG 0004',
    driverId: 'DRV002', // M. Selvam
    routeId: 'RT002',
    capacity: 45,
    currentOccupancy: 24,
    currentLocation: {
      latitude: 12.9650,
      longitude: 80.2280,
      heading: 170,
      address: 'Near Velachery 100ft Road',
    },
    currentSpeed: 32,
    status: 'on_time',
    expectedETA: '08:30 AM',
    currentETA: '08:30 AM',
    delayMinutes: 0,
    currentStopIndex: 1,
    distanceToNextStopMeters: 2100,
    trafficCondition: 'moderate',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    busId: 'BUS003',
    busNumber: 'KCG-12',
    plateNumber: 'TN 19 KCG 0012',
    driverId: 'DRV003', // K. Saravanan
    routeId: 'RT003',
    capacity: 50,
    currentOccupancy: 31,
    currentLocation: {
      latitude: 13.0100,
      longitude: 80.1700,
      heading: 145,
      address: 'Near Porur Toll Plaza',
    },
    currentSpeed: 42,
    status: 'on_time',
    expectedETA: '08:30 AM',
    currentETA: '08:30 AM',
    delayMinutes: 0,
    currentStopIndex: 1,
    distanceToNextStopMeters: 4500,
    trafficCondition: 'light',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    busId: 'BUS004',
    busNumber: 'KCG-15',
    plateNumber: 'TN 19 KCG 0015',
    driverId: 'DRV004', // T. Murugan
    routeId: 'RT001',
    capacity: 50,
    currentOccupancy: 18,
    currentLocation: {
      latitude: 12.8750,
      longitude: 80.0780,
      heading: 30,
      address: 'Near Urapakkam Flyover',
    },
    currentSpeed: 40,
    status: 'on_time',
    expectedETA: '08:35 AM',
    currentETA: '08:35 AM',
    delayMinutes: 0,
    currentStopIndex: 1,
    distanceToNextStopMeters: 3000,
    trafficCondition: 'light',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  {
    busId: 'BUS005',
    busNumber: 'KCG-21',
    plateNumber: 'TN 19 KCG 0021',
    driverId: 'DRV005', // S. Suresh
    routeId: 'RT002',
    capacity: 40,
    currentOccupancy: 22,
    currentLocation: {
      latitude: 12.9850,
      longitude: 80.2180,
      heading: 160,
      address: 'Near Guindy Industrial Estate',
    },
    currentSpeed: 25,
    status: 'on_time',
    expectedETA: '08:40 AM',
    currentETA: '08:40 AM',
    delayMinutes: 0,
    currentStopIndex: 0,
    distanceToNextStopMeters: 1800,
    trafficCondition: 'moderate',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

// Generate 50 realistic students
// Bus KCG-07 has exactly 35 students: 18 CSE, 10 ECE, 7 IT!
export const generateInitialStudents = (): Student[] => {
  const students: Student[] = [];

  // STU001 - Subasree (Demo Student)
  students.push({
    studentId: 'STU001',
    name: 'Subasree G',
    department: 'CSE',
    year: 'III Year - B.E CSE',
    email: 'subasreegopi@gmail.com',
    phone: '+91 98765 43210',
    parentPhone: '+91 98765 00001',
    busId: 'BUS001', // KCG-07
    routeId: 'RT001',
    pickupStopId: 'STP005', // Tambaram
    pickupStopName: 'Tambaram Railway Station (East)',
    boardingStatus: 'not_boarded',
    passValidUntil: '31 May 2027',
    passToken: 'KCG-BUS-STU001-CSE-2027',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // Remaining 17 CSE students for Bus KCG-07 (total 18 CSE on KCG-07)
  const cseNames = [
    'Aditya Ramanathan', 'Aishwarya Nair', 'Bala Murugan', 'Deepak Chandran',
    'Divya Srikanth', 'Gowtham V', 'Harish Babu', 'Keerthana M',
    'Karthik Sundar', 'Lavanya S', 'Manoj Kumar', 'Naveen Raj',
    'Pooja Venkatesh', 'Rahul Sharma', 'Sneha Parthiban', 'Vigneshwaran K',
    'Yogeshwaran S'
  ];

  cseNames.forEach((name, i) => {
    const idNum = String(i + 2).padStart(3, '0');
    students.push({
      studentId: `STU${idNum}`,
      name,
      department: 'CSE',
      year: i % 2 === 0 ? 'III Year' : 'IV Year',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@kcgcollege.com`,
      phone: `+91 98765 ${40000 + i}`,
      parentPhone: `+91 94441 ${40000 + i}`,
      busId: 'BUS001', // KCG-07
      routeId: 'RT001',
      pickupStopId: i < 5 ? 'STP001' : i < 10 ? 'STP003' : 'STP005',
      pickupStopName: i < 5 ? 'Guduvanchery Bus Stand' : i < 10 ? 'Vandalur Zoo Gate' : 'Tambaram Railway Station (East)',
      boardingStatus: i < 4 ? 'boarded' : 'not_boarded',
      boardingTime: i < 4 ? '07:22 AM' : undefined,
      passValidUntil: '31 May 2027',
      passToken: `KCG-BUS-STU${idNum}-CSE-2027`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  });

  // 10 ECE students for Bus KCG-07
  const eceNames = [
    'Ananya Krishnan', 'Dharun Teja', 'Gayathri R', 'Kavitha Devi',
    'Madhan Mohan', 'Pavithra S', 'Pradeep Kumar', 'Sai Vignesh',
    'Shalini M', 'Surya Prakash'
  ];

  eceNames.forEach((name, i) => {
    const idNum = String(i + 19).padStart(3, '0');
    students.push({
      studentId: `STU${idNum}`,
      name,
      department: 'ECE',
      year: 'II Year',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@kcgcollege.com`,
      phone: `+91 98765 ${50000 + i}`,
      parentPhone: `+91 94441 ${50000 + i}`,
      busId: 'BUS001', // KCG-07
      routeId: 'RT001',
      pickupStopId: i < 4 ? 'STP002' : i < 7 ? 'STP004' : 'STP005',
      pickupStopName: i < 4 ? 'Urapakkam Junction' : i < 7 ? 'Perungalathur Bypass' : 'Tambaram Railway Station (East)',
      boardingStatus: i < 3 ? 'boarded' : 'not_boarded',
      boardingTime: i < 3 ? '07:30 AM' : undefined,
      passValidUntil: '31 May 2028',
      passToken: `KCG-BUS-STU${idNum}-ECE-2028`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  });

  // 7 IT students for Bus KCG-07
  const itNames = [
    'Akash Varun', 'Charulatha K', 'Dinesh Karthik', 'Janani Priya',
    'Monish Raj', 'Sandhya Raman', 'Vijay Anand'
  ];

  itNames.forEach((name, i) => {
    const idNum = String(i + 29).padStart(3, '0');
    students.push({
      studentId: `STU${idNum}`,
      name,
      department: 'IT',
      year: 'III Year',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@kcgcollege.com`,
      phone: `+91 98765 ${60000 + i}`,
      parentPhone: `+91 94441 ${60000 + i}`,
      busId: 'BUS001', // KCG-07
      routeId: 'RT001',
      pickupStopId: i < 3 ? 'STP003' : 'STP005',
      pickupStopName: i < 3 ? 'Vandalur Zoo Gate' : 'Tambaram Railway Station (East)',
      boardingStatus: i < 2 ? 'boarded' : 'not_boarded',
      boardingTime: i < 2 ? '07:38 AM' : undefined,
      passValidUntil: '31 May 2027',
      passToken: `KCG-BUS-STU${idNum}-IT-2027`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  });

  // Additional students for other buses (Bus KCG-04, Bus KCG-12, etc.) to reach 50+
  const otherStudents = [
    { name: 'Arjun Das', dept: 'CSE', bus: 'BUS002', route: 'RT002', stop: 'STP010' },
    { name: 'Bhavani Shankar', dept: 'ECE', bus: 'BUS002', route: 'RT002', stop: 'STP011' },
    { name: 'Chethana R', dept: 'IT', bus: 'BUS002', route: 'RT002', stop: 'STP011' },
    { name: 'Darshan G', dept: 'CSE', bus: 'BUS002', route: 'RT002', stop: 'STP012' },
    { name: 'Ezhil Nilavan', dept: 'ECE', bus: 'BUS003', route: 'RT003', stop: 'STP020' },
    { name: 'Farhana Banu', dept: 'IT', bus: 'BUS003', route: 'RT003', stop: 'STP021' },
    { name: 'Gokul Krishna', dept: 'CSE', bus: 'BUS003', route: 'RT003', stop: 'STP021' },
    { name: 'Hemalatha K', dept: 'ECE', bus: 'BUS003', route: 'RT003', stop: 'STP020' },
    { name: 'Ishwarya Lakshmi', dept: 'IT', bus: 'BUS004', route: 'RT001', stop: 'STP001' },
    { name: 'Jayanth Balaji', dept: 'CSE', bus: 'BUS004', route: 'RT001', stop: 'STP002' },
    { name: 'Keerthi Vasan', dept: 'ECE', bus: 'BUS005', route: 'RT002', stop: 'STP010' },
    { name: 'Logesh Kannan', dept: 'IT', bus: 'BUS005', route: 'RT002', stop: 'STP011' },
    { name: 'Meghana Reddy', dept: 'CSE', bus: 'BUS005', route: 'RT002', stop: 'STP012' },
    { name: 'Nikhil Rajan', dept: 'ECE', bus: 'BUS004', route: 'RT001', stop: 'STP003' },
    { name: 'Oviya Devi', dept: 'IT', bus: 'BUS004', route: 'RT001', stop: 'STP004' },
  ];

  otherStudents.forEach((item, i) => {
    const idNum = String(i + 36).padStart(3, '0');
    students.push({
      studentId: `STU${idNum}`,
      name: item.name,
      department: item.dept as 'CSE' | 'ECE' | 'IT',
      year: 'III Year',
      email: `${item.name.toLowerCase().replace(/[^a-z]/g, '')}@kcgcollege.com`,
      phone: `+91 98765 ${70000 + i}`,
      parentPhone: `+91 94441 ${70000 + i}`,
      busId: item.bus,
      routeId: item.route,
      pickupStopId: item.stop,
      pickupStopName: item.stop === 'STP010' ? 'Guindy Kathipara' : item.stop === 'STP011' ? 'Velachery Vijayanagar' : 'Porur Roundtana',
      boardingStatus: i % 2 === 0 ? 'boarded' : 'not_boarded',
      boardingTime: i % 2 === 0 ? '07:42 AM' : undefined,
      passValidUntil: '31 May 2027',
      passToken: `KCG-BUS-STU${idNum}-${item.dept}-2027`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`,
    });
  });

  return students;
};

export const INITIAL_STUDENTS = generateInitialStudents();

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notificationId: 'NOTIF001',
    recipientRole: 'all',
    title: 'Morning Transportation Service Active',
    message: 'All college buses are operating on regular scheduled routes for KCG College of Technology today.',
    timestamp: '07:00 AM',
    priority: 'low',
    category: 'announcement',
    readStatus: true,
  },
  {
    notificationId: 'NOTIF002',
    recipientRole: 'student',
    recipientId: 'STU001',
    busId: 'BUS001',
    title: 'Trip Commenced: KCG-07',
    message: 'Driver Ravi Kumar has commenced trip on Route 7 (Guduvanchery to KCG Campus).',
    timestamp: '07:15 AM',
    priority: 'normal',
    category: 'route',
    readStatus: true,
  },
];
