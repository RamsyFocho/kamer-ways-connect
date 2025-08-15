import React, { useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockAgencies, Agency } from "@/lib/mock-data";
import { toast } from "sonner"; // or your preferred toast library
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Simulate API with local state for now
const fetchAgencies = async () => {
  // return Promise.resolve(mockAgencies);
  try {
    // Make the GET request to your local API endpoint.
    const response = await fetch(`${backendUrl}/api/agencies`);

    // Check if the response was successful (e.g., status code 200).
    // If not, it throws an error to be caught by the catch block.
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data from the response body.
    const data = await response.json();
    console.log("Agencies: ------");
    console.log(data);
    // Return the fetched data.
    return data;

  } catch (error) {
    // Log any errors that occur during the fetch operation.
    console.error("Failed to fetch agencies:", error);
    
    // Return an empty array or null as a fallback in case of an error.
    return []; 
  }
};


const AdminAgenciesPage: React.FC = () => {
  const queryClient = useQueryClient();
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
  // Always use an array for mapping
  const agencies: Agency[] = Array.isArray(agenciesRaw) ? agenciesRaw : [];

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
      toast.success("Agency created successfully");
      console.log(createdAgency);
      return createdAgency;
    }
    catch (err){
      toast.error("An error occured: "+ err);
      console.error("Error: "+err);
    }
    },
    onSuccess: (data) => {
      // If backend returns a single agency, merge it into the array
      let newData;
      if (Array.isArray(data)) {
        newData = data;
      } else if (data && typeof data === 'object' && data.id) {
        // Add to existing list
        newData = [...agencies, data];
      } else {
        newData = agencies;
      }
      queryClient.setQueryData(["agencies"], newData);
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
                <Input
                  placeholder="contact info"
                  value={newAgency.contactInfo}
                  onChange={(e) =>
                    setNewAgency({ ...newAgency, contactInfo: e.target.value })
                  }
                />
                <Button type="submit" disabled={createMutation.isLoading}>Add</Button>
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
                          <td className="p-2 font-medium">
                            {editingId === agency.id ? (
                              <Input
                                value={editData.contactInfo}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    name: e.target.value,
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
                              agency.description || NaN
                            )}
                          </td>
                          <td className="p-2 space-x-2">
                            {editingId === agency.id ? (
                              <>
                                <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isLoading}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
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
