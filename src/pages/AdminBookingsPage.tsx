import React, { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockApi, Booking } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminBookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: mockApi.getAllBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      mockApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Optionally, show a toast notification
    },
  });

  const handleChangeStatus = (bookingId: string, newStatus: Booking['status']) => {
    updateStatusMutation.mutate({ id: bookingId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 px-4 py-8">
          <div>Loading bookings...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 px-4 py-8">
          <div>Error loading bookings: {error.message}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Booking ID</th>
                        <th className="p-2 text-left">User</th>
                        <th className="p-2 text-left">Route</th>
                        <th className="p-2 text-left">Amount</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="p-2">{booking.id}</td>
                          <td className="p-2">{booking.passengerDetails.name}</td>
                          <td className="p-2">{booking.routeId}</td>{/* Ideally fetch route details */}
                          <td className="p-2">{booking.totalAmount.toLocaleString()} FCFA</td>
                          <td className="p-2">{booking.bookingDate}</td>
                          <td className="p-2">
                            <Select
                              value={booking.status}
                              onValueChange={(newStatus: Booking['status']) =>
                                handleChangeStatus(booking.id, newStatus)
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="in progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    booking and remove its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => console.log('Delete booking', booking.id)}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
