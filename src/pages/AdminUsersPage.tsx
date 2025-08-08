import React, { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockUsers, User } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Simulate API with local state for now
const fetchUsers = async () => {
  return Promise.resolve(mockUsers);
};

const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'joinDate' | 'totalBookings'>>({ name: '', email: '', phone: '', role: 'customer', preferredLanguage: 'en' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});

  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (user: Omit<User, 'id' | 'joinDate' | 'totalBookings'>) => {
      const newId = 'user-' + (Math.random() * 100000).toFixed(0);
      const newUserObj = { ...user, id: newId, joinDate: new Date().toISOString().split('T')[0], totalBookings: 0 } as User;
      return [...users, newUserObj];
    },
    onSuccess: (data) => queryClient.setQueryData(['users'], data)
  });

  const updateMutation = useMutation({
    mutationFn: async (user: Partial<User> & { id: string }) => {
      return users.map(u => u.id === user.id ? { ...u, ...user } : u);
    },
    onSuccess: (data) => queryClient.setQueryData(['users'], data)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return users.filter(u => u.id !== id);
    },
    onSuccess: (data) => queryClient.setQueryData(['users'], data)
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newUser);
    setNewUser({ name: '', email: '', phone: '', role: 'customer', preferredLanguage: 'en' });
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditData(user);
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
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleCreate}>
                <Input placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
                <Input placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                <Input placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} required />
                <Select onValueChange={value => setNewUser({ ...newUser, role: value as 'customer' | 'admin' })} defaultValue={newUser.role}>
                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={createMutation.isPending} className="md:col-span-3">Add User</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
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
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">{editingId === user.id ? <Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /> : user.name}</td>
                          <td className="p-2">{editingId === user.id ? <Input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} /> : user.email}</td>
                          <td className="p-2">{editingId === user.id ? (
                                <Select onValueChange={value => setEditData({ ...editData, role: value as 'customer' | 'admin' })} defaultValue={editData.role}>
                                    <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                          ) : user.role}</td>
                          <td className="p-2 space-x-2">
                            {editingId === user.id ? (
                              <>
                                <Button size="sm" onClick={handleUpdate} disabled={updateMutation.isPending}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(user.id)}>Delete</Button>
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

export default AdminUsersPage;