import React, { useState, useMemo, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking } from "@/lib/mock-data";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/lib/api-client";
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
import { Trash2, Eye, FileText, Menu, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import ConfirmBookingModal from "@/components/ui/ConfirmBookingModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";

// Helper functions for safe data access
const safeUpperCase = (str: string | null | undefined): string => {
  return str ? str.toUpperCase() : "N/A";
};

const safeDateString = (date: string | Date | null | undefined): string => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "N/A";
  }
};

const safeJoinRoute = (
  start: string | null | undefined,
  end: string | null | undefined
): string => {
  if (!start && !end) return "N/A";
  return `${safeUpperCase(start)} → ${safeUpperCase(end)}`;
};

const formatPaymentMethod = (method: string | null | undefined): string => {
  if (!method) return "N/A";
  return method.replace("_", " ").toUpperCase();
};

const safeCurrency = (amount: any): string => {
  const n = Number(amount);
  if (isNaN(n) || n <= 0) return "N/A";
  return `${n.toLocaleString()} FCFA`;
};

type SortField = "date" | "name" | "amount" | "status";
type SortDirection = "asc" | "desc";

const AdminBookingsPage: React.FC = () => {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });

  const bookings: any[] = Array.isArray(bookingsData) ? bookingsData : [];
  const apiLoadErrorMessage =
    !Array.isArray(bookingsData) && (bookingsData as any)?.message
      ? (bookingsData as any).message
      : null;

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
    }) =>
      updateBookingStatus(
        id,
        status,
        seatNumbers,
        busNumber,
        departureTime,
        numberOfSeats
      ),
    onSuccess: (updatedBooking) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Status Updated",
        description: updatedBooking?.id
          ? `Booking ${updatedBooking.id} status changed to ${updatedBooking.status}`
          : "Booking status updated successfully",
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
    mutationFn: (id: string) => deleteBooking(id),
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

  const handleConfirmBooking = (
    seatNumbers: string,
    busNumber: string,
    departureTime: string,
    numberOfSeats: number
  ) => {
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

  const getDisplayStatus = (booking: any): string => {
    if (booking?.approved === true) return "CONFIRMED";
    if (typeof booking?.status === "string") {
      return booking.status.replace(/_/g, " ").toUpperCase();
    }
    return "PENDING";
  };

  // Filter, sort and search bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        (booking.fullName?.toLowerCase().includes(query)) ||
        (booking.email?.toLowerCase().includes(query)) ||
        (booking.phone?.toLowerCase().includes(query)) ||
        (booking.id?.toLowerCase().includes(query)) ||
        (booking.startPoint?.toLowerCase().includes(query)) ||
        (booking.endPoint?.toLowerCase().includes(query))
      );
    }
    
    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(booking => 
        activeTab === "pending" ? !booking.approved : 
        activeTab === "confirmed" ? booking.approved && booking.status === "confirmed" :
        booking.status === activeTab
      );
    }
    
    // Sort bookings
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "date":
          aValue = new Date(a.bookingDate || 0).getTime();
          bValue = new Date(b.bookingDate || 0).getTime();
          break;
        case "name":
          aValue = a.fullName || "";
          bValue = b.fullName || "";
          break;
        case "amount":
          aValue = a.amount || 0;
          bValue = b.amount || 0;
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [bookings, activeTab, sortField, sortDirection, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, sortField, sortDirection, searchQuery]);

  const totalItems = filteredAndSortedBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedBookings = filteredAndSortedBookings.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const openDetails = (booking: any) => {
    setDetailsBooking(booking);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar
          mobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 md:ml-64">
          <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <h1 className="text-xl font-bold ml-2">Booking Management</h1>
            </div>
          </header>
          <div className="p-4 flex items-center justify-center h-64">
            <div>Loading bookings...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar
          mobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 md:ml-64">
          <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <h1 className="text-xl font-bold ml-2">Booking Management</h1>
            </div>
          </header>
          <div className="p-4">
            <div className="text-destructive p-4 border border-destructive rounded-lg">
              Error loading bookings: {error.message}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasBookings = Array.isArray(bookings) && bookings.length > 0;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        mobileOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 ">
        {/* Header with mobile menu button */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <div className="ml-2">
                <h1 className="text-xl font-bold">Booking Management</h1>
                <p className="text-sm text-muted-foreground md:hidden">
                  {filteredAndSortedBookings.length} bookings
                </p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter & Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-semibold">Sort By</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSort("date")}>
                  Date {sortField === "date" && (sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("name")}>
                  Name {sortField === "name" && (sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("amount")}>
                  Amount {sortField === "amount" && (sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>
                  Status {sortField === "status" && (sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 h-10">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                <TabsTrigger value="confirmed" className="text-xs">Confirmed</TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </header>

        <div className="p-4">
          <div className="hidden md:block mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Booking Management
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage all customer booking requests
            </p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl">
                  Bookings ({filteredAndSortedBookings.length})
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <span className="text-sm text-muted-foreground hidden md:block">
                    Sorted by: {sortField} ({sortDirection})
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSort(sortField)}
                    className="hidden md:flex"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    {sortField === "date" ? "Date" : 
                     sortField === "name" ? "Name" : 
                     sortField === "amount" ? "Amount" : "Status"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {apiLoadErrorMessage && (
                <div className="mb-4 p-3 border border-destructive/50 rounded bg-destructive/10 text-destructive text-sm">
                  Failed to load bookings: {apiLoadErrorMessage}
                </div>
              )}
              {!hasBookings ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings found.</p>
                </div>
              ) : filteredAndSortedBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings match your filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div>
                      Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of {totalItems} bookings
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Per page:</span>
                      <Select
                        value={String(pageSize)}
                        onValueChange={(v) => {
                          const newSize = Number(v);
                          setPageSize(newSize);
                          setPage(1);
                        }}
                      >
                        <SelectTrigger className="w-[90px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Passenger</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedBookings.map((booking, index) => (
                          <TableRow key={booking.id || `${startIndex + index}`}>
                            <TableCell className="font-mono text-sm">
                              {booking.id || "N/A"}
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
                            <TableCell className="hidden">
                              <div className="text-sm">
                                <div>{booking.email || "N/A"}</div>
                                <div className="text-muted-foreground">
                                  {booking.phone || "N/A"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm font-medium">
                                {safeJoinRoute(booking.startPoint, booking.endPoint)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden">
                              <div className="flex flex-wrap gap-1">
                                {booking.numberOfSeats &&
                                booking.numberOfSeats > 0 ? (
                                  Array.from(
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
                                  )
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    No seats
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {safeCurrency((booking as any).amount ?? (booking as any).totalAmount)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {safeDateString(booking.bookingDate)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    booking.status
                                  )}
                                  className="text-xs"
                                >
                                  {getDisplayStatus(booking)}
                                </Badge>
                                <Select
                                  value={booking.status || "pending"}
                                  onValueChange={(
                                    newStatus: Booking["status"]
                                  ) =>
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
                                    <SelectItem value="failed">
                                      Failed
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell className="hidden">
                              <div className="text-sm">
                                <div className="capitalize">
                                  {formatPaymentMethod(booking.paymentMethod)}
                                </div>
                                <Badge
                                  variant={
                                    booking.paymentStatus === "paid"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="text-xs mt-1"
                                >
                                  {booking.paymentStatus || "unknown"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => openDetails(booking)}
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
                                        {booking.id || "this booking"}? This
                                        action cannot be undone and will
                                        permanently remove all booking data.
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
                  
                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {pagedBookings.map((booking, index) => (
                      <Card key={booking.id || `${startIndex + index}`} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-mono text-sm font-semibold mb-1">
                                {booking.id || "N/A"}
                              </div>
                              <div className="font-medium">
                                {booking.fullName || "N/A"}
                              </div>
                              <div className="mt-2 text-sm text-muted-foreground">
                                {safeJoinRoute(booking.startPoint, booking.endPoint)}
                              </div>
                            </div>
                            <Badge
                              variant={getStatusBadgeVariant(booking.status)}
                              className="text-xs"
                            >
                              {getDisplayStatus(booking)}
                            </Badge>
                          </div>

                          <div className="mt-3 text-sm grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-muted-foreground">Date</div>
                              <div>{safeDateString(booking.bookingDate)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Amount</div>
                              <div>{safeCurrency((booking as any).amount ?? (booking as any).totalAmount)}</div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => openDetails(booking)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete booking {booking.id || "this booking"}? This action cannot be undone and will permanently remove all booking data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Booking
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              {filteredAndSortedBookings.length > 0 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.max(1, currentPage - 1));
                          }}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(p);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(Math.min(totalPages, currentPage + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {detailsBooking && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Full details for booking {detailsBooking.id || "N/A"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Passenger</div>
                  <div className="font-medium">{detailsBooking.fullName || detailsBooking.passengerDetails?.name || "N/A"}</div>
                  <div className="text-sm">{detailsBooking.idCardNumber || detailsBooking.passengerDetails?.idNumber || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Contact</div>
                  <div className="text-sm">{detailsBooking.email || detailsBooking.passengerDetails?.email || "N/A"}</div>
                  <div className="text-sm">{detailsBooking.phone || detailsBooking.passengerDetails?.phone || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Route</div>
                  <div className="font-medium">{safeJoinRoute(detailsBooking.startPoint || detailsBooking.origin, detailsBooking.endPoint || detailsBooking.destination)}</div>
                  <div className="text-sm text-muted-foreground">Agency ID: {detailsBooking.agencyId || detailsBooking.travelAgency?.id || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>{safeDateString(detailsBooking.bookingDate || detailsBooking.date)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{safeCurrency(detailsBooking.amount ?? detailsBooking.totalAmount)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>
                    <Badge variant={getStatusBadgeVariant(detailsBooking.status)} className="text-xs">
                      {getDisplayStatus(detailsBooking)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Payment</div>
                  <div className="capitalize">{formatPaymentMethod(detailsBooking.paymentMethod)}</div>
                  <Badge
                    variant={detailsBooking.paymentStatus === "paid" ? "default" : "destructive"}
                    className="text-xs mt-1"
                  >
                    {detailsBooking.paymentStatus || "unknown"}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Seats</div>
                  <div className="flex flex-wrap gap-1">
                    {detailsBooking.numberOfSeats && detailsBooking.numberOfSeats > 0 ? (
                      Array.from({ length: detailsBooking.numberOfSeats }, (_, i) => (
                        <Badge key={i} variant="outline" className="text-xs">Seat {i + 1}</Badge>
                      ))
                    ) : Array.isArray(detailsBooking.seatNumbers) && detailsBooking.seatNumbers.length > 0 ? (
                      detailsBooking.seatNumbers.map((s: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">No seats</span>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Booking ID</div>
                  <div className="font-mono text-sm">{detailsBooking.id || "N/A"}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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