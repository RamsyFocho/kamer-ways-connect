import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockRoutes, Route, mockAgencies } from "@/lib/mock-data";
import { AgencySelector } from "@/components/ui/AgencySelector";
import { toast } from "sonner";
import { Menu } from "lucide-react"; // Icon for mobile menu toggle

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Simulate API with local state for now
const fetchRoutes = async (): Promise<Route[]> => {
  // return Promise.resolve(mockRoutes);
  try {
    const response = await fetch(`${backendUrl}/api/viewAllTrips`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched routes/trip:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    return []; // Return an empty array on error
  }
};

const fetchAgencies = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/agencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched agencies:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    return []; // Return an empty array on error
  }
};

const AdminRoutesPage: React.FC = () => {
  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const queryClient = useQueryClient();

  const [newRoute, setNewRoute] = useState({
    agencyId: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: 0,
    busType: "",
    amenities: [],
    availableSeats: 0,
    totalSeats: 0,
    date: "",
    travelAgency: { name: "", id: "" },
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Route>>({});

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
  });
  const { data: agencies = [] } = useQuery({
    queryKey: ["agencies"],
    queryFn: fetchAgencies,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (route: Omit<Route, "id">) => {
      const res = await fetch(`${backendUrl}/api/createTrip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agencyId: route.agencyId,
          origin: route.origin,
          destination: route.destination,
          departureTime: new Date(route.departureTime).toISOString(),
          arrivalTime: new Date(route.arrivalTime).toISOString(),
          price: route.price,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create trip");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routes"] });
      toast.success("Route created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create route");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (route: Partial<Route> & { id: string }) => {
      return routes.map((r) => (r.id === route.id ? { ...r, ...route } : r));
    },
    onSuccess: (data) => queryClient.setQueryData(["routes"], data),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return routes.filter((r) => r.id !== id);
    },
    onSuccess: (data) => queryClient.setQueryData(["routes"], data),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newRoute);
    setNewRoute({
      agencyId: "",
      origin: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      price: 0,
      busType: "",
      amenities: [],
      availableSeats: 0,
      totalSeats: 0,
      date: "",
      travelAgency: { name: "", id: "" },
    });
  };

  const handleEdit = (route: Route) => {
    setEditingId(route.id);
    setEditData(route);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ ...editData, id: editingId });
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar
          mobileOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1">
          {/* Header with mobile menu button */}
          <header className="md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 p-4 border-b flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
            <h1 className="text-xl font-bold ml-4">Manage Trips</h1>
          </header>

          <div className="p-4 md:p-8">
            <h2 className="hidden md:block text-2xl font-bold mb-4">
              Manage Trips
            </h2>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Route</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  onSubmit={handleCreate}
                >
                  <AgencySelector
                    onSelect={(agencyId) => {
                      setNewRoute({ ...newRoute, agencyId });
                      console.log(agencyId);
                    }}
                  />

                  <Input
                    placeholder="From"
                    value={newRoute.origin}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, origin: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="destination"
                    value={newRoute.destination}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, destination: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={newRoute.price}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        price: Number(e.target.value),
                      })
                    }
                    required
                  />
                  <Input
                    placeholder="Departure Time"
                    type="datetime-local"
                    value={newRoute.departureTime}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        departureTime: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    placeholder="Arrival Time"
                    type="datetime-local"
                    value={newRoute.arrivalTime}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, arrivalTime: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Duration"
                    value={newRoute.duration}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, duration: e.target.value })
                    }
                    required
                  />
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="md:col-span-3"
                  >
                    Add Route
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Routes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {/* DESKTOP: Table View (hidden on mobile) */}
                    <div className="overflow-x-auto hidden md:block">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Origin</th>
                            <th className="p-2 text-left">Destination</th>
                            <th className="p-2 text-left">Price</th>
                            <th className="p-2 text-left">Agency</th>
                            <th className="p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {routes.map((route) => (
                            <tr key={route.id} className="border-b">
                              <td className="p-2">
                                {editingId === route.id ? (
                                  <Input
                                    value={editData.origin}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        origin: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  route.origin
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === route.id ? (
                                  <Input
                                    value={editData.destination}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        destination: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  route.destination
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === route.id ? (
                                  <Input
                                    type="number"
                                    value={editData.price}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        price: Number(e.target.value),
                                      })
                                    }
                                  />
                                ) : (
                                  route.price
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === route.id ? (
                                  <AgencySelector
                                    onSelect={(agencyId) =>
                                      setEditData({ ...editData, agencyId })
                                    }
                                  />
                                ) : (
                                  // agencies.find((a) => a.id === route.agencyId) ?.name
                                  route.travelAgency.name
                                )}
                              </td>
                              <td className="p-2 space-x-2">
                                {editingId === route.id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={handleUpdate}
                                      disabled={updateMutation.isPending}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingId(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(route)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        deleteMutation.mutate(route.id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* MOBILE: Card View (hidden on desktop) */}
                    <div className="md:hidden space-y-4">
                      {routes.map((route) => (
                        <Card key={route.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {route.origin} → {route.destination}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {route.travelAgency.name}
                              </p>
                              <p className="text-sm mt-1">${route.price}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Departs:{" "}
                                {new Date(route.departureTime).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Arrives:{" "}
                                {new Date(route.arrivalTime).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              {editingId === route.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={handleUpdate}
                                    disabled={updateMutation.isPending}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(route)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      deleteMutation.mutate(route.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Edit form for mobile (shown when editing) */}
                          {editingId === route.id && (
                            <div className="mt-4 space-y-2">
                              <Input
                                placeholder="From"
                                value={editData.origin || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    origin: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="To"
                                value={editData.destination || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    destination: e.target.value,
                                  })
                                }
                              />
                              <Input
                                placeholder="Price"
                                type="number"
                                value={editData.price || 0}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    price: Number(e.target.value),
                                  })
                                }
                              />
                              <AgencySelector
                                onSelect={(agencyId) =>
                                  setEditData({ ...editData, agencyId })
                                }
                              />
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRoutesPage;
