import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

const AdminUsersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <p>User CRUD UI coming soon...</p>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;
