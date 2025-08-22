import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockApi, Booking } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Trash2, Eye, FileText } from "lucide-react";
import ConfirmBookingModal from "@/components/ui/ConfirmBookingModal";

const AdminBookingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: mockApi.getAllBookings,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      seatNumbers,
      busNumber,
      departureTime,
      numberOfSeats,
    }: {
      id: string;
      status: Booking["status"];
      seatNumbers: string;
      busNumber: string;
      departureTime: string;
      numberOfSeats: number;
    }) => mockApi.updateBookingStatus(id, status, seatNumbers, busNumber, departureTime, numberOfSeats),
    onSuccess: (updatedBooking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Status Updated",
        description: `Booking ${updatedBooking.id} status changed to ${updatedBooking.status}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: string) => mockApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Booking Deleted",
        description: "Booking has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    },
  });

  const handleChangeStatus = (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    if (newStatus === "confirmed") {
      setSelectedBookingId(bookingId);
      setIsModalOpen(true);
    } else {
      // Directly update status for other statuses
      updateStatusMutation.mutate({
        id: bookingId,
        status: newStatus,
        seatNumbers: "",
        busNumber: "",
        departureTime: "",
        numberOfSeats: 0,
      });
    }
  };

  const handleConfirmBooking = (seatNumbers: string, busNumber: string, departureTime: string, numberOfSeats: number) => {
    if (selectedBookingId) {
      updateStatusMutation.mutate({
        id: selectedBookingId,
        status: "confirmed",
        seatNumbers,
        busNumber,
        departureTime,
        numberOfSeats,
      });
      setIsModalOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId);
  };

  const getStatusBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "refunded":
        return "outline";
      case "failed":
        return "destructive";
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AdminSidebar />
        <main className="flex-1 px-8 py-8">
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
        <main className="flex-1 px-6 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Booking Management
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage all customer booking requests
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                All Bookings ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings found.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Passenger</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Route Details</TableHead>
                        <TableHead>Seats</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">
                            {booking.id}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {booking.fullName || "N/A"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {booking.idCardNumber || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{booking.email || "N/A"}</div>
                              <div className="text-muted-foreground">
                                {booking.phone || "N/A"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">
                                Route: {`${booking.startPoint==null?"N/A": booking.startPoint.toUpperCase()} -> ${booking.endPoint==null?"N/A": booking.endPoint.toUpperCase()}` }
                              </div>
                              <div className="text-muted-foreground">
                                Agency: {booking.id}
                              </div>
                              <div className="text-muted-foreground">
                                Period: {booking.departurePeriod}
                              </div>
                              <div className="text-muted-foreground">
                                Type: {booking.fleetType}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {Array.from(
                                { length: booking.numberOfSeats },
                                (_, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    Seat {i + 1}
                                  </Badge>
                                )
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="font-medium">
                            {"N/A"} FCFA
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(
                              booking.bookingDate
                            ).toLocaleDateString() || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <Badge
                                variant={getStatusBadgeVariant(booking.status)}
                                className="text-xs"
                              >
                                {/* {booking.status.toUpperCase()} */}
                                {!booking.approved ? "PENDING" : "CONFIRMED"}
                              </Badge>
                              <Select
                                value={booking.status}
                                onValueChange={(newStatus: Booking["status"]) =>
                                  handleChangeStatus(booking.id, newStatus)
                                }
                                disabled={updateStatusMutation.isPending}
                              >
                                <SelectTrigger className="w-full text-xs h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="confirmed">
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="cancelled">
                                    Cancelled
                                  </SelectItem>
                                  <SelectItem value="refunded">
                                    Refunded
                                  </SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="capitalize">
                                {booking.paymentMethod==null ? "N/A":booking.paymentMethod.replace("_", " ").toUpperCase()}
                              </div>
                              <Badge
                                variant={
                                  booking.paymentStatus === "paid"
                                    ? "default"
                                    : "destructive"
                                }
                                className="text-xs mt-1"
                              >
                                {booking.paymentStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Booking
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete booking{" "}
                                      {booking.id}? This action cannot be undone
                                      and will permanently remove all booking
                                      data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteBooking(booking.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete Booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      {selectedBookingId && (
        <ConfirmBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmBooking}
          bookingId={selectedBookingId}
        />
      )}
    </div>
  );
};

export default AdminBookingsPage;
