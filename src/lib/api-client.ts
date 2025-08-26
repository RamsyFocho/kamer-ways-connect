
import { toast } from "sonner";
import type { User } from "./mock-data";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Generic API Error Handler
export const handleApiError = (error: any, entity: string = "data") => {
  let errorMessage = `Failed to fetch ${entity}.`;
  let errorCode: number | null = null;

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorCode = error.response.status;
    switch (errorCode) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 401:
        errorMessage = "Unauthorized. Please log in again.";
        break;
      case 403:
        errorMessage = "You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage = `The requested ${entity} could not be found.`;
        break;
      case 422:
        errorMessage = "Validation error. Please check your input.";
        break;
      case 500:
        errorMessage = "An internal server error occurred. Please try again later.";
        break;
      default:
        errorMessage = `An unexpected error occurred (code: ${errorCode}).`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = "No response from server. Please check your network connection.";
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message;
  }

  console.error(`API Error (${entity}):`, error);
  toast.error(errorMessage);

  // Return a structured error object
  return {
    error: true,
    message: errorMessage,
    status: errorCode,
  };
};

// API Mock Functions
let routes: any[];


export const getRoutes = async (
  params: {
    origin?: string;
    destination?: string;
    date?: string;
    agencyId?: string;
  } = {},
  simulateError?: number
) => {
  console.log("Get Routes params =>", params);
  try {
    // Simulate an error for testing purposes
    if (simulateError) {
      const error: any = new Error(`Simulated HTTP error! Status: ${simulateError}`);
      error.response = { status: simulateError };
      throw error;
    }

    const response = await fetch(`${backendUrl}/api/viewAllTrips`);
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }

    routes = await response.json();

    // If no search params, return all routes
    if (!params.origin && !params.destination && !params.date && !params.agencyId) {
      return Promise.resolve(routes);
    }

    // Filter by search params
    let filteredRoutes = routes;
    if (params?.origin) {
      filteredRoutes = filteredRoutes.filter((r: any) =>
        r.origin.toLowerCase().includes(params.origin!.toLowerCase())
      );
    }
    if (params?.destination) {
      filteredRoutes = filteredRoutes.filter((r: any) =>
        r.destination.toLowerCase().includes(params.destination!.toLowerCase())
      );
    }
    if (params?.date) {
      filteredRoutes = filteredRoutes.filter((r: any) => r.date === params.date);
    }
    if (params?.agencyId) {
      filteredRoutes = filteredRoutes.filter(
        (r: any) => r.travelAgency.id == params.agencyId
      );
    }

    console.log("Filtered routes= ", filteredRoutes);
    return Promise.resolve(filteredRoutes);
  } catch (error) {
    return handleApiError(error, "routes");
  }
};

export const getAgencies = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/agencies`);
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }
    const agencies = await response.json();
    console.log(agencies);
    return agencies;
  } catch (error) {
    return handleApiError(error, "agencies");
  }
};

export const getAgency = async (id: string) => {
  try {
    const response = await fetch(`${backendUrl}/api/agency/${id}`);
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, `agency with id ${id}`);
  }
};

export const createBooking = async (booking: any) => {
  try {
    const response = await fetch(`${backendUrl}/api/createReservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }
    return await response.json();
  } catch (error) {
    handleApiError(error, "booking");
    throw error;
  }
};

export const getAllBookings = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/viewReservations`);
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      return handleApiError(error);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, "bookings");
  }
};

export const updateBookingStatus = async (
  id: string,
  newStatus: string,
  seatNumbers: string,
  busNumber: string,
  departureTime: string,
  numberOfSeats: number
) => {
  try {
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
        })
      }
    );
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }
    return await response.json();
  } catch (error) {
     handleApiError(error, `booking with id ${id}`);
     return error;
  }
};

export const deleteBooking = async (id: string) => {
  try {
    const response = await fetch(`${backendUrl}/api/reservations/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error: any = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status };
      throw error;
    }
    return { success: true };
  } catch (error) {
    return handleApiError(error, `booking with id ${id}`);
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const allBookings = await getAllBookings();
    if (allBookings.error) {
      return allBookings; // Propagate error
    }
    return allBookings.filter((b: any) => b.userId === userId);
  } catch (error) {
    return handleApiError(error, `bookings for user ${userId}`);
  }
};

// actual implementation. TODO
// export const login = async (credentials: any) => {
//   try {
//     const response = await fetch(`${backendUrl}/api/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(credentials),
//     });
//     if (!response.ok) {
//       const error: any = new Error(`HTTP error! Status: ${response.status}`);
//       error.response = { status: response.status };
//       throw error;
//     }
//     return await response.json();
//   } catch (error) {
//     return handleApiError(error, "login");
//   }
// };

// mock implementation
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
export const login = (credentials: any) => {
        console.log(credentials);
  
    if (
      credentials.email === defaultCredentials.admin.email &&
      credentials.password === defaultCredentials.admin.password
    ) {
      return Promise.resolve({
        user: defaultCredentials.admin.user,
        token: "admin-token",
      });
    }
    if (
      credentials.email === defaultCredentials.customer.email &&
      credentials.password === defaultCredentials.customer.password
    ) {
      return Promise.resolve({
        user: defaultCredentials.customer.user,
        token: "customer-token",
      });
    }
    return Promise.reject(new Error("Invalid credentials"));
  }
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
export const addNotification = (notification) => {
    const newNotif = { ...notification, id: `notif-${Date.now()}` };
    mockNotifications.push(newNotif);
    return Promise.resolve(newNotif);
}
export const getNotifications = (userId) =>{
    return Promise.resolve(mockNotifications.filter((n) => n.userId === userId));
}
export const markNotificationAsRead = (id) => {
    const notifIndex = mockNotifications.findIndex((n) => n.id === id);
    if (notifIndex > -1) {
      mockNotifications[notifIndex].read = true;
      return Promise.resolve(mockNotifications[notifIndex]);
    }
    return Promise.reject(new Error("Notification not found"));
}
  