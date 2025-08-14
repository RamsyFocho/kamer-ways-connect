import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAgencies, Agency } from "@/lib/mock-data";
import { toast } from "sonner"; // or your preferred toast library

// Simulate API with local state for now
const fetchAgencies = async () => {
  return Promise.resolve(mockAgencies);
};
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminAgenciesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newAgency, setNewAgency] = useState({
    name: "",
    logo: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    logo: "",
    description: "",
  });

  const { data: agencies = [], isLoading } = useQuery({
    queryKey: ["agencies"],
    queryFn: fetchAgencies,
  });

  // Mutations (simulate with local cache)
  const createMutation = useMutation({
    mutationFn: async (agency: Partial<Agency>) => {
      // const newId = 'agency-' + (Math.random() * 100000).toFixed(0);
      // const newAgencyObj = { ...agency, id: newId, rating: 0, reviewCount: 0, established: 2025, fleetSize: 0 } as Agency;
      // return [...agencies, newAgencyObj];

      // fetching from the backend
      try{

      
      const res = await fetch(`${backendUrl}/api/createAgency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: agency.name,
          contactInfo: agency.contactInfo, // make sure `newAgency` has this field
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to create Agency");
        throw new Error(errorData.message || "Failed to create agency");
      }
      const createdAgency = await res.json();
      console.log(createdAgency);
      return createdAgency;
    }
    catch (err){
      toast.error("An error occured: "+ err);
        console.error("Error: "+err);
    }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["agencies"], data);
      toast.success("Agency created successfully");
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (agency: Agency) => {
      return agencies.map((a) =>
        a.id === agency.id ? { ...a, ...agency } : a
      );
    },
    onSuccess: (data) => queryClient.setQueryData(["agencies"], data),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return agencies.filter((a) => a.id !== id);
    },
    onSuccess: (data) => queryClient.setQueryData(["agencies"], data),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate(newAgency);
    setNewAgency({ name: "", logo: "", description: "" });
  };

  const handleEdit = (agency: Agency) => {
    setEditingId(agency.id);
    setEditData({
      name: agency.name,
      logo: agency.logo,
      description: agency.description || "",
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        ...agencies.find((a) => a.id === editingId)!,
        ...editData,
      });
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Manage Agencies</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Agency</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col md:flex-row gap-4"
                onSubmit={handleCreate}
              >
                <Input
                  placeholder="Agency Name"
                  value={newAgency.name}
                  onChange={(e) =>
                    setNewAgency({ ...newAgency, name: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Logo URL"
                  value={newAgency.logo}
                  onChange={(e) =>
                    setNewAgency({ ...newAgency, logo: e.target.value })
                  }
                />
                <Input
                  placeholder="Description"
                  value={newAgency.description}
                  onChange={(e) =>
                    setNewAgency({ ...newAgency, description: e.target.value })
                  }
                />
                <Button type="submit" disabled={createMutation.isLoading}>
                  Add
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
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Name</th>
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
                                src={agency.logo}
                                alt={agency.name}
                                className="h-8 w-8 object-contain"
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
                              agency.description
                            )}
                          </td>
                          <td className="p-2 space-x-2">
                            {editingId === agency.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={handleUpdate}
                                  disabled={updateMutation.isLoading}
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
                              </>
                            )}
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

export default AdminAgenciesPage;
