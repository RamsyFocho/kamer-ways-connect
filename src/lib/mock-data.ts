// Mock data for KamerWays Bus Reservation System

// Mock Agencies Data
export const mockAgencies = [
  {
    id: 'agency-1',
    name: 'KamerWays Express',
    logo: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 1250,
    established: 2015,
    fleetSize: 45,
    description: 'Premium bus services connecting major cities across Cameroon with luxury and comfort.',
    features: ['WiFi', 'AC', 'Reclining Seats', 'Entertainment System'],
    routes: []
  },
  {
    id: 'agency-2',
    name: 'Cameroon Transit',
    logo: '/placeholder.svg',
    rating: 4.6,
    reviewCount: 890,
    established: 2010,
    fleetSize: 60,
    description: 'Reliable and affordable transportation services with a focus on safety and punctuality.',
    features: ['AC', 'GPS Tracking', 'Safety Belt', 'Luggage Storage'],
    routes: []
  },
  {
    id: 'agency-3',
    name: 'Central African Lines',
    logo: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 2100,
    established: 2008,
    fleetSize: 80,
    description: 'The largest bus network in Central Africa, serving inter-city and international routes.',
    features: ['WiFi', 'AC', 'Meals', 'Charging Ports', 'Rest Stops'],
    routes: []
  },
  {
    id: 'agency-4',
    name: 'Royal Coach',
    logo: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 650,
    established: 2018,
    fleetSize: 25,
    description: 'Luxury bus services with premium amenities for discerning travelers.',
    features: ['WiFi', 'Premium Seats', 'Personal Entertainment', 'Complimentary Snacks'],
    routes: []
  }
];

// Mock Routes Data
export const mockRoutes = [
  {
    id: 'route-1',
    agencyId: 'agency-1',
    from: 'Douala',
    to: 'Yaoundé',
    departureTime: '08:00',
    arrivalTime: '11:30',
    duration: '3h 30m',
    price: 15000,
    busType: 'Express',
    amenities: ['WiFi', 'AC', 'Reclining Seats'],
    availableSeats: 28,
    totalSeats: 40,
    date: '2024-08-08'
  },
  {
    id: 'route-2',
    agencyId: 'agency-1',
    from: 'Yaoundé',
    to: 'Douala',
    departureTime: '14:00',
    arrivalTime: '17:30',
    duration: '3h 30m',
    price: 15000,
    busType: 'Express',
    amenities: ['WiFi', 'AC', 'Entertainment'],
    availableSeats: 35,
    totalSeats: 40,
    date: '2024-08-08'
  },
  {
    id: 'route-3',
    agencyId: 'agency-2',
    from: 'Douala',
    to: 'Bamenda',
    departureTime: '06:30',
    arrivalTime: '12:00',
    duration: '5h 30m',
    price: 25000,
    busType: 'Standard',
    amenities: ['AC', 'GPS Tracking'],
    availableSeats: 42,
    totalSeats: 50,
    date: '2024-08-08'
  },
  {
    id: 'route-4',
    agencyId: 'agency-3',
    from: 'Yaoundé',
    to: 'Garoua',
    departureTime: '20:00',
    arrivalTime: '08:00',
    duration: '12h',
    price: 35000,
    busType: 'Night Express',
    amenities: ['WiFi', 'AC', 'Meals', 'Rest Stops'],
    availableSeats: 18,
    totalSeats: 35,
    date: '2024-08-08'
  },
  {
    id: 'route-5',
    agencyId: 'agency-4',
    from: 'Douala',
    to: 'Kribi',
    departureTime: '10:00',
    arrivalTime: '13:30',
    duration: '3h 30m',
    price: 20000,
    busType: 'Luxury',
    amenities: ['WiFi', 'Premium Seats', 'Personal Entertainment'],
    availableSeats: 15,
    totalSeats: 20,
    date: '2024-08-08'
  }
];

// Mock Users Data
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+237123456789',
    role: 'customer',
    joinDate: '2023-06-15',
    totalBookings: 12,
    preferredLanguage: 'en'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@kamerways.com',
    phone: '+237987654321',
    role: 'admin',
    joinDate: '2023-01-01',
    totalBookings: 0,
    preferredLanguage: 'en'
  }
];

// Mock Bookings Data
export const mockBookings = [
  {
    id: 'booking-1',
    userId: 'user-1',
    routeId: 'route-1',
    agencyId: 'agency-1',
    passengerDetails: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+237123456789',
      age: 30,
      gender: 'male',
      idNumber: 'ID123456789'
    },
    seatNumbers: ['A12', 'A13'],
    totalAmount: 30000,
    status: 'confirmed',
    bookingDate: '2024-08-07',
    paymentMethod: 'mobile_money',
    paymentStatus: 'paid'
  }
];

// Analytics Mock Data
export const mockAnalytics = {
  totalBookings: 15420,
  totalRevenue: 462600000,
  totalUsers: 8750,
  totalAgencies: 4,
  monthlyBookings: [
    { month: 'Jan', bookings: 1200, revenue: 36000000 },
    { month: 'Feb', bookings: 1450, revenue: 43500000 },
    { month: 'Mar', bookings: 1380, revenue: 41400000 },
    { month: 'Apr', bookings: 1600, revenue: 48000000 },
    { month: 'May', bookings: 1750, revenue: 52500000 },
    { month: 'Jun', bookings: 1890, revenue: 56700000 },
    { month: 'Jul', bookings: 2150, revenue: 64500000 }
  ],
  popularRoutes: [
    { route: 'Douala → Yaoundé', bookings: 2450 },
    { route: 'Yaoundé → Douala', bookings: 2380 },
    { route: 'Douala → Bamenda', bookings: 1890 },
    { route: 'Yaoundé → Garoua', bookings: 1650 },
    { route: 'Douala → Kribi', bookings: 1200 }
  ],
  agencyPerformance: [
    { agency: 'KamerWays Express', bookings: 4500, revenue: 135000000 },
    { agency: 'Central African Lines', bookings: 6200, revenue: 186000000 },
    { agency: 'Cameroon Transit', bookings: 3800, revenue: 114000000 },
    { agency: 'Royal Coach', bookings: 920, revenue: 27600000 }
  ]
};

// Default login credentials
export const defaultCredentials = {
  admin: {
    email: 'admin@kamerways.com',
    password: 'admin123',
    user: mockUsers.find(u => u.role === 'admin')
  },
  customer: {
    email: 'john.doe@email.com',
    password: 'customer123',
    user: mockUsers.find(u => u.role === 'customer')
  }
};

// Notification Data
export const mockNotifications = [
  {
    id: 'notif-1',
    userId: 'user-1',
    message: 'Your booking for route Douala to Yaoundé has been confirmed!',
    read: false,
    timestamp: '2024-08-07T10:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'admin-1',
    message: 'New booking received from John Doe.',
    read: false,
    timestamp: '2024-08-07T10:05:00Z',
  },
];

// API Mock Functions
export const mockApi = {
  // Agencies
  getAgencies: () => Promise.resolve(mockAgencies),
  getAgency: (id) => Promise.resolve(mockAgencies.find(a => a.id === id)),
  
  // Routes
  getRoutes: (params) => {
    let routes = mockRoutes;
    if (params?.from) routes = routes.filter(r => r.from.toLowerCase().includes(params.from.toLowerCase()));
    if (params?.to) routes = routes.filter(r => r.to.toLowerCase().includes(params.to.toLowerCase()));
    if (params?.date) routes = routes.filter(r => r.date === params.date);
    if (params?.agencyId) routes = routes.filter(r => r.agencyId === params.agencyId);
    return Promise.resolve(routes);
  },
  getRoute: (id) => Promise.resolve(mockRoutes.find(r => r.id === id)),
  
  // Bookings
  createBooking: (booking) => {
    const newBooking = { ...booking, id: `booking-${Date.now()}` };
    mockBookings.push(newBooking);
    // Simulate notification for user and admin
    mockApi.addNotification({
      userId: newBooking.userId,
      message: `Your booking for route ${newBooking.passengerDetails.name} has been ${newBooking.status}!`, 
      read: false,
      timestamp: new Date().toISOString(),
    });
    mockApi.addNotification({
      userId: 'admin-1', // Notify admin
      message: `New booking received from ${newBooking.passengerDetails.name} for route ${newBooking.routeId}.`, 
      read: false,
      timestamp: new Date().toISOString(),
    });
    return Promise.resolve(newBooking);
  },
  getBooking: (id) => Promise.resolve(mockBookings.find(b => b.id === id)),
  getAllBookings: () => Promise.resolve(mockBookings),
  updateBookingStatus: (id, newStatus) => {
    const bookingIndex = mockBookings.findIndex(b => b.id === id);
    if (bookingIndex > -1) {
      mockBookings[bookingIndex].status = newStatus;
      // Simulate notification for user about status change
      mockApi.addNotification({
        userId: mockBookings[bookingIndex].userId,
        message: `Your booking ${id} status has been updated to ${newStatus}.`, 
        read: false,
        timestamp: new Date().toISOString(),
      });
      return Promise.resolve(mockBookings[bookingIndex]);
    }
    return Promise.reject(new Error('Booking not found'));
  },
  getUserBookings: (userId) => 
    Promise.resolve(mockBookings.filter(b => b.userId === userId)),
  
  // Auth
  login: (email, password) => {
    if (email === defaultCredentials.admin.email && password === defaultCredentials.admin.password) {
      return Promise.resolve({ user: defaultCredentials.admin.user, token: 'admin-token' });
    }
    if (email === defaultCredentials.customer.email && password === defaultCredentials.customer.password) {
      return Promise.resolve({ user: defaultCredentials.customer.user, token: 'customer-token' });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },
  
  // Analytics
  getAnalytics: () => Promise.resolve(mockAnalytics),

  // Notifications
  addNotification: (notification) => {
    const newNotif = { ...notification, id: `notif-${Date.now()}` };
    mockNotifications.push(newNotif);
    return Promise.resolve(newNotif);
  },
  getNotifications: (userId) => Promise.resolve(mockNotifications.filter(n => n.userId === userId)),
  markNotificationAsRead: (id) => {
    const notifIndex = mockNotifications.findIndex(n => n.id === id);
    if (notifIndex > -1) {
      mockNotifications[notifIndex].read = true;
      return Promise.resolve(mockNotifications[notifIndex]);
    }
    return Promise.reject(new Error('Notification not found'));
  },
};