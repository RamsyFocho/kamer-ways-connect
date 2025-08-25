// src/pages/admin/AdminAgenciesPage.tsx

import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Agency } from "@/lib/mock-data";
import { toast } from "sonner";
import { Menu } from "lucide-react"; // Icon for mobile menu toggle
import defaultLogo from '../assets/busAgency/defaultLogo.jpg';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// This fetch function remains the same
const fetchAgencies = async (): Promise<Agency[]> => {
  try {
    const response = await fetch(`${backendUrl}/api/agencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    toast.error("Failed to load agencies.");
    return [];
  }
};

const AdminAgenciesPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [newAgency, setNewAgency] = useState({
    name: "",
    logo: "",
    description: "",
    contactInfo: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    logo: "",
    description: "",
    contactInfo: "",
  });

  const { data: agenciesRaw, isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: fetchAgencies,
  });
  const agencies: Agency[] = Array.isArray(agenciesRaw) ? agenciesRaw : [];

  // Mutations remain largely the same, but using invalidateQueries for robust refetching
  const createMutation = useMutation({
    mutationFn: async (agency: Partial<Agency>) => {
      const res = await fetch(`${backendUrl}/api/createAgency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: agency.name,
          contactInfo: agency.contactInfo,
          logo: agency.logo,
          description: agency.description,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create Agency");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Agency created successfully");
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
    onError: (error: Error) => {
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    // In a real app, this would be a PATCH/PUT request to the backend
    mutationFn: async (agency: Agency) => {
      // Simulating update: Replace with your actual API call
      console.log("Updating agency:", agency);
      return agencies.map((a) =>
        a.id === agency.id ? { ...a, ...agency } : a
      );
    },
    onSuccess: () => {
      toast.success("Agency updated successfully");
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
      setEditingId(null);
    },
    onError: () => toast.error("Failed to update agency."),
  });

  const deleteMutation = useMutation({
    // In a real app, this would be a DELETE request to the backend
    mutationFn: async (id: string) => {
      // Simulating delete: Replace with your actual API call
      console.log("Deleting agency ID:", id);
      return agencies.filter((a) => a.id !== id);
    },
    onSuccess: () => {
      toast.success("Agency deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    },
    onError: () => toast.error("Failed to delete agency."),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newAgency);
    setNewAgency({ name: "", logo: "", description: "", contactInfo: "" });
  };

  const handleEdit = (agency: Agency) => {
    setEditingId(agency.id);
    setEditData({
      name: agency.name,
      logo: agency.logo,
      description: agency.description || "",
      contactInfo: agency.contactInfo || "",
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        ...agencies.find((a) => a.id === editingId)!,
        ...editData,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar component now manages its own visibility */}
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
            <h1 className="text-xl font-bold ml-4">Manage Agencies</h1>
          </header>

          <div className="p-4 md:p-8">
            <h2 className="hidden md:block text-2xl font-bold mb-4">
              Manage Agencies
            </h2>

            {/* Improved responsive form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Agency</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
                  onSubmit={handleCreate}
                >
                  <Input
                    className="lg:col-span-1"
                    placeholder="Agency Name"
                    value={newAgency.name}
                    onChange={(e) =>
                      setNewAgency({ ...newAgency, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    className="lg:col-span-1"
                    placeholder="Contact Info"
                    value={newAgency.contactInfo}
                    onChange={(e) =>
                      setNewAgency({
                        ...newAgency,
                        contactInfo: e.target.value,
                      })
                    }
                  />
                  <Input
                    className="lg:col-span-1"
                    placeholder="Logo URL"
                    value={newAgency.logo}
                    onChange={(e) =>
                      setNewAgency({ ...newAgency, logo: e.target.value })
                    }
                  />
                  <Input
                    className="md:col-span-2 lg:col-span-1"
                    placeholder="Description"
                    value={newAgency.description}
                    onChange={(e) =>
                      setNewAgency({
                        ...newAgency,
                        description: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={createMutation.isPending}
                  >
                    Add Agency
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {/* DESKTOP: Table View (hidden on mobile) */}
                    <div className="overflow-x-auto hidden md:block">
                      <table className="min-w-full text-sm">
                        {/* Table head and body as you had before, with the bug fix */}
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Contact Info</th>
                            <th className="p-2 text-left">Logo</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agencies.map((agency) => (
                            <tr key={agency.id} className="border-b">
                              <td className="p-2 font-medium">
                                {editingId === agency.id ? (
                                  <Input
                                    value={editData.name}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  agency.name
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === agency.id ? (
                                  <Input
                                    value={editData.contactInfo}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        contactInfo: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  agency.contactInfo
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === agency.id ? (
                                  <Input
                                    value={editData.logo}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        logo: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  <img
                                    src={agency.logo || defaultLogo}
                                    alt={agency.name}
                                    className="h-8 w-[4rem] rounded-md object-contain"
                                  />
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === agency.id ? (
                                  <Input
                                    value={editData.description}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  agency.description || "N/A"
                                )}
                              </td>
                              <td className="p-2">
                                {editingId === agency.id ? (
                                  <div className="flex gap-2">
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
                                  </div>
                                ) : (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(agency)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        deleteMutation.mutate(agency.id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE: Card View (hidden on desktop) */}
                    <div className="space-y-4 md:hidden">
                      {agencies.map((agency) => (
                        <Card key={agency.id} className="overflow-hidden">
                          {editingId === agency.id ? (
                            <form onSubmit={handleUpdate}>
                              <CardContent className="p-4 space-y-3">
                                <Input
                                  placeholder="Agency Name"
                                  value={editData.name}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Contact Info"
                                  value={editData.contactInfo}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      contactInfo: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Logo URL"
                                  value={editData.logo }
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      logo: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  placeholder="Description"
                                  value={editData.description}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </CardContent>
                              <div className="bg-muted p-2 flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  type="submit"
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
                              </div>
                            </form>
                          ) : (
                            <>
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={agency.logo || defaultLogo}
                                    alt={agency.name}
                                    className="h-12 w-12 object-cover rounded-md bg-slate-100"
                                  />
                                  <div>
                                    <p className="font-bold text-lg">
                                      {agency.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {agency.contactInfo}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm pt-2 border-t">
                                  {agency.description ||
                                    "No description available."}
                                </p>
                              </CardContent>
                              <div className="bg-muted p-2 flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(agency)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    deleteMutation.mutate(agency.id)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </>
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

export default AdminAgenciesPage;
