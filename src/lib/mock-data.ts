// Mock data for KamerWays Bus Reservation System

// TypeScript Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  joinDate: string;
  totalBookings: number;
  preferredLanguage: string;
}

export interface Agency {
  id: string;
  name: string;
  logo: string;
  contactInfo: string;
  rating: number;
  reviewCount: number;
  established: number;
  fleetSize: number;
  description: string;
  features: string[];
  routes: string[];
}

export interface Route {
  travelAgency: any;
  id: string;
  agencyId: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  busType: string;
  amenities: string[];
  availableSeats: number;
  totalSeats: number;
  date: string;
}

export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  agencyId: string;
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    idNumber: string;
  };
  seatNumbers: string[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "refunded"
    | "failed"
    | "in_progress"
    | "completed";
  bookingDate: string;
  paymentMethod: string;
  paymentStatus: string;
}

// Mock Agencies Data
export const mockAgencies = [
  {
    id: "agency-1",
    name: "KamerWays Express",
    logo: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 1250,
    established: 2015,
    fleetSize: 45,
    description:
      "Premium bus services connecting major cities across Cameroon with luxury and comfort.",
    features: ["WiFi", "AC", "Reclining Seats", "Entertainment System"],
    routes: [],
  },
  {
    id: "agency-2",
    name: "Cameroon Transit",
    logo: "/placeholder.svg",
    rating: 4.6,
    reviewCount: 890,
    established: 2010,
    fleetSize: 60,
    description:
      "Reliable and affordable transportation services with a focus on safety and punctuality.",
    features: ["AC", "GPS Tracking", "Safety Belt", "Luggage Storage"],
    routes: [],
  },
  {
    id: "agency-3",
    name: "Central African Lines",
    logo: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 2100,
    established: 2008,
    fleetSize: 80,
    description:
      "The largest bus network in Central Africa, serving inter-city and international routes.",
    features: ["WiFi", "AC", "Meals", "Charging Ports", "Rest Stops"],
    routes: [],
  },
  {
    id: "agency-4",
    name: "Royal Coach",
    logo: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 650,
    established: 2018,
    fleetSize: 25,
    description:
      "Luxury bus services with premium amenities for discerning travelers.",
    features: [
      "WiFi",
      "Premium Seats",
      "Personal Entertainment",
      "Complimentary Snacks",
    ],
    routes: [],
  },
];

// Mock Routes Data
export const mockRoutes = [
  {
    id: "route-1",
    agencyId: "agency-1",
    from: "Douala",
    to: "Yaoundé",
    departureTime: "08:00",
    arrivalTime: "11:30",
    duration: "3h 30m",
    price: 15000,
    busType: "Express",
    amenities: ["WiFi", "AC", "Reclining Seats"],
    availableSeats: 28,
    totalSeats: 40,
    date: "2024-08-08",
  },
  {
    id: "route-2",
    agencyId: "agency-1",
    from: "Yaoundé",
    to: "Douala",
    departureTime: "14:00",
    arrivalTime: "17:30",
    duration: "3h 30m",
    price: 15000,
    busType: "Express",
    amenities: ["WiFi", "AC", "Entertainment"],
    availableSeats: 35,
    totalSeats: 40,
    date: "2024-08-08",
  },
  {
    id: "route-3",
    agencyId: "agency-2",
    from: "Douala",
    to: "Bamenda",
    departureTime: "06:30",
    arrivalTime: "12:00",
    duration: "5h 30m",
    price: 25000,
    busType: "Standard",
    amenities: ["AC", "GPS Tracking"],
    availableSeats: 42,
    totalSeats: 50,
    date: "2024-08-08",
  },
  {
    id: "route-4",
    agencyId: "agency-3",
    from: "Yaoundé",
    to: "Garoua",
    departureTime: "20:00",
    arrivalTime: "08:00",
    duration: "12h",
    price: 35000,
    busType: "Night Express",
    amenities: ["WiFi", "AC", "Meals", "Rest Stops"],
    availableSeats: 18,
    totalSeats: 35,
    date: "2024-08-08",
  },
  {
    id: "route-5",
    agencyId: "agency-4",
    from: "Douala",
    to: "Kribi",
    departureTime: "10:00",
    arrivalTime: "13:30",
    duration: "3h 30m",
    price: 20000,
    busType: "Luxury",
    amenities: ["WiFi", "Premium Seats", "Personal Entertainment"],
    availableSeats: 15,
    totalSeats: 20,
    date: "2024-08-08",
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+237123456789",
    role: "customer",
    joinDate: "2023-06-15",
    totalBookings: 12,
    preferredLanguage: "en",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@kamerways.com",
    phone: "+237987654321",
    role: "admin",
    joinDate: "2023-01-01",
    totalBookings: 0,
    preferredLanguage: "en",
  },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    routeId: "route-1",
    agencyId: "agency-1",
    passengerDetails: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+237123456789",
      age: 30,
      gender: "male",
      idNumber: "ID123456789",
    },
    seatNumbers: ["A12", "A13"],
    totalAmount: 30000,
    status: "confirmed",
    bookingDate: "2024-08-07",
    paymentMethod: "mobile_money",
    paymentStatus: "paid",
  },
  {
    id: "booking-2",
    userId: "user-1",
    routeId: "route-3",
    agencyId: "agency-2",
    passengerDetails: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+237987654321",
      age: 28,
      gender: "female",
      idNumber: "ID987654321",
    },
    seatNumbers: ["B15"],
    totalAmount: 25000,
    status: "pending",
    bookingDate: "2024-08-08",
    paymentMethod: "card",
    paymentStatus: "pending",
  },
  {
    id: "booking-3",
    userId: "user-1",
    routeId: "route-4",
    agencyId: "agency-3",
    passengerDetails: {
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+237555666777",
      age: 35,
      gender: "male",
      idNumber: "ID555666777",
    },
    seatNumbers: ["C20", "C21"],
    totalAmount: 70000,
    status: "in_progress",
    bookingDate: "2024-08-09",
    paymentMethod: "mobile_money",
    paymentStatus: "paid",
  },
  {
    id: "booking-4",
    userId: "user-1",
    routeId: "route-5",
    agencyId: "agency-4",
    passengerDetails: {
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+237111222333",
      age: 26,
      gender: "female",
      idNumber: "ID111222333",
    },
    seatNumbers: ["D10"],
    totalAmount: 20000,
    status: "cancelled",
    bookingDate: "2024-08-06",
    paymentMethod: "mobile_money",
    paymentStatus: "refunded",
  },
];

// Analytics Mock Data
export const mockAnalytics = {
  totalBookings: 15420,
  totalRevenue: 462600000,
  totalUsers: 8750,
  totalAgencies: 4,
  monthlyBookings: [
    { month: "Jan", bookings: 1200, revenue: 36000000 },
    { month: "Feb", bookings: 1450, revenue: 43500000 },
    { month: "Mar", bookings: 1380, revenue: 41400000 },
    { month: "Apr", bookings: 1600, revenue: 48000000 },
    { month: "May", bookings: 1750, revenue: 52500000 },
    { month: "Jun", bookings: 1890, revenue: 56700000 },
    { month: "Jul", bookings: 2150, revenue: 64500000 },
  ],
  popularRoutes: [
    { route: "Douala → Yaoundé", bookings: 2450 },
    { route: "Yaoundé → Douala", bookings: 2380 },
    { route: "Douala → Bamenda", bookings: 1890 },
    { route: "Yaoundé → Garoua", bookings: 1650 },
    { route: "Douala → Kribi", bookings: 1200 },
  ],
  agencyPerformance: [
    { agency: "KamerWays Express", bookings: 4500, revenue: 135000000 },
    { agency: "Central African Lines", bookings: 6200, revenue: 186000000 },
    { agency: "Cameroon Transit", bookings: 3800, revenue: 114000000 },
    { agency: "Royal Coach", bookings: 920, revenue: 27600000 },
  ],
};

// Default login credentials
export const defaultCredentials = {
  admin: {
    email: "admin@kamerways.com",
    password: "admin123",
    user: mockUsers.find((u) => u.role === "admin"),
  },
  customer: {
    email: "john.doe@email.com",
    password: "customer123",
    user: mockUsers.find((u) => u.role === "customer"),
  },
};

// Notification Data
export const mockNotifications = [
  {
    id: "notif-1",
    userId: "user-1",
    message: "Your booking for route Douala to Yaoundé has been confirmed!",
    read: false,
    timestamp: "2024-08-07T10:00:00Z",
  },
  {
    id: "notif-2",
    userId: "admin-1",
    message: "New booking received from John Doe.",
    read: false,
    timestamp: "2024-08-07T10:05:00Z",
  },
];

const backendUrl = import.meta.env.VITE_BACKEND_URL;
let routes;
// API Mock Functions
export const mockApi = {
  // Agencies
  getAgencies: async () => {
    try {
      const response = await fetch(`${backendUrl}/api/agencies`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const agencies = await response.json();
      console.log(agencies);
      return agencies;
    } catch (error) {
      console.error("Failed to fetch agencies:", error);
      return []; // Return an empty array on error
    }
  },
  getAgency: async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/agency/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch agency with id ${id}:`, error);
      return null; // Return null on error
    }
  },

  // Routes

  getRoutes: async (params: {origin?: string; destination?: string; date?: string; agencyId?: string} = {}) => {
    console.log("Get Routes params =>", params);
    try {
      const response = await fetch(`${backendUrl}/api/viewAllTrips`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      routes = await response.json();
      
      // If no search params, return all routes
      if (!params.origin && !params.destination && !params.date && !params.agencyId) {
        return Promise.resolve(routes);
      }
      
      // Filter by search params
      if (params?.origin) {
        routes = routes.filter((r) =>
          r.origin.toLowerCase().includes(params.origin.toLowerCase())
        );
      }
      if (params?.destination) {
        routes = routes.filter((r) =>
          r.destination.toLowerCase().includes(params.destination.toLowerCase())
        );
      }
      if (params?.date) routes = routes.filter((r) => r.date === params.date);
      if (params?.agencyId)
        routes = routes.filter((r) => r.travelAgency.id == params.agencyId);
      
      console.log("Filtered routes= ", routes);
      return Promise.resolve(routes);
    } catch (error) {
      console.error("Failed to fetch routes:", error);
      // Return sample data format on error
      return [
        {
          id: 2,
          origin: "Douala",
          destination: "Kribi",
          departureTime: "2025-08-16T06:00:00",
          arrivalTime: "2025-08-16T11:00:00",
          price: 4500,
          busType: "Express",
          availableSeats: 20,
          totalSeats: 40,
          duration: "5h",
          amenities: ["wifi", "meals", "charging ports"],
          travelAgency: {
            id: 1,
            name: "Guarantee Express",
            contactInfo: null
          }
        }
      ];
    }
  },
  getRoute: async (id) => {
    console.log(routes);
    const route = routes.find((r) => r.id === id);
    return Promise.resolve(route || null);
  },

  // Bookings
  createBooking: async (booking) => {
    console.log("Booking details ", booking);
    // const newBooking = { ...booking, id: `booking-${Date.now()}` };
    // mockBookings.push(newBooking);
    const response = await fetch(`${backendUrl}/api/createReservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      console.error("Failed to create Booking: ", response.json());
      throw new Error("Failed to create booking");
    }
    const newBooking = await response.json();
    // Simulate notification for user and admin
    mockApi.addNotification({
      userId: newBooking.userId || 1,
      message: `Your booking for route ${newBooking.fullName} has been ${
        newBooking.status || "pending"
      }!`,
      read: false,
      timestamp: new Date().toISOString(),
    });
    mockApi.addNotification({
      userId: "admin-1", // Notify admin
      message: `New booking received from ${newBooking.fullName} for route ${newBooking.startPoint} - ${newBooking.endPoint}.`,
      read: false,
      timestamp: new Date().toISOString(),
    });
    return Promise.resolve(newBooking);
  },
  getBooking: (id) => Promise.resolve(mockBookings.find((b) => b.id === id)),
  // getAllBookings: () => Promise.resolve(mockBookings),
  getAllBookings: async () => {
    const response = await fetch(`${backendUrl}/api/viewReservations`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const bookings = await response.json();
    console.log("bookings Fetched =>", bookings);
    return bookings;
  },
  updateBookingStatus: async (
    id: string,
    newStatus: Booking["status"],
    seatNumbers: string,
    busNumber: string,
    departureTime: string,
    numberOfSeats: number
  ) => {
    const bookings = await mockApi.getAllBookings();
    const bookingIndex = bookings.findIndex((b) => b.id === id);
    // Require seatNumbers and busNumber if confirming
    if (newStatus === "confirmed") {
      if (!seatNumbers || !busNumber || !departureTime || !numberOfSeats) {
        return Promise.reject(
          new Error(
            "Seat numbers, bus number, number of seats, and departure time are required to confirm a booking."
          )
        );
      }
      // Validate seatNumbers count
      const seatArr = seatNumbers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (seatArr.length !== Number(numberOfSeats)) {
        return Promise.reject(
          new Error(
            `Number of seat numbers (${seatArr.length}) does not match numberOfSeats (${numberOfSeats}).`
          )
        );
      }
    }
    if (bookingIndex > -1) {
      const response = await fetch(
        `${backendUrl}/api/${id}/approveReservation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            seatNumber: seatNumbers,
            busNumber: busNumber,
            departureTime: departureTime,
            numberOfSeats: numberOfSeats,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }
      const result = await response.json();
      console.log("result ", result);
      mockApi.addNotification({
        userId: bookings[bookingIndex].userId,
        message: `Your booking ${id} status has been updated to ${newStatus}.`,
        read: false,
        timestamp: new Date().toISOString(),
      });
      return Promise.resolve(bookings[bookingIndex]);
    }
    return Promise.reject(new Error("Booking not found"));
  },
  deleteBooking: (id: string) => {
    const bookingIndex = mockBookings.findIndex((b) => b.id === id);
    if (bookingIndex > -1) {
      const deletedBooking = mockBookings.splice(bookingIndex, 1)[0];
      return Promise.resolve(deletedBooking);
    }
    return Promise.reject(new Error("Booking not found"));
  },
  getUserBookings: async (userId) => {
    const allBookings = await mockApi.getAllBookings();
    return allBookings.filter((b) => b.userId === userId);
  },

  // Auth
  login: (email, password) => {
    if (
      email === defaultCredentials.admin.email &&
      password === defaultCredentials.admin.password
    ) {
      return Promise.resolve({
        user: defaultCredentials.admin.user,
        token: "admin-token",
      });
    }
    if (
      email === defaultCredentials.customer.email &&
      password === defaultCredentials.customer.password
    ) {
      return Promise.resolve({
        user: defaultCredentials.customer.user,
        token: "customer-token",
      });
    }
    return Promise.reject(new Error("Invalid credentials"));
  },

  // Analytics
  getAnalytics: () => Promise.resolve(mockAnalytics),

  // Notifications
  addNotification: (notification) => {
    const newNotif = { ...notification, id: `notif-${Date.now()}` };
    mockNotifications.push(newNotif);
    return Promise.resolve(newNotif);
  },
  getNotifications: (userId) =>
    Promise.resolve(mockNotifications.filter((n) => n.userId === userId)),
  markNotificationAsRead: (id) => {
    const notifIndex = mockNotifications.findIndex((n) => n.id === id);
    if (notifIndex > -1) {
      mockNotifications[notifIndex].read = true;
      return Promise.resolve(mockNotifications[notifIndex]);
    }
    return Promise.reject(new Error("Notification not found"));
  },
};
