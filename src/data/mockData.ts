// Mock Users
export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fleetgov.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@fleetgov.com',
    password: 'manager123',
    role: 'manager',
  },
  {
    id: '3',
    name: 'Driver User',
    email: 'driver@fleetgov.com',
    password: 'driver123',
    role: 'driver',
  }
];

// Mock Vehicles
export const mockVehicles = [
  {
    id: '1',
    plateNumber: 'AB-1234',
    type: 'sedan',
    model: 'Toyota Camry',
    year: 2022,
    color: 'White',
    vin: 'JT2BF12K1W0123456',
    status: 'active',
    fuelType: 'gasoline',
    currentMileage: 15420,
    assignedDriver: '3',
    lastServiceDate: '2023-08-15',
    nextServiceDue: '2023-11-15',
    registrationExpiry: '2024-05-10',
    insuranceExpiry: '2024-02-28',
    lastLocation: { lat: 24.4539, lng: 54.3773 },
    departmentId: '1',
  },
  {
    id: '2',
    plateNumber: 'CD-5678',
    type: 'SUV',
    model: 'Nissan Patrol',
    year: 2021,
    color: 'Black',
    vin: '5N1AT2M1XFC123456',
    status: 'maintenance',
    fuelType: 'gasoline',
    currentMileage: 32150,
    assignedDriver: null,
    lastServiceDate: '2023-09-20',
    nextServiceDue: '2023-12-20',
    registrationExpiry: '2024-04-15',
    insuranceExpiry: '2024-03-10',
    lastLocation: { lat: 24.4225, lng: 54.4418 },
    departmentId: '2',
  },
  {
    id: '3',
    plateNumber: 'EF-9012',
    type: 'bus',
    model: 'Toyota Coaster',
    year: 2020,
    color: 'White',
    vin: 'JTGFB518X01234567',
    status: 'active',
    fuelType: 'diesel',
    currentMileage: 45780,
    assignedDriver: '4',
    lastServiceDate: '2023-07-05',
    nextServiceDue: '2023-10-05',
    registrationExpiry: '2024-06-22',
    insuranceExpiry: '2024-05-15',
    lastLocation: { lat: 24.4625, lng: 54.3612 },
    departmentId: '3',
  },
  {
    id: '4',
    plateNumber: 'GH-3456',
    type: 'sedan',
    model: 'Honda Accord',
    year: 2021,
    color: 'Silver',
    vin: '1HGCV1F34MA123456',
    status: 'inactive',
    fuelType: 'gasoline',
    currentMileage: 12890,
    assignedDriver: null,
    lastServiceDate: '2023-08-30',
    nextServiceDue: '2023-11-30',
    registrationExpiry: '2024-07-18',
    insuranceExpiry: '2024-06-05',
    lastLocation: { lat: 24.4309, lng: 54.4375 },
    departmentId: '1',
  },
  {
    id: '5',
    plateNumber: 'IJ-7890',
    type: 'sedan',
    model: 'Lexus ES',
    year: 2022,
    color: 'Black',
    vin: 'JTHBK1GG7D2123456',
    status: 'active',
    fuelType: 'gasoline',
    currentMileage: 8750,
    assignedDriver: '5',
    lastServiceDate: '2023-09-10',
    nextServiceDue: '2023-12-10',
    registrationExpiry: '2024-08-25',
    insuranceExpiry: '2024-07-20',
    lastLocation: { lat: 24.4698, lng: 54.3578 },
    departmentId: '2',
  }
];

// Mock Drivers
export const mockDrivers = [
  {
    id: '3',
    name: 'Mohammed Ahmed',
    licenseNumber: 'DL123456',
    licenseExpiry: '2024-06-15',
    contactNumber: '+9715012345678',
    email: 'driver@fleetgov.com',
    status: 'active',
    assignedVehicleId: '1',
    departmentId: '1',
    profileImage: null,
    hireDate: '2020-03-15',
    emergencyContact: {
      name: 'Ali Ahmed',
      relationship: 'Brother',
      phone: '+9715087654321'
    },
    rating: 4.8,
    violations: 0,
    trips: ['1', '3', '5']
  },
  {
    id: '4',
    name: 'Abdullah Khalid',
    licenseNumber: 'DL654321',
    licenseExpiry: '2025-02-28',
    contactNumber: '+9715023456789',
    email: 'abdullah@fleetgov.com',
    status: 'active',
    assignedVehicleId: '3',
    departmentId: '3',
    profileImage: null,
    hireDate: '2019-08-10',
    emergencyContact: {
      name: 'Khalid Abdullah',
      relationship: 'Father',
      phone: '+9715098765432'
    },
    rating: 4.5,
    violations: 1,
    trips: ['2', '6']
  },
  {
    id: '5',
    name: 'Sara Mohammed',
    licenseNumber: 'DL789012',
    licenseExpiry: '2024-08-20',
    contactNumber: '+9715034567890',
    email: 'sara@fleetgov.com',
    status: 'active',
    assignedVehicleId: '5',
    departmentId: '2',
    profileImage: null,
    hireDate: '2021-05-20',
    emergencyContact: {
      name: 'Fatima Mohammed',
      relationship: 'Sister',
      phone: '+9715045678901'
    },
    rating: 4.9,
    violations: 0,
    trips: ['4', '7']
  }
];

// Mock Trips
export const mockTrips = [
  {
    id: '1',
    vehicleId: '1',
    driverId: '3',
    startTime: '2023-09-15T08:00:00',
    endTime: '2023-09-15T10:30:00',
    startLocation: 'Government HQ',
    endLocation: 'Abu Dhabi Airport',
    status: 'completed',
    distance: 35.2,
    purpose: 'Official Transport',
    fuelConsumed: 2.8,
    notes: 'VIP transport to airport',
    departmentId: '1',
    passengers: 2
  },
  {
    id: '2',
    vehicleId: '3',
    driverId: '4',
    startTime: '2023-09-16T09:00:00',
    endTime: '2023-09-16T15:00:00',
    startLocation: 'Government Campus',
    endLocation: 'Government Campus',
    status: 'completed',
    distance: 120.5,
    purpose: 'Employee Transport',
    fuelConsumed: 12.5,
    notes: 'Morning and evening staff shuttle',
    departmentId: '3',
    passengers: 15
  },
  {
    id: '3',
    vehicleId: '1',
    driverId: '3',
    startTime: '2023-09-17T13:00:00',
    endTime: '2023-09-17T14:30:00',
    startLocation: 'Government HQ',
    endLocation: 'Ministry of Finance',
    status: 'completed',
    distance: 15.7,
    purpose: 'Official Meeting',
    fuelConsumed: 1.2,
    notes: 'Director transport for budget meeting',
    departmentId: '1',
    passengers: 1
  },
  {
    id: '4',
    vehicleId: '5',
    driverId: '5',
    startTime: '2023-09-18T10:00:00',
    endTime: '2023-09-18T16:00:00',
    startLocation: 'Government HQ',
    endLocation: 'Dubai Office',
    status: 'completed',
    distance: 140.2,
    purpose: 'Inter-office Transport',
    fuelConsumed: 10.8,
    notes: 'Document delivery and staff transport',
    departmentId: '2',
    passengers: 3
  },
  {
    id: '5',
    vehicleId: '1',
    driverId: '3',
    startTime: '2023-09-19T09:00:00',
    endTime: '2023-09-19T11:30:00',
    startLocation: 'Government HQ',
    endLocation: 'Yas Island Conference Center',
    status: 'completed',
    distance: 28.3,
    purpose: 'Conference',
    fuelConsumed: 2.2,
    notes: 'Transport for annual government conference',
    departmentId: '1',
    passengers: 2
  },
  {
    id: '6',
    vehicleId: '3',
    driverId: '4',
    startTime: '2023-09-20T08:00:00',
    endTime: '2023-09-20T17:00:00',
    startLocation: 'Government Campus',
    endLocation: 'Government Campus',
    status: 'completed',
    distance: 145.8,
    purpose: 'Employee Transport',
    fuelConsumed: 15.0,
    notes: 'Full day staff shuttle service',
    departmentId: '3',
    passengers: 22
  },
  {
    id: '7',
    vehicleId: '5',
    driverId: '5',
    startTime: '2023-09-21T14:00:00',
    endTime: null,
    startLocation: 'Government HQ',
    endLocation: null,
    status: 'in-progress',
    distance: null,
    purpose: 'Official Meeting',
    fuelConsumed: null,
    notes: 'Director transport for external meeting',
    departmentId: '2',
    passengers: 1
  },
  {
    id: '8',
    vehicleId: '1',
    driverId: null,
    startTime: '2023-09-25T09:00:00',
    endTime: null,
    startLocation: 'Government HQ',
    endLocation: 'Abu Dhabi Airport',
    status: 'scheduled',
    distance: null,
    purpose: 'Airport Pickup',
    fuelConsumed: null,
    notes: 'International delegation pickup',
    departmentId: '1',
    passengers: 3
  }
];

// Mock Maintenance Records
export const mockMaintenanceRecords = [
  {
    id: '1',
    vehicleId: '1',
    maintenanceType: 'routine',
    serviceDate: '2023-08-15',
    description: 'Oil change, filter replacement, general inspection',
    cost: 450,
    serviceCenterId: '1',
    status: 'completed',
    nextServiceDue: '2023-11-15',
    notes: 'Vehicle in good condition, next oil change at 20,000 km',
    mileage: 15000
  },
  {
    id: '2',
    vehicleId: '2',
    maintenanceType: 'repair',
    serviceDate: '2023-09-20',
    description: 'Brake system repair, replaced front brake pads',
    cost: 850,
    serviceCenterId: '2',
    status: 'completed',
    nextServiceDue: '2023-12-20',
    notes: 'Brake fluid also changed, vehicle now in good condition',
    mileage: 32000
  },
  {
    id: '3',
    vehicleId: '3',
    maintenanceType: 'routine',
    serviceDate: '2023-07-05',
    description: 'Major service including engine tune-up and all filters',
    cost: 1200,
    serviceCenterId: '1',
    status: 'completed',
    nextServiceDue: '2023-10-05',
    notes: 'Air conditioning system checked and refrigerant topped up',
    mileage: 45500
  },
  {
    id: '4',
    vehicleId: '4',
    maintenanceType: 'repair',
    serviceDate: '2023-08-30',
    description: 'Replace alternator, check electrical system',
    cost: 1450,
    serviceCenterId: '2',
    status: 'completed',
    nextServiceDue: '2023-11-30',
    notes: 'Battery also replaced as it was at end of life',
    mileage: 12500
  },
  {
    id: '5',
    vehicleId: '5',
    maintenanceType: 'routine',
    serviceDate: '2023-09-10',
    description: 'Oil change, filter replacement, tire rotation',
    cost: 550,
    serviceCenterId: '1',
    status: 'completed',
    nextServiceDue: '2023-12-10',
    notes: 'All tires in good condition, pressure adjusted',
    mileage: 8500
  },
  {
    id: '6',
    vehicleId: '2',
    maintenanceType: 'repair',
    serviceDate: null,
    description: 'Check engine light on, diagnostic needed',
    cost: null,
    serviceCenterId: '2',
    status: 'scheduled',
    nextServiceDue: null,
    notes: 'Vehicle reported rough idling and occasional stalling',
    mileage: 32150
  }
];

// Mock Fuel Records
export const mockFuelRecords = [
  {
    id: '1',
    vehicleId: '1',
    driverId: '3',
    date: '2023-09-10',
    fuelAmount: 45.5,
    fuelType: 'gasoline',
    cost: 175.2,
    odometer: 15200,
    stationName: 'ADNOC Station',
    notes: 'Full tank refill'
  },
  {
    id: '2',
    vehicleId: '3',
    driverId: '4',
    date: '2023-09-12',
    fuelAmount: 60.0,
    fuelType: 'diesel',
    cost: 198.0,
    odometer: 45600,
    stationName: 'Emarat',
    notes: 'Refill after long trip'
  },
  {
    id: '3',
    vehicleId: '5',
    driverId: '5',
    date: '2023-09-15',
    fuelAmount: 40.2,
    fuelType: 'gasoline',
    cost: 155.0,
    odometer: 8650,
    stationName: 'ADNOC Station',
    notes: 'Regular refill'
  },
  {
    id: '4',
    vehicleId: '1',
    driverId: '3',
    date: '2023-09-18',
    fuelAmount: 42.8,
    fuelType: 'gasoline',
    cost: 165.0,
    odometer: 15420,
    stationName: 'Emarat',
    notes: 'Full tank before long trip'
  },
  {
    id: '5',
    vehicleId: '3',
    driverId: '4',
    date: '2023-09-20',
    fuelAmount: 55.5,
    fuelType: 'diesel',
    cost: 183.2,
    odometer: 45780,
    stationName: 'ADNOC Station',
    notes: 'Refill after shuttle service'
  }
];

// Mock Documents
export const mockDocuments = [
  {
    id: '1',
    type: 'registration',
    vehicleId: '1',
    documentNumber: 'REG-12345',
    issueDate: '2023-05-10',
    expiryDate: '2024-05-10',
    issuingAuthority: 'Abu Dhabi Transport Department',
    documentUrl: null,
    status: 'active',
    notes: 'Annual vehicle registration'
  },
  {
    id: '2',
    type: 'insurance',
    vehicleId: '1',
    documentNumber: 'INS-67890',
    issueDate: '2023-02-28',
    expiryDate: '2024-02-28',
    issuingAuthority: 'National Insurance Company',
    documentUrl: null,
    status: 'active',
    notes: 'Comprehensive insurance policy'
  },
  {
    id: '3',
    type: 'license',
    driverId: '3',
    documentNumber: 'DL123456',
    issueDate: '2019-06-15',
    expiryDate: '2024-06-15',
    issuingAuthority: 'UAE Driving License Authority',
    documentUrl: null,
    status: 'active',
    notes: 'Driver license with all vehicle categories'
  },
  {
    id: '4',
    type: 'registration',
    vehicleId: '2',
    documentNumber: 'REG-23456',
    issueDate: '2023-04-15',
    expiryDate: '2024-04-15',
    issuingAuthority: 'Abu Dhabi Transport Department',
    documentUrl: null,
    status: 'active',
    notes: 'Annual vehicle registration'
  },
  {
    id: '5',
    type: 'insurance',
    vehicleId: '2',
    documentNumber: 'INS-78901',
    issueDate: '2023-03-10',
    expiryDate: '2024-03-10',
    issuingAuthority: 'National Insurance Company',
    documentUrl: null,
    status: 'active',
    notes: 'Comprehensive insurance policy'
  }
];

// Mock Departments
export const mockDepartments = [
  {
    id: '1',
    name: 'Executive Affairs',
    description: 'Executive management and VIP transport',
    manager: 'Khalid Al Mazrouei',
    vehicleCount: 2,
    budget: 250000
  },
  {
    id: '2',
    name: 'Administration',
    description: 'Administrative services and support',
    manager: 'Fatima Al Shamsi',
    vehicleCount: 2,
    budget: 180000
  },
  {
    id: '3',
    name: 'Employee Services',
    description: 'Staff transportation and support services',
    manager: 'Mohammed Al Hashimi',
    vehicleCount: 1,
    budget: 220000
  }
];

// Mock Service Centers
export const mockServiceCenters = [
  {
    id: '1',
    name: 'Central Government Garage',
    address: 'Industrial Area, Abu Dhabi',
    phone: '+97124567890',
    email: 'maintenance@govgarage.ae',
    isGovernmentOwned: true,
    contacts: [
      {
        name: 'Ahmed Al Zaabi',
        position: 'Head of Maintenance',
        phone: '+97155123456',
        email: 'ahmed@govgarage.ae'
      }
    ]
  },
  {
    id: '2',
    name: 'Premium Auto Services',
    address: 'Mussafah, Abu Dhabi',
    phone: '+97126789012',
    email: 'service@premiumauto.ae',
    isGovernmentOwned: false,
    contacts: [
      {
        name: 'Saeed Al Marzouqi',
        position: 'Service Manager',
        phone: '+97155654321',
        email: 'saeed@premiumauto.ae'
      }
    ]
  }
];

// Dashboard Stats
export const mockDashboardStats = {
  totalVehicles: 5,
  activeVehicles: 3,
  inMaintenanceVehicles: 1,
  inactiveVehicles: 1,
  totalDrivers: 3,
  availableDrivers: 0,
  totalTripsThisMonth: 8,
  totalDistanceThisMonth: 485.7,
  fuelConsumedThisMonth: 44.5,
  fuelCostThisMonth: 876.4,
  maintenanceCostThisMonth: 3050,
  upcomingMaintenance: 1,
  expiringDocuments: 0,
  fleetUtilization: 68.5, // percentage
  averageFuelEfficiency: 9.8, // km/liter
  costPerKilometer: 2.14 // AED/km
};

// Monthly Stats for Charts
export const mockMonthlyStats = [
  {
    month: 'Jan',
    fuelCost: 1250,
    maintenanceCost: 2500,
    tripCount: 65,
    distance: 4200
  },
  {
    month: 'Feb',
    fuelCost: 1350,
    maintenanceCost: 1800,
    tripCount: 72,
    distance: 4550
  },
  {
    month: 'Mar',
    fuelCost: 1420,
    maintenanceCost: 3200,
    tripCount: 68,
    distance: 4380
  },
  {
    month: 'Apr',
    fuelCost: 1380,
    maintenanceCost: 1500,
    tripCount: 70,
    distance: 4450
  },
  {
    month: 'May',
    fuelCost: 1410,
    maintenanceCost: 2200,
    tripCount: 75,
    distance: 4650
  },
  {
    month: 'Jun',
    fuelCost: 1550,
    maintenanceCost: 1800,
    tripCount: 78,
    distance: 4820
  },
  {
    month: 'Jul',
    fuelCost: 1620,
    maintenanceCost: 2700,
    tripCount: 80,
    distance: 4950
  },
  {
    month: 'Aug',
    fuelCost: 1580,
    maintenanceCost: 3500,
    tripCount: 77,
    distance: 4780
  },
  {
    month: 'Sep',
    fuelCost: 980,
    maintenanceCost: 3050,
    tripCount: 28,
    distance: 485
  }
];