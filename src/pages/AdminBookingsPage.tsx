import React, { useMemo, useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBookings, updateBookingStatus, deleteBooking } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Trash2, Eye, FileText, Menu, Filter, ArrowUpDown, ChevronDown, ChevronUp, Group as GroupIcon
} from "lucide-react";
import ConfirmBookingModal from "@/components/ui/ConfirmBookingModal";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

// ---------- Helpers ----------
type SortField = "date" | "name" | "amount" | "status";
type SortDirection = "asc" | "desc";
type Status =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

const safeUpper = (s?: string | null) => (s ? s.toUpperCase() : "N/A");
const safeDate = (d?: string | Date | null) => {
  if (!d) return "N/A";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "N/A" : dt.toLocaleDateString();
};
const safeCurrency = (v: any) => {
  const n = Number(v);
  return isNaN(n) || n < 0 ? "N/A" : `${n.toLocaleString()} FCFA`;
};
const joinRoute = (from?: string | null, to?: string | null) => {
  if (!from && !to) return "N/A";
  return `${safeUpper(from)} → ${safeUpper(to)}`;
};

// Normalize a "display status" that respects legacy `approved` booleans
const getDisplayStatus = (booking: any): Status | "PENDING" | "CONFIRMED" => {
  if (booking?.approved === true) return "confirmed";
  if (booking?.approved === false && !booking?.status) return "pending";
  const s = (booking?.status || "pending") as Status;
  return s;
};

const getBadgeVariant = (status: Status | string) => {
  switch (status) {
    case "confirmed":
    case "in_progress":
    case "completed":
      return "default";
    case "cancelled":
    case "failed":
      return "destructive";
    case "refunded":
      return "outline";
    case "pending":
    default:
      return "secondary";
  }
};

// ---------- Component ----------
const AdminBookingsPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByStatus, setGroupByStatus] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState<any | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // --- Mutations ---
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
      status: Status;
      seatNumbers?: string;
      busNumber?: string;
      departureTime?: string;
      numberOfSeats?: number;
    }) =>
      updateBookingStatus(id, status, seatNumbers || "", busNumber || "", departureTime || "", numberOfSeats || 0),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Status Updated",
        description: updated?.id
          ? `Booking ${updated.id} status is now ${String(updated.status).toUpperCase()}`
          : "Booking status updated",
      });
    },
    onError: () =>
      toast({ title: "Error", description: "Failed to update booking status", variant: "destructive" }),
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({ title: "Booking Deleted", description: "Booking was removed successfully" });
    },
    onError: () =>
      toast({ title: "Error", description: "Failed to delete booking", variant: "destructive" }),
  });

  const handleChangeStatus = (bookingId: string, newStatus: Status) => {
    if (newStatus === "confirmed") {
      setSelectedBookingId(bookingId);
      setIsModalOpen(true);
    } else {
      updateStatusMutation.mutate({ id: bookingId, status: newStatus });
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

  const handleDeleteBooking = (id: string) => deleteBookingMutation.mutate(id);

  // --- Derived list: search -> tab filter -> sort ---
  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = bookings.filter((b) => {
      if (!q) return true;
      return [
        b.fullName,
        b.email,
        b.phone,
        b.id,
        b.idCardNumber,
        b.startPoint,
        b.endPoint,
        b.origin,
        b.destination,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });

    // Tab filter (supports old "approved" boolean)
    list = list.filter((b) => {
      const s = getDisplayStatus(b);
      if (activeTab === "all") return true;
      if (activeTab === "pending") return s === "pending";
      if (activeTab === "confirmed") return s === "confirmed";
      if (activeTab === "cancelled") return s === "cancelled";
      return true;
    });

    // Sort
    const getSortValue = (b: any) => {
      switch (sortField) {
        case "date": {
          const d = b.bookingDate ?? b.date;
          const t = new Date(d || 0).getTime();
          return isNaN(t) ? 0 : t;
        }
        case "name":
          return (b.fullName || "").toString().toLowerCase();
        case "amount": {
          const amt = Number(b.totalAmount ?? b.amount ?? 0);
          return isNaN(amt) ? 0 : amt;
        }
        case "status":
          return String(getDisplayStatus(b)).toLowerCase();
        default:
          return 0;
      }
    };

    list.sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [bookings, searchQuery, activeTab, sortField, sortDirection]);

  // Pagination reset when filters change
  useEffect(() => setPage(1), [searchQuery, activeTab, sortField, sortDirection, pageSize]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = filteredAndSorted.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc"); // nice default
    }
  };

  const openDetails = (booking: any) => {
    setDetailsBooking(booking);
    console.log("Details booking ",detailsBooking);
    setDetailsOpen(true);
  };

  const hasBookings = bookings.length > 0;

  // Grouping (desktop only)
  const groupedByStatus = useMemo(() => {
    if (!groupByStatus) return {};
    const map: Record<string, any[]> = {};
    for (const b of pageItems) {
      const s = String(getDisplayStatus(b)).toLowerCase();
      if (!map[s]) map[s] = [];
      map[s].push(b);
    }
    return map;
  }, [groupByStatus, pageItems]);

  // ---------- RENDER ----------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 md:ml-64">
          <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <h1 className="text-xl font-bold ml-2">Booking Management</h1>
            </div>
          </header>
          <div className="p-4 flex items-center justify-center h-64">Loading bookings...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <AdminSidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 md:ml-64">
          <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <h1 className="text-xl font-bold ml-2">Booking Management</h1>
            </div>
          </header>
          <div className="p-4">
            <div className="text-destructive p-4 border border-destructive rounded-lg">
              Error loading bookings: {(error as any)?.message || "Unknown error"}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar mobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
              <div className="ml-2">
                <h1 className="text-xl font-bold">Booking Management</h1>
                <p className="text-sm text-muted-foreground md:hidden">{filteredAndSorted.length} bookings</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={groupByStatus ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupByStatus((v) => !v)}
                className="gap-1"
              >
                <GroupIcon className="h-4 w-4" />
                {groupByStatus ? "Grouped by Status" : "Group by Status"}
              </Button>

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
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input
                placeholder="Search by: Name, Email, Phone, Booking ID, ID Card Number, Origin, Destination"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
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
            <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
            <p className="text-muted-foreground mt-2">View and manage all customer booking requests</p>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl">
                  Bookings ({filteredAndSorted.length})
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <span className="text-sm text-muted-foreground hidden md:block">
                    Sorted by: {sortField} ({sortDirection})
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleSort(sortField)} className="hidden md:flex">
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    {sortField === "date" ? "Date" : sortField === "name" ? "Name" : sortField === "amount" ? "Amount" : "Status"}
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
              ) : filteredAndSorted.length === 0 ? (
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

                  {/* Desktop Table + optional grouping */}
                  <div className="hidden md:block overflow-hidden rounded-lg border">
                    {!groupByStatus ? (
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
                          {pageItems.map((booking) => {
                            const displayStatus = getDisplayStatus(booking) as Status;
                            return (
                              <TableRow key={booking.id}>
                                <TableCell className="font-mono text-sm">{booking.id || "N/A"}</TableCell>
                                <TableCell>
                                  <div className="font-medium">{booking.fullName || "N/A"}</div>
                                  <div className="text-sm text-muted-foreground">ID: {booking.idCardNumber || "N/A"}</div>
                                </TableCell>
                                <TableCell className="text-sm font-medium">
                                  {joinRoute(booking.startPoint ?? booking.origin, booking.endPoint ?? booking.destination)}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {safeCurrency(booking.totalAmount ?? booking.amount)}{booking.numberOfSeats ? ` (${booking.numberOfSeats} seats)` : ""}
                                </TableCell>
                                <TableCell className="text-sm">{safeDate(booking.bookingDate ?? booking.date)}</TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <Badge variant={getBadgeVariant(displayStatus)} className="text-xs">
                                      {String(displayStatus).replace(/_/g, " ").toUpperCase()}
                                    </Badge>
                                    <Select
                                      value={displayStatus}
                                      onValueChange={(s: Status) => handleChangeStatus(booking.id, s)}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      <SelectTrigger className="w-full text-xs h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openDetails(booking)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete booking{" "}
                                            {booking.id || "this booking"}? This action cannot be undone.
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
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      // Grouped rendering
                      <div>
                        {Object.entries(groupedByStatus).map(([statusKey, rows]) => (
                          <div key={statusKey} className="border-b last:border-b-0">
                            <div className="bg-muted/40 px-4 py-2 text-sm font-semibold">
                              {statusKey.replace(/_/g, " ").toUpperCase()} ({rows.length})
                            </div>
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
                                {rows.map((booking) => {
                                  const displayStatus = getDisplayStatus(booking) as Status;
                                  return (
                                    <TableRow key={booking.id}>
                                      <TableCell className="font-mono text-sm">{booking.id || "N/A"}</TableCell>
                                      <TableCell>
                                        <div className="font-medium">{booking.fullName || "N/A"}</div>
                                        <div className="text-sm text-muted-foreground">ID: {booking.idCardNumber || "N/A"}</div>
                                      </TableCell>
                                      <TableCell className="text-sm font-medium">
                                        {joinRoute(booking.startPoint ?? booking.origin, booking.endPoint ?? booking.destination)}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        {safeCurrency(booking.totalAmount ?? booking.amount)}{booking.numberOfSeats ? ` (${booking.numberOfSeats} seats)` : ""}
                                      </TableCell>
                                      <TableCell className="text-sm">{safeDate(booking.bookingDate ?? booking.date)}</TableCell>
                                      <TableCell>
                                        <div className="space-y-2">
                                          <Badge variant={getBadgeVariant(displayStatus)} className="text-xs">
                                            {String(displayStatus).replace(/_/g, " ").toUpperCase()}
                                          </Badge>
                                          <Select
                                            value={displayStatus}
                                            onValueChange={(s: Status) => handleChangeStatus(booking.id, s)}
                                            disabled={updateStatusMutation.isPending}
                                          >
                                            <SelectTrigger className="w-full text-xs h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending">Pending</SelectItem>
                                              <SelectItem value="confirmed">Confirmed</SelectItem>
                                              <SelectItem value="in_progress">In Progress</SelectItem>
                                              <SelectItem value="completed">Completed</SelectItem>
                                              <SelectItem value="cancelled">Cancelled</SelectItem>
                                              <SelectItem value="refunded">Refunded</SelectItem>
                                              <SelectItem value="failed">Failed</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-2">
                                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => openDetails(booking)}>
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to delete booking{" "}
                                                  {booking.id || "this booking"}? This action cannot be undone.
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
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {pageItems.map((booking) => {
                      const displayStatus = getDisplayStatus(booking) as Status;
                      return (
                        <Card key={booking.id} className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-mono text-sm font-semibold mb-1">{booking.id || "N/A"}</div>
                                <div className="font-medium">{booking.fullName || "N/A"}</div>
                                <div className="mt-2 text-sm text-muted-foreground">
                                  {joinRoute(booking.startPoint ?? booking.origin, booking.endPoint ?? booking.destination)}
                                </div>
                              </div>
                              <Badge variant={getBadgeVariant(displayStatus)} className="text-xs">
                                {String(displayStatus).replace(/_/g, " ").toUpperCase()}
                              </Badge>
                            </div>

                            <div className="mt-3 text-sm grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-muted-foreground">Date</div>
                                <div>{safeDate(booking.bookingDate ?? booking.date)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Amount</div>
                                <div>{safeCurrency(booking.totalAmount ?? booking.amount)}</div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <div className="text-xs text-muted-foreground mb-1">Change Status</div>
                              <Select
                                value={displayStatus}
                                onValueChange={(s: Status) => handleChangeStatus(booking.id, s)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <SelectTrigger className="w-full text-xs h-9">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                  <SelectItem value="refunded">Refunded</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
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
                                      Are you sure you want to delete booking {booking.id || "this booking"}? This cannot be undone.
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
                      );
                    })}
                  </div>
                </>
              )}

              {filteredAndSorted.length > 0 && (
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

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {detailsBooking && (
            
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Full details for booking {detailsBooking.id || "N/A"}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Passenger</div>
                  <div className="font-medium">
                    {detailsBooking.fullName || detailsBooking.passengerDetails?.name || "N/A"}
                  </div>
                  <div className="text-sm">
                    {detailsBooking.idCardNumber || detailsBooking.passengerDetails?.idNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Contact</div>
                  <div className="text-sm">{detailsBooking.email || detailsBooking.passengerDetails?.email || "N/A"}</div>
                  <div className="text-sm">{detailsBooking.momoNumber  || detailsBooking.passengerDetails?.phone || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Route</div>
                  <div className="font-medium">
                    {joinRoute(detailsBooking.startPoint || detailsBooking.origin, detailsBooking.endPoint || detailsBooking.destination)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Agency ID: {detailsBooking.agencyId || detailsBooking.travelAgency?.id || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>{safeDate(detailsBooking.bookingDate || detailsBooking.date)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{safeCurrency(detailsBooking.totalAmount ?? detailsBooking.amount)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>
                    <Badge variant={getBadgeVariant(getDisplayStatus(detailsBooking))} className="text-xs">
                      {String(getDisplayStatus(detailsBooking)).replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Payment</div>
                  <div className="capitalize">
                    {(detailsBooking.paymentMethod || "N/A").toString().replace(/_/g, " ")}
                  </div>
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
                        <Badge key={i} variant="outline" className="text-xs">
                          Seat {i + 1}
                        </Badge>
                      ))
                    ) : Array.isArray(detailsBooking.seatNumbers) && detailsBooking.seatNumbers.length > 0 ? (
                      detailsBooking.seatNumbers.map((s: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {s}
                        </Badge>
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
